import{u as X,r as u,l as Y,k as P,c as n,j as r,d as t,g as z,t as l,e as f,h as V,q as I,F as N,f as B,n as A,i as ee,b as te}from"./index-HNFkyshc.js";import se from"./MonacoEditor-6BHKnU1_.js";import"./monaco-editor-CGO6wXTd.js";const ae={class:"flex flex-col md:flex-row h-full"},oe={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700"},ne={class:"flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-700 bg-slate-800/50"},re={class:"flex items-center gap-2"},le={key:0,class:"text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full"},ie={key:1,class:"text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full"},ce={class:"flex items-center gap-4"},ue={class:"flex items-center gap-2"},de={class:"text-xs text-slate-400"},me=["disabled"],pe={class:"flex items-center gap-2"},ve={class:"text-xs text-slate-400"},fe=["value"],ge=["disabled"],be={key:0,class:"w-4 h-4 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},xe={key:1,class:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24"},ye={class:"flex-1 min-h-0"},he={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900"},we={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700"},_e={class:"flex items-center gap-3"},Se={class:"text-xs font-bold text-slate-400 uppercase tracking-wider"},je={key:0,class:"text-xs text-slate-500"},Ce={key:0,class:"flex-1 flex items-center justify-center"},Me={class:"text-center space-y-4"},ke={class:"text-slate-400"},Je={key:1,class:"flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"},ze={class:"whitespace-pre-wrap"},Ae={key:0,class:"text-slate-500 italic"},Ve={__name:"JavaRunner",emits:["output","error","ready"],setup(Ee,{emit:H}){const{t:i}=X(),M=H,T={8:"ecj-3.26.0.jar",11:"ecj-3.33.0.jar",17:"ecj-3.44.0.jar"},k=u(8),g=u("hello"),b=u([]),m=u(!1),x=u(!1),_=u(""),y=u(null),h=u(!1),w=u(!1);let J=null;const S={hello:{name:"Hello World",code:`public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
        System.out.println("Java version: " + System.getProperty("java.version"));
    }
}`},classes:{name:"Classes",code:`class Person {
    private String name;
    private int age;
    
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public void introduce() {
        System.out.println("Hi, I'm " + name + ", " + age + " years old.");
    }
}

