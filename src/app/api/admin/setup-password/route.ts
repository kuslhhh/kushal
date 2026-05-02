/**
 * POST /api/admin/setup-password
 *
 * Sets or resets the admin password.
 * Protected by SETUP_SECRET env variable — only someone who knows
 * the secret can call this endpoint.
 *
 * Body: { secret: string, password: string }
 *
 * Usage (curl):
 *   curl -X POST https://your-domain.com/api/admin/setup-password \
 *     -H "Content-Type: application/json" \
 *     -d '{"secret":"<SETUP_SECRET>","password":"<new-password>"}'
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
    try {
        const setupSecret = process.env.SETUP_SECRET;

        if (!setupSecret) {
            return NextResponse.json(
                { error: "SETUP_SECRET is not configured." },
                { status: 500 }
            );
        }

        const body = await req.json();
        const { secret, password } = body as { secret?: string; password?: string };

        if (!secret || secret !== setupSecret) {
            return NextResponse.json(
                { error: "Invalid secret." },
                { status: 401 }
            );
        }

        if (!password || password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters." },
                { status: 400 }
            );
        }

        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) {
            return NextResponse.json(
                { error: "ADMIN_EMAIL is not configured." },
                { status: 500 }
            );
        }

        const hashed = await bcrypt.hash(password, 12);

        const user = await prisma.user.upsert({
            where: { email: adminEmail },
            update: { hashedPassword: hashed },
            create: {
                name: "Admin",
                email: adminEmail,
                hashedPassword: hashed,
            },
        });

        return NextResponse.json({ success: true, email: user.email });
    } catch (error) {
        console.error("[setup-password]", error);
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}
