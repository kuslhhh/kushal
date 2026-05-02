import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Converts any Google Drive share URL to an embeddable preview URL
function toEmbedUrl(driveUrl: string): string {
    // Handle both formats:
    // https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // https://drive.google.com/open?id=FILE_ID
    const match =
        driveUrl.match(/\/file\/d\/([^/]+)/) ||
        driveUrl.match(/[?&]id=([^&]+)/);

    if (match) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
    }

    // Already an embed/preview URL — return as-is
    return driveUrl;
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { label, driveUrl } = await req.json();

        if (!label?.trim()) {
            return NextResponse.json({ success: false, message: "Label is required" }, { status: 400 });
        }
        if (!driveUrl?.trim()) {
            return NextResponse.json({ success: false, message: "Drive URL is required" }, { status: 400 });
        }
        if (!driveUrl.includes("drive.google.com")) {
            return NextResponse.json({ success: false, message: "Must be a Google Drive URL" }, { status: 400 });
        }

        const embedUrl = toEmbedUrl(driveUrl.trim());

        await prisma.$transaction([
            prisma.resume.updateMany({ data: { isActive: false } }),
            prisma.resume.create({
                data: {
                    label: label.trim(),
                    fileUrl: embedUrl,
                    isActive: true,
                },
            }),
        ]);

        return NextResponse.json({ success: true, message: "Resume saved and set as active" });
    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        return NextResponse.json({ success: false, message: `Server error: ${message}` }, { status: 500 });
    }
}
