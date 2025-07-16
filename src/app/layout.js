import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Outfitly",
  description: "Generate outfit suggestions from your wardrobe. 🪄",
  icons: {
    icon: "https://images.emojiterra.com/microsoft/fluent-emoji/15.1/128px/1fa84_color.png",
    apple: "/apple-touch-icon.png",
  },
  
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
