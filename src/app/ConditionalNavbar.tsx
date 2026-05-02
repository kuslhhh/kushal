import { headers } from "next/headers";
import Navbar from "@/components/Navbar";
import NavbarResumeLink from "@/components/NavbarResumeLink";

// Server component — middleware sets x-pathname on every request.
// If we're on an /admin route, the header will be present → hide navbar.
export default async function ConditionalNavbar() {
    const pathname = headers().get("x-pathname") ?? "";

    if (pathname.startsWith("/admin")) return null;

    return <Navbar resumeSlot={<NavbarResumeLink />} />;
}
