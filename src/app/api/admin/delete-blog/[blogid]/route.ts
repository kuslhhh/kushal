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
    { params }: { params: { blogid: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const blog = await prisma.blog.findUnique({
            where: { id: params.blogid },
        });

        if (!blog) {
            return NextResponse.json(
                { success: false, message: "Blog not found" },
                { status: 404 }
            );
        }

        // Delete image from Cloudinary
        if (blog.image_public_id) {
            await cloudinary.uploader.destroy(blog.image_public_id);
        }

        await prisma.blog.delete({ where: { id: params.blogid } });

        return NextResponse.json(
            { success: true, message: "Blog deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: `Server error: ${error}` },
            { status: 500 }
        );
    }
}
