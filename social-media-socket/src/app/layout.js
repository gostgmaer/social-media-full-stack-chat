import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "@/context/sessionContext";
import { AppProvider } from "@/context/contextAPi";
import { AuthContext, AuthContextProvider } from "@/context/authContext";
import { Suspense } from "react";
import Spinner from "@/components/global/blocks/loader/Spinner";
import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <NextAuthProvider>
    <AppProvider>
      <AuthContextProvider>
        <html lang="en">
          <body className={inter.className} suppressHydrationWarning={true}>
            <Suspense fallback={<Spinner></Spinner>}>
             
              <main className="bg-light w-full min-h-screen text-dark">
                {children}
              </main>
            </Suspense>
            <ToastContainer />
          </body>
        </html>
      </AuthContextProvider>
    </AppProvider></NextAuthProvider>
  );
}