public class Main {
    public static void main(String[] args) {
        Person alice = new Person("Alice", 25);
        Person bob = new Person("Bob", 30);
        
        alice.introduce();
        bob.introduce();
    }
}`},collections:{name:"Collections",code:`import java.util.ArrayList;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // ArrayList example
        ArrayList<String> fruits = new ArrayList<>();
        fruits.add("Apple");
        fruits.add("Banana");
        fruits.add("Cherry");
        
        System.out.println("Fruits:");
        for (String fruit : fruits) {
            System.out.println("  - " + fruit);
        }
        
        // HashMap example
        HashMap<String, Integer> scores = new HashMap<>();
        scores.put("Alice", 95);
        scores.put("Bob", 87);
        scores.put("Charlie", 92);
        
        System.out.println("\\nScores:");
        for (String name : scores.keySet()) {
            System.out.println("  " + name + ": " + scores.get(name));
        }
    }
}`},fibonacci:{name:"Fibonacci",code:`public class Main {
    public static long fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
    
    public static void main(String[] args) {
        System.out.println("Fibonacci sequence:");
        for (int i = 0; i < 15; i++) {
            System.out.print(fibonacci(i) + " ");
        }
        System.out.println();
        
        // Performance test
        long start = System.currentTimeMillis();
        long result = fibonacci(35);
        long end = System.currentTimeMillis();
        
        System.out.println("\\nfibonacci(35) = " + result);
        System.out.println("Time: " + (end - start) + "ms");
    }
}`},lambda:{name:"Lambda (Java 8+)",code:`import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);
        
        // Filter even numbers and square them
        List<Integer> result = numbers.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * n)
            .collect(Collectors.toList());
        
        System.out.println("Original: " + numbers);
        System.out.println("Even squares: " + result);
        
        // Sum using reduce
        int sum = numbers.stream()
            .reduce(0, (a, b) -> a + b);
        System.out.println("Sum: " + sum);
        
        // ForEach with lambda
        System.out.print("Doubled: ");
        numbers.forEach(n -> System.out.print(n * 2 + " "));
        System.out.println();
    }
}`}},j=u(S.hello.code);Y(g,()=>{S[g.value]&&(j.value=S[g.value].code)});const c=(s,e="log")=>{b.value.push({type:e,message:s})},O=async s=>{if(x.value)return J!==s?(c(`CheerpJ is already initialized with Java ${J}. To use Java ${s}, please refresh the page.`,"warning"),!1):!0;m.value=!0,_.value=`Loading CheerpJ runtime (Java ${s})...`;try{return window.cheerpjInit||await new Promise((e,a)=>{const o=document.createElement("script");o.src="https://cjrtnc.leaningtech.com/4.2/loader.js",o.onload=e,o.onerror=()=>a(new Error("Failed to load CheerpJ")),document.head.appendChild(o)}),_.value=`Initializing Java ${s} environment...`,await window.cheerpjInit({version:s,status:"none"}),J=s,x.value=!0,M("ready"),!0}catch(e){return e.message.includes("Already initialized")?(x.value=!0,!0):(c(`Failed to initialize CheerpJ: ${e.message}`,"error"),M("error",e),!1)}finally{m.value=!1,_.value=""}},R=s=>{const e=s.match(/public\s+class\s+([a-zA-Z_$][a-zA-Z\d_$]*)/);if(e)return e[1];const a=s.match(/class\s+([a-zA-Z_$][a-zA-Z\d_$]*)/);return a?a[1]:"Main"},q=async()=>{b.value=[],y.value=null;const s=k.value;try{if(!await O(s))return;h.value=!0,c("Compiling...","info");const e=performance.now(),a=j.value,o=R(a),L=`/str/${o}.java`;window.cheerpOSAddStringFile(L,a);const W="/tools/",G=T[s],K=`/app${W}ecj/${G}`,Q=await window.cheerpjRunMain("org.eclipse.jdt.internal.compiler.batch.Main",K,L,"-d","/files/","-source",s,"-target",s);if(h.value=!1,Q===0){c("Compilation successful!","success"),w.value=!0,c("Running...","info");const $=console.log,F=console.error;console.log=(...d)=>{const p=d.map(v=>typeof v=="object"?JSON.stringify(v):String(v)).join(" ");p.trim()&&(c(p),$.apply(console,d))},console.error=(...d)=>{const p=d.map(v=>typeof v=="object"?JSON.stringify(v):String(v)).join(" ");p.trim()&&(c(p,"error"),F.apply(console,d))};try{const d=await window.cheerpjRunMain(o,"/files/");w.value=!1;const p=performance.now();y.value=(p-e).toFixed(2),d!==0&&c(`Program exited with code ${d}`,"warning")}finally{console.log=$,console.error=F}}else c("Compilation failed. Check your code for errors.","error")}catch(e){c(`Error: ${e.message}`,"error"),M("error",e)}finally{h.value=!1,w.value=!1}},D=()=>{b.value=[],y.value=null},E=s=>{switch(s){case"error":return"text-red-400";case"success":return"text-emerald-400";case"warning":return"text-yellow-400";case"info":return"text-blue-400";default:return"text-orange-300"}},U=s=>{switch(s){case"error":return"✗";case"success":return"✓";case"warning":return"⚠";case"info":return"ℹ";default:return"›"}},C=P(()=>m.value||h.value||w.value),Z=P(()=>m.value?i("tools.code-playground.java.loading").split(" ")[0]+"...":h.value?i("tools.code-playground.java.compiling"):w.value?i("tools.code-playground.java.running"):i("tools.code-playground.common.run"));return(s,e)=>(r(),n("div",ae,[t("div",oe,[t("div",ne,[t("div",re,[e[3]||(e[3]=t("svg",{class:"w-5 h-5 text-orange-400",viewBox:"0 0 128 128",fill:"currentColor"},[t("path",{d:"M47.617 98.12c-19.192 5.362 11.677 16.439 36.115 5.969-4.003-1.556-6.874-3.351-6.874-3.351-10.897 2.06-15.952 2.222-25.844 1.092-8.164-.935-3.397-3.71-3.397-3.71zm33.189-10.46c-14.444 2.779-22.787 2.69-33.354 1.6-8.171-.845-2.822-4.805-2.822-4.805-21.137 7.016 11.767 14.977 41.309 6.336-3.14-1.106-5.133-3.131-5.133-3.131zm11.319-60.575c.001 0-42.731 10.669-22.323 34.187 6.024 6.935-1.58 13.17-1.58 13.17s15.289-7.891 8.269-17.777c-6.559-9.215-11.587-13.793 15.634-29.58zm9.998 81.144s3.529 2.91-3.888 5.159c-14.102 4.272-58.706 5.56-71.095.171-4.45-1.938 3.899-4.625 6.526-5.192 2.739-.593 4.303-.485 4.303-.485-4.952-3.487-32.013 6.85-13.742 9.815 49.821 8.076 90.817-3.637 77.896-9.468zM85 77.896c2.395-1.634 5.703-3.053 5.703-3.053s-9.424 1.685-18.813 2.474c-11.494.964-23.823 1.154-30.012.326-14.652-1.959 8.033-7.348 8.033-7.348s-8.812-.596-19.644 4.644C17.455 81.134 61.958 83.958 85 77.896zm5.609 15.145c-.108.29-.468.616-.468.616 31.273-8.221 19.775-28.979 4.822-23.725-1.312.464-2 1.543-2 1.543s.829-.334 2.678-.72c7.559-1.575 18.389 10.119-5.032 22.286zM64.181 70.069c-4.614-10.429-20.26-19.553.007-35.559C89.459 14.563 76.492 1.587 76.492 1.587c5.23 20.608-18.451 26.833-26.999 39.667-5.821 8.745 2.857 18.142 14.688 28.815zm27.274 51.748c-19.187 3.612-42.854 3.191-56.887.874 0 0 2.874 2.38 17.646 3.331 22.476 1.437 57-.8 57.816-11.436.001 0-1.57 4.032-18.575 7.231z"})],-1)),e[4]||(e[4]=t("span",{class:"font-bold text-white"},"Java",-1)),x.value?(r(),n("span",le,l(f(i)("tools.code-playground.common.ready")),1)):m.value?z("",!0):(r(),n("span",ie,l(f(i)("tools.code-playground.common.not_loaded","Not loaded")),1))]),t("div",ce,[t("div",ue,[t("label",de,l(f(i)("tools.code-playground.java.version"))+":",1),V(t("select",{"onUpdate:modelValue":e[0]||(e[0]=a=>k.value=a),disabled:C.value||x.value,class:"px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500 disabled:opacity-50"},[...e[5]||(e[5]=[t("option",{value:8},"Java 8",-1),t("option",{value:11},"Java 11",-1),t("option",{value:17},"Java 17",-1)])],8,me),[[I,k.value]])]),t("div",pe,[t("label",ve,l(f(i)("tools.code-playground.java.example"))+":",1),V(t("select",{"onUpdate:modelValue":e[1]||(e[1]=a=>g.value=a),class:"px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500 min-w-[120px]"},[(r(),n(N,null,B(S,(a,o)=>t("option",{key:o,value:o},l(a.name),9,fe)),64))],512),[[I,g.value]])]),t("button",{onClick:q,disabled:C.value,class:A(["px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2",C.value?"bg-slate-600 text-slate-400 cursor-not-allowed":"bg-orange-600 hover:bg-orange-500 text-white"])},[C.value?(r(),n("svg",be,[...e[6]||(e[6]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"},null,-1)])])):(r(),n("svg",xe,[...e[7]||(e[7]=[t("path",{d:"M8 5v14l11-7z"},null,-1)])])),ee(" "+l(Z.value),1)],10,ge)])]),t("div",ye,[te(se,{modelValue:j.value,"onUpdate:modelValue":e[2]||(e[2]=a=>j.value=a),language:"java",theme:"vs-dark",height:"100%",minimap:!1},null,8,["modelValue"])])]),t("div",he,[t("div",we,[t("div",_e,[t("span",Se,l(f(i)("tools.code-playground.common.output")),1),y.value?(r(),n("span",je,l(y.value)+"ms",1)):z("",!0)]),t("button",{onClick:D,class:"text-xs text-slate-500 hover:text-white transition-colors"},l(f(i)("tools.code-playground.common.clear")),1)]),m.value?(r(),n("div",Ce,[t("div",Me,[e[8]||(e[8]=t("div",{class:"w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"},null,-1)),t("div",ke,l(_.value),1),e[9]||(e[9]=t("div",{class:"text-xs text-slate-500"},"First load may take 10-20 seconds...",-1))])])):(r(),n("div",Je,[(r(!0),n(N,null,B(b.value,(a,o)=>(r(),n("div",{key:o,class:A(["flex items-start gap-2",E(a.type)])},[t("span",{class:A(E(a.type))},l(U(a.type)),3),t("span",ze,l(a.message),1)],2))),128)),b.value.length===0&&!m.value?(r(),n("div",Ae,' Click "Run" to compile and execute Java code... ')):z("",!0)]))])]))}};export{Ve as default};
