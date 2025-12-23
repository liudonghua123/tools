const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HtmlSandbox-CgBYNNyi.js","assets/index-BPhu3kKC.js","assets/monaco-editor-CIrctJzJ.js","assets/monaco-editor-Ys5nfKlh.css","assets/index-DHb5UOI4.css","assets/MonacoEditor-C0fqLfyw.js","assets/MonacoEditor-Ds3ou6sA.css","assets/MarkdownPreview-CqpYB-4O.js","assets/markdown-C78r6xLZ.js","assets/MarkdownPreview-D6ouO8gz.css","assets/PythonRunner-D3CF0PAa.js","assets/PhpRunner-strVbRdL.js","assets/SqliteRunner-B9DlweYV.js"])))=>i.map(i=>d[i]);
import{_ as p}from"./monaco-editor-CIrctJzJ.js";import{u as N,r as y,k as O,o as z,l as U,c as s,g as C,d as t,t as v,e as i,F as E,f as V,m as f,p as a,S as h,h as S,q as M,n as I,j as l,i as W,b,s as g}from"./index-BPhu3kKC.js";const J={key:0,class:"mb-6 text-center"},Y={class:"text-3xl font-black text-slate-900 dark:text-white tracking-tight"},G={class:"mt-2 text-slate-500 font-medium"},$={class:"flex justify-start md:justify-center gap-2 mb-4 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide px-1"},K=["onClick"],Q={key:0,class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},X={key:1,class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},Z={key:2,class:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24"},ee={key:3,class:"w-4 h-4",viewBox:"0 0 24 24",fill:"currentColor"},te={key:4,class:"w-4 h-4",viewBox:"0 0 24 24",fill:"currentColor"},le={key:5,class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},oe=["title"],se={key:0,class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},ae={key:1,class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},re={class:"flex-1 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl min-h-0"},ne={key:5,class:"flex flex-col h-full"},ie={class:"flex items-center gap-6 px-4 py-3 border-b border-slate-700 bg-slate-800/50"},de={class:"flex items-center gap-3"},ue={class:"text-sm text-slate-400 font-medium"},ce=["value"],me={class:"flex items-center gap-3"},pe=["value"],ve={class:"flex-1 min-h-0"},ge={__name:"index",setup(fe){const{t:n}=N(),T=g(()=>p(()=>import("./HtmlSandbox-CgBYNNyi.js"),__vite__mapDeps([0,1,2,3,4,5,6]))),A=g(()=>p(()=>import("./MarkdownPreview-CqpYB-4O.js"),__vite__mapDeps([7,8,2,3,5,1,4,6,9]))),D=g(()=>p(()=>import("./PythonRunner-D3CF0PAa.js"),__vite__mapDeps([10,5,2,3,1,4,6]))),P=g(()=>p(()=>import("./PhpRunner-strVbRdL.js"),__vite__mapDeps([11,2,3,5,1,4,6]))),q=g(()=>p(()=>import("./SqliteRunner-B9DlweYV.js"),__vite__mapDeps([12,5,2,3,1,4,6]))),B=g(()=>p(()=>import("./MonacoEditor-C0fqLfyw.js"),__vite__mapDeps([5,2,3,1,4,6]))),r=y("sandbox"),m=y(!1),L=()=>{m.value=!m.value},R=O(()=>[{id:"sandbox",icon:"web",label:n("tools.code-playground.modes.sandbox")},{id:"markdown",icon:"markdown",label:n("tools.code-playground.modes.markdown")},{id:"python",icon:"python",label:n("tools.code-playground.modes.python")},{id:"php",icon:"php",label:n("tools.code-playground.modes.php")},{id:"sqlite",icon:"sqlite",label:n("tools.code-playground.modes.sqlite")},{id:"editor",icon:"code",label:n("tools.code-playground.modes.editor")}]),d=y("javascript"),w=y(`// Write your code here
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
`),F=[{id:"javascript",label:"JavaScript"},{id:"typescript",label:"TypeScript"},{id:"json",label:"JSON"},{id:"html",label:"HTML"},{id:"css",label:"CSS"},{id:"python",label:"Python"}],x={javascript:{hello:`// Hello World
function sayHello() {
  console.log("Hello, World!");
}
sayHello();`,array:`// Array Operations
const numbers = [1, 2, 3, 4, 5];
const squared = numbers.map(x => x * x);
console.log('Squared:', squared);

const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log('Sum:', sum);`,async:`// Async/Await
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}`,class:`// Classes
class Calculator {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }
  
  add(n) {
    this.value += n;
    return this;
  }
  
  getResult() {
    return this.value;
  }
}

