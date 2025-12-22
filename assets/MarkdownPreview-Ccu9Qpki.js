import{am as u,an as s,ao as m}from"./markdown-C78r6xLZ.js";import h from"./MonacoEditor-ry6ak2zq.js";import{r as n,y as v,o as f,c as w,j as y,d as l,b,C as x}from"./index-C2oZR3VO.js";import"./monaco-editor-CIrctJzJ.js";const k={class:"flex h-full"},S={class:"w-1/2 border-r border-slate-700"},M={class:"w-1/2 overflow-y-auto bg-slate-900"},T=["innerHTML"],A={__name:"MarkdownPreview",props:{debounceMs:{type:Number,default:300}},setup(p){const g=p,r=n(`# Markdown Preview

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
`),o=n(null),d=n("");u.use({extensions:[{name:"code",renderer(e){if(e.lang==="mermaid")return`<div class="mermaid">${e.text}</div>`;if(e.lang&&s.getLanguage(e.lang))try{const t=s.highlight(e.text,{language:e.lang}).value;return`<pre><code class="hljs language-${e.lang}">${t}</code></pre>`}catch{}return`<pre><code class="hljs">${s.highlightAuto(e.text).value}</code></pre>`}}],breaks:!0,gfm:!0}),m.initialize({startOnLoad:!1,theme:"dark",securityLevel:"loose"});const c=async()=>{try{if(d.value=await u.parse(r.value),await x(),o.value){const e=o.value.querySelectorAll(".mermaid");e.length>0&&(e.forEach(a=>{a.removeAttribute("data-processed")}),await m.run({nodes:e}))}}catch(e){console.error("Markdown render error:",e)}};let i=null;return v(r,()=>{i&&clearTimeout(i),i=setTimeout(c,g.debounceMs)}),f(()=>{c()}),(e,a)=>(y(),w("div",k,[l("div",S,[b(h,{modelValue:r.value,"onUpdate:modelValue":a[0]||(a[0]=t=>r.value=t),language:"markdown",theme:"vs-dark",height:"100%",minimap:!1,"word-wrap":"on"},null,8,["modelValue"])]),l("div",M,[l("div",{ref_key:"previewRef",ref:o,class:"markdown-preview p-6 prose prose-invert prose-violet max-w-none",innerHTML:d.value},null,8,T)])]))}};export{A as default};
