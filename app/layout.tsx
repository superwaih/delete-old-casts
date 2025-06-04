import type { Metadata } from "next";
import { Poppins } from "next/font/google"; // changed import
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "sonner";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // optional: specify weights you need
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
        {/* <meta
          name="fc:frame"
          content='{"version":"next","imageUrl":"https://yoink.party/framesV2/opengraph-image","button":{"title":"🚩 Start","action":{"type":"launch_frame","name":"Yoink!","url":"https://yoink.party/framesV2","splashImageUrl":"https://yoink.party/logo.png","splashBackgroundColor":"#f5f0ec"}}}'
        /> */}
      </head>

      <body
        className={`${poppins.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
