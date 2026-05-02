"use client";

import { useState } from "react";
import Link from "next/link";
import { bricolage_grotesque } from "@/utils/fonts";
import { formatDate } from "@/utils/formatdate";
import {
    ArrowLeftIcon,
    DownloadIcon,
    EnterFullScreenIcon,
} from "@radix-ui/react-icons";

interface Props {
    fileUrl: string | null;   // already converted to /preview embed URL
    downloadUrl: string | null; // original /view URL for the download button
    label: string | null;
    updatedAt: string | null;
    siteHost: string;
}

function toFilename(label: string | null): string {
    if (!label) return "Resume.pdf";
    return label.replace(/[^a-zA-Z0-9_\-. ]/g, "").trim().replace(/\s+/g, "_") + ".pdf";
}

export default function ResumeViewer({ fileUrl, downloadUrl, label, updatedAt, siteHost }: Props) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const filename = toFilename(label);

    const toggleFullscreen = () => {
        const el = document.getElementById("resume-iframe-container");
        if (!el) return;
        if (!document.fullscreenElement) {
            el.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    return (
        <div className={`min-h-screen bg-[#0d0d0d] flex flex-col ${bricolage_grotesque}`}>

            {/* ── Heading ── */}
            <div className="w-full max-w-4xl mx-auto px-4 pt-10 pb-6 flex flex-col items-center gap-1">
                <h1 className="text-4xl font-bold text-white tracking-tight">Resume</h1>
                {label && <p className="text-gray-400 text-sm mt-1">{label}</p>}
            </div>

            {/* ── Controls ── */}
            <div className="w-full max-w-4xl mx-auto px-4 flex items-center justify-between mb-4">
                <Link
                    href="/"
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 text-white hover:bg-white/10 transition-colors"
                >
                    <ArrowLeftIcon className="w-4 h-4" />
                </Link>

                <div className="flex items-center gap-2">
                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 text-white hover:bg-white/10 transition-colors"
                            title="Open in Drive"
                        >
                            <DownloadIcon className="w-4 h-4" />
                        </a>
                    )}
                    <button
                        onClick={toggleFullscreen}
                        className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 text-white hover:bg-white/10 transition-colors"
                        title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                    >
                        <EnterFullScreenIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── PDF window ── */}
            <div className="w-full max-w-4xl mx-auto px-4 flex-1 flex flex-col">
                <div
                    id="resume-iframe-container"
                    className="rounded-xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
                    style={{ minHeight: "80vh" }}
                >
                    {/* macOS title bar */}
                    <div className="flex items-center justify-between bg-[#1e1e1e] px-4 py-2.5 border-b border-white/10 shrink-0">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{filename}</span>
                        <div className="w-14" />
                    </div>

                    {fileUrl ? (
                        <iframe
                            src={fileUrl}
                            className="w-full flex-1 bg-white"
                            style={{ minHeight: "75vh", border: "none" }}
                            title="Resume PDF"
                            allow="fullscreen"
                        />
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#1a1a1a] text-gray-500 gap-3 py-20">
                            <DownloadIcon className="w-10 h-10 opacity-30" />
                            <p className="text-sm">No resume uploaded yet.</p>
                            <p className="text-xs text-gray-600">
                                Add one from the{" "}
                                <Link href="/admin/resume" className="text-blue-500 hover:underline">
                                    admin panel
                                </Link>
                                .
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="w-full max-w-4xl mx-auto px-4 py-6 text-center">
                {updatedAt && (
                    <p className="text-xs text-gray-600">
                        Last updated: {formatDate(updatedAt)}
                    </p>
                )}
                <p className="text-xs text-gray-600 mt-1">
                    For the latest version, please visit{" "}
                    <Link href="/resume" className="text-blue-500 hover:underline">
                        {siteHost}/resume
                    </Link>
                </p>
            </div>
        </div>
    );
}
