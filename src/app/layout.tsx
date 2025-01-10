import './globals.css';
import type { Metadata } from 'next';
import { Navigation } from '@/components/ui/navigation';

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
      <body className="scrollbar">
        <Navigation />
        <div className="pt-20">
          {children}
        </div>
      </body>
    </html>
  );
}
