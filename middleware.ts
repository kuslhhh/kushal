import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

        // Extra check: even with a valid session, only the admin email gets through
        if (isAdminRoute && token?.email !== process.env.ADMIN_EMAIL) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Only run middleware logic when there's a token (logged in)
            // If no token, withAuth auto-redirects to /login
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
