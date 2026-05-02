"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Cross2Icon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface Photo {
    id: string;
    url: string;
    title: string | null;
    width: number;
    height: number;
}

interface Props {
    photos: Photo[];
}

export default function PhotoGallery({ photos }: Props) {
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    const open = (i: number) => setLightboxIndex(i);
    const close = () => setLightboxIndex(null);

    const prev = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
    }, [photos.length]);

    const next = useCallback(() => {
        setLightboxIndex((i) => (i === null ? null : (i + 1) % photos.length));
    }, [photos.length]);

    useEffect(() => {
        if (lightboxIndex === null) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [lightboxIndex, prev, next]);

    useEffect(() => {
        document.body.style.overflow = lightboxIndex !== null ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [lightboxIndex]);

    const current = lightboxIndex !== null ? photos[lightboxIndex] : null;

    return (
        <>
            {/* ── Pinterest-style masonry ──
                column-width tells the browser "each column should be ~320px wide".
                It fits as many as possible, so on wide screens you get 3-4 columns,
                on mobile you get 2. Every photo renders at its true aspect ratio. */}
            <div
                style={{ columnWidth: "320px", columnGap: "16px" }}
            >
                {photos.map((photo, i) => (
                    <div
                        key={photo.id}
                        className="break-inside-avoid cursor-zoom-in group relative overflow-hidden rounded-2xl mb-4"
                        onClick={() => open(i)}
                    >
                        <Image
                            src={photo.url}
                            alt={photo.title ?? "Photo"}
                            width={photo.width}
                            height={photo.height}
                            className="w-full h-auto block transition-transform duration-500 group-hover:scale-[1.02]"
                            sizes="320px"
                            placeholder="blur"
                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                        />
                        {photo.title && (
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pt-8 pb-3">
                                <p className="text-white text-sm font-medium line-clamp-2">
                                    {photo.title}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Lightbox ── */}
            <AnimatePresence>
                {current && lightboxIndex !== null && (
                    <motion.div
                        key="lightbox"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                        onClick={close}
                    >
                        <button
                            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors z-10"
                            onClick={close}
                            aria-label="Close"
                        >
                            <Cross2Icon className="w-6 h-6" />
                        </button>

                        <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-sm">
                            {lightboxIndex + 1} / {photos.length}
                        </span>

                        <button
                            className="absolute left-4 text-white/60 hover:text-white transition-colors z-10 p-2"
                            onClick={(e) => { e.stopPropagation(); prev(); }}
                            aria-label="Previous"
                        >
                            <ChevronLeftIcon className="w-8 h-8" />
                        </button>

                        <motion.div
                            key={current.id}
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ duration: 0.18 }}
                            className="flex flex-col items-center gap-3 px-16 max-sm:px-10"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={current.url}
                                alt={current.title ?? "Photo"}
                                width={current.width}
                                height={current.height}
                                className="max-w-[85vw] max-h-[85vh] w-auto h-auto object-contain rounded-xl shadow-2xl"
                                sizes="85vw"
                                priority
                            />
                            {current.title && (
                                <p className="text-white/60 text-sm text-center">
                                    {current.title}
                                </p>
                            )}
                        </motion.div>

                        <button
                            className="absolute right-4 text-white/60 hover:text-white transition-colors z-10 p-2"
                            onClick={(e) => { e.stopPropagation(); next(); }}
                            aria-label="Next"
                        >
                            <ChevronRightIcon className="w-8 h-8" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
