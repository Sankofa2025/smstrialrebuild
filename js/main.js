/* MAIN — UI behaviors + data-driven page renderers (keyed off body[data-page]). */
(function(){
var S=window.SMS,D=window.SMS_DATA,R=S.R,C=S.C,I=S.I;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
var anns=document.querySelectorAll(".annbar-item");
if(anns.length>1){var ai=0;setInterval(function(){anns[ai].classList.remove("active");ai=(ai+1)%anns.length;anns[ai].classList.add("active");},4500);}
var hdr=document.getElementById("hdr");
addEventListener("scroll",function(){if(hdr)hdr.classList.toggle("scrolled",scrollY>10);},{passive:true});
var mn=document.getElementById("mobile-nav"),bg=document.getElementById("burger"),mc=document.getElementById("mn-close");
if(bg)bg.addEventListener("click",function(){mn.classList.add("open");});
if(mc)mc.addEventListener("click",function(){mn.classList.remove("open");});
if(mn)mn.querySelectorAll("a").forEach(function(a){a.addEventListener("click",function(){mn.classList.remove("open");});});
var yr=document.getElementById("yr");if(yr)yr.textContent=new Date().getFullYear();
function initYT(){document.querySelectorAll(".yt").forEach(function(el){
 if(el.dataset.bound)return;el.dataset.bound="1";
 var id=(el.dataset.id||"").trim(),title=el.dataset.title||"Video";
 if(id){el.innerHTML='<div class="yt-thumb"><img loading="lazy" src="https://i.ytimg.com/vi/'+id+'/hqdefault.jpg" alt=""><span class="yt-play">'+I.play+'</span></div>';
  el.addEventListener("click",function(){el.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+id+'?autoplay=1&rel=0" title="'+esc(title)+'" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen loading="lazy"></iframe>';},{once:true});
 }else{el.innerHTML='<div class="yt-thumb"><span class="yt-play">'+I.play+'</span><span class="yt-note">Video placeholder · set data-id</span></div>';el.style.cursor="default";}});}
function initReveal(){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:.12});
 document.querySelectorAll(".reveal:not(.in)").forEach(function(el,i){el.style.transitionDelay=((i%4)*70)+"ms";io.observe(el);});}
var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);
 var el=e.target,target=parseFloat(el.dataset.count),pre=el.dataset.prefix||"",suf=el.dataset.suffix||"",fin=el.dataset.final,t0=performance.now();
 (function tick(t){var p=Math.min((t-t0)/1400,1),ease=1-Math.pow(1-p,3);
  el.textContent=pre+Math.round(target*ease).toLocaleString("en-US")+suf;
  if(p<1)requestAnimationFrame(tick);else if(fin)el.textContent=fin;})(t0);});},{threshold:.5});
function initCounters(){document.querySelectorAll("[data-count]").forEach(function(el){cio.observe(el);});}
function initSlider(){var slider=document.querySelector(".t-slider");if(!slider)return;
 var track=slider.querySelector(".t-track"),slides=slider.querySelectorAll(".t-slide"),dotsBox=slider.querySelector(".t-dots"),ti=0,timer;
 slides.forEach(function(_,i){var d=document.createElement("button");d.setAttribute("aria-label","Testimonial "+(i+1));d.addEventListener("click",function(){go(i,true);});dotsBox.appendChild(d);});
 var dots=dotsBox.querySelectorAll("button");
 function go(i,man){ti=(i+slides.length)%slides.length;track.style.transform="translateX(-"+ti*100+"%)";dots.forEach(function(d,j){d.classList.toggle("active",j===ti);});if(man)restart();}
 function restart(){clearInterval(timer);timer=setInterval(function(){go(ti+1);},7000);}
 slider.querySelector(".t-prev").addEventListener("click",function(){go(ti-1,true);});
 slider.querySelector(".t-next").addEventListener("click",function(){go(ti+1,true);});
 slider.addEventListener("mouseenter",function(){clearInterval(timer);});slider.addEventListener("mouseleave",restart);
 go(0);restart();}
function initBios(){var btns=document.querySelectorAll("[data-partner]");if(!btns.length)return;
 var ov=document.createElement("div");ov.className="modal-overlay";
 ov.innerHTML='<div class="modal-panel" role="dialog" aria-modal="true"><button class="modal-close" aria-label="Close">✕</button><div class="pm-body"></div></div>';
 document.body.appendChild(ov);var body=ov.querySelector(".pm-body");
 function close(){ov.classList.remove("show");document.body.style.overflow="";}
 ov.addEventListener("click",function(e){if(e.target===ov)close();});
 ov.querySelector(".modal-close").addEventListener("click",close);
 addEventListener("keydown",function(e){if(e.key==="Escape")close();});
 btns.forEach(function(btn){btn.addEventListener("click",function(){
  var p=D.team.partners.filter(function(x){return x.key===btn.dataset.partner;})[0];if(!p)return;
  body.innerHTML='<div class="avatar">'+p.initials+'</div><h3>'+esc(p.name)+'</h3><div class="role">'+esc(p.role)+'</div>'+p.bio.map(function(x){return "<p>"+esc(x)+"</p>";}).join("")+'<a class="btn btn-ghost btn-sm" href="mailto:'+C.email+'">Send email</a>'+S.socialRow(false);
  ov.classList.add("show");document.body.style.overflow="hidden";});});}
