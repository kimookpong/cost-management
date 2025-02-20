import { Geist, Geist_Mono } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import CustomSessionProvider from "@/components/SessionProvider";
import SessionChecker from "@/components/SessionChecker";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ระบบบริหารจัดการต้นทุน",
  description: "สำหรับศูนย์เครื่องมือวิทยาศาสตร์",
  icons: {
    icon: "/logo.png",
  },
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out min-h-screen`}
      >
        <ThemeProvider>
          <CustomSessionProvider session={session}>
            <SessionChecker />
            {children}
          </CustomSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
