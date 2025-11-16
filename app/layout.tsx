import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rent Manager - Landlord Utility & Rent Management',
  description: 'Track electricity consumption and rent payments for your tenants',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
