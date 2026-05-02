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

    // Server-side guard — belt-and-suspenders alongside middleware
    if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex dark:bg-black bg-white">
            <AdminSidebar />
            <main className="flex-1 ml-56 p-8 mt-4">
                {children}
            </main>
        </div>
    );
}
