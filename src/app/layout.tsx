import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roastly — Drop your URL. Get roasted. Fix it in 10 minutes.",
  description:
    "Get a brutally honest, funny roast of your landing page copy, a Clarity Score, and 3 fixes you can ship in 10 minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-white antialiased">
        {children}
      </body>
    </html>
  );
}
