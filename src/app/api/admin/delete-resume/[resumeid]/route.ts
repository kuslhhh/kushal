import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { resumeid: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const resume = await prisma.resume.findUnique({ where: { id: params.resumeid } });

        if (!resume) {
            return NextResponse.json({ success: false, message: "Resume not found" }, { status: 404 });
        }

        if (resume.isActive) {
            return NextResponse.json(
                { success: false, message: "Cannot delete the active resume" },
                { status: 400 }
            );
        }

        await prisma.resume.delete({ where: { id: params.resumeid } });

        return NextResponse.json({ success: true, message: "Resume deleted" });
    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        return NextResponse.json({ success: false, message: `Server error: ${message}` }, { status: 500 });
    }
}
