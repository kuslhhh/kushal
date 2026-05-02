import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { bricolage_grotesque } from "@/utils/fonts";
import { formatDate } from "@/utils/formatdate";
import { PlusIcon } from "@radix-ui/react-icons";
import DeleteBlogButton from "./components/DeleteBlogButton";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
    const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            author: true,
            createdAt: true,
        },
    });

    return (
        <div className={`${bricolage_grotesque}`}>
            <div className="flex items-start max-sm:flex-col max-sm:gap-4 justify-between mb-8">
                <div>
                    <h1 className="text-3xl max-sm:text-2xl font-bold dark:text-white text-black mb-1">
                        Blogs
                    </h1>
                    <p className="text-sm text-gray-500">
                        {blogs.length} post{blogs.length !== 1 ? "s" : ""} total
                    </p>
                </div>
                <Link
                    href="/admin/blogs/new"
                    className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-80 transition-opacity shrink-0"
                >
                    <PlusIcon className="w-4 h-4" />
                    New Post
                </Link>
            </div>

            {blogs.length === 0 ? (
                <div className="border dark:border-white/10 border-black/10 rounded-xl p-10 text-center text-gray-500">
                    No blogs yet.{" "}
                    <Link href="/admin/blogs/new" className="underline">
                        Write your first post.
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    {blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="flex items-center justify-between border dark:border-white/10 border-black/10 rounded-xl px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors gap-3"
                        >
                            <div className="flex-1 min-w-0">
                                <Link href={`/blogs/${blog.id}`} target="_blank">
                                    <h2 className="font-semibold dark:text-white text-black truncate hover:underline text-sm">
                                        {blog.title}
                                    </h2>
                                </Link>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {formatDate(blog.createdAt.toISOString())}
                                </p>
                            </div>
                            <DeleteBlogButton blogId={blog.id} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
