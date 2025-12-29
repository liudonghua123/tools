import{r as i,l as K,k as V,c as o,j as r,d as t,g as k,h as $,q as H,F,f as P,t as m,n as J,i as Q,b as X}from"./index-CFTXyD59.js";import Y from"./MonacoEditor-BkD6agwp.js";import"./monaco-editor-CGO6wXTd.js";const ee={class:"flex flex-col md:flex-row h-full"},te={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col border-b md:border-b-0 md:border-r border-slate-700"},se={class:"flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-700 bg-slate-800/50"},ae={class:"flex items-center gap-2"},ne={key:0,class:"text-xs px-2 py-0.5 bg-emerald-600 text-white rounded-full"},oe={key:1,class:"text-xs px-2 py-0.5 bg-slate-600 text-slate-300 rounded-full"},re={class:"flex items-center gap-4"},le={class:"flex items-center gap-2"},ie=["disabled"],ce={class:"flex items-center gap-2"},ue=["value"],de=["disabled"],me={key:0,class:"w-4 h-4 animate-spin",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24"},pe={key:1,class:"w-4 h-4",fill:"currentColor",viewBox:"0 0 24 24"},ve={class:"flex-1 min-h-0"},fe={class:"w-full md:w-1/2 h-1/2 md:h-full flex flex-col bg-slate-900"},ge={class:"flex items-center justify-between px-4 py-3 border-b border-slate-700"},be={class:"flex items-center gap-3"},xe={key:0,class:"text-xs text-slate-500"},he={key:0,class:"flex-1 flex items-center justify-center"},ye={class:"text-center space-y-4"},we={class:"text-slate-400"},Se={key:1,class:"flex-1 overflow-y-auto p-4 font-mono text-sm space-y-1"},_e={class:"whitespace-pre-wrap"},je={key:0,class:"text-slate-500 italic"},ze={__name:"JavaRunner",emits:["output","error","ready"],setup(Ce,{emit:N}){const j=N,R={8:"ecj-3.26.0.jar",11:"ecj-3.33.0.jar",17:"ecj-3.44.0.jar"},C=i(8),p=i("hello"),v=i([]),u=i(!1),f=i(!1),y=i(""),g=i(null),b=i(!1),x=i(!1);let M=null;const w={hello:{name:"Hello World",code:`public class Main {
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
}`}},S=i(w.hello.code);K(p,()=>{w[p.value]&&(S.value=w[p.value].code)});const l=(a,e="log")=>{v.value.push({type:e,message:a})},B=async a=>{if(f.value)return M!==a?(l(`CheerpJ is already initialized with Java ${M}. To use Java ${a}, please refresh the page.`,"warning"),!1):!0;u.value=!0,y.value=`Loading CheerpJ runtime (Java ${a})...`;try{return window.cheerpjInit||await new Promise((e,s)=>{const n=document.createElement("script");n.src="https://cjrtnc.leaningtech.com/4.2/loader.js",n.onload=e,n.onerror=()=>s(new Error("Failed to load CheerpJ")),document.head.appendChild(n)}),y.value=`Initializing Java ${a} environment...`,await window.cheerpjInit({version:a,status:"none"}),M=a,f.value=!0,j("ready"),!0}catch(e){return e.message.includes("Already initialized")?(f.value=!0,!0):(l(`Failed to initialize CheerpJ: ${e.message}`,"error"),j("error",e),!1)}finally{u.value=!1,y.value=""}},I=a=>{const e=a.match(/public\s+class\s+([a-zA-Z_$][a-zA-Z\d_$]*)/);if(e)return e[1];const s=a.match(/class\s+([a-zA-Z_$][a-zA-Z\d_$]*)/);return s?s[1]:"Main"},T=async()=>{v.value=[],g.value=null;const a=C.value;try{if(!await B(a))return;b.value=!0,l("Compiling...","info");const e=performance.now(),s=S.value,n=I(s),z=`/str/${n}.java`;window.cheerpOSAddStringFile(z,s);const U="/tools/",Z=R[a],W=`/app${U}ecj/${Z}`,G=await window.cheerpjRunMain("org.eclipse.jdt.internal.compiler.batch.Main",W,z,"-d","/files/");if(b.value=!1,G===0){l("Compilation successful!","success"),x.value=!0,l("Running...","info");const E=console.log,L=console.error;console.log=(...c)=>{const h=c.map(d=>typeof d=="object"?JSON.stringify(d):String(d)).join(" ");l(h),E.apply(console,c)},console.error=(...c)=>{const h=c.map(d=>typeof d=="object"?JSON.stringify(d):String(d)).join(" ");l(h,"error"),L.apply(console,c)};try{const c=await window.cheerpjRunMain(n,"/files/");x.value=!1;const h=performance.now();g.value=(h-e).toFixed(2),c!==0&&l(`Program exited with code ${c}`,"warning")}finally{console.log=E,console.error=L}}else l("Compilation failed. Check your code for errors.","error")}catch(e){l(`Error: ${e.message}`,"error"),j("error",e)}finally{b.value=!1,x.value=!1}},O=()=>{v.value=[],g.value=null},A=a=>{switch(a){case"error":return"text-red-400";case"success":return"text-emerald-400";case"warning":return"text-yellow-400";case"info":return"text-blue-400";default:return"text-orange-300"}},q=a=>{switch(a){case"error":return"✗";case"success":return"✓";case"warning":return"⚠";case"info":return"ℹ";default:return"›"}},_=V(()=>u.value||b.value||x.value),D=V(()=>u.value?"Loading...":b.value?"Compiling...":x.value?"Running...":"Run");return(a,e)=>(r(),o("div",ee,[t("div",te,[t("div",se,[t("div",ae,[e[3]||(e[3]=t("svg",{class:"w-5 h-5 text-orange-400",viewBox:"0 0 24 24",fill:"currentColor"},[t("path",{d:"M8 16c0 1.1.9 2 2 2h4c1.1 0 2-.9 2-2v-4H8v4zm-2 0v-4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v4c0 1.1-.9 2-2 2h-4c-1.1 0-2-.9-2-2h-2c-1.1 0-2-.9-2-2zm10-8c0-1.1-.9-2-2-2H10c-1.1 0-2 .9-2 2v2h8V8z"}),t("path",{d:"M7 3v2h10V3H7zm0 14c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2H7z",opacity:".3"})],-1)),e[4]||(e[4]=t("span",{class:"font-bold text-white"},"Java",-1)),f.value?(r(),o("span",ne,"Ready")):u.value?k("",!0):(r(),o("span",oe,"Not loaded"))]),t("div",re,[t("div",le,[e[6]||(e[6]=t("label",{class:"text-xs text-slate-400"},"Version:",-1)),$(t("select",{"onUpdate:modelValue":e[0]||(e[0]=s=>C.value=s),disabled:_.value||f.value,class:"px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500 disabled:opacity-50"},[...e[5]||(e[5]=[t("option",{value:8},"Java 8",-1),t("option",{value:11},"Java 11",-1),t("option",{value:17},"Java 17",-1)])],8,ie),[[H,C.value]])]),t("div",ce,[e[7]||(e[7]=t("label",{class:"text-xs text-slate-400"},"Example:",-1)),$(t("select",{"onUpdate:modelValue":e[1]||(e[1]=s=>p.value=s),class:"px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-orange-500 min-w-[120px]"},[(r(),o(F,null,P(w,(s,n)=>t("option",{key:n,value:n},m(s.name),9,ue)),64))],512),[[H,p.value]])]),t("button",{onClick:T,disabled:_.value,class:J(["px-4 py-1.5 rounded-lg font-medium text-sm transition-colors flex items-center gap-2",_.value?"bg-slate-600 text-slate-400 cursor-not-allowed":"bg-orange-600 hover:bg-orange-500 text-white"])},[_.value?(r(),o("svg",me,[...e[8]||(e[8]=[t("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"},null,-1)])])):(r(),o("svg",pe,[...e[9]||(e[9]=[t("path",{d:"M8 5v14l11-7z"},null,-1)])])),Q(" "+m(D.value),1)],10,de)])]),t("div",ve,[X(Y,{modelValue:S.value,"onUpdate:modelValue":e[2]||(e[2]=s=>S.value=s),language:"java",theme:"vs-dark",height:"100%",minimap:!1},null,8,["modelValue"])])]),t("div",fe,[t("div",ge,[t("div",be,[e[10]||(e[10]=t("span",{class:"text-xs font-bold text-slate-400 uppercase tracking-wider"},"Output",-1)),g.value?(r(),o("span",xe,m(g.value)+"ms",1)):k("",!0)]),t("button",{onClick:O,class:"text-xs text-slate-500 hover:text-white transition-colors"}," Clear ")]),u.value?(r(),o("div",he,[t("div",ye,[e[11]||(e[11]=t("div",{class:"w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"},null,-1)),t("div",we,m(y.value),1),e[12]||(e[12]=t("div",{class:"text-xs text-slate-500"},"First load may take 10-20 seconds...",-1))])])):(r(),o("div",Se,[(r(!0),o(F,null,P(v.value,(s,n)=>(r(),o("div",{key:n,class:J(["flex items-start gap-2",A(s.type)])},[t("span",{class:J(A(s.type))},m(q(s.type)),3),t("span",_e,m(s.message),1)],2))),128)),v.value.length===0&&!u.value?(r(),o("div",je,' Click "Run" to compile and execute Java code... ')):k("",!0)]))])]))}};export{ze as default};
