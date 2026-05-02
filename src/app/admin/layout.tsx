import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen dark:bg-black bg-white">
            <AdminSidebar />
            {/* Desktop: offset by sidebar width. Mobile: no offset, sidebar overlays */}
            <main className="md:ml-56 p-4 md:p-8 pt-16 md:pt-8">
                {children}
            </main>
        </div>
    );
}
