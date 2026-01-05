import{_ as ye,u as ge,r as D,E as he,k as pt,l as be,o as ve,a as _e,c as h,b as we,d as s,t as f,e as _,n as M,F as L,f as j,g as F,i as dt,j as b,B as Se}from"./index-DFuPh5c1.js";import{_ as E,e as Ae}from"./monaco-editor-DrHUTMTD.js";import ke from"./katex-Cu_Erd72.js";var De=Object.defineProperty,l=(t,e)=>De(t,"name",{value:e,configurable:!0}),bt=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(e,a)=>(typeof require<"u"?require:e)[a]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')}),Fe=(()=>{for(var t=new Uint8Array(128),e=0;e<64;e++)t[e<26?e+65:e<52?e+71:e<62?e-4:e*4-205]=e;return a=>{for(var i=a.length,r=new Uint8Array((i-(a[i-1]=="=")-(a[i-2]=="="))*3/4|0),n=0,o=0;n<i;){var p=t[a.charCodeAt(n++)],c=t[a.charCodeAt(n++)],m=t[a.charCodeAt(n++)],u=t[a.charCodeAt(n++)];r[o++]=p<<2|c>>4,r[o++]=c<<4|m>>2,r[o++]=m<<6|u}return r}})();function vt(t){return!isNaN(parseFloat(t))&&isFinite(t)}l(vt,"_isNumber");function C(t){return t.charAt(0).toUpperCase()+t.substring(1)}l(C,"_capitalize");function J(t){return function(){return this[t]}}l(J,"_getter");var I=["isConstructor","isEval","isNative","isToplevel"],O=["columnNumber","lineNumber"],R=["fileName","functionName","source"],Pe=["args"],Ee=["evalOrigin"],X=I.concat(O,R,Pe,Ee);function S(t){if(t)for(var e=0;e<X.length;e++)t[X[e]]!==void 0&&this["set"+C(X[e])](t[X[e]])}l(S,"StackFrame");S.prototype={getArgs:l(function(){return this.args},"getArgs"),setArgs:l(function(t){if(Object.prototype.toString.call(t)!=="[object Array]")throw new TypeError("Args must be an Array");this.args=t},"setArgs"),getEvalOrigin:l(function(){return this.evalOrigin},"getEvalOrigin"),setEvalOrigin:l(function(t){if(t instanceof S)this.evalOrigin=t;else if(t instanceof Object)this.evalOrigin=new S(t);else throw new TypeError("Eval Origin must be an Object or StackFrame")},"setEvalOrigin"),toString:l(function(){var t=this.getFileName()||"",e=this.getLineNumber()||"",a=this.getColumnNumber()||"",i=this.getFunctionName()||"";return this.getIsEval()?t?"[eval] ("+t+":"+e+":"+a+")":"[eval]:"+e+":"+a:i?i+" ("+t+":"+e+":"+a+")":t+":"+e+":"+a},"toString")};S.fromString=l(function(t){var e=t.indexOf("("),a=t.lastIndexOf(")"),i=t.substring(0,e),r=t.substring(e+1,a).split(","),n=t.substring(a+1);if(n.indexOf("@")===0)var o=/@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(n,""),p=o[1],c=o[2],m=o[3];return new S({functionName:i,args:r||void 0,fileName:p,lineNumber:c||void 0,columnNumber:m||void 0})},"StackFrame$$fromString");for(T=0;T<I.length;T++)S.prototype["get"+C(I[T])]=J(I[T]),S.prototype["set"+C(I[T])]=(function(t){return function(e){this[t]=!!e}})(I[T]);var T;for(N=0;N<O.length;N++)S.prototype["get"+C(O[N])]=J(O[N]),S.prototype["set"+C(O[N])]=(function(t){return function(e){if(!vt(e))throw new TypeError(t+" must be a Number");this[t]=Number(e)}})(O[N]);var N;for(q=0;q<R.length;q++)S.prototype["get"+C(R[q])]=J(R[q]),S.prototype["set"+C(R[q])]=(function(t){return function(e){this[t]=String(e)}})(R[q]);var q,et=S;function _t(){var t=/^\s*at .*(\S+:\d+|\(native\))/m,e=/^(eval@)?(\[native code])?$/;return{parse:l(function(a){if(a.stack&&a.stack.match(t))return this.parseV8OrIE(a);if(a.stack)return this.parseFFOrSafari(a);throw new Error("Cannot parse given Error object")},"ErrorStackParser$$parse"),extractLocation:l(function(a){if(a.indexOf(":")===-1)return[a];var i=/(.+?)(?::(\d+))?(?::(\d+))?$/,r=i.exec(a.replace(/[()]/g,""));return[r[1],r[2]||void 0,r[3]||void 0]},"ErrorStackParser$$extractLocation"),parseV8OrIE:l(function(a){var i=a.stack.split(`
`).filter(function(r){return!!r.match(t)},this);return i.map(function(r){r.indexOf("(eval ")>-1&&(r=r.replace(/eval code/g,"eval").replace(/(\(eval at [^()]*)|(,.*$)/g,""));var n=r.replace(/^\s+/,"").replace(/\(eval code/g,"(").replace(/^.*?\s+/,""),o=n.match(/ (\(.+\)$)/);n=o?n.replace(o[0],""):n;var p=this.extractLocation(o?o[1]:n),c=o&&n||void 0,m=["eval","<anonymous>"].indexOf(p[0])>-1?void 0:p[0];return new et({functionName:c,fileName:m,lineNumber:p[1],columnNumber:p[2],source:r})},this)},"ErrorStackParser$$parseV8OrIE"),parseFFOrSafari:l(function(a){var i=a.stack.split(`
`).filter(function(r){return!r.match(e)},this);return i.map(function(r){if(r.indexOf(" > eval")>-1&&(r=r.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,":$1")),r.indexOf("@")===-1&&r.indexOf(":")===-1)return new et({functionName:r});var n=/((.*".+"[^@]*)?[^@]*)(?:@)/,o=r.match(n),p=o&&o[1]?o[1]:void 0,c=this.extractLocation(r.replace(n,""));return new et({functionName:p,fileName:c[0],lineNumber:c[1],columnNumber:c[2],source:r})},this)},"ErrorStackParser$$parseFFOrSafari")}}l(_t,"ErrorStackParser");var ze=new _t,Ce=ze;function wt(){if(typeof API<"u"&&API!==globalThis.API)return API.runtimeEnv;let t=typeof Bun<"u",e=typeof Deno<"u",a=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string"&&!process.browser,i=typeof navigator=="object"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome")===-1&&navigator.userAgent.indexOf("Safari")>-1;return St({IN_BUN:t,IN_DENO:e,IN_NODE:a,IN_SAFARI:i,IN_SHELL:typeof read=="function"&&typeof load=="function"})}l(wt,"getGlobalRuntimeEnv");var w=wt();function St(t){let e=t.IN_NODE&&typeof module<"u"&&module.exports&&typeof bt=="function"&&typeof __dirname=="string",a=t.IN_NODE&&!e,i=!t.IN_NODE&&!t.IN_DENO&&!t.IN_BUN,r=i&&typeof window<"u"&&typeof window.document<"u"&&typeof document.createElement=="function"&&"sessionStorage"in window&&typeof globalThis.importScripts!="function",n=i&&typeof globalThis.WorkerGlobalScope<"u"&&typeof globalThis.self<"u"&&globalThis.self instanceof globalThis.WorkerGlobalScope;return{...t,IN_BROWSER:i,IN_BROWSER_MAIN_THREAD:r,IN_BROWSER_WEB_WORKER:n,IN_NODE_COMMONJS:e,IN_NODE_ESM:a}}l(St,"calculateDerivedFlags");var At,it,kt,ct,rt;async function ot(){if(!w.IN_NODE||(At=(await E(async()=>{const{default:n}=await import("./__vite-browser-external-BIHI7g3E.js");return{default:n}},[])).default,ct=await E(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),rt=await E(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),kt=(await E(async()=>{const{default:n}=await import("./__vite-browser-external-BIHI7g3E.js");return{default:n}},[])).default,it=await E(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),lt=it.sep,typeof bt<"u"))return;let t=ct,e=await E(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),a=await E(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),i=await E(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),r={fs:t,crypto:e,ws:a,child_process:i};globalThis.require=function(n){return r[n]}}l(ot,"initNodeModules");function Dt(t,e){return it.resolve(e||".",t)}l(Dt,"node_resolvePath");function Ft(t,e){return e===void 0&&(e=location),new URL(t,e).toString()}l(Ft,"browser_resolvePath");var W;w.IN_NODE?W=Dt:w.IN_SHELL?W=l(t=>t,"resolvePath"):W=Ft;var lt;w.IN_NODE||(lt="/");function Pt(t,e){return t.startsWith("file://")&&(t=t.slice(7)),t.includes("://")?{response:fetch(t)}:{binary:rt.readFile(t).then(a=>new Uint8Array(a.buffer,a.byteOffset,a.byteLength))}}l(Pt,"node_getBinaryResponse");function Et(t,e){if(t.startsWith("file://")&&(t=t.slice(7)),t.includes("://"))throw new Error("Shell cannot fetch urls");return{binary:Promise.resolve(new Uint8Array(readbuffer(t)))}}l(Et,"shell_getBinaryResponse");function zt(t,e){let a=new URL(t,location);return{response:fetch(a,e?{integrity:e}:{})}}l(zt,"browser_getBinaryResponse");var H;w.IN_NODE?H=Pt:w.IN_SHELL?H=Et:H=zt;async function Ct(t,e){let{response:a,binary:i}=H(t,e);if(i)return i;let r=await a;if(!r.ok)throw new Error(`Failed to load '${t}': request failed.`);return new Uint8Array(await r.arrayBuffer())}l(Ct,"loadBinaryFile");var $;if(w.IN_BROWSER_MAIN_THREAD)$=l(async t=>await import(t),"loadScript");else if(w.IN_BROWSER_WEB_WORKER)$=l(async t=>{try{globalThis.importScripts(t)}catch(e){if(e instanceof TypeError)await import(t);else throw e}},"loadScript");else if(w.IN_NODE)$=Tt;else if(w.IN_SHELL)$=load;else throw new Error("Cannot determine runtime environment");async function Tt(t){t.startsWith("file://")&&(t=t.slice(7)),t.includes("://")?kt.runInThisContext(await(await fetch(t)).text()):await import(At.pathToFileURL(t).href)}l(Tt,"nodeLoadScript");async function Nt(t){if(w.IN_NODE){await ot();let e=await rt.readFile(t,{encoding:"utf8"});return JSON.parse(e)}else if(w.IN_SHELL){let e=read(t);return JSON.parse(e)}else return await(await fetch(t)).json()}l(Nt,"loadLockFile");async function qt(){if(w.IN_NODE_COMMONJS)return __dirname;let t;try{throw new Error}catch(i){t=i}let e=Ce.parse(t)[0].fileName;if(w.IN_NODE&&!e.startsWith("file://")&&(e=`file://${e}`),w.IN_NODE_ESM){let i=await E(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]);return(await E(async()=>{const{fileURLToPath:r}=await import("./__vite-browser-external-BIHI7g3E.js");return{fileURLToPath:r}},[])).fileURLToPath(i.dirname(e))}let a=e.lastIndexOf(lt);if(a===-1)throw new Error("Could not extract indexURL path from pyodide module location. Please pass the indexURL explicitly to loadPyodide.");return e.slice(0,a)}l(qt,"calculateDirname");function Bt(t){var e;return t.substring(0,t.lastIndexOf("/")+1)||((e=globalThis.location)==null?void 0:e.toString())||"."}l(Bt,"calculateInstallBaseUrl");function It(t){let e=t.FS,a=t.FS.filesystems.MEMFS,i=t.PATH,r={DIR_MODE:16895,FILE_MODE:33279,mount:l(function(n){if(!n.opts.fileSystemHandle)throw new Error("opts.fileSystemHandle is required");return a.mount.apply(null,arguments)},"mount"),syncfs:l(async(n,o,p)=>{try{let c=r.getLocalSet(n),m=await r.getRemoteSet(n),u=o?m:c,x=o?c:m;await r.reconcile(n,u,x),p(null)}catch(c){p(c)}},"syncfs"),getLocalSet:l(n=>{let o=Object.create(null);function p(u){return u!=="."&&u!==".."}l(p,"isRealDir");function c(u){return x=>i.join2(u,x)}l(c,"toAbsolute");let m=e.readdir(n.mountpoint).filter(p).map(c(n.mountpoint));for(;m.length;){let u=m.pop(),x=e.stat(u);e.isDir(x.mode)&&m.push.apply(m,e.readdir(u).filter(p).map(c(u))),o[u]={timestamp:x.mtime,mode:x.mode}}return{type:"local",entries:o}},"getLocalSet"),getRemoteSet:l(async n=>{let o=Object.create(null),p=await Te(n.opts.fileSystemHandle);for(let[c,m]of p)c!=="."&&(o[i.join2(n.mountpoint,c)]={timestamp:m.kind==="file"?new Date((await m.getFile()).lastModified):new Date,mode:m.kind==="file"?r.FILE_MODE:r.DIR_MODE});return{type:"remote",entries:o,handles:p}},"getRemoteSet"),loadLocalEntry:l(n=>{let o=e.lookupPath(n,{}).node,p=e.stat(n);if(e.isDir(p.mode))return{timestamp:p.mtime,mode:p.mode};if(e.isFile(p.mode))return o.contents=a.getFileDataAsTypedArray(o),{timestamp:p.mtime,mode:p.mode,contents:o.contents};throw new Error("node type not supported")},"loadLocalEntry"),storeLocalEntry:l((n,o)=>{if(e.isDir(o.mode))e.mkdirTree(n,o.mode);else if(e.isFile(o.mode))e.writeFile(n,o.contents,{canOwn:!0});else throw new Error("node type not supported");e.chmod(n,o.mode),e.utime(n,o.timestamp,o.timestamp)},"storeLocalEntry"),removeLocalEntry:l(n=>{var o=e.stat(n);e.isDir(o.mode)?e.rmdir(n):e.isFile(o.mode)&&e.unlink(n)},"removeLocalEntry"),loadRemoteEntry:l(async n=>{if(n.kind==="file"){let o=await n.getFile();return{contents:new Uint8Array(await o.arrayBuffer()),mode:r.FILE_MODE,timestamp:new Date(o.lastModified)}}else{if(n.kind==="directory")return{mode:r.DIR_MODE,timestamp:new Date};throw new Error("unknown kind: "+n.kind)}},"loadRemoteEntry"),storeRemoteEntry:l(async(n,o,p)=>{let c=n.get(i.dirname(o)),m=e.isFile(p.mode)?await c.getFileHandle(i.basename(o),{create:!0}):await c.getDirectoryHandle(i.basename(o),{create:!0});if(m.kind==="file"){let u=await m.createWritable();await u.write(p.contents),await u.close()}n.set(o,m)},"storeRemoteEntry"),removeRemoteEntry:l(async(n,o)=>{await n.get(i.dirname(o)).removeEntry(i.basename(o)),n.delete(o)},"removeRemoteEntry"),reconcile:l(async(n,o,p)=>{let c=0,m=[];Object.keys(o.entries).forEach(function(g){let P=o.entries[g],A=p.entries[g];(!A||e.isFile(P.mode)&&P.timestamp.getTime()>A.timestamp.getTime())&&(m.push(g),c++)}),m.sort();let u=[];if(Object.keys(p.entries).forEach(function(g){o.entries[g]||(u.push(g),c++)}),u.sort().reverse(),!c)return;let x=o.type==="remote"?o.handles:p.handles;for(let g of m){let P=i.normalize(g.replace(n.mountpoint,"/")).substring(1);if(p.type==="local"){let A=x.get(P),G=await r.loadRemoteEntry(A);r.storeLocalEntry(g,G)}else{let A=r.loadLocalEntry(g);await r.storeRemoteEntry(x,P,A)}}for(let g of u)if(p.type==="local")r.removeLocalEntry(g);else{let P=i.normalize(g.replace(n.mountpoint,"/")).substring(1);await r.removeRemoteEntry(x,P)}},"reconcile")};t.FS.filesystems.NATIVEFS_ASYNC=r}l(It,"initializeNativeFS");var Te=l(async t=>{let e=[];async function a(r){for await(let n of r.values())e.push(n),n.kind==="directory"&&await a(n)}l(a,"collect"),await a(t);let i=new Map;i.set(".",t);for(let r of e){let n=(await t.resolve(r)).join("/");i.set(n,r)}return i},"getFsHandles"),Ne=Fe("AGFzbQEAAAABDANfAGAAAW9gAW8BfwMDAgECByECD2NyZWF0ZV9zZW50aW5lbAAAC2lzX3NlbnRpbmVsAAEKEwIHAPsBAPsbCwkAIAD7GvsUAAs="),qe=(async function(){if(!(globalThis.navigator&&(/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&typeof navigator.maxTouchPoints<"u"&&navigator.maxTouchPoints>1)))try{let t=await WebAssembly.compile(Ne);return await WebAssembly.instantiate(t)}catch(t){if(t instanceof WebAssembly.CompileError)return;throw t}})();async function Ot(){let t=await qe;if(t)return t.exports;let e=Symbol("error marker");return{create_sentinel:l(()=>e,"create_sentinel"),is_sentinel:l(a=>a===e,"is_sentinel")}}l(Ot,"getSentinelImport");function Rt(t){let e={config:t,runtimeEnv:w},a={noImageDecoding:!0,noAudioDecoding:!0,noWasmDecoding:!1,preRun:Ut(t),print:t.stdout,printErr:t.stderr,onExit(i){a.exitCode=i},thisProgram:t._sysExecutable,arguments:t.args,API:e,locateFile:l(i=>t.indexURL+i,"locateFile"),instantiateWasm:Wt(t.indexURL)};return a}l(Rt,"createSettings");function Mt(t){return function(e){let a="/";try{e.FS.mkdirTree(t)}catch(i){console.error(`Error occurred while making a home directory '${t}':`),console.error(i),console.error(`Using '${a}' for a home directory instead`),t=a}e.FS.chdir(t)}}l(Mt,"createHomeDirectory");function Lt(t){return function(e){Object.assign(e.ENV,t)}}l(Lt,"setEnvironment");function jt(t){return t?[async e=>{e.addRunDependency("fsInitHook");try{await t(e.FS,{sitePackages:e.API.sitePackages})}finally{e.removeRunDependency("fsInitHook")}}]:[]}l(jt,"callFsInitHook");function $t(t){let e=t.HEAPU32[t._Py_Version>>>2],a=e>>>24&255,i=e>>>16&255,r=e>>>8&255;return[a,i,r]}l($t,"computeVersionTuple");function Vt(t){let e=Ct(t);return async a=>{a.API.pyVersionTuple=$t(a);let[i,r]=a.API.pyVersionTuple;a.FS.mkdirTree("/lib"),a.API.sitePackages=`/lib/python${i}.${r}/site-packages`,a.FS.mkdirTree(a.API.sitePackages),a.addRunDependency("install-stdlib");try{let n=await e;a.FS.writeFile(`/lib/python${i}${r}.zip`,n)}catch(n){console.error("Error occurred while installing the standard library:"),console.error(n)}finally{a.removeRunDependency("install-stdlib")}}}l(Vt,"installStdlib");function Ut(t){let e;return t.stdLibURL!=null?e=t.stdLibURL:e=t.indexURL+"python_stdlib.zip",[Vt(e),Mt(t.env.HOME),Lt(t.env),It,...jt(t.fsInit)]}l(Ut,"getFileSystemInitializationFuncs");function Wt(t){if(typeof WasmOffsetConverter<"u")return;let{binary:e,response:a}=H(t+"pyodide.asm.wasm"),i=Ot();return function(r,n){return(async function(){r.sentinel=await i;try{let o;a?o=await WebAssembly.instantiateStreaming(a,r):o=await WebAssembly.instantiate(await e,r);let{instance:p,module:c}=o;n(p,c)}catch(o){console.warn("wasm instantiation failed!"),console.warn(o)}})(),{}}}l(Wt,"getInstantiateWasmFunc");var Be="0.29.0";function V(t){return t===void 0||t.endsWith("/")?t:t+"/"}l(V,"withTrailingSlash");var nt=Be;async function Ht(t={}){var r,n;if(await ot(),t.lockFileContents&&t.lockFileURL)throw new Error("Can't pass both lockFileContents and lockFileURL");let e=t.indexURL||await qt();if(e=V(W(e)),t.packageBaseUrl=V(t.packageBaseUrl),t.cdnUrl=V(t.packageBaseUrl??`https://cdn.jsdelivr.net/pyodide/v${nt}/full/`),!t.lockFileContents){let o=t.lockFileURL??e+"pyodide-lock.json";t.lockFileContents=Nt(o),t.packageBaseUrl??(t.packageBaseUrl=Bt(o))}t.indexURL=e,t.packageCacheDir&&(t.packageCacheDir=V(W(t.packageCacheDir)));let a={fullStdLib:!1,jsglobals:globalThis,stdin:globalThis.prompt?()=>globalThis.prompt():void 0,args:[],env:{},packages:[],packageCacheDir:t.packageBaseUrl,enableRunUntilComplete:!0,checkAPIVersion:!0,BUILD_ID:"761936574707325565bed16f46bb59050f9a5477dab28ba3db09f3fb41ea89e7"},i=Object.assign(a,t);return(r=i.env).HOME??(r.HOME="/home/pyodide"),(n=i.env).PYTHONINSPECT??(n.PYTHONINSPECT="1"),i}l(Ht,"initializeConfiguration");function Gt(t){let e=Rt(t),a=e.API;return a.lockFilePromise=Promise.resolve(t.lockFileContents),e}l(Gt,"createEmscriptenSettings");async function Yt(t){if(typeof _createPyodideModule!="function"){let e=`${t.indexURL}pyodide.asm.js`;await $(e)}}l(Yt,"loadWasmScript");async function Xt(t,e){if(!t._loadSnapshot)return;let a=await t._loadSnapshot,i=ArrayBuffer.isView(a)?a:new Uint8Array(a);return e.noInitialRun=!0,e.INITIAL_MEMORY=i.length,i}l(Xt,"prepareSnapshot");async function Zt(t){let e=await _createPyodideModule(t);if(t.exitCode!==void 0)throw new e.ExitStatus(t.exitCode);return e}l(Zt,"createPyodideModule");function Qt(t,e){let a=t.API;if(e.pyproxyToStringRepr&&a.setPyProxyToStringMethod(!0),e.convertNullToNone&&a.setCompatNullToNone(!0),e.toJsLiteralMap&&a.setCompatToJsLiteralMap(!0),a.version!==nt&&e.checkAPIVersion)throw new Error(`Pyodide version does not match: '${nt}' <==> '${a.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`);t.locateFile=i=>{throw i.endsWith(".so")?new Error(`Failed to find dynamic library "${i}"`):new Error(`Unexpected call to locateFile("${i}")`)}}l(Qt,"configureAPI");function Jt(t,e,a){let i=t.API,r;return e&&(r=i.restoreSnapshot(e)),i.finalizeBootstrap(r,a._snapshotDeserializer)}l(Jt,"bootstrapPyodide");async function Kt(t,e){let a=t._api;return a.sys.path.insert(0,""),a._pyodide.set_excepthook(),await a.packageIndexReady,a.initializeStreams(e.stdin,e.stdout,e.stderr),t}l(Kt,"finalizeSetup");async function te(t={}){let e=await Ht(t),a=Gt(e);await Yt(e);let i=await Xt(e,a),r=await Zt(a);Qt(r,e);let n=Jt(r,i,e);return await Kt(n,e)}l(te,"loadPyodide");let z=null,Z=!1,at=null,Q=[],U=[];async function ee(t=null){return z||(Z||(Z=!0,at=(async()=>{try{t&&t("正在加载 Pyodide 运行时..."),console.log("Initializing Pyodide...");const e="/tools/",a=`${e.endsWith("/")?e:e+"/"}pyodide/`;console.log("Pyodide base URL:",a),t&&t("正在初始化 Python 环境..."),z=await te({indexURL:a}),z.setStdout({batched:i=>{console.log("Python stdout:",i),Q.push(i)}}),z.setStderr({batched:i=>{console.warn("Python stderr:",i),U.push(i)}}),t&&t("正在加载科学计算库..."),console.log("Loading packages..."),await z.loadPackage(["numpy","matplotlib","scipy","sympy","pandas"]),t&&t("正在配置环境...");try{console.log("Downloading Chinese font...");const i=`${e.endsWith("/")?e:e+"/"}NotoSansSC-Regular.ttf`,r=await fetch(i);if(r.ok){const n=await r.arrayBuffer();z.FS.writeFile("/home/pyodide/NotoSansSC-Regular.ttf",new Uint8Array(n)),console.log("Font downloaded and saved.")}else console.warn("Font download failed:",r.status,r.statusText)}catch(i){console.warn("Failed to download Chinese font:",i)}return await z.runPythonAsync(`
        import matplotlib
        matplotlib.use('AGG')
        import matplotlib.pyplot as plt
        import matplotlib.font_manager as fm
        import os
        import io
        import base64
        
        # Configure font
        font_path = '/home/pyodide/NotoSansSC-Regular.ttf'
        if os.path.exists(font_path):
            try:
                fm.fontManager.addfont(font_path)
                prop = fm.FontProperties(fname=font_path)
                plt.rcParams['font.family'] = prop.get_name()
                plt.rcParams['axes.unicode_minus'] = False
                print(f"Font loaded: {prop.get_name()}")
            except Exception as e:
                print(f"Warning: Failed to load custom font: {e}")
      `),Z=!1,t&&t("准备就绪！"),console.log("Pyodide ready!"),z}catch(e){throw Z=!1,console.error("Pyodide init error:",e),new Error(`Failed to initialize Pyodide: ${e.message}`)}})()),at)}async function Ie(t,e=null){console.log("runPythonCode called with code length:",t.length);const a=await ee(e);try{Q=[],U=[],a.runPython(`
