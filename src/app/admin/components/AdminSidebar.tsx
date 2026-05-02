"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { bricolage_grotesque } from "@/utils/fonts";
import {
    FileTextIcon,
    FileIcon,
    DashboardIcon,
    ExitIcon,
    ImageIcon,
    HamburgerMenuIcon,
    Cross2Icon,
} from "@radix-ui/react-icons";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: DashboardIcon },
    { href: "/admin/blogs", label: "Blogs", icon: FileTextIcon },
    { href: "/admin/photos", label: "Photos", icon: ImageIcon },
    { href: "/admin/resume", label: "Resume", icon: FileIcon },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => setOpen(false), [pathname]);

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            const sidebar = document.getElementById("admin-sidebar");
            if (sidebar && !sidebar.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open]);

    return (
        <>
            {/* ── Mobile top bar ── */}
            <div className={`md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-white dark:bg-black border-b border-black/10 dark:border-white/10 ${bricolage_grotesque}`}>
                <span className="font-bold text-black dark:text-white text-sm">Admin Panel</span>
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
                    aria-label="Toggle menu"
                >
                    {open ? <Cross2Icon className="w-5 h-5" /> : <HamburgerMenuIcon className="w-5 h-5" />}
                </button>
            </div>

            {/* ── Backdrop (mobile) ── */}
            {open && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setOpen(false)} />
            )}

            {/* ── Sidebar ── */}
            <aside
                id="admin-sidebar"
                className={`
                    fixed left-0 top-0 h-full z-50 flex flex-col pt-8 pb-6 px-4
                    w-56 border-r dark:border-white/10 border-black/10 dark:bg-black bg-white
                    transition-transform duration-200 ease-in-out
                    ${bricolage_grotesque}
                    md:translate-x-0
                    ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                `}
            >
                {/* Logo — hidden on mobile (shown in top bar instead) */}
                <div className="mb-8 px-2 hidden md:block">
                    <span className="text-lg font-bold dark:text-white text-black tracking-tight">
                        Admin Panel
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">kuslh.vercel.app</p>
                </div>

                {/* Mobile: extra top padding to clear the top bar */}
                <div className="md:hidden h-12" />

                <nav className="flex flex-col gap-1 flex-1">
                    {navItems.map(({ href, label, icon: Icon }) => {
                        const isActive =
                            href === "/admin"
                                ? pathname === "/admin"
                                : pathname.startsWith(href);
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors duration-150 ${
                                    isActive
                                        ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                                }`}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>

                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150"
                >
                    <ExitIcon className="w-4 h-4 shrink-0" />
                    Sign out
                </button>
            </aside>
        </>
    );
}
