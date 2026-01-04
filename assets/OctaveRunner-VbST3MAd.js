import{u as M,r,l as z,o as O,a as V,c as i,j as d,d as t,h as T,q as F,F as L,f as S,t as c,e as g,n as R,i as $,b as j,g as N}from"./index-DlYbbPaf.js";import U from"./MonacoEditor-Ckzx4lfY.js";import{x as H,a as W}from"./xterm-Btcyv0ds.js";import"./monaco-editor-CGO6wXTd.js";const q={class:"flex flex-col md:flex-row h-full"},D={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700"},I={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50"},P={class:"flex items-center gap-2"},G=["value"],J={key:0,class:"text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full"},K={key:1,class:"text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full"},Q=["disabled"],X={key:0,class:"w-4 h-4 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},Y={key:1,class:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24"},Z={class:"flex-1 min-h-0"},ee={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900 border-t md:border-t-0 md:border-l border-slate-700"},te={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700"},oe={class:"flex items-center gap-3"},se={class:"text-xs font-bold text-slate-400 uppercase tracking-wider"},le={key:0,class:"text-xs text-slate-500"},ne={class:"flex-1 min-h-0 p-2 bg-[#0f172a]"},ue={__name:"OctaveRunner",setup(ae){const{t:u}=M(),v={hello:{name:"Hello World",code:`disp("Hello, World!");
x = 1:10;
y = x.^2;
disp("Squares:");
disp(y);
`},matrix:{name:"Matrix Operations",code:`A = [1 2; 3 4];
B = [5 6; 7 8];
disp("A + B =");
disp(A + B);
disp("A * B =");
disp(A * B);
disp("inv(A) =");
disp(inv(A));
`},linalg:{name:"Linear Algebra",code:`# Solving Linear Equations System
# 3x + 2y - z = 1
# 2x - 2y + 4z = -2
# -x + 0.5y - z = 0

A = [3, 2, -1; 2, -2, 4; -1, 0.5, -1];
b = [1; -2; 0];

disp("Matrix A:");
disp(A);
disp("Vector b:");
disp(b);

x = A \\ b;
disp("Solution x:");
disp(x);

disp("Check solution (A*x):");
disp(A*x);

disp("Eigenvalues of A:");
disp(eig(A));
`}},h=r("hello"),f=r(v.hello.code);z(h,o=>{v[o]&&(f.value=v[o].code)});const n=r(!1),m=r(!1),p=r(null),w=r("");let l=null,x=null;const y=r(null),A=()=>{l=new H.Terminal({cursorBlink:!0,fontSize:14,fontFamily:'Menlo, Monaco, "Courier New", monospace',theme:{background:"#0f172a",foreground:"#e2e8f0"}}),x=new W.FitAddon,l.loadAddon(x),l.open(y.value),x.fit(),l.write(`\x1B[38;5;244mResult will appear here...\x1B[0m\r
`)};let b=null;const C=o=>new Promise((e,s)=>{if(window.OCTAVE){e();return}const a=document.createElement("script");a.src=o,a.onload=e,a.onerror=s,document.head.appendChild(a)}),k=async()=>{n.value=!0,w.value=u("tools.code-playground.common.loading")||"Loading Octave...";try{const o="/tools/",e=`${o.endsWith("/")?o:o+"/"}octave-wasm/octave.js`;if(await C(e),!window.OCTAVE)throw new Error("Octave script loaded but OCTAVE global not found.");window.Module={locateFile:s=>`${o.endsWith("/")?o:o+"/"}octave-wasm/${s}`,print:s=>{l&&l.write(s+`\r
`)},printErr:s=>{l&&l.write(`\x1B[31m${s}\x1B[0m\r
`)},postRun:()=>{if(window.Module.execute_interp)try{window.Module.execute_interp(),console.log("Octave interpreter initialized")}catch(s){console.error("Failed to initialize interpreter:",s)}m.value=!0,n.value=!1,w.value="",console.log("Octave Ready")}},b=await window.OCTAVE(window.Module)}catch(o){w.value=`Failed to load Octave: ${o.message}`,n.value=!1,console.error(o)}},B=async()=>{if(!m.value||!b)return;n.value=!0,p.value=null,l.clear();const o=performance.now();try{b.eval_string(f.value);const e=performance.now();p.value=(e-o).toFixed(2)}catch(e){l.write(`\x1B[31mError: ${e.message}\x1B[0m\r
`)}finally{n.value=!1}},E=()=>{l.clear(),p.value=null};O(async()=>{A(),await k(),window.addEventListener("resize",_)}),V(()=>{l&&l.dispose(),window.removeEventListener("resize",_)});const _=()=>{x&&x.fit()};return(o,e)=>(d(),i("div",q,[t("div",D,[t("div",I,[t("div",P,[e[2]||(e[2]=t("svg",{class:"w-5 h-5 text-orange-500",viewBox:"0 0 128 128",fill:"currentColor"},[t("path",{d:"M123.965 91.902c-7.246-18.297-13.262-37.058-20.184-55.476-3.054-7.84-6.047-15.746-10.215-23.082-1.656-2.633-3.238-5.528-5.953-7.215a4.013 4.013 0 00-2.222-.606c-1.27.028-2.536.594-3.504 1.415-3.645 2.886-5.805 7.082-8.227 10.949-4.277 7.172-8.789 14.687-15.941 19.347-3.36 2.371-7.762 2.63-11 5.172-4.43 3.34-7.442 8.078-11.074 12.184-.829.988-2.11 1.383-3.227 1.918C21.578 60.93 10.738 65.336 0 69.98c9.09 7.032 18.777 13.29 28.05 20.079 2.544-.504 5.098-1.547 7.72-1.082 4.16 1.3 6.597 5.285 8.503 8.93 3.875 7.94 6.676 16.323 9.813 24.57 5.246-.375 9.969-3.079 14.027-6.258 7.809-6.324 13.758-14.5 20.305-22.047 3.14-3.3 6.34-7.23 11.05-8.149 4.762-1.152 9.864.555 13.395 3.836 4.957 4.43 9.344 9.551 15.137 12.942-.777-3.836-2.645-7.278-4.035-10.899zM42.96 79.012c-4.57 2.703-9.426 4.93-14.176 7.289-7.457-4.996-14.723-10.29-22.05-15.465 9.878-4.328 19.91-8.348 29.917-12.387 4.746 3.703 9.637 7.223 14.383 10.926-2.23 3.563-4.914 6.871-8.074 9.637zm10.168-12.414C48.414 63.058 43.64 59.609 39 55.977c2.977-4.055 6.238-7.977 10.14-11.172 2.587-1.657 5.743-2.117 8.426-3.61 6.368-3.18 10.711-9.011 14.86-14.582-5.317 13.805-10.992 27.664-19.297 39.985zm0 0"})],-1)),e[3]||(e[3]=t("span",{class:"font-bold text-white"},"Octave",-1)),T(t("select",{"onUpdate:modelValue":e[0]||(e[0]=s=>h.value=s),class:"ml-2 bg-slate-700 text-xs text-white border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-orange-500"},[(d(),i(L,null,S(v,(s,a)=>t("option",{key:a,value:a},c(s.name),9,G)),64))],512),[[F,h.value]]),m.value?(d(),i("span",J,c(g(u)("tools.code-playground.common.ready")),1)):(d(),i("span",K,c(w.value||"Loading..."),1))]),t("button",{onClick:B,disabled:n.value||!m.value,class:R(["px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2",n.value||!m.value?"bg-slate-600 text-slate-400 cursor-not-allowed":"bg-orange-600 hover:bg-orange-500 text-white"])},[n.value?(d(),i("svg",X,[...e[4]||(e[4]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"},null,-1)])])):(d(),i("svg",Y,[...e[5]||(e[5]=[t("path",{d:"M8 5v14l11-7z"},null,-1)])])),$(" "+c(n.value?"Running...":g(u)("tools.code-playground.common.run")),1)],10,Q)]),t("div",Z,[j(U,{modelValue:f.value,"onUpdate:modelValue":e[1]||(e[1]=s=>f.value=s),language:"matlab",theme:"vs-dark",height:"100%",minimap:!1},null,8,["modelValue"])])]),t("div",ee,[t("div",te,[t("div",oe,[t("span",se,c(g(u)("tools.code-playground.common.output")),1),p.value?(d(),i("span",le,c(p.value)+"ms",1)):N("",!0)]),t("button",{onClick:E,class:"text-xs text-slate-500 hover:text-white transition-colors"},c(g(u)("tools.code-playground.common.clear")),1)]),t("div",ne,[t("div",{ref_key:"terminalContainer",ref:y,class:"w-full h-full"},null,512)])])]))}};export{ue as default};
