import{_ as ne,u as ie,r as A,k as ot,l as re,o as le,a as oe,c as x,b as pe,d as p,t as f,e as v,n as q,F as $,f as M,g as N,i as pt,j as y,B as se}from"./index-CMYSeyTK.js";import{_ as F,e as de}from"./monaco-editor-CGO6wXTd.js";import ce from"./katex-Cu_Erd72.js";var ue=Object.defineProperty,o=(t,e)=>ue(t,"name",{value:e,configurable:!0}),ut=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(e,a)=>(typeof require<"u"?require:e)[a]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+t+'" is not supported')}),me=(()=>{for(var t=new Uint8Array(128),e=0;e<64;e++)t[e<26?e+65:e<52?e+71:e<62?e-4:e*4-205]=e;return a=>{for(var r=a.length,n=new Uint8Array((r-(a[r-1]=="=")-(a[r-2]=="="))*3/4|0),i=0,l=0;i<r;){var s=t[a.charCodeAt(i++)],d=t[a.charCodeAt(i++)],c=t[a.charCodeAt(i++)],u=t[a.charCodeAt(i++)];n[l++]=s<<2|d>>4,n[l++]=d<<4|c>>2,n[l++]=c<<6|u}return n}})();function mt(t){return!isNaN(parseFloat(t))&&isFinite(t)}o(mt,"_isNumber");function D(t){return t.charAt(0).toUpperCase()+t.substring(1)}o(D,"_capitalize");function Z(t){return function(){return this[t]}}o(Z,"_getter");var B=["isConstructor","isEval","isNative","isToplevel"],C=["columnNumber","lineNumber"],L=["fileName","functionName","source"],fe=["args"],xe=["evalOrigin"],X=B.concat(C,L,fe,xe);function k(t){if(t)for(var e=0;e<X.length;e++)t[X[e]]!==void 0&&this["set"+D(X[e])](t[X[e]])}o(k,"StackFrame");k.prototype={getArgs:o(function(){return this.args},"getArgs"),setArgs:o(function(t){if(Object.prototype.toString.call(t)!=="[object Array]")throw new TypeError("Args must be an Array");this.args=t},"setArgs"),getEvalOrigin:o(function(){return this.evalOrigin},"getEvalOrigin"),setEvalOrigin:o(function(t){if(t instanceof k)this.evalOrigin=t;else if(t instanceof Object)this.evalOrigin=new k(t);else throw new TypeError("Eval Origin must be an Object or StackFrame")},"setEvalOrigin"),toString:o(function(){var t=this.getFileName()||"",e=this.getLineNumber()||"",a=this.getColumnNumber()||"",r=this.getFunctionName()||"";return this.getIsEval()?t?"[eval] ("+t+":"+e+":"+a+")":"[eval]:"+e+":"+a:r?r+" ("+t+":"+e+":"+a+")":t+":"+e+":"+a},"toString")};k.fromString=o(function(t){var e=t.indexOf("("),a=t.lastIndexOf(")"),r=t.substring(0,e),n=t.substring(e+1,a).split(","),i=t.substring(a+1);if(i.indexOf("@")===0)var l=/@(.+?)(?::(\d+))?(?::(\d+))?$/.exec(i,""),s=l[1],d=l[2],c=l[3];return new k({functionName:r,args:n||void 0,fileName:s,lineNumber:d||void 0,columnNumber:c||void 0})},"StackFrame$$fromString");for(I=0;I<B.length;I++)k.prototype["get"+D(B[I])]=Z(B[I]),k.prototype["set"+D(B[I])]=(function(t){return function(e){this[t]=!!e}})(B[I]);var I;for(T=0;T<C.length;T++)k.prototype["get"+D(C[T])]=Z(C[T]),k.prototype["set"+D(C[T])]=(function(t){return function(e){if(!mt(e))throw new TypeError(t+" must be a Number");this[t]=Number(e)}})(C[T]);var T;for(O=0;O<L.length;O++)k.prototype["get"+D(L[O])]=Z(L[O]),k.prototype["set"+D(L[O])]=(function(t){return function(e){this[t]=String(e)}})(L[O]);var O,Q=k;function ft(){var t=/^\s*at .*(\S+:\d+|\(native\))/m,e=/^(eval@)?(\[native code])?$/;return{parse:o(function(a){if(a.stack&&a.stack.match(t))return this.parseV8OrIE(a);if(a.stack)return this.parseFFOrSafari(a);throw new Error("Cannot parse given Error object")},"ErrorStackParser$$parse"),extractLocation:o(function(a){if(a.indexOf(":")===-1)return[a];var r=/(.+?)(?::(\d+))?(?::(\d+))?$/,n=r.exec(a.replace(/[()]/g,""));return[n[1],n[2]||void 0,n[3]||void 0]},"ErrorStackParser$$extractLocation"),parseV8OrIE:o(function(a){var r=a.stack.split(`
`).filter(function(n){return!!n.match(t)},this);return r.map(function(n){n.indexOf("(eval ")>-1&&(n=n.replace(/eval code/g,"eval").replace(/(\(eval at [^()]*)|(,.*$)/g,""));var i=n.replace(/^\s+/,"").replace(/\(eval code/g,"(").replace(/^.*?\s+/,""),l=i.match(/ (\(.+\)$)/);i=l?i.replace(l[0],""):i;var s=this.extractLocation(l?l[1]:i),d=l&&i||void 0,c=["eval","<anonymous>"].indexOf(s[0])>-1?void 0:s[0];return new Q({functionName:d,fileName:c,lineNumber:s[1],columnNumber:s[2],source:n})},this)},"ErrorStackParser$$parseV8OrIE"),parseFFOrSafari:o(function(a){var r=a.stack.split(`
`).filter(function(n){return!n.match(e)},this);return r.map(function(n){if(n.indexOf(" > eval")>-1&&(n=n.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g,":$1")),n.indexOf("@")===-1&&n.indexOf(":")===-1)return new Q({functionName:n});var i=/((.*".+"[^@]*)?[^@]*)(?:@)/,l=n.match(i),s=l&&l[1]?l[1]:void 0,d=this.extractLocation(n.replace(i,""));return new Q({functionName:s,fileName:d[0],lineNumber:d[1],columnNumber:d[2],source:n})},this)},"ErrorStackParser$$parseFFOrSafari")}}o(ft,"ErrorStackParser");var ye=new ft,be=ye;function xt(){if(typeof API<"u"&&API!==globalThis.API)return API.runtimeEnv;let t=typeof Bun<"u",e=typeof Deno<"u",a=typeof process=="object"&&typeof process.versions=="object"&&typeof process.versions.node=="string"&&!process.browser,r=typeof navigator=="object"&&typeof navigator.userAgent=="string"&&navigator.userAgent.indexOf("Chrome")===-1&&navigator.userAgent.indexOf("Safari")>-1;return yt({IN_BUN:t,IN_DENO:e,IN_NODE:a,IN_SAFARI:r,IN_SHELL:typeof read=="function"&&typeof load=="function"})}o(xt,"getGlobalRuntimeEnv");var _=xt();function yt(t){let e=t.IN_NODE&&typeof module<"u"&&module.exports&&typeof ut=="function"&&typeof __dirname=="string",a=t.IN_NODE&&!e,r=!t.IN_NODE&&!t.IN_DENO&&!t.IN_BUN,n=r&&typeof window<"u"&&typeof window.document<"u"&&typeof document.createElement=="function"&&"sessionStorage"in window&&typeof globalThis.importScripts!="function",i=r&&typeof globalThis.WorkerGlobalScope<"u"&&typeof globalThis.self<"u"&&globalThis.self instanceof globalThis.WorkerGlobalScope;return{...t,IN_BROWSER:r,IN_BROWSER_MAIN_THREAD:n,IN_BROWSER_WEB_WORKER:i,IN_NODE_COMMONJS:e,IN_NODE_ESM:a}}o(yt,"calculateDerivedFlags");var bt,et,ht,st,nt;async function it(){if(!_.IN_NODE||(bt=(await F(async()=>{const{default:i}=await import("./__vite-browser-external-BIHI7g3E.js");return{default:i}},[])).default,st=await F(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),nt=await F(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),ht=(await F(async()=>{const{default:i}=await import("./__vite-browser-external-BIHI7g3E.js");return{default:i}},[])).default,et=await F(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),rt=et.sep,typeof ut<"u"))return;let t=st,e=await F(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),a=await F(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),r=await F(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]),n={fs:t,crypto:e,ws:a,child_process:r};globalThis.require=function(i){return n[i]}}o(it,"initNodeModules");function gt(t,e){return et.resolve(e||".",t)}o(gt,"node_resolvePath");function _t(t,e){return e===void 0&&(e=location),new URL(t,e).toString()}o(_t,"browser_resolvePath");var W;_.IN_NODE?W=gt:_.IN_SHELL?W=o(t=>t,"resolvePath"):W=_t;var rt;_.IN_NODE||(rt="/");function vt(t,e){return t.startsWith("file://")&&(t=t.slice(7)),t.includes("://")?{response:fetch(t)}:{binary:nt.readFile(t).then(a=>new Uint8Array(a.buffer,a.byteOffset,a.byteLength))}}o(vt,"node_getBinaryResponse");function wt(t,e){if(t.startsWith("file://")&&(t=t.slice(7)),t.includes("://"))throw new Error("Shell cannot fetch urls");return{binary:Promise.resolve(new Uint8Array(readbuffer(t)))}}o(wt,"shell_getBinaryResponse");function kt(t,e){let a=new URL(t,location);return{response:fetch(a,e?{integrity:e}:{})}}o(kt,"browser_getBinaryResponse");var V;_.IN_NODE?V=vt:_.IN_SHELL?V=wt:V=kt;async function Et(t,e){let{response:a,binary:r}=V(t,e);if(r)return r;let n=await a;if(!n.ok)throw new Error(`Failed to load '${t}': request failed.`);return new Uint8Array(await n.arrayBuffer())}o(Et,"loadBinaryFile");var U;if(_.IN_BROWSER_MAIN_THREAD)U=o(async t=>await import(t),"loadScript");else if(_.IN_BROWSER_WEB_WORKER)U=o(async t=>{try{globalThis.importScripts(t)}catch(e){if(e instanceof TypeError)await import(t);else throw e}},"loadScript");else if(_.IN_NODE)U=At;else if(_.IN_SHELL)U=load;else throw new Error("Cannot determine runtime environment");async function At(t){t.startsWith("file://")&&(t=t.slice(7)),t.includes("://")?ht.runInThisContext(await(await fetch(t)).text()):await import(bt.pathToFileURL(t).href)}o(At,"nodeLoadScript");async function St(t){if(_.IN_NODE){await it();let e=await nt.readFile(t,{encoding:"utf8"});return JSON.parse(e)}else if(_.IN_SHELL){let e=read(t);return JSON.parse(e)}else return await(await fetch(t)).json()}o(St,"loadLockFile");async function Nt(){if(_.IN_NODE_COMMONJS)return __dirname;let t;try{throw new Error}catch(r){t=r}let e=be.parse(t)[0].fileName;if(_.IN_NODE&&!e.startsWith("file://")&&(e=`file://${e}`),_.IN_NODE_ESM){let r=await F(()=>import("./__vite-browser-external-BIHI7g3E.js"),[]);return(await F(async()=>{const{fileURLToPath:n}=await import("./__vite-browser-external-BIHI7g3E.js");return{fileURLToPath:n}},[])).fileURLToPath(r.dirname(e))}let a=e.lastIndexOf(rt);if(a===-1)throw new Error("Could not extract indexURL path from pyodide module location. Please pass the indexURL explicitly to loadPyodide.");return e.slice(0,a)}o(Nt,"calculateDirname");function Ft(t){var e;return t.substring(0,t.lastIndexOf("/")+1)||((e=globalThis.location)==null?void 0:e.toString())||"."}o(Ft,"calculateInstallBaseUrl");function Pt(t){let e=t.FS,a=t.FS.filesystems.MEMFS,r=t.PATH,n={DIR_MODE:16895,FILE_MODE:33279,mount:o(function(i){if(!i.opts.fileSystemHandle)throw new Error("opts.fileSystemHandle is required");return a.mount.apply(null,arguments)},"mount"),syncfs:o(async(i,l,s)=>{try{let d=n.getLocalSet(i),c=await n.getRemoteSet(i),u=l?c:d,h=l?d:c;await n.reconcile(i,u,h),s(null)}catch(d){s(d)}},"syncfs"),getLocalSet:o(i=>{let l=Object.create(null);function s(u){return u!=="."&&u!==".."}o(s,"isRealDir");function d(u){return h=>r.join2(u,h)}o(d,"toAbsolute");let c=e.readdir(i.mountpoint).filter(s).map(d(i.mountpoint));for(;c.length;){let u=c.pop(),h=e.stat(u);e.isDir(h.mode)&&c.push.apply(c,e.readdir(u).filter(s).map(d(u))),l[u]={timestamp:h.mtime,mode:h.mode}}return{type:"local",entries:l}},"getLocalSet"),getRemoteSet:o(async i=>{let l=Object.create(null),s=await he(i.opts.fileSystemHandle);for(let[d,c]of s)d!=="."&&(l[r.join2(i.mountpoint,d)]={timestamp:c.kind==="file"?new Date((await c.getFile()).lastModified):new Date,mode:c.kind==="file"?n.FILE_MODE:n.DIR_MODE});return{type:"remote",entries:l,handles:s}},"getRemoteSet"),loadLocalEntry:o(i=>{let l=e.lookupPath(i,{}).node,s=e.stat(i);if(e.isDir(s.mode))return{timestamp:s.mtime,mode:s.mode};if(e.isFile(s.mode))return l.contents=a.getFileDataAsTypedArray(l),{timestamp:s.mtime,mode:s.mode,contents:l.contents};throw new Error("node type not supported")},"loadLocalEntry"),storeLocalEntry:o((i,l)=>{if(e.isDir(l.mode))e.mkdirTree(i,l.mode);else if(e.isFile(l.mode))e.writeFile(i,l.contents,{canOwn:!0});else throw new Error("node type not supported");e.chmod(i,l.mode),e.utime(i,l.timestamp,l.timestamp)},"storeLocalEntry"),removeLocalEntry:o(i=>{var l=e.stat(i);e.isDir(l.mode)?e.rmdir(i):e.isFile(l.mode)&&e.unlink(i)},"removeLocalEntry"),loadRemoteEntry:o(async i=>{if(i.kind==="file"){let l=await i.getFile();return{contents:new Uint8Array(await l.arrayBuffer()),mode:n.FILE_MODE,timestamp:new Date(l.lastModified)}}else{if(i.kind==="directory")return{mode:n.DIR_MODE,timestamp:new Date};throw new Error("unknown kind: "+i.kind)}},"loadRemoteEntry"),storeRemoteEntry:o(async(i,l,s)=>{let d=i.get(r.dirname(l)),c=e.isFile(s.mode)?await d.getFileHandle(r.basename(l),{create:!0}):await d.getDirectoryHandle(r.basename(l),{create:!0});if(c.kind==="file"){let u=await c.createWritable();await u.write(s.contents),await u.close()}i.set(l,c)},"storeRemoteEntry"),removeRemoteEntry:o(async(i,l)=>{await i.get(r.dirname(l)).removeEntry(r.basename(l)),i.delete(l)},"removeRemoteEntry"),reconcile:o(async(i,l,s)=>{let d=0,c=[];Object.keys(l.entries).forEach(function(g){let E=l.entries[g],P=s.entries[g];(!P||e.isFile(E.mode)&&E.timestamp.getTime()>P.timestamp.getTime())&&(c.push(g),d++)}),c.sort();let u=[];if(Object.keys(s.entries).forEach(function(g){l.entries[g]||(u.push(g),d++)}),u.sort().reverse(),!d)return;let h=l.type==="remote"?l.handles:s.handles;for(let g of c){let E=r.normalize(g.replace(i.mountpoint,"/")).substring(1);if(s.type==="local"){let P=h.get(E),H=await n.loadRemoteEntry(P);n.storeLocalEntry(g,H)}else{let P=n.loadLocalEntry(g);await n.storeRemoteEntry(h,E,P)}}for(let g of u)if(s.type==="local")n.removeLocalEntry(g);else{let E=r.normalize(g.replace(i.mountpoint,"/")).substring(1);await n.removeRemoteEntry(h,E)}},"reconcile")};t.FS.filesystems.NATIVEFS_ASYNC=n}o(Pt,"initializeNativeFS");var he=o(async t=>{let e=[];async function a(n){for await(let i of n.values())e.push(i),i.kind==="directory"&&await a(i)}o(a,"collect"),await a(t);let r=new Map;r.set(".",t);for(let n of e){let i=(await t.resolve(n)).join("/");r.set(i,n)}return r},"getFsHandles"),ge=me("AGFzbQEAAAABDANfAGAAAW9gAW8BfwMDAgECByECD2NyZWF0ZV9zZW50aW5lbAAAC2lzX3NlbnRpbmVsAAEKEwIHAPsBAPsbCwkAIAD7GvsUAAs="),_e=(async function(){if(!(globalThis.navigator&&(/iPad|iPhone|iPod/.test(navigator.userAgent)||navigator.platform==="MacIntel"&&typeof navigator.maxTouchPoints<"u"&&navigator.maxTouchPoints>1)))try{let t=await WebAssembly.compile(ge);return await WebAssembly.instantiate(t)}catch(t){if(t instanceof WebAssembly.CompileError)return;throw t}})();async function Dt(){let t=await _e;if(t)return t.exports;let e=Symbol("error marker");return{create_sentinel:o(()=>e,"create_sentinel"),is_sentinel:o(a=>a===e,"is_sentinel")}}o(Dt,"getSentinelImport");function It(t){let e={config:t,runtimeEnv:_},a={noImageDecoding:!0,noAudioDecoding:!0,noWasmDecoding:!1,preRun:Ct(t),print:t.stdout,printErr:t.stderr,onExit(r){a.exitCode=r},thisProgram:t._sysExecutable,arguments:t.args,API:e,locateFile:o(r=>t.indexURL+r,"locateFile"),instantiateWasm:Lt(t.indexURL)};return a}o(It,"createSettings");function Tt(t){return function(e){let a="/";try{e.FS.mkdirTree(t)}catch(r){console.error(`Error occurred while making a home directory '${t}':`),console.error(r),console.error(`Using '${a}' for a home directory instead`),t=a}e.FS.chdir(t)}}o(Tt,"createHomeDirectory");function Ot(t){return function(e){Object.assign(e.ENV,t)}}o(Ot,"setEnvironment");function zt(t){return t?[async e=>{e.addRunDependency("fsInitHook");try{await t(e.FS,{sitePackages:e.API.sitePackages})}finally{e.removeRunDependency("fsInitHook")}}]:[]}o(zt,"callFsInitHook");function Rt(t){let e=t.HEAPU32[t._Py_Version>>>2],a=e>>>24&255,r=e>>>16&255,n=e>>>8&255;return[a,r,n]}o(Rt,"computeVersionTuple");function Bt(t){let e=Et(t);return async a=>{a.API.pyVersionTuple=Rt(a);let[r,n]=a.API.pyVersionTuple;a.FS.mkdirTree("/lib"),a.API.sitePackages=`/lib/python${r}.${n}/site-packages`,a.FS.mkdirTree(a.API.sitePackages),a.addRunDependency("install-stdlib");try{let i=await e;a.FS.writeFile(`/lib/python${r}${n}.zip`,i)}catch(i){console.error("Error occurred while installing the standard library:"),console.error(i)}finally{a.removeRunDependency("install-stdlib")}}}o(Bt,"installStdlib");function Ct(t){let e;return t.stdLibURL!=null?e=t.stdLibURL:e=t.indexURL+"python_stdlib.zip",[Bt(e),Tt(t.env.HOME),Ot(t.env),Pt,...zt(t.fsInit)]}o(Ct,"getFileSystemInitializationFuncs");function Lt(t){if(typeof WasmOffsetConverter<"u")return;let{binary:e,response:a}=V(t+"pyodide.asm.wasm"),r=Dt();return function(n,i){return(async function(){n.sentinel=await r;try{let l;a?l=await WebAssembly.instantiateStreaming(a,n):l=await WebAssembly.instantiate(await e,n);let{instance:s,module:d}=l;i(s,d)}catch(l){console.warn("wasm instantiation failed!"),console.warn(l)}})(),{}}}o(Lt,"getInstantiateWasmFunc");var ve="0.29.0";function j(t){return t===void 0||t.endsWith("/")?t:t+"/"}o(j,"withTrailingSlash");var at=ve;async function qt(t={}){var n,i;if(await it(),t.lockFileContents&&t.lockFileURL)throw new Error("Can't pass both lockFileContents and lockFileURL");let e=t.indexURL||await Nt();if(e=j(W(e)),t.packageBaseUrl=j(t.packageBaseUrl),t.cdnUrl=j(t.packageBaseUrl??`https://cdn.jsdelivr.net/pyodide/v${at}/full/`),!t.lockFileContents){let l=t.lockFileURL??e+"pyodide-lock.json";t.lockFileContents=St(l),t.packageBaseUrl??(t.packageBaseUrl=Ft(l))}t.indexURL=e,t.packageCacheDir&&(t.packageCacheDir=j(W(t.packageCacheDir)));let a={fullStdLib:!1,jsglobals:globalThis,stdin:globalThis.prompt?()=>globalThis.prompt():void 0,args:[],env:{},packages:[],packageCacheDir:t.packageBaseUrl,enableRunUntilComplete:!0,checkAPIVersion:!0,BUILD_ID:"761936574707325565bed16f46bb59050f9a5477dab28ba3db09f3fb41ea89e7"},r=Object.assign(a,t);return(n=r.env).HOME??(n.HOME="/home/pyodide"),(i=r.env).PYTHONINSPECT??(i.PYTHONINSPECT="1"),r}o(qt,"initializeConfiguration");function $t(t){let e=It(t),a=e.API;return a.lockFilePromise=Promise.resolve(t.lockFileContents),e}o($t,"createEmscriptenSettings");async function Mt(t){if(typeof _createPyodideModule!="function"){let e=`${t.indexURL}pyodide.asm.js`;await U(e)}}o(Mt,"loadWasmScript");async function Ut(t,e){if(!t._loadSnapshot)return;let a=await t._loadSnapshot,r=ArrayBuffer.isView(a)?a:new Uint8Array(a);return e.noInitialRun=!0,e.INITIAL_MEMORY=r.length,r}o(Ut,"prepareSnapshot");async function jt(t){let e=await _createPyodideModule(t);if(t.exitCode!==void 0)throw new e.ExitStatus(t.exitCode);return e}o(jt,"createPyodideModule");function Wt(t,e){let a=t.API;if(e.pyproxyToStringRepr&&a.setPyProxyToStringMethod(!0),e.convertNullToNone&&a.setCompatNullToNone(!0),e.toJsLiteralMap&&a.setCompatToJsLiteralMap(!0),a.version!==at&&e.checkAPIVersion)throw new Error(`Pyodide version does not match: '${at}' <==> '${a.version}'. If you updated the Pyodide version, make sure you also updated the 'indexURL' parameter passed to loadPyodide.`);t.locateFile=r=>{throw r.endsWith(".so")?new Error(`Failed to find dynamic library "${r}"`):new Error(`Unexpected call to locateFile("${r}")`)}}o(Wt,"configureAPI");function Vt(t,e,a){let r=t.API,n;return e&&(n=r.restoreSnapshot(e)),r.finalizeBootstrap(n,a._snapshotDeserializer)}o(Vt,"bootstrapPyodide");async function Ht(t,e){let a=t._api;return a.sys.path.insert(0,""),a._pyodide.set_excepthook(),await a.packageIndexReady,a.initializeStreams(e.stdin,e.stdout,e.stderr),t}o(Ht,"finalizeSetup");async function Gt(t={}){let e=await qt(t),a=$t(e);await Mt(e);let r=await Ut(e,a),n=await jt(a);Wt(n,e);let i=Vt(n,r,e);return await Ht(i,e)}o(Gt,"loadPyodide");let z=null,Y=!1,tt=null;async function Xt(t=null){return z||(Y||(Y=!0,tt=(async()=>{try{t&&t("正在加载 Pyodide 运行时...");const e="/tools/",a=`${e.endsWith("/")?e:e+"/"}pyodide/`;return t&&t("正在初始化 Python 环境..."),z=await Gt({indexURL:a}),t&&t("正在加载科学计算库..."),await z.loadPackage(["numpy","matplotlib","scipy","sympy","pandas"]),t&&t("正在配置环境..."),await z.runPythonAsync(`
        import matplotlib
        matplotlib.use('AGG')
        import matplotlib.pyplot as plt
        import io
        import base64
        import sys
        from io import StringIO
      `),Y=!1,t&&t("准备就绪！"),z}catch(e){throw Y=!1,new Error(`Failed to initialize Pyodide: ${e.message}`)}})()),tt)}async function we(t,e=null){await Xt(e);try{const a=`
import sys
import io
import base64
import matplotlib.pyplot as plt
from io import StringIO

# Capture stdout
_stdout_capture = StringIO()
_old_stdout = sys.stdout
sys.stdout = _stdout_capture

# Store plots
_plots = []

# Override plt.show() to capture plots
_original_show = plt.show
def _custom_show(*args, **kwargs):
    global _plots
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', facecolor='white')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    _plots.append(img_base64)
    plt.close('all')
    buf.close()

plt.show = _custom_show

try:
    # Execute user code
${t.split(`
`).map(i=>"    "+i).join(`
`)}
    
    # Restore stdout and get output
    sys.stdout = _old_stdout
    _output = _stdout_capture.getvalue()
    
except Exception as e:
    import traceback
    sys.stdout = _old_stdout
    _output = _stdout_capture.getvalue()
    _error = traceback.format_exc()
    raise Exception(_error)

# Return results as dict
{
    'output': _output,
    'plots': _plots
}
`,n=z.runPython(a).toJs({dict_converter:Object.fromEntries});return{output:n.output||"",plots:n.plots||[],error:null}}catch(a){let r=a.message;return r.includes("PythonError:")&&(r=r.split("PythonError:")[1].trim()),{output:"",plots:[],error:r}}}function dt(t,e=!1){try{return ce.renderToString(t,{displayMode:e,throwOnError:!1,trust:!0,strict:!1})}catch(a){return console.error("KaTeX rendering error:",a),`<span class="katex-error">${t}</span>`}}function ct(t){if(!t)return"";let e=t.replace(/\$\$([\s\S]+?)\$\$/g,(a,r)=>`<div class="math-block">${dt(r.trim(),!0)}</div>`);return e=e.replace(/\$([^$]+?)\$/g,(a,r)=>`<span class="math-inline">${dt(r.trim(),!1)}</span>`),e}const ke={id:"numpy",title:"NumPy",description:"NumPy 是 Python 科学计算的基础库，提供高性能的多维数组对象和丰富的数学函数。",icon:"🔢",sections:[{id:"array-basics",title:"数组基础",description:"NumPy 的核心是 ndarray（N-dimensional array）对象，它是一个快速、灵活的大型数据集容器。",concepts:[{name:"ndarray 创建",explanation:"ndarray 是 NumPy 的核心数据结构，可以通过多种方式创建：从 Python 列表、使用内置函数（zeros, ones, arange）等。",math:"\\mathbf{A} \\in \\mathbb{R}^{m \\times n}"},{name:"数组属性",explanation:"数组具有重要属性：shape（形状）、dtype（数据类型）、ndim（维度数）、size（元素总数）。",math:"\\text{shape} = (n_1, n_2, ..., n_k), \\quad \\text{size} = \\prod_{i=1}^{k} n_i"}],examples:[{title:"创建一维数组",code:`import numpy as np

# 从列表创建数组
arr = np.array([1, 2, 3, 4, 5])
print("数组:", arr)
print("形状:", arr.shape)
print("数据类型:", arr.dtype)
print("维度:", arr.ndim)`,explanation:"使用 np.array() 从 Python 列表创建 NumPy 数组，并查看其基本属性。"},{title:"创建二维数组",code:`import numpy as np

# 创建 2x3 的二维数组
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("数组:\\n", arr)
print("形状:", arr.shape)
print("大小:", arr.size)`,explanation:"二维数组类似于矩阵，shape 返回 (行数, 列数)。"},{title:"使用内置函数创建数组",code:`import numpy as np

# 创建全零数组
zeros = np.zeros((3, 4))
print("全零数组:\\n", zeros)

# 创建全一数组
ones = np.ones((2, 3))
print("\\n全一数组:\\n", ones)

# 创建等差数列
arange = np.arange(0, 10, 2)
print("\\n等差数列:", arange)

# 创建等分数列
linspace = np.linspace(0, 1, 5)
print("等分数列:", linspace)`,explanation:"NumPy 提供了多种便捷函数来创建特定模式的数组。"}]},{id:"array-operations",title:"数组操作",description:"NumPy 提供了强大的数组索引、切片和变形功能。",concepts:[{name:"索引和切片",explanation:"类似 Python 列表，但支持多维索引。使用 [start:stop:step] 语法进行切片。",math:"A[i, j] \\text{ 访问第 } i \\text{ 行第 } j \\text{ 列元素}"},{name:"数组变形",explanation:"reshape() 可以改变数组形状而不改变数据，flatten() 和 ravel() 可以将多维数组展平。",math:"\\mathbf{A}_{m \\times n} \\xrightarrow{\\text{reshape}} \\mathbf{B}_{p \\times q}, \\quad mn = pq"}],examples:[{title:"数组索引",code:`import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6], [7, 8, 9]])
print("原数组:\\n", arr)

# 访问单个元素
print("\\narr[0, 0] =", arr[0, 0])
print("arr[1, 2] =", arr[1, 2])

# 访问整行
print("\\n第一行:", arr[0, :])

# 访问整列
print("第二列:", arr[:, 1])`,explanation:"使用 [row, col] 语法访问二维数组元素，冒号 : 表示选择所有。"},{title:"数组切片",code:`import numpy as np

arr = np.arange(12).reshape(3, 4)
print("原数组:\\n", arr)

# 切片前两行
print("\\n前两行:\\n", arr[:2, :])

# 切片后两列
print("\\n后两列:\\n", arr[:, 2:])

# 子矩阵
print("\\n子矩阵:\\n", arr[1:3, 1:3])`,explanation:"切片操作返回原数组的视图，修改切片会影响原数组。"},{title:"数组变形",code:`import numpy as np

arr = np.arange(12)
print("原数组:", arr)

# 变形为 3x4
reshaped = arr.reshape(3, 4)
print("\\n3x4 数组:\\n", reshaped)

# 变形为 2x6
reshaped2 = arr.reshape(2, 6)
print("\\n2x6 数组:\\n", reshaped2)

# 展平
flattened = reshaped.flatten()
print("\\n展平:", flattened)`,explanation:"reshape() 要求新形状的元素总数与原数组相同。"}]},{id:"math-operations",title:"数学运算",description:"NumPy 支持元素级运算、广播机制和丰富的数学函数。",concepts:[{name:"元素级运算",explanation:"算术运算符（+, -, *, /）默认进行元素级运算，不是矩阵运算。",math:"(\\mathbf{A} + \\mathbf{B})_{ij} = A_{ij} + B_{ij}"},{name:"广播机制",explanation:"当两个数组形状不同时，NumPy 会自动扩展较小的数组以匹配较大数组的形状。",math:"\\mathbf{A}_{m \\times n} + \\mathbf{b}_{1 \\times n} = \\mathbf{C}_{m \\times n}"},{name:"线性代数",explanation:"NumPy 提供矩阵乘法（@或dot）、转置、行列式、特征值等线性代数运算。",math:"\\mathbf{C} = \\mathbf{A} \\mathbf{B}, \\quad C_{ij} = \\sum_{k} A_{ik} B_{kj}"}],examples:[{title:"基本运算",code:`import numpy as np

a = np.array([1, 2, 3, 4])
b = np.array([5, 6, 7, 8])

print("a + b =", a + b)
print("a - b =", a - b)
print("a * b =", a * b)
print("a / b =", a / b)
print("a ** 2 =", a ** 2)`,explanation:"所有运算都是元素对元素进行的。"},{title:"广播示例",code:`import numpy as np

# 矩阵加标量
arr = np.array([[1, 2, 3], [4, 5, 6]])
print("原数组:\\n", arr)
print("\\n加 10:\\n", arr + 10)

# 矩阵加向量
vec = np.array([1, 2, 3])
print("\\n加向量 [1,2,3]:\\n", arr + vec)`,explanation:"标量和向量会自动广播到矩阵的每一行。"},{title:"统计函数",code:`import numpy as np

arr = np.array([[1, 2, 3], [4, 5, 6]])
print("数组:\\n", arr)

print("\\n总和:", np.sum(arr))
print("均值:", np.mean(arr))
print("标准差:", np.std(arr))
print("最大值:", np.max(arr))
print("最小值:", np.min(arr))

# 按轴计算
print("\\n每列的和:", np.sum(arr, axis=0))
print("每行的和:", np.sum(arr, axis=1))`,explanation:"axis=0 表示沿列方向（跨行），axis=1 表示沿行方向（跨列）。"},{title:"线性代数运算",code:`import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print("矩阵 A:\\n", A)
print("\\n矩阵 B:\\n", B)

# 矩阵乘法
print("\\nA @ B =\\n", A @ B)

# 转置
print("\\nA 的转置:\\n", A.T)

# 行列式
print("\\nA 的行列式:", np.linalg.det(A))

# 逆矩阵
print("\\nA 的逆矩阵:\\n", np.linalg.inv(A))`,explanation:"使用 @ 运算符或 np.dot() 进行矩阵乘法，linalg 模块提供线性代数函数。"}]},{id:"random",title:"随机数生成",description:"NumPy 提供了强大的随机数生成功能，用于模拟和统计分析。",concepts:[{name:"随机数生成器",explanation:"np.random 模块提供各种分布的随机数生成函数。",math:"X \\sim \\mathcal{N}(\\mu, \\sigma^2)"},{name:"随机种子",explanation:"设置随机种子可以使随机数生成可重复，便于调试和验证。",math:"\\text{seed}(s) \\Rightarrow \\text{reproducible sequence}"}],examples:[{title:"基本随机数",code:`import numpy as np

# 设置随机种子
np.random.seed(42)

# 0-1 均匀分布
uniform = np.random.random(5)
print("均匀分布:", uniform)

# 指定范围的随机整数
integers = np.random.randint(0, 10, size=5)
print("随机整数:", integers)

# 标准正态分布
normal = np.random.randn(5)
print("正态分布:", normal)`,explanation:"random() 生成 [0,1) 的均匀分布，randn() 生成标准正态分布。"},{title:"多维随机数组",code:`import numpy as np

np.random.seed(42)

# 2x3 的随机数组
arr = np.random.random((2, 3))
print("随机数组:\\n", arr)

# 正态分布数组
normal_arr = np.random.normal(loc=0, scale=1, size=(3, 3))
print("\\n正态分布数组:\\n", normal_arr)`,explanation:"size 参数指定生成数组的形状。"},{title:"随机选择和打乱",code:`import numpy as np

np.random.seed(42)

arr = np.arange(10)
print("原数组:", arr)

# 随机选择
choice = np.random.choice(arr, size=5, replace=False)
print("\\n随机选择 5 个:", choice)

# 打乱数组
np.random.shuffle(arr)
print("打乱后:", arr)`,explanation:"choice() 可以随机选择元素，shuffle() 原地打乱数组。"}]}]},Ee={id:"matplotlib",title:"Matplotlib",description:"Matplotlib 是 Python 最流行的绘图库，可以创建高质量的静态、动态和交互式可视化。",icon:"📊",sections:[{id:"basic-plotting",title:"基础绘图",description:"Matplotlib 的核心是 pyplot 接口，提供类似 MATLAB 的绘图方式。",concepts:[{name:"线图",explanation:"plot() 函数是最基本的绘图函数，用于绘制线图和散点图。",math:"y = f(x), \\quad x \\in [a, b]"},{name:"图形元素",explanation:"一个完整的图形包括：标题、坐标轴标签、图例、网格等元素。",math:"\\text{Figure} \\supset \\text{Axes} \\supset \\text{Plot}"}],examples:[{title:"简单线图",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y)
plt.title('正弦函数')
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
plt.title('三角函数')
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
plt.colorbar(label='颜色值')
plt.title('散点图示例')
plt.xlabel('X 轴')
plt.ylabel('Y 轴')
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
axes[1, 1].set_title('衰减振荡')
axes[1, 1].grid(True, alpha=0.3)

plt.tight_layout()
plt.show()

print("子图已生成")`,explanation:"subplots() 创建多个子图，tight_layout() 自动调整间距。"}]},{id:"advanced-plots",title:"高级可视化",description:"Matplotlib 支持多种图表类型，适用于不同的数据展示需求。",concepts:[{name:"柱状图",explanation:"bar() 用于绘制柱状图，适合展示分类数据的比较。",math:"\\text{categories} \\times \\text{values}"},{name:"直方图",explanation:"hist() 用于显示数据分布，将连续数据分组到区间（bins）中。",math:"h_i = \\sum_{x_j \\in [b_i, b_{i+1})} 1"}],examples:[{title:"柱状图",code:`import numpy as np
import matplotlib.pyplot as plt

categories = ['A', 'B', 'C', 'D', 'E']
values = [23, 45, 56, 78, 32]

plt.figure(figsize=(8, 5))
bars = plt.bar(categories, values, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'])
plt.title('柱状图示例', fontsize=14, fontweight='bold')
plt.xlabel('类别')
plt.ylabel('数值')
plt.grid(axis='y', alpha=0.3)

# 在柱子上显示数值
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
plt.title('正态分布直方图')
plt.xlabel('数值')
plt.ylabel('频数')
plt.grid(axis='y', alpha=0.3)
plt.axvline(data.mean(), color='red', linestyle='--', linewidth=2, label=f'均值: {data.mean():.2f}')
plt.legend()
plt.show()

print(f"数据均值: {data.mean():.2f}")
print(f"数据标准差: {data.std():.2f}")`,explanation:"hist() 自动将数据分组，bins 参数控制组数。"},{title:"饼图",code:`import matplotlib.pyplot as plt

labels = ['Python', 'JavaScript', 'Java', 'C++', 'Others']
sizes = [35, 25, 20, 12, 8]
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8']
explode = (0.1, 0, 0, 0, 0)  # 突出第一块

plt.figure(figsize=(8, 6))
plt.pie(sizes, explode=explode, labels=labels, colors=colors,
        autopct='%1.1f%%', shadow=True, startangle=90)
plt.title('编程语言使用占比')
plt.axis('equal')
plt.show()

print("饼图已生成")`,explanation:"pie() 创建饼图，autopct 显示百分比，explode 可以突出某些扇区。"},{title:"箱线图",code:`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
data = [np.random.normal(0, std, 100) for std in range(1, 5)]

plt.figure(figsize=(8, 5))
bp = plt.boxplot(data, labels=['A', 'B', 'C', 'D'], patch_artist=True)

# 自定义颜色
colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
for patch, color in zip(bp['boxes'], colors):
    patch.set_facecolor(color)
    patch.set_alpha(0.7)

plt.title('箱线图示例')
plt.xlabel('组别')
plt.ylabel('数值')
plt.grid(axis='y', alpha=0.3)
plt.show()

print("箱线图已生成")`,explanation:"箱线图显示数据的分布特征：中位数、四分位数、异常值等。"}]},{id:"customization",title:"样式定制",description:"通过样式、颜色、标记等定制图形外观。",concepts:[{name:"线条样式",explanation:"可以设置线条的颜色、宽度、样式（实线、虚线等）和标记。",math:"\\text{style} = \\text{color} + \\text{marker} + \\text{linestyle}"},{name:"颜色映射",explanation:"colormap 将数值映射到颜色，常用于热图和等高线图。",math:"c: \\mathbb{R} \\to \\text{RGB}"}],examples:[{title:"线条样式",code:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 10, 100)

plt.figure(figsize=(10, 6))
plt.plot(x, np.sin(x), 'r-', linewidth=2, label='实线')
plt.plot(x, np.sin(x-0.5), 'b--', linewidth=2, label='虚线')
plt.plot(x, np.sin(x-1), 'g-.', linewidth=2, label='点划线')
plt.plot(x, np.sin(x-1.5), 'm:', linewidth=2, label='点线')
plt.plot(x, np.sin(x-2), 'ko-', markersize=4, label='带标记')

plt.title('不同线条样式', fontsize=14)
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
plt.colorbar(im, label='数值')
plt.title('热图示例')
plt.xlabel('X 轴')
plt.ylabel('Y 轴')

# 添加数值标注
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

# 填充等高线
plt.subplot(1, 2, 1)
plt.contourf(X, Y, Z, levels=20, cmap='viridis')
plt.colorbar(label='Z 值')
plt.title('填充等高线图')
plt.xlabel('X')
plt.ylabel('Y')

# 线条等高线
plt.subplot(1, 2, 2)
CS = plt.contour(X, Y, Z, levels=10, colors='black')
plt.clabel(CS, inline=True, fontsize=8)
plt.title('线条等高线图')
plt.xlabel('X')
plt.ylabel('Y')

plt.tight_layout()
plt.show()

print("等高线图已生成")`,explanation:"contour() 绘制等高线，contourf() 填充等高线之间的区域。"}]}]},Ae={id:"sympy",title:"SymPy",description:"SymPy 是 Python 的符号数学库，可以进行符号计算、代数运算、微积分等。",icon:"∑",sections:[{id:"symbolic-basics",title:"符号计算基础",description:"SymPy 允许定义符号变量并进行精确的符号运算。",concepts:[{name:"符号定义",explanation:"使用 symbols() 定义符号变量，这些变量代表数学符号而非具体数值。",math:"x, y, z \\in \\text{Symbols}"},{name:"表达式操作",explanation:"SymPy 可以对表达式进行化简、展开、因式分解等操作。",math:"f(x) = \\sum_{i=0}^{n} a_i x^i"}],examples:[{title:"定义符号和表达式",code:`import sympy as sp

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
    print(f"特征向量: {eigenvect}")`,explanation:"eigenvals() 返回特征值，eigenvects() 返回特征值和对应的特征向量。"}]}]},Se={id:"scipy",title:"SciPy",description:"SciPy 是基于 NumPy 的科学计算库，提供优化、积分、插值、信号处理等高级功能。",icon:"🔬",sections:[{id:"optimization",title:"优化",description:"SciPy 提供多种优化算法，用于求解函数的最小值、最大值和根。",concepts:[{name:"函数最小化",explanation:"minimize() 函数使用各种算法寻找函数的局部或全局最小值。",math:"\\min_{x} f(x)"},{name:"曲线拟合",explanation:"curve_fit() 用于将数据拟合到指定的函数模型。",math:"\\min \\sum_i [y_i - f(x_i, \\mathbf{p})]^2"}],examples:[{title:"函数最小化",code:`import numpy as np
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
plt.plot(result.x, result.fun, 'ro', markersize=10, label=f'最小值点 ({result.x[0]:.2f}, {result.fun:.2f})')
plt.xlabel('x')
plt.ylabel('f(x)')
plt.title('函数优化')
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
plt.scatter(x_data, y_data, alpha=0.6, label='原始数据')
plt.plot(x_fit, y_fit, 'r-', linewidth=2, label=f'拟合曲线: {a:.2f}sin({b:.2f}x) + {c:.2f}')
plt.xlabel('x')
plt.ylabel('y')
plt.title('曲线拟合')
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
plt.plot(sol.t, sol.y[0], 'b-', linewidth=2, label='数值解')
plt.plot(sol.t, np.exp(-2*sol.t), 'r--', linewidth=2, label='解析解: e^(-2t)')
plt.xlabel('t')
plt.ylabel('y')
plt.title('微分方程: dy/dt = -2y, y(0) = 1')
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
plt.plot(x, y, 'o', markersize=8, label='原始数据')
plt.plot(x_new, y_linear, '-', label='线性插值')
plt.plot(x_new, y_cubic, '-', label='三次插值')
plt.xlabel('x')
plt.ylabel('y')
plt.title('一维插值')
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
plt.plot(x, y, 'o', markersize=8, label='数据点')
plt.plot(x_new, y_new, '-', linewidth=2, label='B样条插值')
plt.xlabel('x')
plt.ylabel('y')
plt.title('B样条插值')
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
plt.title('原始数据 (5x5)')
plt.subplot(1, 2, 2)
plt.contourf(x_new, y_new, Z_new, levels=15, cmap='viridis')
plt.colorbar()
plt.title('插值后 (50x50)')
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
plt.title('原始信号（含噪声）')
plt.ylabel('幅度')
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(t[:200], filtered[:200])
plt.title('滤波后信号')
plt.xlabel('时间 (s)')
plt.ylabel('幅度')
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
plt.title('时域信号')
plt.xlabel('时间 (s)')
plt.ylabel('幅度')
plt.grid(True, alpha=0.3)

plt.subplot(2, 1, 2)
plt.plot(xf, 2.0/N * np.abs(yf[:N//2]))
plt.title('频域（FFT）')
plt.xlabel('频率 (Hz)')
plt.ylabel('幅度')
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
plt.plot(sig, 'o-', label='原始信号', linewidth=2, markersize=8)
plt.plot(conv_result, 's-', label='卷积结果（平滑）', linewidth=2, markersize=8)
plt.title('信号卷积（移动平均）')
plt.xlabel('样本')
plt.ylabel('值')
plt.legend()
plt.grid(True, alpha=0.3)
plt.show()

print("卷积完成")`,explanation:"convolve() 计算两个信号的卷积，mode 参数控制输出大小。"}]}]},Ne={id:"pandas",title:"Pandas",description:"Pandas 是 Python 数据分析的核心库，提供高效的数据结构和数据分析工具。",icon:"🐼",sections:[{id:"data-structures",title:"数据结构",description:"Pandas 的两个核心数据结构是 Series（一维）和 DataFrame（二维）。",concepts:[{name:"Series",explanation:"Series 是带标签的一维数组，类似于字典或带索引的列表。",math:"S = \\{(i_k, v_k)\\}_{k=1}^{n}"},{name:"DataFrame",explanation:"DataFrame 是二维表格数据结构，有行索引和列索引。",math:"D \\in \\mathbb{R}^{m \\times n}, \\text{ with row and column labels}"}],examples:[{title:"Series 基础",code:`import pandas as pd
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

print("分布图已生成")`,explanation:'kind="box" 绘制箱线图，kind="scatter" 绘制散点图。'}]}]},Fe={class:"max-w-[1800px] mx-auto animate-fade-in px-4 sm:px-6 pt-4 pb-20 relative"},Pe={class:"bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-slate-700 overflow-hidden mt-8"},De={class:"p-8 sm:p-12 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-900/10"},Ie={class:"text-3xl sm:text-4xl font-black text-slate-800 dark:text-white mb-2"},Te={class:"mt-3 text-slate-500 font-medium text-lg"},Oe={class:"mt-4 flex items-center gap-3"},ze={class:"text-sm font-medium text-slate-600 dark:text-slate-300"},Re={class:"flex border-b border-slate-100 dark:border-slate-700 overflow-x-auto"},Be=["onClick"],Ce={class:"text-xl mr-2"},Le={key:0,class:"absolute bottom-0 left-0 right-0 h-1 bg-blue-500"},qe={class:"grid grid-cols-1 lg:grid-cols-3 gap-6 p-6"},$e={class:"lg:col-span-1 space-y-4 max-h-[800px] overflow-y-auto"},Me={class:"text-xl font-black text-slate-700 dark:text-slate-200 sticky top-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur py-2 z-10"},Ue={class:"space-y-2"},je=["onClick"],We={key:0,class:"p-4 bg-white dark:bg-slate-800 space-y-4"},Ve={class:"text-sm text-slate-600 dark:text-slate-400"},He={key:0,class:"space-y-3"},Ge={class:"font-bold text-sm text-slate-700 dark:text-slate-200"},Xe={class:"text-xs text-slate-600 dark:text-slate-400"},Ye={key:0,class:"bg-slate-50 dark:bg-slate-900 p-3 rounded-xl overflow-x-auto"},Ze=["innerHTML"],Ke={key:1,class:"space-y-2"},Je=["onClick"],Qe={class:"flex items-center justify-between"},ta={class:"font-bold text-sm text-slate-700 dark:text-slate-200"},ea={class:"text-xs text-blue-600 dark:text-blue-400 font-bold"},aa={class:"text-xs text-slate-500 mt-1"},na={class:"lg:col-span-2 space-y-4"},ia={class:"space-y-3"},ra={class:"flex items-center justify-between"},la={class:"flex gap-2"},oa=["disabled"],pa={key:0,class:"animate-spin h-4 w-4",fill:"none",viewBox:"0 0 24 24"},sa={class:"space-y-3"},da={class:"flex items-center justify-between"},ca={class:"text-xl font-black text-slate-700 dark:text-slate-200"},ua={key:0,class:"bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6"},ma={class:"font-bold text-red-700 dark:text-red-400 mb-2"},fa={class:"text-xs text-red-600 dark:text-red-300 font-mono whitespace-pre-wrap"},xa={key:1,class:"bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 min-h-[150px]"},ya={class:"text-sm text-green-400 font-mono whitespace-pre-wrap"},ba={key:2,class:"space-y-4"},ha={class:"text-sm font-black uppercase text-slate-500"},ga={class:"grid grid-cols-1 gap-4"},_a=["src","alt"],va={key:3,class:"bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center"},wa={class:"text-slate-400 font-medium"},ka={__name:"index",setup(t){const{t:e}=ie(),a=A("numpy"),r=A(null),n=A(null),i=A("not-loaded"),l=A(""),s=A(!1),d=A(""),c=A([]),u=A(""),h=A(null),g=A(null),E=A(!1),P={numpy:ke,matplotlib:Ee,sympy:Ae,scipy:Se,pandas:Ne},H=ot(()=>P[a.value]),K=ot(()=>{var m;return((m=H.value)==null?void 0:m.sections)||[]}),J={numpy:`import numpy as np

# 创建数组
arr = np.array([1, 2, 3, 4, 5])
print("数组:", arr)
print("平均值:", np.mean(arr))
print("标准差:", np.std(arr))`,matplotlib:`import numpy as np
import matplotlib.pyplot as plt

x = np.linspace(0, 2*np.pi, 100)
y = np.sin(x)

plt.figure(figsize=(8, 4))
plt.plot(x, y, linewidth=2)
plt.title('正弦函数')
plt.xlabel('x')
plt.ylabel('sin(x)')
plt.grid(True, alpha=0.3)
plt.show()`,sympy:`import sympy as sp

x = sp.Symbol('x')
expr = x**2 + 2*x + 1

print("表达式:", expr)
print("因式分解:", sp.factor(expr))
print("求导:", sp.diff(expr, x))`,scipy:`import numpy as np
from scipy import optimize

def f(x):
    return x**2 + 10*np.sin(x)

result = optimize.minimize(f, x0=0)
print("最小值点:", result.x[0])
print("最小值:", result.fun)`,pandas:`import pandas as pd

data = {
    '姓名': ['张三', '李四', '王五'],
    '年龄': [25, 30, 35],
    '城市': ['北京', '上海', '广州']
}
df = pd.DataFrame(data)
print(df)
print("\\n平均年龄:", df['年龄'].mean())`},Yt=()=>{r.value&&(n.value=de.create(r.value,{value:J[a.value],language:"python",theme:"vs-dark",fontSize:14,minimap:{enabled:!1},scrollBeyondLastLine:!1,automaticLayout:!0,tabSize:4,wordWrap:"on"}))},Zt=async()=>{try{i.value="loading",await Xt(m=>{l.value=m}),i.value="ready",l.value=""}catch(m){i.value="error",u.value=`加载 Python 失败: ${m.message}`,l.value=""}},Kt=async()=>{if(!(!n.value||i.value!=="ready")){s.value=!0,d.value="",c.value=[],u.value="";try{const m=n.value.getValue(),w=await we(m);w.error?u.value=w.error:(d.value=w.output||"Code executed successfully (no output)",c.value=w.plots||[])}catch(m){u.value=m.message}finally{s.value=!1}}},G=()=>{d.value="",c.value=[],u.value=""},Jt=()=>{n.value&&n.value.setValue(J[a.value]),G()},Qt=async()=>{if(n.value)try{await navigator.clipboard.writeText(n.value.getValue()),E.value=!0,setTimeout(()=>E.value=!1,2e3)}catch(m){console.error("Failed to copy:",m)}},te=m=>{n.value&&m.code&&(n.value.setValue(m.code),g.value=m,G())},ee=m=>{h.value=m,g.value=null};re(a,m=>{n.value&&n.value.setValue(J[m]),h.value=null,g.value=null,G()}),le(()=>{Yt(),Zt(),K.value.length>0&&(h.value=K.value[0])}),oe(()=>{n.value&&n.value.dispose()});const ae=m=>m&&!m.includes("$")&&(m.includes("\\")||m.includes("="))?ct(`$$${m}$$`):ct(m);return(m,w)=>(y(),x("div",Fe,[pe(se),p("div",Pe,[p("div",De,[p("h2",Ie,f(v(e)("tools.python-playground.title")),1),p("p",Te,f(v(e)("tools.python-playground.desc")),1),p("div",Oe,[p("div",{class:q(["w-3 h-3 rounded-full",i.value==="ready"?"bg-green-500 animate-pulse":i.value==="loading"?"bg-yellow-500 animate-pulse":i.value==="error"?"bg-red-500":"bg-gray-400"])},null,2),p("span",ze,f(v(e)(`tools.python-playground.status.${i.value}`)),1)])]),p("div",Re,[(y(),x($,null,M(["numpy","matplotlib","sympy","scipy","pandas"],b=>p("button",{key:b,onClick:R=>a.value=b,class:q(["flex-1 min-w-[120px] py-4 px-6 font-bold text-sm uppercase tracking-widest transition-all relative whitespace-nowrap",a.value===b?"text-blue-600 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-900/10":"text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"])},[p("span",Ce,f(H.value.icon),1),pt(" "+f(v(e)(`tools.python-playground.tabs.${b}`))+" ",1),a.value===b?(y(),x("div",Le)):N("",!0)],10,Be)),64))]),p("div",qe,[p("div",$e,[p("h3",Me,f(v(e)("tools.python-playground.knowledge.title")),1),p("div",Ue,[(y(!0),x($,null,M(K.value,b=>{var R,lt;return y(),x("div",{key:b.id,class:"border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"},[p("button",{onClick:S=>ee(b),class:q(["w-full p-4 text-left font-bold transition-all",((R=h.value)==null?void 0:R.id)===b.id?"bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300":"bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"])},f(b.title),11,je),((lt=h.value)==null?void 0:lt.id)===b.id?(y(),x("div",We,[p("p",Ve,f(b.description),1),b.concepts?(y(),x("div",He,[w[0]||(w[0]=p("h4",{class:"text-xs font-black uppercase text-slate-500"},"核心概念",-1)),(y(!0),x($,null,M(b.concepts,S=>(y(),x("div",{key:S.name,class:"space-y-2"},[p("p",Ge,f(S.name),1),p("p",Xe,f(S.explanation),1),S.math?(y(),x("div",Ye,[p("div",{innerHTML:ae(S.math),class:"text-center"},null,8,Ze)])):N("",!0)]))),128))])):N("",!0),b.examples?(y(),x("div",Ke,[w[1]||(w[1]=p("h4",{class:"text-xs font-black uppercase text-slate-500"},"示例代码",-1)),(y(!0),x($,null,M(b.examples,S=>(y(),x("div",{key:S.title,class:"border border-slate-200 dark:border-slate-700 rounded-xl p-3 hover:border-blue-400 dark:hover:border-blue-600 transition-all cursor-pointer",onClick:Ea=>te(S)},[p("div",Qe,[p("p",ta,f(S.title),1),p("button",ea,f(v(e)("tools.python-playground.buttons.load_example")),1)]),p("p",aa,f(S.explanation),1)],8,Je))),128))])):N("",!0)])):N("",!0)])}),128))])]),p("div",na,[p("div",ia,[p("div",ra,[w[3]||(w[3]=p("h3",{class:"text-xl font-black text-slate-700 dark:text-slate-200"},"代码编辑器",-1)),p("div",la,[p("button",{onClick:Qt,class:q(["px-4 py-2 rounded-xl font-bold text-xs transition-all",E.value?"bg-green-500 text-white":"bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"])},f(E.value?v(e)("tools.python-playground.buttons.copied"):v(e)("tools.python-playground.buttons.copy")),3),p("button",{onClick:Jt,class:"px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"},f(v(e)("tools.python-playground.buttons.clear")),1),p("button",{onClick:Kt,disabled:i.value!=="ready"||s.value,class:q(["px-6 py-2 rounded-xl font-bold text-xs transition-all flex items-center gap-2",i.value==="ready"&&!s.value?"bg-blue-600 hover:bg-blue-700 text-white":"bg-slate-300 dark:bg-slate-600 text-slate-500 cursor-not-allowed"])},[s.value?(y(),x("svg",pa,[...w[2]||(w[2]=[p("circle",{class:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor","stroke-width":"4"},null,-1),p("path",{class:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"},null,-1)])])):N("",!0),pt(" "+f(s.value?v(e)("tools.python-playground.status.running"):v(e)("tools.python-playground.buttons.run")),1)],10,oa)])]),p("div",{ref_key:"editorContainer",ref:r,class:"h-[400px] border-2 border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"},null,512)]),p("div",sa,[p("div",da,[p("h3",ca,f(v(e)("tools.python-playground.output.console")),1),d.value||c.value.length>0||u.value?(y(),x("button",{key:0,onClick:G,class:"text-xs text-red-500 hover:text-red-600 font-bold"}," 清空输出 ")):N("",!0)]),u.value?(y(),x("div",ua,[p("h4",ma,f(v(e)("tools.python-playground.output.error_title")),1),p("pre",fa,f(u.value),1)])):N("",!0),d.value?(y(),x("div",xa,[p("pre",ya,f(d.value),1)])):N("",!0),c.value.length>0?(y(),x("div",ba,[p("h4",ha,f(v(e)("tools.python-playground.output.plots")),1),p("div",ga,[(y(!0),x($,null,M(c.value,(b,R)=>(y(),x("div",{key:R,class:"bg-slate-900 border-2 border-slate-700 rounded-2xl p-4 flex items-center justify-center"},[p("img",{src:`data:image/png;base64,${b}`,class:"max-w-full rounded-lg",alt:`Plot ${R+1}`},null,8,_a)]))),128))])])):N("",!0),!d.value&&c.value.length===0&&!u.value?(y(),x("div",va,[p("p",wa,f(v(e)("tools.python-playground.output.no_output")),1)])):N("",!0)])])])])]))}},Fa=ne(ka,[["__scopeId","data-v-794fd73a"]]);export{Fa as default};
