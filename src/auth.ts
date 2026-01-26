
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/', // Redirect to landing page for login
    },
    callbacks: {
        jwt({ token, account, profile }) {
            // On initial sign in, add the provider's account ID
            if (account) {
                token.id = profile?.sub ?? account.providerAccountId;
            }
            return token;
        },
        session({ session, token }) {
            // Make the ID available in the session
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    debug: true,
})
