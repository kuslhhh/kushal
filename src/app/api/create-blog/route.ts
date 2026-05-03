import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import { prisma } from '@/lib/prisma'
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import sanitizeHtml from "sanitize-html";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: unknown
}

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        return NextResponse.json(
            { success: false, message: "Unauthorized" },
            { status: 401 }
        );
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const title = formData.get("title");
        const content = formData.get("content");

        if (!file) {
            return NextResponse.json(
                { success: false, message: "File not found!" },
                { status: 400 }
            )
        }

        // Validate file type
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return NextResponse.json(
                { success: false, message: "Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed." },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, message: "File is too large. Maximum size is 10 MB." },
                { status: 400 }
            );
        }

        if (!title) {
            return NextResponse.json(
                { success: false, message: "Title not found!" },
                { status: 400 }
            )
        }

        if (!content) {
            return NextResponse.json(
                { success: false, message: "Content not found!" },
                { status: 400 }
            )
        }

        // Sanitize HTML content to prevent stored XSS
        const sanitizedContent = sanitizeHtml(content.toString(), {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                "img", "h1", "h2", "h3", "h4", "h5", "h6",
                "figure", "figcaption", "iframe", "video", "source",
                "details", "summary", "mark", "del", "ins", "sub", "sup",
            ]),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                img: ["src", "alt", "title", "width", "height", "loading"],
                a: ["href", "name", "target", "rel"],
                iframe: ["src", "width", "height", "frameborder", "allowfullscreen"],
                video: ["src", "controls", "width", "height"],
                source: ["src", "type"],
                "*": ["class", "id", "style"],
            },
            allowedIframeHostnames: ["www.youtube.com", "player.vimeo.com"],
            // Strip <script>, <style>, event handlers, etc.
        });

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "next-cloudinary-uploads" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer)
            }
        )


        await prisma.blog.create({
            data: {
                title: title.toString(),
                content: sanitizedContent,
                author: session?.user?.name as string,
                image_public_id: result.public_id,
                createdAt: new Date()
            }
        })

        return NextResponse.json(
            { success: true, message: "Blog published successfully!" },
            { status: 200 }
        );

    } catch (error) {
        console.error("Blog create error:", error);
        return NextResponse.json(
            { success: false, message: "An unexpected server error occurred." },
            { status: 500 }
        );
    }
}