"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Pencil1Icon, TrashIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

interface Props {
    id: string;
    url: string;
    title: string | null;
    createdAt: string;
    width: number;
    height: number;
}

export default function PhotoRow({ id, url, title, createdAt, width, height }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(title ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentTitle, setCurrentTitle] = useState(title);
    const router = useRouter();

    const saveTitle = async () => {
        setIsSaving(true);
        try {
            const res = await axios.patch(`/api/admin/update-photo/${id}`, {
                title: editValue,
            });
            if (res.data.success) {
                setCurrentTitle(editValue.trim() || null);
                setIsEditing(false);
                toast.success("Title updated.");
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Failed to update title.");
        } finally {
            setIsSaving(false);
        }
    };

    const cancelEdit = () => {
        setEditValue(currentTitle ?? "");
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!confirm("Delete this photo? This cannot be undone.")) return;
        setIsDeleting(true);
        try {
            const res = await axios.delete(`/api/admin/delete-photo/${id}`);
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
        <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            {/* Thumbnail */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border dark:border-white/10 border-black/10">
                <Image
                    src={url}
                    alt={currentTitle ?? "Photo"}
                    fill
                    className="object-cover"
                    sizes="48px"
                />
            </div>

            {/* Title + date */}
            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") saveTitle();
                            if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                        className="w-full text-sm bg-transparent border-b border-black/20 dark:border-white/20 outline-none dark:text-white text-black pb-0.5"
                        placeholder="Add a title..."
                    />
                ) : (
                    <p className="text-sm font-medium dark:text-white text-black truncate">
                        {currentTitle ?? <span className="text-gray-400 italic">Untitled</span>}
                    </p>
                )}
                <p className="text-xs text-gray-400 mt-0.5">
                    {createdAt} · {width}×{height}
                </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 shrink-0">
                {isEditing ? (
                    <>
                        <button
                            onClick={saveTitle}
                            disabled={isSaving}
                            className="p-1.5 rounded-md text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10 disabled:opacity-50 transition-colors"
                            title="Save"
                        >
                            <CheckIcon className="w-4 h-4" />
                        </button>
                        <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                            title="Cancel"
                        >
                            <Cross2Icon className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="p-1.5 rounded-md text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                        title="Edit title"
                    >
                        <Pencil1Icon className="w-4 h-4" />
                    </button>
                )}
                <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="p-1.5 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 disabled:opacity-50 transition-colors"
                    title="Delete"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
