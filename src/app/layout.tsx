import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kevin Eyram Harlley | Creative Technologist",
  description: "Personal portfolio of Kevin Eyram Harlley – Solutions Engineer & Creative Technologist.",
  openGraph: {
    title: "Kevin Eyram Harlley | Creative Technologist",
    description: "Personal portfolio of Kevin Eyram Harlley – Solutions Engineer & Creative Technologist.",
    url: "https://kevineharlley.github.io",
    siteName: "Kevin Harlley Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kevin Eyram Harlley | Creative Technologist",
    description: "Personal portfolio of Kevin Eyram Harlley – Solutions Engineer & Creative Technologist.",
  },
  icons: {
    icon: "/images/headshot.png",
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
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
