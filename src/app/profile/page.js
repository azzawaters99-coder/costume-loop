"use client";
import { useState } from "react";
export default function Profile(){
  const [form,setForm]=useState({firstName:"Taylor",lastName:"W",displayName:"Taylor W",bio:""});
  const [saved,setSaved]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  return(
    <div style={{maxWidth:640,margin:"0 auto",padding:"48px 24px"}}>
      <h1 style={{fontSize:26,fontWeight:800,color:"#4a0e2e",marginBottom:32}}>Profile Settings</h1>
      <div style={{display:"flex",flexDirection:"column",gap:24}}>
        <div style={{textAlign:"center"}}>
          <div style={{width:96,height:96,borderRadius:"50%",background:"#800020",color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,fontWeight:700,margin:"0 auto 12px"}}>TW</div>
          <button style={{fontSize:13,color:"#800020",background:"none",border:"1px solid #800020",borderRadius:8,padding:"6px 16px",cursor:"pointer"}}>Change photo</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div><label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>First name</label><input value={form.firstName} onChange={e=>set("firstName",e.target.value)} style={{width:"100%",border:"1px solid #e5e5e5",borderRadius:10,padding:"11px 14px",fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
          <div><label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>Last name</label><input value={form.lastName} onChange={e=>set("lastName",e.target.value)} style={{width:"100%",border:"1px solid #e5e5e5",borderRadius:10,padding:"11px 14px",fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
        </div>
        <div><label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>Display name</label><input value={form.displayName} onChange={e=>set("displayName",e.target.value)} style={{width:"100%",border:"1px solid #e5e5e5",borderRadius:10,padding:"11px 14px",fontSize:14,outline:"none",boxSizing:"border-box"}}/></div>
        <div><label style={{display:"block",fontWeight:600,fontSize:13,marginBottom:6}}>Bio</label><textarea value={form.bio} onChange={e=>set("bio",e.target.value)} rows={4} placeholder="Tell the community about yourself..." style={{width:"100%",border:"1px solid #e5e5e5",borderRadius:10,padding:"11px 14px",fontSize:14,outline:"none",resize:"none",boxSizing:"border-box",fontFamily:"inherit"}}/></div>
        <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2500);}} style={{background:saved?"#16a34a":"#800020",color:"white",fontWeight:700,padding:"13px",borderRadius:10,border:"none",fontSize:15,cursor:"pointer"}}>{saved?"Saved!":"Save Changes"}</button>
      </div>
    </div>
  );
}
