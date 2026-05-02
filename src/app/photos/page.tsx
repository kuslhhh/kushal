import { prisma } from "@/lib/prisma";
import PhotoGallery from "./components/PhotoGallery";
import { bricolage_grotesque } from "@/utils/fonts";

export const dynamic = "force-dynamic";

export default async function PhotosPage() {
    const photos = await prisma.photo.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, url: true, title: true, width: true, height: true, likes: true },
    });

    return (
        <div className={`min-h-screen dark:bg-black bg-white pt-32 pb-16 px-6 ${bricolage_grotesque}`}>
            <div className="max-w-5xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold dark:text-white text-black tracking-tight">
                        Photography
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        {photos.length} shot{photos.length !== 1 ? "s" : ""} · moments I wanted to keep
                    </p>
                </div>

                {photos.length === 0 ? (
                    <p className="text-gray-500 text-sm">No photos yet.</p>
                ) : (
                    <PhotoGallery photos={photos} />
                )}
            </div>
        </div>
    );
}
