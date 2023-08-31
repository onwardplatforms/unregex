import Head from 'next/head';
import './globals.css';
import React, { ReactNode } from 'react';
import { Inter } from 'next/font/google'

interface Metadata {
  title: string;
  description: string;
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
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default RootLayout;
