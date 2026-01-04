import{_ as V,u as E,r as c,o as R,a as H,c as o,j as l,d as e,g as b,t as i,e as m,h as L,q as N,n as G,i as T,b as U,F as $,f as A}from"./index-DlYbbPaf.js";import D from"./MonacoEditor-Ckzx4lfY.js";import"./monaco-editor-CGO6wXTd.js";const I={class:"flex flex-col md:flex-row h-full"},O={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700"},W={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/50"},q={class:"flex items-center gap-4"},J={class:"flex items-center gap-2"},K={key:0,class:"text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full"},Q={key:1,class:"text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full"},X={class:"relative group"},Y=["disabled"],Z={key:0,class:"w-4 h-4 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},e1={key:1,class:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24"},t1={class:"flex-1 min-h-0"},s1={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900"},o1={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700"},l1={class:"flex items-center gap-3"},n1={class:"text-xs font-bold text-slate-400 uppercase tracking-wider"},a1={key:0,class:"text-xs text-slate-500"},r1={key:0,class:"flex-1 flex items-center justify-center"},i1={class:"text-center space-y-4"},c1={class:"text-slate-400"},d1={key:1,class:"flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"},u1={key:0,class:"text-red-400"},m1={key:1,class:"text-emerald-400"},p1={class:"whitespace-pre-wrap"},f1={key:0,class:"text-slate-500 italic"},v1={__name:"GoRunner",emits:["output","error","ready"],setup(h1,{emit:M}){const{t:d}=E(),_=M,g={hello:`package main

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
}`},p=c(g.hello),r=c([]),a=c(!1),f=c(!1),v=c(""),u=c(null),h=c("hello");let y=null;const k=async()=>{if(!f.value){a.value=!0,v.value="Loading Go runtime...";try{const s="/tools/",t=`${s.endsWith("/")?s:s+"/"}go-wasm/`;if(await new Promise((C,S)=>{if(window.Go){C();return}const x=document.createElement("script");x.src=`${t}wasm_exec.js`,x.onload=C,x.onerror=()=>S(new Error("Failed to load wasm_exec.js")),document.head.appendChild(x)}),!window.Go)throw new Error("Go class not found after loading wasm_exec.js");y=new window.Go,v.value="Initializing Go interpreter...";const w=await(await fetch(`${t}main.wasm`)).arrayBuffer(),F=await WebAssembly.instantiate(w,y.importObject);y.run(F.instance),f.value=!0,_("ready")}catch(s){r.value.push({type:"error",message:`Failed to load Go runtime: ${s.message}`}),console.error(s)}finally{a.value=!1,v.value=""}}},P=async()=>{if(f.value||await k(),!window.runGoCode){r.value.push({type:"error",message:"Go interpreter not ready (runGoCode not found)"});return}r.value=[],u.value=null;try{const s=performance.now(),t=window.runGoCode(p.value),n=performance.now();u.value=(n-s).toFixed(2),t&&r.value.push({type:"log",message:t})}catch(s){r.value.push({type:"error",message:s.message}),_("error",s)}},z=()=>{g[h.value]&&(p.value=g[h.value])},j=()=>{r.value=[],u.value=null},B=s=>s==="error"?"text-red-400":"text-emerald-400";return R(()=>{k()}),H(()=>{}),(s,t)=>(l(),o("div",I,[e("div",O,[e("div",W,[e("div",q,[e("div",J,[t[2]||(t[2]=e("svg",{class:"w-5 h-5 text-cyan-400",viewBox:"0 0 128 128",fill:"currentColor"},[e("path",{d:"M108.2 64.8c-.1-.1-.2-.2-.4-.2l-.1-.1c-.1-.1-.2-.1-.2-.2l-.1-.1c-.1 0-.2-.1-.2-.1l-.2-.1c-.1 0-.2-.1-.2-.1l-.2-.1c-.1 0-.2-.1-.2-.1-.1 0-.1 0-.2-.1l-.3-.1c-.1 0-.1 0-.2-.1l-.3-.1h-.1l-.4-.1h-.2c-.1 0-.2 0-.3-.1h-2.3c-.6-13.3.6-26.8-2.8-39.6 12.9-4.6 2.8-22.3-8.4-14.4-7.4-6.4-17.6-7.8-28.3-7.8-10.5.7-20.4 2.9-27.4 8.4-2.8-1.4-5.5-1.8-7.9-1.1v.1c-.1 0-.3.1-.4.2-.1 0-.3.1-.4.2h-.1c-.1 0-.2.1-.4.2h-.1l-.3.2h-.1l-.3.2h-.1l-.3.2s-.1 0-.1.1l-.3.2s-.1 0-.1.1l-.3.2s-.1 0-.1.1l-.3.2-.1.1c-.1.1-.2.1-.2.2l-.1.1-.2.2-.1.1c-.1.1-.1.2-.2.2l-.1.1c-.1.1-.1.2-.2.2l-.1.1c-.1.1-.1.2-.2.2l-.1.1c-.1.1-.1.2-.2.2l-.1.1c-.1.1-.1.2-.2.2l-.1.1-.1.3s0 .1-.1.1l-.1.3s0 .1-.1.1l-.1.3s0 .1-.1.1l-.1.3s0 .1-.1.1c.4.3.4.4.4.4v.1l-.1.3v.1c0 .1 0 .2-.1.3v3.1c0 .1 0 .2.1.3v.1l.1.3v.1l.1.3s0 .1.1.1l.1.3s0 .1.1.1l.1.3s0 .1.1.1l.2.3s0 .1.1.1l.2.3s0 .1.1.1l.2.3.1.1.3.3.3.3h.1c1 .9 2 1.6 4 2.2v-.2C23 37.3 26.5 50 26.7 63c-.6 0-.7.4-1.7.5h-.5c-.1 0-.3 0-.5.1-.1 0-.3 0-.4.1l-.4.1h-.1l-.4.1h-.1l-.3.1h-.1l-.3.1s-.1 0-.1.1l-.3.1-.2.1c-.1 0-.2.1-.2.1l-.2.1-.2.1c-.1 0-.2.1-.2.1l-.2.1-.4.3c-.1.1-.2.2-.3.2l-.4.4-.1.1c-.1.2-.3.4-.4.5l-.2.3-.3.6-.1.3v.3c0 .5.2.9.9 1.2.2 3.7 3.9 2 5.6.8l.1-.1c.2-.2.5-.3.6-.3h.1l.2-.1c.1 0 .1 0 .2-.1.2-.1.4-.1.5-.2.1 0 .1-.1.1-.2l.1-.1c.1-.2.2-.6.2-1.2l.1-1.3v1.8c-.5 13.1-4 30.7 3.3 42.5 1.3 2.1 2.9 3.9 4.7 5.4h-.5c-.2.2-.5.4-.8.6l-.9.6-.3.2-.6.4-.9.7-1.1 1c-.2.2-.3.4-.4.5l-.4.6-.2.3c-.1.2-.2.4-.2.6l-.1.3c-.2.8 0 1.7.6 2.7l.4.4h.2c.1 0 .2 0 .4.1.2.4 1.2 2.5 3.9.9 2.8-1.5 4.7-4.6 8.1-5.1l-.5-.6c5.9 2.8 12.8 4 19 4.2 8.7.3 18.6-.9 26.5-5.2 2.2.7 3.9 3.9 5.8 5.4l.1.1.1.1.1.1.1.1s.1 0 .1.1c0 0 .1 0 .1.1 0 0 .1 0 .1.1h2.1s.1 0 .1-.1h.1s.1 0 .1-.1h.1s.1 0 .1-.1c0 0 .1 0 .1-.1l.1-.1s.1 0 .1-.1l.1-.1h.1l.2-.2.2-.1h.1l.1-.1h.1l.1-.1.1-.1.1-.1.1-.1.1-.1.1-.1.1-.1v-.1s0-.1.1-.1v-.1s0-.1.1-.1v-.1s0-.1.1-.1v-1.4s-.3 0-.3-.1l-.3-.1v-.1l.3-.1s.2 0 .2-.1l.1-.1v-2.1s0-.1-.1-.1v-.1s0-.1-.1-.1v-.1s0-.1-.1-.1c0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1 0 0 0-.1-.1-.1l-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1v-.1l-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1-.1c2-1.9 3.8-4.2 5.1-6.9 5.9-11.8 4.9-26.2 4.1-39.2h.1c.1 0 .2.1.2.1h.3s.1 0 .1.1h.1s.1 0 .1.1l.2.1c1.7 1.2 5.4 2.9 5.6-.8 1.6.6-.3-1.8-1.3-2.5zM36 23C32.8 7 58.4 4 59.3 19.6c.8 13-20 16.3-23.3 3.4zm36.1 15c-1.3 1.4-2.7 1.2-4.1.7 0 1.9.4 3.9.1 5.9-.5.9-1.5 1-2.3 1.4-1.2-.2-2.1-.9-2.6-2l-.2-.1c-3.9 5.2-6.3-1.1-5.2-5-1.2.1-2.2-.2-3-1.5-1.4-2.6.7-5.8 3.4-6.3.7 3 8.7 2.6 10.1-.2 3.1 1.5 6.5 4.3 3.8 7.1zm-7-17.5c-.9-13.8 20.3-17.5 23.4-4 3.5 15-20.8 18.9-23.4 4zM41.7 17c-1.9 0-3.5 1.7-3.5 3.8 0 2.1 1.6 3.8 3.5 3.8s3.5-1.7 3.5-3.8c0-2.1-1.5-3.8-3.5-3.8zm1.6 5.7c-.5 0-.8-.4-.8-1 0-.5.4-1 .8-1 .5 0 .8.4.8 1 0 .5-.3 1-.8 1zm27.8-6.6c-1.9 0-3.4 1.7-3.4 3.8 0 2.1 1.5 3.8 3.4 3.8s3.4-1.7 3.4-3.8c0-2.1-1.5-3.8-3.4-3.8zm1.6 5.6c-.4 0-.8-.4-.8-1 0-.5.4-1 .8-1s.8.4.8 1-.4 1-.8 1z"})],-1)),t[3]||(t[3]=e("span",{class:"font-bold text-white"},"Go",-1)),f.value?(l(),o("span",K,i(m(d)("tools.code-playground.common.ready")),1)):a.value?b("",!0):(l(),o("span",Q,i(m(d)("tools.code-playground.common.not_loaded")),1))]),e("div",X,[L(e("select",{"onUpdate:modelValue":t[0]||(t[0]=n=>h.value=n),onChange:z,class:"appearance-none bg-slate-700/50 border border-slate-600 text-slate-200 text-xs rounded px-2 pr-6 py-1 hover:border-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all cursor-pointer"},[...t[4]||(t[4]=[e("option",{value:"hello"},"Hello World",-1),e("option",{value:"fibonacci"},"Fibonacci",-1),e("option",{value:"data_structures"},"Slices & Maps",-1),e("option",{value:"concurrency"},"Concurrency",-1)])],544),[[N,h.value]]),t[5]||(t[5]=e("div",{class:"absolute inset-y-0 right-1.5 flex items-center pointer-events-none text-slate-400"},[e("svg",{class:"w-3 h-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},[e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M19 9l-7 7-7-7"})])],-1))])]),e("button",{onClick:P,disabled:a.value,class:G(["px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2",a.value?"bg-slate-600 text-slate-400 cursor-not-allowed":"bg-emerald-600 hover:bg-emerald-500 text-white"])},[a.value?(l(),o("svg",Z,[...t[6]||(t[6]=[e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"},null,-1)])])):(l(),o("svg",e1,[...t[7]||(t[7]=[e("path",{d:"M8 5v14l11-7z"},null,-1)])])),T(" "+i(a.value?"Loading...":m(d)("tools.code-playground.common.run")),1)],10,Y)]),e("div",t1,[U(D,{modelValue:p.value,"onUpdate:modelValue":t[1]||(t[1]=n=>p.value=n),language:"go",theme:"vs-dark",height:"100%",minimap:!1},null,8,["modelValue"])])]),e("div",s1,[e("div",o1,[e("div",l1,[e("span",n1,i(m(d)("tools.code-playground.common.output")),1),u.value?(l(),o("span",a1,i(u.value)+"ms",1)):b("",!0)]),e("button",{onClick:j,class:"text-xs text-slate-500 hover:text-white transition-colors"},i(m(d)("tools.code-playground.common.clear")),1)]),a.value?(l(),o("div",r1,[e("div",i1,[t[8]||(t[8]=e("div",{class:"w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"},null,-1)),e("div",c1,i(v.value),1),t[9]||(t[9]=e("div",{class:"text-xs text-slate-500"},"First load may take a few seconds...",-1))])])):(l(),o("div",d1,[(l(!0),o($,null,A(r.value,(n,w)=>(l(),o("div",{key:w,class:G(["flex items-start gap-2",B(n.type)])},[n.type==="error"?(l(),o("span",u1,"✗")):(l(),o("span",m1,"›")),e("span",p1,i(n.message),1)],2))),128)),r.value.length===0&&!a.value?(l(),o("div",f1,' Click "Run" to execute Go code... ')):b("",!0)]))])]))}},w1=V(v1,[["__scopeId","data-v-5a4213a3"]]);export{w1 as default};
