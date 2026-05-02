"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { CheckIcon } from "@radix-ui/react-icons";

export default function SetActiveButton({ resumeId }: { resumeId: string }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSetActive = async () => {
        setIsLoading(true);
        try {
            const res = await axios.patch(`/api/admin/set-active-resume/${resumeId}`);
            if (res.data.success) {
                toast.success("Resume set as active.");
                router.refresh();
            } else {
                toast.error(res.data.message);
            }
        } catch {
            toast.error("Failed to update.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSetActive}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 disabled:opacity-50 transition-colors px-2 py-1 rounded hover:bg-green-50 dark:hover:bg-green-500/10"
        >
            <CheckIcon className="w-3.5 h-3.5" />
            {isLoading ? "Setting…" : "Set Active"}
        </button>
    );
}
