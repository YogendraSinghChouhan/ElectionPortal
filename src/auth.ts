import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./Database/dbConnect";
import User from "./Database/models/user.model";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          await dbConnect();

          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("Invalid Credentials");
          }

          const passwordMatch = await user.comparePassword(credentials.password);
          if (!passwordMatch) {
            throw new Error("Invalid Credentials");
          }

          // Return the user object without password
          const userWithoutPassword = { ...user._doc, password: undefined };
          return userWithoutPassword;
        } catch (error) {
          throw new Error(error.message || "Authentication failed.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user information to the JWT
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.role = user.role;
        token.fullName = user.fullName;
        token.isVerified = user.isVerified
        token.dateOfBirth = user.dateOfBirth
       }
      return token;
    },
    async session({ session, token }) {
      // Add custom user details to the session
      if (token) {
        session.user.id = token._id.toString();
        session.user.email = token.email;
        session.user.role = token.role;
        session.user.fullName = token.fullName;
        session.user.isVerified = token.isVerified
        session.user.dateOfBirth = token.dateOfBirth
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
