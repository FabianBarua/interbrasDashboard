import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import {HeroUIProvider} from "@heroui/react";
import { auth } from "@/auth";
import NextTopLoader from 'nextjs-toploader';
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | Interbras',
    default: 'Interbras',
  },
  description: "Interbras Dashboard",
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
    <SessionProvider session={session}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
      refetchInterval={0}
    >
      <html lang="en" className="dark">
        <body className={`  min-h-dvh flex flex-col  ${inter.className}`}>
          <Toaster />
          <NextTopLoader 
            color="#fff"
              template='<div class="bar" role="bar"><div class="peg"></div></div> 
              <div class="spinner" role="spinner"></div></div>'
          />
          <HeroUIProvider className="  ">
            {children}
          </HeroUIProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