import sys
import io
import base64
import matplotlib.pyplot as plt

# Store plots
_plots = []

# Override plt.show() to capture plots
_original_show = plt.show
def _custom_show(*args, **kwargs):
    global _plots
    try:
        buf = io.BytesIO()
        plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='white')
        buf.seek(0)
        img_base64 = base64.b64encode(buf.read()).decode('utf-8')
        _plots.append(img_base64)
    except Exception as e:
        print(f"Plotting error: {e}")
    finally:
        plt.close('all')
        buf.close()

plt.show = _custom_show

try:
    # Execute user code
    # We use exec/compile/eval logic if needed, or just let runPythonAsync handle it
    # But to inject local variables like _plots, we need to run in global scope or pass globals
    pass
except Exception as e:
    raise e
`),console.log("Executing user code..."),await a.runPythonAsync(t),console.log("User code execution finished");const r=a.globals.get("_plots"),n=r?r.toJs():[];return r&&r.destroy(),U.length>0,{output:Q.join(`
`),plots:n,error:U.length>0?U.join(`
`):null}}catch(i){console.error("Execution error:",i);let r=i.message;return r.includes("PythonError:")&&(r=r.split("PythonError:")[1].trim()),{output:Q.join(`
`),plots:[],error:r}}}function mt(t,e=!1){try{return ke.renderToString(t,{displayMode:e,throwOnError:!1,trust:!0,strict:!1})}catch(a){return console.error("KaTeX rendering error:",a),`<span class="katex-error">${t}</span>`}}function ut(t){if(!t)return"";let e=t.replace(/\$\$([\s\S]+?)\$\$/g,(a,i)=>`<div class="math-block">${mt(i.trim(),!0)}</div>`);return e=e.replace(/\$([^$]+?)\$/g,(a,i)=>`<span class="math-inline">${mt(i.trim(),!1)}</span>`),e}const ae={id:"numpy",icon:"🔢"},Oe={...ae,title:"NumPy",description:"NumPy 是 Python 科学计算的基础库，提供高性能的多维数组对象和丰富的数学函数。",sections:[{id:"array-basics",title:"数组基础",description:"NumPy 的核心是 ndarray（N-dimensional array）对象，它是一个快速、灵活的大型数据集容器。",concepts:[{name:"ndarray 创建",explanation:"ndarray 是 NumPy 的核心数据结构，可以通过多种方式创建：从 Python 列表、使用内置函数（zeros, ones, arange）等。",math:"\\mathbf{A} \\in \\mathbb{R}^{m \\times n}"},{name:"数组属性",explanation:"数组具有重要属性：shape（形状）、dtype（数据类型）、ndim（维度数）、size（元素总数）。",math:"\\text{shape} = (n_1, n_2, ..., n_k), \\quad \\text{size} = \\prod_{i=1}^{k} n_i"}],examples:[{title:"创建一维数组",code:`import numpy as np

# 从列表创建数组
# Create array from list
arr = np.array([1, 2, 3, 4, 5])
print("Array:", arr)
print("Shape:", arr.shape)
print("Dtype:", arr.dtype)
print("NDim:", arr.ndim)`,explanation:"使用 np.array() 从 Python 列表创建 NumPy 数组，并查看其基本属性。"},{title:"创建二维数组",code:`import numpy as np

# 创建 2x3 的二维数组
# Create 2x3 array
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)
print("Shape:", arr.shape)
print("Size:", arr.size)`,explanation:"二维数组类似于矩阵，shape 返回 (行数, 列数)。"},{title:"使用内置函数创建数组",code:`import numpy as np

# 创建全零数组 / Zeros
zeros = np.zeros((3, 4))
print("Zeros:\\n", zeros)

# 创建全一数组 / Ones
ones = np.ones((2, 3))
print("\\nOnes:\\n", ones)

# 创建等差数列 / Arange
arange = np.arange(0, 10, 2)
print("\\nArange:", arange)

# 创建等分数列 / Linspace
linspace = np.linspace(0, 1, 5)
print("Linspace:", linspace)`,explanation:"NumPy 提供了多种便捷函数来创建特定模式的数组。"}]},{id:"array-operations",title:"数组操作",description:"NumPy 提供了强大的数组索引、切片和变形功能。",concepts:[{name:"索引和切片",explanation:"类似 Python 列表，但支持多维索引。使用 [start:stop:step] 语法进行切片。",math:"A[i, j] \\text{ 访问第 } i \\text{ 行第 } j \\text{ 列元素}"},{name:"数组变形",explanation:"reshape() 可以改变数组形状而不改变数据，flatten() 和 ravel() 可以将多维数组展平。",math:"\\mathbf{A}_{m \\times n} \\xrightarrow{\\text{reshape}} \\mathbf{B}_{p \\times q}, \\quad mn = pq"}],examples:[{title:"数组索引",code:`import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("Array:\\n", arr)

# 访问单个元素
print("\\narr[0, 0] =", arr[0, 0])
print("arr[1, 2] =", arr[1, 2])

# 访问整行
print("\\nRow 0:", arr[0, :])

# 访问整列
print("Col 1:", arr[:, 1])`,explanation:"使用 [row, col] 语法访问二维数组元素，冒号 : 表示选择所有。"},{title:"数组切片",code:`import numpy as np

arr = np.arange(12).reshape(3, 4)
print("Array:\\n", arr)

# 切片前两行
print("\\nFirst 2 rows:\\n", arr[:2, :])

# 切片后两列
print("\\nLast 2 cols:\\n", arr[:, 2:])

# 子矩阵
print("\\nSubmatrix:\\n", arr[1:3, 1:3])`,explanation:"切片操作返回原数组的视图，修改切片会影响原数组。"},{title:"数组变形",code:`import numpy as np

arr = np.arange(12)
print("Array:", arr)

# 变形为 3x4
reshaped = arr.reshape(3, 4)
print("\\n3x4 Array:\\n", reshaped)

# 变形为 2x6
reshaped2 = arr.reshape(2, 6)
print("\\n2x6 Array:\\n", reshaped2)

# 展平
flattened = reshaped.flatten()
print("\\nFlattened:", flattened)`,explanation:"reshape() 要求新形状的元素总数与原数组相同。"}]},{id:"math-operations",title:"数学运算",description:"NumPy 支持元素级运算、广播机制和丰富的数学函数。",concepts:[{name:"元素级运算",explanation:"算术运算符（+, -, *, /）默认进行元素级运算，不是矩阵运算。",math:"(\\mathbf{A} + \\mathbf{B})_{ij} = A_{ij} + B_{ij}"},{name:"广播机制",explanation:"当两个数组形状不同时，NumPy 会自动扩展较小的数组以匹配较大数组的形状。",math:"\\mathbf{A}_{m \\times n} + \\mathbf{b}_{1 \\times n} = \\mathbf{C}_{m \\times n}"},{name:"线性代数",explanation:"NumPy 提供矩阵乘法（@或dot）、转置、行列式、特征值等线性代数运算。",math:"\\mathbf{C} = \\mathbf{A} \\mathbf{B}, \\quad C_{ij} = \\sum_{k} A_{ik} B_{kj}"}],examples:[{title:"基本运算",code:`import numpy as np

a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

print("a + b =", a + b)
print("a - b =", a - b)
print("a * b =", a * b)
print("a / b =", a / b)
print("a ** 2 =", a ** 2)`,explanation:"所有运算都是元素对元素进行的。"},{title:"广播示例",code:`import numpy as np

# 矩阵加标量
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)
print("\\n+ 10:\\n", arr + 10)

# 矩阵加向量
vec = np.array([1, 2, 3])
print("\\n+ Vector [1,2,3]:\\n", arr + vec)`,explanation:"标量和向量会自动广播到矩阵的每一行。"},{title:"统计函数",code:`import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)

print("\\nSum:", np.sum(arr))
print("Mean:", np.mean(arr))
print("Std:", np.std(arr))
print("Max:", np.max(arr))
print("Min:", np.min(arr))

# 按轴计算
print("\\nSum (axis=0):", np.sum(arr, axis=0))
print("Sum (axis=1):", np.sum(arr, axis=1))`,explanation:"axis=0 表示沿列方向（跨行），axis=1 表示沿行方向（跨列）。"},{title:"线性代数运算",code:`import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print("Matrix A:\\n", A)
print("\\nMatrix B:\\n", B)

# 矩阵乘法
print("\\nA @ B =\\n", A @ B)

# 转置
print("\\nA Transpose:\\n", A.T)

# 行列式
print("\\nDet(A):", np.linalg.det(A))

# 逆矩阵
print("\\nInv(A):\\n", np.linalg.inv(A))`,explanation:"使用 @ 运算符或 np.dot() 进行矩阵乘法，linalg 模块提供线性代数函数。"}]},{id:"random",title:"随机数生成",description:"NumPy 提供了强大的随机数生成功能，用于模拟和统计分析。",concepts:[{name:"随机数生成器",explanation:"np.random 模块提供各种分布的随机数生成函数。",math:"X \\sim \\mathcal{N}(\\mu, \\sigma^2)"},{name:"随机种子",explanation:"设置随机种子可以使随机数生成可重复，便于调试和验证。",math:"\\text{seed}(s) \\Rightarrow \\text{reproducible sequence}"}],examples:[{title:"基本随机数",code:`import numpy as np

