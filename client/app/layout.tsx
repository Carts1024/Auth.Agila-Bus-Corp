"use client";

import "@/styles/globals.css";
import "@/styles/index.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Agila Bus Transport Corp. System</title>
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" />
      </head>
      <body>
        {/* Background images */}
        <div className="bg-wrapper">
          <img src="/assets/images/buswallpaper.jpg" className="bg-img fade-img-1" />
          <img src="/assets/images/buswallpaper2.jpg" className="bg-img fade-img-2" />
          <img src="/assets/images/buswallpaper3.png" className="bg-img fade-img-3" />
          <img src="/assets/images/buswallpaper4.png" className="bg-img fade-img-4" />
          <img src="/assets/images/buswallpaper5.png" className="bg-img fade-img-5" />
        </div>

        {children}
      </body>
    </html>
  );
}