import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    error: "/access-denied",
  },
  callbacks: {
    async signIn({ user }) {
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        try {
          await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              isAdmin: false // explicit default
            },
          });
        } catch (error) {
          console.error(error);
        }
      }
      return true;
    },

async session({ session }) {
  if (session?.user?.email) {
    const dbUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (dbUser) {
      session.user.isAdmin = dbUser.isAdmin;
      session.user.id = dbUser.id; // optional but useful
    } else {
      session.user.isAdmin = false;
    }
  }
  return session;
}

  },
  secret: process.env.NEXTAUTH_SECRET,
};


function RefreshSessionButton() {
  const { update } = useSession();

  return (
    <button
      onClick={() => update()}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      Refresh Session
    </button>
  );
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
