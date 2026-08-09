import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kevin Harlley",
  description: "Personal portfolio of Kevin Eyram Harlley – Solutions Engineering Analyst at Deloitte.",
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
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
