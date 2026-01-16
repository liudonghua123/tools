import{r as n,m as N,o as U,c as s,j as l,d as t,F as C,f as k,n as V,t as g,h as p,i as M,A as D,C as v,b,g as H}from"./index-Q3LHmwEb.js";import w from"./MonacoEditor-FjlAfSZ3.js";import"./monaco-editor-DrHUTMTD.js";const L={class:"flex flex-col h-full"},O={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50"},$={class:"flex items-center gap-2"},z=["onClick"],F={class:"flex items-center gap-3"},J={class:"flex items-center gap-2 text-sm text-slate-400"},P={class:"flex-1 flex flex-col md:flex-row min-h-0"},A={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700"},Y={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col"},I={class:"flex-1 bg-white relative"},W={class:"h-40 bg-slate-900 border-t border-slate-700 flex flex-col"},q={class:"flex-1 overflow-y-auto p-2 font-mono text-sm space-y-1"},G={class:"text-slate-500 text-xs"},K={key:0,class:"text-red-400"},Q={key:1,class:"text-yellow-400"},X={key:2,class:"text-slate-500"},Z={class:"flex-1"},ee={key:0,class:"text-slate-500 italic"},ae={__name:"HtmlSandbox",props:{autoRun:{type:Boolean,default:!0},debounceMs:{type:Number,default:500}},emits:["run","console"],setup(R,{emit:j}){const d=R,y=j,c=n(`<div class="container">
  <h1>Hello World!</h1>
  <p>Edit the code and see the result.</p>
  <button id="btn">Click Me</button>
</div>`),u=n(`.container {
  font-family: system-ui, sans-serif;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #6366f1;
  margin-bottom: 1rem;
}

button {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
}`),m=n(`// JavaScript code here
document.getElementById('btn').addEventListener('click', function() {
  console.log('Button clicked!');
  alert('Hello from JavaScript!');
});

console.log('Page loaded!');`),r=n([]),f=n(null),i=n("html"),S=()=>`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>${u.value}</style>
</head>
<body>
  ${c.value}
  <script>
    // Override console methods to send to parent
    (function() {
      const originalConsole = {};
      ['log', 'warn', 'error', 'info'].forEach(method => {
        originalConsole[method] = console[method];
        console[method] = function(...args) {
          originalConsole[method].apply(console, args);
          window.parent.postMessage({
            type: 'console',
            method: method,
            args: args.map(arg => {
              try {
                return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
              } catch (e) {
                return String(arg);
              }
            })
          }, '*');
        };
      });
      
      // Capture errors
      window.onerror = function(msg, url, line, col, error) {
        window.parent.postMessage({
          type: 'console',
          method: 'error',
          args: [msg + ' (line ' + line + ')']
        }, '*');
      };
    })();
  <\/script>
  <script>${m.value}<\/script>
</body>
</html>`,h=()=>{r.value=[],f.value&&(f.value.srcdoc=S()),y("run")},E=a=>{if(a.data&&a.data.type==="console"){const{method:o,args:e}=a.data;r.value.push({type:o,message:e.join(" "),time:new Date().toLocaleTimeString()}),y("console",{method:o,args:e})}},T=()=>{r.value=[]};let x=null;N([c,u,m],()=>{d.autoRun&&(x&&clearTimeout(x),x=setTimeout(h,d.debounceMs))}),U(()=>{window.addEventListener("message",E),h()});const B=a=>{switch(a){case"error":return"text-red-400";case"warn":return"text-yellow-400";case"info":return"text-blue-400";default:return"text-slate-300"}};return(a,o)=>(l(),s("div",L,[t("div",O,[t("div",$,[(l(),s(C,null,k(["html","css","js"],e=>t("button",{key:e,onClick:_=>i.value=e,class:V(["px-4 py-1.5 rounded-lg font-medium text-sm transition-all uppercase",i.value===e?"bg-violet-600 text-white":"text-slate-400 hover:text-white hover:bg-slate-700"])},g(e),11,z)),64))]),t("div",F,[t("label",J,[p(t("input",{type:"checkbox","onUpdate:modelValue":o[0]||(o[0]=e=>d.autoRun=e),class:"rounded"},null,512),[[D,d.autoRun]]),o[4]||(o[4]=M(" Auto Run ",-1))]),t("button",{onClick:h,class:"px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"},[...o[5]||(o[5]=[t("svg",{class:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24"},[t("path",{d:"M8 5v14l11-7z"})],-1),M(" Run ",-1)])])])]),t("div",P,[t("div",A,[p(b(w,{modelValue:c.value,"onUpdate:modelValue":o[1]||(o[1]=e=>c.value=e),language:"html",height:"100%",minimap:!1},null,8,["modelValue"]),[[v,i.value==="html"]]),p(b(w,{modelValue:u.value,"onUpdate:modelValue":o[2]||(o[2]=e=>u.value=e),language:"css",height:"100%",minimap:!1},null,8,["modelValue"]),[[v,i.value==="css"]]),p(b(w,{modelValue:m.value,"onUpdate:modelValue":o[3]||(o[3]=e=>m.value=e),language:"javascript",height:"100%",minimap:!1},null,8,["modelValue"]),[[v,i.value==="js"]])]),t("div",Y,[t("div",I,[t("iframe",{ref_key:"iframeRef",ref:f,class:"w-full h-full border-0",sandbox:"allow-scripts allow-modals",title:"Preview"},null,512)]),t("div",W,[t("div",{class:"flex items-center justify-between px-3 py-2 border-b border-slate-700"},[o[6]||(o[6]=t("span",{class:"text-xs font-bold text-slate-400 uppercase tracking-wider"},"Console",-1)),t("button",{onClick:T,class:"text-xs text-slate-500 hover:text-white transition-colors"}," Clear ")]),t("div",q,[(l(!0),s(C,null,k(r.value,(e,_)=>(l(),s("div",{key:_,class:V(["flex items-start gap-2",B(e.type)])},[t("span",G,g(e.time),1),e.type==="error"?(l(),s("span",K,"✗")):e.type==="warn"?(l(),s("span",Q,"⚠")):(l(),s("span",X,"›")),t("span",Z,g(e.message),1)],2))),128)),r.value.length===0?(l(),s("div",ee," Console output will appear here... ")):H("",!0)])])])])]))}};export{ae as default};
