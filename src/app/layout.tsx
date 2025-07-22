import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import "@radix-ui/themes/styles.css";
import Navbar from "@/components/Navbar";
import DarkModeProvider from "@/context/DarkModeContext";
import { Toaster } from "sonner";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Provider from "@/context/Provider";
import ConditionalFooter from "./ConditionalFooter";

export const metadata: Metadata = {
  title: "Kushal",
  description:
    "Kushal Jadhav is a Full Stack Developer specializing in building impactful web applications from scratch. Explore his portfolio to see my projects and skills.",
  keywords:
    "Kushal Jadhav, Full Stack Developer, Web Developer, Portfolio, JavaScript, TypeScript, React, Node.js, software engineer",
  authors: [{ name: "Kushal Jadhav" }],
  openGraph: {
    title: "Kushal",
    description:
      "Explore the portfolio of Kushal Jadhav, showcasing innovative web applications and development skills.",
    url: "https://kuslh.vercel.app/",
    siteName: "Kushal",
    images: [
      {
        url: "/https://ibb.co/YTd3sryS",
        width: 400,
        height: 200,
        alt: "Kushal",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Provider>
        <DarkModeProvider>
          <body className={`bg-white dark:bg-black`}>
            <Toaster position="bottom-right" />
            <Theme className="dark:!bg-black">
              <Navbar />
              {children}
              <Analytics />
              <ConditionalFooter />
            </Theme>
          </body>
        </DarkModeProvider>
      </Provider>
    </html>
  );
}
