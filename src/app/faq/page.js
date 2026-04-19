"use client";
import { useState } from "react";
const FAQS = {
  Buying:[
    {q:"How do I find the right costume?",a:"Use the search filters to narrow by dance genre, size, age group, colour, and price range."},
    {q:"How do payments work?",a:"The Costume Loop is a marketplace, not a payment processor. You arrange payment directly with the seller using their preferred method (typically bank transfer). We recommend paying only once you have confirmed details with the seller and feel comfortable going ahead."},
    {q:"What if the costume is not as described?",a:"Contact the seller first to resolve it directly. If you cannot reach an agreement, email us at hello@thecostumeloop.co.nz within 48 hours of receiving the item and we will do our best to help."},
    {q:"Can I try before buying?",a:"If the seller offers local pickup, you may be able to arrange a try-on."}
  ],
  Selling:[
    {q:"How much does it cost to list?",a:"Listing a costume is free. You can optionally feature a listing for $5 NZD to give it priority placement for 7 days."},
    {q:"How do I price my costume?",a:"Pre-loved costumes typically sell for 30-60% of their original price."},
    {q:"How do I get paid?",a:"Buyers pay you directly. Most sellers use bank transfer once they have agreed details with the buyer. The Costume Loop does not handle payments between users."},
    {q:"How should I ship?",a:"Use a tracked courier service and pack carefully to avoid damage. Costumes should be sent within 3 working days of payment."}
  ],
  Studios:[
    {q:"Can our studio have its own page?",a:"Yes. Studios can create a branded storefront. Contact us to get set up."},
    {q:"Is there a cost for studios?",a:"No. Studio partnerships are completely free."}
  ],
  General:[
    {q:"Which countries do you cover?",a:"Currently Australia and New Zealand, with plans to expand."},
    {q:"How do I contact you?",a:"Email us at hello@thecostumeloop.co.nz anytime."}
  ]
};
function Item({q,a}){
  const [open,setOpen]=useState(false);
  return(
    <div style={{borderBottom:"1px solid #f0f0f0"}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",textAlign:"left",padding:"18px 0",background:"none",border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontWeight:600,fontSize:15}}>{q}</span>
        <span style={{fontSize:22,color:"#800020"}}>{open?"−":"+"}</span>
      </button>
      {open&&<p style={{fontSize:14,color:"#666",lineHeight:1.8,paddingBottom:16}}>{a}</p>}
    </div>
  );
}
export default function FAQ(){
  return(
    <>
      <section style={{minHeight:300,display:"flex",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",background:"radial-gradient(ellipse at 70% 40%, #9b2847 0%, #800020 40%, #4a0e2e 100%)"}}>
        <div>
          <h1 style={{fontSize:"clamp(2rem,4vw,3rem)",fontWeight:800,color:"white",marginBottom:16}}>Frequently Asked Questions</h1>
          <p style={{fontSize:16,color:"rgba(255,255,255,0.8)"}}>Everything you need to know about buying and selling.</p>
        </div>
      </section>
      <section style={{padding:"72px 24px",background:"#faf7f2"}}>
        <div style={{maxWidth:760,margin:"0 auto",display:"flex",flexDirection:"column",gap:48}}>
          {Object.entries(FAQS).map(([cat,items])=>(
            <div key={cat}>
              <h2 style={{fontSize:20,fontWeight:700,color:"#4a0e2e",marginBottom:8,paddingBottom:12,borderBottom:"2px solid #e8dcc8"}}>{cat}</h2>
              {items.map(item=><Item key={item.q} {...item}/>)}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
