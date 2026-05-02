import { prisma } from "@/lib/prisma";
import { bricolage_grotesque } from "@/utils/fonts";
import { formatDate } from "@/utils/formatdate";
import PhotoUploadForm from "./components/PhotoUploadForm";
import PhotoRow from "./components/PhotoRow";

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
                    {photos.length} photo{photos.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Upload form */}
            <div className="border dark:border-white/10 border-black/10 rounded-xl p-5 mb-10 max-w-lg w-full">
                <h2 className="font-semibold dark:text-white text-black mb-4">Upload Photos</h2>
                <PhotoUploadForm />
            </div>

            {/* List */}
            {photos.length > 0 && (
                <>
                    <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        All Photos
                    </h2>
                    <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5 border dark:border-white/10 border-black/10 rounded-xl overflow-hidden max-w-3xl w-full">
                        {photos.map((photo) => (
                            <PhotoRow
                                key={photo.id}
                                id={photo.id}
                                url={photo.url}
                                title={photo.title}
                                createdAt={formatDate(photo.createdAt.toISOString())}
                                width={photo.width}
                                height={photo.height}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
