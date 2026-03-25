import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const PUBLIC = [
	"/",
	"/signinfail",
	"/api/auth/signin/google",
	"/api/auth/callback/google",
	"/api/auth/signout",
	"/api/auth/session",
];

export default auth((req) => {
	const { pathname } = req.nextUrl;
	const isLoggedIn = !!req.auth?.user;
	const isPermittedAdmin = req.auth?.user?.isPermittedAdmin === true;
	const isApi = pathname.startsWith("/api");

	const isPublic =
		PUBLIC.includes(pathname) || pathname.startsWith("/api/auth");

	const isServerAction =
		req.method === "POST" &&
		req.headers.get("accept")?.includes("text/x-component");

	if (isServerAction) {
		return NextResponse.next();
	}

	if (isPublic) {
		return NextResponse.next();
	}

	if (!isLoggedIn) {
		if (isApi) {
			return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
				status: 401,
				headers: { "content-type": "application/json" },
			});
		}

		return NextResponse.redirect(new URL("/", req.url));
	}

	if (!isPermittedAdmin) {
		if (isApi) {
			return new NextResponse(
				JSON.stringify({ error: "Forbidden: admin access only" }),
				{ status: 403, headers: { "content-type": "application/json" } },
			);
		}

		return NextResponse.redirect(
			new URL("/signinfail?error=not_allowed", req.url),
		);
	}

	return NextResponse.next();
});

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
