import{_ as E,u as R,r as c,o as z,a as H,c as s,j as n,d as e,g as b,t as i,e as m,h as L,q as N,n as G,i as T,b as U,F as $,f as A}from"./index-CpdbSi_Z.js";import D from"./MonacoEditor-M7Go4pjs.js";import"./monaco-editor-CGO6wXTd.js";const I={class:"flex flex-col md:flex-row h-full"},O={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700"},W={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50"},q={class:"flex items-center gap-4"},J={class:"flex items-center gap-2"},K={key:0,class:"text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full"},Q={key:1,class:"text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full"},X={class:"relative group"},Y=["disabled"],Z={key:0,class:"w-4 h-4 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},ee={key:1,class:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24"},te={class:"flex-1 min-h-0"},oe={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900"},se={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700"},ne={class:"flex items-center gap-3"},ae={class:"text-xs font-bold text-slate-400 uppercase tracking-wider"},le={key:0,class:"text-xs text-slate-500"},re={key:0,class:"flex-1 flex items-center justify-center"},ie={class:"text-center space-y-4"},ce={class:"text-slate-400"},de={key:1,class:"flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"},ue={key:0,class:"text-red-400"},me={key:1,class:"text-emerald-400"},pe={class:"whitespace-pre-wrap"},fe={key:0,class:"text-slate-500 italic"},ve={__name:"GoRunner",emits:["output","error","ready"],setup(xe,{emit:P}){const{t:d}=R(),_=P,y={hello:`package main

import "fmt"

func main() {
    fmt.Println("Hello, Go Playground!")
}`,fibonacci:`package main

import "fmt"

func fibonacci(n int) int {
    if n <= 1 {
        return n
    }
    return fibonacci(n-1) + fibonacci(n-2)
}

func main() {
    fmt.Println("Fibonacci sequence (first 10):")
    for i := 0; i < 10; i++ {
        fmt.Printf("%d ", fibonacci(i))
    }
    fmt.Println()
}`,data_structures:`package main

import "fmt"

func main() {
    // Slices
    fruits := []string{"apple", "banana", "cherry"}
    fruits = append(fruits, "date")
    
    // Maps
    scores := map[string]int{
        "Alice": 95,
        "Bob":   88,
    }
    
    fmt.Println("Fruits:", fruits)
    fmt.Println("Scores:", scores)
    
    for name, score := range scores {
        fmt.Printf("%s scored %d\\n", name, score)
    }
}`,concurrency:`package main

import (
    "fmt"
    "time"
)

func say(s string) {
    for i := 0; i < 3; i++ {
        time.Sleep(100 * time.Millisecond)
        fmt.Println(s)
    }
}

func main() {
    fmt.Println("Starting goroutines...")
    go say("world")
    say("hello")
    time.Sleep(500 * time.Millisecond)
    fmt.Println("Done.")
}`},p=c(y.hello),r=c([]),l=c(!1),f=c(!1),v=c(""),u=c(null),x=c("hello");let h=null;const k=async()=>{if(!f.value){l.value=!0,v.value="Loading Go runtime...";try{const o="/tools/",t=`${o.endsWith("/")?o:o+"/"}go-wasm/`;if(await new Promise((C,V)=>{if(window.Go){C();return}const g=document.createElement("script");g.src=`${t}wasm_exec.js`,g.onload=C,g.onerror=()=>V(new Error("Failed to load wasm_exec.js")),document.head.appendChild(g)}),!window.Go)throw new Error("Go class not found after loading wasm_exec.js");h=new window.Go,v.value="Initializing Go interpreter...";const w=await(await fetch(`${t}main.wasm`)).arrayBuffer(),S=await WebAssembly.instantiate(w,h.importObject);h.run(S.instance),f.value=!0,_("ready")}catch(o){r.value.push({type:"error",message:`Failed to load Go runtime: ${o.message}`}),console.error(o)}finally{l.value=!1,v.value=""}}},M=async()=>{if(f.value||await k(),!window.runGoCode){r.value.push({type:"error",message:"Go interpreter not ready (runGoCode not found)"});return}r.value=[],u.value=null;try{const o=performance.now(),t=window.runGoCode(p.value),a=performance.now();u.value=(a-o).toFixed(2),t&&r.value.push({type:"log",message:t})}catch(o){r.value.push({type:"error",message:o.message}),_("error",o)}},j=()=>{y[x.value]&&(p.value=y[x.value])},B=()=>{r.value=[],u.value=null},F=o=>o==="error"?"text-red-400":"text-emerald-400";return z(()=>{k()}),H(()=>{}),(o,t)=>(n(),s("div",I,[e("div",O,[e("div",W,[e("div",q,[e("div",J,[t[2]||(t[2]=e("svg",{class:"w-5 h-5 text-cyan-400",viewBox:"0 0 128 128",fill:"currentColor"},[e("path",{d:"M128 54.4c.1 4.5-.6 9.1-2 13.4-2.6 7.6-7.8 13.5-15 17-6.2 3.1-13 4.5-19.9 4.3-10.4-.2-20-4.2-27.7-11.4l-11.2 11c5.2 4.9 11.2 8.7 17.8 11.1 9.8 3.5 20.3 4.9 30.7 4.1 11.1-.9 21.6-5.4 29.8-12.9 6.5-5.9 11-13.6 13-22.1 2.3-10.3 2.1-21-.8-31.2-3.1-11.2-9.4-21.2-18.1-28.7-10.3-8.8-23.3-13.7-36.8-13.8-14.8-.1-29.2 5.3-40.4 15.3-9.5 8.5-16.1 19.8-18.8 32-2.5 11.2-2 22.8 1.4 33.7 4 12.8 12.1 23.9 22.8 31.5 12.2 8.7 27 13.3 42 13 13.5-.3 26.6-4.6 37.4-12.5l-9.8-13.7c-7.2 5.1-15.8 7.9-24.6 8.1-10.4.3-20.6-2.9-28.6-9.5-6.5-5.3-11.2-12.7-13.2-20.8-2.3-9.3-2-19.1 1-28.1 3.5-10.1 10.6-18.3 19.9-23.2 8.2-4.3 17.5-6.4 26.9-6.1 12.1.4 23.6 5.8 31.8 14.8 6 6.5 9.7 14.8 10.6 23.6 1.1 9.4-.5 18.9-4.5 27.5-3.8 8.1-10 14.9-17.7 19.3-6 3.4-12.7 5.2-19.5 5.1-1.3 0-2.6-.1-3.9-.2l-2.4 16.4c2.1.2 4.2.4 6.3.4 10.5.1 20.9-2.7 29.9-8.1 11.1-6.6 19.7-16.7 24.3-28.8 3.9-10.3 5-21.4 3.2-32.2s-6.3-21.1-13.4-29.6c-10.5-11.8-25.5-18.8-41.2-19.3-17.1-.5-33.8 6.4-45.7 18.7-10.8 11.1-17.2 25.5-18.3 40.8-1.1 15.6 2.8 31.1 11 44.1 10 15.9 25.8 26.9 44 30.5 18.2 3.6 37.1.5 52.8-8.8 12.1-7.2 21.8-18 27.6-30.8 4.2-9.3 6.3-19.4 6-29.6l-16.4-.3z"})],-1)),t[3]||(t[3]=e("span",{class:"font-bold text-white"},"Go",-1)),f.value?(n(),s("span",K,i(m(d)("tools.code-playground.common.ready")),1)):l.value?b("",!0):(n(),s("span",Q,i(m(d)("tools.code-playground.common.not_loaded")),1))]),e("div",X,[L(e("select",{"onUpdate:modelValue":t[0]||(t[0]=a=>x.value=a),onChange:j,class:"appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"},[...t[4]||(t[4]=[e("option",{value:"hello"},"Hello World",-1),e("option",{value:"fibonacci"},"Fibonacci",-1),e("option",{value:"data_structures"},"Slices & Maps",-1),e("option",{value:"concurrency"},"Concurrency",-1)])],544),[[N,x.value]]),t[5]||(t[5]=e("div",{class:"absolute inset-y-0 right-1.5 flex items-center pointer-events-none text-slate-400"},[e("svg",{class:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M19 9l-7 7-7-7"})])],-1))])]),e("button",{onClick:M,disabled:l.value,class:G(["px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2",l.value?"bg-slate-600 text-slate-400 cursor-not-allowed":"bg-emerald-600 hover:bg-emerald-500 text-white"])},[l.value?(n(),s("svg",Z,[...t[6]||(t[6]=[e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"},null,-1)])])):(n(),s("svg",ee,[...t[7]||(t[7]=[e("path",{d:"M8 5v14l11-7z"},null,-1)])])),T(" "+i(l.value?"Loading...":m(d)("tools.code-playground.common.run")),1)],10,Y)]),e("div",te,[U(D,{modelValue:p.value,"onUpdate:modelValue":t[1]||(t[1]=a=>p.value=a),language:"go",theme:"vs-dark",height:"100%",minimap:!1},null,8,["modelValue"])])]),e("div",oe,[e("div",se,[e("div",ne,[e("span",ae,i(m(d)("tools.code-playground.common.output")),1),u.value?(n(),s("span",le,i(u.value)+"ms",1)):b("",!0)]),e("button",{onClick:B,class:"text-xs text-slate-500 hover:text-white transition-colors"},i(m(d)("tools.code-playground.common.clear")),1)]),l.value?(n(),s("div",re,[e("div",ie,[t[8]||(t[8]=e("div",{class:"w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"},null,-1)),e("div",ce,i(v.value),1),t[9]||(t[9]=e("div",{class:"text-xs text-slate-500"},"First load may take a few seconds...",-1))])])):(n(),s("div",de,[(n(!0),s($,null,A(r.value,(a,w)=>(n(),s("div",{key:w,class:G(["flex items-start gap-2",F(a.type)])},[a.type==="error"?(n(),s("span",ue,"✗")):(n(),s("span",me,"›")),e("span",pe,i(a.message),1)],2))),128)),r.value.length===0&&!l.value?(n(),s("div",fe,' Click "Run" to execute Go code... ')):b("",!0)]))])]))}},we=E(ve,[["__scopeId","data-v-add486b5"]]);export{we as default};
