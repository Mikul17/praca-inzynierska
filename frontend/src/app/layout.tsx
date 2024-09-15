import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import { MainProvider } from "../hooks/MainProvider";
import { Toaster } from "react-hot-toast";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
  title: "Task scheduler",
  description: "Application to schedule task in RPQ problem",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${robotoMono.variable} font-mono antialiased`}>
        <MainProvider>
          <Toaster position="bottom-right" />
          {children}
          </MainProvider>
      </body>
    </html>
  );
}
