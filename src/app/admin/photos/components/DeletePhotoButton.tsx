"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { TrashIcon } from "@radix-ui/react-icons";

export default function DeletePhotoButton({ photoId }: { photoId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Delete this photo? This cannot be undone.")) return;
        setIsDeleting(true);
        try {
            const res = await axios.delete(`/api/admin/delete-photo/${photoId}`);
            if (res.data.success) {
                toast.success("Photo deleted.");
                router.refresh();
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Failed to delete.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1 text-[10px] text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors"
        >
            <TrashIcon className="w-3 h-3" />
            {isDeleting ? "…" : "Delete"}
        </button>
    );
}
