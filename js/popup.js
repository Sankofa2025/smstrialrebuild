/* POPUP — lead-capture modal. Exit-intent (desktop) OR 30s timer, once per
   session. Clicking ✕ asks for a callback number first (with a skip link). */
(function(){
var S=window.SMS,C=S.C,CASE_OPTIONS=S.CASE_OPTIONS,submitLead=S.submitLead;
if(document.body.dataset.page==="contact")return;
if(sessionStorage.getItem("sms_popup_done")||sessionStorage.getItem("sms_lead_captured"))return;
var mount=document.getElementById("popup-root");
if(!mount){mount=document.createElement("div");mount.id="popup-root";document.body.appendChild(mount);}
mount.innerHTML='<div class="popup-overlay" id="popup-overlay" role="dialog" aria-modal="true" aria-label="Free case evaluation"><div class="popup-panel"><button class="popup-close" id="pp-x" aria-label="Close">✕</button>'+
'<div class="pp-step active" id="pp-main"><div class="pp-kicker">Free Case Evaluation</div><h2>Before you go —<br><span class="gold">let the lions fight for you.</span></h2><p class="pp-sub">Over $1 billion recovered. 2,000+ cases won. Tell us what happened and get a free, confidential evaluation. No fee unless we win.</p>'+
'<form class="sms-form" data-form="Exit popup" novalidate><div class="f-field"><label>Your name *</label><input name="name" required autocomplete="name"></div><div class="f-field"><label>Phone or email *</label><input name="contact" required></div><div class="f-field"><label>Type of case</label><select name="case_type"><option value="">Select…</option>'+CASE_OPTIONS.map(function(o){return "<option>"+o+"</option>";}).join("")+'<option>Other</option></select></div><div class="hp-field" aria-hidden="true"><input name="_honey" tabindex="-1" autocomplete="off"></div><button class="btn btn-gold" type="submit" style="width:100%;justify-content:center">Get My Free Evaluation</button><div class="f-status" role="status"></div></form>'+
'<button class="pp-skip" id="pp-skip">No thanks, I\'ll keep browsing</button></div>'+
'<div class="pp-step" id="pp-mini"><div class="pp-kicker">Wait — one second</div><h2>Leaving already?</h2><p class="pp-sub">Drop your number and we\'ll call <b>you</b> — a free callback, zero pressure.</p><div class="pp-mini-row"><input type="tel" id="pp-phone" placeholder="Phone number" autocomplete="tel"><button class="btn btn-gold" id="pp-call">Call me</button></div><div class="f-status" id="pp-mini-status" role="status"></div><button class="pp-skip" id="pp-anyway">Close anyway</button></div>'+
'<div class="pp-step" id="pp-thanks"><div class="pp-thanks"><div class="big">🦁</div><h2>Thank you.</h2><p>Our team will reach out shortly.<br>Urgent? Call <a href="tel:'+C.phoneTel+'">'+C.phonePretty+'</a>.</p></div></div></div></div>';
var ov=mount.querySelector("#popup-overlay");
var steps={main:mount.querySelector("#pp-main"),mini:mount.querySelector("#pp-mini"),thanks:mount.querySelector("#pp-thanks")};
var shown=false;
function show(which){Object.keys(steps).forEach(function(k){steps[k].classList.remove("active");});
 steps[which].classList.add("active");ov.classList.add("show");document.body.style.overflow="hidden";
 var f=steps[which].querySelector("input");if(f)setTimeout(function(){f.focus();},200);}
function trigger(){if(shown||sessionStorage.getItem("sms_popup_done")||sessionStorage.getItem("sms_lead_captured"))return;shown=true;show("main");}
function dismiss(){ov.classList.remove("show");document.body.style.overflow="";sessionStorage.setItem("sms_popup_done","1");}
document.addEventListener("mouseout",function(e){if(!e.relatedTarget&&e.clientY<=0)trigger();});
setTimeout(trigger,C.popupDelayMs);
mount.querySelector("#pp-x").addEventListener("click",function(){steps.main.classList.contains("active")?show("mini"):dismiss();});
mount.querySelector("#pp-skip").addEventListener("click",dismiss);
mount.querySelector("#pp-anyway").addEventListener("click",dismiss);
ov.addEventListener("click",function(e){if(e.target===ov)(steps.main.classList.contains("active")?show("mini"):dismiss());});
addEventListener("keydown",function(e){if(e.key!=="Escape"||!ov.classList.contains("show"))return;
 steps.main.classList.contains("active")?show("mini"):dismiss();});
steps.main.querySelector("form").addEventListener("sms:lead",function(){show("thanks");setTimeout(dismiss,2600);});
mount.querySelector("#pp-call").addEventListener("click",function(){
 var inp=mount.querySelector("#pp-phone"),status=mount.querySelector("#pp-mini-status"),digits=inp.value.replace(/\D/g,"");
 if(digits.length<10){inp.classList.add("invalid");status.className="f-status err";status.textContent="Please enter a valid phone number.";return;}
 inp.classList.remove("invalid");
 submitLead({phone:inp.value,source:"Exit popup — callback request"},"Callback Request — Exit Popup").then(function(){
  sessionStorage.setItem("sms_lead_captured","1");show("thanks");setTimeout(dismiss,2600);
 }).catch(function(){status.className="f-status err";status.textContent="Something went wrong — please call "+C.phonePretty+".";});});
})();
