import { Sarabun } from "next/font/google";

import ThemeProvider from "@/components/ThemeProvider";
import CustomSessionProvider from "@/components/SessionProvider";
import SessionChecker from "@/components/SessionChecker";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import "./globals.css";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
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
        className={`${sarabun.variable} antialiased bg-gray-100 dark:bg-gray-900 transition-colors duration-300 ease-in-out min-h-screen`}
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
