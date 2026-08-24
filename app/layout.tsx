import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const notoSans = localFont({
  src: '../public/fonts/NotoSans.woff2',
  variable: '--font-sans-latin',
  display: 'swap',
  weight: '100 900',
});

const notoSansHebrew = localFont({
  src: '../public/fonts/NotoSansHebrew.woff2',
  variable: '--font-sans-hebrew',
  display: 'swap',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Admin Starter',
  description: 'Admin boilerplate: design system + Clerk auth + admin shell',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="light" className={`${notoSans.variable} ${notoSansHebrew.variable}`}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
