/* Meetzy Widget v1.0 — https://meetzy.ai */
"use strict";(()=>{function Z(t,n=50){let i=parseInt(t.slice(1,3),16),e=parseInt(t.slice(3,5),16),a=parseInt(t.slice(5,7),16);return`rgb(${Math.min(255,i+n)},${Math.min(255,e+n)},${Math.min(255,a+n)})`}function q(t,n,i,e,a,s){let r=s.subtype==="female",o=r?"#f5c5a0":"#e8b88a",c=r?"#4a2c0a":"#2c1a0a";t.save(),t.translate(n,i+a.breathePhase*1.5*e),t.fillStyle=s.brandColor,t.beginPath(),t.roundRect(-28*e,30*e,56*e,55*e,8*e),t.fill(),t.fillStyle="rgba(255,255,255,0.8)",t.font=`bold ${13*e}px sans-serif`,t.textAlign="center",t.textBaseline="middle",t.fillText("M",n,i+55*e),t.fillStyle=s.brandColor,t.beginPath(),t.roundRect(-44*e,32*e,17*e,42*e,6*e),t.fill(),t.beginPath(),t.roundRect(27*e,32*e,17*e,42*e,6*e),t.fill(),t.fillStyle=o,t.beginPath(),t.roundRect(-8*e,8*e,16*e,22*e,4*e),t.fill(),t.save(),t.translate(a.headWobble*e,0),t.fillStyle=c,r?(t.beginPath(),t.ellipse(n,i-32*e,34*e,38*e,0,0,Math.PI*2),t.fill(),t.beginPath(),t.roundRect(n-33*e,i-35*e,11*e,55*e,6*e),t.fill(),t.beginPath(),t.roundRect(n+22*e,i-35*e,11*e,55*e,6*e),t.fill()):(t.beginPath(),t.ellipse(n,i-34*e,29*e,22*e,0,0,Math.PI),t.fill()),t.fillStyle=o,t.beginPath(),t.ellipse(n,i-20*e,29*e,33*e,0,0,Math.PI*2),t.fill();let d=i-26*e,l=a.blinkProgress;t.fillStyle="#fff",t.beginPath(),t.ellipse(n-10*e,d,8*e,8*l*e,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(n+10*e,d,8*e,8*l*e,0,0,Math.PI*2),t.fill(),t.fillStyle="#2c1a0a",t.beginPath(),t.ellipse(n-10*e,d,5*e,5*l*e,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(n+10*e,d,5*e,5*l*e,0,0,Math.PI*2),t.fill(),t.fillStyle="rgba(255,255,255,0.6)",t.beginPath(),t.ellipse(n-8*e,d-2*e,2*e,2*l*e,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(n+12*e,d-2*e,2*e,2*l*e,0,0,Math.PI*2),t.fill(),t.fillStyle="#c0392b",t.beginPath(),t.ellipse(n,i-5*e,10*e,(3+a.mouthOpen*5)*e,0,0,Math.PI),t.fill(),t.restore(),t.restore()}function K(t,n,i,e,a,s){t.save(),t.translate(n,i+a.breathePhase*1.5*e),t.fillStyle=s.brandColor,t.beginPath(),t.roundRect(-30*e,20*e,60*e,65*e,10*e),t.fill(),t.save(),t.translate(a.headWobble*e,0),t.fillStyle="#8B5E3C",t.beginPath(),t.ellipse(n-28*e,i-18*e,13*e,20*e,-.4,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(n+28*e,i-18*e,13*e,20*e,.4,0,Math.PI*2),t.fill(),t.fillStyle="#c4895f",t.beginPath(),t.ellipse(n,i-15*e,33*e,30*e,0,0,Math.PI*2),t.fill(),t.fillStyle="#e0b080",t.beginPath(),t.ellipse(n,i,16*e,13*e,0,0,Math.PI*2),t.fill(),t.fillStyle="#1a1a1a",t.beginPath(),t.ellipse(n,i-4*e,6*e,5*e,0,0,Math.PI*2),t.fill();let r=a.blinkProgress;t.fillStyle="#fff",t.beginPath(),t.ellipse(n-14*e,i-22*e,8*e,8*r*e,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(n+14*e,i-22*e,8*e,8*r*e,0,0,Math.PI*2),t.fill(),t.fillStyle="#2c1a0a",t.beginPath(),t.ellipse(n-14*e,i-22*e,5*e,5*r*e,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(n+14*e,i-22*e,5*e,5*r*e,0,0,Math.PI*2),t.fill(),t.strokeStyle="#6b3a1f",t.lineWidth=2*e,t.beginPath(),t.moveTo(n-8*e,i+6*e),t.quadraticCurveTo(n,i+(10+a.mouthOpen*8)*e,n+8*e,i+6*e),t.stroke(),t.restore(),t.restore()}function ee(t,n,i,e,a){let s=a.isTalking?Math.abs(Math.sin(a.frame*.3))*5:0;t.save(),t.translate(n,i-s*e+a.breathePhase*1.5*e);let r=t.createRadialGradient(-14*e,i-20*e,4*e,0,i+10*e,52*e);r.addColorStop(0,"#ffa030"),r.addColorStop(1,"#e05800"),t.fillStyle=r,t.beginPath(),t.arc(0,i+10*e,52*e,0,Math.PI*2),t.fill(),t.fillStyle="#2ea032",t.beginPath(),t.ellipse(5*e,i-46*e,7*e,17*e,.5,0,Math.PI*2),t.fill(),t.strokeStyle="#4a2c0a",t.lineWidth=3*e,t.beginPath(),t.moveTo(0,i-42*e),t.quadraticCurveTo(5*e,i-56*e,0,i-62*e),t.stroke();let o=a.blinkProgress;t.fillStyle="#fff",t.beginPath(),t.ellipse(-16*e,i-5*e,9*e,9*o*e,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(16*e,i-5*e,9*e,9*o*e,0,0,Math.PI*2),t.fill(),t.fillStyle="#1a1a1a",t.beginPath(),t.ellipse(-16*e,i-5*e,5*e,5*o*e,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(16*e,i-5*e,5*e,5*o*e,0,0,Math.PI*2),t.fill(),t.strokeStyle="#c05000",t.lineWidth=3*e,t.beginPath(),t.arc(0,i+10*e,15*e,.2,Math.PI-.2),t.stroke(),a.mouthOpen>.1&&(t.fillStyle="#c05000",t.beginPath(),t.ellipse(0,i+20*e,10*e,(3+a.mouthOpen*7)*e,0,0,Math.PI),t.fill()),t.restore()}function te(t,n,i,e,a,s){t.save(),t.translate(n,i+a.breathePhase*1.5*e),t.strokeStyle=s.brandColor,t.lineWidth=7*e,t.beginPath(),t.arc(n+40*e,i+15*e,17*e,-.8,.8),t.stroke(),t.fillStyle=s.brandColor,t.beginPath(),t.moveTo(n-28*e,i-30*e),t.lineTo(n-33*e,i+48*e),t.quadraticCurveTo(n,i+60*e,n+33*e,i+48*e),t.lineTo(n+28*e,i-30*e),t.closePath(),t.fill(),t.fillStyle=Z(s.brandColor,40),t.beginPath(),t.ellipse(n,i-30*e,28*e,7*e,0,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(255,255,255,0.25)",t.lineWidth=2.5*e;let r=a.frame*2%20;for(let c=-1;c<=1;c++)t.beginPath(),t.moveTo(n+c*9*e,i-38*e-r*e),t.quadraticCurveTo(n+(c+1)*7*e,i-52*e-r*e,n+c*7*e,i-65*e-r*e),t.stroke();let o=a.blinkProgress;t.fillStyle="#fff",t.beginPath(),t.ellipse(n-10*e,i-5*e,8*e,8*o*e,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(n+10*e,i-5*e,8*e,8*o*e,0,0,Math.PI*2),t.fill(),t.fillStyle="#1a1a1a",t.beginPath(),t.ellipse(n-10*e,i-5*e,5*e,5*o*e,0,0,Math.PI*2),t.fill(),t.beginPath(),t.ellipse(n+10*e,i-5*e,5*e,5*o*e,0,0,Math.PI*2),t.fill(),t.strokeStyle="rgba(255,255,255,0.8)",t.lineWidth=2.5*e,t.beginPath(),t.arc(n,i+15*e,11*e,.2,Math.PI-.2),t.stroke(),a.mouthOpen>.1&&(t.fillStyle="rgba(0,0,0,0.35)",t.beginPath(),t.ellipse(n,i+22*e,8*e,(2+a.mouthOpen*6)*e,0,0,Math.PI),t.fill()),t.restore()}var S=class{constructor(n,i){this.raf=0;this.canvas=n,this.ctx=n.getContext("2d"),this.config=i,this.state={blinkTimer:150+Math.random()*100,blinkProgress:1,breathePhase:0,mouthOpen:0,headWobble:0,wobbleDir:1,frame:0,isTalking:!1}}setTalking(n){this.state.isTalking=n}updateConfig(n){this.config={...this.config,...n}}start(){let n=()=>{var r,o;let i=this.state,e=this.canvas.width/200,a=this.canvas.width/2,s=this.canvas.height/2;switch(this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),i.frame++,i.breathePhase=Math.sin(i.frame*.02),i.blinkTimer--,i.blinkTimer<=0&&(i.blinkTimer=180+Math.random()*120),i.blinkTimer<10?i.blinkProgress=i.blinkTimer<5?i.blinkTimer/5:(10-i.blinkTimer)/5:i.blinkProgress=1,i.headWobble+=i.wobbleDir*.04,Math.abs(i.headWobble)>1.5&&(i.wobbleDir*=-1),i.isTalking?i.mouthOpen=.3+Math.sin(i.frame*.25)*.4:i.mouthOpen=Math.max(0,i.mouthOpen-.08),this.config.type){case"human":q(this.ctx,a,s,e,i,this.config);break;case"animal":K(this.ctx,a,s,e,i,this.config);break;case"object":(r=this.config.subtype)!=null&&r.includes("taza")||(o=this.config.subtype)!=null&&o.includes("cup")?te(this.ctx,a,s,e,i,this.config):ee(this.ctx,a,s,e,i);break;default:q(this.ctx,a,s,e,i,this.config)}this.raf=requestAnimationFrame(n)};this.raf=requestAnimationFrame(n)}stop(){cancelAnimationFrame(this.raf)}};function U(t,n){let i=t.data;switch(t.type){case"card":return ie(i,n);case"gallery":return ne(i);case"booking":return ae(i,n);case"pricing":return se(i,n);case"contact":return re(i,n);default:return document.createElement("div")}}function ie(t,n){var r;let i=document.createElement("div");if(i.className="mz-ui-card",i.style.cssText=`
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 16px;
    overflow: hidden;
    margin: 8px 0;
    max-width: 280px;
  `,t.imageUrl){let o=document.createElement("img");o.src=t.imageUrl,o.alt=t.title,o.style.cssText="width:100%; height:140px; object-fit:cover;",i.appendChild(o)}else{let o=document.createElement("div");o.style.cssText=`width:100%; height:80px; background: linear-gradient(135deg, ${n}20, ${n}40); display:flex; align-items:center; justify-content:center;`,o.textContent="\u{1F6CD}\uFE0F",o.style.fontSize="2rem",i.appendChild(o)}let e=document.createElement("div");e.style.cssText="padding: 14px;";let a=document.createElement("p");if(a.style.cssText="color: #F0EDE8; font-weight: 700; font-size: 14px; margin: 0 0 6px;",a.textContent=t.title,e.appendChild(a),t.description){let o=document.createElement("p");o.style.cssText="color: #6b6b6b; font-size: 12px; margin: 0 0 8px; line-height: 1.5;",o.textContent=t.description,e.appendChild(o)}if(t.price){let o=document.createElement("p");o.style.cssText=`color: ${n}; font-weight: 700; font-size: 18px; margin: 0 0 10px;`,o.textContent=t.price,e.appendChild(o)}let s=document.createElement("a");return s.href=(r=t.ctaUrl)!=null?r:"#",s.target="_blank",s.style.cssText=`
    display: block; text-align: center; background: ${n};
    color: #fff; font-size: 12px; font-weight: 600;
    padding: 8px 16px; border-radius: 8px; text-decoration: none;
    transition: opacity 0.15s;
  `,s.textContent=t.ctaText,s.onmouseenter=()=>s.style.opacity="0.85",s.onmouseleave=()=>s.style.opacity="1",e.appendChild(s),i.appendChild(e),i}function ne(t){let n=document.createElement("div");n.style.cssText="margin: 8px 0;";let i=document.createElement("div");if(i.style.cssText="display:flex; gap:8px; overflow-x:auto; padding-bottom:6px; scrollbar-width:thin;",t.images.slice(0,6).forEach(e=>{var r;let a=document.createElement("div");a.style.cssText="flex-shrink:0; width:110px;";let s=document.createElement("img");s.src=e.url,s.alt=(r=e.alt)!=null?r:"",s.style.cssText="width:110px; height:80px; object-fit:cover; border-radius:10px;",a.appendChild(s),i.appendChild(a)}),t.caption){let e=document.createElement("p");e.style.cssText="color: #6b6b6b; font-size: 11px; margin: 6px 0 0;",e.textContent=t.caption,n.appendChild(e)}return n.appendChild(i),n}function ae(t,n){var s;let i=document.createElement("div");i.style.cssText=`
    background: #1a1a1a; border: 1px solid #2a2a2a;
    border-radius: 16px; padding: 16px; margin: 8px 0;
  `;let e=document.createElement("p");e.style.cssText="color: #F0EDE8; font-size: 13px; margin: 0 0 12px;",e.textContent=t.message,i.appendChild(e);let a=document.createElement("a");return a.href=(s=t.calUrl)!=null?s:"#",a.target="_blank",a.style.cssText=`
    display: block; text-align: center; background: ${n};
    color: #fff; font-size: 13px; font-weight: 600;
    padding: 10px 16px; border-radius: 10px; text-decoration: none;
  `,a.textContent="\u{1F4C5} Reservar reuni\xF3n",i.appendChild(a),i}function se(t,n){let i=document.createElement("div");i.style.cssText="margin: 8px 0;";let e=document.createElement("div");return e.style.cssText="display:flex; gap:8px; overflow-x:auto; padding-bottom:6px;",t.plans.forEach(a=>{let s=document.createElement("div");s.style.cssText=`
      flex-shrink:0; width:160px;
      background: ${a.highlighted?n+"15":"#1a1a1a"};
      border: 1px solid ${a.highlighted?n+"50":"#2a2a2a"};
      border-radius: 14px; padding: 14px;
    `;let r=document.createElement("p");r.style.cssText="color: #6b6b6b; font-size: 11px; font-weight: 700; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 4px;",r.textContent=a.name,s.appendChild(r);let o=document.createElement("p");o.style.cssText=`color: ${a.highlighted?n:"#F0EDE8"}; font-weight: 700; font-size: 20px; margin: 0 0 10px;`,o.textContent=a.price,s.appendChild(o);let c=document.createElement("ul");if(c.style.cssText="margin:0 0 12px; padding: 0 0 0 14px;",a.features.slice(0,4).forEach(d=>{let l=document.createElement("li");l.style.cssText="color: #a0a0a0; font-size: 11px; margin-bottom: 4px;",l.textContent=d,c.appendChild(l)}),s.appendChild(c),a.ctaUrl){let d=document.createElement("a");d.href=a.ctaUrl,d.target="_blank",d.style.cssText=`
        display:block; text-align:center; padding: 7px;
        background: ${a.highlighted?n:"transparent"};
        border: 1px solid ${a.highlighted?"transparent":"#333"};
        color: ${a.highlighted?"#fff":"#F0EDE8"};
        border-radius: 8px; font-size: 11px; font-weight:600; text-decoration:none;
      `,d.textContent="Elegir plan",s.appendChild(d)}e.appendChild(s)}),i.appendChild(e),i}function re(t,n){let i=document.createElement("div");i.style.cssText=`
    background: #1a1a1a; border: 1px solid #2a2a2a;
    border-radius: 16px; padding: 16px; margin: 8px 0;
  `;let e=document.createElement("p");e.style.cssText="color: #F0EDE8; font-size: 13px; margin: 0 0 12px;",e.textContent=t.message,i.appendChild(e);let a=document.createElement("form");a.style.cssText="display:flex; flex-direction:column; gap:8px;",a.addEventListener("submit",r=>r.preventDefault()),t.fields.forEach(r=>{var c,d;let o=document.createElement("input");o.type=(c=r.type)!=null?c:"text",o.placeholder=r.label,o.required=(d=r.required)!=null?d:!1,o.style.cssText=`
      background: #0e0e0e; border: 1px solid #222; color: #F0EDE8;
      border-radius: 10px; padding: 8px 12px; font-size: 12px; outline:none;
    `,o.onfocus=()=>o.style.borderColor=n,o.onblur=()=>o.style.borderColor="#222",a.appendChild(o)});let s=document.createElement("button");return s.type="submit",s.style.cssText=`
    background: ${n}; color: #fff;
    border: none; border-radius: 10px; padding: 9px;
    font-size: 12px; font-weight: 600; cursor: pointer;
  `,s.textContent="Enviar",a.appendChild(s),i.appendChild(a),i}var oe=[{id:"hero_idle",section:"hero",priority:1,condition:t=>{var n,i;return t.currentSection==="hero"&&((i=(n=t.sectionsViewed.hero)==null?void 0:n.time)!=null?i:0)>=20},message:"\xBFQuer\xE9s que te cuente en 30 segundos qu\xE9 es Meetzy?"},{id:"problem_engage",section:"problem",priority:2,condition:t=>{var n,i;return t.currentSection==="problem"&&((i=(n=t.sectionsViewed.problem)==null?void 0:n.time)!=null?i:0)>=30},message:"\xBFAlguno de estos casos se parece a tu negocio?"},{id:"features_data",section:"features",priority:3,condition:t=>{var n,i;return t.currentSection==="features"&&((i=(n=t.sectionsViewed.features)==null?void 0:n.time)!=null?i:0)>=25},message:t=>`Esos datos que ves \u2014 son los tuyos reales en esta p\xE1gina. Llev\xE1s ${t.timeOnSite}s ac\xE1.`},{id:"usecases_tabs",section:"use-cases",priority:4,condition:t=>{var n,i;return t.currentSection==="use-cases"&&((i=(n=t.sectionsViewed["use-cases"])==null?void 0:n.revisits)!=null?i:0)>=2},message:"\xBFCu\xE1l es tu tipo de negocio? Te muestro c\xF3mo quedar\xEDa exactamente."},{id:"usecases_idle",section:"use-cases",priority:5,condition:t=>{var n,i,e,a;return t.currentSection==="use-cases"&&((i=(n=t.sectionsViewed["use-cases"])==null?void 0:n.time)!=null?i:0)>=35&&((a=(e=t.sectionsViewed["use-cases"])==null?void 0:e.revisits)!=null?a:0)<2},message:"\xBFEn qu\xE9 rubro est\xE1s? Te armo c\xF3mo quedar\xEDa tu agente."},{id:"avatar_explore",section:"avatar",priority:6,condition:t=>{var n,i;return t.currentSection==="avatar"&&((i=(n=t.sectionsViewed.avatar)==null?void 0:n.time)!=null?i:0)>=20},message:"\xBFCu\xE1l de estos se parece m\xE1s a lo que imagin\xE1s para tu marca?"},{id:"how_step3",section:"how",priority:7,condition:t=>{var n,i;return t.currentSection==="how"&&((i=(n=t.sectionsViewed.how)==null?void 0:n.time)!=null?i:0)>=30},message:"\xBFTen\xE9s web propia o us\xE1s Webflow, WordPress o Shopify?"},{id:"pricing_first",section:"pricing",priority:0,condition:t=>{var n,i,e,a;return t.currentSection==="pricing"&&((i=(n=t.sectionsViewed.pricing)==null?void 0:n.time)!=null?i:0)>=30&&((a=(e=t.sectionsViewed.pricing)==null?void 0:e.revisits)!=null?a:0)===0},message:"\xBFQuer\xE9s que te ayude a entender cu\xE1l plan tiene m\xE1s sentido para lo que necesit\xE1s?"},{id:"pricing_long",section:"pricing",priority:0,condition:t=>{var n,i;return t.currentSection==="pricing"&&((i=(n=t.sectionsViewed.pricing)==null?void 0:n.time)!=null?i:0)>=60},message:"Antes de que te vayas \u2014 ten\xE9s 14 d\xEDas gratis para probarlo sin tarjeta."},{id:"pricing_revisit",section:"pricing",priority:0,condition:t=>{var n,i;return t.currentSection==="pricing"&&((i=(n=t.sectionsViewed.pricing)==null?void 0:n.revisits)!=null?i:0)>=2},message:"Volviste a los precios. \xBFQu\xE9 te est\xE1 frenando?"},{id:"faq_idle",section:"faq",priority:8,condition:t=>{var n,i,e,a;return(t.currentSection==="pricing"||t.currentSection==="faq")&&((i=(n=t.sectionsViewed.pricing)==null?void 0:n.time)!=null?i:0)>=20&&((a=(e=t.sectionsViewed.faq)==null?void 0:e.time)!=null?a:0)>=20},message:"\xBFNo encontraste lo que buscabas? Preguntame directamente."},{id:"return_visitor",section:"*",priority:-1,condition:t=>t.isReturnVisitor&&t.timeOnSite<15,message:"Bienvenido de vuelta. \xBFSegu\xEDs evaluando o ya ten\xE9s m\xE1s claro lo que necesit\xE1s?"},{id:"exit_intent",section:"*",priority:1,condition:t=>t.mouseY<60&&t.timeOnSite>30&&t.currentSection==="pricing",message:"Antes de que te vayas \u2014 el plan Starter arranca en $29/mes y tiene 14 d\xEDas gratis."}],T={hero:["\xBFC\xF3mo funciona exactamente?","\xBFPara qu\xE9 tipo de negocio?","Ver los planes"],problem:["Tengo una veterinaria","Tengo un ecommerce","Tengo una consultora"],features:["\xBFEsto no es invasivo?","\xBFC\xF3mo lo instalo?","Ver demo en vivo"],"use-cases":["Mi negocio es diferente","\xBFFunciona para pymes?","\xBFCu\xE1nto cuesta?"],avatar:["\xBFPuedo poner mi logo?","\xBFQu\xE9 es el Plan Pro?","Ver todos los tipos"],how:["\xBFTengo que saber programar?","\xBFCu\xE1nto tarda?","Probarlo gratis"],pricing:["\xBFQu\xE9 incluye el Pro?","\xBFHay descuento anual?","Empezar gratis"],faq:["\xBFPuedo cancelar cuando quiero?","\xBFFunciona en mi web?","Hablar con alguien"],demo:["\xBFEsto es el producto real?","\xBFC\xF3mo lo instalo yo?","Empezar gratis"]},B={vendedor:["\xBFCu\xE1nto cuesta?","Quiero una demo","\xBFQu\xE9 incluye el plan?"],guia:["\xBFC\xF3mo funciona?","\xBFPara qui\xE9n es?","Ver caracter\xEDsticas"],soporte:["Tengo un problema","\xBFC\xF3mo lo resuelvo?","Hablar con alguien"],recepcionista:["Quiero un turno","Ver disponibilidad","\xBFC\xF3mo reservo?"]},L=class{constructor(){this.firedIds=new Set;this.lastTriggerAt=0;this.triggerCount=0;this.MAX_TRIGGERS=3;this.MIN_FIRST_TRIGGER_DELAY=15e3;this.COOLDOWN=18e4}evaluate(n){let i=Date.now();if(i-window._mzWidgetInit<this.MIN_FIRST_TRIGGER_DELAY||i-this.lastTriggerAt<this.COOLDOWN||this.triggerCount>=this.MAX_TRIGGERS)return null;let e=[...oe].sort((a,s)=>a.priority-s.priority);for(let a of e)if(!this.firedIds.has(a.id)&&!(a.section!=="*"&&a.section!==n.currentSection)&&a.condition(n))return this.firedIds.add(a.id),this.lastTriggerAt=i,this.triggerCount++,a;return null}getMessage(n,i){return typeof n.message=="function"?n.message(i):n.message}getChips(n){var i;return(i=T[n])!=null?i:T.hero}},W;typeof window!="undefined"&&(window._mzWidgetInit=(W=window._mzWidgetInit)!=null?W:Date.now());var F=typeof document!="undefined"&&document.currentScript instanceof HTMLScriptElement?document.currentScript.src:"",le=F?new URL(F).origin:"",de="http://localhost:3001",P=le||de;function k(t){return(t||"").replace(/\[ACTION:[^\]]+\]/g,"").replace(/[ \t]{2,}/g," ").trimEnd()}function ce(){if(typeof document=="undefined")return[];let t=[],n=new Set,i=e=>{let a=`${e.type}:${e.target}`;n.has(a)||(n.add(a),t.push(e))};return document.querySelectorAll("[data-meetzy-action]").forEach(e=>{let a=e.getAttribute("data-meetzy-action")||"",s=e.getAttribute("data-meetzy-label")||a;a&&i({type:"scroll-to",target:a,label:s})}),document.querySelectorAll("section[id],main[id],div[id][data-section]").forEach(e=>{let a=e.id;if(!a||a.length>40||/[<>'"]/.test(a))return;let s=e.getAttribute("data-meetzy-label")||e.getAttribute("aria-label")||a.replace(/[-_]/g," ");i({type:"scroll-to",target:`#${a}`,label:s})}),document.querySelectorAll("h1[id],h2[id],h3[id]").forEach(e=>{let a=e.id;if(!a||a.length>40||/[<>'"]/.test(a))return;let s=(e.textContent||"").trim().slice(0,60)||a;i({type:"scroll-to",target:`#${a}`,label:s})}),document.querySelectorAll("a[href]").forEach(e=>{let a=e.getAttribute("href")||"";if(!(!a||a[0]==="#"||a.startsWith("javascript:")||a.startsWith("mailto:")||a.startsWith("tel:")))try{let s=new URL(a,location.href);if(s.origin!==location.origin)return;let r=(e.textContent||"").trim();if(!r||r.length<2||r.length>50)return;i({type:"navigate",target:s.pathname+s.search,label:r})}catch(s){}}),t.slice(0,30)}function pe(t){try{let n=t.indexOf(":"),i=n>0?t.slice(0,n).trim():t.trim(),e=n>0?t.slice(n+1).trim():"";if(!e&&i&&i.indexOf("-")>0){let a=i.indexOf("-"),s=i.slice(0,a),r=i.slice(a+1);(s==="scroll"||s==="show"||s==="go")&&(e=`#${r}`,i="scroll-to")}if(!i)return;if(i==="scroll-to"||i==="scroll"){let a=null;if(e&&e[0]==="#")a=document.getElementById(e.slice(1));else if(e){let s=`[data-meetzy-action="${typeof CSS!="undefined"&&CSS.escape?CSS.escape(e):e}"]`;a=document.querySelector(s)||document.getElementById(e)}if(a){try{document.activeElement&&document.activeElement.blur&&document.activeElement.blur()}catch(d){}a.scrollIntoView({behavior:"smooth",block:"start"});let s=a;setTimeout(()=>{Math.abs(s.getBoundingClientRect().top)>60&&s.scrollIntoView({behavior:"auto",block:"start"})},400);let r=a.style.outline,o=a.style.boxShadow,c=a.style.transition;a.style.transition="outline 0.25s ease,box-shadow 0.25s ease",a.style.outline="2px solid rgba(124,108,255,0.7)",a.style.outlineOffset="4px",a.style.boxShadow="0 0 0 6px rgba(124,108,255,0.18)",setTimeout(()=>{a.style.outline=r,a.style.boxShadow=o,a.style.outlineOffset="",a.style.transition=c},2200)}}else if(i==="navigate"||i==="goto"){if(!e||e.startsWith("javascript:"))return;try{let a=new URL(e,location.href);if(a.origin!==location.origin)return;setTimeout(()=>location.assign(a.pathname+a.search+a.hash),600)}catch(a){}}else if(i==="highlight"||i==="flash"){let a=null;if(e&&e[0]==="#")a=document.getElementById(e.slice(1));else if(e)try{a=document.querySelector(e)}catch(s){}if(a&&a instanceof HTMLElement){a.scrollIntoView({behavior:"smooth",block:"center"});let s=a.style.boxShadow,r=a.style.transition;a.style.transition="box-shadow 0.3s ease",a.style.boxShadow="0 0 0 4px rgba(124,108,255,0.55),0 0 24px rgba(124,108,255,0.35)",setTimeout(()=>{a.style.boxShadow=s,a.style.transition=r},2500)}}typeof window!="undefined"&&typeof window.dispatchEvent=="function"&&window.dispatchEvent(new CustomEvent("meetzy:action",{detail:{type:i,target:e,raw:t}}))}catch(n){}}function he(t){if(!t)return;let n=/\[ACTION:([^\]]+)\]/g,i;for(;(i=n.exec(t))!==null;)pe(i[1])}var z=class{constructor(){this.ctx={timeOnSite:0,currentSection:"",sectionsViewed:{},referrer:document.referrer,searchQuery:null,localHour:new Date().getHours(),isReturnVisitor:!!localStorage.getItem("mz_visited"),inferredIntent:"exploring",scrollDepth:0,mouseY:window.innerHeight/2};this.startTime=Date.now();this.sectionTimers={};this.activeSections=new Set;this.observer=null;this.pagesVisited=[];this.lastActivityMs=Date.now();this.activeTimeSec=0;let n=new URLSearchParams(window.location.search);this.utm={utm_source:n.get("utm_source"),utm_medium:n.get("utm_medium"),utm_campaign:n.get("utm_campaign")},this.addPagePath(window.location.pathname),this.patchHistory()}addPagePath(n){let i=n||"/";(this.pagesVisited.length===0||this.pagesVisited[this.pagesVisited.length-1]!==i)&&this.pagesVisited.push(i)}patchHistory(){let n=this,i=e=>function(...a){let s=e.apply(this,a);return n.addPagePath(window.location.pathname),s};history.pushState=i(History.prototype.pushState),history.replaceState=i(History.prototype.replaceState),window.addEventListener("popstate",()=>this.addPagePath(window.location.pathname))}bumpActivity(){this.lastActivityMs=Date.now()}idleMs(){return Date.now()-this.lastActivityMs}init(){var e;localStorage.setItem("mz_visited","true");try{let a=new URL(document.referrer);this.ctx.searchQuery=(e=a.searchParams.get("q"))!=null?e:a.searchParams.get("query")}catch(a){}let n=()=>this.bumpActivity();["keydown","mousedown","scroll","touchstart"].forEach(a=>{window.addEventListener(a,n,{passive:!0})}),setInterval(()=>{var a;this.ctx.timeOnSite=Math.round((Date.now()-this.startTime)/1e3);for(let s of this.activeSections)this.ctx.sectionsViewed[s]||(this.ctx.sectionsViewed[s]={time:0,revisits:0}),this.ctx.sectionsViewed[s].time=Math.round((Date.now()-((a=this.sectionTimers[s])!=null?a:Date.now()))/1e3);document.visibilityState==="visible"&&Date.now()-this.lastActivityMs<45e3&&(this.activeTimeSec+=2),this.updateIntent()},2e3),this.observer=new IntersectionObserver(a=>{var s,r,o;for(let c of a){let d=c.target,l=(r=(s=d.dataset.section)!=null?s:d.id)!=null?r:"";l&&(c.isIntersecting?(this.activeSections.add(l),this.sectionTimers[l]=(o=this.sectionTimers[l])!=null?o:Date.now(),this.ctx.sectionsViewed[l]?this.ctx.sectionsViewed[l].revisits++:this.ctx.sectionsViewed[l]={time:0,revisits:0},this.ctx.currentSection=l):this.activeSections.delete(l))}},{threshold:.4});let i=a=>{var s;return(s=this.observer)==null?void 0:s.observe(a)};document.querySelectorAll("[data-section]").forEach(i),new MutationObserver(a=>{for(let s of a)for(let r of s.addedNodes)r instanceof Element&&r.hasAttribute("data-section")&&i(r)}).observe(document.body,{childList:!0,subtree:!0}),window.addEventListener("scroll",()=>{let a=document.body.scrollHeight-window.innerHeight;this.ctx.scrollDepth=a>0?Math.round(window.scrollY/a*100):0,this.bumpActivity()},{passive:!0}),window.addEventListener("mousemove",a=>{this.ctx.mouseY=a.clientY},{passive:!0})}updateIntent(){var a,s,r,o;let n=this.ctx.sectionsViewed,i=(s=(a=n.pricing)==null?void 0:a.time)!=null?s:0;((o=(r=n.pricing)==null?void 0:r.revisits)!=null?o:0)>=2||i>60?this.ctx.inferredIntent="ready_to_act":i>30?this.ctx.inferredIntent="evaluating_pricing":this.ctx.isReturnVisitor?this.ctx.inferredIntent="returning_interested":this.ctx.timeOnSite>120?this.ctx.inferredIntent="deeply_exploring":this.ctx.inferredIntent="exploring"}get(){return{...this.ctx}}destroy(){var n;(n=this.observer)==null||n.disconnect()}},H=class{constructor(n,i){this.state="idle";this.isStreaming=!1;this.avatarRenderer=null;this.msgTimeout=null;this.sessionEndSent=!1;this._outsideClickHandler=null;this.siteId=n,this.config=i,this.tracker=new z,this.triggers=new L,this.visitorId=(()=>{let a=localStorage.getItem("mz_uid");return a||(a=Math.random().toString(36).slice(2)+Date.now().toString(36),localStorage.setItem("mz_uid",a)),a})();let e=sessionStorage.getItem(`mz_c_${n}`);e&&(this.conversationId=e)}init(){let n=this.config.widgetPosition==="bottom-left",i=document.createElement("div");i.id="meetzy-widget",i.style.cssText=`position:fixed;z-index:2147483647;bottom:28px;${n?"left:28px":"right:28px"};`,document.body.appendChild(i),this.shadow=i.attachShadow({mode:"open"}),this.shadow.innerHTML=`<style>${this.css()}</style>`,this.buildBubble(),this.buildSpeech(),this.buildChat(),this.tracker.init(),this.config.proactiveEnabled&&setInterval(()=>this.evaluateTriggers(),2e3),window.addEventListener("pagehide",()=>{this.flushSession()}),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&this.flushSession()}),window.addEventListener("beforeunload",()=>{this.flushSession()}),setInterval(()=>{this.tracker.idleMs()>=1800*1e3&&this.flushSession()},6e4)}flushSession(){var r,o;if(this.sessionEndSent)return;let n=(o=(r=this.conversationId)!=null?r:sessionStorage.getItem(`mz_c_${this.siteId}`))!=null?o:void 0;if(!n)return;this.sessionEndSent=!0;let i=this.tracker.get(),e=this.tracker.utm,a=/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),s={conversationId:n,visitorId:this.visitorId,siteId:this.siteId,sessionDuration:i.timeOnSite,activeTime:this.tracker.activeTimeSec,pagesVisited:[...this.tracker.pagesVisited],sectionsViewed:i.sectionsViewed,scrollDepth:i.scrollDepth,device:a?"mobile":"desktop",browser:navigator.userAgent.includes("Chrome")?"chrome":"other",referrer:document.referrer||null,searchQuery:i.searchQuery,utmSource:e.utm_source,utmMedium:e.utm_medium,utmCampaign:e.utm_campaign};fetch(`${P}/api/sessions/end`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s),keepalive:!0}).catch(()=>{})}buildBubble(){var o;let n=document.createElement("div");n.className="bub-wrap";let i=document.createElement("div");i.className="bub-ring",n.appendChild(i);let e=document.createElement("div");e.className="bub-badge",e.innerHTML='<span class="bub-dot"></span><span>En vivo</span>',n.appendChild(e);let a=document.createElement("div");a.className="bub",a.title=`Hablame con ${this.config.agentName}`;let s=(o=this.config.avatarImageUrl)==null?void 0:o.trim();if(s){let c=document.createElement("img");c.className="mz-avatar-img",c.src=s,c.alt="",a.appendChild(c)}else if((this.config.plan==="pro"||this.config.plan==="elite")&&this.config.avatarType){let d=document.createElement("canvas");d.width=128,d.height=128,d.style.cssText="width:52px;height:52px;border-radius:50%;",a.appendChild(d),setTimeout(()=>{var l;this.avatarRenderer=new S(d,{type:this.config.avatarType,subtype:(l=this.config.avatarSubtype)!=null?l:"",brandColor:this.config.brandColor,brandColor2:this.config.brandColor2}),this.avatarRenderer.start()},50)}else a.innerHTML=`<div class="bub-init">${this.config.agentName.slice(0,2).toUpperCase()}</div>`;a.addEventListener("click",()=>this.toggleChat());let r=null;a.addEventListener("mouseenter",()=>{r=setTimeout(()=>this.showTooltip(),400)}),a.addEventListener("mouseleave",()=>{r&&clearTimeout(r),this.hideTooltip()}),n.appendChild(a),this.bubbleWrap=n,this.shadow.appendChild(n)}showTooltip(){let n=this.shadow.querySelector(".bub-tip");n||(n=document.createElement("div"),n.className="bub-tip",n.textContent=`Hablame con ${this.config.agentName}`,this.bubbleWrap.appendChild(n)),n.style.opacity="1"}hideTooltip(){let n=this.shadow.querySelector(".bub-tip");n&&(n.style.opacity="0")}buildSpeech(){let n=document.createElement("div");n.className="speech speech-hidden",this.speechEl=n,this.shadow.appendChild(n)}showMessage(n){if(this.state==="chat")return;let i=k(n);this.state="message",this.bubbleWrap.classList.add("bub-shake"),setTimeout(()=>this.bubbleWrap.classList.remove("bub-shake"),600),this.speechEl.className="speech speech-visible",this.speechEl.innerHTML=`
      <p class="speech-text">${i}</p>
      <div class="speech-btns">
        <button class="speech-yes">Contame m\xE1s</button>
        <button class="speech-no">\u2715</button>
      </div>
    `,this.speechEl.querySelector(".speech-yes").addEventListener("click",()=>{this.closeMessage(),this.openChat(i)}),this.speechEl.querySelector(".speech-no").addEventListener("click",()=>{this.closeMessage()}),this.msgTimeout&&clearTimeout(this.msgTimeout),this.msgTimeout=setTimeout(()=>this.closeMessage(),1e4)}closeMessage(){this.speechEl.className="speech speech-hidden",this.state==="message"&&(this.state="idle"),this.msgTimeout&&(clearTimeout(this.msgTimeout),this.msgTimeout=null)}buildChat(){var w;let n=document.createElement("div");n.className="chat";let i=document.createElement("div");i.className="chat-header";let e=document.createElement("div");e.className="chat-av";let a=(w=this.config.avatarImageUrl)==null?void 0:w.trim();if(a){let h=document.createElement("img");h.className="mz-avatar-img",h.src=a,h.alt="",e.appendChild(h)}else if((this.config.plan==="pro"||this.config.plan==="elite")&&this.config.avatarType){let m=document.createElement("canvas");m.width=80,m.height=80,m.style.cssText="width:38px;height:38px;border-radius:50%;",e.appendChild(m),setTimeout(()=>{var v;new S(m,{type:this.config.avatarType,subtype:(v=this.config.avatarSubtype)!=null?v:"",brandColor:this.config.brandColor,brandColor2:this.config.brandColor2}).start()},80)}else e.innerHTML=`<div class="chat-av-init">${this.config.agentName.slice(0,2).toUpperCase()}</div>`;i.appendChild(e);let s=document.createElement("div");s.className="chat-info",s.innerHTML=`<p class="chat-name">${this.config.agentName}</p><p class="chat-role"><span class="chat-dot"></span>${this.config.agentRole}</p>`,i.appendChild(s);let r=document.createElement("button");r.className="chat-close",r.innerHTML='<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',r.addEventListener("click",()=>this.closeChat()),i.appendChild(r),n.appendChild(i);let o=document.createElement("div");o.className="chat-msgs",this.msgsEl=o,n.appendChild(o);let c=document.createElement("div");c.className="chat-chips",c.id="mz-chips",n.appendChild(c);let d=document.createElement("div");d.className="chat-input-area";let l=document.createElement("textarea");l.className="chat-ta",l.placeholder=`Preguntale a ${this.config.agentName}\u2026`,l.rows=1,l.style.fontSize="16px",l.addEventListener("input",()=>{l.style.height="auto",l.style.height=Math.min(l.scrollHeight,88)+"px"}),l.addEventListener("keydown",h=>{if(h.key==="Enter"&&!h.shiftKey){h.preventDefault();let m=l.value.trim();m&&!this.isStreaming&&this.send(m)}}),d.appendChild(l);let f=document.createElement("button");if(f.className="chat-send",f.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',f.addEventListener("click",()=>{let h=l.value.trim();h&&!this.isStreaming&&this.send(h)}),d.appendChild(f),n.appendChild(d),this.config.plan!=="elite"){let h=document.createElement("div");h.className="chat-footer",h.innerHTML='Powered by <a href="https://meetzy.ai" target="_blank">Meetzy</a>',n.appendChild(h)}this.chatEl=n,this.shadow.appendChild(n)}showChips(n){let i=this.shadow.getElementById("mz-chips");i&&(i.innerHTML="",n.forEach(e=>{let a=document.createElement("button");a.className="chip",a.textContent=e,a.addEventListener("click",()=>{i.style.display="none",this.send(e)}),i.appendChild(a)}),i.style.display="flex")}updateChips(n){var i;this.showChips((i=T[n])!=null?i:T.hero)}toggleChat(){this.state==="chat"?this.closeChat():(this.closeMessage(),this.openChat())}openChat(n){this.state="chat",this.chatEl.classList.add("chat-open");let i=this.tracker.get();if(this.msgsEl.children.length===0){let e=n!=null?n:this.buildContextOpener(i);this.typeMessage(e);let a=B[this.config.agentType];a?this.showChips(a):this.updateChips(i.currentSection)}setTimeout(()=>{var e;(e=this.chatEl.querySelector(".chat-ta"))==null||e.focus()},350),this._outsideClickHandler&&document.removeEventListener("pointerdown",this._outsideClickHandler,!0),this._outsideClickHandler=e=>{let a=this.shadow.host;a&&!a.contains(e.target)&&this.closeChat()},setTimeout(()=>{document.addEventListener("pointerdown",this._outsideClickHandler,!0)},400)}closeChat(){this.state="idle",this.chatEl.classList.remove("chat-open"),this._outsideClickHandler&&(document.removeEventListener("pointerdown",this._outsideClickHandler,!0),this._outsideClickHandler=null)}buildContextOpener(n){var e,a;if(n.isReturnVisitor)return"Bienvenido de vuelta. \xBFSegu\xEDs evaluando o ya ten\xE9s m\xE1s claro lo que necesit\xE1s?";let i=(a=(e=n.sectionsViewed.pricing)==null?void 0:e.time)!=null?a:0;return i>20?`Vi que pasaste ${i}s en los precios. \xBFQuer\xE9s que te ayude a elegir?`:n.timeOnSite>60?`Llev\xE1s ${n.timeOnSite}s explorando. \xBFPuedo ayudarte?`:this.config.welcomeMessage}typeMessage(n){let i=k(n),e=document.createElement("div");e.className="msg-wrap msg-agent";let a=document.createElement("div");a.className="msg msg-a",a.innerHTML='<span class="typing"><span></span><span></span><span></span></span>',e.appendChild(a),this.msgsEl.appendChild(e),this.msgsEl.scrollTop=9999,setTimeout(()=>{a.textContent="";let s=0,r=setInterval(()=>{s++,a.textContent=i.slice(0,s),this.msgsEl.scrollTop=9999,s>=i.length&&clearInterval(r)},20)},500)}addUserMsg(n){let i=document.createElement("div");i.className="msg-wrap msg-user";let e=document.createElement("div");e.className="msg msg-u",e.textContent=n,i.appendChild(e),this.msgsEl.appendChild(i),this.msgsEl.scrollTop=9999}addStreamBubble(){let n=document.createElement("div");n.className="msg-wrap msg-agent";let i=document.createElement("div");return i.className="msg msg-a",i.innerHTML='<span class="typing"><span></span><span></span><span></span></span>',n.appendChild(i),this.msgsEl.appendChild(n),this.msgsEl.scrollTop=9999,i}async send(n){var o,c;if(this.isStreaming)return;let i=this.chatEl.querySelector(".chat-ta");i&&(i.value="",i.style.height="auto");let e=this.shadow.getElementById("mz-chips");e&&(e.style.display="none"),this.addUserMsg(n),this.isStreaming=!0,this.tracker.bumpActivity(),(o=this.avatarRenderer)==null||o.setTalking(!0);let a=this.shadow.querySelector(".bub > img");a==null||a.classList.add("mz-talk");let s=this.addStreamBubble(),r=this.tracker.get();try{let d=await fetch(`${P}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteId:this.siteId,message:n,conversationId:this.conversationId,visitorId:this.visitorId,plan:this.config.plan,currentSection:r.currentSection,visitorContext:r,pageActions:ce(),referrer:r.referrer||document.referrer||null,utmSource:this.tracker.utm.utm_source,utmMedium:this.tracker.utm.utm_medium,utmCampaign:this.tracker.utm.utm_campaign})});if(!d.ok||!d.body){s.textContent="Error al procesar.";return}let l=d.headers.get("X-Conversation-Id");l&&(l!==this.conversationId&&(this.sessionEndSent=!1),this.conversationId=l,sessionStorage.setItem(`mz_c_${this.siteId}`,l));let f=d.body.getReader(),w=new TextDecoder,h="";for(s.textContent="";;){let{done:m,value:v}=await f.read();if(m)break;for(let C of w.decode(v).split(`
`))if(C.startsWith("data: "))try{let g=JSON.parse(C.slice(6));if(g.type==="text"&&g.content&&(h+=g.content,s.textContent=k(h),this.msgsEl.scrollTop=9999),g.type==="ui_component"&&g.component){let E=U(g.component,this.config.brandColor);this.msgsEl.appendChild(E),this.msgsEl.scrollTop=9999}}catch(g){}}he(h),this.updateChips(r.currentSection)}catch(d){s.textContent="Error de conexi\xF3n."}finally{this.isStreaming=!1,(c=this.avatarRenderer)==null||c.setTalking(!1),a==null||a.classList.remove("mz-talk")}}evaluateTriggers(){if(this.state==="chat")return;let n=this.tracker.get(),i=this.triggers.evaluate(n);if(!i)return;let e=this.triggers.getMessage(i,n);this.showMessage(e)}css(){let n=this.config.brandColor,i=this.config.widgetPosition==="bottom-left";return`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      .mz-avatar-img {
        background: transparent;
        mix-blend-mode: normal;
        object-fit: contain;
      }
      @keyframes mz-breathe { 0%,100%{transform:scale(1) translateY(0)} 50%{transform:scale(1.015) translateY(-2px)} }
      @keyframes mz-talk { 0%,100%{transform:rotate(0deg)} 25%{transform:rotate(1.2deg) scale(1.02)} 75%{transform:rotate(-1.2deg) scale(1.02)} }

      /* \u2500\u2500 BUBBLE \u2500\u2500 */
      .bub-wrap { position: relative; width: 64px; height: 64px; }
      .bub {
        width: 64px; height: 64px; border-radius: 50%; background: ${n};
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; position: relative; z-index: 2;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 0 0 ${n}40;
        transition: transform 0.25s cubic-bezier(.34,1.56,.64,1);
      }
      .bub:hover { transform: scale(1.1); }
      .bub-ring {
        position: absolute; inset: -5px; border-radius: 50%;
        border: 2px solid ${n}; opacity: 0.35; z-index: 1; pointer-events: none;
        animation: mz-ring 3s ease-out infinite;
      }
      .bub-init { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: #fff; }
      .bub > img {
        width: 52px; height: 52px; border-radius: 50%; display: block;
        animation: mz-breathe 3s ease-in-out infinite;
      }
      .bub > img.mz-talk { animation: mz-talk 0.35s ease-in-out infinite; }
      .bub-badge {
        position: absolute; top: -6px; ${i?"left: -4px":"right: -4px"};
        background: #111; border: 1px solid rgba(255,255,255,0.1);
        border-radius: 20px; padding: 2px 7px;
        display: flex; align-items: center; gap: 4px;
        font-family: 'DM Sans', sans-serif; font-size: 9px; color: #F0EDE8;
        z-index: 3; white-space: nowrap;
      }
      .bub-dot { width: 5px; height: 5px; border-radius: 50%; background: #22c55e; animation: mz-blink 2s ease infinite; }
      .bub-tip {
        position: absolute; ${i?"left: 72px":"right: 72px"};
        top: 50%; transform: translateY(-50%);
        background: #111; border: 1px solid rgba(255,255,255,0.09);
        color: #F0EDE8; font-family: 'DM Sans', sans-serif;
        font-size: 11px; padding: 6px 12px; border-radius: 10px;
        white-space: nowrap; opacity: 0; pointer-events: none;
        transition: opacity 0.2s; box-shadow: 0 4px 16px rgba(0,0,0,0.3);
      }
      @keyframes bub-shake {
        0%,100% { transform: translateX(0) rotate(0deg); }
        20%      { transform: translateX(-4px) rotate(-3deg); }
        40%      { transform: translateX(4px) rotate(3deg); }
        60%      { transform: translateX(-3px) rotate(-2deg); }
        80%      { transform: translateX(3px) rotate(2deg); }
      }
      .bub-shake .bub { animation: bub-shake 0.6s cubic-bezier(.36,.07,.19,.97); }

      /* \u2500\u2500 SPEECH \u2500\u2500 */
      .speech {
        position: absolute;
        ${i?"left: 0":"right: 0"};
        bottom: 72px; width: 260px;
        font-family: 'DM Sans', sans-serif;
        transition: opacity 0.3s ease, transform 0.35s cubic-bezier(.34,1.4,.64,1);
      }
      .speech-hidden { opacity: 0; transform: translateY(8px) scale(0.95); pointer-events: none; }
      .speech-visible { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }
      .speech-text {
        background: #0E0E12; border: 1px solid rgba(255,255,255,0.1);
        border-radius: ${i?"16px 16px 16px 4px":"16px 16px 4px 16px"};
        padding: 14px 16px; font-size: 13px; color: #F0EDE8;
        line-height: 1.55; margin-bottom: 8px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.45);
      }
      .speech-btns { display: flex; gap: 6px; }
      .speech-yes {
        flex: 1; padding: 7px 10px; background: ${n};
        border: none; border-radius: 9px; color: #fff;
        font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600;
        cursor: pointer; transition: opacity 0.15s;
      }
      .speech-yes:hover { opacity: 0.85; }
      .speech-no {
        width: 30px; height: 30px; background: rgba(255,255,255,0.07);
        border: none; border-radius: 9px; color: rgba(255,255,255,0.4);
        cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center;
        transition: background 0.15s;
      }
      .speech-no:hover { background: rgba(255,255,255,0.12); }

      /* \u2500\u2500 CHAT PANEL \u2500\u2500 */
      .chat {
        position: absolute;
        ${i?"left: 0":"right: 0"};
        bottom: 76px; width: 380px; height: 540px;
        background: #0E0E0E; border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        box-shadow: 0 24px 80px rgba(0,0,0,0.65);
        display: flex; flex-direction: column; overflow: hidden;
        transform-origin: ${i?"bottom left":"bottom right"};
        transform: scale(0.88) translateY(8px); opacity: 0;
        transition: transform 0.35s cubic-bezier(.34,1.2,.64,1), opacity 0.3s ease;
        pointer-events: none;
      }
      .chat-open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

      .chat-header {
        display: flex; align-items: center; gap: 10px;
        padding: 13px 15px; border-bottom: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
      }
      .chat-av { width: 38px; height: 38px; border-radius: 50%; overflow: hidden; flex-shrink: 0; background: ${n}; }
      .chat-av > img { width: 100%; height: 100%; display: block; animation: mz-breathe 3s ease-in-out infinite; }
      .chat-av-init {
        width: 38px; height: 38px; border-radius: 50%; background: ${n}; color: #fff;
        font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px;
        display: flex; align-items: center; justify-content: center;
      }
      .chat-info { flex: 1; min-width: 0; }
      .chat-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; color: #F0EDE8; }
      .chat-role { font-size: 10px; color: rgba(240,237,232,0.4); display: flex; align-items: center; gap: 3px; margin-top: 2px; }
      .chat-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; flex-shrink: 0; }
      .chat-close {
        background: none; border: none; color: rgba(240,237,232,0.35); cursor: pointer;
        padding: 5px; border-radius: 7px; display: flex; transition: color 0.15s, background 0.15s;
      }
      .chat-close:hover { color: #F0EDE8; background: rgba(255,255,255,0.06); }

      .chat-msgs {
        flex: 1; overflow-y: auto; padding: 13px;
        display: flex; flex-direction: column; gap: 8px;
        scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent;
      }
      .msg-wrap { display: flex; }
      .msg-agent { justify-content: flex-start; }
      .msg-user  { justify-content: flex-end; }
      .msg {
        max-width: 83%; padding: 9px 13px; border-radius: 17px;
        font-family: 'DM Sans', sans-serif; font-size: 13px; line-height: 1.5;
        word-wrap: break-word; animation: mz-fade 0.22s ease;
      }
      .msg-a { background: #1a1a1a; color: #F0EDE8; border-bottom-left-radius: 3px; }
      .msg-u { background: ${n}; color: #fff; border-bottom-right-radius: 3px; }

      .typing { display: flex; gap: 4px; padding: 2px 0; }
      .typing span { width: 6px; height: 6px; background: ${n}; border-radius: 50%; animation: mz-bounce 1.2s ease infinite; }
      .typing span:nth-child(2) { animation-delay: 0.15s; }
      .typing span:nth-child(3) { animation-delay: 0.3s; }

      .chat-chips { padding: 0 13px 9px; display: flex; flex-wrap: wrap; gap: 5px; flex-shrink: 0; }
      .chip {
        background: transparent; border: 1px solid ${n}45; color: ${n};
        padding: 5px 10px; border-radius: 100px;
        font-family: 'DM Sans', sans-serif; font-size: 11px; cursor: pointer;
        transition: all 0.15s;
      }
      .chip:hover { background: ${n}12; }

      .chat-input-area {
        display: flex; align-items: flex-end; gap: 7px;
        padding: 9px 13px; border-top: 1px solid rgba(255,255,255,0.06); flex-shrink: 0;
      }
      .chat-ta {
        flex: 1; background: #1a1a1a; border: 1px solid rgba(255,255,255,0.08);
        color: #F0EDE8; border-radius: 12px; padding: 8px 12px;
        font-family: 'DM Sans', sans-serif; font-size: 13px; resize: none;
        outline: none; max-height: 88px; line-height: 1.5; transition: border-color 0.15s;
      }
      .chat-ta:focus { border-color: ${n}; }
      .chat-ta::placeholder { color: rgba(240,237,232,0.22); }
      .chat-send {
        width: 35px; height: 35px; border-radius: 50%; background: ${n}; border: none;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; flex-shrink: 0; transition: opacity 0.15s, transform 0.15s;
      }
      .chat-send:hover { opacity: 0.85; transform: scale(1.06); }
      .chat-footer { text-align: center; padding: 6px; font-size: 9px; color: rgba(240,237,232,0.2); font-family: 'DM Sans', sans-serif; flex-shrink: 0; }
      .chat-footer a { color: ${n}; text-decoration: none; }

      /* \u2500\u2500 ANIMATIONS \u2500\u2500 */
      @keyframes mz-ring  { 0%   { transform: scale(1); opacity: 0.35; } 100% { transform: scale(1.75); opacity: 0; } }
      @keyframes mz-blink { 0%,80%,100% { opacity: 1; } 40% { opacity: 0.3; } }
      @keyframes mz-bounce{ 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }
      @keyframes mz-fade  { from { opacity: 0; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }

      /* \u2500\u2500 MOBILE \u2500\u2500 */
      @media (max-width: 600px) {
        .chat {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          width: 100vw;
          height: 100vh;
          height: 100dvh;
          border-radius: 0;
          padding-top: env(safe-area-inset-top, 0px);
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        .chat-msgs { padding: 14px 16px; }
        .chat-input-area { padding: 10px 14px; }
        .chat-chips { padding: 0 14px 10px; }
        .speech { width: calc(100vw - 100px); max-width: 280px; }
      }
    `}};function me(t,n){var $;Array.from(document.body.children).forEach(p=>{p.id!=="meetzy-fp"&&(p.style.display="none")}),document.body.style.cssText="margin:0;padding:0;overflow:hidden;";let i=document.createElement("div");i.id="meetzy-fp",i.style.cssText="position:fixed;inset:0;z-index:2147483647;",document.body.appendChild(i);let e=i.attachShadow({mode:"open"}),a=n.brandColor;e.innerHTML=`<style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    .mz-avatar-img{background:transparent;mix-blend-mode:normal;object-fit:contain;}
    .w{display:flex;width:100vw;height:100vh;background:#08080a;font-family:'DM Sans',sans-serif;color:#F0EDE8;}
    .s{width:240px;flex-shrink:0;background:#0d0d0d;border-right:1px solid rgba(255,255,255,0.06);display:flex;flex-direction:column;align-items:center;padding:40px 20px;gap:14px;}
    .av{width:90px;height:90px;border-radius:50%;background:${a};color:#fff;font-family:'Syne',sans-serif;font-weight:800;font-size:32px;display:flex;align-items:center;justify-content:center;overflow:hidden;}
    .av img{width:100%;height:100%;display:block;}
    .an{font-family:'Syne',sans-serif;font-weight:800;font-size:17px;}
    .ar{font-size:11px;color:rgba(240,237,232,0.4);display:flex;align-items:center;gap:4px;}
    .ad{width:7px;height:7px;border-radius:50%;background:#22c55e;}
    .c{flex:1;display:flex;flex-direction:column;min-width:0;}
    .m{flex:1;overflow-y:auto;padding:28px 44px;display:flex;flex-direction:column;gap:12px;}
    .mw{display:flex;}.ma{justify-content:flex-start;}.mu{justify-content:flex-end;}
    .mb{max-width:72%;padding:12px 16px;border-radius:18px;font-size:14px;line-height:1.6;word-wrap:break-word;}
    .mba{background:#111;border:1px solid rgba(255,255,255,0.06);border-bottom-left-radius:4px;}
    .mbu{background:${a};color:#fff;border-bottom-right-radius:4px;}
    .ia{display:flex;align-items:flex-end;gap:10px;padding:14px 44px 28px;border-top:1px solid rgba(255,255,255,0.05);}
    .it{flex:1;background:#111;border:1px solid rgba(255,255,255,0.08);color:#F0EDE8;border-radius:14px;padding:12px 16px;font-size:14px;resize:none;outline:none;max-height:110px;line-height:1.5;transition:border-color 0.15s;}
    .it:focus{border-color:${a};}
    .it::placeholder{color:rgba(240,237,232,0.2);}
    .sb{width:46px;height:46px;border-radius:50%;background:${a};border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}
    .typing{display:flex;gap:4px;padding:2px 0;}
    .typing span{width:8px;height:8px;background:${a};border-radius:50%;animation:b 1.2s ease infinite;}
    .typing span:nth-child(2){animation-delay:0.15s;}
    .typing span:nth-child(3){animation-delay:0.3s;}
    @keyframes b{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
    @media(max-width:600px){.s{display:none;}.m,.ia{padding-left:16px;padding-right:16px;}}
  </style>`;let s=document.createElement("div");s.className="w",e.appendChild(s);let r=document.createElement("div");r.className="s";let o=document.createElement("div");o.className="av";let c=($=n.avatarImageUrl)==null?void 0:$.trim();if(c){let p=document.createElement("img");p.className="mz-avatar-img",p.src=c,p.alt="",o.appendChild(p)}else o.textContent=n.agentName.slice(0,2).toUpperCase();r.appendChild(o);let d=document.createElement("div");d.className="an",d.textContent=n.agentName,r.appendChild(d);let l=document.createElement("div");l.className="ar",l.innerHTML=`<span class="ad"></span>${n.agentRole}`,r.appendChild(l),s.appendChild(r);let f=document.createElement("div");f.className="c";let w=document.createElement("div");w.className="m",w.id="fp-msgs",f.appendChild(w);let h=document.createElement("div");h.className="ia";let m=document.createElement("textarea");m.className="it",m.placeholder="Contame qu\xE9 necesit\xE1s\u2026",m.rows=1,m.addEventListener("input",()=>{m.style.height="auto",m.style.height=Math.min(m.scrollHeight,110)+"px"}),h.appendChild(m);let v=document.createElement("button");v.className="sb",v.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',h.appendChild(v),f.appendChild(h),s.appendChild(f);let C=(()=>{let p=localStorage.getItem("mz_uid");return p||(p=Math.random().toString(36).slice(2),localStorage.setItem("mz_uid",p)),p})(),g,E=!1,j=Date.now(),_=!1;function N(){if(_||!g)return;_=!0;let p=Math.round((Date.now()-j)/1e3),u=new URLSearchParams(location.search);fetch(`${P}/api/sessions/end`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({conversationId:g,visitorId:C,siteId:t,sessionDuration:p,activeTime:p,pagesVisited:[location.pathname],scrollDepth:0,device:/Mobile/i.test(navigator.userAgent)?"mobile":"desktop",browser:navigator.userAgent.includes("Chrome")?"chrome":"other",referrer:document.referrer||null,utmSource:u.get("utm_source"),utmMedium:u.get("utm_medium"),utmCampaign:u.get("utm_campaign")}),keepalive:!0}).catch(()=>{})}window.addEventListener("beforeunload",N),document.addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&N()});function A(p,u){let x=e.getElementById("fp-msgs"),b=document.createElement("div");b.className=`mw m${p}`;let y=document.createElement("div");return y.className=`mb mb${p}`,y.textContent=p==="a"?k(u):u,b.appendChild(y),x.appendChild(b),x.scrollTop=9999,y}A("a",n.welcomeMessage);async function R(p){if(E)return;m.value="",m.style.height="auto",A("u",p),E=!0;let u=e.getElementById("fp-msgs"),x=document.createElement("div");x.className="mw ma";let b=document.createElement("div");b.className="mb mba",b.innerHTML='<span class="typing"><span></span><span></span><span></span></span>',x.appendChild(b),u.appendChild(x),u.scrollTop=9999;try{let y=new URLSearchParams(location.search),M=await fetch(`${P}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({siteId:t,message:p,conversationId:g,visitorId:C,plan:n.plan,referrer:document.referrer||null,utmSource:y.get("utm_source"),utmMedium:y.get("utm_medium"),utmCampaign:y.get("utm_campaign")})});if(!M.ok||!M.body){b.textContent="Error.";return}let D=M.headers.get("X-Conversation-Id");D&&(D!==g&&(_=!1),g=D);let G=M.body.getReader(),Q=new TextDecoder,O="";for(b.textContent="";;){let{done:X,value:J}=await G.read();if(X)break;for(let V of Q.decode(J).split(`
`))if(V.startsWith("data: "))try{let I=JSON.parse(V.slice(6));I.type==="text"&&I.content&&(O+=I.content,b.textContent=k(O),u.scrollTop=9999)}catch(I){}}}catch(y){b.textContent="Error."}finally{E=!1}}m.addEventListener("keydown",p=>{if(p.key==="Enter"&&!p.shiftKey){p.preventDefault();let u=m.value.trim();u&&!E&&R(u)}}),v.addEventListener("click",()=>{let p=m.value.trim();p&&!E&&R(p)})}async function Y(){var i,e,a;if(document.getElementById("meetzy-widget")||document.getElementById("meetzy-fp"))return;let t=(i=window.MEETZYCONFIG)==null?void 0:i.siteId;if(!t)return;window._mzWidgetInit=(e=window._mzWidgetInit)!=null?e:Date.now();let n;try{let s=await fetch(`${P}/api/sites/${t}/config`);if(!s.ok)return;let r=await s.json();if(n={...r,avatarImageUrl:(a=r.avatarImageUrl)!=null?a:null},!n.isActive)return}catch(s){return}if(n.embedMode==="fullpage"){me(t,n);return}new H(t,n).init()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Y):Y();})();
