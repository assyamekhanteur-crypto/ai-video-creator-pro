const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Login-DPa30oL6.js","assets/vendor-supabase-DEduNpM2.js","assets/vendor-react-CTvIwhXm.js","assets/vendor-motion-3duGKUo9.js","assets/mail-Dr-ZMR7Y.js","assets/lock-usnaV-yH.js","assets/circle-alert-CQXcvbCO.js","assets/Register-MlCrx4ys.js","assets/render-D98erltM.js","assets/check-CC2vyTi1.js","assets/gift-C2do3-_T.js","assets/ForgotPassword-CnbO_oy4.js","assets/circle-check-big-JDzvh9qo.js","assets/ResetPassword-BrvPBvuj.js","assets/Terms-Bkr1uPwA.js","assets/arrow-left-C4mL3SIW.js","assets/Privacy-CMZIHzkL.js","assets/Dashboard-B4E4d1_n.js","assets/chevron-right-B7b22IMF.js","assets/play-Bq_PFbNM.js","assets/Create-DvOcVJUj.js","assets/ai-jlmB62gb.js","assets/download-ZOTWDHBH.js","assets/palette-Dklo98-s.js","assets/Editor-OHVJpKpG.js","assets/copy-CViY36eD.js","assets/trash-2-DKbY64aK.js","assets/Projects-DAM79Q6Q.js","assets/AIPipeline-B1oTLjzJ.js","assets/file-text-2JTaWN3k.js","assets/Autopilot-BUCDPFQl.js","assets/refresh-cw-BrQpXfS0.js","assets/Billing-DnpZUNis.js","assets/RenderHistory-CqDqEA2B.js","assets/circle-x-B6oa5RBb.js","assets/Analytics-Cqgsz5gA.js","assets/trending-up-Dr-NPQP5.js","assets/Admin-CCjnbpLt.js","assets/Referrals-B9JmxUW1.js","assets/Marketplace-DyD0zM09.js","assets/AITools-DJyOmcyI.js"])))=>i.map(i=>d[i]);
import{c as de,j as s,Q as ue,a as pe}from"./vendor-supabase-DEduNpM2.js";import{a as me,r as l,N as J,u as he,b as fe,c as V,O as xe,R as ye,d as f,e as ge,B as be}from"./vendor-react-CTvIwhXm.js";import{m as $,A as ve}from"./vendor-motion-3duGKUo9.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))o(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function r(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(i){if(i.ep)return;i.ep=!0;const n=r(i);fetch(i.href,n)}})();var q={},Z=me;q.createRoot=Z.createRoot,q.hydrateRoot=Z.hydrateRoot;const _e="modulepreload",je=function(e){return"/"+e},K={},y=function(t,r,o){let i=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),c=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));i=Promise.allSettled(r.map(u=>{if(u=je(u),u in K)return;K[u]=!0;const p=u.endsWith(".css"),m=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${m}`))return;const d=document.createElement("link");if(d.rel=p?"stylesheet":_e,p||(d.as="script"),d.crossOrigin="",d.href=u,c&&d.setAttribute("nonce",c),document.head.appendChild(d),p)return new Promise((h,b)=>{d.addEventListener("load",h),d.addEventListener("error",()=>b(new Error(`Unable to preload CSS for ${u}`)))})}))}function n(a){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=a,window.dispatchEvent(c),!c.defaultPrevented)throw a}return i.then(a=>{for(const c of a||[])c.status==="rejected"&&n(c.reason);return t().catch(n)})};let we={data:""},ke=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||we},Ee=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Ae=/\/\*[^]*?\*\/|  +/g,Q=/\n+/g,P=(e,t)=>{let r="",o="",i="";for(let n in e){let a=e[n];n[0]=="@"?n[1]=="i"?r=n+" "+a+";":o+=n[1]=="f"?P(a,n):n+"{"+P(a,n[1]=="k"?"":t)+"}":typeof a=="object"?o+=P(a,t?t.replace(/([^,])+/g,c=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,u=>/&/.test(u)?u.replace(/&/g,c):c?c+" "+u:u)):n):a!=null&&(n=n[1]=="-"?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=P.p?P.p(n,a):n+":"+a+";")}return r+(t&&i?t+"{"+i+"}":i)+o},I={},X=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+X(e[r]);return t}return e},Ne=(e,t,r,o,i)=>{let n=X(e),a=I[n]||(I[n]=(u=>{let p=0,m=11;for(;p<u.length;)m=101*m+u.charCodeAt(p++)>>>0;return"go"+m})(n));if(!I[a]){let u=n!==e?e:(p=>{let m,d,h=[{}];for(;m=Ee.exec(p.replace(Ae,""));)m[4]?h.shift():m[3]?(d=m[3].replace(Q," ").trim(),h.unshift(h[0][d]=h[0][d]||{})):h[0][m[1]]=m[2].replace(Q," ").trim();return h[0]})(e);I[a]=P(i?{["@keyframes "+a]:u}:u,r?"":"."+a)}let c=r&&I.g;return r&&(I.g=I[a]),((u,p,m,d)=>{d?p.data=p.data.replace(d,u):p.data.indexOf(u)===-1&&(p.data=m?u+p.data:p.data+u)})(I[a],t,o,c),a},Ie=(e,t,r)=>e.reduce((o,i,n)=>{let a=t[n];if(a&&a.call){let c=a(r),u=c&&c.props&&c.props.className||/^go/.test(c)&&c;a=u?"."+u:c&&typeof c=="object"?c.props?"":P(c,""):c===!1?"":c}return o+i+(a??"")},"");function z(e){let t=this||{},r=e.call?e(t.p):e;return Ne(r.unshift?r.raw?Ie(r,[].slice.call(arguments,1),t.p):r.reduce((o,i)=>Object.assign(o,i&&i.call?i(t.p):i),{}):r,ke(t.target),t.g,t.o,t.k)}let ee,W,F;z.bind({g:1});let N=z.bind({k:1});function Pe(e,t,r,o){P.p=t,ee=e,W=r,F=o}function C(e,t){let r=this||{};return function(){let o=arguments;function i(n,a){let c=Object.assign({},n),u=c.className||i.className;r.p=Object.assign({theme:W&&W()},c),r.o=/go\d/.test(u),c.className=z.apply(r,o)+(u?" "+u:"");let p=e;return e[0]&&(p=c.as||e,delete c.as),F&&p[0]&&F(c),ee(p,c)}return i}}var Ce=e=>typeof e=="function",R=(e,t)=>Ce(e)?e(t):e,Me=(()=>{let e=0;return()=>(++e).toString()})(),te=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),$e=20,B="default",se=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(a=>a.id===t.toast.id?{...a,...t.toast}:a)};case 2:let{toast:o}=t;return se(e,{type:e.toasts.find(a=>a.id===o.id)?1:0,toast:o});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(a=>a.id===i||i===void 0?{...a,dismissed:!0,visible:!1}:a)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(a=>a.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(a=>({...a,pauseDuration:a.pauseDuration+n}))}}},S=[],re={toasts:[],pausedAt:void 0,settings:{toastLimit:$e}},A={},ae=(e,t=B)=>{A[t]=se(A[t]||re,e),S.forEach(([r,o])=>{r===t&&o(A[t])})},oe=e=>Object.keys(A).forEach(t=>ae(e,t)),Oe=e=>Object.keys(A).find(t=>A[t].toasts.some(r=>r.id===e)),T=(e=B)=>t=>{ae(t,e)},Le={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Se=(e={},t=B)=>{let[r,o]=l.useState(A[t]||re),i=l.useRef(A[t]);l.useEffect(()=>(i.current!==A[t]&&o(A[t]),S.push([t,o]),()=>{let a=S.findIndex(([c])=>c===t);a>-1&&S.splice(a,1)}),[t]);let n=r.toasts.map(a=>{var c,u,p;return{...e,...e[a.type],...a,removeDelay:a.removeDelay||((c=e[a.type])==null?void 0:c.removeDelay)||(e==null?void 0:e.removeDelay),duration:a.duration||((u=e[a.type])==null?void 0:u.duration)||(e==null?void 0:e.duration)||Le[a.type],style:{...e.style,...(p=e[a.type])==null?void 0:p.style,...a.style}}});return{...r,toasts:n}},Re=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||Me()}),O=e=>(t,r)=>{let o=Re(t,e,r);return T(o.toasterId||Oe(o.id))({type:2,toast:o}),o.id},j=(e,t)=>O("blank")(e,t);j.error=O("error");j.success=O("success");j.loading=O("loading");j.custom=O("custom");j.dismiss=(e,t)=>{let r={type:3,toastId:e};t?T(t)(r):oe(r)};j.dismissAll=e=>j.dismiss(void 0,e);j.remove=(e,t)=>{let r={type:4,toastId:e};t?T(t)(r):oe(r)};j.removeAll=e=>j.remove(void 0,e);j.promise=(e,t,r)=>{let o=j.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(i=>{let n=t.success?R(t.success,i):void 0;return n?j.success(n,{id:o,...r,...r==null?void 0:r.success}):j.dismiss(o),i}).catch(i=>{let n=t.error?R(t.error,i):void 0;n?j.error(n,{id:o,...r,...r==null?void 0:r.error}):j.dismiss(o)}),e};var ze=1e3,Te=(e,t="default")=>{let{toasts:r,pausedAt:o}=Se(e,t),i=l.useRef(new Map).current,n=l.useCallback((d,h=ze)=>{if(i.has(d))return;let b=setTimeout(()=>{i.delete(d),a({type:4,toastId:d})},h);i.set(d,b)},[]);l.useEffect(()=>{if(o)return;let d=Date.now(),h=r.map(b=>{if(b.duration===1/0)return;let v=(b.duration||0)+b.pauseDuration-(d-b.createdAt);if(v<0){b.visible&&j.dismiss(b.id);return}return setTimeout(()=>j.dismiss(b.id,t),v)});return()=>{h.forEach(b=>b&&clearTimeout(b))}},[r,o,t]);let a=l.useCallback(T(t),[t]),c=l.useCallback(()=>{a({type:5,time:Date.now()})},[a]),u=l.useCallback((d,h)=>{a({type:1,toast:{id:d,height:h}})},[a]),p=l.useCallback(()=>{o&&a({type:6,time:Date.now()})},[o,a]),m=l.useCallback((d,h)=>{let{reverseOrder:b=!1,gutter:v=8,defaultPosition:w}=h||{},x=r.filter(k=>(k.position||w)===(d.position||w)&&k.height),_=x.findIndex(k=>k.id===d.id),M=x.filter((k,D)=>D<_&&k.visible).length;return x.filter(k=>k.visible).slice(...b?[M+1]:[0,M]).reduce((k,D)=>k+(D.height||0)+v,0)},[r]);return l.useEffect(()=>{r.forEach(d=>{if(d.dismissed)n(d.id,d.removeDelay);else{let h=i.get(d.id);h&&(clearTimeout(h),i.delete(d.id))}})},[r,n]),{toasts:r,handlers:{updateHeight:u,startPause:c,endPause:p,calculateOffset:m}}},De=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Ve=N`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,He=N`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ue=C("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${De} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Ve} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${He} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,qe=N`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,We=C("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${qe} 1s linear infinite;
`,Fe=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Be=N`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,Ze=C("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Fe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Be} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,Ke=C("div")`
  position: absolute;
