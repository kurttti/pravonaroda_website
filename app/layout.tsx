import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pravonaroda.ru"),
  applicationName: "Народный юрист",
  title: {
    default: "Народный юрист — помощь при мошенничестве в Москве",
    template: "%s | Народный юрист",
  },
  description:
    "Народный юрист в Москве: юридическая помощь при мошенничестве, незаконных списаниях, переводах, кредитах и передаче денег или ценностей курьеру.",
  alternates: {
    canonical: "/",
    languages: { "ru-RU": "/", "x-default": "/" },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "/",
    siteName: "Народный юрист",
    title: "Народный юрист — помощь при мошенничестве в Москве",
    description: "Юридическая помощь после хищения денег или ценностей, незаконных списаний, переводов, кредитов и передачи наличных курьерам мошенников.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Народный юрист — помощь при мошенничестве" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Народный юрист — помощь при мошенничестве в Москве",
    description: "Юридическая помощь после хищения денег или ценностей, незаконных списаний, переводов, кредитов и передачи наличных курьерам.",
    images: ["/og.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-120.png", sizes: "120x120", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
