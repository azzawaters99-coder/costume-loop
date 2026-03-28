import Link from 'next/link';
export default function Footer() {
  return (
    <footer style={{background:'white',borderTop:'1px solid #eee',marginTop:64,padding:'48px 24px'}}>
      <div style={{maxWidth:1200,margin:'0 auto',display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:48}}>
        <div>
          <div style={{background:'#4a0e2e',color:'white',padding:'6px 12px',borderRadius:6,display:'inline-block',marginBottom:16,lineHeight:1.3}}>
            <div style={{fontSize:7,letterSpacing:3,opacity:0.6,textTransform:'uppercase'}}>THE</div>
            <div style={{fontSize:14,fontWeight:800}}>Costume L<span style={{color:'#e8a838'}}>&#8734;</span>P</div>
          </div>
          <p style={{fontSize:13,color:'#999',lineHeight:1.7,maxWidth:260}}>Australia and New Zealand marketplace for pre-loved dance costumes.</p>
          <p style={{fontSize:12,color:'#bbb',marginTop:16}}>&copy; {new Date().getFullYear()} The Costume Loop. All rights reserved.</p>
        </div>
        <div>
          <h4 style={{fontSize:13,fontWeight:700,marginBottom:16}}>Quick Links</h4>
          {[['Browse','/browse'],['For Studios','/for-studios'],['FAQ','/faq'],['About','/about']].map(([l,h])=>(
            <div key={l} style={{marginBottom:10}}><Link href={h} style={{fontSize:13,color:'#999',textDecoration:'none'}}>{l}</Link></div>
          ))}
        </div>
        <div>
          <h4 style={{fontSize:13,fontWeight:700,marginBottom:16}}>Get in Touch</h4>
          <p style={{fontSize:13,color:'#999',marginBottom:8}}>hello@thecostumeloop.com</p>
          <p style={{fontSize:13,color:'#999'}}>Built by dance parents, for dance families.</p>
        </div>
      </div>
    </footer>
  );
}