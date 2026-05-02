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

interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string;
    width: number;
    height: number;
    [key: string]: unknown;
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const title = (formData.get("title") as string | null)?.trim() || null;

        if (!file) {
            return NextResponse.json({ success: false, message: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "portfolio-photos",
                    resource_type: "image",
                    quality: "auto:good",
                    fetch_format: "auto",
                    // Resize to max 2400px on longest side — keeps quality, saves storage
                    transformation: [{ width: 2400, height: 2400, crop: "limit" }],
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            ).end(buffer);
        });

        const photo = await prisma.photo.create({
            data: {
                title,
                public_id: result.public_id,
                url: result.secure_url,
                width: result.width,
                height: result.height,
            },
        });

        return NextResponse.json({ success: true, message: "Photo uploaded", photo });
    } catch (error) {
        const message = error instanceof Error ? error.message : JSON.stringify(error);
        console.error("Photo upload error:", error);
        return NextResponse.json({ success: false, message: `Server error: ${message}` }, { status: 500 });
    }
}
