import { prisma } from "@/lib/prisma";
import ResumeViewer from "./components/ResumeViewer";

export const dynamic = "force-dynamic";

// Convert /preview back to /view for the download button
function toViewUrl(embedUrl: string): string {
    return embedUrl.replace("/preview", "/view");
}

export default async function ResumePage() {
    const activeResume = await prisma.resume.findFirst({
        where: { isActive: true },
        select: { fileUrl: true, label: true, createdAt: true },
    });

    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const siteHost = siteUrl.replace(/^https?:\/\//, "");

    return (
        <ResumeViewer
            fileUrl={activeResume?.fileUrl ?? null}
            downloadUrl={activeResume ? toViewUrl(activeResume.fileUrl) : null}
            label={activeResume?.label ?? null}
            updatedAt={activeResume?.createdAt?.toISOString() ?? null}
            siteHost={siteHost}
        />
    );
}
