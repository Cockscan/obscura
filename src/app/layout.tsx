import type { Metadata } from "next";
import "./globals.css";
import { SmokeBackground } from "@/components/SmokeBackground";
import { Providers } from "@/components/Providers";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { VaporModel } from "@/components/VaporModel";

export const metadata: Metadata = {
  title: "Obscura | Privacy as an Architecture",
  description: "Untraceable transactions on Solana. High-performance privacy protocol.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-obscura-void selection:bg-white selection:text-black">
        <Providers>
          <SmoothScrollProvider>
            <VaporModel />
            <SmokeBackground />
            <div className="relative z-10">
              {children}
            </div>
          </SmoothScrollProvider>
        </Providers>
      </body>
    </html>
  );
}
