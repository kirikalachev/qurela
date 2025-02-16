// layout.tsx
'use client';
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Metadatafunc from "@/app/metadata";
import NavigationBar from '@/components/navBar';
import Footer from '@/components/footer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Check if the current page is the auth page
  const isSignInPage = pathname === "/auth/signin";
  const isSignUpPage = pathname === "/auth/signup";
  return (
    <html lang="en">
      <Metadatafunc />
      <body className='bg-gradient-to-b from-alice-blue to-uranian-blue min-h-[100vh]'>
        {!isSignInPage && !isSignUpPage && <NavigationBar />}
        {children}
        {!isSignInPage && !isSignUpPage && <Footer />}
      </body>
    </html>
  );
}