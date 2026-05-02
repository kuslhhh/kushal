"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { TrashIcon } from "@radix-ui/react-icons";

interface Props {
    resumeId: string;
    isActive: boolean;
}

export default function DeleteResumeButton({ resumeId, isActive }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (isActive) {
            toast.error("Set another resume as active before deleting this one.");
            return;
        }
        if (!confirm("Delete this resume entry? This cannot be undone.")) return;

        setIsDeleting(true);
        try {
            const res = await axios.delete(`/api/admin/delete-resume/${resumeId}`);
            if (res.data.success) {
                toast.success("Resume deleted.");
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
            disabled={isDeleting || isActive}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 disabled:opacity-30 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-500/10"
            title={isActive ? "Cannot delete the active resume" : "Delete"}
        >
            <TrashIcon className="w-3.5 h-3.5" />
            {isDeleting ? "Deleting…" : "Delete"}
        </button>
    );
}