# 设置随机种子
np.random.seed(42)

# 0-1 均匀分布
uniform = np.random.random(5)
print("Uniform:", uniform)

# 指定范围的随机整数
integers = np.random.randint(0, 10, size=5)
print("Integers:", integers)

# 标准正态分布
normal = np.random.randn(5)
print("Normal:", normal)`,explanation:"random() 生成 [0,1) 的均匀分布，randn() 生成标准正态分布。"},{title:"多维随机数组",code:`import numpy as np

np.random.seed(42)

# 2x3 的随机数组
arr = np.random.random((2, 3))
print("Random Array:\\n", arr)

# 正态分布数组
normal_arr = np.random.normal(loc=0, scale=1, size=(3, 3))
print("\\nNormal Array:\\n", normal_arr)`,explanation:"size 参数指定生成数组的形状。"},{title:"随机选择和打乱",code:`import numpy as np

np.random.seed(42)

arr = np.arange(10)
print("Original:", arr)

# 随机选择
choice = np.random.choice(arr, size=5, replace=False)
print("\\nChoice 5:", choice)

# 打乱数组
np.random.shuffle(arr)
print("Shuffled:", arr)`,explanation:"choice() 可以随机选择元素，shuffle() 原地打乱数组。"}]}]},Re={...ae,title:"NumPy",description:"NumPy is the fundamental package for scientific computing in Python, providing high-performance multidimensional array objects and tools.",sections:[{id:"array-basics",title:"Array Basics",description:"The core of NumPy is the ndarray (N-dimensional array) object, a fast and flexible container for large datasets.",concepts:[{name:"ndarray Creation",explanation:"ndarrays can be created in several ways: from Python lists, using built-in functions (zeros, ones, arange), etc.",math:"\\mathbf{A} \\in \\mathbb{R}^{m \\times n}"},{name:"Array Properties",explanation:"Important attributes include: shape, dtype (data type), ndim (number of dimensions), and size (total elements).",math:"\\text{shape} = (n_1, n_2, ..., n_k), \\quad \\text{size} = \\prod_{i=1}^{k} n_i"}],examples:[{title:"Create 1D Array",code:`import numpy as np

# Create array from list
arr = np.array([1, 2, 3, 4, 5])
print("Array:", arr)
print("Shape:", arr.shape)
print("Dtype:", arr.dtype)
print("NDim:", arr.ndim)`,explanation:"Create a NumPy array from a python list using np.array() and inspect its basic properties."},{title:"Create 2D Array",code:`import numpy as np

# Create 2x3 array
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)
print("Shape:", arr.shape)
print("Size:", arr.size)`,explanation:"2D arrays are like matrices. The shape returns (rows, cols)."},{title:"Built-in Creation Functions",code:`import numpy as np

# Create Zeros
zeros = np.zeros((3, 4))
print("Zeros:\\n", zeros)

# Create Ones
ones = np.ones((2, 3))
print("\\nOnes:\\n", ones)

# Create Arange
arange = np.arange(0, 10, 2)
print("\\nArange:", arange)

# Create Linspace
linspace = np.linspace(0, 1, 5)
print("Linspace:", linspace)`,explanation:"NumPy provides convenient functions to create arrays with specific patterns like zeros, ones, or ranges."}]},{id:"array-operations",title:"Array Operations",description:"NumPy offers powerful indexing, slicing, and reshaping capabilities for efficient data access and modification.",concepts:[{name:"Indexing & Slicing",explanation:"Similar to Python lists but supports multi-dimensional, boolean, and integer array indexing. Slices are views of the original array.",math:"A[i, j] \\text{ access element at row } i \\text{ col } j"},{name:"Reshaping",explanation:"reshape() changes the shape of an array without changing its data. flatten() converts multidimensional arrays to 1D.",math:"\\mathbf{A}_{m \\times n} \\xrightarrow{\\text{reshape}} \\mathbf{B}_{p \\times q}, \\quad mn = pq"}],examples:[{title:"Array Indexing",code:`import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("Array:\\n", arr)

# Access element
print("\\narr[0, 0] =", arr[0, 0])
print("arr[1, 2] =", arr[1, 2])

# Access row
print("\\nRow 0:", arr[0, :])

# Access col
print("Col 1:", arr[:, 1])`,explanation:'Use [row, col] syntax to access elements. Colon ":" selects entire range for that axis.'},{title:"Array Slicing",code:`import numpy as np

arr = np.arange(12).reshape(3, 4)
print("Array:\\n", arr)

# First 2 rows
print("\\nFirst 2 rows:\\n", arr[:2, :])

# Last 2 cols
print("\\nLast 2 cols:\\n", arr[:, 2:])

# Submatrix
print("\\nSubmatrix:\\n", arr[1:3, 1:3])`,explanation:"Slicing returns a view of the original array. Modifying the slice affects the original data."},{title:"Array Reshaping",code:`import numpy as np

arr = np.arange(12)
print("Array:", arr)

# Reshape to 3x4
reshaped = arr.reshape(3, 4)
print("\\n3x4 Array:\\n", reshaped)

# Reshape to 2x6
reshaped2 = arr.reshape(2, 6)
print("\\n2x6 Array:\\n", reshaped2)

# Flatten
flattened = reshaped.flatten()
print("\\nFlattened:", flattened)`,explanation:"reshape() requires the total number of elements to match. Compatible shapes are required."}]},{id:"math-operations",title:"Math Operations",description:"Support for element-wise operations, broadcasting, and linear algebra.",concepts:[{name:"Element-wise Operations",explanation:"Arithmetic operators (+, -, *, /) work element-wise by default.",math:"(\\mathbf{A} + \\mathbf{B})_{ij} = A_{ij} + B_{ij}"},{name:"Broadcasting",explanation:"NumPy treats arrays with different shapes during arithmetic operations by automatically expanding the smaller one.",math:"\\mathbf{A}_{m \\times n} + \\mathbf{b}_{1 \\times n} = \\mathbf{C}_{m \\times n}"},{name:"Linear Algebra",explanation:"Matrix multiplication (@ or dot), transposition, determinants, and eigenvalues are supported via the linalg module.",math:"\\mathbf{C} = \\mathbf{A} \\mathbf{B}, \\quad C_{ij} = \\sum_{k} A_{ik} B_{kj}"}],examples:[{title:"Basic Arithmetic",code:`import numpy as np

a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

print("a + b =", a + b)
print("a - b =", a - b)
print("a * b =", a * b)
print("a / b =", a / b)
print("a ** 2 =", a ** 2)`,explanation:"Basic operations are applied element-by-element."},{title:"Broadcasting Example",code:`import numpy as np

# Matrix + scalar
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)
print("\\n+ 10:\\n", arr + 10)

# Matrix + vector
vec = np.array([1, 2, 3])
print("\\n+ Vector [1,2,3]:\\n", arr + vec)`,explanation:"Scalars and vectors are broadcast to match the dimensions of larger matrices."},{title:"Statistical Functions",code:`import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])
print("Array:\\n", arr)

print("\\nSum:", np.sum(arr))
print("Mean:", np.mean(arr))
print("Std:", np.std(arr))
print("Max:", np.max(arr))
print("Min:", np.min(arr))

# Axis operations
print("\\nSum (axis=0):", np.sum(arr, axis=0))
print("Sum (axis=1):", np.sum(arr, axis=1))`,explanation:"Functions like sum, mean, std reduce dimensions unless an axis is specified."},{title:"Linear Algebra",code:`import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print("Matrix A:\\n", A)
print("\\nMatrix B:\\n", B)

# Matrix multiplication
print("\\nA @ B =\\n", A @ B)

# Transpose
print("\\nA Transpose:\\n", A.T)

# Determinant
print("\\nDet(A):", np.linalg.det(A))

# Inverse
print("\\nInv(A):\\n", np.linalg.inv(A))`,explanation:"Use @ for matrix multiplication. The linalg module provides advanced solvers."}]},{id:"random",title:"Random Number Generation",description:"Generate random numbers for simulations and statistical analysis.",concepts:[{name:"Random Generator",explanation:"np.random module provides functions for Uniform, Normal, and other distributions.",math:"X \\sim \\mathcal{N}(\\mu, \\sigma^2)"},{name:"Random Seed",explanation:"Setting a seed ensures reproducibility of random sequences.",math:"\\text{seed}(s) \\Rightarrow \\text{reproducible sequence}"}],examples:[{title:"Basic Random Numbers",code:`import numpy as np

# Set seed
np.random.seed(42)

# Uniform
uniform = np.random.random(5)
print("Uniform:", uniform)

# Randint
integers = np.random.randint(0, 10, size=5)
print("Integers:", integers)

# Normal
normal = np.random.randn(5)
print("Normal:", normal)`,explanation:"Generate random floats in [0,1), standard normal values, or random integers."},{title:"Random Arrays",code:`import numpy as np

np.random.seed(42)

# Random 2x3
arr = np.random.random((2, 3))
print("Random Array:\\n", arr)

# Normal Array
normal_arr = np.random.normal(loc=0, scale=1, size=(3, 3))
print("\\nNormal Array:\\n", normal_arr)`,explanation:"Most random functions accept a size argument to generate multi-dimensional arrays directly."},{title:"Shuffle & Choice",code:`import numpy as np

np.random.seed(42)

arr = np.arange(10)
print("Original:", arr)

# Choice
choice = np.random.choice(arr, size=5, replace=False)
print("\\nChoice 5:", choice)

# Shuffle
np.random.shuffle(arr)
print("Shuffled:", arr)`,explanation:"choice picks random elements; shuffle randomizes the array order in-place."}]}]},ft={zh:Oe,en:Re},ie={id:"matplotlib",icon:"📊"},Me={...ie,title:"Matplotlib",description:"Matplotlib 是 Python 最流行的绘图库，可以创建高质量的静态、动态和交互式可视化。",sections:[{id:"basic-plotting",title:"基础绘图",description:"Matplotlib 的核心是 pyplot 接口，提供类似 MATLAB 的绘图方式。",concepts:[{name:"线图",explanation:"plot() 函数是最基本的绘图函数，用于绘制线图和散点图。",math:"y = f(x), \\quad x \\in [a, b]"},{name:"图形元素",explanation:"一个完整的图形包括：标题、坐标轴标签、图例、网格等元素。",math:"\\text{Figure} \\supset \\text{Axes} \\supset \\text{Plot}"}],examples:[{title:"简单线图",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y)
plt.title('Sine Function')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True, alpha=0.3)
plt.show()

print("图形已生成")`,explanation:"linspace 生成均匀分布的点，plot 绘制连续的线。"},{title:"多条曲线",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)
y1 = np.sin(x)
y2 = np.cos(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y1, label='sin(x)', linewidth=2)
plt.plot(x, y2, label='cos(x)', linewidth=2)
plt.title('Trigonometric Functions')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("图形已生成")`,explanation:"label 参数用于图例，legend() 显示图例。"},{title:"散点图",code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
x = np.random.randn(50)
y = np.random.randn(50)
colors = np.random.rand(50)
sizes = 1000 * np.random.rand(50)

plt.figure(figsize=(8, 6))
plt.scatter(x, y, c=colors, s=sizes, alpha=0.6, cmap='viridis')
plt.colorbar(label='Color Value')
plt.title('Scatter Plot Example')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.grid(True, alpha=0.3)
plt.show()

print("散点图已生成")`,explanation:"scatter() 绘制散点图，c 控制颜色，s 控制大小，alpha 控制透明度。"},{title:"子图",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)

fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title('sin(x)')
axes[0, 0].grid(True, alpha=0.3)

axes[0, 1].plot(x, np.cos(x), 'r')
axes[0, 1].set_title('cos(x)')
axes[0, 1].grid(True, alpha=0.3)

axes[1, 0].plot(x, np.tan(x))
axes[1, 0].set_title('tan(x)')
axes[1, 0].set_ylim(-5, 5)
axes[1, 0].grid(True, alpha=0.3)

axes[1, 1].plot(x, np.exp(-x/5) * np.sin(x))
axes[1, 1].set_title('Decaying Oscillation')
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("子图已生成")`,explanation:"subplots() 创建多个子图，tight_layout() 自动调整间距。"}]},{id:"advanced-plots",title:"高级可视化",description:"Matplotlib 支持多种图表类型，适用于不同的数据展示需求。",concepts:[{name:"柱状图",explanation:"bar() 用于绘制柱状图，适合展示分类数据的比较。",math:"\\text{categories} \\times \\text{values}"},{name:"直方图",explanation:"hist() 用于显示数据分布，将连续数据分组到区间（bins）中。",math:"h_i = \\sum_{x_j \\in [b_i, b_{i+1})} 1"}],examples:[{title:"柱状图",code:`import numpy as np
import matplotlib.pyplot as plt

categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]

plt.figure(figsize=(8, 5))
bars = plt.bar(categories, values, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'])
plt.title('Bar Chart Example', fontsize=14, fontweight='bold')
plt.xlabel('Category')
plt.ylabel('Value')
plt.grid(axis='y', alpha=0.3)

# Add value labels
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height,
             f'{height}', ha='center', va='bottom')

