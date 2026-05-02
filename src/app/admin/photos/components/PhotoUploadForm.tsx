"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { bricolage_grotesque } from "@/utils/fonts";
import Image from "next/image";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/heic"];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export default function PhotoUploadForm() {
    const [title, setTitle] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const fileRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const handleFiles = (selected: FileList | null) => {
        if (!selected) return;
        const valid = Array.from(selected).filter((f) => {
            if (!ACCEPTED.includes(f.type)) { toast.error(`${f.name}: unsupported format`); return false; }
            if (f.size > MAX_SIZE) { toast.error(`${f.name}: must be under 20MB`); return false; }
            return true;
        });
        setFiles(valid);
        setPreviews(valid.map((f) => URL.createObjectURL(f)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (files.length === 0) return toast.error("Select at least one photo.");

        setIsUploading(true);
        setProgress(0);

        let uploaded = 0;
        for (const file of files) {
            const formData = new FormData();
            formData.append("file", file);
            if (title.trim()) formData.append("title", title.trim());

            try {
                await axios.post("/api/admin/upload-photo", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                uploaded++;
                setProgress(Math.round((uploaded / files.length) * 100));
            } catch {
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        if (uploaded > 0) {
            toast.success(`${uploaded} photo${uploaded > 1 ? "s" : ""} uploaded!`);
        }

        setTitle("");
        setFiles([]);
        setPreviews([]);
        if (fileRef.current) fileRef.current.value = "";
        setIsUploading(false);
        setProgress(0);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${bricolage_grotesque}`}>
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="title">Title / Caption (optional)</Label>
                <Input
                    id="title"
                    type="text"
                    placeholder="Golden hour at the ghats..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="dark:bg-black"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="photos">Photos (JPEG, PNG, WebP · max 20MB each)</Label>
                <Input
                    id="photos"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    multiple
                    ref={fileRef}
                    onChange={(e) => handleFiles(e.target.files)}
                    className="dark:bg-black py-2"
                />
            </div>

            {/* Previews */}
            {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {previews.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border dark:border-white/10">
                            <Image src={src} alt="" fill className="object-cover" sizes="120px" />
                        </div>
                    ))}
                </div>
            )}

            {/* Progress bar */}
            {isUploading && (
                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-1.5">
                    <div
                        className="bg-black dark:bg-white h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            <Button type="submit" disabled={isUploading || files.length === 0}>
                {isUploading
                    ? `Uploading… ${progress}%`
                    : `Upload ${files.length > 0 ? `${files.length} photo${files.length > 1 ? "s" : ""}` : ""}`}
            </Button>
        </form>
    );
}
