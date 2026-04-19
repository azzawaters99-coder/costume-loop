import Link from "next/link";
const features=[{t:"Studio Storefront",d:"Get a dedicated presence. Parents browse and buy from your studio community."},{t:"Reduce Financial Barriers",d:"Help families access quality costumes at a fraction of the cost."},{t:"Strengthen Community",d:"When families buy and sell within your studio, it builds connection."},{t:"Sustainability Story",d:"Show your studio cares by encouraging costume reuse."},{t:"Zero Cost to Studios",d:"Completely free. No sign-up fees, no commissions, no hidden costs."},{t:"Easy to Promote",d:"Share a simple link via email or social media. Takes seconds."}];
export default function ForStudios(){return(<>
  <section style={{minHeight:400,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",background:"radial-gradient(ellipse at 70% 40%, #9b2847 0%, #800020 40%, #4a0e2e 100%)"}}>
    <div style={{maxWidth:600}}><h1 style={{fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,color:"white",marginBottom:20}}>For Dance Studios</h1>
    <p style={{fontSize:16,color:"rgba(255,255,255,0.8)",lineHeight:1.75}}>Help your dance families save money on costumes while building a stronger studio community.</p></div>
  </section>
  <section style={{padding:"72px 24px",background:"#faf7f2"}}>
    <div style={{maxWidth:1000,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24}}>
      {features.map(f=><div key={f.t} style={{background:"white",borderRadius:16,padding:28,border:"1px solid #e8dcc8"}}><h3 style={{fontWeight:700,color:"#4a0e2e",marginBottom:10}}>{f.t}</h3><p style={{fontSize:14,color:"#888",lineHeight:1.75}}>{f.d}</p></div>)}
    </div>
  </section>
  <section style={{padding:"72px 24px",textAlign:"center",background:"radial-gradient(ellipse at 50% 50%, #9b2847 0%, #4a0e2e 100%)"}}>
    <h2 style={{fontSize:"clamp(1.6rem,3vw,2.2rem)",fontWeight:800,color:"white",marginBottom:16}}>Partner with The Costume Loop</h2>
    <p style={{color:"rgba(255,255,255,0.75)",maxWidth:440,margin:"0 auto 36px",lineHeight:1.75}}>Free, easy, and your families will thank you.</p>
    <a href="mailto:hello@thecostumeloop.co.nz" style={{display:"inline-block",background:"#e8a838",color:"#4a0e2e",fontWeight:700,padding:"15px 36px",borderRadius:10,textDecoration:"none",fontSize:16}}>Get in Touch</a>
  </section>
</>);}