plt.show()
print("柱状图已生成")`,explanation:"bar() 创建柱状图，可以自定义颜色和添加数值标签。"},{title:"直方图",code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = np.random.normal(100, 15, 1000)

plt.figure(figsize=(8, 5))
plt.hist(data, bins=30, color='skyblue', edgecolor='black', alpha=0.7)
plt.title('Normal Distribution Histogram')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.grid(axis='y', alpha=0.3)
plt.axvline(data.mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {data.mean():.2f}')
plt.legend()
plt.show()

print(f"Mean: {data.mean():.2f}")
print(f"Std Dev: {data.std():.2f}")`,explanation:"hist() 自动将数据分组，bins 参数控制组数。"},{title:"饼图",code:`import matplotlib.pyplot as plt

labels = ['Python', 'JavaScript', 'Java', 'C++', 'Others']
sizes = [35, 25, 20, 12, 8]
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
explode = (0.1, 0, 0, 0, 0)  # Explode 1st slice

plt.figure(figsize=(8, 6))
plt.pie(sizes, explode=explode, labels=labels, colors=colors,
        autopct='%1.1f%%', shadow=True, startangle=90)
plt.title('Programming Language Usage')
plt.axis('equal')
plt.show()

print("饼图已生成")`,explanation:"pie() 创建饼图，autopct 显示百分比，explode 可以突出某些扇区。"},{title:"箱线图",code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = [np.random.normal(0, std, 100) for std in range(1, 5)]

plt.figure(figsize=(8, 5))
bp = plt.boxplot(data, labels=['A', 'B', 'C', 'D'], patch_artist=True)

# Custom colors
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
for patch, color in zip(bp['boxes'], colors):
    patch.set_facecolor(color)
    patch.set_alpha(0.7)

plt.title('Box Plot Example')
plt.xlabel('Group')
plt.ylabel('Value')
plt.grid(axis='y', alpha=0.3)
plt.show()

print("箱线图已生成")`,explanation:"箱线图显示数据的分布特征：中位数、四分位数、异常值等。"}]},{id:"customization",title:"样式定制",description:"通过样式、颜色、标记等定制图形外观。",concepts:[{name:"线条样式",explanation:"可以设置线条的颜色、宽度、样式（实线、虚线等）和标记。",math:"\\text{style} = \\text{color} + \\text{marker} + \\text{linestyle}"},{name:"颜色映射",explanation:"colormap 将数值映射到颜色，常用于热图和等高线图。",math:"c: \\mathbb{R} \\to \\text{RGB}"}],examples:[{title:"线条样式",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)

plt.figure(figsize=(10, 6))
plt.plot(x, np.sin(x), 'r-', linewidth=2, label='Solid')
plt.plot(x, np.sin(x-0.5), 'b--', linewidth=2, label='Dashed')
plt.plot(x, np.sin(x-1), 'g-.', linewidth=2, label='Dash-dot')
plt.plot(x, np.sin(x-1.5), 'm:', linewidth=2, label='Dotted')
plt.plot(x, np.sin(x-2), 'ko-', markersize=4, label='Marker')

plt.title('Line Styles', fontsize=14)
plt.xlabel('x')
plt.ylabel('y')
plt.legend(loc='upper right')
plt.grid(True, alpha=0.3)
plt.show()

print("样式图已生成")`,explanation:'线条样式字符串格式：[颜色][标记][线型]，如 "ro-" 表示红色圆点实线。'},{title:"热图",code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = np.random.rand(10, 10)

plt.figure(figsize=(8, 6))
im = plt.imshow(data, cmap='hot', interpolation='nearest')
plt.colorbar(im, label='Value')
plt.title('Heatmap Example')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')

# Add text annotations
for i in range(10):
    for j in range(10):
        text = plt.text(j, i, f'{data[i, j]:.2f}',
                       ha="center", va="center", color="w", fontsize=8)

plt.show()
print("热图已生成")`,explanation:"imshow() 显示二维数组为图像，cmap 指定颜色映射方案。"},{title:"等高线图",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-3, 3, 100)
y = np.linspace(-3, 3, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

plt.figure(figsize=(10, 4))

# Filled contour
plt.subplot(1, 2, 1)
plt.contourf(X, Y, Z, levels=20, cmap='viridis')
plt.colorbar(label='Z Value')
plt.title('Filled Contour')
plt.xlabel('X')
plt.ylabel('Y')

# Line contour
plt.subplot(1, 2, 2)
CS = plt.contour(X, Y, Z, levels=10, colors='black')
plt.clabel(CS, inline=True, fontsize=8)
plt.title('Line Contour')
plt.xlabel('X')
plt.ylabel('Y')

plt.tight_layout()
plt.show()

print("等高线图已生成")`,explanation:"contour() 绘制等高线，contourf() 填充等高线之间的区域。"}]}]},Le={...ie,title:"Matplotlib",description:"Matplotlib is Python's most popular plotting library, used for creating high-quality static, animated, and interactive visualizations.",sections:[{id:"basic-plotting",title:"Basic Plotting",description:"The core of Matplotlib is the pyplot interface, which provides a MATLAB-like way of plotting.",concepts:[{name:"Line Plot",explanation:"The plot() function is the most basic plotting function, used for line plots and scatter plots.",math:"y = f(x), \\quad x \\in [a, b]"},{name:"Figure Elements",explanation:"A complete plot includes: Title, axis labels, legend, grid, and other elements.",math:"\\text{Figure} \\supset \\text{Axes} \\supset \\text{Plot}"}],examples:[{title:"Simple Line Plot",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y)
plt.title('Sine Function')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True, alpha=0.3)
plt.show()

print("Plot generated")`,explanation:"linspace generates evenly spaced points, plot draws a continuous line."},{title:"Multiple Curves",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)
y1 = np.sin(x)
y2 = np.cos(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y1, label='sin(x)', linewidth=2)
plt.plot(x, y2, label='cos(x)', linewidth=2)
plt.title('Trigonometric Functions')
plt.xlabel('x')
plt.ylabel('y')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Plot generated")`,explanation:"The label parameter is used for the legend, and legend() displays it."},{title:"Scatter Plot",code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
x = np.random.randn(50)
y = np.random.randn(50)
colors = np.random.rand(50)
sizes = 1000 * np.random.rand(50)

plt.figure(figsize=(8, 6))
plt.scatter(x, y, c=colors, s=sizes, alpha=0.6, cmap='viridis')
plt.colorbar(label='Color Value')
plt.title('Scatter Plot Example')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.grid(True, alpha=0.3)
plt.show()

print("Scatter plot generated")`,explanation:"scatter() draws scatter plots. c controls color, s controls size, alpha controls transparency."},{title:"Subplots",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)

fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(x, np.sin(x))
axes[0, 0].set_title('sin(x)')
axes[0, 0].grid(True, alpha=0.3)

axes[0, 1].plot(x, np.cos(x), 'r')
axes[0, 1].set_title('cos(x)')
axes[0, 1].grid(True, alpha=0.3)

axes[1, 0].plot(x, np.tan(x))
axes[1, 0].set_title('tan(x)')
axes[1, 0].set_ylim(-5, 5)
axes[1, 0].grid(True, alpha=0.3)

axes[1, 1].plot(x, np.exp(-x/5) * np.sin(x))
axes[1, 1].set_title('Decaying Oscillation')
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("Subplots generated")`,explanation:"subplots() creates multiple plots, tight_layout() automatically adjusts spacing."}]},{id:"advanced-plots",title:"Advanced Visualization",description:"Matplotlib supports various chart types for different data presentation needs.",concepts:[{name:"Bar Chart",explanation:"bar() is used for bar charts, suitable for comparing categorical data.",math:"\\text{categories} \\times \\text{values}"},{name:"Histogram",explanation:"hist() is used to show data distribution, grouping continuous data into bins.",math:"h_i = \\sum_{x_j \\in [b_i, b_{i+1})} 1"}],examples:[{title:"Bar Chart",code:`import numpy as np
import matplotlib.pyplot as plt

categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]

plt.figure(figsize=(8, 5))
bars = plt.bar(categories, values, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'])
plt.title('Bar Chart Example', fontsize=14, fontweight='bold')
plt.xlabel('Category')
plt.ylabel('Value')
plt.grid(axis='y', alpha=0.3)

# Add value labels
for bar in bars:
    height = bar.get_height()
    plt.text(bar.get_x() + bar.get_width()/2., height,
             f'{height}', ha='center', va='bottom')

plt.show()
print("Bar chart generated")`,explanation:"bar() creates bar charts. You can customize colors and add value labels."},{title:"Histogram",code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = np.random.normal(100, 15, 1000)

plt.figure(figsize=(8, 5))
plt.hist(data, bins=30, color='skyblue', edgecolor='black', alpha=0.7)
plt.title('Normal Distribution Histogram')
plt.xlabel('Value')
plt.ylabel('Frequency')
plt.grid(axis='y', alpha=0.3)
plt.axvline(data.mean(), color='red', linestyle='--', linewidth=2, label=f'Mean: {data.mean():.2f}')
plt.legend()
plt.show()

print(f"Mean: {data.mean():.2f}")
print(f"Std Dev: {data.std():.2f}")`,explanation:"hist() groups data automatically. The bins parameter controls the number of groups."},{title:"Pie Chart",code:`import matplotlib.pyplot as plt

labels = ['Python', 'JavaScript', 'Java', 'C++', 'Others']
sizes = [35, 25, 20, 12, 8]
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
explode = (0.1, 0, 0, 0, 0)  # Explode 1st slice

plt.figure(figsize=(8, 6))
plt.pie(sizes, explode=explode, labels=labels, colors=colors,
        autopct='%1.1f%%', shadow=True, startangle=90)
plt.title('Programming Language Usage')
plt.axis('equal')
plt.show()

print("Pie chart generated")`,explanation:"pie() creates pie charts. autopct displays percentages, explode highlights slices."},{title:"Box Plot",code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = [np.random.normal(0, std, 100) for std in range(1, 5)]

plt.figure(figsize=(8, 5))
bp = plt.boxplot(data, labels=['A', 'B', 'C', 'D'], patch_artist=True)

# Custom colors
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
for patch, color in zip(bp['boxes'], colors):
    patch.set_facecolor(color)
    patch.set_alpha(0.7)

plt.title('Box Plot Example')
plt.xlabel('Group')
plt.ylabel('Value')
plt.grid(axis='y', alpha=0.3)
plt.show()

print("Box plot generated")`,explanation:"Box plots show data distribution characteristics: median, quartiles, outliers, etc."}]},{id:"customization",title:"Style Customization",description:"customize plot appearance with styles, colors, markers, and more.",concepts:[{name:"Line Styles",explanation:"You can set line color, width, style (solid, dashed, etc.), and markers.",math:"\\text{style} = \\text{color} + \\text{marker} + \\text{linestyle}"},{name:"Color Maps",explanation:"Colormaps map numerical values to colors, often used for heatmaps and contour plots.",math:"c: \\mathbb{R} \\to \\text{RGB}"}],examples:[{title:"Line Styles",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)

plt.figure(figsize=(10, 6))
plt.plot(x, np.sin(x), 'r-', linewidth=2, label='Solid')
plt.plot(x, np.sin(x-0.5), 'b--', linewidth=2, label='Dashed')
plt.plot(x, np.sin(x-1), 'g-.', linewidth=2, label='Dash-dot')
plt.plot(x, np.sin(x-1.5), 'm:', linewidth=2, label='Dotted')
plt.plot(x, np.sin(x-2), 'ko-', markersize=4, label='Marker')

plt.title('Line Styles', fontsize=14)
plt.xlabel('x')
plt.ylabel('y')
plt.legend(loc='upper right')
plt.grid(True, alpha=0.3)
plt.show()

print("Style plot generated")`,explanation:'Line style string format: [color][marker][linestyle], e.g., "ro-" for red dotted solid line.'},{title:"Heatmap",code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = np.random.rand(10, 10)

plt.figure(figsize=(8, 6))
im = plt.imshow(data, cmap='hot', interpolation='nearest')
plt.colorbar(im, label='Value')
plt.title('Heatmap Example')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')

# Add text annotations
for i in range(10):
    for j in range(10):
        text = plt.text(j, i, f'{data[i, j]:.2f}',
                       ha="center", va="center", color="w", fontsize=8)

plt.show()
print("Heatmap generated")`,explanation:"imshow() displays 2D arrays as images. cmap specifies the color map scheme."},{title:"Contour Plot",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(-3, 3, 100)
y = np.linspace(-3, 3, 100)
X, Y = np.meshgrid(x, y)
Z = np.sin(np.sqrt(X**2 + Y**2))

plt.figure(figsize=(10, 4))

# Filled contour
plt.subplot(1, 2, 1)
plt.contourf(X, Y, Z, levels=20, cmap='viridis')
plt.colorbar(label='Z Value')
plt.title('Filled Contour')
plt.xlabel('X')
plt.ylabel('Y')

# Line contour
plt.subplot(1, 2, 2)
CS = plt.contour(X, Y, Z, levels=10, colors='black')
plt.clabel(CS, inline=True, fontsize=8)
plt.title('Line Contour')
plt.xlabel('X')
plt.ylabel('Y')

plt.tight_layout()
plt.show()

print("Contour plot generated")`,explanation:"contour() draws contour lines, contourf() fills the regions between contour lines."}]}]},xt={zh:Me,en:Le},ne={id:"sympy",icon:"∑"},je={...ne,title:"SymPy",description:"SymPy 是 Python 的符号数学库，可以进行符号计算、代数运算、微积分等。",sections:[{id:"symbolic-basics",title:"符号计算基础",description:"SymPy 允许定义符号变量并进行精确的符号运算。",concepts:[{name:"符号定义",explanation:"使用 symbols() 定义符号变量，这些变量代表数学符号而非具体数值。",math:"x, y, z \\in \\text{Symbols}"},{name:"表达式操作",explanation:"SymPy 可以对表达式进行化简、展开、因式分解等操作。",math:"f(x) = \\sum_{i=0}^{n} a_i x^i"}],examples:[{title:"定义符号和表达式",code:`import sympy as sp
import sympy as sp

# 定义符号
x, y, z = sp.symbols('x y z')

# 创建表达式
expr = x**2 + 2*x + 1
print("表达式:", expr)

# 替换值
result = expr.subs(x, 3)
print("x=3 时的值:", result)

# 转换为数值
numeric = float(result)
print("数值结果:", numeric)`,explanation:"symbols() 创建符号变量，subs() 用于替换符号为具体值。"},{title:"化简表达式",code:`import sympy as sp

x = sp.Symbol('x')

# 化简
expr1 = sp.sin(x)**2 + sp.cos(x)**2
simplified = sp.simplify(expr1)
print("sin²(x) + cos²(x) =", simplified)

# 三角化简
expr2 = sp.sin(2*x)
trig_simplified = sp.trigsimp(sp.expand_trig(expr2))
print("\\nsin(2x) 展开:", sp.expand_trig(expr2))

# 有理化简
expr3 = (x**2 - 1)/(x - 1)
rational = sp.simplify(expr3)
print("\\n(x²-1)/(x-1) =", rational)`,explanation:"simplify() 尝试化简表达式，trigsimp() 专门用于三角函数化简。"},{title:"展开和因式分解",code:`import sympy as sp

x, y = sp.symbols('x y')

# 展开
expr = (x + y)**3
expanded = sp.expand(expr)
print("(x+y)³ 展开:", expanded)

# 因式分解
expr2 = x**2 - y**2
factored = sp.factor(expr2)
print("\\nx² - y² 因式分解:", factored)

# 多项式展开
expr3 = (x + 1)*(x + 2)*(x + 3)
expanded3 = sp.expand(expr3)
print("\\n(x+1)(x+2)(x+3) =", expanded3)

# 再因式分解回去
factored3 = sp.factor(expanded3)
print("因式分解:", factored3)`,explanation:"expand() 展开表达式，factor() 进行因式分解。"}]},{id:"calculus",title:"微积分",description:"SymPy 可以进行符号微分和积分运算。",concepts:[{name:"求导",explanation:"diff() 函数计算符号导数，支持多阶导数和偏导数。",math:"\\frac{d}{dx}f(x), \\quad \\frac{\\partial}{\\partial x}f(x,y)"},{name:"积分",explanation:"integrate() 计算不定积分和定积分。",math:"\\int f(x)dx, \\quad \\int_a^b f(x)dx"},{name:"极限",explanation:"limit() 计算函数的极限值。",math:"\\lim_{x \\to a} f(x)"}],examples:[{title:"求导数",code:`import sympy as sp

x = sp.Symbol('x')

# 一阶导数
f = x**3 + 2*x**2 + x + 1
df = sp.diff(f, x)
print("f(x) =", f)
print("f'(x) =", df)

# 二阶导数
d2f = sp.diff(f, x, 2)
print("f''(x) =", d2f)

# 三角函数导数
g = sp.sin(x) * sp.exp(x)
dg = sp.diff(g, x)
print("\\nd/dx[sin(x)·eˣ] =", dg)`,explanation:"diff(f, x) 对 x 求一阶导，diff(f, x, n) 求 n 阶导。"},{title:"偏导数",code:`import sympy as sp

x, y = sp.symbols('x y')

# 多元函数
f = x**2 * y + x * y**2
print("f(x,y) =", f)

# 偏导数
df_dx = sp.diff(f, x)
df_dy = sp.diff(f, y)
print("\\n∂f/∂x =", df_dx)
print("∂f/∂y =", df_dy)

# 二阶混合偏导
d2f_dxdy = sp.diff(f, x, y)
print("\\n∂²f/∂x∂y =", d2f_dxdy)`,explanation:"对多元函数可以分别对不同变量求偏导。"},{title:"积分",code:`import sympy as sp

x = sp.Symbol('x')

# 不定积分
f = x**2
F = sp.integrate(f, x)
print("∫ x² dx =", F)

# 定积分
definite = sp.integrate(f, (x, 0, 1))
print("\\n∫₀¹ x² dx =", definite)

# 复杂函数积分
g = sp.sin(x) * sp.exp(x)
G = sp.integrate(g, x)
print("\\n∫ sin(x)·eˣ dx =", G)

# 多重积分
h = x * y
H = sp.integrate(h, (x, 0, 1), (y, 0, 1))
print("\\n∫₀¹∫₀¹ xy dx dy =", H)`,explanation:"integrate(f, x) 求不定积分，integrate(f, (x, a, b)) 求定积分。"},{title:"极限",code:`import sympy as sp

x = sp.Symbol('x')

# 基本极限
f = sp.sin(x) / x
limit1 = sp.limit(f, x, 0)
print("lim(x→0) sin(x)/x =", limit1)

# 无穷极限
g = (1 + 1/x)**x
limit2 = sp.limit(g, x, sp.oo)
print("\\nlim(x→∞) (1+1/x)ˣ =", limit2)

# 单侧极限
h = 1/x
limit_right = sp.limit(h, x, 0, '+')
limit_left = sp.limit(h, x, 0, '-')
print("\\nlim(x→0⁺) 1/x =", limit_right)
print("lim(x→0⁻) 1/x =", limit_left)`,explanation:"limit(f, x, a) 计算 x 趋向 a 时的极限，sp.oo 表示无穷大。"}]},{id:"equations",title:"方程求解",description:"SymPy 可以求解代数方程、方程组和微分方程。",concepts:[{name:"代数方程",explanation:"solve() 函数求解代数方程的符号解。",math:"f(x) = 0 \\Rightarrow x = ?"},{name:"方程组",explanation:"可以求解多个方程组成的线性或非线性方程组。",math:"\\begin{cases} f_1(x,y) = 0 \\\\ f_2(x,y) = 0 \\end{cases}"}],examples:[{title:"求解方程",code:`import sympy as sp

x = sp.Symbol('x')

# 一元一次方程
eq1 = 2*x + 3 - 7
sol1 = sp.solve(eq1, x)
print("2x + 3 = 7")
print("解:", sol1)

# 一元二次方程
eq2 = x**2 - 5*x + 6
sol2 = sp.solve(eq2, x)
print("\\nx² - 5x + 6 = 0")
print("解:", sol2)

# 三角方程
eq3 = sp.sin(x) - sp.Rational(1, 2)
sol3 = sp.solve(eq3, x)
print("\\nsin(x) = 1/2")
print("解:", sol3)`,explanation:"solve(equation, variable) 返回方程的所有解。"},{title:"方程组",code:`import sympy as sp

x, y = sp.symbols('x y')

# 线性方程组
eq1 = 2*x + y - 5
eq2 = x - y - 1
sol = sp.solve([eq1, eq2], [x, y])
print("方程组:")
print("2x + y = 5")
print("x - y = 1")
print("解:", sol)

# 非线性方程组
eq3 = x**2 + y**2 - 25
eq4 = x - y - 1
sol2 = sp.solve([eq3, eq4], [x, y])
print("\\n非线性方程组:")
print("x² + y² = 25")
print("x - y = 1")
print("解:", sol2)`,explanation:"传入方程列表和变量列表可以求解方程组。"},{title:"微分方程",code:`import sympy as sp

x = sp.Symbol('x')
y = sp.Function('y')

# 一阶微分方程: y' = y
eq1 = sp.Eq(y(x).diff(x), y(x))
sol1 = sp.dsolve(eq1, y(x))
print("y' = y")
print("通解:", sol1)

# 二阶微分方程: y'' + y = 0
eq2 = sp.Eq(y(x).diff(x, 2) + y(x), 0)
sol2 = sp.dsolve(eq2, y(x))
print("\\ny'' + y = 0")
print("通解:", sol2)`,explanation:"dsolve() 求解微分方程，返回通解。"}]},{id:"matrices",title:"矩阵运算",description:"SymPy 提供符号矩阵运算功能。",concepts:[{name:"矩阵操作",explanation:"Matrix 类支持矩阵的基本运算和符号计算。",math:"\\mathbf{A} \\in \\mathbb{R}^{m \\times n}"},{name:"特征值",explanation:"可以计算矩阵的特征值和特征向量。",math:"\\mathbf{A}\\mathbf{v} = \\lambda\\mathbf{v}"}],examples:[{title:"矩阵基本运算",code:`import sympy as sp

# 创建矩阵
A = sp.Matrix([[1, 2], [3, 4]])
B = sp.Matrix([[5, 6], [7, 8]])

print("矩阵 A:")
print(A)
print("\\n矩阵 B:")
print(B)

# 矩阵加法
print("\\nA + B =")
print(A + B)

# 矩阵乘法
print("\\nA * B =")
print(A * B)

# 转置
print("\\nA 的转置:")
print(A.T)`,explanation:"Matrix() 创建矩阵，支持加减乘除和转置运算。"},{title:"行列式和逆矩阵",code:`import sympy as sp

A = sp.Matrix([[1, 2], [3, 4]])
print("矩阵 A:")
print(A)

# 行列式
det_A = A.det()
print("\\ndet(A) =", det_A)

# 逆矩阵
inv_A = A.inv()
print("\\nA⁻¹ =")
print(inv_A)

# 验证
print("\\nA * A⁻¹ =")
print(A * inv_A)`,explanation:"det() 计算行列式，inv() 计算逆矩阵。"},{title:"特征值和特征向量",code:`import sympy as sp

A = sp.Matrix([[3, 1], [1, 3]])
print("矩阵 A:")
print(A)

# 特征值
eigenvals = A.eigenvals()
print("\\n特征值:", eigenvals)

# 特征向量
eigenvects = A.eigenvects()
print("\\n特征值和特征向量:")
for eigenval, multiplicity, eigenvect in eigenvects:
    print(f"λ = {eigenval}, 重数 = {multiplicity}")
    print(f"特征向量: {eigenvect}")`,explanation:"eigenvals() 返回特征值，eigenvects() 返回特征值和对应的特征向量。"}]}]},$e={...ne,title:"SymPy",description:"SymPy is a Python library for symbolic mathematics, capable of symbolic computation, algebraic operations, calculus, etc.",sections:[{id:"symbolic-basics",title:"Symbolic Basics",description:"SymPy allows defining symbolic variables and performing precise symbolic calculations.",concepts:[{name:"Symbol Definitions",explanation:"Use symbols() to define symbolic variables that represent mathematical symbols rather than specific values.",math:"x, y, z \\in \\text{Symbols}"},{name:"Expression Manipulation",explanation:"SymPy can simplify, expand, and factorize expressions.",math:"f(x) = \\sum_{i=0}^{n} a_i x^i"}],examples:[{title:"Define Symbols and Expressions",code:`import sympy as sp

# Define symbols
x, y, z = sp.symbols('x y z')

# Create expression
expr = x**2 + 2*x + 1
print("Expression:", expr)

# Substitute value
result = expr.subs(x, 3)
print("Value at x=3:", result)

# Convert to numeric
numeric = float(result)
print("Numeric result:", numeric)`,explanation:"symbols() creates symbolic variables, subs() substitutes variables with specific values."},{title:"Simplify Expressions",code:`import sympy as sp

x = sp.Symbol('x')

# Simplify
expr1 = sp.sin(x)**2 + sp.cos(x)**2
simplified = sp.simplify(expr1)
print("sin²(x) + cos²(x) =", simplified)

# Trig simplification
expr2 = sp.sin(2*x)
trig_simplified = sp.trigsimp(sp.expand_trig(expr2))
print("\\nsin(2x) expanded:", sp.expand_trig(expr2))

# Rational simplification
expr3 = (x**2 - 1)/(x - 1)
rational = sp.simplify(expr3)
print("\\n(x²-1)/(x-1) =", rational)`,explanation:"simplify() attempts to simplify expressions, trigsimp() targets trigonometric simplifications."},{title:"Expand and Factor",code:`import sympy as sp

x, y = sp.symbols('x y')

# Expand
expr = (x + y)**3
expanded = sp.expand(expr)
print("(x+y)³ expanded:", expanded)

# Factor
expr2 = x**2 - y**2
factored = sp.factor(expr2)
print("\\nx² - y² factored:", factored)

# Polynomial expansion
expr3 = (x + 1)*(x + 2)*(x + 3)
expanded3 = sp.expand(expr3)
print("\\n(x+1)(x+2)(x+3) =", expanded3)

# Factor back
factored3 = sp.factor(expanded3)
print("Factored:", factored3)`,explanation:"expand() expands expressions, factor() performs factorization."}]},{id:"calculus",title:"Calculus",description:"SymPy can perform symbolic differentiation and integration.",concepts:[{name:"Differentiation",explanation:"diff() computes symbolic derivatives, supporting higher-order and partial derivatives.",math:"\\frac{d}{dx}f(x), \\quad \\frac{\\partial}{\\partial x}f(x,y)"},{name:"Integration",explanation:"integrate() computes indefinite and definite integrals.",math:"\\int f(x)dx, \\quad \\int_a^b f(x)dx"},{name:"Limits",explanation:"limit() computes limits of functions.",math:"\\lim_{x \\to a} f(x)"}],examples:[{title:"Differentiation",code:`import sympy as sp

x = sp.Symbol('x')

# First derivative
f = x**3 + 2*x**2 + x + 1
df = sp.diff(f, x)
print("f(x) =", f)
print("f'(x) =", df)

# Second derivative
d2f = sp.diff(f, x, 2)
print("f''(x) =", d2f)

# Trig derivative
g = sp.sin(x) * sp.exp(x)
dg = sp.diff(g, x)
print("\\nd/dx[sin(x)·eˣ] =", dg)`,explanation:"diff(f, x) for first derivative, diff(f, x, n) for n-th derivative."},{title:"Partial Derivatives",code:`import sympy as sp

x, y = sp.symbols('x y')

# Multivariable function
f = x**2 * y + x * y**2
print("f(x,y) =", f)

# Partial derivatives
df_dx = sp.diff(f, x)
df_dy = sp.diff(f, y)
print("\\n∂f/∂x =", df_dx)
print("∂f/∂y =", df_dy)

# Mixed partial
d2f_dxdy = sp.diff(f, x, y)
print("\\n∂²f/∂x∂y =", d2f_dxdy)`,explanation:"You can compute partial derivatives with respect to different variables."},{title:"Integration",code:`import sympy as sp

x = sp.Symbol('x')

# Indefinite integral
f = x**2
F = sp.integrate(f, x)
print("∫ x² dx =", F)

# Definite integral
definite = sp.integrate(f, (x, 0, 1))
print("\\n∫₀¹ x² dx =", definite)

# Complex function integral
g = sp.sin(x) * sp.exp(x)
G = sp.integrate(g, x)
print("\\n∫ sin(x)·eˣ dx =", G)

# Multiple integrals
h = x * y
H = sp.integrate(h, (x, 0, 1), (y, 0, 1))
print("\\n∫₀¹∫₀¹ xy dx dy =", H)`,explanation:"integrate(f, x) for indefinite, integrate(f, (x, a, b)) for definite integrals."},{title:"Limits",code:`import sympy as sp

x = sp.Symbol('x')

# Basic limit
f = sp.sin(x) / x
limit1 = sp.limit(f, x, 0)
print("lim(x→0) sin(x)/x =", limit1)

# Infinite limit
g = (1 + 1/x)**x
limit2 = sp.limit(g, x, sp.oo)
print("\\nlim(x→∞) (1+1/x)ˣ =", limit2)

# One-sided limits
h = 1/x
limit_right = sp.limit(h, x, 0, '+')
limit_left = sp.limit(h, x, 0, '-')
print("\\nlim(x→0⁺) 1/x =", limit_right)
print("lim(x→0⁻) 1/x =", limit_left)`,explanation:"limit(f, x, a) computes limit as x approaches a. sp.oo represents infinity."}]},{id:"equations",title:"Equation Solving",description:"SymPy can solve algebraic equations, systems of equations, and differential equations.",concepts:[{name:"Algebraic Equations",explanation:"solve() finds symbolic solutions for algebraic equations.",math:"f(x) = 0 \\Rightarrow x = ?"},{name:"Systems of Equations",explanation:"Solve linear or non-linear systems of equations.",math:"\\begin{cases} f_1(x,y) = 0 \\\\ f_2(x,y) = 0 \\end{cases}"}],examples:[{title:"Solving Equations",code:`import sympy as sp

x = sp.Symbol('x')

# Linear equation
eq1 = 2*x + 3 - 7
sol1 = sp.solve(eq1, x)
print("2x + 3 = 7")
print("Solution:", sol1)

# Quadratic equation
eq2 = x**2 - 5*x + 6
sol2 = sp.solve(eq2, x)
print("\\nx² - 5x + 6 = 0")
print("Solution:", sol2)

# Trig equation
eq3 = sp.sin(x) - sp.Rational(1, 2)
sol3 = sp.solve(eq3, x)
print("\\nsin(x) = 1/2")
print("Solution:", sol3)`,explanation:"solve(equation, variable) returns all solutions."},{title:"Systems of Equations",code:`import sympy as sp

x, y = sp.symbols('x y')

# Linear system
eq1 = 2*x + y - 5
eq2 = x - y - 1
sol = sp.solve([eq1, eq2], [x, y])
print("System:")
print("2x + y = 5")
print("x - y = 1")
print("Solution:", sol)

# Non-linear system
eq3 = x**2 + y**2 - 25
eq4 = x - y - 1
sol2 = sp.solve([eq3, eq4], [x, y])
print("\\nNon-linear System:")
print("x² + y² = 25")
print("x - y = 1")
print("Solution:", sol2)`,explanation:"Pass a list of equations and variables to solve systems."},{title:"Differential Equations",code:`import sympy as sp

x = sp.Symbol('x')
y = sp.Function('y')

# First order ODE: y' = y
eq1 = sp.Eq(y(x).diff(x), y(x))
sol1 = sp.dsolve(eq1, y(x))
print("y' = y")
print("General Solution:", sol1)

# Second order ODE: y'' + y = 0
eq2 = sp.Eq(y(x).diff(x, 2) + y(x), 0)
sol2 = sp.dsolve(eq2, y(x))
print("\\ny'' + y = 0")
print("General Solution:", sol2)`,explanation:"dsolve() solves differential equations returning the general solution."}]},{id:"matrices",title:"Matrix Operations",description:"SymPy provides symbolic matrix operations.",concepts:[{name:"Matrix Operations",explanation:"Matrix class supports basic arithmetic and symbolic computations on matrices.",math:"\\mathbf{A} \\in \\mathbb{R}^{m \\times n}"},{name:"Eigenvalues",explanation:"Compute eigenvalues and eigenvectors of matrices.",math:"\\mathbf{A}\\mathbf{v} = \\lambda\\mathbf{v}"}],examples:[{title:"Basic Matrix Ops",code:`import sympy as sp

# Create matrices
A = sp.Matrix([[1, 2], [3, 4]])
B = sp.Matrix([[5, 6], [7, 8]])

print("Matrix A:")
print(A)
print("\\nMatrix B:")
print(B)

# Addition
print("\\nA + B =")
print(A + B)

# Multiplication
print("\\nA * B =")
print(A * B)

# Transpose
print("\\nA Transpose:")
print(A.T)`,explanation:"Matrix() creates matrices, supporting addition, multiplication, and transposition."},{title:"Determinant and Inverse",code:`import sympy as sp

A = sp.Matrix([[1, 2], [3, 4]])
print("Matrix A:")
print(A)

# Determinant
det_A = A.det()
print("\\ndet(A) =", det_A)

# Inverse
inv_A = A.inv()
print("\\nA⁻¹ =")
print(inv_A)

# Verify
print("\\nA * A⁻¹ =")
print(A * inv_A)`,explanation:"det() computes determinant, inv() computes inverse."},{title:"Eigenvalues/Vectors",code:`import sympy as sp

A = sp.Matrix([[3, 1], [1, 3]])
print("Matrix A:")
print(A)

# Eigenvalues
eigenvals = A.eigenvals()
print("\\nEigenvalues:", eigenvals)

# Eigenvectors
eigenvects = A.eigenvects()
print("\\nEigenvalues and Eigenvectors:")
for eigenval, multiplicity, eigenvect in eigenvects:
    print(f"λ = {eigenval}, Multiplicity = {multiplicity}")
    print(f"Eigenvector: {eigenvect}")`,explanation:"eigenvals() returns eigenvalues, eigenvects() returns eigenvalues and vectors."}]}]},yt={zh:je,en:$e},re={id:"scipy",icon:"🔬"},Ve={...re,title:"SciPy",description:"SciPy 是基于 NumPy 的科学计算库，提供优化、积分、插值、信号处理等高级功能。",sections:[{id:"optimization",title:"优化",description:"SciPy 提供多种优化算法，用于求解函数的最小值、最大值和根。",concepts:[{name:"函数最小化",explanation:"minimize() 函数使用各种算法寻找函数的局部或全局最小值。",math:"\\min_{x} f(x)"},{name:"曲线拟合",explanation:"curve_fit() 用于将数据拟合到指定的函数模型。",math:"\\min \\sum_i [y_i - f(x_i, \\mathbf{p})]^2"}],examples:[{title:"函数最小化",code:`import numpy as np
from scipy import optimize

# 定义目标函数
def f(x):
    return x**2 + 10*np.sin(x)

# 寻找最小值
result = optimize.minimize(f, x0=0)
print("最小值点:", result.x[0])
print("最小值:", result.fun)

# 绘制函数
import matplotlib.pyplot as plt
x = np.linspace(-10, 10, 1000)
y = f(x)

plt.figure(figsize=(10, 4))
plt.plot(x, y, 'b-', linewidth=2, label='f(x) = x² + 10sin(x)')
plt.plot(result.x, result.fun, 'ro', markersize=10, label=f'Minimun ({result.x[0]:.2f}, {result.fun:.2f})')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.title('Function Optimization')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("优化完成")`,explanation:"minimize() 从初始点 x0 开始搜索最小值。"},{title:"曲线拟合",code:`import numpy as np
from scipy import optimize
import matplotlib.pyplot as plt

# 生成带噪声的数据
np.random.seed(42)
x_data = np.linspace(0, 4, 50)
y_data = 2.5 * np.sin(1.5 * x_data) + 1.0 + np.random.normal(0, 0.3, 50)

# 定义拟合函数
def func(x, a, b, c):
    return a * np.sin(b * x) + c

# 拟合
params, covariance = optimize.curve_fit(func, x_data, y_data)
a, b, c = params
print(f"拟合参数: a={a:.3f}, b={b:.3f}, c={c:.3f}")

# 绘制结果
x_fit = np.linspace(0, 4, 200)
y_fit = func(x_fit, a, b, c)

plt.figure(figsize=(10, 5))
plt.scatter(x_data, y_data, alpha=0.6, label='Raw Data')
plt.plot(x_fit, y_fit, 'r-', linewidth=2, label=f'Fitted: {a:.2f}sin({b:.2f}x) + {c:.2f}')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Curve Fitting')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("拟合完成")`,explanation:"curve_fit() 返回最优参数和协方差矩阵。"},{title:"求解方程的根",code:`import numpy as np
from scipy import optimize

# 定义方程
def equation(x):
    return x**3 - 2*x - 5

# 求根
root = optimize.root_scalar(equation, bracket=[2, 3])
print("方程 x³ - 2x - 5 = 0 的根:", root.root)
print("函数值:", equation(root.root))

# 多元方程组
def equations(vars):
    x, y = vars
    eq1 = x**2 + y**2 - 4
    eq2 = x - y - 1
    return [eq1, eq2]

# 求解
solution = optimize.root(equations, [1, 1])
print("\\n方程组的解:", solution.x)
print("验证:", equations(solution.x))`,explanation:"root_scalar() 求单变量方程的根，root() 求多元方程组的解。"}]},{id:"integration",title:"数值积分",description:"SciPy 提供数值积分方法，用于计算定积分和求解微分方程。",concepts:[{name:"定积分",explanation:"quad() 函数使用自适应积分算法计算一维定积分。",math:"\\int_a^b f(x)dx"},{name:"常微分方程",explanation:"solve_ivp() 求解初值问题的常微分方程。",math:"\\frac{dy}{dt} = f(t, y), \\quad y(t_0) = y_0"}],examples:[{title:"数值积分",code:`import numpy as np
from scipy import integrate

# 定义被积函数
def f(x):
    return np.sin(x)

# 计算定积分
result, error = integrate.quad(f, 0, np.pi)
print(f"∫₀^π sin(x)dx = {result:.6f}")
print(f"估计误差: {error:.2e}")

# 复杂函数积分
def g(x):
    return np.exp(-x**2)

result2, error2 = integrate.quad(g, 0, np.inf)
print(f"\\n∫₀^∞ e^(-x²)dx = {result2:.6f}")
print(f"理论值: {np.sqrt(np.pi)/2:.6f}")`,explanation:"quad() 返回积分值和误差估计，支持无穷区间。"},{title:"二重积分",code:`import numpy as np
from scipy import integrate

# 定义二元函数
def f(y, x):
    return x * y

# 计算二重积分 ∫₀¹∫₀¹ xy dx dy
result, error = integrate.dblquad(f, 0, 1, 0, 1)
print(f"∫₀¹∫₀¹ xy dx dy = {result:.6f}")
print(f"理论值: 0.25")

# 变限积分
def f2(y, x):
    return x**2 + y**2

result2, error2 = integrate.dblquad(f2, 0, 1, lambda x: 0, lambda x: x)
print(f"\\n∫₀¹∫₀ˣ (x²+y²) dy dx = {result2:.6f}")`,explanation:"dblquad() 计算二重积分，支持变限积分。"},{title:"求解微分方程",code:`import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

# 定义微分方程 dy/dt = -2y
def dydt(t, y):
    return -2 * y

# 初值条件
y0 = [1.0]
t_span = (0, 5)
t_eval = np.linspace(0, 5, 100)

# 求解
sol = solve_ivp(dydt, t_span, y0, t_eval=t_eval)

# 绘制结果
plt.figure(figsize=(10, 5))
plt.plot(sol.t, sol.y[0], 'b-', linewidth=2, label='Numeric Solution')
plt.plot(sol.t, np.exp(-2*sol.t), 'r--', linewidth=2, label='Exact Solution: e^(-2t)')
plt.xlabel('t')
plt.ylabel('y')
plt.title('ODE: dy/dt = -2y, y(0) = 1')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("微分方程求解完成")`,explanation:"solve_ivp() 求解初值问题，返回时间点和对应的解。"}]},{id:"interpolation",title:"插值",description:"插值用于在已知数据点之间估计未知值。",concepts:[{name:"一维插值",explanation:"interp1d() 创建插值函数，支持线性、多项式、样条等方法。",math:"f(x) \\approx \\sum_i y_i L_i(x)"},{name:"样条插值",explanation:"样条插值使用分段多项式，保证平滑性。",math:"S(x) = \\sum_i c_i B_i(x)"}],examples:[{title:"一维插值",code:`import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# 原始数据点
x = np.array([0, 1, 2, 3, 4, 5])
y = np.array([0, 1, 4, 2, 3, 5])

# 创建插值函数
f_linear = interpolate.interp1d(x, y, kind='linear')
f_cubic = interpolate.interp1d(x, y, kind='cubic')

# 生成密集点
x_new = np.linspace(0, 5, 100)
y_linear = f_linear(x_new)
y_cubic = f_cubic(x_new)

# 绘制
plt.figure(figsize=(10, 5))
plt.plot(x, y, 'o', markersize=8, label='Data Points')
plt.plot(x_new, y_linear, '-', label='Linear Interpolation')
plt.plot(x_new, y_cubic, '-', label='Cubic Interpolation')
plt.xlabel('x')
plt.ylabel('y')
plt.title('1D Interpolation')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("插值完成")`,explanation:"kind 参数指定插值方法：linear, quadratic, cubic 等。"},{title:"样条插值",code:`import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# 数据点
x = np.array([0, 1, 2, 3, 4, 5])
y = np.array([0, 3, 1, 4, 2, 5])

# B样条插值
tck = interpolate.splrep(x, y, s=0)
x_new = np.linspace(0, 5, 100)
y_new = interpolate.splev(x_new, tck)

# 绘制
plt.figure(figsize=(10, 5))
plt.plot(x, y, 'o', markersize=8, label='Data Points')
plt.plot(x_new, y_new, '-', linewidth=2, label='B-Spline')
plt.xlabel('x')
plt.ylabel('y')
plt.title('B-Spline Interpolation')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("样条插值完成")`,explanation:"splrep() 计算样条表示，splev() 在新点上求值。"},{title:"二维插值",code:`import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# 创建网格数据
x = np.linspace(0, 4, 5)
y = np.linspace(0, 4, 5)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)

# 二维插值
f = interpolate.interp2d(x, y, Z, kind='cubic')

# 密集网格
x_new = np.linspace(0, 4, 50)
y_new = np.linspace(0, 4, 50)
Z_new = f(x_new, y_new)

# 绘制
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.contourf(X, Y, Z, levels=15, cmap='viridis')
plt.colorbar()
plt.title('Original (5x5)')
plt.subplot(1, 2, 2)
plt.contourf(x_new, y_new, Z_new, levels=15, cmap='viridis')
plt.colorbar()
plt.title('Interpolated (50x50)')
plt.tight_layout()
plt.show()

print("二维插值完成")`,explanation:"interp2d() 进行二维插值，可以将粗糙网格插值到密集网格。"}]},{id:"signal",title:"信号处理",description:"SciPy 提供信号处理工具，包括滤波、傅里叶变换等。",concepts:[{name:"滤波器",explanation:"滤波器用于去除信号中的噪声或特定频率成分。",math:"y[n] = \\sum_k h[k] x[n-k]"},{name:"傅里叶变换",explanation:"FFT 将时域信号转换到频域，用于频谱分析。",math:"X(f) = \\int_{-\\infty}^{\\infty} x(t) e^{-i2\\pi ft} dt"}],examples:[{title:"生成和滤波信号",code:`import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

# 生成信号：低频 + 高频 + 噪声
t = np.linspace(0, 1, 1000)
sig = np.sin(2*np.pi*5*t) + 0.5*np.sin(2*np.pi*50*t) + 0.2*np.random.randn(1000)

# 设计低通滤波器
b, a = signal.butter(4, 0.1)
filtered = signal.filtfilt(b, a, sig)

# 绘制
plt.figure(figsize=(12, 5))
plt.subplot(2, 1, 1)
plt.plot(t[:200], sig[:200])
plt.title('Original Signal (Noisy)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(t[:200], filtered[:200])
plt.title('Filtered Signal')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("滤波完成")`,explanation:"butter() 设计 Butterworth 滤波器，filtfilt() 进行零相位滤波。"},{title:"傅里叶变换",code:`import numpy as np
from scipy.fft import fft, fftfreq
import matplotlib.pyplot as plt

# 生成信号
N = 1000
T = 1.0 / 800.0
t = np.linspace(0, N*T, N)
sig = np.sin(50*2*np.pi*t) + 0.5*np.sin(120*2*np.pi*t)

# FFT
yf = fft(sig)
xf = fftfreq(N, T)[:N//2]

# 绘制
plt.figure(figsize=(12, 5))
plt.subplot(2, 1, 1)
plt.plot(t[:200], sig[:200])
plt.title('Time Domain')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(xf, 2.0/N * np.abs(yf[:N//2]))
plt.title('Frequency Domain (FFT)')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)
plt.xlim(0, 200)

plt.tight_layout()
plt.show()

print("FFT 完成，检测到频率: 50 Hz 和 120 Hz")`,explanation:"fft() 计算快速傅里叶变换，fftfreq() 生成对应的频率坐标。"},{title:"卷积",code:`import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

# 定义信号和核
sig = np.array([1, 2, 3, 4, 5, 4, 3, 2, 1])
kernel = np.array([1, 1, 1]) / 3  # 移动平均

# 卷积
conv_result = signal.convolve(sig, kernel, mode='same')

# 绘制
plt.figure(figsize=(10, 5))
plt.plot(sig, 'o-', label='Original', linewidth=2, markersize=8)
plt.plot(conv_result, 's-', label='Convolved (Smoothed)', linewidth=2, markersize=8)
plt.title('Convolution (Moving Average)')
plt.xlabel('Sample')
plt.ylabel('Value')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("卷积完成")`,explanation:"convolve() 计算两个信号的卷积，mode 参数控制输出大小。"}]}]},Ue={...re,title:"SciPy",description:"SciPy is a scientific computing library based on NumPy, providing advanced functions such as optimization, integration, interpolation, and signal processing.",sections:[{id:"optimization",title:"Optimization",description:"SciPy provides various optimization algorithms for finding minima, maxima, and roots of functions.",concepts:[{name:"Function Minimization",explanation:"minimize() uses various algorithms to find local or global minima of functions.",math:"\\min_{x} f(x)"},{name:"Curve Fitting",explanation:"curve_fit() fits data to a specified function model.",math:"\\min \\sum_i [y_i - f(x_i, \\mathbf{p})]^2"}],examples:[{title:"Function Minimization",code:`import numpy as np
from scipy import optimize

# Define objective function
def f(x):
    return x**2 + 10*np.sin(x)

# Find minimum
result = optimize.minimize(f, x0=0)
print("Minimum point:", result.x[0])
print("Minimum value:", result.fun)

# Plot function
import matplotlib.pyplot as plt
x = np.linspace(-10, 10, 1000)
y = f(x)

plt.figure(figsize=(10, 4))
plt.plot(x, y, 'b-', linewidth=2, label='f(x) = x² + 10sin(x)')
plt.plot(result.x, result.fun, 'ro', markersize=10, label=f'Minimum ({result.x[0]:.2f}, {result.fun:.2f})')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.title('Function Optimization')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Optimization done")`,explanation:"minimize() searches for a minimum starting from x0."},{title:"Curve Fitting",code:`import numpy as np
from scipy import optimize
import matplotlib.pyplot as plt

# Generate noisy data
np.random.seed(42)
x_data = np.linspace(0, 4, 50)
y_data = 2.5 * np.sin(1.5 * x_data) + 1.0 + np.random.normal(0, 0.3, 50)

# Define model function
def func(x, a, b, c):
    return a * np.sin(b * x) + c

# Fit
params, covariance = optimize.curve_fit(func, x_data, y_data)
a, b, c = params
print(f"Fitted params: a={a:.3f}, b={b:.3f}, c={c:.3f}")

# Plot result
x_fit = np.linspace(0, 4, 200)
y_fit = func(x_fit, a, b, c)

plt.figure(figsize=(10, 5))
plt.scatter(x_data, y_data, alpha=0.6, label='Raw Data')
plt.plot(x_fit, y_fit, 'r-', linewidth=2, label=f'Fitted: {a:.2f}sin({b:.2f}x) + {c:.2f}')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Curve Fitting')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Fitting done")`,explanation:"curve_fit() returns optimal parameters and covariance matrix."},{title:"Root Finding",code:`import numpy as np
from scipy import optimize

# Define equation
def equation(x):
    return x**3 - 2*x - 5

# Find root
root = optimize.root_scalar(equation, bracket=[2, 3])
print("Root of x³ - 2x - 5 = 0:", root.root)
print("Function value:", equation(root.root))

# Systems of equations
def equations(vars):
    x, y = vars
    eq1 = x**2 + y**2 - 4
    eq2 = x - y - 1
    return [eq1, eq2]

# Solve
solution = optimize.root(equations, [1, 1])
print("\\nSystem solution:", solution.x)
print("Check:", equations(solution.x))`,explanation:"root_scalar() finds roots for scalar functions, root() for systems of equations."}]},{id:"integration",title:"Numerical Integration",description:"SciPy provides numerical integration methods for computing definite integrals and solving differential equations.",concepts:[{name:"Definite Integrals",explanation:"quad() computes 1D definite integrals using adaptive quadrature.",math:"\\int_a^b f(x)dx"},{name:"ODEs",explanation:"solve_ivp() solves initial value problems for ordinary differential equations.",math:"\\frac{dy}{dt} = f(t, y), \\quad y(t_0) = y_0"}],examples:[{title:"Numerical Integration",code:`import numpy as np
from scipy import integrate

# Define integrand
def f(x):
    return np.sin(x)

# Compute definite integral
result, error = integrate.quad(f, 0, np.pi)
print(f"∫₀^π sin(x)dx = {result:.6f}")
print(f"Estimated Error: {error:.2e}")

# Complex integrand
def g(x):
    return np.exp(-x**2)

result2, error2 = integrate.quad(g, 0, np.inf)
print(f"\\n∫₀^∞ e^(-x²)dx = {result2:.6f}")
print(f"Theoretical: {np.sqrt(np.pi)/2:.6f}")`,explanation:"quad() returns the integral value and error estimate, supports infinite intervals."},{title:"Double Integration",code:`import numpy as np
from scipy import integrate

# Define 2 variable function from inner to outer
def f(y, x):
    return x * y

# Compute double integral ∫₀¹∫₀¹ xy dx dy
result, error = integrate.dblquad(f, 0, 1, 0, 1)
print(f"∫₀¹∫₀¹ xy dx dy = {result:.6f}")
print(f"Theoretical: 0.25")

# Variable limits
def f2(y, x):
    return x**2 + y**2

result2, error2 = integrate.dblquad(f2, 0, 1, lambda x: 0, lambda x: x)
print(f"\\n∫₀¹∫₀ˣ (x²+y²) dy dx = {result2:.6f}")`,explanation:"dblquad() computes double integrals, supporting variable limits."},{title:"Solving ODEs",code:`import numpy as np
from scipy.integrate import solve_ivp
import matplotlib.pyplot as plt

# Define ODE: dy/dt = -2y
def dydt(t, y):
    return -2 * y

# Initial conditions
y0 = [1.0]
t_span = (0, 5)
t_eval = np.linspace(0, 5, 100)

# Solve
sol = solve_ivp(dydt, t_span, y0, t_eval=t_eval)

# Plot
plt.figure(figsize=(10, 5))
plt.plot(sol.t, sol.y[0], 'b-', linewidth=2, label='Numeric Solution')
plt.plot(sol.t, np.exp(-2*sol.t), 'r--', linewidth=2, label='Exact Solution: e^(-2t)')
plt.xlabel('t')
plt.ylabel('y')
plt.title('ODE: dy/dt = -2y, y(0) = 1')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("ODE solved")`,explanation:"solve_ivp() solves initial value problems, returns time points and solution values."}]},{id:"interpolation",title:"Interpolation",description:"Interpolation estimates unknown values between known data points.",concepts:[{name:"1D Interpolation",explanation:"interp1d() creates interpolation functions, supporting linear, polynomial, spline, etc.",math:"f(x) \\approx \\sum_i y_i L_i(x)"},{name:"Spline Interpolation",explanation:"Spline interpolation uses piecewise polynomials to ensure smoothness.",math:"S(x) = \\sum_i c_i B_i(x)"}],examples:[{title:"1D Interpolation",code:`import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# Original data
x = np.array([0, 1, 2, 3, 4, 5])
y = np.array([0, 1, 4, 2, 3, 5])

# Create interpolation functions
f_linear = interpolate.interp1d(x, y, kind='linear')
f_cubic = interpolate.interp1d(x, y, kind='cubic')

# Generate dense points
x_new = np.linspace(0, 5, 100)
y_linear = f_linear(x_new)
y_cubic = f_cubic(x_new)

# Plot
plt.figure(figsize=(10, 5))
plt.plot(x, y, 'o', markersize=8, label='Data Points')
plt.plot(x_new, y_linear, '-', label='Linear Interpolation')
plt.plot(x_new, y_cubic, '-', label='Cubic Interpolation')
plt.xlabel('x')
plt.ylabel('y')
plt.title('1D Interpolation')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Interpolation done")`,explanation:"kind specifies the method: linear, quadratic, cubic, etc."},{title:"Spline Interpolation",code:`import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# Data points
x = np.array([0, 1, 2, 3, 4, 5])
y = np.array([0, 3, 1, 4, 2, 5])

# B-Spline
tck = interpolate.splrep(x, y, s=0)
x_new = np.linspace(0, 5, 100)
y_new = interpolate.splev(x_new, tck)

# Plot
plt.figure(figsize=(10, 5))
plt.plot(x, y, 'o', markersize=8, label='Data Points')
plt.plot(x_new, y_new, '-', linewidth=2, label='B-Spline')
plt.xlabel('x')
plt.ylabel('y')
plt.title('B-Spline Interpolation')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Spline interpolation done")`,explanation:"splrep() computes spline representation, splev() evaluates it."},{title:"2D Interpolation",code:`import numpy as np
from scipy import interpolate
import matplotlib.pyplot as plt

# Create grid data
x = np.linspace(0, 4, 5)
y = np.linspace(0, 4, 5)
X, Y = np.meshgrid(x, y)
Z = np.sin(X) * np.cos(Y)

# 2D Interpolation
f = interpolate.interp2d(x, y, Z, kind='cubic')

# Dense grid
x_new = np.linspace(0, 4, 50)
y_new = np.linspace(0, 4, 50)
Z_new = f(x_new, y_new)

# Plot
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
plt.contourf(X, Y, Z, levels=15, cmap='viridis')
plt.colorbar()
plt.title('Original (5x5)')
plt.subplot(1, 2, 2)
plt.contourf(x_new, y_new, Z_new, levels=15, cmap='viridis')
plt.colorbar()
plt.title('Interpolated (50x50)')
plt.tight_layout()
plt.show()

print("2D interpolation done")`,explanation:"interp2d() performs 2D interpolation."}]},{id:"signal",title:"Signal Processing",description:"SciPy provides signal processing tools including filtering and Fourier transforms.",concepts:[{name:"Filters",explanation:"Filters remove noise or specific frequency components from signals.",math:"y[n] = \\sum_k h[k] x[n-k]"},{name:"Fourier Transform",explanation:"FFT converts time-domain signals to frequency domain for spectral analysis.",math:"X(f) = \\int_{-\\infty}^{\\infty} x(t) e^{-i2\\pi ft} dt"}],examples:[{title:"Signal Filtering",code:`import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

# Generate signal: low freq + high freq + noise
t = np.linspace(0, 1, 1000)
sig = np.sin(2*np.pi*5*t) + 0.5*np.sin(2*np.pi*50*t) + 0.2*np.random.randn(1000)

# Design lowpass filter
b, a = signal.butter(4, 0.1)
filtered = signal.filtfilt(b, a, sig)

# Plot
plt.figure(figsize=(12, 5))
plt.subplot(2, 1, 1)
plt.plot(t[:200], sig[:200])
plt.title('Original Signal (Noisy)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(t[:200], filtered[:200])
plt.title('Filtered Signal')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("Filtering done")`,explanation:"butter() designs Butterworth filter, filtfilt() applies zero-phase filtering."},{title:"Fourier Transform",code:`import numpy as np
from scipy.fft import fft, fftfreq
import matplotlib.pyplot as plt

# Generate signal
N = 1000
T = 1.0 / 800.0
t = np.linspace(0, N*T, N)
sig = np.sin(50*2*np.pi*t) + 0.5*np.sin(120*2*np.pi*t)

# FFT
yf = fft(sig)
xf = fftfreq(N, T)[:N//2]

# Plot
plt.figure(figsize=(12, 5))
plt.subplot(2, 1, 1)
plt.plot(t[:200], sig[:200])
plt.title('Time Domain')
plt.xlabel('Time (s)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(xf, 2.0/N * np.abs(yf[:N//2]))
plt.title('Frequency Domain (FFT)')
plt.xlabel('Frequency (Hz)')
plt.ylabel('Amplitude')
plt.grid(True, alpha=0.3)
plt.xlim(0, 200)

plt.tight_layout()
plt.show()

print("FFT done, detected frequencies: 50 Hz and 120 Hz")`,explanation:"fft() computes the Fast Fourier Transform, fftfreq() generates frequency bins."},{title:"Convolution",code:`import numpy as np
from scipy import signal
import matplotlib.pyplot as plt

# Define signal and kernel
sig = np.array([1, 2, 3, 4, 5, 4, 3, 2, 1])
kernel = np.array([1, 1, 1]) / 3  # Moving average

# Convolve
conv_result = signal.convolve(sig, kernel, mode='same')

# Plot
plt.figure(figsize=(10, 5))
plt.plot(sig, 'o-', label='Original', linewidth=2, markersize=8)
plt.plot(conv_result, 's-', label='Convolved (Smoothed)', linewidth=2, markersize=8)
plt.title('Convolution (Moving Average)')
plt.xlabel('Sample')
plt.ylabel('Value')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("Convolution done")`,explanation:"convolve() convolved two signals, mode controls output size."}]}]},gt={zh:Ve,en:Ue},oe={id:"pandas",icon:"🐼"},We={...oe,title:"Pandas",description:"Pandas 是 Python 数据分析的核心库，提供高效的数据结构和数据分析工具。",sections:[{id:"data-structures",title:"数据结构",description:"Pandas 的两个核心数据结构是 Series（一维）和 DataFrame（二维）。",concepts:[{name:"Series",explanation:"Series 是带标签的一维数组，类似于字典或带索引的列表。",math:"S = \\{(i_k, v_k)\\}_{k=1}^{n}"},{name:"DataFrame",explanation:"DataFrame 是二维表格数据结构，有行索引和列索引。",math:"D \\in \\mathbb{R}^{m \\times n}, \\text{ with row and column labels}"}],examples:[{title:"Series 基础",code:`import pandas as pd
import numpy as np

# 从列表创建 Series
s1 = pd.Series([1, 2, 3, 4, 5])
print("Series 1:")
print(s1)

# 带自定义索引
s2 = pd.Series([10, 20, 30], index=['a', 'b', 'c'])
print("\\nSeries 2 (自定义索引):")
print(s2)

# 从字典创建
s3 = pd.Series({'北京': 2154, '上海': 2424, '广州': 1404})
print("\\nSeries 3 (城市人口，万人):")
print(s3)

# 访问元素
print("\\n上海人口:", s3['上海'], "万人")`,explanation:"Series 可以从列表、数组或字典创建，支持标签索引。"},{title:"DataFrame 基础",code:`import pandas as pd

# 从字典创建 DataFrame
data = {
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 35, 28],
    '城市': ['北京', '上海', '广州', '深圳'],
    '工资': [8000, 12000, 10000, 9500]
}
df = pd.DataFrame(data)
print("DataFrame:")
print(df)

# 查看基本信息
print("\\n形状:", df.shape)
print("列名:", df.columns.tolist())
print("\\n前 2 行:")
print(df.head(2))`,explanation:"DataFrame 类似于 Excel 表格，每列可以是不同的数据类型。"},{title:"数据选择",code:`import pandas as pd

data = {
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, 30, 35, 28],
    '工资': [8000, 12000, 10000, 9500]
}
df = pd.DataFrame(data)

# 选择列
print("工资列:")
print(df['工资'])

# 选择多列
print("\\n姓名和工资:")
print(df[['姓名', '工资']])

# 选择行（按位置）
print("\\n第一行:")
print(df.iloc[0])

# 选择行（按标签）
print("\\n前两行:")
print(df.loc[0:1])

# 条件选择
print("\\n工资大于 9000 的员工:")
print(df[df['工资'] > 9000])`,explanation:"使用 [] 选择列，iloc 按位置选择，loc 按标签选择，支持条件筛选。"}]},{id:"data-cleaning",title:"数据清洗",description:"数据清洗包括处理缺失值、重复值和数据类型转换。",concepts:[{name:"缺失值",explanation:"Pandas 使用 NaN 表示缺失值，提供多种方法处理缺失数据。",math:"\\text{NaN} \\in \\text{missing values}"},{name:"数据转换",explanation:"可以转换数据类型、重命名列、替换值等。",math:"f: D \\to D'"}],examples:[{title:"处理缺失值",code:`import pandas as pd
import numpy as np

# 创建含缺失值的 DataFrame
data = {
    '姓名': ['张三', '李四', '王五', '赵六'],
    '年龄': [25, np.nan, 35, 28],
    '工资': [8000, 12000, np.nan, 9500]
}
df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 检查缺失值
print("\\n缺失值统计:")
print(df.isnull().sum())

# 删除含缺失值的行
df_dropped = df.dropna()
print("\\n删除缺失值后:")
print(df_dropped)

# 填充缺失值
df_filled = df.fillna({'年龄': df['年龄'].mean(), '工资': 0})
print("\\n填充缺失值后:")
print(df_filled)`,explanation:"isnull() 检测缺失值，dropna() 删除，fillna() 填充。"},{title:"处理重复值",code:`import pandas as pd

# 创建含重复的 DataFrame
data = {
    '姓名': ['张三', '李四', '张三', '王五'],
    '年龄': [25, 30, 25, 35]
}
df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 检查重复
print("\\n重复行:")
print(df.duplicated())

# 删除重复
df_unique = df.drop_duplicates()
print("\\n删除重复后:")
print(df_unique)

# 保留最后一个重复项
df_last = df.drop_duplicates(keep='last')
print("\\n保留最后一个:")
print(df_last)`,explanation:"duplicated() 检测重复，drop_duplicates() 删除重复行。"},{title:"数据类型转换",code:`import pandas as pd

data = {
    '编号': ['1', '2', '3', '4'],
    '价格': ['100.5', '200.3', '150.0', '180.8'],
    '日期': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04']
}
df = pd.DataFrame(data)
print("原始数据类型:")
print(df.dtypes)

# 转换类型
df['编号'] = df['编号'].astype(int)
df['价格'] = df['价格'].astype(float)
df['日期'] = pd.to_datetime(df['日期'])

print("\\n转换后的数据类型:")
print(df.dtypes)
print("\\n转换后的数据:")
print(df)`,explanation:"astype() 转换数据类型，to_datetime() 转换为日期时间类型。"}]},{id:"data-analysis",title:"数据分析",description:"Pandas 提供强大的数据分组、聚合和统计分析功能。",concepts:[{name:"分组聚合",explanation:"groupby() 按指定列分组，然后对每组应用聚合函数。",math:"\\text{GroupBy}: D \\to \\{G_1, G_2, ..., G_k\\} \\to \\text{Aggregate}"},{name:"数据透视",explanation:"pivot_table() 创建数据透视表，类似于 Excel 的数据透视表。",math:"\\text{Pivot}: D \\to D_{\\text{summary}}"}],examples:[{title:"分组聚合",code:`import pandas as pd

data = {
    '部门': ['销售', '技术', '销售', '技术', '销售', '技术'],
    '姓名': ['张三', '李四', '王五', '赵六', '钱七', '孙八'],
    '工资': [8000, 12000, 9000, 11000, 8500, 13000]
}
df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 按部门分组求平均工资
avg_salary = df.groupby('部门')['工资'].mean()
print("\\n各部门平均工资:")
print(avg_salary)

# 多个聚合函数
stats = df.groupby('部门')['工资'].agg(['mean', 'min', 'max', 'count'])
print("\\n各部门工资统计:")
print(stats)`,explanation:"groupby() 分组后可以应用 mean, sum, count 等聚合函数。"},{title:"数据透视表",code:`import pandas as pd

data = {
    '日期': ['2024-01', '2024-01', '2024-02', '2024-02', '2024-01', '2024-02'],
    '产品': ['A', 'B', 'A', 'B', 'A', 'B'],
    '销量': [100, 150, 120, 180, 110, 160],
    '收入': [10000, 15000, 12000, 18000, 11000, 16000]
}
df = pd.DataFrame(data)
print("原始数据:")
print(df)

# 创建数据透视表
pivot = pd.pivot_table(df, values='销量', index='日期', columns='产品', aggfunc='sum')
print("\\n销量透视表:")
print(pivot)

# 多个值
pivot2 = pd.pivot_table(df, values=['销量', '收入'], index='日期', columns='产品', aggfunc='sum')
print("\\n销量和收入透视表:")
print(pivot2)`,explanation:"pivot_table() 重组数据，index 为行，columns 为列，values 为值。"},{title:"统计分析",code:`import pandas as pd
import numpy as np

np.random.seed(42)
data = {
    '数学': np.random.randint(60, 100, 10),
    '英语': np.random.randint(60, 100, 10),
    '物理': np.random.randint(60, 100, 10)
}
df = pd.DataFrame(data)
print("学生成绩:")
print(df)

# 描述性统计
print("\\n描述性统计:")
print(df.describe())

# 相关系数
print("\\n相关系数矩阵:")
print(df.corr())

# 各科平均分
print("\\n各科平均分:")
print(df.mean())

# 总分和排名
df['总分'] = df.sum(axis=1)
df['排名'] = df['总分'].rank(ascending=False)
print("\\n添加总分和排名:")
print(df)`,explanation:"describe() 显示统计摘要，corr() 计算相关系数，rank() 计算排名。"}]},{id:"visualization",title:"数据可视化",description:"Pandas 内置了基于 Matplotlib 的绘图功能。",concepts:[{name:"内置绘图",explanation:"DataFrame 和 Series 都有 plot() 方法，可以快速创建各种图表。",math:"\\text{DataFrame} \\xrightarrow{\\text{plot()}} \\text{Visualization}"}],examples:[{title:"线图和柱状图",code:`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# 创建时间序列数据
dates = pd.date_range('2024-01-01', periods=30, freq='D')
data = {
    '销售额': np.random.randint(1000, 5000, 30),
    '访问量': np.random.randint(500, 2000, 30)
}
df = pd.DataFrame(data, index=dates)

# 线图
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
df['销售额'].plot(title='每日销售额', ylabel='金额（元）', grid=True)

# 柱状图
plt.subplot(1, 2, 2)
df['访问量'].plot(kind='bar', title='每日访问量', ylabel='次数', grid=True)
plt.xticks([0, 9, 19, 29], ['1日', '10日', '20日', '30日'])

plt.tight_layout()
plt.show()

print("图表已生成")`,explanation:"plot() 默认绘制线图，kind 参数可指定其他图表类型。"},{title:"分组可视化",code:`import pandas as pd
import matplotlib.pyplot as plt

data = {
    '部门': ['销售', '技术', '销售', '技术', '销售', '技术'],
    '季度': ['Q1', 'Q1', 'Q2', 'Q2', 'Q3', 'Q3'],
    '业绩': [100, 150, 120, 180, 140, 200]
}
df = pd.DataFrame(data)

# 数据透视
pivot = df.pivot(index='季度', columns='部门', values='业绩')
print("业绩数据:")
print(pivot)

# 分组柱状图
plt.figure(figsize=(10, 5))
pivot.plot(kind='bar', title='各部门季度业绩对比', ylabel='业绩', rot=0)
plt.legend(title='部门')
plt.grid(axis='y', alpha=0.3)
plt.show()

print("对比图已生成")`,explanation:"先用 pivot 重组数据，再绘制分组柱状图。"},{title:"箱线图和散点图",code:`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = {
    '数学': np.random.normal(75, 10, 50),
    '英语': np.random.normal(70, 15, 50),
    '物理': np.random.normal(80, 12, 50)
}
df = pd.DataFrame(data)

# 箱线图
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
df.plot(kind='box', title='各科成绩分布', ylabel='分数', grid=True)

# 散点图
plt.subplot(1, 2, 2)
df.plot(kind='scatter', x='数学', y='物理', title='数学 vs 物理', 
        s=50, alpha=0.6, grid=True)

plt.tight_layout()
plt.show()

print("分布图已生成")`,explanation:'kind="box" 绘制箱线图，kind="scatter" 绘制散点图。'}]}]},He={...oe,title:"Pandas",description:"Pandas is the core library for data analysis in Python, providing efficient data structures and analysis tools.",sections:[{id:"data-structures",title:"Data Structures",description:"The two primary data structures of Pandas are Series (1D) and DataFrame (2D).",concepts:[{name:"Series",explanation:"Series is a labeled one-dimensional array, similar to a dictionary or an indexed list.",math:"S = \\{(i_k, v_k)\\}_{k=1}^{n}"},{name:"DataFrame",explanation:"DataFrame is a 2-dimensional tabular data structure with both row and column indices.",math:"D \\in \\mathbb{R}^{m \\times n}, \\text{ with row and column labels}"}],examples:[{title:"Series Basics",code:`import pandas as pd
import numpy as np

# Create Series from list
s1 = pd.Series([1, 2, 3, 4, 5])
print("Series 1:")
print(s1)

# With custom index
s2 = pd.Series([10, 20, 30], index=['a', 'b', 'c'])
print("\\nSeries 2 (custom index):")
print(s2)

# From dictionary
s3 = pd.Series({'Beijing': 2154, 'Shanghai': 2424, 'Guangzhou': 1404})
print("\\nSeries 3 (City Population):")
print(s3)

# Access element
print("\\nShanghai Population:", s3['Shanghai'])`,explanation:"Series can be created from lists, arrays, or dictionaries, and supports labeled indexing."},{title:"DataFrame Basics",code:`import pandas as pd

# Create DataFrame from dictionary
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 35, 28],
    'City': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen'],
    'Salary': [8000, 12000, 10000, 9500]
}
df = pd.DataFrame(data)
print("DataFrame:")
print(df)

# Basic info
print("\\nShape:", df.shape)
print("Columns:", df.columns.tolist())
print("\\nFirst 2 rows:")
print(df.head(2))`,explanation:"DataFrame is like an Excel spreadsheet where each column can be a different data type."},{title:"Data Selection",code:`import pandas as pd

data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 35, 28],
    'Salary': [8000, 12000, 10000, 9500]
}
df = pd.DataFrame(data)

# Select column
print("Salary Column:")
print(df['Salary'])

# Select multiple columns
print("\\nName and Salary:")
print(df[['Name', 'Salary']])

# Select row (by position)
print("\\nFirst Row:")
print(df.iloc[0])

# Select rows (by label/index)
print("\\nFirst two rows:")
print(df.loc[0:1])

# Conditional selection
print("\\nEmployees with Salary > 9000:")
print(df[df['Salary'] > 9000])`,explanation:"Use [] to select columns, iloc for position-based, loc for label-based selection, and boolean indexing."}]},{id:"data-cleaning",title:"Data Cleaning",description:"Data cleaning involves handling missing values, duplicates, and data type conversions.",concepts:[{name:"Missing Values",explanation:"Pandas uses NaN for missing values and provides methods to handle them.",math:"\\text{NaN} \\in \\text{missing values}"},{name:"Data Transformation",explanation:"You can convert data types, rename columns, replace values, etc.",math:"f: D \\to D'"}],examples:[{title:"Handling Missing Values",code:`import pandas as pd
import numpy as np

# DataFrame with missing values
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, np.nan, 35, 28],
    'Salary': [8000, 12000, np.nan, 9500]
}
df = pd.DataFrame(data)
print("Original Data:")
print(df)

