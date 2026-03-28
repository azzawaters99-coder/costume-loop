export default function About(){
  const sections=[
    {t:"What We Believe",d:"Every dancer deserves to feel confident on stage regardless of budget. Dance costumes deserve more than one performance. By connecting buyers and sellers across Australia and New Zealand, we are creating a circular economy for dance."},
    {t:"How It Works",d:"Sellers list their costumes in under two minutes. Buyers search and filter by genre, size, colour, and price. Payments are handled securely, and sellers receive funds once the buyer confirms receipt."},
    {t:"Built by Dance Parents",d:"We are parents, just like you, who believe dance should be accessible to everyone. We built The Costume Loop to make it easier for every family."},
    {t:"Our Mission",d:"Make dance more accessible and affordable for every family, while building a more sustainable dance community across Australia and New Zealand."}
  ];
  return(
    <>
      <section style={{minHeight:360,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",background:"radial-gradient(ellipse at 70% 40%, #9b2847 0%, #800020 40%, #4a0e2e 100%)"}}>
        <div style={{maxWidth:600}}>
          <h1 style={{fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,color:"white",marginBottom:20}}>Our Story</h1>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.8)",lineHeight:1.75}}>As dance parents ourselves, we could see the pain costuming was causing families every competition season.</p>
        </div>
      </section>
      <section style={{padding:"72px 24px",background:"#faf7f2"}}>
        <div style={{maxWidth:800,margin:"0 auto",display:"flex",flexDirection:"column",gap:48}}>
          {sections.map(s=>(
            <div key={s.t}>
              <h2 style={{fontSize:22,fontWeight:700,color:"#4a0e2e",marginBottom:16}}>{s.t}</h2>
              <p style={{fontSize:15,color:"#666",lineHeight:1.85}}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
