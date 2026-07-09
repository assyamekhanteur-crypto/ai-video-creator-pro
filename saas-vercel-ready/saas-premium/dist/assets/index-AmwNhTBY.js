const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/Landing-D0o9_h0O.js","assets/vendor-supabase-BCSEMI4w.js","assets/vendor-react-BlBnAZg-.js","assets/vendor-motion-BDps-kTd.js","assets/FilmStrip-yPjK-KZ3.js","assets/arrow-right-ByXWGGfB.js","assets/play-D_40_bbK.js","assets/file-text-mOn1qaf_.js","assets/download-CZ4xi7lm.js","assets/check-3zxpUtww.js","assets/chevron-down-iISugVdB.js","assets/Login-BR_QWROa.js","assets/video-Be3voM8-.js","assets/mail-uBTfc18V.js","assets/lock-DRwDz9sK.js","assets/circle-alert-BoFevUpj.js","assets/Register-jaFmg9G3.js","assets/render-D98erltM.js","assets/gift-CZvhUW0Z.js","assets/ForgotPassword-B4Ecj9Sj.js","assets/circle-check-big-i1UoRM2X.js","assets/ResetPassword-BIE4l-rP.js","assets/Terms-BxSpWivq.js","assets/arrow-left-DFvbj_aA.js","assets/Privacy-BXDmx_iB.js","assets/Dashboard-BuRyddii.js","assets/chevron-right-DZEZYQpx.js","assets/Create-CUEHaW2i.js","assets/ai-BtTU5Ghi.js","assets/palette-C38BmXvU.js","assets/Editor-NF8SsSrq.js","assets/copy-BSeYcOR3.js","assets/trash-2-DO15raEN.js","assets/save-Bqrc7wur.js","assets/Projects-Bsut2UAw.js","assets/AIPipeline-Cv4P_7cL.js","assets/Autopilot-D4h28Dkf.js","assets/refresh-cw-BmT205Hp.js","assets/Billing-CdIsYnVh.js","assets/Settings-DuHFCSMS.js","assets/triangle-alert-CIKukbts.js","assets/RenderHistory-D5Gy3xAs.js","assets/circle-x-Blp9fSwA.js","assets/Analytics-DDYwjaLa.js","assets/trending-up-KEERTc9m.js","assets/Admin-DfIJfkJt.js","assets/Referrals-Dc_JHWjV.js","assets/Marketplace-DjjrYpY2.js","assets/AITools-jEScXrk5.js"])))=>i.map(i=>d[i]);
import{c as xe,j as s,Q as ye,a as ge}from"./vendor-supabase-BCSEMI4w.js";import{a as ve,r as l,u as be,b as te,N as q,O as _e,c as se,R as we,d as f,e as je,B as ke}from"./vendor-react-BlBnAZg-.js";import{m as $,A as Ee}from"./vendor-motion-BDps-kTd.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&a(o)}).observe(document,{childList:!0,subtree:!0});function r(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(i){if(i.ep)return;i.ep=!0;const n=r(i);fetch(i.href,n)}})();var U={},Q=ve;U.createRoot=Q.createRoot,U.hydrateRoot=Q.hydrateRoot;const Ae="modulepreload",Ne=function(e){return"/"+e},G={},x=function(t,r,a){let i=Promise.resolve();if(r&&r.length>0){document.getElementsByTagName("link");const o=document.querySelector("meta[property=csp-nonce]"),c=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));i=Promise.allSettled(r.map(u=>{if(u=Ne(u),u in G)return;G[u]=!0;const p=u.endsWith(".css"),m=p?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${u}"]${m}`))return;const d=document.createElement("link");if(d.rel=p?"stylesheet":Ae,p||(d.as="script"),d.crossOrigin="",d.href=u,c&&d.setAttribute("nonce",c),document.head.appendChild(d),p)return new Promise((h,v)=>{d.addEventListener("load",h),d.addEventListener("error",()=>v(new Error(`Unable to preload CSS for ${u}`)))})}))}function n(o){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=o,window.dispatchEvent(c),!c.defaultPrevented)throw o}return i.then(o=>{for(const c of o||[])c.status==="rejected"&&n(c.reason);return t().catch(n)})};let Pe={data:""},Ie=e=>{if(typeof window=="object"){let t=(e?e.querySelector("#_goober"):window._goober)||Object.assign(document.createElement("style"),{innerHTML:" ",id:"_goober"});return t.nonce=window.__nonce__,t.parentNode||(e||document.head).appendChild(t),t.firstChild}return e||Pe},Ce=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,Se=/\/\*[^]*?\*\/|  +/g,J=/\n+/g,I=(e,t)=>{let r="",a="",i="";for(let n in e){let o=e[n];n[0]=="@"?n[1]=="i"?r=n+" "+o+";":a+=n[1]=="f"?I(o,n):n+"{"+I(o,n[1]=="k"?"":t)+"}":typeof o=="object"?a+=I(o,t?t.replace(/([^,])+/g,c=>n.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,u=>/&/.test(u)?u.replace(/&/g,c):c?c+" "+u:u)):n):o!=null&&(n=n[1]=="-"?n:n.replace(/[A-Z]/g,"-$&").toLowerCase(),i+=I.p?I.p(n,o):n+":"+o+";")}return r+(t&&i?t+"{"+i+"}":i)+a},P={},re=e=>{if(typeof e=="object"){let t="";for(let r in e)t+=r+re(e[r]);return t}return e},$e=(e,t,r,a,i)=>{let n=re(e),o=P[n]||(P[n]=(u=>{let p=0,m=11;for(;p<u.length;)m=101*m+u.charCodeAt(p++)>>>0;return"go"+m})(n));if(!P[o]){let u=n!==e?e:(p=>{let m,d,h=[{}];for(;m=Ce.exec(p.replace(Se,""));)m[4]?h.shift():m[3]?(d=m[3].replace(J," ").trim(),h.unshift(h[0][d]=h[0][d]||{})):h[0][m[1]]=m[2].replace(J," ").trim();return h[0]})(e);P[o]=I(i?{["@keyframes "+o]:u}:u,r?"":"."+o)}let c=r&&P.g;return r&&(P.g=P[o]),((u,p,m,d)=>{d?p.data=p.data.replace(d,u):p.data.indexOf(u)===-1&&(p.data=m?u+p.data:p.data+u)})(P[o],t,a,c),o},Me=(e,t,r)=>e.reduce((a,i,n)=>{let o=t[n];if(o&&o.call){let c=o(r),u=c&&c.props&&c.props.className||/^go/.test(c)&&c;o=u?"."+u:c&&typeof c=="object"?c.props?"":I(c,""):c===!1?"":c}return a+i+(o??"")},"");function D(e){let t=this||{},r=e.call?e(t.p):e;return $e(r.unshift?r.raw?Me(r,[].slice.call(arguments,1),t.p):r.reduce((a,i)=>Object.assign(a,i&&i.call?i(t.p):i),{}):r,Ie(t.target),t.g,t.o,t.k)}let ae,F,Y;D.bind({g:1});let N=D.bind({k:1});function Le(e,t,r,a){I.p=t,ae=e,F=r,Y=a}function C(e,t){let r=this||{};return function(){let a=arguments;function i(n,o){let c=Object.assign({},n),u=c.className||i.className;r.p=Object.assign({theme:F&&F()},c),r.o=/go\d/.test(u),c.className=D.apply(r,a)+(u?" "+u:"");let p=e;return e[0]&&(p=c.as||e,delete c.as),Y&&p[0]&&Y(c),ae(p,c)}return i}}var Oe=e=>typeof e=="function",T=(e,t)=>Oe(e)?e(t):e,Re=(()=>{let e=0;return()=>(++e).toString()})(),oe=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Te=20,Z="default",ie=(e,t)=>{let{toastLimit:r}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,r)};case 1:return{...e,toasts:e.toasts.map(o=>o.id===t.toast.id?{...o,...t.toast}:o)};case 2:let{toast:a}=t;return ie(e,{type:e.toasts.find(o=>o.id===a.id)?1:0,toast:a});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(o=>o.id===i||i===void 0?{...o,dismissed:!0,visible:!1}:o)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(o=>o.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let n=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(o=>({...o,pauseDuration:o.pauseDuration+n}))}}},R=[],ne={toasts:[],pausedAt:void 0,settings:{toastLimit:Te}},A={},le=(e,t=Z)=>{A[t]=ie(A[t]||ne,e),R.forEach(([r,a])=>{r===t&&a(A[t])})},ce=e=>Object.keys(A).forEach(t=>le(e,t)),ze=e=>Object.keys(A).find(t=>A[t].toasts.some(r=>r.id===e)),V=(e=Z)=>t=>{le(t,e)},De={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},Ve=(e={},t=Z)=>{let[r,a]=l.useState(A[t]||ne),i=l.useRef(A[t]);l.useEffect(()=>(i.current!==A[t]&&a(A[t]),R.push([t,a]),()=>{let o=R.findIndex(([c])=>c===t);o>-1&&R.splice(o,1)}),[t]);let n=r.toasts.map(o=>{var c,u,p;return{...e,...e[o.type],...o,removeDelay:o.removeDelay||((c=e[o.type])==null?void 0:c.removeDelay)||(e==null?void 0:e.removeDelay),duration:o.duration||((u=e[o.type])==null?void 0:u.duration)||(e==null?void 0:e.duration)||De[o.type],style:{...e.style,...(p=e[o.type])==null?void 0:p.style,...o.style}}});return{...r,toasts:n}},He=(e,t="blank",r)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...r,id:(r==null?void 0:r.id)||Re()}),L=e=>(t,r)=>{let a=He(t,e,r);return V(a.toasterId||ze(a.id))({type:2,toast:a}),a.id},w=(e,t)=>L("blank")(e,t);w.error=L("error");w.success=L("success");w.loading=L("loading");w.custom=L("custom");w.dismiss=(e,t)=>{let r={type:3,toastId:e};t?V(t)(r):ce(r)};w.dismissAll=e=>w.dismiss(void 0,e);w.remove=(e,t)=>{let r={type:4,toastId:e};t?V(t)(r):ce(r)};w.removeAll=e=>w.remove(void 0,e);w.promise=(e,t,r)=>{let a=w.loading(t.loading,{...r,...r==null?void 0:r.loading});return typeof e=="function"&&(e=e()),e.then(i=>{let n=t.success?T(t.success,i):void 0;return n?w.success(n,{id:a,...r,...r==null?void 0:r.success}):w.dismiss(a),i}).catch(i=>{let n=t.error?T(t.error,i):void 0;n?w.error(n,{id:a,...r,...r==null?void 0:r.error}):w.dismiss(a)}),e};var qe=1e3,Be=(e,t="default")=>{let{toasts:r,pausedAt:a}=Ve(e,t),i=l.useRef(new Map).current,n=l.useCallback((d,h=qe)=>{if(i.has(d))return;let v=setTimeout(()=>{i.delete(d),o({type:4,toastId:d})},h);i.set(d,v)},[]);l.useEffect(()=>{if(a)return;let d=Date.now(),h=r.map(v=>{if(v.duration===1/0)return;let b=(v.duration||0)+v.pauseDuration-(d-v.createdAt);if(b<0){v.visible&&w.dismiss(v.id);return}return setTimeout(()=>w.dismiss(v.id,t),b)});return()=>{h.forEach(v=>v&&clearTimeout(v))}},[r,a,t]);let o=l.useCallback(V(t),[t]),c=l.useCallback(()=>{o({type:5,time:Date.now()})},[o]),u=l.useCallback((d,h)=>{o({type:1,toast:{id:d,height:h}})},[o]),p=l.useCallback(()=>{a&&o({type:6,time:Date.now()})},[a,o]),m=l.useCallback((d,h)=>{let{reverseOrder:v=!1,gutter:b=8,defaultPosition:j}=h||{},y=r.filter(k=>(k.position||j)===(d.position||j)&&k.height),_=y.findIndex(k=>k.id===d.id),S=y.filter((k,H)=>H<_&&k.visible).length;return y.filter(k=>k.visible).slice(...v?[S+1]:[0,S]).reduce((k,H)=>k+(H.height||0)+b,0)},[r]);return l.useEffect(()=>{r.forEach(d=>{if(d.dismissed)n(d.id,d.removeDelay);else{let h=i.get(d.id);h&&(clearTimeout(h),i.delete(d.id))}})},[r,n]),{toasts:r,handlers:{updateHeight:u,startPause:c,endPause:p,calculateOffset:m}}},We=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,Ue=N`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Fe=N`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,Ye=C("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${We} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${Ue} 0.15s ease-out forwards;
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
    animation: ${Fe} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,Ze=N`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,Ke=C("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${Ze} 1s linear infinite;
`,Qe=N`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,Ge=N`
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
}`,Je=C("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${Qe} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${Ge} 0.2s ease-out forwards;
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
`,Xe=C("div")`
  position: absolute;
`,et=C("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,tt=N`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,st=C("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${tt} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,rt=({toast:e})=>{let{icon:t,type:r,iconTheme:a}=e;return t!==void 0?typeof t=="string"?l.createElement(st,null,t):t:r==="blank"?null:l.createElement(et,null,l.createElement(Ke,{...a}),r!=="loading"&&l.createElement(Xe,null,r==="error"?l.createElement(Ye,{...a}):l.createElement(Je,{...a})))},at=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ot=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,it="0%{opacity:0;} 100%{opacity:1;}",nt="0%{opacity:1;} 100%{opacity:0;}",lt=C("div")`
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
`,ct=C("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,dt=(e,t)=>{let r=e.includes("top")?1:-1,[a,i]=oe()?[it,nt]:[at(r),ot(r)];return{animation:t?`${N(a)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${N(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},ut=l.memo(({toast:e,position:t,style:r,children:a})=>{let i=e.height?dt(e.position||t||"top-center",e.visible):{opacity:0},n=l.createElement(rt,{toast:e}),o=l.createElement(ct,{...e.ariaProps},T(e.message,e));return l.createElement(lt,{className:e.className,style:{...i,...r,...e.style}},typeof a=="function"?a({icon:n,message:o}):l.createElement(l.Fragment,null,n,o))});Le(l.createElement);var pt=({id:e,className:t,style:r,onHeightUpdate:a,children:i})=>{let n=l.useCallback(o=>{if(o){let c=()=>{let u=o.getBoundingClientRect().height;a(e,u)};c(),new MutationObserver(c).observe(o,{subtree:!0,childList:!0,characterData:!0})}},[e,a]);return l.createElement("div",{ref:n,className:t,style:r},i)},mt=(e,t)=>{let r=e.includes("top"),a=r?{top:0}:{bottom:0},i=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:oe()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(r?1:-1)}px)`,...a,...i}},ht=D`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,O=16,ft=({reverseOrder:e,position:t="top-center",toastOptions:r,gutter:a,children:i,toasterId:n,containerStyle:o,containerClassName:c})=>{let{toasts:u,handlers:p}=Be(r,n);return l.createElement("div",{"data-rht-toaster":n||"",style:{position:"fixed",zIndex:9999,top:O,left:O,right:O,bottom:O,pointerEvents:"none",...o},className:c,onMouseEnter:p.startPause,onMouseLeave:p.endPause},u.map(m=>{let d=m.position||t,h=p.calculateOffset(m,{reverseOrder:e,gutter:a,defaultPosition:t}),v=mt(d,h);return l.createElement(pt,{id:m.id,key:m.id,onHeightUpdate:p.updateHeight,className:m.visible?ht:"",style:v},m.type==="custom"?T(m.message,m):i?i(m):l.createElement(ut,{toast:m,position:d}))}))},xr=w,z={},xt=()=>{window.va||(window.va=function(...t){window.vaq||(window.vaq=[]),window.vaq.push(t)})},yt="@vercel/analytics",gt="2.0.1";function de(){return typeof window<"u"}function ue(){try{const e="production"}catch{}return"production"}function vt(e="auto"){if(e==="auto"){window.vam=ue();return}window.vam=e}function bt(){return(de()?window.vam:ue())||"production"}function K(){return bt()==="development"}function _t(e){return e.scriptSrc?M(e.scriptSrc):K()?"https://va.vercel-scripts.com/v1/script.debug.js":e.basePath?M(`${e.basePath}/insights/script.js`):"/_vercel/insights/script.js"}function wt(e,t){var r;let a=e;if(t)try{a={...(r=JSON.parse(t))==null?void 0:r.analytics,...e}}catch{}vt(a.mode);const i={sdkn:yt+(a.framework?`/${a.framework}`:""),sdkv:gt};return a.disableAutoTrack&&(i.disableAutoTrack="1"),a.viewEndpoint&&(i.viewEndpoint=M(a.viewEndpoint)),a.eventEndpoint&&(i.eventEndpoint=M(a.eventEndpoint)),a.sessionEndpoint&&(i.sessionEndpoint=M(a.sessionEndpoint)),K()&&a.debug===!1&&(i.debug="false"),a.dsn&&(i.dsn=a.dsn),a.endpoint?i.endpoint=a.endpoint:a.basePath&&(i.endpoint=M(`${a.basePath}/insights`)),{beforeSend:a.beforeSend,src:_t(a),dataset:i}}function M(e){return e.startsWith("http://")||e.startsWith("https://")||e.startsWith("/")?e:`/${e}`}function jt(e={debug:!0},t){var r;if(!de())return;const{beforeSend:a,src:i,dataset:n}=wt(e,t);if(xt(),a&&((r=window.va)==null||r.call(window,"beforeSend",a)),document.head.querySelector(`script[src*="${i}"]`))return;const o=document.createElement("script");o.src=i;for(const[c,u]of Object.entries(n))o.dataset[c]=u;o.defer=!0,o.onerror=()=>{const c=K()?"Please check if any ad blockers are enabled and try again.":"Be sure to enable Web Analytics for your project and deploy again. See https://vercel.com/docs/analytics/quickstart for more information.";console.log(`[Vercel Web Analytics] Failed to load script from ${i}. ${c}`)},document.head.appendChild(o)}function kt({route:e,path:t}){var r;(r=window.va)==null||r.call(window,"pageview",{route:e,path:t})}function Et(){if(!(typeof process>"u"||typeof z>"u"))return z.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH}function At(){if(!(typeof process>"u"||typeof z>"u"))return z.REACT_APP_VERCEL_OBSERVABILITY_CLIENT_CONFIG}function Nt(e){return l.useEffect(()=>{var t;e.beforeSend&&((t=window.va)==null||t.call(window,"beforeSend",e.beforeSend))},[e.beforeSend]),l.useEffect(()=>{jt({framework:e.framework||"react",basePath:e.basePath??Et(),...e.route!==void 0&&{disableAutoTrack:!0},...e},e.configString??At())},[]),l.useEffect(()=>{e.route&&e.path&&kt({route:e.route,path:e.path})},[e.route,e.path]),null}const Pt=void 0,It=void 0;throw new Error("Missing Supabase env vars: VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY");const E=xe(Pt,It,{auth:{persistSession:!0,autoRefreshToken:!0,detectSessionInUrl:!0}}),pe=l.createContext(void 0),Ct={free:100,pro:700,business:2400},X=Ct;function St({children:e}){const[t,r]=l.useState(null),[a,i]=l.useState(null),[n,o]=l.useState(!0),c=async(b,j)=>{const{data:y,error:_}=await E.from("profiles").select("*").eq("id",b).maybeSingle();if(_)return console.error("Profile fetch error:",_.message),null;if(y)return i(y),y;const{data:S,error:k}=await E.from("profiles").insert({id:b,email:j,subscription_tier:"free",credits:X.free}).select().maybeSingle();return k?(console.error("Profile create error:",k.message),null):(S&&await E.from("credit_ledger").insert({user_id:b,delta:X.free,reason:"signup_bonus"}),i(S),S)},u=async b=>{const{data:j,error:y}=await E.from("profiles").select("*").eq("id",b).maybeSingle();return y?(console.error("Profile fetch error:",y.message),null):(i(j??null),j??null)},p=async()=>{t!=null&&t.user&&await u(t.user.id)};l.useEffect(()=>{let b=!0;E.auth.getSession().then(({data:y})=>{var _;b&&(r(y.session),(_=y.session)!=null&&_.user?c(y.session.user.id,y.session.user.email??"").finally(()=>{o(!1)}):o(!1))});const{data:j}=E.auth.onAuthStateChange((y,_)=>{(async()=>(r(_),_!=null&&_.user?await c(_.user.id,_.user.email??""):i(null),o(!1)))()});return()=>{b=!1,j.subscription.unsubscribe()}},[]);const m=async(b,j)=>{const{data:y,error:_}=await E.auth.signUp({email:b,password:j});return _?{error:_.message,session:null}:(y.user&&(await c(y.user.id,b),await E.from("email_notifications").insert({user_id:y.user.id,to_email:b,template:"welcome",subject:"Welcome to AI Creator Pro 🎬",body:`Hi there,

Welcome to AI Creator Pro! Your account is ready and 100 free credits have been added.

Start creating: ${window.location.origin}

The AI Creator Pro team`,status:"queued"})),{error:null,session:y.session})},d=async(b,j)=>{const{data:y,error:_}=await E.auth.signInWithPassword({email:b,password:j});return _?{error:_.message}:(y.user&&await c(y.user.id,b),{error:null})},h=async()=>{await E.auth.signOut(),i(null),r(null)},v={user:(t==null?void 0:t.user)??null,session:t,profile:a,loading:n,signUp:m,signIn:d,signOut:h,refreshProfile:p};return s.jsx(pe.Provider,{value:v,children:e})}function me(){const e=l.useContext(pe);if(!e)throw new Error("useAuth must be used within AuthProvider");return e}/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const he=(...e)=>e.filter((t,r,a)=>!!t&&t.trim()!==""&&a.indexOf(t)===r).join(" ").trim();/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $t=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Mt=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,r,a)=>a?a.toUpperCase():r.toLowerCase());/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=e=>{const t=Mt(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var B={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Lt=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1},Ot=l.createContext({}),Rt=()=>l.useContext(Ot),Tt=l.forwardRef(({color:e,size:t,strokeWidth:r,absoluteStrokeWidth:a,className:i="",children:n,iconNode:o,...c},u)=>{const{size:p=24,strokeWidth:m=2,absoluteStrokeWidth:d=!1,color:h="currentColor",className:v=""}=Rt()??{},b=a??d?Number(r??m)*24/Number(t??p):r??m;return l.createElement("svg",{ref:u,...B,width:t??p??B.width,height:t??p??B.height,stroke:e??h,strokeWidth:b,className:he("lucide",v,i),...!n&&!Lt(c)&&{"aria-hidden":"true"},...c},[...o.map(([j,y])=>l.createElement(j,y)),...Array.isArray(n)?n:[n]])});/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const g=(e,t)=>{const r=l.forwardRef(({className:a,...i},n)=>l.createElement(Tt,{ref:n,iconNode:t,className:he(`lucide-${$t(ee(e))}`,`lucide-${e}`,a),...i}));return r.displayName=ee(e),r};/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zt=[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]],Dt=g("bell",zt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vt=[["rect",{width:"18",height:"14",x:"3",y:"5",rx:"2",ry:"2",key:"12ruh7"}],["path",{d:"M7 15h4M15 15h2M7 11h2M13 11h4",key:"1ueiar"}]],Ht=g("captions",Vt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qt=[["path",{d:"M3 3v16a2 2 0 0 0 2 2h16",key:"c24i48"}],["path",{d:"M18 17V9",key:"2bz60n"}],["path",{d:"M13 17V5",key:"1frdt8"}],["path",{d:"M8 17v-3",key:"17ska0"}]],Bt=g("chart-column",qt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Wt=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],Ut=g("chevron-left",Wt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ft=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]],Yt=g("clock",Ft);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zt=[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]],Kt=g("credit-card",Zt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qt=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",key:"afitv7"}],["path",{d:"M7 3v18",key:"bbkbws"}],["path",{d:"M3 7.5h4",key:"zfgn84"}],["path",{d:"M3 12h18",key:"1i2n21"}],["path",{d:"M3 16.5h4",key:"1230mu"}],["path",{d:"M17 3v18",key:"in4fa5"}],["path",{d:"M17 7.5h4",key:"myr1c1"}],["path",{d:"M17 16.5h4",key:"go4c1d"}]],Gt=g("film",Qt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jt=[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]],Xt=g("folder-open",Jt);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const es=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}]],ts=g("image",es);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ss=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],rs=g("layout-dashboard",ss);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const as=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],os=g("loader-circle",as);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const is=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],ns=g("log-out",is);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ls=[["path",{d:"M12 19v3",key:"npa21l"}],["path",{d:"M19 10v2a7 7 0 0 1-14 0v-2",key:"1vc78b"}],["rect",{x:"9",y:"2",width:"6",height:"13",rx:"3",key:"s6n7sd"}]],cs=g("mic",ls);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ds=[["path",{d:"M9 18V5l12-2v13",key:"1jmyc2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["circle",{cx:"18",cy:"16",r:"3",key:"1hluhg"}]],us=g("music",ds);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ps=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"M12 5v14",key:"s699le"}]],ms=g("plus",ps);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hs=[["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}],["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09",key:"u4xsad"}],["path",{d:"M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z",key:"676m9"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05",key:"92ym6u"}]],fs=g("rocket",hs);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xs=[["circle",{cx:"6",cy:"6",r:"3",key:"1lh9wr"}],["path",{d:"M8.12 8.12 12 12",key:"1alkpv"}],["path",{d:"M20 4 8.12 15.88",key:"xgtan2"}],["circle",{cx:"6",cy:"18",r:"3",key:"fqmcym"}],["path",{d:"M14.8 14.8 20 20",key:"ptml3r"}]],ys=g("scissors",xs);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gs=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],vs=g("search",gs);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bs=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],_s=g("settings",bs);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ws=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],js=g("shield-check",ws);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ks=[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]],Es=g("sparkles",ks);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const As=[["path",{d:"M15 21v-5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5",key:"slp6dd"}],["path",{d:"M17.774 10.31a1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.451 0 1.12 1.12 0 0 0-1.548 0 2.5 2.5 0 0 1-3.452 0 1.12 1.12 0 0 0-1.549 0 2.5 2.5 0 0 1-3.77-3.248l2.889-4.184A2 2 0 0 1 7 2h10a2 2 0 0 1 1.653.873l2.895 4.192a2.5 2.5 0 0 1-3.774 3.244",key:"o0xfot"}],["path",{d:"M4 10.95V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8.05",key:"wn3emo"}]],Ns=g("store",As);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ps=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],Is=g("users",Ps);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Cs=[["path",{d:"m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72",key:"ul74o6"}],["path",{d:"m14 7 3 3",key:"1r5n42"}],["path",{d:"M5 6v4",key:"ilb8ba"}],["path",{d:"M19 14v4",key:"blhpug"}],["path",{d:"M10 2v2",key:"7u0qdc"}],["path",{d:"M7 8H3",key:"zfb6yr"}],["path",{d:"M21 16h-4",key:"1cnmox"}],["path",{d:"M11 3H9",key:"1obp7u"}]],fe=g("wand-sparkles",Cs);/**
 * @license lucide-react v1.20.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ss=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],$s=g("zap",Ss),Ms=[{label:"Create",items:[{to:"/",icon:rs,label:"Dashboard",exact:!0},{to:"/create",icon:fe,label:"Create Video",badge:"New"},{to:"/ai-pipeline",icon:Es,label:"AI Pipeline"},{to:"/autopilot",icon:fs,label:"Autopilot"}]},{label:"AI Tools",items:[{to:"/ai-script",icon:Gt,label:"AI Script"},{to:"/ai-voice",icon:cs,label:"AI Voice"},{to:"/ai-music",icon:us,label:"AI Music"},{to:"/ai-subtitles",icon:Ht,label:"AI Subtitles"},{to:"/ai-thumbnail",icon:ts,label:"AI Thumbnail"},{to:"/ai-shorts",icon:ys,label:"AI Shorts"},{to:"/ai-seo",icon:vs,label:"AI SEO"}]},{label:"Workspace",items:[{to:"/projects",icon:Xt,label:"Projects"},{to:"/render-history",icon:Yt,label:"History"},{to:"/analytics",icon:Bt,label:"Analytics"}]},{label:"More",items:[{to:"/marketplace",icon:Ns,label:"Marketplace"},{to:"/referrals",icon:Is,label:"Affiliate"},{to:"/billing",icon:Kt,label:"Billing"}]}],W={to:"/admin",icon:js},Ls={free:"from-slate-500 to-slate-600",pro:"from-indigo-500 to-cyan-500",business:"from-violet-500 to-pink-500"};function Os(){const[e,t]=l.useState(!1),{user:r,profile:a,signOut:i}=me(),n=be(),o=te(),c=async()=>{await i(),n("/login")},u=Ls[(a==null?void 0:a.subscription_tier)??"free"],p=Math.min(100,((a==null?void 0:a.credits)??0)/((a==null?void 0:a.subscription_tier)==="business"?1e4:(a==null?void 0:a.subscription_tier)==="pro"?2e3:100)*100);return s.jsxs("div",{className:"h-full flex bg-slate-950 relative",style:{zIndex:1},children:[s.jsxs($.aside,{initial:!1,animate:{width:e?68:240},transition:{type:"spring",stiffness:300,damping:30},className:"h-full flex-shrink-0 glass-panel border-r border-white/[0.05] flex flex-col relative z-20",children:[s.jsx("div",{className:"h-16 flex items-center px-4 border-b border-white/[0.05]",children:s.jsxs("div",{className:"flex items-center gap-3 min-w-0",children:[s.jsx("div",{className:"w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-glow-cyan",children:s.jsx(fe,{className:"w-4 h-4 text-white"})}),s.jsx(Ee,{children:!e&&s.jsx($.span,{initial:{opacity:0,x:-8},animate:{opacity:1,x:0},exit:{opacity:0,x:-8},transition:{duration:.15},className:"font-bold text-base gradient-text-cyan whitespace-nowrap",children:"AI Creator Pro"})})]})}),s.jsx("div",{className:"px-3 py-3 border-b border-white/[0.04]",children:s.jsx(q,{to:"/create",children:s.jsxs($.div,{whileHover:{scale:1.02},whileTap:{scale:.98},className:`gradient-btn-primary rounded-xl flex items-center justify-center gap-2 cursor-pointer overflow-hidden ${e?"h-10 w-10 mx-auto":"h-10 px-4"}`,children:[s.jsx(ms,{className:"w-4 h-4 text-white flex-shrink-0"}),!e&&s.jsx("span",{className:"text-sm font-semibold text-white",children:"New video"})]})})}),s.jsxs("nav",{className:"flex-1 overflow-y-auto py-3 px-2 space-y-4",children:[Ms.map(m=>s.jsxs("div",{children:[!e&&s.jsx("p",{className:"text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1.5",children:m.label}),s.jsx("div",{className:"space-y-0.5",children:m.items.map(d=>{const h=d.exact?o.pathname===d.to:o.pathname.startsWith(d.to)&&d.to!=="/";return s.jsx(q,{to:d.to,children:s.jsxs($.div,{whileHover:{x:e?0:2},className:`nav-item flex items-center gap-3 px-3 py-2.5 cursor-pointer group ${h?"active":""}`,children:[s.jsx(d.icon,{className:`w-4 h-4 flex-shrink-0 transition-colors ${h?"text-indigo-400":"text-slate-500 group-hover:text-slate-300"}`}),!e&&s.jsx("span",{className:`text-sm font-medium flex-1 transition-colors ${h?"text-white":"text-slate-400 group-hover:text-white"}`,children:d.label}),!e&&d.badge&&s.jsx("span",{className:"text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",children:d.badge})]})},d.to)})})]},m.label)),(a==null?void 0:a.is_admin)&&s.jsxs("div",{children:[!e&&s.jsx("p",{className:"text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-1.5",children:"System"}),s.jsx(q,{to:W.to,children:s.jsxs($.div,{whileHover:{x:2},className:`nav-item flex items-center gap-3 px-3 py-2.5 cursor-pointer group ${o.pathname===W.to?"active":""}`,children:[s.jsx(W.icon,{className:"w-4 h-4 flex-shrink-0 text-violet-500"}),!e&&s.jsx("span",{className:"text-sm font-medium text-slate-400 group-hover:text-white",children:"Admin"})]})})]})]}),s.jsxs("div",{className:"p-3 border-t border-white/[0.05] space-y-2",children:[!e&&a&&s.jsxs("div",{className:"glass-card p-3 rounded-xl",children:[s.jsxs("div",{className:"flex items-center justify-between mb-2",children:[s.jsxs("div",{className:"flex items-center gap-1.5",children:[s.jsx($s,{className:"w-3 h-3 text-amber-400"}),s.jsx("span",{className:"text-xs font-semibold text-amber-400",children:a.credits.toLocaleString()}),s.jsx("span",{className:"text-xs text-slate-500",children:"credits"})]}),s.jsx("span",{className:`badge-pro bg-gradient-to-r ${u} text-white border-0`,children:a.subscription_tier.toUpperCase()})]}),s.jsx("div",{className:"progress-bar",children:s.jsx("div",{className:"progress-bar-fill",style:{width:`${p}%`}})})]}),s.jsxs("button",{onClick:()=>n("/render-history"),className:"w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors",children:[s.jsx(Dt,{className:"w-4 h-4 flex-shrink-0"}),!e&&s.jsx("span",{className:"text-sm",children:"Notifications"})]}),s.jsxs("button",{onClick:()=>n("/settings"),className:"w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/[0.04] transition-colors",children:[s.jsx(_s,{className:"w-4 h-4 flex-shrink-0"}),!e&&s.jsx("span",{className:"text-sm",children:"Settings"})]}),!e&&r&&s.jsxs("div",{className:"flex items-center gap-2 px-3 py-2",children:[s.jsx("div",{className:`w-7 h-7 rounded-full bg-gradient-to-br ${u} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`,children:(r.email??"?")[0].toUpperCase()}),s.jsx("div",{className:"flex-1 min-w-0",children:s.jsx("div",{className:"text-xs font-medium text-white truncate",children:r.email})})]}),s.jsxs("button",{onClick:c,className:"w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-colors",children:[s.jsx(ns,{className:"w-4 h-4 flex-shrink-0"}),!e&&s.jsx("span",{className:"text-sm",children:"Sign out"})]}),s.jsx("button",{onClick:()=>t(!e),className:"w-full flex items-center justify-center py-1.5 rounded-xl text-slate-600 hover:text-slate-400 transition-colors",children:s.jsx($.div,{animate:{rotate:e?180:0},children:s.jsx(Ut,{className:"w-4 h-4"})})})]})]}),s.jsx("main",{className:"flex-1 overflow-hidden relative",children:s.jsx(_e,{})})]})}const Rs=l.lazy(()=>x(()=>import("./Landing-D0o9_h0O.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9,10])));function Ts(){const{user:e,loading:t}=me(),r=te();return t?s.jsx("div",{className:"h-full flex items-center justify-center bg-slate-950",children:s.jsx(os,{className:"w-8 h-8 animate-spin text-cyan-500"})}):e?s.jsx(Os,{}):r.pathname==="/"?s.jsx(l.Suspense,{fallback:s.jsx("div",{className:"fixed inset-0 bg-slate-950"}),children:s.jsx(Rs,{})}):s.jsx(se,{to:"/login",replace:!0})}const zs=l.lazy(()=>x(()=>import("./Login-BR_QWROa.js"),__vite__mapDeps([11,1,2,4,3,12,13,14,15]))),Ds=l.lazy(()=>x(()=>import("./Register-jaFmg9G3.js"),__vite__mapDeps([16,1,2,17,3,9,18,13,14,15]))),Vs=l.lazy(()=>x(()=>import("./ForgotPassword-B4Ecj9Sj.js"),__vite__mapDeps([19,1,2,3,20,13,15]))),Hs=l.lazy(()=>x(()=>import("./ResetPassword-BIE4l-rP.js"),__vite__mapDeps([21,1,2,3,20,14,15]))),qs=l.lazy(()=>x(()=>import("./Terms-BxSpWivq.js"),__vite__mapDeps([22,1,2,23,3]))),Bs=l.lazy(()=>x(()=>import("./Privacy-BXDmx_iB.js"),__vite__mapDeps([24,1,2,23,3]))),Ws=l.lazy(()=>x(()=>import("./Dashboard-BuRyddii.js"),__vite__mapDeps([25,1,2,3,26,6]))),Us=l.lazy(()=>x(()=>import("./Create-CUEHaW2i.js"),__vite__mapDeps([27,1,2,28,3,9,15,6,8,29,26]))),Fs=l.lazy(()=>x(()=>import("./Editor-NF8SsSrq.js"),__vite__mapDeps([30,1,2,17,12,14,28,31,32,23,6,33,3]))),Ys=l.lazy(()=>x(()=>import("./Projects-Bsut2UAw.js"),__vite__mapDeps([34,1,2,3,6,32]))),Zs=l.lazy(()=>x(()=>import("./AIPipeline-Cv4P_7cL.js"),__vite__mapDeps([35,1,2,17,5,3,15,20,7]))),Ks=l.lazy(()=>x(()=>import("./Autopilot-D4h28Dkf.js"),__vite__mapDeps([36,1,2,28,3,37,10]))),Qs=l.lazy(()=>x(()=>import("./Billing-CdIsYnVh.js"),__vite__mapDeps([38,1,2,3,9]))),Gs=l.lazy(()=>x(()=>import("./Settings-DuHFCSMS.js"),__vite__mapDeps([39,1,2,14,40,3,33,32]))),Js=l.lazy(()=>x(()=>import("./RenderHistory-D5Gy3xAs.js"),__vite__mapDeps([41,1,2,17,37,15,42,20,8,7,3]))),Xs=l.lazy(()=>x(()=>import("./Analytics-DDYwjaLa.js"),__vite__mapDeps([43,1,2,44,3]))),er=l.lazy(()=>x(()=>import("./Admin-DfIJfkJt.js"),__vite__mapDeps([45,1,2,40,15,3,18,20,44,13,42]))),tr=l.lazy(()=>x(()=>import("./Referrals-Dc_JHWjV.js"),__vite__mapDeps([46,1,2,17,3,18,44,9,31]))),sr=l.lazy(()=>x(()=>import("./Marketplace-DjjrYpY2.js"),__vite__mapDeps([47,1,2,3,29,8,9]))),rr=l.lazy(()=>x(()=>import("./AITools-jEScXrk5.js"),__vite__mapDeps([48,1,2,28,8,9,6,3,15])).then(e=>({default:e.AIScript}))),ar=l.lazy(()=>x(()=>import("./AITools-jEScXrk5.js"),__vite__mapDeps([48,1,2,28,8,9,6,3,15])).then(e=>({default:e.AIVoice}))),or=l.lazy(()=>x(()=>import("./AITools-jEScXrk5.js"),__vite__mapDeps([48,1,2,28,8,9,6,3,15])).then(e=>({default:e.AIMusic}))),ir=l.lazy(()=>x(()=>import("./AITools-jEScXrk5.js"),__vite__mapDeps([48,1,2,28,8,9,6,3,15])).then(e=>({default:e.AISubtitles}))),nr=l.lazy(()=>x(()=>import("./AITools-jEScXrk5.js"),__vite__mapDeps([48,1,2,28,8,9,6,3,15])).then(e=>({default:e.AIThumbnail}))),lr=l.lazy(()=>x(()=>import("./AITools-jEScXrk5.js"),__vite__mapDeps([48,1,2,28,8,9,6,3,15])).then(e=>({default:e.AIShorts}))),cr=l.lazy(()=>x(()=>import("./AITools-jEScXrk5.js"),__vite__mapDeps([48,1,2,28,8,9,6,3,15])).then(e=>({default:e.AISEO})));function dr(){return s.jsx("div",{className:"h-full flex items-center justify-center",children:s.jsxs("div",{className:"flex flex-col items-center gap-4",children:[s.jsx("div",{className:"w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 animate-pulse"}),s.jsx("div",{className:"flex gap-1.5",children:[0,1,2].map(e=>s.jsx("div",{className:"w-1.5 h-1.5 rounded-full bg-indigo-500/40 animate-pulse",style:{animationDelay:`${e*.15}s`}},e))})]})})}function ur(){return s.jsxs(St,{children:[s.jsx(l.Suspense,{fallback:s.jsx(dr,{}),children:s.jsxs(we,{children:[s.jsx(f,{path:"/login",element:s.jsx(zs,{})}),s.jsx(f,{path:"/register",element:s.jsx(Ds,{})}),s.jsx(f,{path:"/forgot-password",element:s.jsx(Vs,{})}),s.jsx(f,{path:"/reset-password",element:s.jsx(Hs,{})}),s.jsx(f,{path:"/terms",element:s.jsx(qs,{})}),s.jsx(f,{path:"/privacy",element:s.jsx(Bs,{})}),s.jsxs(f,{path:"/",element:s.jsx(Ts,{}),children:[s.jsx(f,{index:!0,element:s.jsx(Ws,{})}),s.jsx(f,{path:"create",element:s.jsx(Us,{})}),s.jsx(f,{path:"editor/:projectId?",element:s.jsx(Fs,{})}),s.jsx(f,{path:"projects",element:s.jsx(Ys,{})}),s.jsx(f,{path:"ai-pipeline",element:s.jsx(Zs,{})}),s.jsx(f,{path:"autopilot",element:s.jsx(Ks,{})}),s.jsx(f,{path:"billing",element:s.jsx(Qs,{})}),s.jsx(f,{path:"settings",element:s.jsx(Gs,{})}),s.jsx(f,{path:"render-history",element:s.jsx(Js,{})}),s.jsx(f,{path:"analytics",element:s.jsx(Xs,{})}),s.jsx(f,{path:"referrals",element:s.jsx(tr,{})}),s.jsx(f,{path:"marketplace",element:s.jsx(sr,{})}),s.jsx(f,{path:"admin",element:s.jsx(er,{})}),s.jsx(f,{path:"ai-script",element:s.jsx(rr,{})}),s.jsx(f,{path:"ai-voice",element:s.jsx(ar,{})}),s.jsx(f,{path:"ai-music",element:s.jsx(or,{})}),s.jsx(f,{path:"ai-subtitles",element:s.jsx(ir,{})}),s.jsx(f,{path:"ai-thumbnail",element:s.jsx(nr,{})}),s.jsx(f,{path:"ai-shorts",element:s.jsx(lr,{})}),s.jsx(f,{path:"ai-seo",element:s.jsx(cr,{})})]}),s.jsx(f,{path:"*",element:s.jsx(se,{to:"/",replace:!0})})]})}),s.jsx(ft,{position:"bottom-right",toastOptions:{style:{background:"rgba(15,23,42,0.92)",backdropFilter:"blur(16px)",color:"#f1f5f9",border:"1px solid rgba(148,163,184,0.1)",borderRadius:"12px",fontSize:"13px"},success:{iconTheme:{primary:"#10b981",secondary:"#f8fafc"}},error:{iconTheme:{primary:"#ef4444",secondary:"#f8fafc"}}}}),s.jsx(Nt,{})]})}const pr=new ye({defaultOptions:{queries:{staleTime:1e3*60*5,retry:1}}});U.createRoot(document.getElementById("root")).render(s.jsx(je.StrictMode,{children:s.jsx(ge,{client:pr,children:s.jsx(ke,{children:s.jsx(ur,{})})})}));export{Ht as C,Gt as F,ts as I,os as L,cs as M,ms as P,fs as R,ys as S,Is as U,fe as W,$s as Z,x as _,Ct as a,Yt as b,g as c,us as d,Es as e,Xt as f,Ut as g,vs as h,Kt as i,ns as j,Bt as k,js as l,Ns as m,E as s,me as u,xr as z};
