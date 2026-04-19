import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  metadataBase: new URL('https://www.thecostumeloop.co.nz'),
  title: {
    template: '%s | The Costume Loop',
    default: 'The Costume Loop — Second-Hand Dance Costumes NZ & AU',
  },
  description: 'Buy and sell second-hand dance costumes across New Zealand and Australia. Affordable recital, competition and studio costumes for dancers of all ages.',
  keywords: ['dance costumes', 'second-hand dance', 'pre-loved dance costumes', 'dance marketplace', 'ballet costumes', 'jazz costumes', 'New Zealand', 'Australia', 'dance parents'],
  openGraph: {
    title: 'The Costume Loop — Second-Hand Dance Costumes NZ & AU',
    description: 'Buy and sell second-hand dance costumes across New Zealand and Australia.',
    url: 'https://www.thecostumeloop.co.nz',
    siteName: 'The Costume Loop',
    locale: 'en_NZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Costume Loop — Second-Hand Dance Costumes NZ & AU',
    description: 'Buy and sell second-hand dance costumes across New Zealand and Australia.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#faf7f2' }}>
        <Navbar />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
