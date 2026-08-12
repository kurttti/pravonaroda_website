import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pravonaroda.ru"),
  applicationName: "Народный юрист",
  title: {
    default: "Юрист по мошенничеству в Москве — Народный юрист",
    template: "%s | Народный юрист",
  },
  description:
    "Юридическая помощь пострадавшим от мошенничества в Москве: переводы, незаконные списания, кредиты без согласия и передача наличных курьерам.",
  alternates: {
    canonical: "/",
    languages: { "ru-RU": "/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Народный юрист",
    title: "Юрист по мошенничеству в Москве — Народный юрист",
    description: "Помогаем после переводов, незаконных списаний и передачи наличных курьерам мошенников: доказательства, полиция и правовой путь.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Народный юрист — помощь пострадавшим от мошенничества" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Юрист по мошенничеству в Москве — Народный юрист",
    description: "Юридическая помощь после незаконных списаний, спорных переводов и передачи наличных курьерам мошенников.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon-32.png?v=2", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png?v=2",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  category: "legal services",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
