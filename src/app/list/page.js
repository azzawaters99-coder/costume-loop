"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

const GENRES = ["Ballet","Contemporary","Jazz & Tap","Cultural & Character","Acrobatics","Hip Hop","Musical Theatre","Duos & Trios","Group Costumes"];
const CONDITIONS = ["New with tags","Like new","Good","Fair"];
const SIZES = ["Age 2-4","Age 4-6","Age 6-8","Age 8-10","Age 10-12","Age 12-14","Adult XS","Adult S","Adult M","Adult L","Adult XL"];

// Merged to 4 steps: Details, Photos, Pricing & Shipping, Review
const STEPS = [
  { label: "Details",  icon: "📋" },
  { label: "Photos",   icon: "📷" },
  { label: "Pricing",  icon: "💰" },
  { label: "Review",   icon: "✅" },
];

const MEASUREMENTS = [
  { key: "chest",  label: "Chest",  hint: "Fullest part of chest", color: "#e0007a" },
  { key: "waist",  label: "Waist",  hint: "Narrowest part",        color: "#7cb900" },
  { key: "hips",   label: "Hips",   hint: "Fullest part of hips",  color: "#00bcd4" },
  { key: "height", label: "Height", hint: "Head to toe",           color: "#ff8c00" },
  { key: "inseam", label: "Inseam", hint: "Crotch to ankle",       color: "#9c27b0" },
];

const DRAFT_KEY = "costume_loop_draft";

function saveDraft(form) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(form)); } catch(e) {}
}
function loadDraft() {
  try { const d = localStorage.getItem(DRAFT_KEY); return d ? JSON.parse(d) : null; } catch(e) { return null; }
}
function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch(e) {}
}

const DEFAULT_FORM = {
  listingMode: "sale", type: "used", title: "", genre: "", size: "",
  condition: "", desc: "", price: "", rentalPricePerWeek: "", rentalBond: "",
  rentalMinWeeks: "1", rentalAvailabilityNotes: "", shipping: "both", location: "",
  measureChest: "", measureWaist: "", measureHips: "", measureHeight: "", measureInseam: "",
};

