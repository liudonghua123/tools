import{u as M,r,l as O,o as z,a as V,c as i,j as d,d as t,h as T,q as S,F,f as L,t as c,e as g,n as R,i as j,b as N,g as U}from"./index-B-wXu5Xs.js";import H from"./MonacoEditor-D01zuseN.js";import{x as $,a as q}from"./xterm-Btcyv0ds.js";import"./monaco-editor-CGO6wXTd.js";const W={class:"flex flex-col md:flex-row h-full"},D={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700"},I={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50"},P={class:"flex items-center gap-2"},G=["value"],J={key:0,class:"text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full"},K={key:1,class:"text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full"},Q=["disabled"],X={key:0,class:"w-4 h-4 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},Y={key:1,class:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24"},Z={class:"flex-1 min-h-0"},ee={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900 border-t md:border-t-0 md:border-l border-slate-700"},te={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700"},oe={class:"flex items-center gap-3"},se={class:"text-xs font-bold text-slate-400 uppercase tracking-wider"},le={key:0,class:"text-xs text-slate-500"},ne={class:"flex-1 min-h-0 p-2 bg-[#0f172a]"},ue={__name:"OctaveRunner",setup(ae){const{t:u}=M(),f={hello:{name:"Hello World",code:`disp("Hello, World!");
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
`}},h=r("hello"),v=r(f.hello.code);O(h,o=>{f[o]&&(v.value=f[o].code)});const n=r(!1),m=r(!1),p=r(null),w=r("");let s=null,x=null;const y=r(null),A=()=>{s=new $.Terminal({cursorBlink:!0,fontSize:14,fontFamily:'Menlo, Monaco, "Courier New", monospace',theme:{background:"#0f172a",foreground:"#e2e8f0"}}),x=new q.FitAddon,s.loadAddon(x),s.open(y.value),x.fit(),s.write(`\x1B[38;5;244mResult will appear here...\x1B[0m\r
`)};let b=null;const C=o=>new Promise((e,l)=>{if(window.OCTAVE){e();return}const a=document.createElement("script");a.src=o,a.onload=e,a.onerror=l,document.head.appendChild(a)}),k=async()=>{n.value=!0,w.value=u("tools.code-playground.common.loading")||"Loading Octave...";try{const o="/tools/",e=`${o.endsWith("/")?o:o+"/"}octave-wasm/octave.js`;if(await C(e),!window.OCTAVE)throw new Error("Octave script loaded but OCTAVE global not found.");window.Module={print:l=>{s&&s.write(l+`\r
`)},printErr:l=>{s&&s.write(`\x1B[31m${l}\x1B[0m\r
`)},postRun:()=>{if(window.Module.execute_interp)try{window.Module.execute_interp(),console.log("Octave interpreter initialized")}catch(l){console.error("Failed to initialize interpreter:",l)}m.value=!0,n.value=!1,w.value="",console.log("Octave Ready")}},b=await window.OCTAVE(window.Module)}catch(o){w.value=`Failed to load Octave: ${o.message}`,n.value=!1,console.error(o)}},B=async()=>{if(!m.value||!b)return;n.value=!0,p.value=null,s.clear();const o=performance.now();try{b.eval_string(v.value);const e=performance.now();p.value=(e-o).toFixed(2)}catch(e){s.write(`\x1B[31mError: ${e.message}\x1B[0m\r
`)}finally{n.value=!1}},E=()=>{s.clear(),p.value=null};z(async()=>{A(),await k(),window.addEventListener("resize",_)}),V(()=>{s&&s.dispose(),window.removeEventListener("resize",_)});const _=()=>{x&&x.fit()};return(o,e)=>(d(),i("div",W,[t("div",D,[t("div",I,[t("div",P,[e[2]||(e[2]=t("svg",{class:"w-5 h-5 text-orange-500",viewBox:"0 0 24 24",fill:"currentColor"},[t("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"}),t("text",{x:"12",y:"16","text-anchor":"middle","font-size":"12","font-weight":"bold",fill:"#1e293b"},"O")],-1)),e[3]||(e[3]=t("span",{class:"font-bold text-white"},"Octave",-1)),T(t("select",{"onUpdate:modelValue":e[0]||(e[0]=l=>h.value=l),class:"ml-2 bg-slate-700 text-xs text-white border-none rounded px-2 py-1 outline-none focus:ring-1 focus:ring-orange-500"},[(d(),i(F,null,L(f,(l,a)=>t("option",{key:a,value:a},c(l.name),9,G)),64))],512),[[S,h.value]]),m.value?(d(),i("span",J,c(g(u)("tools.code-playground.common.ready")),1)):(d(),i("span",K,c(w.value||"Loading..."),1))]),t("button",{onClick:B,disabled:n.value||!m.value,class:R(["px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2",n.value||!m.value?"bg-slate-600 text-slate-400 cursor-not-allowed":"bg-orange-600 hover:bg-orange-500 text-white"])},[n.value?(d(),i("svg",X,[...e[4]||(e[4]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"},null,-1)])])):(d(),i("svg",Y,[...e[5]||(e[5]=[t("path",{d:"M8 5v14l11-7z"},null,-1)])])),j(" "+c(n.value?"Running...":g(u)("tools.code-playground.common.run")),1)],10,Q)]),t("div",Z,[N(H,{modelValue:v.value,"onUpdate:modelValue":e[1]||(e[1]=l=>v.value=l),language:"matlab",theme:"vs-dark",height:"100%",minimap:!1},null,8,["modelValue"])])]),t("div",ee,[t("div",te,[t("div",oe,[t("span",se,c(g(u)("tools.code-playground.common.output")),1),p.value?(d(),i("span",le,c(p.value)+"ms",1)):U("",!0)]),t("button",{onClick:E,class:"text-xs text-slate-500 hover:text-white transition-colors"},c(g(u)("tools.code-playground.common.clear")),1)]),t("div",ne,[t("div",{ref_key:"terminalContainer",ref:y,class:"w-full h-full"},null,512)])])]))}};export{ue as default};