function paCards(){return S.AREAS.map(function(a){var d=D.areas[a[0]];
 return '<a class="pa-card reveal" href="'+R+'practice-areas/'+a[0]+'.html"><div class="pa-icon">'+I[d.icon]+'</div><h3>'+a[1]+'</h3><p>'+esc(d.tag)+'</p><span class="more">Learn more</span></a>';}).join("");}
function renderHome(){
 var rr=document.getElementById("results-row");if(rr)rr.innerHTML=D.results.map(function(x){return '<div class="result-card reveal"><div class="amt">'+x.amt+'</div><div class="lbl">'+esc(x.lbl)+'</div></div>';}).join("");
 var pa=document.getElementById("pa-grid");if(pa)pa.innerHTML=paCards();
 var tt=document.getElementById("t-track");if(tt)tt.innerHTML=D.reviews.map(function(x){return '<div class="t-slide"><span class="quote-mark">“</span><blockquote>'+esc(x.q)+'</blockquote><div class="t-who">'+esc(x.who)+' <span>/ client</span></div></div>';}).join("");
 var pg=document.getElementById("partners-grid");if(pg)pg.innerHTML=D.team.partners.map(function(p){return '<div class="partner-card reveal"><div class="avatar">'+p.initials+'</div><h3>'+esc(p.name)+'</h3><div class="role">'+esc(p.role)+'</div><a class="bio-btn" href="'+R+'attorneys/">View Bio</a></div>';}).join("");}
function renderArea(){var key=document.body.dataset.area,d=D.areas[key];if(!d)return;
 var hero=document.getElementById("area-hero");
 if(hero)hero.innerHTML='<div class="wrap"><div class="crumbs"><a href="'+R+'">Home</a> / <a href="'+R+'practice-areas/">Practice Areas</a> / '+esc(d.name)+'</div><span class="kicker">Practice Areas</span><h1>'+esc(d.name)+'</h1><p class="lede">'+esc(d.tag)+'</p></div>';
 var mount=document.getElementById("area-detail");if(!mount)return;
 mount.innerHTML='<div class="detail-grid"><div class="detail-body reveal"><h2>Overview</h2><p>'+esc(d.intro)+'</p><h2>What we handle</h2><ul>'+d.handles.map(function(h){return "<li>"+esc(h)+"</li>";}).join("")+'</ul><h2>How we fight</h2><p>'+esc(d.fight)+'</p><h2>Common questions</h2>'+d.faqs.map(function(f){return '<details class="faq"><summary>'+esc(f[0])+'</summary><div class="faq-a">'+esc(f[1])+'</div></details>';}).join("")+'</div>'+
 '<aside><div class="aside-card reveal"><h3>Free Case Evaluation</h3><p>No fee unless we win. All consultations by appointment.</p><a class="aside-phone" href="tel:'+C.phoneTel+'">'+C.phoneDisplay+'</a><a class="btn btn-gold" href="'+R+'contact/">Get Started</a><a class="btn btn-ghost" href="tel:'+C.phoneTel+'">Call Now</a><div class="related-list"><h4>Related areas</h4>'+d.related.map(function(k){return '<a href="'+R+'practice-areas/'+k+'.html">'+esc(D.areas[k].name)+'</a>';}).join("")+'</div></div></aside></div>'+
 '<div class="stats-band reveal"><div class="sb-item"><b>$1B+</b><span>Recovered</span></div><div class="sb-item"><b>2,000+</b><span>Cases won</span></div><div class="sb-item"><b>2</b><span>Offices · ATL &amp; DC</span></div><div class="sb-item"><b>Free</b><span>Consultations</span></div></div>';}
function renderAttorneys(){var pg=document.getElementById("partners-grid");
 if(pg)pg.innerHTML=D.team.partners.map(function(p){return '<div class="partner-card reveal"><div class="avatar">'+p.initials+'</div><h3>'+esc(p.name)+'</h3><div class="role">'+esc(p.role)+'</div><button class="bio-btn" data-partner="'+p.key+'">View Bio</button></div>';}).join("");
 ["attorneys","paralegals","staff"].forEach(function(k){var el=document.getElementById("tab-"+k);if(!el)return;
  el.innerHTML='<div class="staff-grid">'+D.team[k].map(function(m){var ini=m[0].split(" ").map(function(w){return w[0];}).join("").slice(0,2).toUpperCase();
   return '<div class="staff-card reveal"><div class="avatar">'+ini+'</div><div><b>'+esc(m[0])+'</b><span>'+esc(m[1])+'</span></div></div>';}).join("")+'</div>';});
 document.querySelectorAll(".tab[data-tab]").forEach(function(btn){btn.addEventListener("click",function(){
  document.querySelectorAll(".tab[data-tab]").forEach(function(b){b.classList.toggle("active",b===btn);});
  document.querySelectorAll(".tab-panel").forEach(function(p){p.classList.toggle("active",p.id==="tab-"+btn.dataset.tab);});});});}
