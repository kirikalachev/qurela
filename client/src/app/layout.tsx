'use client';
import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Metadatafunc from "@/app/metadata";
import NavigationBar from '@/app/navBar';
import Footer from '@/app/footer';

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
  const isAuthPage = pathname === "/auth"; // Adjust this to the actual auth page route

  return (
    <html lang="en">
      <Metadatafunc />
      <body
        className='bg-gradient-to-b from-alice-blue to-uranian-blue min-h-[100vh]'
      >
        {!isAuthPage && <NavigationBar />}
        {children}
        {!isAuthPage && <Footer />}
      </body>
    </html>
  );
}
