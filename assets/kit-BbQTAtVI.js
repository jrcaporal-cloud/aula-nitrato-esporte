import{j as e}from"./vendor-react-xlEdjmNm.js";import{P as m}from"./index-BXDuucai.js";import{b as i}from"./rhythm-BAtEsix8.js";import{u as f,m as c}from"./vendor-motion-4xYHv2CD.js";const l=500,d=`
@keyframes ab-pulse { 0%,100% { opacity: .55; transform: scale(1) } 50% { opacity: 1; transform: scale(1.18) } }
@keyframes ab-breathe { 0%,100% { opacity: .5 } 50% { opacity: 1 } }
@keyframes ab-bob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-5px) } }
@keyframes ab-scan { 0% { transform: translateX(0); opacity: 0 } 8% { opacity: 1 } 92% { opacity: 1 } 100% { transform: translateX(var(--ab-scan, 300px)); opacity: 0 } }
@keyframes ab-dash { to { stroke-dashoffset: -40 } }
@keyframes ab-spin { to { transform: rotate(360deg) } }
@keyframes ab-twinkle { 0%,100% { opacity: .15 } 50% { opacity: .9 } }
@keyframes ab-check { from { background: rgba(255,255,255,.1) } to { background: var(--ab-to, #34D399) } }
@keyframes ab-tilt { from { transform: rotate(0deg) } to { transform: rotate(var(--ab-deg, 8deg)) } }
@keyframes ab-untilt { from { transform: rotate(0deg) } to { transform: rotate(calc(var(--ab-deg, 8deg) * -1)) } }
@keyframes ab-drop { from { height: var(--ab-from) } to { height: var(--ab-to) } }
@keyframes ab-grow { from { transform: scaleY(0) } to { transform: scaleY(1) } }
@keyframes ab-growx { from { transform: scaleX(0) } to { transform: scaleX(1) } }
@keyframes ab-rot { from { transform: rotate(var(--ab-a0)) } to { transform: rotate(var(--ab-a1)) } }
@keyframes ab-draw { from { stroke-dashoffset: var(--ab-len, 300) } to { stroke-dashoffset: 0 } }
.ab-a { animation-fill-mode: both }
@media (prefers-reduced-motion: reduce) { .ab-a { animation: none !important } }
`,b=()=>e.jsx("style",{children:d}),k=({tabs:a,step:t,setStep:o,layoutId:s,chips:r,children:n})=>e.jsxs("div",{className:"not-prose mx-auto flex w-full max-w-[1110px] select-none flex-col gap-3 font-body text-white",style:{height:l},children:[e.jsx(b,{}),e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsx(i,{labels:a,step:t,onSelect:o,layoutId:s}),r&&e.jsx("div",{className:"flex items-center gap-2",children:r})]}),e.jsx("div",{className:"flex min-h-0 flex-1 flex-col gap-3",children:n})]}),h=({color:a="#94A3B8",glow:t=0,dashed:o=!1,className:s="",style:r,children:n})=>e.jsx("div",{className:`relative overflow-hidden rounded-2xl border transition-[box-shadow,border-color,opacity] duration-500 ${s}`,style:{borderStyle:o?"dashed":"solid",borderColor:t>0?`${a}${t>.5?"bb":"66"}`:"rgba(255,255,255,0.12)",background:t>0?`linear-gradient(165deg, ${a}22, rgba(10,6,14,0.84) 66%)`:m.background,boxShadow:t>0?`0 0 34px -12px ${a}`:"none",...r},children:n}),u=({delay:a=0,y:t=10,className:o="",style:s,children:r})=>{const n=f()??!1;return e.jsx(c.div,{className:o,style:s,initial:n?!1:{opacity:0,y:t},animate:{opacity:1,y:0},transition:{duration:.45,delay:a,ease:[.16,1,.3,1]},children:r})},v=({children:a,color:t="#9CA3AF"})=>e.jsx("p",{className:"m-0 font-mono text-[14px] uppercase leading-tight tracking-wider",style:{color:t},children:a}),j=({children:a})=>e.jsx("span",{className:"font-mono text-[14px] leading-tight text-gray-400",children:a});export{b as A,h as G,v as K,u as R,j as S,k as a};