function renderResults(){var g=document.getElementById("results-grid");if(!g)return;
 g.innerHTML=D.results.map(function(x){return '<div class="result-card reveal"><div class="amt">'+x.amt+'</div><div class="lbl">'+esc(x.lbl)+'</div></div>';}).join("");}
function renderMedia(){var g=document.getElementById("media-grid");if(!g)return;
 var cats={press:"Press Conference",firm:"Firm News",results:"Case Results"};
 g.innerHTML=D.media.map(function(v){return '<div class="video-card reveal" data-cat="'+v.cat+'"><div class="yt" data-id="'+v.id+'" data-title="'+esc(v.title)+'"></div><div class="video-meta"><span class="vc-cat">'+cats[v.cat]+'</span><h3>'+esc(v.title)+'</h3><div class="vc-by">'+esc(v.by)+'</div></div></div>';}).join("");
 var mf=document.getElementById("media-filters");
 if(mf)mf.querySelectorAll("[data-filter]").forEach(function(btn){btn.addEventListener("click",function(){
  mf.querySelectorAll("[data-filter]").forEach(function(b){b.classList.toggle("active",b===btn);});
  var f=btn.dataset.filter;g.querySelectorAll(".video-card").forEach(function(card){card.style.display=(f==="all"||card.dataset.cat===f)?"":"none";});});});}
function renderNews(){var grid=document.getElementById("news-grid");if(!grid)return;
 var chips=document.getElementById("news-filters"),pager=document.getElementById("news-pager"),PER=9,cat="All",page=1;
 var cats=["All"];D.news.forEach(function(a){a.cats.forEach(function(c){if(cats.indexOf(c)<0)cats.push(c);});});
 chips.innerHTML=cats.map(function(c){return '<button class="chip'+(c==="All"?" active":"")+'" data-cat="'+c+'">'+c+'</button>';}).join("");
 chips.querySelectorAll(".chip").forEach(function(ch){ch.addEventListener("click",function(){cat=ch.dataset.cat;page=1;
  chips.querySelectorAll(".chip").forEach(function(x){x.classList.toggle("active",x===ch);});render();});});
 function render(){var list=D.news.filter(function(a){return cat==="All"||a.cats.indexOf(cat)>-1;});
  var pages=Math.max(1,Math.ceil(list.length/PER));page=Math.min(page,pages);
  var slice=list.slice((page-1)*PER,page*PER);
  grid.innerHTML=slice.map(function(a){return '<article class="news-card reveal in"><div class="nc-meta">'+a.date+' • <span class="nc-cat">'+a.cats[0]+'</span></div><h3><a href="'+R+'news/'+a.slug+'.html">'+esc(a.title)+'</a></h3><p>'+esc(a.excerpt)+'</p>'+(a.hasVideo?'<span class="nc-video-flag">'+I.play+' Video feature</span>':'')+'<a class="more" href="'+R+'news/'+a.slug+'.html">Read More</a></article>';}).join("")||'<p style="color:var(--muted)">No articles in this category yet.</p>';
  pager.innerHTML=pages>1?Array.from({length:pages},function(_,i){return '<button class="'+(i+1===page?"active":"")+'" data-p="'+(i+1)+'">'+(i+1)+'</button>';}).join(""):"";
  pager.querySelectorAll("button").forEach(function(b){b.addEventListener("click",function(){page=+b.dataset.p;render();scrollTo({top:grid.offsetTop-120,behavior:"smooth"});});});}
 render();}
function renderReviews(){var g=document.getElementById("reviews-grid");if(!g)return;
 g.innerHTML=D.reviews.map(function(x){return '<div class="review-card reveal"><div class="stars">★★★★★</div><blockquote>“'+esc(x.q)+'”</blockquote><div class="t-who">'+esc(x.who)+' <span>/ client</span></div></div>';}).join("");}
var page=document.body.dataset.page;
if(page==="home")renderHome();
if(page==="areas"){var pa=document.getElementById("pa-grid");if(pa)pa.innerHTML=paCards();}
if(page==="area")renderArea();
if(page==="attorneys")renderAttorneys();
if(page==="results")renderResults();
if(page==="media")renderMedia();
if(page==="news")renderNews();
if(page==="reviews")renderReviews();
initYT();initReveal();initCounters();initSlider();initBios();
})();
