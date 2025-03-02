import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationBar from '@/components/navBar';
import Footer from '@/components/footer';
import { CreatePostProvider } from "@/context/CreatePostContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Qurela", // ✅ Correct Title
  description: "Проверена медицинска информация на едно място.",
  openGraph: {
    title: "Qurela",
    description: "Проверена медицинска информация на едно място.",
    url: "https://www.qurela.com/",
    type: "website",
    images: [
      {
        url: "https://www.qurela.com/people.jpg",
        width: 1200,
        height: 630,
        alt: "Qurela Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qurela",
    description: "Проверена медицинска информация на едно място.",
    images: ["https://www.qurela.com/people.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-alice-blue to-uranian-blue dark:bg-gradient-to-b dark:from-night-color dark:to-night-color min-h-[100vh]">
        <CreatePostProvider>
          <NavigationBar />
          {children}
          <Footer />
        </CreatePostProvider>
      </body>
    </html>
  );
}
