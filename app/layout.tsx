import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Billz - By MindzedTech',
  description: 'Track electricity consumption and rent payments for our tenants',
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
