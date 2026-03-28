import Link from 'next/link';
const genres=[{n:'Ballet',d:'Tutus, leotards & classical pieces',e:'🩰'},{n:'Contemporary',d:'Lyrical, modern & expressive',e:'🌊'},{n:'Jazz & Tap',d:'Sequins, top hats & showstoppers',e:'🎩'},{n:'Cultural & Character',d:'Traditional, folk & themed outfits',e:'🌏'}];
const steps=[{n:'1',t:'List Your Costume',d:'Snap photos, add genre, size, condition and set your price.'},{n:'2',t:'Discover & Search',d:'Browse by genre, size, or keyword.'},{n:'3',t:'Secure Checkout',d:'Pay safely through our protected payment system.'},{n:'4',t:'Ship or Collect',d:'Arrange delivery or local pick-up.'}];
const studios=[{t:'Bulk Listing Tools',d:'List multiple costumes at once with batch uploads.'},{t:'Studio Storefront',d:'Branded page so parents can browse and buy directly.'},{t:'Parent Communication',d:'Share your link before concert season.'},{t:'Fundraising Potential',d:'Turn old costumes into funds for new ones.'},{t:'Sustainability Champion',d:'Show your community reuse can be beautiful.'},{t:'Community Connection',d:'Connect with studios across AU and NZ.'}];
const trust=[{t:'Safe and Secure',d:'Every transaction protected with secure payments.'},{t:'Community First',d:'Built by dance parents who understand the costume cycle.'},{t:'Sustainable by Design',d:'Every costume resold is one less going to landfill.'}];
export default function Home(){return(<>
  <section style={{minHeight:580,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',padding:'60px 24px',background:'radial-gradient(ellipse at 70% 40%, #9b2847 0%, #800020 40%, #4a0e2e 100%)',position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',right:'-5%',top:'-10%',width:360,height:360,borderRadius:'50%',background:'rgba(255,255,255,0.05)'}}/>
    <div style={{position:'relative',zIndex:1,maxWidth:700}}>
      <h1 style={{fontSize:'clamp(2.2rem,5vw,3.8rem)',fontWeight:800,color:'white',lineHeight:1.15,marginBottom:24}}>Every Costume Deserves an Encore</h1>
      <p style={{fontSize:17,color:'rgba(255,255,255,0.8)',maxWidth:520,margin:'0 auto 40px',lineHeight:1.7}}>The trusted marketplace for second-hand dance costumes. Buy and sell across Australia and New Zealand.</p>
      <Link href='/browse' style={{display:'inline-block',background:'#e8a838',color:'#4a0e2e',fontWeight:700,padding:'15px 36px',borderRadius:10,textDecoration:'none',fontSize:16}}>Browse Costumes</Link>
    </div>
  </section>
  <div style={{background:'#e8dcc8',display:'grid',gridTemplateColumns:'repeat(3,1fr)'}}>
    {[{t:'Verified Sellers',d:'Every seller verified for trust and quality'},{t:'Secure Payments',d:'Protected transactions on every purchase'},{t:'AU and NZ Wide',d:'Connecting dancers across Australia and New Zealand'}].map((b,i)=>(
      <div key={b.t} style={{padding:'28px 32px',textAlign:'center',borderRight:i<2?'1px solid #f2e8d5':'none'}}>
        <div style={{fontWeight:700,color:'#4a0e2e',fontSize:15,marginBottom:6}}>{b.t}</div>
        <div style={{fontSize:13,color:'#777'}}>{b.d}</div>
      </div>
    ))}
  </div>
  <section style={{padding:'72px 24px',background:'#faf7f2'}}>
    <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:800,color:'#4a0e2e',textAlign:'center',marginBottom:12}}>How It Works</h2>
    <p style={{textAlign:'center',color:'#888',marginBottom:48}}>Four simple steps to buy or sell a costume</p>
    <div style={{maxWidth:1000,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:20}}>
      {steps.map(s=><div key={s.n} style={{background:'white',borderRadius:16,padding:24,border:'1px solid #e8dcc8'}}><div style={{width:40,height:40,borderRadius:'50%',background:'#800020',color:'white',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,marginBottom:16}}>{s.n}</div><div style={{fontWeight:600,marginBottom:8}}>{s.t}</div><div style={{fontSize:13,color:'#888',lineHeight:1.7}}>{s.d}</div></div>)}
    </div>
  </section>
  <section style={{padding:'72px 24px',background:'#f2e8d5'}}>
    <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:800,color:'#4a0e2e',textAlign:'center',marginBottom:12}}>Browse by Genre</h2>
    <p style={{textAlign:'center',color:'#888',marginBottom:48}}>Find costumes for every style of dance</p>
    <div style={{maxWidth:1000,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:20}}>
      {genres.map(g=><Link key={g.n} href={'/browse?genre='+encodeURIComponent(g.n)} style={{background:'#faf7f2',borderRadius:16,padding:24,border:'1px solid #e8dcc8',textAlign:'center',textDecoration:'none',display:'block'}}><div style={{fontSize:44,marginBottom:12}}>{g.e}</div><div style={{fontWeight:700,color:'#4a0e2e',marginBottom:6}}>{g.n}</div><div style={{fontSize:13,color:'#888'}}>{g.d}</div></Link>)}
    </div>
  </section>
  <section style={{padding:'72px 24px',background:'#faf7f2'}}>
    <div style={{maxWidth:1000,margin:'0 auto',textAlign:'center'}}>
      <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:800,color:'#4a0e2e',marginBottom:12}}>Built for Dance Studios</h2>
      <p style={{color:'#888',maxWidth:520,margin:'0 auto 32px'}}>A better way to manage your studio costume inventory and help families save</p>
      <Link href='/for-studios' style={{display:'inline-block',background:'#800020',color:'white',fontWeight:700,padding:'13px 30px',borderRadius:10,textDecoration:'none',marginBottom:48}}>Register Your Studio</Link>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:20,marginTop:16,textAlign:'left'}}>
        {studios.map(f=><div key={f.t} style={{background:'white',borderRadius:16,padding:24,border:'1px solid #e8dcc8'}}><div style={{fontWeight:600,marginBottom:8}}>{f.t}</div><div style={{fontSize:13,color:'#888',lineHeight:1.7}}>{f.d}</div></div>)}
      </div>
    </div>
  </section>
  <section style={{padding:'72px 24px',textAlign:'center',background:'radial-gradient(ellipse at 50% 50%, #9b2847 0%, #4a0e2e 100%)'}}>
    <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:800,color:'white',marginBottom:16}}>Ready to Give a Costume a New Life?</h2>
    <p style={{color:'rgba(255,255,255,0.75)',maxWidth:400,margin:'0 auto 36px',lineHeight:1.7}}>Join the growing community across Australia and New Zealand.</p>
    <Link href='/list' style={{display:'inline-block',background:'#e8a838',color:'#4a0e2e',fontWeight:700,padding:'15px 36px',borderRadius:10,textDecoration:'none',fontSize:16}}>Start Selling Today</Link>
  </section>
  <section style={{padding:'72px 24px',background:'#f2e8d5'}}>
    <h2 style={{fontSize:'clamp(1.6rem,3vw,2.4rem)',fontWeight:800,color:'#4a0e2e',textAlign:'center',marginBottom:12}}>Why Families Trust Us</h2>
    <p style={{textAlign:'center',color:'#888',marginBottom:48}}>Built by dance parents, for the dance community</p>
    <div style={{maxWidth:900,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:32}}>
      {trust.map(t=><div key={t.t} style={{textAlign:'center'}}><div style={{fontWeight:700,color:'#4a0e2e',marginBottom:10,fontSize:16}}>{t.t}</div><div style={{fontSize:13,color:'#888',lineHeight:1.7}}>{t.d}</div></div>)}
    </div>
  </section>
</>);}
