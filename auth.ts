import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

const demoUsers = [
  {
    id: "user-1",
    name: "Abebe Kebede",
    email: "abebe.kebede@ethiotelecom.et",
    password: "password123",
    avatar: "AK",
    role: "Senior Developer",
  },
  {
    id: "user-2",
    name: "Sara Tesfaye",
    email: "sara.tesfaye@ethiotelecom.et",
    password: "password123",
    avatar: "ST",
    role: "Product Manager",
  },
  {
    id: "user-3",
    name: "Yonas Bekele",
    email: "yonas.bekele@ethiotelecom.et",
    password: "password123",
    avatar: "YB",
    role: "QA Engineer",
  },
  {
    id: "user-4",
    name: "Hana Girma",
    email: "hana.girma@ethiotelecom.et",
    password: "password123",
    avatar: "HG",
    role: "DevOps Engineer",
  },
  {
    id: "user-5",
    name: "Dawit Mulugeta",
    email: "dawit.mulugeta@ethiotelecom.et",
    password: "password123",
    avatar: "DM",
    role: "UI/UX Designer",
  },
];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;
        const user = demoUsers.find((u) => u.email === email);

        if (!user || user.password !== password) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
        token.avatar = (user as { image?: string }).image;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { avatar?: string }).avatar = token.avatar as string;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
