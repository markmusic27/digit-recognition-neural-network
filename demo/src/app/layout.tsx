import "~/styles/globals.css";
import localFont from "next/font/local";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Handwritten Digit Generator",
  description:
    "Classifies 28x28px handwritten digits into numbers with ~98% accuracy.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const louize = localFont({
  src: "../../public/fonts/louize.otf",
  variable: "--font-louize",
});

const sf = localFont({
  src: [
    {
      path: "../../public/fonts/sf-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/sf-medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-sf",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${louize.variable} ${sf.variable}`}>
      <body>{children}</body>
    </html>
  );
}