# Check missing
print("\\nMissing count:")
print(df.isnull().sum())

# Drop missing
df_dropped = df.dropna()
print("\\nDropped missing:")
print(df_dropped)

# Fill missing
df_filled = df.fillna({'Age': df['Age'].mean(), 'Salary': 0})
print("\\nFilled missing:")
print(df_filled)`,explanation:"isnull() detects missing, dropna() removes them, fillna() fills them."},{title:"Handling Duplicates",code:`import pandas as pd

# DataFrame with duplicates
data = {
    'Name': ['Alice', 'Bob', 'Alice', 'Charlie'],
    'Age': [25, 30, 25, 35]
}
df = pd.DataFrame(data)
print("Original Data:")
print(df)

# Check duplicates
print("\\nDuplicate rows:")
print(df.duplicated())

# Drop duplicates
df_unique = df.drop_duplicates()
print("\\nDropped duplicates:")
print(df_unique)

# Keep last
df_last = df.drop_duplicates(keep='last')
print("\\nKeep last:")
print(df_last)`,explanation:"duplicated() finds duplicates, drop_duplicates() removes rows."},{title:"Data Type Conversion",code:`import pandas as pd

data = {
    'ID': ['1', '2', '3', '4'],
    'Price': ['100.5', '200.3', '150.0', '180.8'],
    'Date': ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04']
}
df = pd.DataFrame(data)
print("Original types:")
print(df.dtypes)

