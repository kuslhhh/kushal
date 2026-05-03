import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { photoid: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { title } = await req.json();

        const photo = await prisma.photo.update({
            where: { id: params.photoid },
            data: { title: title?.trim() || null },
        });

        return NextResponse.json({ success: true, photo });
    } catch (error) {
        console.error("Photo update error:", error);
        return NextResponse.json({ success: false, message: "An unexpected server error occurred." }, { status: 500 });
    }
}
