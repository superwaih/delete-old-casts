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
          content='{"frame":{"version":"1","name":"Delete Old Casts","iconUrl":"https://delete-old-casts.vercel.app/logo.png","homeUrl":"https://delete-old-casts.vercel.app","imageUrl":"https://delete-old-casts.vercel.app/og.png","buttonTitle":"🚩 Start","splashImageUrl":"https://delete-old-casts.vercel.app/logo.png","splashBackgroundColor":"#000000","requiredChains":["eip155:8453"],"requiredCapabilities":["actions.signIn","wallet.getEthereumProvider"]}}'
        />
      </head>

      <body className={`${poppins.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
