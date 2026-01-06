<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import mermaid from 'mermaid'
import MonacoEditor from './MonacoEditor.vue'

const props = defineProps({
  debounceMs: { type: Number, default: 300 }
})

// Default markdown content
const markdownCode = ref(`# Markdown Preview

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
`)

const previewRef = ref(null)
const renderedHtml = ref('')

// Configure marked with custom highlight logic
marked.use({
  extensions: [{
    name: 'code',
    renderer(token) {
      if (token.lang === 'mermaid') {
        return `<div class="mermaid">${token.text}</div>`
      }
      if (token.lang && hljs.getLanguage(token.lang)) {
        try {
          const highlighted = hljs.highlight(token.text, { language: token.lang }).value
          return `<pre><code class="hljs language-${token.lang}">${highlighted}</code></pre>`
        } catch (e) {}
      }
      const autoHighlighted = hljs.highlightAuto(token.text).value
      return `<pre><code class="hljs">${autoHighlighted}</code></pre>`
    }
  }],
  breaks: true,
  gfm: true
})

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose'
})

// Render markdown
const renderMarkdown = async () => {
  try {
    renderedHtml.value = await marked.parse(markdownCode.value)
    
    // Render mermaid diagrams after DOM update
    await nextTick()
    if (previewRef.value) {
      const mermaidElements = previewRef.value.querySelectorAll('.mermaid')
      if (mermaidElements.length > 0) {
        // Clear previous attributes that mermaid might have added if re-rendering
        mermaidElements.forEach(el => {
          el.removeAttribute('data-processed')
        })
        await mermaid.run({ nodes: mermaidElements })
      }
    }
  } catch (e) {
    console.error('Markdown render error:', e)
  }
}

// Debounced render
let debounceTimer = null
watch(markdownCode, () => {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(renderMarkdown, props.debounceMs)
})

onMounted(() => {
  renderMarkdown()
})
</script>

<template>
  <div class="flex flex-col md:flex-row h-full">
    <!-- Editor -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full border-b md:border-b-0 md:border-r border-slate-700">
      <MonacoEditor
        v-model="markdownCode"
        language="markdown"
        height="100%"
        :minimap="false"
        word-wrap="on"
      />
    </div>

    <!-- Preview -->
    <div class="w-full md:w-1/2 h-1/2 md:h-full overflow-y-auto bg-slate-900">
      <div 
        ref="previewRef"
        class="markdown-preview p-6 prose prose-invert prose-violet max-w-none"
        v-html="renderedHtml"
      ></div>
    </div>
  </div>
</template>

<style>
/* Markdown preview styles */
.markdown-preview {
  color: #e2e8f0;
  line-height: 1.7;
}

.markdown-preview h1,
.markdown-preview h2,
.markdown-preview h3,
.markdown-preview h4 {
  color: #f1f5f9;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 700;
}

.markdown-preview h1 { font-size: 2em; border-bottom: 1px solid #334155; padding-bottom: 0.3em; }
.markdown-preview h2 { font-size: 1.5em; border-bottom: 1px solid #334155; padding-bottom: 0.3em; }
.markdown-preview h3 { font-size: 1.25em; }

.markdown-preview p { margin: 1em 0; }

.markdown-preview a { color: #818cf8; text-decoration: none; }
.markdown-preview a:hover { text-decoration: underline; }

.markdown-preview code {
  background: #1e293b;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 0.9em;
}

.markdown-preview pre {
  background: #1e293b;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 1em 0;
}

.markdown-preview pre code {
  background: transparent;
  padding: 0;
}

.markdown-preview ul,
.markdown-preview ol {
  padding-left: 1.5em;
  margin: 1em 0;
}

.markdown-preview li { margin: 0.25em 0; }

.markdown-preview blockquote {
  border-left: 4px solid #6366f1;
  padding-left: 1rem;
  margin: 1em 0;
  color: #94a3b8;
}

.markdown-preview table {
  width: 100%;
  border-collapse: collapse;
  margin: 1em 0;
}

.markdown-preview th,
.markdown-preview td {
  border: 1px solid #334155;
  padding: 0.5rem;
  text-align: left;
}

.markdown-preview th {
  background: #1e293b;
}

.markdown-preview hr {
  border: none;
  border-top: 1px solid #334155;
  margin: 2em 0;
}

.markdown-preview .mermaid {
  background: #1e293b;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1em 0;
  text-align: center;
}

/* Highlight.js theme adjustments */
.markdown-preview .hljs-keyword { color: #c678dd; }
.markdown-preview .hljs-string { color: #98c379; }
.markdown-preview .hljs-number { color: #d19a66; }
.markdown-preview .hljs-function { color: #61afef; }
.markdown-preview .hljs-comment { color: #5c6370; }
.markdown-preview .hljs-variable { color: #e06c75; }
.markdown-preview .hljs-attr { color: #d19a66; }
</style>