export default function ListPage() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [images, setImages] = useState([]); // { file, preview }
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [publishedId, setPublishedId] = useState(null);
  const [hasDraft, setHasDraft] = useState(false);
  const fileInputRef = useRef(null);

  const set = (k, v) => setForm(f => { const n = { ...f, [k]: v }; saveDraft(n); return n; });
  const inp = { width:"100%",border:"1px solid #e5e5e5",borderRadius:10,padding:"12px 16px",fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit",background:"white" };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    // Check for saved draft
    const draft = loadDraft();
    if (draft && draft.title) setHasDraft(true);
    return () => subscription.unsubscribe();
  }, []);

  function handleRestoreDraft() {
    const draft = loadDraft();
    if (draft) { setForm(draft); setHasDraft(false); }
  }

  function handleImageSelect(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newImages = files.slice(0, 8 - images.length).map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
  }

  function removeImage(i) {
    setImages(prev => prev.filter((_, idx) => idx !== i));
  }

  // Validation per step
  function validateStep(s) {
    const e = {};
    if (s === 0) {
      if (!form.title.trim())     e.title = "Please enter a title";
      if (!form.genre)            e.genre = "Please select a genre";
      if (!form.size)             e.size  = "Please select a size";
      if (!form.condition)        e.condition = "Please select a condition";
    }
    if (s === 1) {
      if (images.length === 0)    e.images = "Please add at least one photo";
    }
    if (s === 2) {
      const isRental = form.listingMode === "rental";
      if (isRental && !form.rentalPricePerWeek) e.price = "Please enter a rental price";
      if (!isRental && !form.price)             e.price = "Please enter a sale price";
      if (!form.location.trim())  e.location = "Please enter your location";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validateStep(step)) setStep(s => s + 1);
  }

  async function handlePublish() {
    if (!validateStep(step)) return;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setUploadingImages(true);
    let imageUrls = [];

    // Upload images to Supabase Storage
    for (const img of images) {
      const ext = img.file.name.split('.').pop();
      const path = `listings/${session.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('listing-images')
        .upload(path, img.file, { contentType: img.file.type });
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage.from('listing-images').getPublicUrl(path);
        imageUrls.push(publicUrl);
      }
    }
    setUploadingImages(false);

    const isRental = form.listingMode === "rental";
    const insertData = {
      user_id: session.user.id,
      listing_type: form.listingMode,
      type: form.type,
      title: form.title,
      genre: form.genre,
      size: form.size,
      condition: form.condition,
      description: form.desc,
      shipping: form.shipping,
      location: form.location,
      status: "active",
      images: imageUrls,
      price: isRental ? (parseFloat(form.rentalPricePerWeek) || 0) : (parseFloat(form.price) || 0),
      measure_chest:  form.measureChest  ? parseFloat(form.measureChest)  : null,
      measure_waist:  form.measureWaist  ? parseFloat(form.measureWaist)  : null,
      measure_hips:   form.measureHips   ? parseFloat(form.measureHips)   : null,
      measure_height: form.measureHeight ? parseFloat(form.measureHeight) : null,
      measure_inseam: form.measureInseam ? parseFloat(form.measureInseam) : null,
    };
    if (isRental) {
      insertData.rental_price_per_week   = parseFloat(form.rentalPricePerWeek) || 0;
      insertData.rental_bond             = form.rentalBond ? parseFloat(form.rentalBond) : null;
      insertData.rental_min_weeks        = parseInt(form.rentalMinWeeks) || 1;
      insertData.rental_availability_notes = form.rentalAvailabilityNotes || null;
    }

    const { data, error } = await supabase.from("listings").insert(insertData).select('id').single();
    if (error) { console.error(error); alert("Error publishing: " + error.message); return; }
    clearDraft();
    setPublishedId(data?.id);
    setDone(true);
  }

  // ─── STATES ───────────────────────────────────────────────────

  if (authLoading) return (
    <div style={{minHeight:"60vh",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{color:"#aaa"}}>Loading...</p>
    </div>
  );

  if (!user) return (
    <div style={{maxWidth:480,margin:"80px auto",textAlign:"center",padding:"0 24px"}}>
      <div style={{fontSize:64,marginBottom:24}}>🔒</div>
      <h1 style={{fontSize:28,fontWeight:800,color:"#4a0e2e",marginBottom:16}}>Sign In to List a Costume</h1>
      <p style={{color:"#888",marginBottom:32,lineHeight:1.7}}>You need to be signed in before you can list a costume.</p>
      <Link href="/login?redirect=/list" style={{display:"inline-block",background:"#800020",color:"white",fontWeight:700,padding:"14px 32px",borderRadius:10,textDecoration:"none",fontSize:15}}>
        Sign In or Create Account
      </Link>
    </div>
  );

  if (done) return (
    <div style={{maxWidth:480,margin:"80px auto",textAlign:"center",padding:"0 24px"}}>
      <div style={{fontSize:72,marginBottom:16}}>🎉</div>
      <h1 style={{fontSize:28,fontWeight:800,color:"#4a0e2e",marginBottom:12}}>Your costume is live!</h1>
      <p style={{color:"#888",marginBottom:32,lineHeight:1.7}}>It's now visible to buyers and renters across AU & NZ.</p>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {publishedId && (
          <Link href={`/listings/${publishedId}`} style={{display:"block",padding:"14px",borderRadius:10,background:"#800020",color:"white",textDecoration:"none",fontWeight:700,fontSize:15}}>
            👁️ View My Listing
          </Link>
        )}
        <Link href="/my-listings" style={{display:"block",padding:"14px",borderRadius:10,background:"#f2e8d5",color:"#4a0e2e",textDecoration:"none",fontWeight:700,fontSize:15}}>
          📋 My Listings
        </Link>
        <button onClick={() => { setForm(DEFAULT_FORM); setImages([]); setStep(0); setDone(false); setPublishedId(null); }}
          style={{padding:"14px",borderRadius:10,border:"1px solid #e5e5e5",background:"white",color:"#4a0e2e",fontWeight:600,fontSize:15,cursor:"pointer"}}>
          + List Another Costume
        </button>
        <Link href="/browse" style={{display:"block",padding:"14px",borderRadius:10,border:"1px solid #e5e5e5",color:"#888",textDecoration:"none",fontSize:14}}>
          Browse Costumes
        </Link>
      </div>
    </div>
  );

  const isRental = form.listingMode === "rental";
  const E = (k) => errors[k] ? (
    <p style={{fontSize:12,color:"#c00",marginTop:4}}>{errors[k]}</p>
  ) : null;

  return (
    <div style={{maxWidth:620,margin:"0 auto",padding:"40px 24px"}}>

      {/* Draft restore banner */}
      {hasDraft && (
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",background:"#fff8e6",border:"1px solid #f0d080",borderRadius:10,marginBottom:24,fontSize:13}}>
          <span>📝 You have an unsaved draft. Want to continue where you left off?</span>
          <div style={{display:"flex",gap:8,marginLeft:12,flexShrink:0}}>
            <button onClick={handleRestoreDraft} style={{padding:"6px 14px",borderRadius:8,border:"none",background:"#c49a2a",color:"white",fontWeight:700,fontSize:12,cursor:"pointer"}}>Restore</button>
            <button onClick={() => { clearDraft(); setHasDraft(false); }} style={{padding:"6px 12px",borderRadius:8,border:"1px solid #e5e5e5",background:"white",color:"#888",fontSize:12,cursor:"pointer"}}>Dismiss</button>
          </div>
        </div>
      )}

      <h1 style={{fontSize:26,fontWeight:800,color:"#4a0e2e",marginBottom:4}}>List a Costume</h1>
      <p style={{color:"#aaa",fontSize:14,marginBottom:32}}>Step {step+1} of {STEPS.length} — {STEPS[step].label}</p>

      {/* Stepper with labels */}
      <div style={{display:"flex",alignItems:"center",marginBottom:40}}>
        {STEPS.map((s, i) => (
          <>
            <div key={s.label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:i<=step?"#800020":"#e5e5e5",color:i<=step?"white":"#aaa",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                {i < step ? "✓" : s.icon}
              </div>
              <span style={{fontSize:11,fontWeight:i===step?700:400,color:i===step?"#800020":"#aaa",whiteSpace:"nowrap"}}>{s.label}</span>
            </div>
            {i < STEPS.length-1 && <div key={s.label+"l"} style={{flex:1,height:2,background:i<step?"#800020":"#e5e5e5",marginBottom:18}}/>}
          </>
        ))}
      </div>

      {/* ── STEP 0: Details ── */}
      {step===0 && (
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <div>
            <label style={{display:"block",fontWeight:700,fontSize:15,marginBottom:10,color:"#4a0e2e"}}>What are you doing with this costume?</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {[{val:"sale",label:"🏷️ Selling",sub:"One-off sale"},{val:"rental",label:"🔄 Renting Out",sub:"Lend by the week"}].map(opt=>(
                <button key={opt.val} onClick={()=>set("listingMode",opt.val)} style={{padding:"14px 12px",borderRadius:10,border:"2px solid",borderColor:form.listingMode===opt.val?"#800020":"#e5e5e5",background:form.listingMode===opt.val?"#fff5f7":"white",cursor:"pointer",textAlign:"left"}}>
                  <div style={{fontWeight:700,fontSize:14,color:"#4a0e2e"}}>{opt.label}</div>
                  <div style={{fontSize:12,color:"#999",marginTop:3}}>{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Item is</label>
            <div style={{display:"flex",gap:10}}>
              {["new","used"].map(t=>(
                <button key={t} onClick={()=>set("type",t)} style={{padding:"10px 20px",borderRadius:8,border:"2px solid",borderColor:form.type===t?"#800020":"#e5e5e5",background:form.type===t?"#800020":"white",color:form.type===t?"white":"#555",fontWeight:600,cursor:"pointer"}}>
                  {t==="new"?"New":"Used"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Title *</label>
            <input value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. White Ballet Tutu - Age 8"
              style={{...inp,borderColor:errors.title?"#c00":"#e5e5e5"}}/>
            {E("title")}
          </div>
          <div>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Genre *</label>
            <select value={form.genre} onChange={e=>set("genre",e.target.value)} style={{...inp,borderColor:errors.genre?"#c00":"#e5e5e5"}}>
              <option value="">Select...</option>{GENRES.map(g=><option key={g}>{g}</option>)}
            </select>
            {E("genre")}
          </div>
          <div>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Approx. Size *</label>
            <select value={form.size} onChange={e=>set("size",e.target.value)} style={{...inp,borderColor:errors.size?"#c00":"#e5e5e5"}}>
              <option value="">Select...</option>{SIZES.map(s=><option key={s}>{s}</option>)}
            </select>
            {E("size")}
          </div>

          {/* Measurements */}
          <div style={{background:"#faf7f2",border:"1px solid #e8dcc8",borderRadius:12,padding:20}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
              <span style={{fontSize:18}}>📏</span>
              <label style={{fontWeight:700,fontSize:15,color:"#4a0e2e"}}>Measurements <span style={{fontWeight:400,color:"#aaa",fontSize:13}}>(cm, optional)</span></label>
            </div>
            <p style={{fontSize:12,color:"#999",marginBottom:16,lineHeight:1.5}}>Accurate measurements help buyers find the right fit.</p>
            <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
              <img src="/measure-guide.png" alt="How to measure" style={{width:110,borderRadius:8,flexShrink:0}}/>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:10}}>
                {MEASUREMENTS.map(m=>(
                  <div key={m.key}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:10,height:10,borderRadius:"50%",background:m.color,flexShrink:0}}/>
                      <label style={{fontSize:12,fontWeight:700,color:m.color,minWidth:48}}>{m.label}</label>
                      <div style={{position:"relative",flex:1}}>
                        <input type="number" min="0" max="250"
                          value={form["measure"+m.key.charAt(0).toUpperCase()+m.key.slice(1)]}
                          onChange={e=>set("measure"+m.key.charAt(0).toUpperCase()+m.key.slice(1),e.target.value)}
                          placeholder="cm"
                          style={{width:"100%",border:"1.5px solid",borderColor:m.color+"44",borderRadius:8,padding:"7px 28px 7px 10px",fontSize:13,outline:"none",boxSizing:"border-box",background:"white"}}/>
                        <span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",fontSize:11,color:"#bbb",pointerEvents:"none"}}>cm</span>
                      </div>
                    </div>
                    <p style={{fontSize:10,color:"#bbb",marginTop:2,marginLeft:66}}>{m.hint}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Condition *</label>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {CONDITIONS.map(c=>(
                <button key={c} onClick={()=>set("condition",c)} style={{padding:"10px",borderRadius:8,border:"2px solid",borderColor:form.condition===c?"#800020":"#e5e5e5",background:form.condition===c?"#800020":"white",color:form.condition===c?"white":"#555",fontSize:13,fontWeight:600,cursor:"pointer"}}>
                  {c}
                </button>
              ))}
            </div>
            {E("condition")}
          </div>
          <div>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Description</label>
            <textarea value={form.desc} onChange={e=>set("desc",e.target.value)} rows={4}
              placeholder="Describe the costume, any wear or damage, where it's from..."
              style={{...inp,resize:"vertical"}}/>
          </div>
        </div>
      )}

      {/* ── STEP 1: Photos ── */}
      {step===1 && (
        <div>
          <p style={{fontSize:14,color:"#888",marginBottom:20}}>Add up to 8 photos. Clear, well-lit photos get significantly more enquiries.</p>
          {errors.images && <p style={{fontSize:13,color:"#c00",background:"#fff0f0",padding:"10px 14px",borderRadius:8,marginBottom:16}}>{errors.images}</p>}

          {/* Hidden file input */}
          <input ref={fileInputRef} type="file" accept="image/*" multiple style={{display:"none"}}
            onChange={handleImageSelect}/>

          {images.length === 0 ? (
            <div onClick={()=>fileInputRef.current?.click()}
              style={{border:"2px dashed #e8dcc8",borderRadius:16,padding:"60px 24px",textAlign:"center",background:"#faf7f2",cursor:"pointer",transition:"border-color 0.15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor="#800020"}
              onMouseLeave={e=>e.currentTarget.style.borderColor="#e8dcc8"}>
              <div style={{fontSize:52,marginBottom:12}}>📷</div>
              <p style={{fontWeight:700,fontSize:16,color:"#4a0e2e",marginBottom:6}}>Click to add photos</p>
              <p style={{fontSize:13,color:"#aaa"}}>JPG, PNG or HEIC · Up to 8 photos · Max 20MB each</p>
            </div>
          ) : (
            <div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(140px,1fr))",gap:12,marginBottom:16}}>
                {images.map((img,i)=>(
                  <div key={i} style={{position:"relative",borderRadius:10,overflow:"hidden",aspectRatio:"1",background:"#f2e8d5"}}>
                    <img src={img.preview} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    {i===0 && <span style={{position:"absolute",bottom:6,left:6,fontSize:11,fontWeight:700,background:"rgba(0,0,0,0.55)",color:"white",padding:"2px 8px",borderRadius:10}}>Cover</span>}
                    <button onClick={()=>removeImage(i)} style={{position:"absolute",top:6,right:6,width:24,height:24,borderRadius:"50%",background:"rgba(0,0,0,0.5)",border:"none",color:"white",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",lineHeight:1}}>×</button>
                  </div>
                ))}
                {images.length < 8 && (
                  <div onClick={()=>fileInputRef.current?.click()}
                    style={{borderRadius:10,border:"2px dashed #e8dcc8",aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:"#faf7f2",gap:6}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#800020"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#e8dcc8"}>
                    <span style={{fontSize:24,color:"#ccc"}}>+</span>
                    <span style={{fontSize:11,color:"#bbb"}}>Add more</span>
                  </div>
                )}
              </div>
              <p style={{fontSize:12,color:"#aaa"}}>First photo is the cover image. {8-images.length} slot{8-images.length!==1?"s":""} remaining.</p>
            </div>
          )}

          <div style={{marginTop:20,padding:"14px 16px",background:"#f0f9f4",borderRadius:10,border:"1px solid #c8e6d4"}}>
            <p style={{fontSize:13,fontWeight:600,color:"#2d6a4f",marginBottom:6}}>📸 Photo tips</p>
            <ul style={{fontSize:12,color:"#555",lineHeight:1.8,paddingLeft:18,margin:0}}>
              <li>Use natural daylight when possible</li>
              <li>Lay flat or hang on a hanger for clarity</li>
              <li>Include close-ups of any wear, sequins or details</li>
              <li>A plain background makes colours pop</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── STEP 2: Pricing & Shipping ── */}
      {step===2 && (
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          {!isRental ? (
            <div>
              <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Sale Price (NZD) *</label>
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#aaa"}}>$</span>
                <input type="number" value={form.price} onChange={e=>set("price",e.target.value)}
                  placeholder="0.00" style={{...inp,paddingLeft:28,borderColor:errors.price?"#c00":"#e5e5e5"}}/>
              </div>
              {E("price")}
              <p style={{fontSize:12,color:"#aaa",marginTop:6}}>💡 Pre-loved costumes sell best at 30–60% of original price.</p>
            </div>
          ) : (
            <>
              <div style={{padding:14,borderRadius:10,background:"#f0f9ff",border:"1px solid #b3d9ff"}}>
                <p style={{fontSize:13,color:"#1a5276",fontWeight:600}}>🔄 Rental Listing</p>
                <p style={{fontSize:12,color:"#2980b9",marginTop:4}}>Renters will contact you to arrange payment directly — no online payment needed.</p>
              </div>
              <div>
                <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Price per Week (NZD) *</label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#aaa"}}>$</span>
                  <input type="number" value={form.rentalPricePerWeek} onChange={e=>set("rentalPricePerWeek",e.target.value)}
                    placeholder="0.00" style={{...inp,paddingLeft:28,borderColor:errors.price?"#c00":"#e5e5e5"}}/>
                </div>
                {E("price")}
              </div>
              <div>
                <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Bond Amount (NZD) <span style={{fontWeight:400,color:"#aaa"}}>(optional)</span></label>
                <div style={{position:"relative"}}>
                  <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#aaa"}}>$</span>
                  <input type="number" value={form.rentalBond} onChange={e=>set("rentalBond",e.target.value)} placeholder="0.00" style={{...inp,paddingLeft:28}}/>
                </div>
              </div>
              <div>
                <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Minimum Rental Period</label>
                <select value={form.rentalMinWeeks} onChange={e=>set("rentalMinWeeks",e.target.value)} style={inp}>
                  <option value="1">1 week minimum</option>
                  <option value="2">2 weeks minimum</option>
                  <option value="3">3 weeks minimum</option>
                  <option value="4">4 weeks minimum</option>
                </select>
              </div>
              <div>
                <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Availability Notes <span style={{fontWeight:400,color:"#aaa"}}>(optional)</span></label>
                <input value={form.rentalAvailabilityNotes} onChange={e=>set("rentalAvailabilityNotes",e.target.value)}
                  placeholder="e.g. Available Feb–Nov, not available school holidays" style={inp}/>
              </div>
            </>
          )}

          {/* Shipping */}
          <div style={{marginTop:8}}>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:10}}>Shipping</label>
            {[{v:"both",l:"Ship or pickup",d:"Buyer / renter chooses"},{v:"ship",l:"Ship only",d:"Use a tracked courier"},{v:"pickup",l:"Local pickup only",d:"They collect from you"}].map(o=>(
              <button key={o.v} onClick={()=>set("shipping",o.v)} style={{display:"flex",alignItems:"center",gap:12,width:"100%",textAlign:"left",padding:"12px 16px",borderRadius:10,border:"2px solid",borderColor:form.shipping===o.v?"#800020":"#e5e5e5",background:form.shipping===o.v?"#fff5f7":"white",cursor:"pointer",marginBottom:8}}>
                <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid",borderColor:form.shipping===o.v?"#800020":"#ccc",background:form.shipping===o.v?"#800020":"white",flexShrink:0}}/>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{o.l}</div>
                  <div style={{fontSize:12,color:"#aaa"}}>{o.d}</div>
                </div>
              </button>
            ))}
          </div>

          <div>
            <label style={{display:"block",fontWeight:600,fontSize:14,marginBottom:8}}>Your Location *</label>
            <input value={form.location} onChange={e=>set("location",e.target.value)}
              placeholder="e.g. Auckland, NZ" style={{...inp,borderColor:errors.location?"#c00":"#e5e5e5"}}/>
            {E("location")}
          </div>
        </div>
      )}

      {/* ── STEP 3: Review ── */}
      {step===3 && (
        <div>
          <div style={{background:"white",borderRadius:16,border:"1px solid #e8dcc8",overflow:"hidden",marginBottom:16}}>
            {/* Image preview strip */}
            {images.length > 0 && (
              <div style={{display:"flex",gap:4,padding:12,background:"#f9f5f0",borderBottom:"1px solid #e8dcc8",overflowX:"auto"}}>
                {images.map((img,i)=>(
                  <img key={i} src={img.preview} alt="" style={{width:60,height:60,objectFit:"cover",borderRadius:6,flexShrink:0,border:i===0?"2px solid #800020":"2px solid transparent"}}/>
                ))}
              </div>
            )}
            <div style={{padding:20}}>
              {[
                ["Type",      isRental?"🔄 Rental":"🏷️ For Sale"],
                ["Title",     form.title],
                ["Genre",     form.genre],
                ["Size",      form.size],
                ["Condition", form.condition],
                ...(isRental ? [
                  ["Price/week", "$"+form.rentalPricePerWeek+" NZD"],
                  ...(form.rentalBond ? [["Bond","$"+form.rentalBond+" NZD"]] : []),
                  ["Min. rental", form.rentalMinWeeks+" week(s)"],
                ] : [
                  ["Sale price", "$"+form.price+" NZD"],
                ]),
                ["Shipping",  form.shipping],
                ["Location",  form.location],
                ...(form.measureChest||form.measureWaist||form.measureHips||form.measureHeight||form.measureInseam ? [
                  ["Measurements", [
                    form.measureChest  && `Chest ${form.measureChest}cm`,
                    form.measureWaist  && `Waist ${form.measureWaist}cm`,
                    form.measureHips   && `Hips ${form.measureHips}cm`,
                    form.measureHeight && `Height ${form.measureHeight}cm`,
                    form.measureInseam && `Inseam ${form.measureInseam}cm`,
                  ].filter(Boolean).join(" · ")],
                ] : []),
              ].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #f5f5f5",fontSize:14}}>
                  <span style={{color:"#aaa",flexShrink:0,marginRight:16}}>{k}</span>
                  <span style={{fontWeight:600,color:"#4a0e2e",textAlign:"right"}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
          {form.desc && (
            <div style={{background:"white",borderRadius:12,border:"1px solid #e8dcc8",padding:16,marginBottom:16}}>
              <p style={{fontSize:12,color:"#aaa",marginBottom:6}}>Description</p>
              <p style={{fontSize:14,color:"#555",lineHeight:1.6}}>{form.desc}</p>
            </div>
          )}
          <div style={{padding:"12px 16px",background:"#f0f9f4",borderRadius:10,border:"1px solid #c8e6d4",fontSize:13,color:"#2d6a4f"}}>
            ✅ Everything look good? Hit <strong>Publish</strong> to make your listing live.
          </div>
        </div>
      )}

      {/* Nav buttons */}
      <div style={{display:"flex",justifyContent:"space-between",marginTop:36,gap:12}}>
        {step > 0
          ? <button onClick={()=>setStep(s=>s-1)} style={{padding:"12px 24px",borderRadius:10,border:"1px solid #e5e5e5",background:"white",fontSize:14,fontWeight:600,cursor:"pointer"}}>← Back</button>
          : <div/>
        }
        {step < STEPS.length-1
          ? <button onClick={handleNext} style={{padding:"12px 32px",borderRadius:10,border:"none",background:"#800020",color:"white",fontSize:14,fontWeight:700,cursor:"pointer"}}>
              Next: {STEPS[step+1].label} →
            </button>
          : <button onClick={handlePublish} disabled={uploadingImages}
              style={{padding:"12px 32px",borderRadius:10,border:"none",background:"#e8a838",color:"#4a0e2e",fontSize:15,fontWeight:700,cursor:"pointer",opacity:uploadingImages?0.7:1}}>
              {uploadingImages ? "Uploading..." : "🎉 Publish Listing"}
            </button>
        }
      </div>
    </div>
  );
}
