import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(
    req: NextRequest,
    { params }: { params: { photoid: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const photo = await prisma.photo.findUnique({ where: { id: params.photoid } });
        if (!photo) {
            return NextResponse.json({ success: false, message: "Photo not found" }, { status: 404 });
        }

        await cloudinary.uploader.destroy(photo.public_id, { resource_type: "image" });
        await prisma.photo.delete({ where: { id: params.photoid } });

        return NextResponse.json({ success: true, message: "Photo deleted" });
    } catch (error) {
        console.error("Photo delete error:", error);
        return NextResponse.json({ success: false, message: "An unexpected server error occurred." }, { status: 500 });
    }
}
