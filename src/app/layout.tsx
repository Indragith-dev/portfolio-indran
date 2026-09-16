import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/components/providers";
import { geistMono, geistSans, incognito, pixelifySans } from "@/assets/fonts";
import { cn } from "@/lib/utils";
import MotionConfigWrapper from "@/components/motion-config";
import { siteMeta } from "@/config/portfolio-data";
import FloatingAvatar from "@/components/floating-avatar";

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  metadataBase: new URL(siteMeta.url),
  keywords: [...siteMeta.keywords],

  openGraph: {
    images: [
      {
        url: siteMeta.ogImage,
        alt: `${siteMeta.title} — portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "mx-auto font-sans antialiased",
          geistSans.variable,
          geistMono.variable,
          incognito.variable,
          pixelifySans.variable,
        )}
      >
        <Providers>
          <MotionConfigWrapper>
            <FloatingAvatar />
            {children}
          </MotionConfigWrapper>
        </Providers>
      </body>
    </html>
  );
}
