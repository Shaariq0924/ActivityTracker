import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Admin Login',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Your email or name" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                // Personal tracker — accept any non-empty credentials
                if (credentials?.username && credentials?.password) {
                    return {
                        id: 1,
                        name: credentials.username.includes('@')
                            ? credentials.username.split('@')[0]
                            : credentials.username,
                        email: credentials.username,
                    };
                }
                return null;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET || 'f1-super-secret-key-12345',
});
