"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { bricolage_grotesque } from "@/utils/fonts";
import { Cross2Icon, ArrowRightIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
    blogId: string;
    blogTitle: string;
}

const STORAGE_KEY = "latest_blog_dismissed";

export default function LatestBlogBanner({ blogId, blogTitle }: Props) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem(STORAGE_KEY);
        if (dismissed !== blogId) {
            // Small delay so it doesn't pop instantly on page load
            const t = setTimeout(() => setVisible(true), 1200);
            return () => clearTimeout(t);
        }
    }, [blogId]);

    const dismiss = () => {
        sessionStorage.setItem(STORAGE_KEY, blogId);
        setVisible(false);
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className={`fixed bottom-6 right-6 z-50 max-w-sm w-full max-sm:right-3 max-sm:left-3 max-sm:w-auto ${bricolage_grotesque}`}
                >
                    <div className="flex items-start gap-3 bg-white dark:bg-[#1c1c1c] border border-black/10 dark:border-white/10 rounded-2xl shadow-xl px-4 py-3.5">
                        {/* Pulsing dot */}
                        <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                        </span>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                                New blog post
                            </p>
                            <p className="text-sm font-semibold text-black dark:text-white leading-snug line-clamp-2">
                                {blogTitle}
                            </p>
                            <Link
                                href={`/blogs/${blogId}`}
                                onClick={dismiss}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-black dark:text-white mt-2 hover:opacity-60 transition-opacity"
                            >
                                Read post
                                <ArrowRightIcon className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* Dismiss */}
                        <button
                            onClick={dismiss}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0 mt-0.5"
                            aria-label="Dismiss"
                        >
                            <Cross2Icon className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
