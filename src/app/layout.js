import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
export const metadata = { title: 'The Costume Loop', description: 'Marketplace for second-hand dance costumes.' };
export default function RootLayout({ children }) {
  return (<html lang='en'><body style={{display:'flex',flexDirection:'column',minHeight:'100vh',backgroundColor:'#faf7f2'}}><Navbar/><main style={{flex:1}}>{children}</main><Footer/></body></html>);
}