# Convert types
df['ID'] = df['ID'].astype(int)
df['Price'] = df['Price'].astype(float)
df['Date'] = pd.to_datetime(df['Date'])

print("\\nConverted types:")
print(df.dtypes)
print("\\nConverted data:")
print(df)`,explanation:"astype() converts types, to_datetime() handles dates."}]},{id:"data-analysis",title:"Data Analysis",description:"Pandas offers powerful grouping, aggregation, and statistical analysis features.",concepts:[{name:"GroupBy",explanation:"groupby() groups data using a mapper or by a Series of columns.",math:"\\text{GroupBy}: D \\to \\{G_1, G_2, ..., G_k\\} \\to \\text{Aggregate}"},{name:"Pivot Table",explanation:"pivot_table() creates a spreadsheet-style pivot table as a DataFrame.",math:"\\text{Pivot}: D \\to D_{\\text{summary}}"}],examples:[{title:"Grouping and Aggregation",code:`import pandas as pd

data = {
    'Dept': ['Sales', 'Tech', 'Sales', 'Tech', 'Sales', 'Tech'],
    'Name': ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'],
    'Salary': [8000, 12000, 9000, 11000, 8500, 13000]
}
df = pd.DataFrame(data)
print("Original Data:")
print(df)

# Mean salary by Dept
avg_salary = df.groupby('Dept')['Salary'].mean()
print("\\nAverage Salary by Dept:")
print(avg_salary)