const result = new Calculator(10).add(5).getResult(); // 15`},typescript:{interface:`// Interface
interface User {
  id: number;
  name: string;
  email?: string;
}

const user: User = {
  id: 1,
  name: "John Doe"
};

function printUser(u: User) {
  console.log(u.name);
}`,generics:`// Generics
function wrap<T>(value: T): { value: T } {
  return { value };
}

const wrappedNumber = wrap(42);
const wrappedString = wrap("Hello");`,enum:`// Enums
enum Status {
  Pending = "PENDING",
  Active = "ACTIVE",
  Inactive = "INACTIVE"
}

const currentStatus: Status = Status.Active;`},json:{config:`{
  "name": "my-project",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "vue": "^3.0.0"
  }
}`,data:`[
  {
    "id": 1,
    "name": "Item 1",
    "active": true
  },
  {
    "id": 2,
    "name": "Item 2",
    "active": false
  }
]`},html:{basic:`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <header>
    <h1>Welcome</h1>
  </header>
  <main>
    <p>This is a paragraph.</p>
  </main>
</body>
</html>`,form:`<form action="/submit" method="post">
  <label for="name">Name:</label>
  <input type="text" id="name" name="name" required>
  
  <label for="email">Email:</label>
  <input type="email" id="email" name="email">
  
  <button type="submit">Submit</button>
</form>`},css:{flexbox:`.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  gap: 1rem;
}

.item {
  flex: 1;
  padding: 1rem;
}`,grid:`.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}`,animation:`@keyframes slideIn {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.card {
  animation: slideIn 0.3s ease-out;
}`},python:{basics:`# Function basics
def greet(name: str) -> str:
    return f"Hello, {name}"

print(greet("World"))`,list_comp:`# List Comprehension
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers if x % 2 != 0]
print(squares) # [1, 9, 25]`,class:`# Classes
class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return f"{self.name} says Woof!"

