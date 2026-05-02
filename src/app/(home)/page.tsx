import { prisma } from "@/lib/prisma";
import HomeClient from "./components/HomeClient";
import LatestBlogBanner from "./components/LatestBlogBanner";

export const dynamic = "force-dynamic";

export default async function Home() {
    const latestBlog = await prisma.blog.findFirst({
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true },
    });

    return (
        <>
            {latestBlog && (
                <LatestBlogBanner
                    blogId={latestBlog.id}
                    blogTitle={latestBlog.title}
                />
            )}
            <HomeClient />
        </>
    );
}
