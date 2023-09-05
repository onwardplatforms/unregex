import Head from 'next/head';
import './globals.css';
import React, { ReactNode } from 'react';
import { Inter } from 'next/font/google'
import Script from 'next/script';

interface Metadata {
  title: string;
  description: string;
}

declare global {
  interface Window {
    // @ts-ignore
    gtag: any;
  }
}

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
  title: 'Unregex: The #1 AI-Powered Regex Generator Online',
  description: 'Unregex is your go-to AI-powered Regex Generator. Simplify and enhance your regular expression tasks instantly. Try now!',
};

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="canonical" href="https://unregex.com/" />
        <meta name="language" content="EN" />
        <link rel="icon" type="image/svg+xml" href="/unregex.svg" />
      </Head>
      <Script
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=G-6CY0MJMKFP`}
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-6CY0MJMKFP');
        `}
      </Script>
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
