import "~/styles/globals.css";
import localFont from "next/font/local";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Handwritten Digit Recognizer",
  description:
    "Classify 28x28px handwritten digits into numbers with ~90% accuracy.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Handwritten Digit Recognizer",
    description:
      "Classify 28x28px handwritten digits into numbers with ~90% accuracy.",
    url: "https://digit-recognition-nn.vercel.app",
    siteName: "Handwritten Digit Recognizer",
    images: [
      {
        url: "/thumbnail.png",
        width: 1100,
        height: 630,
        alt: "Handwritten Digit Recognition Neural Network",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Handwritten Digit Recognizer",
    description:
      "Classify 28x28px handwritten digits into numbers with ~90% accuracy.",
    images: ["/thumbnail.png"],
  },
};

const louize = localFont({
  src: [
    {
      path: "../../public/fonts/louize-regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/louize-medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-louize",
});

const sf = localFont({
  src: [
    {
      path: "../../public/fonts/sf-thin.otf",
      weight: "300",
      style: "normal",
    },
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
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
