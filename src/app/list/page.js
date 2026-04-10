"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const GENRES=["Ballet","Contemporary","Jazz & Tap","Cultural & Character","Acrobatics","Hip Hop","Musical Theatre","Duos & Trios","Group Costumes"];
const CONDITIONS=["New with tags","Like new","Good","Fair"];
const SIZES=["Age 2-4","Age 4-6","Age 6-8","Age 8-10","Age 10-12","Age 12-14","Adult XS","Adult S","Adult M","Adult L","Adult XL"];
const STEPS=["Details","Photos","Pricing","Shipping","Review"];

export default function ListPage(){
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [step,setStep]=useState(0);
  const [form,setForm]=useState({
    listingType:"sale",
    type:"used",
    title:"",
    genre:"",
    size:"",
    condition:"",
    desc:"",
    price:"",
    rentalPricePerWeek:"",
    rentalBond:"",
    rentalMinWeeks:"1",
    rentalAvailabilityNotes:"",
    shipping:"both",
    location:"",
    featured:false
  });
  const [done,setDone]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const inp={width:"100%",border:"1px solid #e5e5e5",borderRadius:10,padding:"12px 16px",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"};

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handlePublish() {
    if (!user) return;
    const insertData = {
      user_id: user.id,
      listing_type: form.listingType,
      type: form.type,
      title: form.title,
      genre: form.genre,
      size: form.size,
      condition: form.condition,
      description: form.desc,
      shipping: form.shipping,
      location: form.location,
      featured: form.featured,
    };
    if (form.listingType === 'sale') {
      insertData.price = parseFloat(form.price) || 0;
    } else {
      insertData.rental_price_per_week = parseFloat(form.rentalPricePerWeek) || 0;
      insertData.rental_bond = form.rentalBond ? parseFloat(form.rentalBond) : null;
      insertData.rental_min_weeks = parseInt(form.rentalMinWeeks) || 1;
      insertData.rental_availability_notes = form.rentalAvailabilityNotes || null;
    }
    const { error } = await supabase.from('listings').insert([insertData]);
    if (error) { console.error(error); return; }
    setDone(true);
  }

  if (authLoading) {
    return (
      <div style={{minHeight:'60vh',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <p style={{color:'#aaa'}}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{maxWidth:480,margin:"80px auto",textAlign:"center",padding:"0 24px"}}>
        <div style={{fontSize:64,marginBottom:24}}>&#128274;</div>
        <h1 style={{fontSize:28,fontWeight:800,color:"#4a0e2e",marginBottom:16}}>Sign In to List a Costume</h1>
        <p style={{color:"#888",marginBottom:32,lineHeight:1.7}}>You need to be signed in before you can list a costume for sale or rent.</p>
        <Link href="/login?redirect=/list" style={{display:"inline-block",background:"#800020",color:"white",fontWeight:700,padding:"14px 32px",borderRadius:10,textDecoration:"none",fontSize:15}}>Sign In or Create Account</Link>
      </div>
    );
  }

  if(done) return(
    <div style={{maxWidth:480,margin:"80px auto",textAlign:"center",padding:"0 24px"}}>
      <div style={{fontSize:64,marginBottom:24}}>&#127881;</div>
      <h1 style={{fontSize:28,fontWeight:800,color:"#4a0e2e",marginBottom:16}}>Listing Published!</h1>
      <p style={{color:"#888",marginBottom:32,lineHeight:1.7}}>
        Your costume is now live across AU and NZ.
        {form.listingType === 'rental' && ' Interested renters will contact you to arrange details.'}
        {form.featured && ' Your listing is featured and will appear at the top of search results for 7 days.'}
      </p>
      <Link href="/browse" style={{background:"#800020",color:"white",fontWeight:700,padding:"14px 32px",borderRadius:10,textDecoration:"none",fontSize:15}}>Browse All Costumes</Link>
    </div>
  );

  return(
    <div style={{maxWidth:600,margin:"0 auto",padding:"40px 24px"}}>
      <h1 style={{fontSize:26,fontWeight:800,color:"#4a0e2e",marginBottom:4}}>List a Costume</h1>
      <p style={{color:"#aaa",fontSize:14,marginBottom:32}}>Step {step+1} of {STEPS.length} — {STEPS[step]}</p>

      <div style={{display:"flex",alignItems:"center",marginBottom:40}}>
        {STEPS.map((s,i)=>[
          <div key={s} style={{width:32,height:32,borderRadius:"50%",background:i<=step?"#800020":"#e5e5e5",color:i<=step?"white":"#aaa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,flexShrink:0}}>{i+1}</div>,
          i<STEPS.length-1&&<div key={s+"l"} style={{flex:1,height:2,background:i<step?"#800020":"#e5e5e5"}}/>
        ])}
      </div>

      {step===0&&(
        <div style={{display:"flex",flexDirection:"column",gap:20}}>

          {/* Sale vs Rental toggle */}
          <div>
            <label style={{display:"block",fontWeight:700,fontSize:14,marginBottom:8,color:"#4a0e2e"}}>Are you selling or renting this costume?</label>
            <div style={{display:"flex",gap:10}}>
              {[{v:"sale",l:"&#127991; For Sale",d:"Sell it outright"},{v:"rental",l:"&#128197; For Rent",d:"Lend it out, keep it"}].map(t=>(
                <button key={t.v} onClick={()=>set("listingType",t.v)}
                  style={{flex:1,padding:"14px 12px",borderRadius:10,border:"2px solid",
                    borderColor:form.listingType===t.v?"#800020":"#e5e5e5",
                    background:form.listingType===t.v?"#800020":"white",
                    color:form.listingType===t.v?"white":"#555",
                    fontWeight:700,fontSize:13,cursor:"pointer",textAlign:"center"}}>
                  <div dangerouslySetInnerHTML={{__html:t.l}}/>
                  <div style={{fontSize:11,fontWeight:400,opacity:0.8,marginTop:3}}>{t.d}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Condition</label>
            <div style={{display:"flex",gap:10}}>
              {["new","used"].map(t=><button key={t} onClick={()=>set("type",t)} style={{padding:"10px 20px",borderRadius:8,border:"2px solid",borderColor:form.type===t?"#800020":"#e5e5e5",background:form.type===t?"#800020":"white",color:form.type===t?"white":"#555",fontWeight:600,fontSize:13,cursor:"pointer"}}>{t==="new"?"New":"Used"}</button>)}
            </div>
          </div>

          <div><label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Title</label><input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. White Ballet Tutu - Age 8" style={inp}/></div>
          <div><label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Genre</label><select value={form.genre} onChange={e=>set("genre",e.target.value)} style={{...inp,background:"white"}}><option value="">Select...</option>{GENRES.map(g=><option key={g}>{g}</option>)}</select></div>
          <div><label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Size</label><select value={form.size} onChange={e=>set("size",e.target.value)} style={{...inp,background:"white"}}><option value="">Select...</option>{SIZES.map(s=><option key={s}>{s}</option>)}</select></div>
          <div>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Condition</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {CONDITIONS.map(c=><button key={c} onClick={()=>set("condition",c)} style={{padding:"10px",borderRadius:8,border:"2px solid",borderColor:form.condition===c?"#800020":"#e5e5e5",background:form.condition===c?"#800020":"white",color:form.condition===c?"white":"#555",fontSize:13,fontWeight:600,cursor:"pointer"}}>{c}</button>)}
            </div>
          </div>
          <div><label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Description</label><textarea value={form.desc} onChange={e=>set("desc",e.target.value)} rows={4} placeholder="Describe the costume..." style={{...inp,resize:"none"}}/></div>
        </div>
      )}

      {step===1&&(
        <div style={{border:"2px dashed #e8dcc8",borderRadius:16,padding:60,textAlign:"center",background:"#faf7f2"}}>
          <div style={{fontSize:52,marginBottom:16}}>&#128247;</div>
          <p style={{fontWeight:600,marginBottom:8}}>Upload costume photos</p>
          <p style={{fontSize:13,color:"#aaa",marginBottom:24}}>Up to 8 photos, max 20MB each</p>
          <button style={{background:"#800020",color:"white",padding:"10px 24px",borderRadius:8,border:"none",fontWeight:600,cursor:"pointer"}}>Choose Photos</button>
        </div>
      )}

      {step===2&&(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {form.listingType === 'sale' ? (
            <>
              <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Sale Price (NZD)</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#aaa"}}>$</span>
                <input type="number" value={form.price} onChange={e=>set("price",e.target.value)} placeholder="0.00" style={{...inp,paddingLeft:28}}/>
              </div>
              <p style={{fontSize:12,color:"#aaa"}}>Tip: pre-loved costumes sell for 30-60% of original price.</p>
            </>
          ) : (
            <>
              <div style={{padding:14,borderRadius:10,background:"#fff8e6",border:"1px solid #e8a838",marginBottom:4}}>
                <p style={{fontSize:13,color:"#4a0e2e",margin:0}}>&#128197; <strong>Rental listing</strong> — renters will contact you to arrange dates and payment. No online booking required.</p>
              </div>
              <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:4}}>Rental Price per Week (NZD)</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#aaa"}}>$</span>
                <input type="number" value={form.rentalPricePerWeek} onChange={e=>set("rentalPricePerWeek",e.target.value)} placeholder="0.00" style={{...inp,paddingLeft:28}}/>
              </div>
              <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:4,marginTop:8}}>Bond Amount (NZD) <span style={{fontWeight:400,color:"#aaa"}}>— optional</span></label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#aaa"}}>$</span>
                <input type="number" value={form.rentalBond} onChange={e=>set("rentalBond",e.target.value)} placeholder="0.00" style={{...inp,paddingLeft:28}}/>
              </div>
              <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:4,marginTop:8}}>Minimum Rental Period (weeks)</label>
              <select value={form.rentalMinWeeks} onChange={e=>set("rentalMinWeeks",e.target.value)} style={{...inp,background:"white"}}>
                {[1,2,3,4].map(w=><option key={w} value={w}>{w} week{w>1?'s':''}</option>)}
              </select>
              <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:4,marginTop:8}}>Availability Notes <span style={{fontWeight:400,color:"#aaa"}}>— optional</span></label>
              <input value={form.rentalAvailabilityNotes} onChange={e=>set("rentalAvailabilityNotes",e.target.value)} placeholder="e.g. Available Feb–Nov, not available school holidays" style={inp}/>
            </>
          )}

          {/* Featured listing option */}
          <div style={{marginTop:16,border:form.featured?'2px solid #c49a2a':'2px solid #e5e5e5',borderRadius:12,padding:20,background:form.featured?'#fffbf0':'white',cursor:'pointer'}} onClick={()=>set('featured',!form.featured)}>
            <div style={{display:'flex',alignItems:'center',gap:12}}>
              <div style={{width:24,height:24,borderRadius:6,border:form.featured?'none':'2px solid #ccc',background:form.featured?'#c49a2a':'white',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                {form.featured && <span style={{color:'white',fontSize:14,fontWeight:700}}>&#10003;</span>}
              </div>
              <div>
                <div style={{fontWeight:700,fontSize:15,color:'#4a0e2e'}}>&#11088; Feature this listing — $5 NZD</div>
                <p style={{fontSize:12,color:'#888',marginTop:4,lineHeight:1.5}}>Your listing appears first in search results with a gold highlight for 7 days. Get up to 3x more views!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {step===3&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          {[{v:"ship",l:"Ship to buyer",d:"Use a tracked courier"},{v:"pickup",l:"Local pickup only",d:"Buyer collects from you"},{v:"both",l:"Ship or pickup",d:"Buyer chooses"}].map(o=>(
            <button key={o.v} onClick={()=>set("shipping",o.v)} style={{textAlign:"left",padding:16,borderRadius:12,border:"2px solid",borderColor:form.shipping===o.v?"#800020":"#e5e5e5",background:form.shipping===o.v?"#fff5f7":"white",cursor:"pointer"}}>
              <div style={{fontWeight:600,fontSize:14}}>{o.l}</div>
              <div style={{fontSize:12,color:"#aaa",marginTop:3}}>{o.d}</div>
            </button>
          ))}
          <div style={{marginTop:8}}>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Your location</label>
            <input value={form.location} onChange={e=>set("location",e.target.value)} placeholder="e.g. Auckland, NZ" style={inp}/>
          </div>
        </div>
      )}

      {step===4&&(
        <div>
          <h3 style={{fontWeight:600,fontSize:16,marginBottom:20}}>Review your listing</h3>
          <div style={{background:"white",borderRadius:16,border:"1px solid #e8dcc8",padding:24}}>
            {[
              ["Type", form.listingType === 'sale' ? 'For Sale' : 'For Rent'],
              ["Condition",form.type],
              ["Title",form.title||"—"],
              ["Genre",form.genre||"—"],
              ["Size",form.size||"—"],
              ["Condition",form.condition||"—"],
              ...(form.listingType === 'sale'
                ? [["Price","$"+(form.price||"0")+" NZD"]]
                : [
                    ["Rent/week","$"+(form.rentalPricePerWeek||"0")+" NZD"],
                    ["Bond", form.rentalBond ? "$"+form.rentalBond+" NZD" : "None"],
                    ["Min. weeks", form.rentalMinWeeks],
                  ]
              ),
              ["Shipping",form.shipping],
              ["Location",form.location||"—"],
              ["Featured",form.featured?"⭐ Yes (+$5 NZD)":"No"],
            ].map(([k,v])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f5f5f5",fontSize:14}}>
                <span style={{color:"#aaa"}}>{k}</span>
                <span style={{fontWeight:600,color:k==="Featured"&&form.featured?"#c49a2a":"inherit"}}>{v}</span>
              </div>
            ))}
          </div>
          {form.listingType === 'rental' && (
            <div style={{marginTop:16,padding:16,borderRadius:12,background:'#fff8e6',border:'1px solid #e8a838'}}>
              <p style={{fontSize:13,color:'#4a0e2e',margin:0}}>&#128197; <strong>Rental listing:</strong> Interested renters will click "Enquire to Rent" and contact you directly to arrange dates and payment.</p>
            </div>
          )}
          {form.featured && (
            <div style={{marginTop:12,padding:16,borderRadius:12,background:'#fffbf0',border:'1px solid #c49a2a'}}>
              <p style={{fontSize:13,color:'#4a0e2e',margin:0}}><strong>&#11088; Featured Listing:</strong> $5 NZD will be charged when your listing goes live.</p>
            </div>
          )}
        </div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",marginTop:36}}>
        {step>0
          ?<button onClick={()=>setStep(s=>s-1)} style={{padding:"12px 24px",borderRadius:10,border:"1px solid #e5e5e5",background:"white",fontSize:14,fontWeight:600,cursor:"pointer"}}>Back</button>
          :<div/>
        }
        {step<STEPS.length-1
          ?<button onClick={()=>setStep(s=>s+1)} style={{padding:"12px 28px",borderRadius:10,border:"none",background:"#800020",color:"white",fontSize:14,fontWeight:700,cursor:"pointer"}}>Next</button>
          :<button onClick={handlePublish} style={{padding:"12px 28px",borderRadius:10,border:"none",background:"#e8a838",color:"#4a0e2e",fontSize:15,fontWeight:700,cursor:"pointer"}}>Publish Listing &#127881;</button>
        }
      </div>
    </div>
  );
                  }
