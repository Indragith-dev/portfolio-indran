import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/components/providers";
import { geistMono, geistSans, incognito, pixelifySans } from "@/assets/fonts";
import { cn } from "@/lib/utils";
import MotionConfigWrapper from "@/components/motion-config";
import { siteMeta } from "@/config/portfolio-data";
import { CursorTrail } from "@/components/ui/cursor-trail";
import AiraChat from "@/components/aira-chat";
import RouteLoader from "@/components/route-loader";

export const metadata: Metadata = {
  title: siteMeta.title,
  description: siteMeta.description,
  metadataBase: new URL(siteMeta.url),
  keywords: [...siteMeta.keywords],

  openGraph: {
    type: "website",
    url: siteMeta.url,
    siteName: siteMeta.title,
    title: siteMeta.title,
    description: siteMeta.description,
    images: [
      {
        url: siteMeta.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteMeta.title} — portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    images: [siteMeta.ogImage],
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
            <CursorTrail />
            <AiraChat />
            <RouteLoader />
            {children}
          </MotionConfigWrapper>
        </Providers>
      </body>
    </html>
  );
}
