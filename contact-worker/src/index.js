// Bidova public contact intake. Does not grant any website admin access.
const ALLOWED_ORIGIN = 'https://bidova.github.io';
// Recipient is injected as a private Worker environment secret, never in source code.
const TOPICS = Object.freeze({
  demo: 'Request a Demo',
  software: 'Interested in Bidova',
  support: 'Technical Support',
  business: 'Business Inquiry',
  other: 'Other'
});
function cors(origin) {
  return origin === ALLOWED_ORIGIN ? {
    'access-control-allow-origin': ALLOWED_ORIGIN,
    'access-control-allow-methods': 'POST, OPTIONS',
    'access-control-allow-headers': 'Content-Type',
    'vary': 'Origin'
  } : {'vary':'Origin'};
}
function reply(data,status=200,origin='') {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...cors(origin),
      'content-type':'application/json; charset=utf-8',
      'cache-control':'no-store',
      'x-content-type-options':'nosniff',
      'referrer-policy':'no-referrer'
    }
  });
}
function plain(value,max,required=false) {
  if(typeof value !== 'string')return null;
  const text=value.trim();
  if(text.length>max||(required&&!text))return null;
  return text;
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function validEmail(value) {
  return typeof value === 'string' && value.length<=254 &&
    /^[^\s@<>\r\n]{1,64}@[^\s@<>\r\n]{1,180}\.[a-zA-Z]{2,}$/.test(value);
}
export default {
  async fetch(request,env) {
    const RECIPIENT = env.CONTACT_RECIPIENT;
    const origin=request.headers.get('Origin')||'';
    if(origin!==ALLOWED_ORIGIN)return reply({ok:false,message:'Origin not authorized'},403);
    if(request.method==='OPTIONS')return new Response(null,{status:204,headers:cors(origin)});
    if(request.method!=='POST')return reply({ok:false,message:'Method not allowed'},405,origin);
    if(!request.headers.get('content-type')?.startsWith('application/json'))
      return reply({ok:false,message:'JSON required'},415,origin);
    const length=Number(request.headers.get('Content-Length')||0);
    if(length>7000)return reply({ok:false,message:'Request too large'},413,origin);
    if(!env.RESEND_API_KEY||!env.TURNSTILE_SECRET_KEY||!env.FROM_EMAIL||!validEmail(RECIPIENT))
      return reply({ok:false,message:'Contact service is not configured. Please email us directly.'},503,origin);
    let body;
    try {
      const raw=await request.text();
      if(raw.length>7000)return reply({ok:false,message:'Request too large'},413,origin);
      body=JSON.parse(raw);
    }catch {return reply({ok:false,message:'Invalid request'},400,origin)}
    if(!body||typeof body!=='object'||Array.isArray(body))return reply({ok:false,message:'Invalid request'},400,origin);
    // Bot honeypot: do not deliver bogus messages.
    if(body.website)return reply({ok:true,message:'Request received'},200,origin);
    const name=plain(body.name,100,true);
    const company=plain(body.company||'',120);
    const message=plain(body.message,2500,true);
    const email=plain(body.email,254,true);
    const topic=plain(body.topic,32,true);
    const token=plain(body.turnstileToken,4096,true);
    if(!name||name.length<2||company===null||!email||!validEmail(email)||!message||message.length<10||!Object.hasOwn(TOPICS,topic)||!token)
      return reply({ok:false,message:'Check the contact form fields and try again.'},400,origin);
    // Verify the challenge server-side. Never trust a client-only captcha.
    let validated;
    try{
      const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
        method:'POST',
        headers:{'content-type':'application/x-www-form-urlencoded'},
        body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token,
          remoteip:request.headers.get('CF-Connecting-IP')||''})
      });
      validated=await verify.json();
    }catch{return reply({ok:false,message:'Spam verification is temporarily unavailable.'},503,origin)}
    if(validated?.success!==true||validated.hostname!=='bidova.github.io'||validated.action!=='contact')
      return reply({ok:false,message:'Spam verification failed. Please refresh and retry.'},403,origin);
    const topicLabel=TOPICS[topic];
    const textBody=[
      'New Bidova website inquiry', '', 'Name: '+name,
      'Email: '+email, 'Company: '+(company||'(not provided)'),
      'Topic: '+topicLabel, '', 'Message:',message, '',
      'Reply directly to this message to contact the sender.'
    ].join('\n');
    const htmlBody='<h2>New Bidova website inquiry</h2>'+
      '<p><strong>Name:</strong> '+escapeHTML(name)+'</p>'+
      '<p><strong>Email:</strong> '+escapeHTML(email)+'</p>'+
      '<p><strong>Company:</strong> '+escapeHTML(company||'(not provided)')+'</p>'+
      '<p><strong>Topic:</strong> '+escapeHTML(topicLabel)+'</p>'+
      '<p><strong>Message:</strong></p><p style="white-space:pre-wrap">'+escapeHTML(message)+'</p>'+
      '<p>Use Reply to respond to the sender.</p>';
    try {
      const send=await fetch('https://api.resend.com/emails',{
        method:'POST',
        headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'content-type':'application/json'},
        body:JSON.stringify({
          from:env.FROM_EMAIL,
          to:[RECIPIENT],
          reply_to:email,
          subject:'Bidova website inquiry — '+topicLabel,
          text:textBody,
          html:htmlBody
        })
      });
      const result=await send.json().catch(()=>({}));
      if(!send.ok||!result.id) {
        // Do not reveal provider diagnostics or secrets to visitors.
        return reply({ok:false,message:'Email delivery is unavailable. Please contact us directly at '+RECIPIENT+'.'},502,origin);
      }
      return reply({ok:true,message:'Your inquiry has been accepted for email delivery.'},200,origin);
    } catch{
      return reply({ok:false,message:'Unable to submit right now. Please email '+RECIPIENT+' directly.'},502,origin);
    }
  }
};
