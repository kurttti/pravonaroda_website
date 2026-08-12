import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Народный юрист — помощь при мошенничестве",
    template: "%s | Народный юрист",
  },
  description:
    "Юридическая помощь при мошенничестве, незаконных списаниях и спорных переводах в Москве.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
