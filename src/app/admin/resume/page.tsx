import { prisma } from "@/lib/prisma";
import { bricolage_grotesque } from "@/utils/fonts";
import { formatDate } from "@/utils/formatdate";
import ResumeUploadForm from "./components/ResumeUploadForm";
import SetActiveButton from "./components/SetActiveButton";
import DeleteResumeButton from "./components/DeleteResumeButton";

export const dynamic = "force-dynamic";

export default async function AdminResumePage() {
    const resumes = await prisma.resume.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className={`${bricolage_grotesque}`}>
            <div className="mb-8">
                <h1 className="text-3xl font-bold dark:text-white text-black mb-1">
                    Resume
                </h1>
                <p className="text-sm text-gray-500">
                    Upload a new resume PDF. The active one is linked in the navbar.
                </p>
            </div>

            {/* Upload form */}
            <div className="border dark:border-white/10 border-black/10 rounded-xl p-6 mb-8 max-w-lg">
                <h2 className="font-semibold dark:text-white text-black mb-4">
                    Upload New Resume
                </h2>
                <ResumeUploadForm />
            </div>

            {/* History */}
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Upload History
            </h2>

            {resumes.length === 0 ? (
                <p className="text-gray-500 text-sm">No resumes uploaded yet.</p>
            ) : (
                <div className="flex flex-col gap-2 max-w-2xl">
                    {resumes.map((resume) => (
                        <div
                            key={resume.id}
                            className="flex items-center justify-between border dark:border-white/10 border-black/10 rounded-xl px-5 py-4"
                        >
                            <div className="flex-1 min-w-0 pr-4">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold dark:text-white text-black text-sm truncate">
                                        {resume.label}
                                    </span>
                                    {resume.isActive && (
                                        <span className="text-[10px] font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400 px-2 py-0.5 rounded-full">
                                            ACTIVE
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {formatDate(resume.createdAt.toISOString())}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={resume.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 hover:underline px-2 py-1"
                                >
                                    View
                                </a>
                                {!resume.isActive && (
                                    <SetActiveButton resumeId={resume.id} />
                                )}
                                <DeleteResumeButton
                                    resumeId={resume.id}
                                    isActive={resume.isActive}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
