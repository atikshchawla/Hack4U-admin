import Google from "next-auth/providers/google";

export default {
	providers: [Google],
	callbacks: {
		async jwt({ token }) {
			if (typeof token.isPermittedAdmin === "undefined") {
				token.isPermittedAdmin = false;
			}

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
};
