import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('Please enter an email and password');
                }

                // Query Firestore for the user
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('username', '==', credentials.username.toLowerCase()));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    throw new Error('No user found with this email');
                }

                const userDoc = querySnapshot.docs[0];
                const user = userDoc.data();

                // Compare passwords
                const isValid = await bcrypt.compare(credentials.password, user.password);

                if (!isValid) {
                    throw new Error('Could not log you in! Incorrect password.');
                }

                return {
                    id: userDoc.id,
                    name: user.name,
                    email: user.username,
                };
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
