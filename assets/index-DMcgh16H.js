const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/HtmlSandbox-C-j8u-vh.js","assets/index-C_Pav1rr.js","assets/monaco-editor-CGO6wXTd.js","assets/monaco-editor-C4Ekkcmw.css","assets/index-NjRd2AAe.css","assets/MonacoEditor-BS-3xDAw.js","assets/MonacoEditor-Ds3ou6sA.css","assets/MarkdownPreview-D5bakzZD.js","assets/markdown-BK1wOLk7.js","assets/MarkdownPreview-D6ouO8gz.css","assets/PythonRunner-Crj8-Nl0.js","assets/PhpRunner-DsIyk75e.js","assets/SqliteRunner-8njn05W0.js","assets/JavaRunner-MJKI4HUw.js","assets/RubyRunner-DbuzdZKk.js"])))=>i.map(i=>d[i]);
import{_ as m}from"./monaco-editor-CGO6wXTd.js";import{u as N,r as k,k as U,o as W,l as J,c as o,g as L,d as t,t as g,e as i,F as C,f as j,m as p,p as a,S as v,h as V,q as M,n as S,j as l,i as Y,b as f,s as b}from"./index-C_Pav1rr.js";const Z={key:0,class:"mb-6 text-center"},G={class:"text-3xl font-black text-slate-900 dark:text-white tracking-tight"},$={class:"mt-2 text-slate-500 font-medium"},K={class:"flex justify-start md:justify-center gap-2 mb-4 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide px-1"},Q=["onClick"],X={key:0,class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},ee={key:1,class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},te={key:2,class:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24"},le={key:3,class:"w-4 h-4",viewBox:"0 0 24 24",fill:"currentColor"},se={key:4,class:"w-4 h-4",viewBox:"0 0 24 24",fill:"currentColor"},oe={key:5,class:"w-4 h-4",viewBox:"0 0 24 24",fill:"currentColor"},ae={key:6,class:"w-4 h-4",viewBox:"0 0 24 24",fill:"currentColor"},re={key:7,class:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},ne=["title"],ie={key:0,class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},de={key:1,class:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},ue={class:"flex-1 bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl min-h-0"},ce={key:7,class:"flex flex-col h-full"},me={class:"flex items-center gap-6 px-4 py-3 border-b border-slate-700 bg-slate-800/50"},pe={class:"flex items-center gap-3"},ve={class:"text-sm text-slate-400 font-medium"},fe=["value"],be={class:"flex items-center gap-3"},he=["value"],ge={class:"flex-1 min-h-0"},we={__name:"index",setup(xe){const{t:n}=N(),I=b(()=>m(()=>import("./HtmlSandbox-C-j8u-vh.js"),__vite__mapDeps([0,1,2,3,4,5,6]))),A=b(()=>m(()=>import("./MarkdownPreview-D5bakzZD.js"),__vite__mapDeps([7,8,2,3,5,1,4,6,9]))),R=b(()=>m(()=>import("./PythonRunner-Crj8-Nl0.js"),__vite__mapDeps([10,5,2,3,1,4,6]))),T=b(()=>m(()=>import("./PhpRunner-DsIyk75e.js"),__vite__mapDeps([11,2,3,5,1,4,6]))),D=b(()=>m(()=>import("./SqliteRunner-8njn05W0.js"),__vite__mapDeps([12,5,2,3,1,4,6]))),B=b(()=>m(()=>import("./JavaRunner-MJKI4HUw.js"),__vite__mapDeps([13,1,2,3,4,5,6]))),H=b(()=>m(()=>import("./RubyRunner-DbuzdZKk.js"),__vite__mapDeps([14,1,2,3,4,5,6]))),P=b(()=>m(()=>import("./MonacoEditor-BS-3xDAw.js"),__vite__mapDeps([5,2,3,1,4,6]))),r=k("sandbox"),h=k(!1),z=()=>{h.value=!h.value},q=U(()=>[{id:"sandbox",icon:"web",label:n("tools.code-playground.modes.sandbox")},{id:"markdown",icon:"markdown",label:n("tools.code-playground.modes.markdown")},{id:"python",icon:"python",label:n("tools.code-playground.modes.python")},{id:"php",icon:"php",label:n("tools.code-playground.modes.php")},{id:"java",icon:"java",label:n("tools.code-playground.modes.java")},{id:"ruby",icon:"ruby",label:n("tools.code-playground.modes.ruby")},{id:"sqlite",icon:"sqlite",label:n("tools.code-playground.modes.sqlite")},{id:"editor",icon:"code",label:n("tools.code-playground.modes.editor")}]),d=k("javascript"),w=k(`// Write your code here
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
`),O=[{id:"javascript",label:"JavaScript"},{id:"typescript",label:"TypeScript"},{id:"json",label:"JSON"},{id:"html",label:"HTML"},{id:"css",label:"CSS"},{id:"python",label:"Python"},{id:"ruby",label:"Ruby"}],x={javascript:{hello:`// Hello World
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
print(my_dog.bark())`},ruby:{basics:`# Ruby basics
def greet(name)
  "Hello, #{name}!"
end

puts greet("World")`,blocks:`# Iterators and Blocks
[1, 2, 3, 4, 5].each do |n|
  puts "Number: #{n}" if n.odd?
end`,class:`# Classes
class Animal
  attr_reader :name
  def initialize(name)
    @name = name
  end
  def speak
    "#{@name} says generic sound"
  end
end

puts Animal.new("Leo").speak`}},u=k(""),F=()=>{_()},_=()=>{const c=x[d.value];if(c){const e=Object.keys(c)[0];e&&(u.value=e,E())}else u.value=""},E=()=>{var c;u.value&&((c=x[d.value])!=null&&c[u.value])&&(w.value=x[d.value][u.value])};return W(()=>{r.value==="editor"&&_()}),J(r,c=>{c==="editor"&&!u.value&&_()}),(c,e)=>(l(),o("div",{class:S(["flex flex-col animate-fade-in transition-all duration-300",h.value?"fixed inset-0 z-[9999] bg-slate-50 dark:bg-slate-950 p-4 h-screen":"h-[calc(100vh-180px)]"])},[h.value?L("",!0):(l(),o("div",Z,[e[3]||(e[3]=t("div",{class:"inline-flex items-center justify-center p-4 bg-violet-100/50 dark:bg-violet-900/30 rounded-3xl mb-4 shadow-xl ring-4 ring-violet-50 dark:ring-violet-900/10"},[t("svg",{class:"w-10 h-10 text-violet-600 dark:text-violet-300",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"})])],-1)),t("h1",G,g(i(n)("tools.code-playground.title")),1),t("p",$,g(i(n)("tools.code-playground.desc")),1)])),t("div",K,[(l(!0),o(C,null,j(q.value,s=>(l(),o("button",{key:s.id,onClick:y=>r.value=s.id,class:S(["px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2",r.value===s.id?"bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg shadow-violet-500/25":"bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"])},[s.icon==="web"?(l(),o("svg",X,[...e[4]||(e[4]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"},null,-1)])])):s.icon==="markdown"?(l(),o("svg",ee,[...e[5]||(e[5]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"},null,-1)])])):s.icon==="python"?(l(),o("svg",te,[...e[6]||(e[6]=[t("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c3.94.49 7 3.85 7 7.93s-3.06 7.44-7 7.93V4.07z"},null,-1)])])):s.icon==="php"?(l(),o("svg",le,[...e[7]||(e[7]=[t("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 15h-9v-2h9v2zm0-4h-9V9h9v4z"},null,-1)])])):s.icon==="sqlite"?(l(),o("svg",se,[...e[8]||(e[8]=[t("path",{d:"M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"},null,-1)])])):s.icon==="java"?(l(),o("svg",oe,[...e[9]||(e[9]=[t("path",{d:"M8 16c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4H8v4zm-2 0v-4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2h-2c-1.1 0-2-.9-2-2zm10-8c0-1.1-.9-2-2-2H10c-1.1 0-2 .9-2 2v2h8V8z"},null,-1),t("path",{d:"M7 3v2h10V3H7zm0 14c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2H7z",opacity:".3"},null,-1)])])):s.icon==="ruby"?(l(),o("svg",ae,[...e[10]||(e[10]=[t("path",{d:"M12 2L3.5 6.5L2 12L3.5 17.5L12 22L20.5 17.5L22 12L20.5 6.5L12 2ZM12 4.5L18.5 8L19.5 12L18.5 16L12 19.5L5.5 16L4.5 12L5.5 8L12 4.5Z"},null,-1),t("path",{d:"M12 7.5L8.5 10.5L9.5 14.5L12 16.5L14.5 14.5L15.5 10.5L12 7.5Z",opacity:".5"},null,-1)])])):(l(),o("svg",re,[...e[11]||(e[11]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"},null,-1)])])),Y(" "+g(s.label),1)],10,Q))),128)),t("button",{onClick:z,class:"ml-2 p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all shadow-sm",title:h.value?"Exit Fullscreen":"Enter Fullscreen"},[h.value?(l(),o("svg",de,[...e[13]||(e[13]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M9 9L4 4m0 0v4m0-4h4m12 0l-5 5m5-5v4m0-4h-4M9 15l-5 5m0 0v-4m0 4h4m11 0l-5-5m5 5v-4m0 4h-4"},null,-1)])])):(l(),o("svg",ie,[...e[12]||(e[12]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"},null,-1)])]))],8,ne)]),t("div",ue,[r.value==="sandbox"?(l(),p(v,{key:0},{default:a(()=>[f(i(I))]),fallback:a(()=>[...e[14]||(e[14]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="markdown"?(l(),p(v,{key:1},{default:a(()=>[f(i(A))]),fallback:a(()=>[...e[15]||(e[15]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="python"?(l(),p(v,{key:2},{default:a(()=>[f(i(R))]),fallback:a(()=>[...e[16]||(e[16]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="php"?(l(),p(v,{key:3},{default:a(()=>[f(i(T))]),fallback:a(()=>[...e[17]||(e[17]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="sqlite"?(l(),p(v,{key:4},{default:a(()=>[f(i(D))]),fallback:a(()=>[...e[18]||(e[18]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="java"?(l(),p(v,{key:5},{default:a(()=>[f(i(B))]),fallback:a(()=>[...e[19]||(e[19]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="ruby"?(l(),p(v,{key:6},{default:a(()=>[f(i(H))]),fallback:a(()=>[...e[20]||(e[20]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1})):r.value==="editor"?(l(),o("div",ce,[t("div",me,[t("div",pe,[t("label",ve,g(i(n)("editor.language"))+":",1),V(t("select",{"onUpdate:modelValue":e[0]||(e[0]=s=>d.value=s),onChange:F,class:"px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500"},[(l(),o(C,null,j(O,s=>t("option",{key:s.id,value:s.id},g(s.label),9,fe)),64))],544),[[M,d.value]])]),t("div",be,[e[21]||(e[21]=t("label",{class:"text-sm text-slate-400 font-medium"},"Example:",-1)),V(t("select",{"onUpdate:modelValue":e[1]||(e[1]=s=>u.value=s),onChange:E,class:"px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-violet-500 min-w-[120px]"},[x[d.value]?(l(!0),o(C,{key:0},j(x[d.value],(s,y)=>(l(),o("option",{key:y,value:y},g(y.charAt(0).toUpperCase()+y.slice(1).replace("_"," ")),9,he))),128)):L("",!0)],544),[[M,u.value]])])]),t("div",ge,[(l(),p(v,null,{default:a(()=>[f(i(P),{modelValue:w.value,"onUpdate:modelValue":e[2]||(e[2]=s=>w.value=s),language:d.value,theme:"vs-dark",height:"100%"},null,8,["modelValue","language"])]),fallback:a(()=>[...e[22]||(e[22]=[t("div",{class:"flex items-center justify-center h-full"},[t("div",{class:"w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"})],-1)])]),_:1}))])])):L("",!0)])],2))}};export{we as default};