# Multiple aggregations
stats = df.groupby('Dept')['Salary'].agg(['mean', 'min', 'max', 'count'])
print("\\nSalary Stats by Dept:")
print(stats)`,explanation:"groupby() splits data into groups for applying functions like mean, sum, etc."},{title:"Pivot Tables",code:`import pandas as pd

data = {
    'Date': ['2024-01', '2024-01', '2024-02', '2024-02', '2024-01', '2024-02'],
    'Product': ['A', 'B', 'A', 'B', 'A', 'B'],
    'Sales': [100, 150, 120, 180, 110, 160],
    'Revenue': [10000, 15000, 12000, 18000, 11000, 16000]
}
df = pd.DataFrame(data)
print("Original Data:")
print(df)

# Create pivot table
pivot = pd.pivot_table(df, values='Sales', index='Date', columns='Product', aggfunc='sum')
print("\\nSales Pivot Table:")
print(pivot)

# Multiple values
pivot2 = pd.pivot_table(df, values=['Sales', 'Revenue'], index='Date', columns='Product', aggfunc='sum')
print("\\nSales & Revenue Pivot Table:")
print(pivot2)`,explanation:"pivot_table() reshapes data based on index/columns values."},{title:"Statistical Analysis",code:`import pandas as pd
import numpy as np

