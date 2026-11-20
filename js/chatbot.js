/* CHATBOT — rule-based intake assistant (Intaker-style flow).
   10 case-type quick replies → guided intake → FormSubmit lead.
   Free-text routed by keyword intents. Upgrade path: swap handleText()
   for an LLM call via a Cloudflare Worker proxy. */
(function(){
var S=window.SMS,C=S.C,I=S.I,submitLead=S.submitLead;
var mount=document.getElementById("chat-root");
if(!mount){mount=document.createElement("div");mount.id="chat-root";document.body.appendChild(mount);}
var CASES=[["Car Accident",/car|auto|vehicle wreck|collision|rear.?end|fender/i],["Semi Truck Accident",/semi|truck|18.?wheel|big rig|tractor/i],["Motorcycle Accident",/motorcycle|motorbike|scooter/i],["Injury on Premises",/premis|slip|fall|apartment|shoot|hotel|store|parking/i],["Wrongful Death",/death|died|killed|fatal|passed away/i],["Victim of Sexual Assault/Abuse",/sexual|assault|rape|abuse|molest|harass/i],["Victim of Human Trafficking",/traffic/i],["Spinal Cord Injury",/spinal|spine|paraly|cord/i],["Animal Bite",/dog|bite|animal/i],["Other Injuries",/injur|hurt|accident|pain|other/i]];
var INTENTS=[
 {re:/^(hi|hello|hey|yo|good (morning|afternoon|evening))\b/i,reply:function(){return "Hi 👋🏼 Welcome to "+C.firmName+". What kind of matter can we assist you with?";},quick:"cases"},
 {re:/cost|fee|price|charge|pay|afford|contingen/i,reply:function(){return "Great question — consultations are 100% free, and we work on contingency: <b>no fee unless we win</b>. Want a free case evaluation?";},quick:"cases"},
 {re:/where|located|location|office|address|atlanta|dc|washington/i,reply:function(){return "We're headquartered in <b>Atlanta, GA</b> and now serve <b>Washington, DC</b> — and we handle cases nationwide. All consultations are by appointment only. Call <a href='tel:"+C.phoneTel+"'>"+C.phonePretty+"</a> to schedule.";}},
 {re:/call|phone|number|human|person|attorney|lawyer|talk|speak/i,reply:function(){return "You can reach our team directly at <a href='tel:"+C.phoneTel+"'>"+C.phoneDisplay+"</a> ("+C.phonePretty+"). Prefer we call you? Pick your case type and I'll set up a callback.";},quick:"cases"},
 {re:/hour|open|available|appointment|schedule/i,reply:function(){return "All consultations are by appointment only — call <a href='tel:"+C.phoneTel+"'>"+C.phonePretty+"</a> and we'll find a time that works for you.";}},
 {re:/my case|existing|status|update on|already (a )?client/i,reply:function(){return "For updates on an existing case, please call our office at <a href='tel:"+C.phoneTel+"'>"+C.phonePretty+"</a> — your case team can pull up your file right away.";}},
 {re:/thank|thx|appreciate/i,reply:function(){return "You're very welcome. We fight for justice — anything else I can help with?";},quick:"cases"},
 {re:/^(bye|goodbye|later|no|nope|not now)\b/i,reply:function(){return "No problem. We're here 24/7 — call <a href='tel:"+C.phoneTel+"'>"+C.phoneDisplay+"</a> anytime. Let the lions fight for you. 🦁";}}];
mount.innerHTML='<button class="chat-bubble" id="chat-bubble" aria-label="Open chat"><span class="cb-emoji">👋🏼</span><span class="cb-text">How can I help you?</span><span class="cb-badge">1</span></button>'+
'<section class="chat-panel" id="chat-panel" aria-label="SMS virtual assistant"><div class="chat-head"><div class="ch-av">SMS</div><div><div class="ch-name">'+C.firmName+'</div><div class="ch-status">Online — replies instantly</div></div><button class="ch-close" id="chat-close" aria-label="Close chat">✕</button></div>'+
'<div class="chat-body" id="chat-body"></div><div class="quick-replies" id="chat-quick"></div>'+
'<div class="chat-input"><input id="chat-text" placeholder="Type a message…" autocomplete="off" aria-label="Chat message"><button class="chat-send" id="chat-send" aria-label="Send">'+I.send+'</button></div>'+
'<div class="chat-channels"><a href="'+C.socials.messenger+'" target="_blank" rel="noopener">'+I.messenger+'Messenger</a><a href="'+C.socials.instagram+'" target="_blank" rel="noopener">'+I.instagram+'Instagram</a><a href="'+C.socials.whatsapp+'" target="_blank" rel="noopener">'+I.whatsapp+'WhatsApp</a><a href="sms:'+C.phoneTel+'">'+I.sms+'Text us</a><a href="tel:'+C.phoneTel+'">'+I.phone+'Call us</a></div>'+
'<div class="chat-foot">Demo intake assistant · Not legal advice · Submitting info does not create an attorney-client relationship</div></section>';
var bubble=mount.querySelector("#chat-bubble"),panel=mount.querySelector("#chat-panel"),body=mount.querySelector("#chat-body"),quick=mount.querySelector("#chat-quick"),input=mount.querySelector("#chat-text");
var greeted=false,step="idle",lead={};
function scroll(){body.scrollTop=body.scrollHeight;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function addMsg(html,who){var d=document.createElement("div");d.className="msg "+who;d.innerHTML=html;body.appendChild(d);scroll();return d;}
function botSay(html,quickSpec,delay){var t=addMsg('<span class="typing"><i></i><i></i><i></i></span>',"bot");
 setTimeout(function(){t.innerHTML=html;scroll();if(quickSpec)setQuick(quickSpec);},delay||650);}
function setQuick(spec){var items=[];
 if(spec==="cases")items=CASES.map(function(c){return{label:c[0],value:"case:"+c[0]};});
 else if(Array.isArray(spec))items=spec;
 quick.innerHTML=items.map(function(it,i){return '<button class="qr" data-i="'+i+'">'+it.label+'</button>';}).join("");
 quick.querySelectorAll(".qr").forEach(function(b,i){b.addEventListener("click",function(){var it=items[i];
  if(it.href){location.href=it.href;return;}
  addMsg(esc(it.label),"user");quick.innerHTML="";route(it.value!==undefined?it.value:it.label);});});
 scroll();}
function startIntake(type){step="when";lead.case_type=type;
 botSay("I'm sorry you're dealing with this. Our team has recovered <b>over $1 billion</b> for clients, and your evaluation is free. <br><br><b>When did this happen?</b>",["Just happened","Within the last week","Within the last month","More than a month ago"].map(function(x){return{label:x,value:"when:"+x};}));}
function route(v){
 if(v.indexOf("case:")===0)return startIntake(v.slice(5));
 if(v.indexOf("when:")===0){lead.when=v.slice(5);step="care";
  return botSay("Understood. <b>Has medical care been needed so far?</b>",["Yes","Not yet","Currently in treatment"].map(function(x){return{label:x,value:"care:"+x};}));}
 if(v.indexOf("care:")===0){lead.medical_care=v.slice(5);step="name";
  return botSay("Thank you. <b>What is your first and last name?</b>");}
 if(v==="send"){step="done";botSay("Sending your info to our intake team… 🔒",null,300);
  submitLead(lead,"Chatbot Lead — "+lead.case_type).then(function(res){
   sessionStorage.setItem("sms_lead_captured","1");
   botSay("✅ <b>You're all set, "+esc((lead.name||"").split(" ")[0])+".</b> Our team will reach out shortly"+((res&&res.demo)?" <i>(demo mode)</i>":"")+".<br><br>Need help right now? Call <a href='tel:"+C.phoneTel+"'>"+C.phonePretty+"</a>. 🦁",[{label:"📞 Call "+C.phoneDisplay,href:"tel:"+C.phoneTel},{label:"Start over",value:"restart"}],900);
  }).catch(function(){botSay("Hmm, that didn't go through. Please call us at <a href='tel:"+C.phoneTel+"'>"+C.phonePretty+"</a> — we're standing by.");});
  return;}
 if(v==="restart"){step="idle";for(var k in lead)delete lead[k];
  return botSay("No problem — starting fresh. What kind of matter can we assist you with?","cases");}
 handleText(v);}
function handleText(raw){var text=raw.trim();if(!text)return;
 if(step==="name"){if(text.length<2||/\d/.test(text))return botSay("Could you enter your full name (letters only)?");
  lead.name=text;step="contact";
  return botSay("Thanks, <b>"+esc(text.split(" ")[0])+"</b>. What's the best <b>phone number or email</b> to reach you?");}
 if(step==="contact"){var digits=text.replace(/\D/g,""),isEmail=/.+@.+\..+/.test(text),isPhone=digits.length>=10;
  if(!isEmail&&!isPhone)return botSay("That doesn't look like a valid phone or email — mind checking it?");
  lead.contact=text;step="confirm";
  return botSay("Here's what I have:<br>• <b>Case:</b> "+esc(lead.case_type)+"<br>• <b>When:</b> "+esc(lead.when)+"<br>• <b>Medical care:</b> "+esc(lead.medical_care)+"<br>• <b>Name:</b> "+esc(lead.name)+"<br>• <b>Contact:</b> "+esc(lead.contact)+"<br><br>Ready to send this to our intake team?",[{label:"✅ Send my info",value:"send"},{label:"Start over",value:"restart"}]);}
 if(step==="when"||step==="care"){
  if(step==="when"){lead.when=text;step="care";
   return botSay("Understood. <b>Has medical care been needed so far?</b>",["Yes","Not yet","Currently in treatment"].map(function(x){return{label:x,value:"care:"+x};}));}
  lead.medical_care=text;step="name";
  return botSay("Thank you. <b>What is your first and last name?</b>");}
 for(var i=0;i<INTENTS.length;i++){if(INTENTS[i].re.test(text)){quick.innerHTML="";return botSay(INTENTS[i].reply(),INTENTS[i].quick);}}
 var match=null;for(var j=0;j<CASES.length;j++){if(CASES[j][1].test(text)){match=CASES[j];break;}}
 if(match)return startIntake(match[0]);
 botSay("I can help with a <b>free case evaluation</b>, answer questions about fees or our offices, or connect you with our team at <a href='tel:"+C.phoneTel+"'>"+C.phoneDisplay+"</a>. What kind of matter can we assist you with?","cases");}
function sendText(){var v=input.value.trim();if(!v)return;input.value="";addMsg(esc(v),"user");quick.innerHTML="";handleText(v);}
mount.querySelector("#chat-send").addEventListener("click",sendText);
input.addEventListener("keydown",function(e){if(e.key==="Enter")sendText();});
function open(){panel.classList.add("open");bubble.style.display="none";bubble.classList.remove("unread");
 sessionStorage.setItem("sms_chat_opened","1");
 if(!greeted){greeted=true;botSay("Hi 👋🏼 Welcome to <b>"+C.firmName+"</b>. What kind of matter can we assist you with?","cases",500);}
 setTimeout(function(){input.focus();},250);}
function close(){panel.classList.remove("open");bubble.style.display="";}
bubble.addEventListener("click",open);
mount.querySelector("#chat-close").addEventListener("click",close);
addEventListener("keydown",function(e){if(e.key==="Escape"&&panel.classList.contains("open"))close();});
setTimeout(function(){if(!sessionStorage.getItem("sms_chat_opened"))bubble.classList.add("unread");},C.chatTeaserMs);
})();
