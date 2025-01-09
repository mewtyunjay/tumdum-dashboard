import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TumDum Dashboard',
  description: 'Pricing and revenue analysis dashboard for TumDum',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scrollbar">
      <body className="scrollbar">{children}</body>
    </html>
  );
}
