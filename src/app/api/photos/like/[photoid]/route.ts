import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple rate-limit: one like per IP per photo per 60 seconds using a Map in memory.
// NOTE: In serverless environments (Vercel), this only protects within a single
// instance. For stronger guarantees, migrate to a distributed store like Upstash Redis.
const recentLikes = new Map<string, number>();
const MAX_MAP_SIZE = 5000;

export async function POST(
    req: NextRequest,
    { params }: { params: { photoid: string } }
) {
    // Use x-real-ip first (more reliable, set by reverse proxy),
    // fall back to x-forwarded-for. Reject completely unknown IPs.
    const ip =
        req.headers.get("x-real-ip")?.trim() ||
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "unknown";

    const key = `${ip}:${params.photoid}`;
    const lastLike = recentLikes.get(key) ?? 0;
    const now = Date.now();

    // Allow one like per IP per photo per 60 seconds
    if (now - lastLike < 60_000) {
        return NextResponse.json(
            { success: false, message: "Too many likes" },
            { status: 429 }
        );
    }

    recentLikes.set(key, now);

    // Proactively prune expired entries to prevent unbounded memory growth.
    // Clean up when the map exceeds a safe threshold.
    if (recentLikes.size > MAX_MAP_SIZE) {
        const cutoff = now - 60_000;
        recentLikes.forEach((t, k) => {
            if (t < cutoff) recentLikes.delete(k);
        });
        // If still too large after pruning (active abuse), drop oldest half
        if (recentLikes.size > MAX_MAP_SIZE) {
            const entries = Array.from(recentLikes.entries()).sort((a, b) => a[1] - b[1]);
            const toRemove = Math.floor(entries.length / 2);
            for (let i = 0; i < toRemove; i++) {
                recentLikes.delete(entries[i][0]);
            }
        }
    }

    try {
        const photo = await prisma.photo.update({
            where: { id: params.photoid },
            data: { likes: { increment: 1 } },
            select: { likes: true },
        });

        return NextResponse.json({ success: true, likes: photo.likes });
    } catch {
        return NextResponse.json(
            { success: false, message: "Photo not found" },
            { status: 404 }
        );
    }
}
