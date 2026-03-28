import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export const metadata = {
  title: {
    template: '%s | The Costume Loop',
    default: 'The Costume Loop — Second-Hand Dance Costumes NZ & AU',
  },
  description: 'Buy and sell second-hand dance costumes across New Zealand and Australia. Affordable recital, competition and studio costumes for dancers of all ages.',
  openGraph: {
    title: 'The Costume Loop — Second-Hand Dance Costumes NZ & AU',
    description: 'Buy and sell second-hand dance costumes across New Zealand and Australia.',
    url: 'https://www.thecostumeloop.co.nz',
    siteName: 'The Costume Loop',
    type: 'website',
  },
};
export default function RootLayout({ children }) {
  return (<html lang='en'><body style={{display:'flex',flexDirection:'column',minHeight:'100vh',backgroundColor:'#faf7f2'}}><Navbar/><main style={{flex:1}}>{children}</main><Footer/></body></html>);
}
