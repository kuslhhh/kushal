import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: NextRequest,
    { params }: { params: { resumeid: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        await prisma.$transaction([
            prisma.resume.updateMany({ data: { isActive: false } }),
            prisma.resume.update({
                where: { id: params.resumeid },
                data: { isActive: true },
            }),
        ]);

        return NextResponse.json(
            { success: true, message: "Resume set as active" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Set active resume error:", error);
        return NextResponse.json(
            { success: false, message: "An unexpected server error occurred." },
            { status: 500 }
        );
    }
}
