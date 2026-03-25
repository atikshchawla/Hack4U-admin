import NextAuth from "next-auth";
import authConfig from "./auth.config";
import prisma from "@/lib/prisma";

const isPermittedAdmin = async (email) => {
	const normalizedEmail = (email || "").trim().toLowerCase();
	if (!normalizedEmail) return false;

	const allowed = await prisma.admin.findFirst({
		where: { email: normalizedEmail },
		select: { id: true },
	});

	return !!allowed;
};

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	callbacks: {
		...authConfig.callbacks,
		async signIn({ user, account, profile }) {
			if (!account || account.provider !== "google") {
				return false;
			}

			const email = user?.email || profile?.email;
			const allowed = await isPermittedAdmin(email);

			if (!allowed) {
				console.log("Blocked login:", email);
			}

			return allowed;
		},
		async jwt({ token }) {
			if (!token?.email) {
				token.isPermittedAdmin = false;
				return token;
			}

			token.isPermittedAdmin = await isPermittedAdmin(token.email);

			return token;
		},
		async session({ session, token }) {
			if (session?.user) {
				session.user.isPermittedAdmin = token.isPermittedAdmin === true;
			}

			return session;
		},
		authorized: async ({ auth }) => {
			return !!auth?.user?.isPermittedAdmin;
		},
	},
	pages: {
		error: "/signinfail?error=not_allowed",
	},
});
