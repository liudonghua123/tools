// Math rendering utilities using KaTeX

import katex from 'katex'

/**
 * Render LaTeX math expression to HTML
 * @param {string} latex - LaTeX expression
 * @param {boolean} displayMode - Block mode (true) or inline mode (false)
 * @returns {string} Rendered HTML
 */
export function renderMath(latex, displayMode = false) {
    try {
        return katex.renderToString(latex, {
            displayMode,
            throwOnError: false,
            trust: true,
            strict: false
        })
    } catch (error) {
        console.error('KaTeX rendering error:', error)
        return `<span class="katex-error">${latex}</span>`
    }
}

/**
 * Render text with inline and block math
 * Supports $...$ for inline math and $$...$$ for block math
 * @param {string} text - Text with LaTeX expressions
 * @returns {string} HTML with rendered math
 */
export function renderTextWithMath(text) {
    if (!text) return ''

    // First, handle block math ($$...$$)
    let result = text.replace(/\$\$([\s\S]+?)\$\$/g, (match, latex) => {
        return `<div class="math-block">${renderMath(latex.trim(), true)}</div>`
    })

    // Then, handle inline math ($...$)
    result = result.replace(/\$([^$]+?)\$/g, (match, latex) => {
        return `<span class="math-inline">${renderMath(latex.trim(), false)}</span>`
    })

    return result
}

/**
 * Render math in a DOM element
 * @param {HTMLElement} element - DOM element to render math in
 */
export function renderMathInElement(element) {
    if (!element) return

    const text = element.innerHTML
    element.innerHTML = renderTextWithMath(text)
}

/**
 * Auto-render math in all elements with a specific class
 * @param {string} className - Class name to search for
 */
export function autoRenderMath(className = 'math-content') {
    const elements = document.querySelectorAll(`.${className}`)
    elements.forEach(element => renderMathInElement(element))
}

/**
 * Convert SymPy LaTeX output to rendered HTML
 * @param {string} sympyLatex - LaTeX from SymPy
 * @returns {string} Rendered HTML
 */
export function renderSympyOutput(sympyLatex) {
    // SymPy often outputs LaTeX without delimiters
    return renderMath(sympyLatex, true)
}

/**
 * Create a math element that can be inserted into the DOM
 * @param {string} latex - LaTeX expression
 * @param {boolean} displayMode - Block or inline mode
 * @returns {HTMLElement} DOM element with rendered math
 */
export function createMathElement(latex, displayMode = false) {
    const element = document.createElement(displayMode ? 'div' : 'span')
    element.className = displayMode ? 'math-block' : 'math-inline'
    element.innerHTML = renderMath(latex, displayMode)
    return element
}
