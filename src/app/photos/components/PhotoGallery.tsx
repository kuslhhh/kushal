"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Cross2Icon, ChevronLeftIcon, ChevronRightIcon, HeartIcon, HeartFilledIcon } from "@radix-ui/react-icons";
import axios from "axios";

interface Photo {
    id: string;
    url: string;
    title: string | null;
    width: number;
    height: number;
    likes: number;
}

interface Props {
    photos: Photo[];
}

const LIKED_KEY = "liked_photos"; // localStorage key

function getLikedSet(): Set<string> {
    if (typeof window === "undefined") return new Set();
    try {
        return new Set<string>(JSON.parse(localStorage.getItem(LIKED_KEY) ?? "[]") as string[]);
    } catch {
        return new Set<string>();
    }
}

function saveLikedSet(set: Set<string>) {
    localStorage.setItem(LIKED_KEY, JSON.stringify(Array.from(set)));
}

// Per-photo like state managed independently
function usePhotoLike(photoId: string, initialLikes: number) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setLiked(getLikedSet().has(photoId));
    }, [photoId]);

    const toggleLike = useCallback(async () => {
        const likedSet = getLikedSet();

        if (liked) {
            // Unlike — optimistic
            likedSet.delete(photoId);
            saveLikedSet(likedSet);
            setLiked(false);
            setLikes((l) => Math.max(0, l - 1));
            return;
        }

        // Like — optimistic
        likedSet.add(photoId);
        saveLikedSet(likedSet);
        setLiked(true);
        setLikes((l) => l + 1);
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 600);

        try {
            const res = await axios.post(`/api/photos/like/${photoId}`);
            if (res.data.success) {
                setLikes(res.data.likes);
            }
        } catch {
            // Server rejected (rate limit etc.) — revert
            likedSet.delete(photoId);
            saveLikedSet(likedSet);
            setLiked(false);
            setLikes((l) => Math.max(0, l - 1));
        }
    }, [liked, photoId]);

    return { likes, liked, isAnimating, toggleLike };
}

// Individual card with its own like state
function PhotoCard({
    photo,
    index,
    onOpen,
}: {
    photo: Photo;
    index: number;
    onOpen: (i: number) => void;
}) {
    const { likes, liked, isAnimating, toggleLike } = usePhotoLike(photo.id, photo.likes);
    const lastTap = useRef(0);
    const [heartBurst, setHeartBurst] = useState(false);

    const handleDoubleClick = () => {
        if (!liked) {
            toggleLike();
        }
        setHeartBurst(true);
        setTimeout(() => setHeartBurst(false), 800);
    };

    // Mobile double-tap
    const handleTouchEnd = () => {
        const now = Date.now();
        if (now - lastTap.current < 300) {
            handleDoubleClick();
        }
        lastTap.current = now;
    };

    return (
        <div
            className="break-inside-avoid group relative overflow-hidden rounded-2xl mb-4 cursor-pointer select-none"
            onDoubleClick={handleDoubleClick}
            onTouchEnd={handleTouchEnd}
            onClick={() => onOpen(index)}
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

            {/* Bottom bar: title + like */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pt-8 pb-3 flex items-end justify-between gap-2">
                {photo.title && (
                    <p className="text-white text-sm font-medium line-clamp-1 flex-1">
                        {photo.title}
                    </p>
                )}
                {/* Like button — stop propagation so it doesn't open lightbox */}
                <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(); }}
                    className="flex items-center gap-1 shrink-0 group/like"
                    aria-label={liked ? "Unlike" : "Like"}
                >
                    <motion.div
                        animate={isAnimating ? { scale: [1, 1.5, 1] } : {}}
                        transition={{ duration: 0.3 }}
                    >
                        {liked ? (
                            <HeartFilledIcon className="w-4 h-4 text-red-500" />
                        ) : (
                            <HeartIcon className="w-4 h-4 text-white/80 group-hover/like:text-white" />
                        )}
                    </motion.div>
                    {likes > 0 && (
                        <span className="text-white/80 text-xs font-medium">{likes}</span>
                    )}
                </button>
            </div>

            {/* Double-click heart burst */}
            <AnimatePresence>
                {heartBurst && (
                    <motion.div
                        key="burst"
                        initial={{ opacity: 1, scale: 0.5 }}
                        animate={{ opacity: 0, scale: 2 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <HeartFilledIcon className="w-16 h-16 text-white drop-shadow-lg" />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
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
            {/* ── Masonry grid ── */}
            <div style={{ columnWidth: "320px", columnGap: "16px" }}>
                {photos.map((photo, i) => (
                    <PhotoCard key={photo.id} photo={photo} index={i} onOpen={open} />
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
                        >
                            <Cross2Icon className="w-6 h-6" />
                        </button>

                        <span className="absolute top-5 left-1/2 -translate-x-1/2 text-white/40 text-sm">
                            {lightboxIndex + 1} / {photos.length}
                        </span>

                        <button
                            className="absolute left-4 text-white/60 hover:text-white transition-colors z-10 p-2"
                            onClick={(e) => { e.stopPropagation(); prev(); }}
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
                                <p className="text-white/60 text-sm text-center">{current.title}</p>
                            )}
                        </motion.div>

                        <button
                            className="absolute right-4 text-white/60 hover:text-white transition-colors z-10 p-2"
                            onClick={(e) => { e.stopPropagation(); next(); }}
                        >
                            <ChevronRightIcon className="w-8 h-8" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
