export default function Inbox(){
  return(
    <div style={{maxWidth:800,margin:"0 auto",padding:"48px 24px"}}>
      <h1 style={{fontSize:26,fontWeight:800,color:"#4a0e2e",marginBottom:8}}>Inbox</h1>
      <p style={{color:"#aaa",marginBottom:32}}>Your messages with buyers and sellers</p>
      <div style={{background:"white",borderRadius:16,border:"1px solid #e8dcc8",padding:60,textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:16}}>✉️</div>
        <p style={{fontWeight:600,fontSize:16,marginBottom:8}}>No messages yet</p>
        <p style={{fontSize:14,color:"#aaa"}}>When you buy or sell a costume, your conversations will appear here.</p>
      </div>
    </div>
  );
}
