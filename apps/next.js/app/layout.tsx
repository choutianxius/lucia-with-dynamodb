import React from "react";

import "@/app/global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Next.js v15 + TailwindCSS v4 + Shadcn UI</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