my_dog = Dog("Rex")
print(my_dog.bark())`}},u=y(""),H=()=>{_()},_=()=>{const c=x[d.value];if(c){const e=Object.keys(c)[0];e&&(u.value=e,j())}else u.value=""},j=()=>{var c;u.value&&((c=x[d.value])!=null&&c[u.value])&&(w.value=x[d.value][u.value])};return z(()=>{r.value==="editor"&&_()}),U(r,c=>{c==="editor"&&!u.value&&_()}),(c,e)=>(l(),s("div",{class:I(["flex flex-col animate-fade-in transition-all duration-300",m.value?"fixed inset-0 z-[9999] bg-slate-50 dark:bg-slate-950 p-4 h-screen":"h-[calc(100vh-180px)]"])},[m.value?C("",!0):(l(),s("div",J,[e[3]||(e[3]=t("div",{class:"inline-flex items-center justify-center p-4 bg-violet-100/50 dark:bg-violet-900/30 rounded-3xl mb-4 shadow-xl ring-4 ring-violet-50 dark:ring-violet-900/10"},[t("svg",{class:"w-10 h-10 text-violet-600 dark:text-violet-300",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"})])],-1)),t("h1",Y,v(i(n)("tools.code-playground.title")),1),t("p",G,v(i(n)("tools.code-playground.desc")),1)])),t("div",$,[(l(!0),s(E,null,V(R.value,o=>(l(),s("button",{key:o.id,onClick:k=>r.value=o.id,class:I(["px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2",r.value===o.id?"bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25":"bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"])},[o.icon==="web"?(l(),s("svg",Q,[...e[4]||(e[4]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"},null,-1)])])):o.icon==="markdown"?(l(),s("svg",X,[...e[5]||(e[5]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"},null,-1)])])):o.icon==="python"?(l(),s("svg",Z,[...e[6]||(e[6]=[t("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c3.94.49 7 3.85 7 7.93s-3.06 7.44-7 7.93V4.07z"},null,-1)])])):o.icon==="php"?(l(),s("svg",ee,[...e[7]||(e[7]=[t("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 15h-9v-2h9v2zm0-4h-9V9h9v4z"},null,-1)])])):o.icon==="sqlite"?(l(),s("svg",te,[...e[8]||(e[8]=[t("path",{d:"M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"},null,-1)])])):(l(),s("svg",le,[...e[9]||(e[9]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"},null,-1)])])),W(" "+v(o.label),1)],10,K))),128)),t("button",{onClick:L,class:"ml-2 p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-sm",title:m.value?"Exit Fullscreen":"Enter Fullscreen"},[m.value?(l(),s("svg",ae,[...e[11]||(e[11]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M9 9L4 4m0 0v4m0-4h4m12 0l-5 5m5-5v4m0-4h-4M9 15l-5 5m0 0v-4m0 4h4m11 0l-5-5m5 5v-4m0 4h-4"},null,-1)])])):(l(),s("svg",se,[...e[10]||(e[10]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"},null,-1)])]))],8,oe)]),t("div",re,[r.value==="sandbox"?(l(),f(h,{key:0},{default:a(()=>[b(i(T))]),fallback:a(()=>[...e[12]||(e[12]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="markdown"?(l(),f(h,{key:1},{default:a(()=>[b(i(A))]),fallback:a(()=>[...e[13]||(e[13]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="python"?(l(),f(h,{key:2},{default:a(()=>[b(i(D))]),fallback:a(()=>[...e[14]||(e[14]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="php"?(l(),f(h,{key:3},{default:a(()=>[b(i(P))]),fallback:a(()=>[...e[15]||(e[15]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="sqlite"?(l(),f(h,{key:4},{default:a(()=>[b(i(q))]),fallback:a(()=>[...e[16]||(e[16]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="editor"?(l(),s("div",ne,[t("div",ie,[t("div",de,[t("label",ue,v(i(n)("editor.language"))+":",1),S(t("select",{"onUpdate:modelValue":e[0]||(e[0]=o=>d.value=o),onChange:H,class:"px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500"},[(l(),s(E,null,V(F,o=>t("option",{key:o.id,value:o.id},v(o.label),9,ce)),64))],544),[[M,d.value]])]),t("div",me,[e[17]||(e[17]=t("label",{class:"text-sm text-slate-400 font-medium"},"Example:",-1)),S(t("select",{"onUpdate:modelValue":e[1]||(e[1]=o=>u.value=o),onChange:j,class:"px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500 min-w-[120px]"},[x[d.value]?(l(!0),s(E,{key:0},V(x[d.value],(o,k)=>(l(),s("option",{key:k,value:k},v(k.charAt(0).toUpperCase()+k.slice(1).replace("_"," ")),9,pe))),128)):C("",!0)],544),[[M,u.value]])])]),t("div",ve,[(l(),f(h,null,{default:a(()=>[b(i(B),{modelValue:w.value,"onUpdate:modelValue":e[2]||(e[2]=o=>w.value=o),language:d.value,theme:"vs-dark",height:"100%"},null,8,["modelValue","language"])]),fallback:a(()=>[...e[18]||(e[18]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1}))])])):C("",!0)])],2))}};export{ge as default};
