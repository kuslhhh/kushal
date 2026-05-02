import { prisma } from "@/lib/prisma";
import NavbarResumeLinkClient from "./NavbarResumeLinkClient";

// Server component — fetches active resume URL at request time
export default async function NavbarResumeLink() {
    let href = "/resume"; // always point to the viewer page

    try {
        const activeResume = await prisma.resume.findFirst({
            where: { isActive: true },
            select: { fileUrl: true },
        });
        // fileUrl stored for future use; viewer page handles the actual display
        void activeResume;
    } catch {
        // Table may not exist yet in dev — fail silently
    }

    return <NavbarResumeLinkClient href={href} />;
}
