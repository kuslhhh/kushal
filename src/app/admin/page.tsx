import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { bricolage_grotesque } from "@/utils/fonts";
import { FileTextIcon, FileIcon, PlusIcon } from "@radix-ui/react-icons";

export default async function AdminDashboard() {
    const [blogCount, activeResume] = await Promise.all([
        prisma.blog.count().catch(() => 0),
        prisma.resume.findFirst({ where: { isActive: true } }).catch(() => null),
    ]);

    return (
        <div className={`${bricolage_grotesque}`}>
            <h1 className="text-3xl font-bold dark:text-white text-black mb-1">
                Dashboard
            </h1>
            <p className="text-sm text-gray-500 mb-8">
                Welcome back. Here&apos;s what&apos;s going on.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mb-10">
                <div className="border dark:border-white/10 border-black/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <FileTextIcon className="w-4 h-4" />
                        Total Blogs
                    </div>
                    <p className="text-4xl font-bold dark:text-white text-black">
                        {blogCount}
                    </p>
                </div>

                <div className="border dark:border-white/10 border-black/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                        <FileIcon className="w-4 h-4" />
                        Active Resume
                    </div>
                    <p className="text-sm font-semibold dark:text-white text-black mt-1 truncate">
                        {activeResume ? activeResume.label : "None uploaded"}
                    </p>
                </div>
            </div>

            {/* Quick actions */}
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Quick Actions
            </h2>
            <div className="flex gap-3 flex-wrap">
                <Link
                    href="/admin/blogs/new"
                    className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                    <PlusIcon className="w-4 h-4" />
                    New Blog Post
                </Link>
                <Link
                    href="/admin/resume"
                    className="flex items-center gap-2 border dark:border-white/20 border-black/20 px-4 py-2.5 rounded-lg text-sm font-semibold dark:text-white text-black hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                    <FileIcon className="w-4 h-4" />
                    Upload Resume
                </Link>
            </div>
        </div>
    );
}
