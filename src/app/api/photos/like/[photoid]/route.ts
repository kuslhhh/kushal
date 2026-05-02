import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Simple rate-limit: one like per IP per photo per hour using a Map in memory.
// Good enough for a personal portfolio — no Redis needed.
const recentLikes = new Map<string, number>();

export async function POST(
    req: NextRequest,
    { params }: { params: { photoid: string } }
) {
    const ip =
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        req.headers.get("x-real-ip") ??
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

    // Clean up old entries every 1000 requests to avoid memory leak
    if (recentLikes.size > 1000) {
        const cutoff = now - 60_000;
        recentLikes.forEach((t, k) => {
            if (t < cutoff) recentLikes.delete(k);
        });
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
