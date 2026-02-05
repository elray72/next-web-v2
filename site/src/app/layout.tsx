import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Wellness',
  description: 'Multi-tenant wellness platform',
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
