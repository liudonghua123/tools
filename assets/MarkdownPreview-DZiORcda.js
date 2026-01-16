import{am as c,an as l,ao as m}from"./markdown-B4_BPOko.js";import g from"./MonacoEditor-D1-m5bfC.js";import{r as n,m as f,o as v,c as w,j as b,d as s,b as x,D as y}from"./index-hw7nIlup.js";import"./monaco-editor-DrHUTMTD.js";const S={class:"flex flex-col md:flex-row h-full"},k={class:"w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-slate-700"},M={class:"w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto bg-slate-900"},T=["innerHTML"],A={__name:"MarkdownPreview",props:{debounceMs:{type:Number,default:300}},setup(p){const h=p,a=n(`# Markdown Preview

Welcome to the **Markdown** editor! This editor supports various GFM (GitHub Flavored Markdown) features.

## 1. Basic Formatting

- **Bold text** and *italic text*
- ~~Strikethrough text~~
- Inline \`code blocks\`
- [External Link](https://github.com/pyodide/pyodide)

## 2. Advanced Typography

> This is a blockquote. It's useful for highlighting important information or quotes.
>
> --- *Quotable Source*

### Task Lists (TODOs)

- [x] Integrate Monaco Editor
- [x] Implement Live Preview
- [/] Add more examples
- [ ] Support local file export

## 3. Structured Data

### Data Table

| ID | Application | Category | Status |
|:---|:------------|:---------|:-------|
| 01 | Playground  | Dev Tool | Active |
| 02 | Encoder     | Utils    | Beta   |
| 03 | Analyzer    | Core     | Stable |

### Code Blocks

\`\`\`typescript
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

const greet = (u: User): string => {
  return \`Hello, \${u.name}!\`;
};
\`\`\`

## 4. Visual Diagrams (Mermaid)

### Flowchart

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Is Pyodide Ready?}
    B -->|Yes| C[Execute Python]
    B -->|No| D[Show Loading]
    D --> B
    C --> E[Done]
\`\`\`

### Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Editor
    participant Sandbox
    User->>Editor: Type Code
    Editor->>User: Sync Highlight
    User->>Sandbox: Click Run
    Sandbox-->>User: Show result in IFrame
\`\`\`

---

*Enjoy editing!*
`),o=n(null),d=n("");c.use({extensions:[{name:"code",renderer(e){if(e.lang==="mermaid")return`<div class="mermaid">${e.text}</div>`;if(e.lang&&l.getLanguage(e.lang))try{const t=l.highlight(e.text,{language:e.lang}).value;return`<pre><code class="hljs language-${e.lang}">${t}</code></pre>`}catch{}return`<pre><code class="hljs">${l.highlightAuto(e.text).value}</code></pre>`}}],breaks:!0,gfm:!0}),m.initialize({startOnLoad:!1,theme:"dark",securityLevel:"loose"});const u=async()=>{try{if(d.value=await c.parse(a.value),await y(),o.value){const e=o.value.querySelectorAll(".mermaid");e.length>0&&(e.forEach(r=>{r.removeAttribute("data-processed")}),await m.run({nodes:e}))}}catch(e){console.error("Markdown render error:",e)}};let i=null;return f(a,()=>{i&&clearTimeout(i),i=setTimeout(u,h.debounceMs)}),v(()=>{u()}),(e,r)=>(b(),w("div",S,[s("div",k,[x(g,{modelValue:a.value,"onUpdate:modelValue":r[0]||(r[0]=t=>a.value=t),language:"markdown",height:"100%",minimap:!1,"word-wrap":"on"},null,8,["modelValue"])]),s("div",M,[s("div",{ref_key:"previewRef",ref:o,class:"markdown-preview p-6 prose prose-invert prose-violet max-w-none",innerHTML:d.value},null,8,T)])]))}};export{A as default};
