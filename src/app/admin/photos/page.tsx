import { prisma } from "@/lib/prisma";
import { bricolage_grotesque } from "@/utils/fonts";
import { formatDate } from "@/utils/formatdate";
import PhotoUploadForm from "./components/PhotoUploadForm";
import DeletePhotoButton from "./components/DeletePhotoButton";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
    const photos = await prisma.photo.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className={`${bricolage_grotesque}`}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold dark:text-white text-black mb-1">Photos</h1>
                <p className="text-sm text-gray-500">
                    {photos.length} photo{photos.length !== 1 ? "s" : ""} · Stored on Cloudinary
                </p>
            </div>

            {/* Upload form */}
            <div className="border dark:border-white/10 border-black/10 rounded-xl p-6 mb-10 max-w-lg">
                <h2 className="font-semibold dark:text-white text-black mb-4">Upload Photo</h2>
                <PhotoUploadForm />
            </div>

            {/* Grid */}
            {photos.length > 0 && (
                <>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                        All Photos
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="group relative rounded-xl overflow-hidden"
                            >
                                <Image
                                    src={photo.url}
                                    alt={photo.title ?? "Photo"}
                                    width={photo.width}
                                    height={photo.height}
                                    className="w-full h-auto object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                    <p className="text-white text-xs font-medium line-clamp-2">
                                        {photo.title ?? "Untitled"}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-300 text-[10px]">
                                            {formatDate(photo.createdAt.toISOString())}
                                        </span>
                                        <DeletePhotoButton photoId={photo.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
