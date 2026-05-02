"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { TrashIcon } from "@radix-ui/react-icons";

export default function DeleteBlogButton({ blogId }: { blogId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm("Delete this blog post? This cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const res = await axios.delete(`/api/admin/delete-blog/${blogId}`);
            if (res.data.success) {
                toast.success("Blog deleted.");
                router.refresh();
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Failed to delete blog.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 disabled:opacity-50 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10"
        >
            <TrashIcon className="w-3.5 h-3.5" />
            {isDeleting ? "Deleting…" : "Delete"}
        </button>
    );
}