np.random.seed(42)
data = {
    'Math': np.random.randint(60, 100, 10),
    'English': np.random.randint(60, 100, 10),
    'Physics': np.random.randint(60, 100, 10)
}
df = pd.DataFrame(data)
print("Student Grades:")
print(df)

# Descriptive stats
print("\\nDescriptive Stats:")
print(df.describe())

# Correlation
print("\\nCorrelation Matrix:")
print(df.corr())

# Mean per subject
print("\\nMean per subject:")
print(df.mean())

# Total and Rank
df['Total'] = df.sum(axis=1)
df['Rank'] = df['Total'].rank(ascending=False)
print("\\nWith Total and Rank:")
print(df)`,explanation:"describe() gives summary stats, corr() for correlation, rank() for ranking."}]},{id:"visualization",title:"Data Visualization",description:"Pandas has built-in plotting capabilities based on Matplotlib.",concepts:[{name:"Built-in Plotting",explanation:"DataFrame and Series have a plot() method for quick visualization.",math:"\\text{DataFrame} \\xrightarrow{\\text{plot()}} \\text{Visualization}"}],examples:[{title:"Line and Bar and Plots",code:`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Time series data
dates = pd.date_range('2024-01-01', periods=30, freq='D')
data = {
    'Sales': np.random.randint(1000, 5000, 30),
    'Visits': np.random.randint(500, 2000, 30)
}
df = pd.DataFrame(data, index=dates)

# Line plot
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
df['Sales'].plot(title='Daily Sales', ylabel='Amount', grid=True)

# Bar plot
plt.subplot(1, 2, 2)
df['Visits'].plot(kind='bar', title='Daily Visits', ylabel='Count', grid=True)
plt.xticks([0, 9, 19, 29], ['1st', '10th', '20th', '30th'])

plt.tight_layout()
plt.show()

print("Charts generated")`,explanation:"plot() creates line plots default; kind specifies other types."},{title:"Grouped Visualization",code:`import pandas as pd
import matplotlib.pyplot as plt

data = {
    'Dept': ['Sales', 'Tech', 'Sales', 'Tech', 'Sales', 'Tech'],
    'Quarter': ['Q1', 'Q1', 'Q2', 'Q2', 'Q3', 'Q3'],
    'Performance': [100, 150, 120, 180, 140, 200]
}
df = pd.DataFrame(data)

# Pivot
pivot = df.pivot(index='Quarter', columns='Dept', values='Performance')
print("Performance Data:")
print(pivot)

# Grouped bar chart
plt.figure(figsize=(10, 5))
pivot.plot(kind='bar', title='Performance by Dept', ylabel='Score', rot=0)
plt.legend(title='Dept')
plt.grid(axis='y', alpha=0.3)
plt.show()

print("Comparison chart generated")`,explanation:"Pivot data first, then plot grouped bar charts."},{title:"Box and Scatter Plots",code:`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = {
    'Math': np.random.normal(75, 10, 50),
    'English': np.random.normal(70, 15, 50),
    'Physics': np.random.normal(80, 12, 50)
}
df = pd.DataFrame(data)

# Box plot
plt.figure(figsize=(12, 5))
plt.subplot(1, 2, 1)
df.plot(kind='box', title='Grade Distribution', ylabel='Score', grid=True)

# Scatter plot
plt.subplot(1, 2, 2)
df.plot(kind='scatter', x='Math', y='Physics', title='Math vs Physics', 
        s=50, alpha=0.6, grid=True)

plt.tight_layout()
plt.show()

print("Distribution charts generated")`,explanation:'kind="box" for boxplots, kind="scatter" for scatter plots.'}]}]},ht={zh:We,en:He},Ge={class:"max-w-[1800px] mx-auto animate-fade-in px-4 sm:px-6 pt-4 pb-20 relative"},Ye={class:"bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-700 overflow-hidden mt-8"},Xe={class:"p-8 sm:p-12 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10"},Ze={class:"text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-2"},Qe={class:"mt-3 text-slate-500 font-medium text-lg"},Je={class:"mt-4 flex items-center gap-3"},Ke={class:"text-sm font-medium text-slate-600 dark:text-slate-300"},ta={class:"flex border-b border-slate-100 dark:border-slate-700 overflow-x-auto"},ea=["onClick"],aa={class:"text-xl mr-2"},ia={key:0,class:"absolute bottom-0 left-0 right-0 h-1 bg-blue-500"},na={class:"grid grid-cols-1 lg:grid-cols-3 gap-6 p-6"},ra={class:"lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto"},oa={class:"text-xl font-black text-slate-700 dark:text-slate-200 sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur py-2 z-10"},la={class:"space-y-2"},sa=["onClick"],pa={key:0,class:"p-4 bg-white dark:bg-slate-800 space-y-4"},da={class:"text-sm text-slate-600 dark:text-slate-400"},ca={key:0,class:"space-y-3"},ma={class:"text-xs font-black uppercase text-slate-500"},ua={class:"font-bold text-sm text-slate-700 dark:text-slate-200"},fa={class:"text-xs text-slate-600 dark:text-slate-400"},xa={key:0,class:"bg-slate-50 dark:bg-slate-900 p-3 rounded-xl overflow-x-auto"},ya=["innerHTML"],ga={key:1,class:"space-y-2"},ha={class:"text-xs font-black uppercase text-slate-500"},ba=["onClick"],va={class:"flex items-center justify-between"},_a={class:"font-bold text-sm text-slate-700 dark:text-slate-200"},wa={class:"text-xs text-blue-600 dark:text-blue-400 font-bold"},Sa={class:"text-xs text-slate-500 mt-1"},Aa={class:"lg:col-span-2 space-y-4"},ka={class:"space-y-3"},Da={class:"flex items-center justify-between"},Fa={class:"flex gap-2"},Pa=["disabled"],Ea={key:0,class:"animate-spin h-4 w-4",fill:"none",viewBox:"0 0 24 24"},za={class:"space-y-3"},Ca={class:"flex items-center justify-between"},Ta={class:"text-xl font-black text-slate-700 dark:text-slate-200"},Na={key:0,class:"bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6"},qa={class:"font-bold text-red-700 dark:text-red-400 mb-2"},Ba={class:"text-xs text-red-600 dark:text-red-300 font-mono whitespace-pre-wrap"},Ia={key:1,class:"bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 min-h-[150px]"},Oa={class:"text-sm text-green-400 font-mono whitespace-pre-wrap"},Ra={key:2,class:"space-y-4"},Ma={class:"text-sm font-black uppercase text-slate-500"},La={class:"grid grid-cols-1 gap-4"},ja=["src","alt"],$a={key:3,class:"bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center"},Va={class:"text-slate-400 font-medium"},Ua={__name:"index",setup(t){self.MonacoEnvironment={getWorker(d,y){return y==="json"?new Worker(new URL("/tools/assets/json.worker-BMhEWbJs.js",import.meta.url),{type:"module"}):y==="css"||y==="scss"||y==="less"?new Worker(new URL("/tools/assets/css.worker-CcP-duhg.js",import.meta.url),{type:"module"}):y==="html"||y==="handlebars"||y==="razor"?new Worker(new URL("/tools/assets/html.worker-4BlL5qLP.js",import.meta.url),{type:"module"}):y==="typescript"||y==="javascript"?new Worker(new URL("/tools/assets/ts.worker-h-kbVMTq.js",import.meta.url),{type:"module"}):new Worker(new URL("/tools/assets/editor.worker-D6OT0mgP.js",import.meta.url),{type:"module"})}};const{t:e,locale:a}=ge(),i=D("numpy"),r=D(null),n=he(null),o=D("not-loaded"),p=D(""),c=D(!1),m=D(""),u=D([]),x=D(""),g=D(null),P=D(null),A=D(!1),G={numpy:ft,matplotlib:xt,sympy:yt,scipy:gt,pandas:ht},le=pt(()=>{const d=G[i.value];return d?d.zh||d.en?d[a.value]||d.en||d.zh:d:{}}),K=pt(()=>{var d;return((d=le.value)==null?void 0:d.sections)||[]}),tt={numpy:ft[a.value].sections[0].examples[0].code,matplotlib:xt[a.value].sections[0].examples[0].code,sympy:yt[a.value].sections[0].examples[0].code,scipy:gt[a.value].sections[0].examples[0].code,pandas:ht[a.value].sections[0].examples[0].code},se=()=>{r.value&&(n.value=Ae.create(r.value,{value:tt[i.value],language:"python",theme:"vs-dark",fontSize:14,minimap:{enabled:!1},scrollBeyondLastLine:!1,automaticLayout:!0,tabSize:4,wordWrap:"on"}))},pe=async()=>{try{o.value="loading",await ee(d=>{p.value=d}),o.value="ready",p.value=""}catch(d){o.value="error",x.value=`加载 Python 失败: ${d.message}`,p.value=""}},de=async()=>{if(!(!n.value||o.value!=="ready")){c.value=!0,m.value="",u.value=[],x.value="";try{console.log("Fetching code from editor...");const d=n.value.getValue();console.log("Code fetched:",d.substring(0,50)+"..."),console.log("Calling runPythonCode...");const y=await Ie(d);console.log("runPythonCode returned"),y.error?x.value=y.error:(m.value=y.output||"Code executed successfully (no output)",u.value=y.plots||[])}catch(d){x.value=d.message}finally{c.value=!1}}},Y=()=>{m.value="",u.value=[],x.value=""},ce=()=>{n.value&&n.value.setValue(tt[i.value]),Y()},me=async()=>{if(n.value)try{await navigator.clipboard.writeText(n.value.getValue()),A.value=!0,setTimeout(()=>A.value=!1,2e3)}catch(d){console.error("Failed to copy:",d)}},ue=d=>{n.value&&d.code&&(n.value.setValue(d.code),P.value=d,Y())},fe=d=>{var y;((y=g.value)==null?void 0:y.id)===d.id?g.value=null:(g.value=d,u.value=[],x.value="")};be(i,d=>{n.value&&n.value.setValue(tt[d]),g.value=null,P.value=null,Y()}),ve(()=>{se(),pe(),K.value.length>0&&(g.value=K.value[0])}),_e(()=>{n.value&&n.value.dispose()});const xe=d=>d&&!d.includes("$")&&(d.includes("\\")||d.includes("="))?ut(`$$${d}$$`):ut(d);return(d,y)=>(b(),h("div",Ge,[we(Se),s("div",Ye,[s("div",Xe,[s("h2",Ze,f(_(e)("tools.python-playground.title")),1),s("p",Qe,f(_(e)("tools.python-playground.desc")),1),s("div",Je,[s("div",{class:M(["w-3 h-3 rounded-full",o.value==="ready"?"bg-green-500 animate-pulse":o.value==="loading"?"bg-yellow-500 animate-pulse":o.value==="error"?"bg-red-500":"bg-gray-400"])},null,2),s("span",Ke,f(_(e)(`tools.python-playground.status.${o.value}`)),1)])]),s("div",ta,[(b(),h(L,null,j(["numpy","matplotlib","sympy","scipy","pandas"],v=>s("button",{key:v,onClick:B=>i.value=v,class:M(["flex-1 min-w-[120px] py-4 px-6 font-bold text-sm uppercase tracking-widest transition-all relative whitespace-nowrap",i.value===v?"text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/10":"text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"])},[s("span",aa,f(G[v].icon),1),dt(" "+f(_(e)(`tools.python-playground.tabs.${v}`))+" ",1),i.value===v?(b(),h("div",ia)):F("",!0)],10,ea)),64))]),s("div",na,[s("div",ra,[s("h3",oa,f(_(e)("tools.python-playground.knowledge.title")),1),s("div",la,[(b(!0),h(L,null,j(K.value,v=>{var B,st;return b(),h("div",{key:v.id,class:"border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"},[s("button",{onClick:k=>fe(v),class:M(["w-full p-4 text-left font-bold transition-all",((B=g.value)==null?void 0:B.id)===v.id?"bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300":"bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"])},f(v.title),11,sa),((st=g.value)==null?void 0:st.id)===v.id?(b(),h("div",pa,[s("p",da,f(v.description),1),v.concepts?(b(),h("div",ca,[s("h4",ma,f(_(e)("tools.python-playground.knowledge.concepts")||"核心概念"),1),(b(!0),h(L,null,j(v.concepts,k=>(b(),h("div",{key:k.name,class:"space-y-2"},[s("p",ua,f(k.name),1),s("p",fa,f(k.explanation),1),k.math?(b(),h("div",xa,[s("div",{innerHTML:xe(k.math),class:"text-center"},null,8,ya)])):F("",!0)]))),128))])):F("",!0),v.examples?(b(),h("div",ga,[s("h4",ha,f(_(e)("tools.python-playground.knowledge.examples")||"示例代码"),1),(b(!0),h(L,null,j(v.examples,k=>(b(),h("div",{key:k.title,class:"border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer",onClick:Wa=>ue(k)},[s("div",va,[s("p",_a,f(k.title),1),s("button",wa,f(_(e)("tools.python-playground.buttons.load_example")),1)]),s("p",Sa,f(k.explanation),1)],8,ba))),128))])):F("",!0)])):F("",!0)])}),128))])]),s("div",Aa,[s("div",ka,[s("div",Da,[y[1]||(y[1]=s("h3",{class:"text-xl font-black text-slate-700 dark:text-slate-200"},"代码编辑器",-1)),s("div",Fa,[s("button",{onClick:me,class:M(["px-4 py-2 rounded-xl font-bold text-xs transition-all",A.value?"bg-green-500 text-white":"bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"])},f(A.value?_(e)("tools.python-playground.buttons.copied"):_(e)("tools.python-playground.buttons.copy")),3),s("button",{onClick:ce,class:"px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"},f(_(e)("tools.python-playground.buttons.clear")),1),s("button",{onClick:de,disabled:o.value!=="ready"||c.value,class:M(["px-6 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2",o.value==="ready"&&!c.value?"bg-blue-600 hover:bg-blue-700 text-white":"bg-slate-300 dark:bg-slate-600 text-slate-500 cursor-not-allowed"])},[c.value?(b(),h("svg",Ea,[...y[0]||(y[0]=[s("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"},null,-1),s("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"},null,-1)])])):F("",!0),dt(" "+f(c.value?_(e)("tools.python-playground.status.running"):_(e)("tools.python-playground.buttons.run")),1)],10,Pa)])]),s("div",{ref_key:"editorContainer",ref:r,class:"h-[400px] border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"},null,512)]),s("div",za,[s("div",Ca,[s("h3",Ta,f(_(e)("tools.python-playground.output.console")),1),m.value||u.value.length>0||x.value?(b(),h("button",{key:0,onClick:Y,class:"text-xs text-red-500 hover:text-red-600 font-bold"}," 清空输出 ")):F("",!0)]),x.value?(b(),h("div",Na,[s("h4",qa,f(_(e)("tools.python-playground.output.error_title")),1),s("pre",Ba,f(x.value),1)])):F("",!0),m.value?(b(),h("div",Ia,[s("pre",Oa,f(m.value),1)])):F("",!0),u.value.length>0?(b(),h("div",Ra,[s("h4",Ma,f(_(e)("tools.python-playground.output.plots")),1),s("div",La,[(b(!0),h(L,null,j(u.value,(v,B)=>(b(),h("div",{key:B,class:"bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 flex items-center justify-center"},[s("img",{src:`data:image/png;base64,${v}`,class:"max-w-full rounded-lg",alt:`Plot ${B+1}`},null,8,ja)]))),128))])])):F("",!0),!m.value&&u.value.length===0&&!x.value?(b(),h("div",$a,[s("p",Va,f(_(e)("tools.python-playground.output.no_output")),1)])):F("",!0)])])])])]))}},Xa=ye(Ua,[["__scopeId","data-v-6ed79688"]]);export{Xa as default};
