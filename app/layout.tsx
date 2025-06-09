import type React from "react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Delete Old Casts",
  description: "Mini-App Developed By Shittu Adewale",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta
  name="fc:frame"
  content='{
    "version": "next",
    "imageUrl": "https://delete-old-casts.vercel.app/og.png",
    "button": {
      "title": "🚩 Start Bulk Delete",
      "action": {
        "type": "launch_frame",
        "url": "https://delete-old-casts.vercel.app",
        "name": "Delete Old Casts",
        "splashImageUrl": "https://delete-old-casts.vercel.app/logo.png",
        "splashBackgroundColor": "#000000"
      }
    }
  }'
/>

      </head>

      <body className={`${poppins.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
