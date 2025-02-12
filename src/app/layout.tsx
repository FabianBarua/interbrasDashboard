import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import {HeroUIProvider} from "@heroui/react";
import { auth } from "@/auth";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Next Auth | NextJS",
  description: "Authentication using next-auth-v5",
  icons: {
    icon: "/icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" className="dark">
        <body className={`  min-h-dvh flex flex-col  ${inter.className}`}>
          <Toaster />
          <HeroUIProvider className="  ">
            {children}
          </HeroUIProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
