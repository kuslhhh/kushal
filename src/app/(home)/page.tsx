import { prisma } from "@/lib/prisma";
import HomeClient from "./components/HomeClient";
import LatestBlogBanner from "./components/LatestBlogBanner";
import LatestPhotoBanner from "./components/LatestPhotoBanner";

export const dynamic = "force-dynamic";

export default async function Home() {
    const [latestBlog, latestPhoto] = await Promise.all([
        prisma.blog.findFirst({
            orderBy: { createdAt: "desc" },
            select: { id: true, title: true },
        }),
        prisma.photo.findFirst({
            orderBy: { createdAt: "desc" },
            select: { id: true, url: true, title: true, width: true, height: true },
        }).catch(() => null),
    ]);

    return (
        <>
            {latestBlog && (
                <LatestBlogBanner
                    blogId={latestBlog.id}
                    blogTitle={latestBlog.title}
                />
            )}
            {latestPhoto && (
                <LatestPhotoBanner photo={latestPhoto} />
            )}
            <HomeClient />
        </>
    );
}
