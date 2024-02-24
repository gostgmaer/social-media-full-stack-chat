
import CredentialsProvider from "next-auth/providers/credentials";
import Cookies from 'js-cookie';
import NextAuth from 'next-auth'
import { baseurl, secret } from "@/config/setting";
import { jwtDecode } from "jwt-decode";
export const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: {
          label: 'email',
          type: 'email',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        const payload = {
          email: credentials.email,
          password: credentials.password,
        }

        const res = await fetch(baseurl + `/user/authentication/signin`, {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const user = await res.json()
        if (!res.ok) {
          throw new Error(user.message)
        }
        // If no error and we have user data, return it
        if (res.ok && user) {
          return user
        }

        // Return null if user data could not be retrieved
        return null
      },
    }),
    // ...add more providers here
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        const access_token = jwtDecode(user["access_token"]);
        const userInfo = jwtDecode(user["id_token"]);
       
        Cookies.set('access_token', user["access_token"]);
        Cookies.set('refresh_token', user["refresh_token"]);
        return {
          ...token,
          accessToken: user["access_token"],
          refreshToken: user["refresh_token"],
          idToken: user["id_token"], id: access_token["user_id"], email: userInfo["email"], image: userInfo["profilePicture"], name: `${userInfo["firstName"]} ${userInfo["lastName"]}`
        }
      }

      return token
    },

    async session({ session, token }) {
      session.user = token
      return session
    },
  },
  theme: {
    colorScheme: 'auto', // "auto" | "dark" | "light"
    brandColor: '', // Hex color code #33FF5D
    logo: '/vercel.svg', // Absolute URL to image
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
})


export { handler as GET, handler as POST }