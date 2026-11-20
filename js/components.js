/* COMPONENTS — shared header, footer, forms, lead submission (FormSubmit AJAX).
   submitLead() never hangs: 12s timeout, tolerant response parsing,
   activation detection, and an on-device retry queue. */
(function(){
var R=window.ROOT||"",C=window.SMS_CONFIG;
var I={
facebook:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l.5-4H13V7.5c0-1.1.3-1.5 1.5-1.5H17V2.2C16.4 2.1 15.3 2 14.2 2 11.4 2 9.5 3.7 9.5 7v3H6v4h3.5v8H13z"/></svg>',
twitter:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 3l7.1 9.3L4.4 21h2.6l5.3-6.9L17.5 21H20l-7.4-9.7L19.4 3h-2.6l-4.8 6.3L7.5 3H4z"/></svg>',
youtube:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.6 7.2a2.8 2.8 0 00-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 00-2 2A29 29 0 002 12a29 29 0 00.4 4.8 2.8 2.8 0 002 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 002-2A29 29 0 0022 12a29 29 0 00-.4-4.8zM10 15.2V8.8l5.2 3.2-5.2 3.2z"/></svg>',
instagram:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
linkedin:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM.5 8h4V21h-4V8zm7 0h3.8v1.8h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-6.5c0-1.6 0-3.6-2.2-3.6s-2.5 1.7-2.5 3.5V21h-4V8z"/></svg>',
tiktok:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.6 5.8A4.3 4.3 0 0115.4 3h-3v12.4a2.6 2.6 0 11-2.6-2.6c.3 0 .5 0 .8.1V9.8a5.6 5.6 0 105.8 5.6V9.9a7.3 7.3 0 004.3 1.4V8.3a4.3 4.3 0 01-4.1-2.5z"/></svg>',
messenger:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.1 2 11.2c0 2.9 1.4 5.5 3.7 7.2V22l3.4-1.9c.9.3 1.9.4 2.9.4 5.5 0 10-4.1 10-9.3S17.5 2 12 2zm1 12.5l-2.5-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.4 5.7z"/></svg>',
whatsapp:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.2.2-.3.3-.1.6.2.3.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.8.3.2.5.1.7-.1l1-1.1c.2-.3.4-.2.7-.1l2 .9c.3.2.5.2.6.4 0 .1 0 .7-.2 1.3z"/></svg>',
sms:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2zM8 12H6v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>',
phone:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.6 10.8a15.6 15.6 0 006.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.3 0 .7-.2 1l-2.3 2.2z"/></svg>',
play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
send:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>',
star:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z"/></svg>',
shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
scale:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M8 21h8M12 6H5m7 0h7M5 6l-2.5 6a3.5 3.5 0 007 0L7 6M19 6l-2.5 6a3.5 3.5 0 007 0L21 6"/></svg>',
heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 000-7.8z"/></svg>',
truck:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5h13v11H1zM14 9h4l3 3v4h-7M5.5 19a2 2 0 100-4 2 2 0 000 4zm12 0a2 2 0 100-4 2 2 0 000 4z"/></svg>',
car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11l1.5-4.5A2 2 0 018.4 5h7.2a2 2 0 011.9 1.5L19 11m-14 0h14a2 2 0 012 2v4h-2.5M5 11a2 2 0 00-2 2v4h2.5m0 0a2 2 0 104 0m-4 0h4m5 0a2 2 0 104 0m-4 0h4"/></svg>',
spine:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M8 4h8M7 8h10M8 12h8M7 16h10M9 20h6"/></svg>',
home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10l9-7 9 7v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"/><path d="M9 22V12h6v10"/></svg>',
alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3L2 20h20L12 3zm0 7v4m0 3.5v.5"/></svg>'
};
function send(body){
 var ctrl=("AbortController" in window)?new AbortController():null;
 var timer=setTimeout(function(){if(ctrl)ctrl.abort();},12000);
 var opts={method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(body)};
 if(ctrl)opts.signal=ctrl.signal;
 return fetch("https://formsubmit.co/ajax/"+encodeURIComponent(C.formEmail),opts).then(function(r){
  return r.text().then(function(t){
   var j=null;try{j=JSON.parse(t);}catch(e){}
   var msg=(j&&(j.message||""))||t||"";
   var failed=j&&(j.success==="false"||j.success===false);
   var activation=/activat/i.test(msg)||failed;
   var ok=r.ok&&!activation;
   return {ok:ok,activation:activation};
  });
 }).catch(function(){return {ok:false,activation:false,error:"network"};}).then(function(res){clearTimeout(timer);return res;});
}
function queueLead(payload,subject){try{var q=JSON.parse(localStorage.getItem("sms_lead_queue")||"[]");q.push({p:payload,s:subject});localStorage.setItem("sms_lead_queue",JSON.stringify(q.slice(-10)));}catch(e){}}
function submitLead(payload,subject){
 var body=Object.assign({},payload,{_subject:subject||"New Lead — SMS Trial site",_captcha:"false",_template:"table"});
 if(/example\.com$/i.test(C.formEmail)){console.info("[DEMO MODE] Lead captured (set js/config.js formEmail to deliver):",body);return Promise.resolve({ok:true,demo:true});}
 return send(body).then(function(res){if(!res.ok)queueLead(payload,subject);return res;});
}
function flushQueue(){
 if(/example\.com$/i.test(C.formEmail))return;
 var q;try{q=JSON.parse(localStorage.getItem("sms_lead_queue")||"[]");}catch(e){return;}
 if(!q.length)return;
 try{localStorage.removeItem("sms_lead_queue");}catch(e){}
 q.forEach(function(item){
  var body=Object.assign({},item.p,{_subject:item.s||"New Lead — SMS Trial site",_captcha:"false",_template:"table"});
  send(body).then(function(res){if(!res.ok)queueLead(item.p,item.s);});
 });
}
setTimeout(flushQueue,5000);
var AREAS=[["sexual-assault","Sexual Assault Victims"],["personal-injury","Personal Injury Law"],["wrongful-death","Wrongful Death"],["trucking-accidents","Trucking Accidents"],["motor-vehicle-accidents","Motor Vehicle Accidents"],["spinal-cord-injury","Spinal Cord Injury"],["premises-liability","Premises Liability"],["apartment-shootings","Apartment Shootings"]];
var NAV=[["","Home"],["practice-areas/","Practice Areas"],["case-results/","Case Results"],["attorneys/","Attorneys"],["media/","Media"],["news/","News"],["reviews/","Reviews"],["contact/","Contact"]];
var ANN=[["SMS WELCOMES NEW ATTORNEY KELLEY SIMONEAUX","attorneys/"],["NOW TAKING SPINAL CORD &amp; SERIOUS INJURY CASES","practice-areas/spinal-cord-injury.html"],["SMS ANNOUNCES THE OPENING OF ITS DC OFFICE","contact/"],["CONYERS EXPLOSION LAWSUIT — FREE CASE EVALUATION","contact/"]];
function socialRow(label){var s=C.socials;
 function it(k,n){return '<a class="soc" href="'+s[k]+'" target="_blank" rel="noopener" aria-label="'+n+'">'+I[k]+'</a>';}
 return '<div class="social-row">'+(label?'<span class="soc-label">follow us</span>':'')+it("facebook","Facebook")+it("twitter","X / Twitter")+it("youtube","YouTube")+it("instagram","Instagram")+it("linkedin","LinkedIn")+it("tiktok","TikTok")+'</div>';}
function buildHeader(){var m=document.getElementById("site-header");if(!m)return;
 var here=location.pathname.replace(/index\.html$/,"");
 var links=NAV.map(function(n){var href=n[0],label=n[1],url=R+href;
  var active=href===""?!/(practice-areas|attorneys|case-results|media|news|reviews|contact)/.test(here):here.indexOf(href)>-1;
  if(href==="practice-areas/")return '<li class="has-sub"><a class="nav-link'+(active?" active":"")+'" href="'+url+'">'+label+' ▾</a><div class="sub-menu">'+AREAS.map(function(a){return '<a href="'+R+'practice-areas/'+a[0]+'.html">'+a[1]+'</a>';}).join("")+'</div></li>';
  return '<li><a class="nav-link'+(active?" active":"")+'" href="'+url+'">'+label+'</a></li>';}).join("");
 m.innerHTML='<div class="annbar">'+ANN.map(function(a,i){return '<span class="annbar-item'+(i===0?" active":"")+'">'+a[0]+' &nbsp;<a href="'+R+a[1]+'">LEARN MORE</a></span>';}).join("")+'</div>'+
 '<header class="hdr" id="hdr"><div class="hdr-inner"><a class="brand" href="'+R+'"><img src="'+R+'assets/img/logo.svg" alt="SMS Trial Attorneys logo"><span class="brand-name">STEWART MILLER SIMMONS<small>TRIAL ATTORNEYS</small></span></a><ul class="nav">'+links+'</ul><div class="hdr-cta"><a class="hdr-phone" href="tel:'+C.phoneTel+'"><small>CALL US NOW</small>'+C.phoneDisplay+'</a><a class="btn btn-gold btn-sm" href="'+R+'contact/">Free Case Evaluation</a><button class="burger" id="burger" aria-label="Open menu"><span></span><span></span><span></span></button></div></div></header>'+
 '<nav class="mobile-nav" id="mobile-nav"><button class="mn-close" id="mn-close" aria-label="Close menu">✕</button>'+NAV.map(function(n){return '<a href="'+R+n[0]+'">'+n[1]+'</a>';}).join("")+'<div class="mn-sub">'+AREAS.map(function(a){return '<a href="'+R+'practice-areas/'+a[0]+'.html">'+a[1]+'</a>';}).join("")+'</div><a href="tel:'+C.phoneTel+'" style="color:var(--gold2)">Call '+C.phoneDisplay+'</a></nav>';}
function buildFooter(){var m=document.getElementById("site-footer");if(!m)return;
 m.innerHTML='<footer class="footer"><div class="wrap"><div class="foot-grid">'+
 '<div class="foot-brand"><a class="brand" href="'+R+'"><img src="'+R+'assets/img/logo.svg" alt="" width="44"><span class="brand-name">STEWART MILLER SIMMONS<small>TRIAL ATTORNEYS</small></span></a><p>Award-winning personal injury law firm. Over 2,000 cases won and more than $1 billion recovered for clients nationwide. We fight for justice.</p>'+socialRow(false)+'</div>'+
 '<div><h4>Explore</h4><ul>'+NAV.slice(1).map(function(n){return '<li><a href="'+R+n[0]+'">'+n[1]+'</a></li>';}).join("")+'</ul></div>'+
 '<div><h4>Practice Areas</h4><ul>'+AREAS.slice(0,6).map(function(a){return '<li><a href="'+R+'practice-areas/'+a[0]+'.html">'+a[1]+'</a></li>';}).join("")+'<li><a href="'+R+'practice-areas/">All practice areas →</a></li></ul></div>'+
 '<div><h4>Offices</h4><div class="foot-office"><b>Atlanta — Headquarters</b>Atlanta, Georgia<br><em style="font-size:11px;color:#6d675c">[street address placeholder]</em></div><div class="foot-office"><b>Washington, DC</b>Washington, District of Columbia<br><em style="font-size:11px;color:#6d675c">[street address placeholder]</em></div><div class="foot-office"><b>'+C.phoneDisplay+'</b><a href="tel:'+C.phoneTel+'">'+C.phonePretty+'</a><br><a href="mailto:'+C.email+'">'+C.email+'</a></div></div>'+
 '</div><div class="foot-bottom"><p>© <span id="yr"></span> Stewart Miller Simmons Trial Attorneys · Attorney Advertising. Prior results do not guarantee a similar outcome. The information on this site is for general purposes only and is not legal advice. All consultations are by appointment only.</p><p>Static rebuild · GitHub Pages<br>Family · Faith · Justice</p></div></div></footer>';}
var CASE_OPTIONS=["Hair Product Cancer","Personal Injury Law","Product Liability","Wrongful Death","Trucking Accidents","Motor Vehicle Accidents","Trampoline Accidents","Premises Liability","Sexual Assault Victims"];
function contactFormHTML(){return '<div class="form-card"><h3>Free Case Evaluation</h3><p class="f-note">"*" indicates required fields · No fee unless we win</p>'+
 '<form class="sms-form" data-form="Contact form" novalidate><div class="f-row"><div class="f-field"><label>First name *</label><input name="first_name" required autocomplete="given-name"></div><div class="f-field"><label>Last name *</label><input name="last_name" required autocomplete="family-name"></div></div>'+
 '<div class="f-row"><div class="f-field"><label>Email address *</label><input type="email" name="email" required autocomplete="email"></div><div class="f-field"><label>Phone number *</label><input type="tel" name="phone" required autocomplete="tel"></div></div>'+
 '<div class="f-field"><label>Type of case</label><select name="case_type"><option value="">Select a case type…</option>'+CASE_OPTIONS.map(function(o){return "<option>"+o+"</option>";}).join("")+'<option>Other</option></select></div>'+
 '<div class="f-field"><label>How did you find us?</label><select name="referral"><option value="">Select…</option><option>Google Search</option><option>Social Media</option><option>TV</option><option>Referral from a friend / family</option><option>Attorney Referral</option><option>Other</option></select></div>'+
 '<div class="f-field"><label>Describe what happened</label><textarea name="message" placeholder="Tell us about your situation…"></textarea></div>'+
 '<div class="hp-field" aria-hidden="true"><label>Leave this empty</label><input name="_honey" tabindex="-1" autocomplete="off"></div>'+
 '<button class="btn btn-gold" type="submit" style="width:100%;justify-content:center">Submit — Free Evaluation</button><div class="f-status" role="status"></div></form></div>';}
document.addEventListener("submit",function(e){
 var form=e.target.closest?e.target.closest(".sms-form"):null;if(!form)return;e.preventDefault();
 var status=form.querySelector(".f-status"),btn=form.querySelector("[type=submit]"),valid=true;
 form.querySelectorAll("[required]").forEach(function(inp){var ok=inp.value.trim()&&(inp.type!=="email"||/.+@.+\..+/.test(inp.value));inp.classList.toggle("invalid",!ok);if(!ok)valid=false;});
 if(!valid){if(status){status.className="f-status err";status.textContent="Please complete the required fields.";}return;}
 var honey=form.querySelector("[name=_honey]");if(honey&&honey.value)return;
 var data={};new FormData(form).forEach(function(v,k){if(k!=="_honey")data[k]=v;});
 var orig=btn.textContent;btn.disabled=true;btn.textContent="Sending…";if(status){status.className="f-status";status.textContent="";}
 submitLead(data,"New Case Evaluation — "+(form.dataset.form||"Website")).then(function(res){
  if(res.ok){
   sessionStorage.setItem("sms_lead_captured","1");
   if(status){status.className="f-status ok";status.textContent=res.demo?"✓ Received (demo mode — set your FormSubmit email in js/config.js to deliver leads).":"✓ Thank you. Our team will reach out shortly. For urgent matters call "+C.phonePretty+".";}
   form.reset();form.dispatchEvent(new CustomEvent("sms:lead"));
  }else if(res.activation){
   if(status){status.className="f-status ok";status.textContent="🔐 One-time setup: FormSubmit just emailed an activation link to our inbox. Once it's clicked, press submit again — your info is saved on this device.";}
  }else{
   if(status){status.className="f-status err";status.textContent="Connection hiccup — your info is saved on this device. Try again, or call "+C.phonePretty+".";}
  }
 }).catch(function(){if(status){status.className="f-status err";status.textContent="Something went wrong — please call "+C.phonePretty+".";}})
 .finally(function(){btn.disabled=false;btn.textContent=orig;});});
window.SMS={R:R,C:C,I:I,submitLead:submitLead,socialRow:socialRow,CASE_OPTIONS:CASE_OPTIONS,AREAS:AREAS};
buildHeader();buildFooter();
document.querySelectorAll("[data-contact-form]").forEach(function(el){el.innerHTML=contactFormHTML();});
document.querySelectorAll("[data-social-row]").forEach(function(el){el.innerHTML=socialRow(true);});
})();
