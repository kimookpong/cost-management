import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // 🔥 ตัวอย่างการตรวจสอบ Username + Password (แทนที่ด้วย DB จริง)
        if (
          credentials.username === "admin" &&
          credentials.password === "123456"
        ) {
          return { id: "1", name: "Administrator", username: "admin" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