`,Qe=C("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,Ye=N`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Ge=C("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${Ye} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,Je=({toast:e})=>{let{icon:t,type:r,iconTheme:o}=e;return t!==void 0?typeof t=="string"?l.createElement(Ge,null,t):t:r==="blank"?null:l.createElement(Qe,null,l.createElement(We,{...o}),r!=="loading"&&l.createElement(Ke,null,r==="error"?l.createElement(Ue,{...o}):l.createElement(Ze,{...o})))},Xe=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,et=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,tt="0%{opacity:0;} 100%{opacity:1;}",st="0%{opacity:1;} 100%{opacity:0;}",rt=C("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,at=C("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,ot=(e,t)=>{let r=e.includes("top")?1:-1,[o,i]=te()?[tt,st]:[Xe(r),et(r)];return{animation:t?`${N(o)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${N(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},it=l.memo(({toast:e,position:t,style:r,children:o})=>{let i=e.height?ot(e.position||t||"top-center",e.visible):{opacity:0},n=l.createElement(Je,{toast:e}),a=l.createElement(at,{...e.ariaProps},R(e.message,e));return l.createElement(rt,{className:e.className,style:{...i,...r,...e.style}},typeof o=="function"?o({icon:n,message:a}):l.createElement(l.Fragment,null,n,a))});Pe(l.createElement);var nt=({id:e,className:t,style:r,onHeightUpdate:o,children:i})=>{let n=l.useCallback(a=>{if(a){let c=()=>{let u=a.getBoundingClientRect().height;o(e,u)};c(),new MutationObserver(c).observe(a,{subtree:!0,childList:!0,characterData:!0})}},[e,o]);return l.createElement("div",{ref:n,className:t,style:r},i)},lt=(e,t)=>{let r=e.includes("top"),o=r?{top:0}:{bottom:0},i=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:te()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...o,...i}},ct=z`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,L=16,dt=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:o,children:i,toasterId:n,containerStyle:a,containerClassName:c})=>{let{toasts:u,handlers:p}=Te(r,n);return l.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:L,left:L,right:L,bottom:L,pointerEvents:"none",...a},className:c,onMouseEnter:p.startPause,onMouseLeave:p.endPause},u.map(m=>{let d=m.position||t,h=p.calculateOffset(m,{reverseOrder:e,gutter:o,defaultPosition:t}),b=lt(d,h);return l.createElement(nt,{id:m.id,key:m.id,onHeightUpdate:p.updateHeight,className:m.visible?ct:"",style:b},m.type==="custom"?R(m.message,m):i?i(m):l.createElement(it,{toast:m,position:d}))}))},Gs=j;const ut=void 0,pt=void 0;throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");const E=de(ut,pt,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}}),ie=l.createContext(void 0),mt={free:100,pro:700,business:2400},Y=mt;function ht({children:e}){const[t,r]=l.useState(null),[o,i]=l.useState(null),[n,a]=l.useState(!0),c=async(v,w)=>{const{data:x,error:_}=await E.from("profiles").select("*").eq("id",v).maybeSingle();if(_)return console.error("Profile fetch error:",_.message),null;if(x)return i(x),x;const{data:M,error:k}=await E.from("profiles").insert({id:v,email:w,subscription_tier:"free",credits:Y.free}).select().maybeSingle();return k?(console.error("Profile create error:",k.message),null):(M&&await E.from("credit_ledger").insert({user_id:v,delta:Y.free,reason:"signup_bonus"}),i(M),M)},u=async v=>{const{data:w,error:x}=await E.from("profiles").select("*").eq("id",v).maybeSingle();return x?(console.error("Profile fetch error:",x.message),null):(i(w??null),w??null)},p=async()=>{t!=null&&t.user&&await u(t.user.id)};l.useEffect(()=>{let v=!0;E.auth.getSession().then(({data:x})=>{var _;v&&(r(x.session),(_=x.session)!=null&&_.user?c(x.session.user.id,x.session.user.email??"").finally(()=>{a(!1)}):a(!1))});const{data:w}=E.auth.onAuthStateChange((x,_)=>{(async()=>(r(_),_!=null&&_.user?await c(_.user.id,_.user.email??""):i(null),a(!1)))()});return()=>{v=!1,w.subscription.unsubscribe()}},[]);const m=async(v,w)=>{const{data:x,error:_}=await E.auth.signUp({email:v,password:w});return _?{error:_.message,session:null}:(x.user&&(await c(x.user.id,v),await E.from("email_notifications").insert({user_id:x.user.id,to_email:v,template:"welcome",subject:"Welcome to AI Creator Pro 🎬",body:`Hi there,

Welcome to AI Creator Pro! Your account is ready and 100 free credits have been added.

Start creating: ${window.location.origin}

The AI Creator Pro team`,status:"queued"})),{error:null,session:x.session})},d=async(v,w)=>{const{data:x,error:_}=await E.auth.signInWithPassword({email:v,password:w});return _?{error:_.message}:(x.user&&await c(x.user.id,v),{error:null})},h=async()=>{await E.auth.signOut(),i(null),r(null)},b={user:(t==null?void 0:t.user)??null,session:t,profile:o,loading:n,signUp:m,signIn:d,signOut:h,refreshProfile:p};return s.jsx(ie.Provider,{value:b,children:e})}function ne(){const e=l.useContext(ie);if(!e)throw new Error("useAuth must be used within AuthProvider");return e}/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=(...e)=>e.filter((t,r,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ft=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xt=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,o)=>o?o.toUpperCase():r.toLowerCase());/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=e=>{const t=xt(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var H={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yt=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1},gt=l.createContext({}),bt=()=>l.useContext(gt),vt=l.forwardRef(({color:e,size:t,strokeWidth:r,absoluteStrokeWidth:o,className:i="",children:n,iconNode:a,...c},u)=>{const{size:p=24,strokeWidth:m=2,absoluteStrokeWidth:d=!1,color:h="currentColor",className:b=""}=bt()??{},v=o??d?Number(r??m)*24/Number(t??p):r??m;return l.createElement("svg",{ref:u,...H,width:t??p??H.width,height:t??p??H.height,stroke:e??h,strokeWidth:v,className:le("lucide",b,i),...!n&&!yt(c)&&{"aria-hidden":"true"},...c},[...a.map(([w,x])=>l.createElement(w,x)),...Array.isArray(n)?n:[n]])});/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=(e,t)=>{const r=l.forwardRef(({className:o,...i},n)=>l.createElement(vt,{ref:n,iconNode:t,className:le(`lucide-${ft(G(e))}`,`lucide-${e}`,o),...i}));return r.displayName=G(e),r};/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _t=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],jt=g("bell",_t);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wt=[["rect",{width:"18",height:"14",x:"3",y:"5",rx:"2",ry:"2",key:"12ruh7"}],["path",{d:"M7 15h4M15 15h2M7 11h2M13 11h4",key:"1ueiar"}]],kt=g("captions",wt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Et=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],At=g("chart-column",Et);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Nt=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],It=g("chevron-left",Nt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Pt=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]],Ct=g("clock",Pt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mt=[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]],$t=g("credit-card",Mt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ot=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]],Lt=g("film",Ot);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const St=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]],Rt=g("folder-open",St);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zt=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],Tt=g("image",zt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Dt=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],Vt=g("layout-dashboard",Dt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ht=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],Ut=g("loader-circle",Ht);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qt=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],Wt=g("log-out",qt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ft=[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]],Bt=g("mic",Ft);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zt=[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]],Kt=g("music",Zt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qt=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],Yt=g("plus",Qt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Gt=[["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}],["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09",key:"u4xsad"}],["path",{d:"M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z",key:"676m9"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05",key:"92ym6u"}]],Jt=g("rocket",Gt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Xt=[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M8.12 8.12 12 12",key:"1alkpv"}],["path",{d:"M20 4 8.12 15.88",key:"xgtan2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M14.8 14.8 20 20",key:"ptml3r"}]],es=g("scissors",Xt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ts=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],ss=g("search",ts);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rs=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],as=g("settings",rs);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const os=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],is=g("shield-check",os);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ns=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],ls=g("sparkles",ns);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cs=[["path",{d:"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5",key:"slp6dd"}],["path",{d:"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",key:"o0xfot"}],["path",{d:"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05",key:"wn3emo"}]],ds=g("store",cs);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const us=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],ps=g("users",us);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ms=[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]],ce=g("wand-sparkles",ms);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hs=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],fs=g("zap",hs);function xs({children:e}){const{user:t,loading:r}=ne();return r?s.jsx("div",{className:"h-full flex items-center justify-center bg-slate-950",children:s.jsx(Ut,{className:"w-8 h-8 animate-spin text-cyan-500"})}):t?s.jsx(s.Fragment,{children:e}):s.jsx(J,{to:"/login",replace:!0})}const ys=[{label:"Create",items:[{to:"/",icon:Vt,label:"Dashboard",exact:!0},{to:"/create",icon:ce,label:"Create Video",badge:"New"},{to:"/ai-pipeline",icon:ls,label:"AI Pipeline"},{to:"/autopilot",icon:Jt,label:"Autopilot"}]},{label:"AI Tools",items:[{to:"/ai-script",icon:Lt,label:"AI Script"},{to:"/ai-voice",icon:Bt,label:"AI Voice"},{to:"/ai-music",icon:Kt,label:"AI Music"},{to:"/ai-subtitles",icon:kt,label:"AI Subtitles"},{to:"/ai-thumbnail",icon:Tt,label:"AI Thumbnail"},{to:"/ai-shorts",icon:es,label:"AI Shorts"},{to:"/ai-seo",icon:ss,label:"AI SEO"}]},{label:"Workspace",items:[{to:"/projects",icon:Rt,label:"Projects"},{to:"/render-history",icon:Ct,label:"History"},{to:"/analytics",icon:At,label:"Analytics"}]},{label:"More",items:[{to:"/marketplace",icon:ds,label:"Marketplace"},{to:"/referrals",icon:ps,label:"Affiliate"},{to:"/billing",icon:$t,label:"Billing"}]}],U={to:"/admin",icon:is},gs={free:"from-slate-500 to-slate-600",pro:"from-indigo-500 to-cyan-500",business:"from-violet-500 to-pink-500"};function bs(){const[e,t]=l.useState(!1),{user:r,profile:o,signOut:i}=ne(),n=he(),a=fe(),c=async()=>{await i(),n("/login")},u=gs[(o==null?void 0:o.subscription_tier)??"free"],p=Math.min(100,((o==null?void 0:o.credits)??0)/((o==null?void 0:o.subscription_tier)==="business"?1e4:(o==null?void 0:o.subscription_tier)==="pro"?2e3:100)*100);return s.jsxs("div",{className:"h-full flex bg-slate-950 relative",style:{zIndex:1},children:[s.jsxs($.aside,{initial:!1,animate:{width:e?68:240},transition:{type:"spring",stiffness:300,damping:30},className:"h-full flex-shrink-0 glass-panel border-r border-white/[0.05] flex flex-col relative z-20",children:[s.jsx("div",{className:"h-16 flex items-center px-4 border-b border-white/[0.05]",children:s.jsxs("div",{className:"flex items-center gap-3 min-w-0",children:[s.jsx("div",{className:"w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-glow-cyan",children:s.jsx(ce,{className:"w-4 h-4 text-white"})}),s.jsx(ve,{children:!e&&s.jsx($.span,{initial:{opacity:0,x:-8},animate:{opacity:1,x:0},exit:{opacity:0,x:-8},transition:{duration:.15},className:"font-bold text-base gradient-text-cyan whitespace-nowrap",children:"AI Creator Pro"})})]})}),s.jsx("div",{className:"px-3 py-3 border-b border-white/[0.04]",children:s.jsx(V,{to:"/create",children:s.jsxs($.div,{whileHover:{scale:1.02},whileTap:{scale:.98},className:`gradient-btn-primary rounded-xl flex items-center justify-center gap-2 cursor-pointer overflow-hidden ${e?"h-10 w-10 mx-auto":"h-10 px-4"}`,children:[s.jsx(Yt,{className:"w-4 h-4 text-white flex-shrink-0"}),!e&&s.jsx("span",{className:"text-sm font-semibold text-white",children:"New video"})]})})}),s.jsxs("nav",{className:"flex-1 overflow-y-auto py-3 px-2 space-y-4",children:[ys.map(m=>s.jsxs("div",{children:[!e&&s.jsx("p",{className:"text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1.5",children:m.label}),s.jsx("div",{className:"space-y-0.5",children:m.items.map(d=>{const h=d.exact?a.pathname===d.to:a.pathname.startsWith(d.to)&&d.to!=="/";return s.jsx(V,{to:d.to,children:s.jsxs($.div,{whileHover:{x:e?0:2},className:`nav-item flex items-center gap-3 px-3 py-2.5 cursor-pointer group ${h?"active":""}`,children:[s.jsx(d.icon,{className:`w-4 h-4 flex-shrink-0 transition-colors ${h?"text-indigo-400":"text-slate-500 group-hover:text-slate-300"}`}),!e&&s.jsx("span",{className:`text-sm font-medium flex-1 transition-colors ${h?"text-white":"text-slate-400 group-hover:text-white"}`,children:d.label}),!e&&d.badge&&s.jsx("span",{className:"text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",children:d.badge})]})},d.to)})})]},m.label)),(o==null?void 0:o.is_admin)&&s.jsxs("div",{children:[!e&&s.jsx("p",{className:"text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1.5",children:"System"}),s.jsx(V,{to:U.to,children:s.jsxs($.div,{whileHover:{x:2},className:`nav-item flex items-center gap-3 px-3 py-2.5 cursor-pointer group ${a.pathname===U.to?"active":""}`,children:[s.jsx(U.icon,{className:"w-4 h-4 flex-shrink-0 text-violet-500"}),!e&&s.jsx("span",{className:"text-sm font-medium text-slate-400 group-hover:text-white",children:"Admin"})]})})]})]}),s.jsxs("div",{className:"p-3 border-t border-white/[0.05] space-y-2",children:[!e&&o&&s.jsxs("div",{className:"glass-card p-3 rounded-xl",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsxs("div",{className:"flex items-center gap-1.5",children:[s.jsx(fs,{className:"w-3 h-3 text-amber-400"}),s.jsx("span",{className:"text-xs font-semibold text-amber-400",children:o.credits.toLocaleString()}),s.jsx("span",{className:"text-xs text-slate-500",children:"credits"})]}),s.jsx("span",{className:`badge-pro bg-gradient-to-r ${u} text-white border-0`,children:o.subscription_tier.toUpperCase()})]}),s.jsx("div",{className:"progress-bar",children:s.jsx("div",{className:"progress-bar-fill",style:{width:`${p}%`}})})]}),s.jsxs("button",{className:"w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors",children:[s.jsx(jt,{className:"w-4 h-4 flex-shrink-0"}),!e&&s.jsx("span",{className:"text-sm",children:"Notifications"})]}),s.jsxs("button",{className:"w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors",children:[s.jsx(as,{className:"w-4 h-4 flex-shrink-0"}),!e&&s.jsx("span",{className:"text-sm",children:"Settings"})]}),!e&&r&&s.jsxs("div",{className:"flex items-center gap-2 px-3 py-2",children:[s.jsx("div",{className:`w-7 h-7 rounded-full bg-gradient-to-br ${u} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`,children:(r.email??"?")[0].toUpperCase()}),s.jsx("div",{className:"flex-1 min-w-0",children:s.jsx("div",{className:"text-xs font-medium text-white truncate",children:r.email})})]}),s.jsxs("button",{onClick:c,className:"w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-colors",children:[s.jsx(Wt,{className:"w-4 h-4 flex-shrink-0"}),!e&&s.jsx("span",{className:"text-sm",children:"Sign out"})]}),s.jsx("button",{onClick:()=>t(!e),className:"w-full flex items-center justify-center py-1.5 rounded-xl text-slate-600 hover:text-slate-400 transition-colors",children:s.jsx($.div,{animate:{rotate:e?180:0},children:s.jsx(It,{className:"w-4 h-4"})})})]})]}),s.jsx("main",{className:"flex-1 overflow-hidden relative",children:s.jsx(xe,{})})]})}const vs=l.lazy(()=>y(()=>import("./Login-DPa30oL6.js"),__vite__mapDeps([0,1,2,3,4,5,6]))),_s=l.lazy(()=>y(()=>import("./Register-MlCrx4ys.js"),__vite__mapDeps([7,1,2,8,3,9,10,4,5,6]))),js=l.lazy(()=>y(()=>import("./ForgotPassword-CnbO_oy4.js"),__vite__mapDeps([11,1,2,3,12,4,6]))),ws=l.lazy(()=>y(()=>import("./ResetPassword-BrvPBvuj.js"),__vite__mapDeps([13,1,2,3,12,5,6]))),ks=l.lazy(()=>y(()=>import("./Terms-Bkr1uPwA.js"),__vite__mapDeps([14,1,2,15,3]))),Es=l.lazy(()=>y(()=>import("./Privacy-CMZIHzkL.js"),__vite__mapDeps([16,1,2,15,3]))),As=l.lazy(()=>y(()=>import("./Dashboard-B4E4d1_n.js"),__vite__mapDeps([17,1,2,3,18,19]))),Ns=l.lazy(()=>y(()=>import("./Create-DvOcVJUj.js"),__vite__mapDeps([20,1,2,21,3,9,6,19,22,23,18]))),Is=l.lazy(()=>y(()=>import("./Editor-OHVJpKpG.js"),__vite__mapDeps([24,1,2,8,5,25,26,15,19,3]))),Ps=l.lazy(()=>y(()=>import("./Projects-DAM79Q6Q.js"),__vite__mapDeps([27,1,2,3,19,26]))),Cs=l.lazy(()=>y(()=>import("./AIPipeline-B1oTLjzJ.js"),__vite__mapDeps([28,1,2,8,3,6,12,29]))),Ms=l.lazy(()=>y(()=>import("./Autopilot-BUCDPFQl.js"),__vite__mapDeps([30,1,2,21,3,31]))),$s=l.lazy(()=>y(()=>import("./Billing-DnpZUNis.js"),__vite__mapDeps([32,1,2,3,9]))),Os=l.lazy(()=>y(()=>import("./RenderHistory-CqDqEA2B.js"),__vite__mapDeps([33,1,2,8,31,6,34,12,22,29,3]))),Ls=l.lazy(()=>y(()=>import("./Analytics-Cqgsz5gA.js"),__vite__mapDeps([35,1,2,36,3]))),Ss=l.lazy(()=>y(()=>import("./Admin-CCjnbpLt.js"),__vite__mapDeps([37,1,2,6,3,10,12,36,4,34]))),Rs=l.lazy(()=>y(()=>import("./Referrals-B9JmxUW1.js"),__vite__mapDeps([38,1,2,8,3,10,36,9,25]))),zs=l.lazy(()=>y(()=>import("./Marketplace-DyD0zM09.js"),__vite__mapDeps([39,1,2,3,23,22,9]))),Ts=l.lazy(()=>y(()=>import("./AITools-DJyOmcyI.js"),__vite__mapDeps([40,1,2,21,22,9,19,3,6])).then(e=>({default:e.AIScript}))),Ds=l.lazy(()=>y(()=>import("./AITools-DJyOmcyI.js"),__vite__mapDeps([40,1,2,21,22,9,19,3,6])).then(e=>({default:e.AIVoice}))),Vs=l.lazy(()=>y(()=>import("./AITools-DJyOmcyI.js"),__vite__mapDeps([40,1,2,21,22,9,19,3,6])).then(e=>({default:e.AIMusic}))),Hs=l.lazy(()=>y(()=>import("./AITools-DJyOmcyI.js"),__vite__mapDeps([40,1,2,21,22,9,19,3,6])).then(e=>({default:e.AISubtitles}))),Us=l.lazy(()=>y(()=>import("./AITools-DJyOmcyI.js"),__vite__mapDeps([40,1,2,21,22,9,19,3,6])).then(e=>({default:e.AIThumbnail}))),qs=l.lazy(()=>y(()=>import("./AITools-DJyOmcyI.js"),__vite__mapDeps([40,1,2,21,22,9,19,3,6])).then(e=>({default:e.AIShorts}))),Ws=l.lazy(()=>y(()=>import("./AITools-DJyOmcyI.js"),__vite__mapDeps([40,1,2,21,22,9,19,3,6])).then(e=>({default:e.AISEO})));function Fs(){return s.jsx("div",{className:"h-full flex items-center justify-center",children:s.jsxs("div",{className:"flex flex-col items-center gap-4",children:[s.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 animate-pulse"}),s.jsx("div",{className:"flex gap-1.5",children:[0,1,2].map(e=>s.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-indigo-500/40 animate-pulse",style:{animationDelay:`${e*.15}s`}},e))})]})})}function Bs(){return s.jsxs(ht,{children:[s.jsx(l.Suspense,{fallback:s.jsx(Fs,{}),children:s.jsxs(ye,{children:[s.jsx(f,{path:"/login",element:s.jsx(vs,{})}),s.jsx(f,{path:"/register",element:s.jsx(_s,{})}),s.jsx(f,{path:"/forgot-password",element:s.jsx(js,{})}),s.jsx(f,{path:"/reset-password",element:s.jsx(ws,{})}),s.jsx(f,{path:"/terms",element:s.jsx(ks,{})}),s.jsx(f,{path:"/privacy",element:s.jsx(Es,{})}),s.jsxs(f,{path:"/",element:s.jsx(xs,{children:s.jsx(bs,{})}),children:[s.jsx(f,{index:!0,element:s.jsx(As,{})}),s.jsx(f,{path:"create",element:s.jsx(Ns,{})}),s.jsx(f,{path:"editor/:projectId?",element:s.jsx(Is,{})}),s.jsx(f,{path:"projects",element:s.jsx(Ps,{})}),s.jsx(f,{path:"ai-pipeline",element:s.jsx(Cs,{})}),s.jsx(f,{path:"autopilot",element:s.jsx(Ms,{})}),s.jsx(f,{path:"billing",element:s.jsx($s,{})}),s.jsx(f,{path:"render-history",element:s.jsx(Os,{})}),s.jsx(f,{path:"analytics",element:s.jsx(Ls,{})}),s.jsx(f,{path:"referrals",element:s.jsx(Rs,{})}),s.jsx(f,{path:"marketplace",element:s.jsx(zs,{})}),s.jsx(f,{path:"admin",element:s.jsx(Ss,{})}),s.jsx(f,{path:"ai-script",element:s.jsx(Ts,{})}),s.jsx(f,{path:"ai-voice",element:s.jsx(Ds,{})}),s.jsx(f,{path:"ai-music",element:s.jsx(Vs,{})}),s.jsx(f,{path:"ai-subtitles",element:s.jsx(Hs,{})}),s.jsx(f,{path:"ai-thumbnail",element:s.jsx(Us,{})}),s.jsx(f,{path:"ai-shorts",element:s.jsx(qs,{})}),s.jsx(f,{path:"ai-seo",element:s.jsx(Ws,{})})]}),s.jsx(f,{path:"*",element:s.jsx(J,{to:"/",replace:!0})})]})}),s.jsx(dt,{position:"bottom-right",toastOptions:{style:{background:"rgba(15,23,42,0.92)",backdropFilter:"blur(16px)",color:"#f1f5f9",border:"1px solid rgba(148,163,184,0.1)",borderRadius:"12px",fontSize:"13px"},success:{iconTheme:{primary:"#10b981",secondary:"#f8fafc"}},error:{iconTheme:{primary:"#ef4444",secondary:"#f8fafc"}}}})]})}const Zs=new ue({defaultOptions:{queries:{staleTime:1e3*60*5,retry:1}}});q.createRoot(document.getElementById("root")).render(s.jsx(ge.StrictMode,{children:s.jsx(pe,{client:Zs,children:s.jsx(be,{children:s.jsx(Bs,{})})})}));export{mt as C,Lt as F,Tt as I,Ut as L,Bt as M,Yt as P,Jt as R,es as S,ps as U,ce as W,fs as Z,y as _,Ct as a,Kt as b,g as c,ls as d,Rt as e,It as f,ss as g,At as h,is as i,ds as j,E as s,ne as u,Gs as z};
