"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { bricolage_grotesque } from "@/utils/fonts";
import { Cross2Icon, ArrowRightIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "framer-motion";

interface Photo {
    id: string;
    url: string;
    title: string | null;
    width: number;
    height: number;
}

const STORAGE_KEY = "latest_photo_dismissed";

export default function LatestPhotoBanner({ photo }: { photo: Photo }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const dismissed = sessionStorage.getItem(STORAGE_KEY);
        if (dismissed !== photo.id) {
            const t = setTimeout(() => setVisible(true), 2000);
            return () => clearTimeout(t);
        }
    }, [photo.id]);

    const dismiss = () => {
        sessionStorage.setItem(STORAGE_KEY, photo.id);
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
                    className={`fixed bottom-6 left-6 z-50 w-72 max-sm:left-3 max-sm:right-3 max-sm:w-auto ${bricolage_grotesque}`}
                >
                    <div className="bg-white dark:bg-[#1c1c1c] border border-black/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">

                        {/* ── Desktop: stacked (thumbnail on top, text below) ── */}
                        <div className="max-sm:hidden">
                            <Link href="/photos" onClick={dismiss} className="block relative w-full h-36 overflow-hidden">
                                <Image
                                    src={photo.url}
                                    alt={photo.title ?? "Latest photo"}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                    sizes="288px"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            </Link>
                            <div className="flex items-start gap-3 px-4 py-3">
                                <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500" />
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">New photo</p>
                                    <p className="text-sm font-semibold text-black dark:text-white leading-snug line-clamp-1">
                                        {photo.title ?? "Check out my latest shot"}
                                    </p>
                                    <Link
                                        href="/photos"
                                        onClick={dismiss}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-black dark:text-white mt-1.5 hover:opacity-60 transition-opacity"
                                    >
                                        View gallery <ArrowRightIcon className="w-3 h-3" />
                                    </Link>
                                </div>
                                <button
                                    onClick={dismiss}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0 mt-0.5"
                                    aria-label="Dismiss"
                                >
                                    <Cross2Icon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* ── Mobile: side by side (thumbnail left, text right) ── */}
                        <div className="hidden max-sm:flex items-stretch">
                            {/* Square thumbnail on the left */}
                            <Link
                                href="/photos"
                                onClick={dismiss}
                                className="relative w-20 shrink-0 overflow-hidden rounded-l-2xl"
                            >
                                <Image
                                    src={photo.url}
                                    alt={photo.title ?? "Latest photo"}
                                    fill
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                    sizes="80px"
                                />
                            </Link>

                            {/* Text on the right */}
                            <div className="flex-1 flex items-start gap-2 px-3 py-3 min-w-0">
                                <span className="relative flex h-2.5 w-2.5 shrink-0 mt-1">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-purple-500" />
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">New photo</p>
                                    <p className="text-sm font-semibold text-black dark:text-white leading-snug line-clamp-1">
                                        {photo.title ?? "Check out my latest shot"}
                                    </p>
                                    <Link
                                        href="/photos"
                                        onClick={dismiss}
                                        className="inline-flex items-center gap-1 text-xs font-semibold text-black dark:text-white mt-1.5 hover:opacity-60 transition-opacity"
                                    >
                                        View gallery <ArrowRightIcon className="w-3 h-3" />
                                    </Link>
                                </div>
                                <button
                                    onClick={dismiss}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors shrink-0 mt-0.5"
                                    aria-label="Dismiss"
                                >
                                    <Cross2Icon className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
