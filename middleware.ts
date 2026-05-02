import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

        if (isAdminRoute && token?.email !== process.env.ADMIN_EMAIL) {
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // Pass the pathname as a header so server components can read it
        const res = NextResponse.next();
        res.headers.set("x-pathname", req.nextUrl.pathname);
        return res;
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
