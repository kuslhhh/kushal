"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { bricolage_grotesque } from "@/utils/fonts";
import {
    FileTextIcon,
    FileIcon,
    DashboardIcon,
    ExitIcon,
} from "@radix-ui/react-icons";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: DashboardIcon },
    { href: "/admin/blogs", label: "Blogs", icon: FileTextIcon },
    { href: "/admin/resume", label: "Resume", icon: FileIcon },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside
            className={`fixed left-0 top-0 h-full w-56 border-r dark:border-white/10 border-black/10 dark:bg-black bg-white flex flex-col pt-8 pb-6 px-4 z-40 ${bricolage_grotesque}`}
        >
            <div className="mb-8 px-2">
                <span className="text-lg font-bold dark:text-white text-black tracking-tight">
                    Admin Panel
                </span>
                <p className="text-xs text-gray-500 mt-0.5">kuslh.vercel.app</p>
            </div>

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
    );
}
