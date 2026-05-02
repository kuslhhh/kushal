"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { bricolage_grotesque } from "@/utils/fonts";

export default function ResumeUploadForm() {
    const [label, setLabel] = useState("");
    const [driveUrl, setDriveUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!label.trim()) return toast.error("Please add a label.");
        if (!driveUrl.trim()) return toast.error("Please paste a Google Drive URL.");
        if (!driveUrl.includes("drive.google.com")) {
            return toast.error("URL must be a Google Drive link.");
        }

        setIsSubmitting(true);
        try {
            const res = await axios.post("/api/admin/upload-resume", {
                label: label.trim(),
                driveUrl: driveUrl.trim(),
            });

            if (res.data.success) {
                toast.success("Resume saved and set as active!");
                setLabel("");
                setDriveUrl("");
                router.refresh();
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Failed to save. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`flex flex-col gap-4 ${bricolage_grotesque}`}>
            <div className="flex flex-col gap-1.5">
                <Label htmlFor="label">Label</Label>
                <Input
                    id="label"
                    type="text"
                    placeholder='e.g. "Resume — May 2026"'
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="dark:bg-black"
                />
            </div>

            <div className="flex flex-col gap-1.5">
                <Label htmlFor="driveUrl">Google Drive Share URL</Label>
                <Input
                    id="driveUrl"
                    type="url"
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    className="dark:bg-black"
                />
                <p className="text-xs text-gray-500">
                    In Drive: right-click the PDF → Share → Anyone with the link → Copy link
                </p>
            </div>

            <Button type="submit" disabled={isSubmitting} className="mt-1">
                {isSubmitting ? "Saving…" : "Save & Set Active"}
            </Button>
        </form>
    );
}
