import { loadPyodide } from 'pyodide'

// Pyodide runtime manager for executing Python code in the browser
// Uses local Pyodide installation for better performance and offline support

let pyodideInstance = null
let isLoading = false
let loadPromise = null
let stdoutBuffer = []
let stderrBuffer = []

/**
 * Initialize Pyodide with required packages using local installation
 */
export async function initPyodide(onProgress = null) {
    if (pyodideInstance) {
        return pyodideInstance
    }

    if (isLoading) {
        return loadPromise
    }

    isLoading = true
    loadPromise = (async () => {
        try {
            if (onProgress) onProgress('正在加载 Pyodide 运行时...')
            console.log('Initializing Pyodide...')

            // Get base URL for local assets
            const baseUrl = import.meta.env.BASE_URL || '/'
            const pyodideBase = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}pyodide/`
            console.log('Pyodide base URL:', pyodideBase)

            if (onProgress) onProgress('正在初始化 Python 环境...')

            // Use loadPyodide from npm package
            pyodideInstance = await loadPyodide({
                indexURL: pyodideBase
            })

            // Setup stdout/stderr capture
            pyodideInstance.setStdout({
                batched: (msg) => {
                    console.log('Python stdout:', msg)
                    stdoutBuffer.push(msg)
                }
            })
            pyodideInstance.setStderr({
                batched: (msg) => {
                    console.warn('Python stderr:', msg)
                    stderrBuffer.push(msg)
                }
            })

            if (onProgress) onProgress('正在加载科学计算库...')
            console.log('Loading packages...')

            // Load required packages
            // Note: loading all at once might be slow, but it's required for the tool features
            await pyodideInstance.loadPackage(['numpy', 'matplotlib', 'scipy', 'sympy', 'pandas'])

            if (onProgress) onProgress('正在配置环境...')

            // Download and install Chinese font
            try {
                console.log('Downloading Chinese font...')
                // Use local font file from public directory
                const fontUrl = `${baseUrl.endsWith('/') ? baseUrl : baseUrl + '/'}NotoSansSC-Regular.ttf`
                const fontResponse = await fetch(fontUrl)
                if (fontResponse.ok) {
                    const fontBuffer = await fontResponse.arrayBuffer()
                    pyodideInstance.FS.writeFile('/home/pyodide/NotoSansSC-Regular.ttf', new Uint8Array(fontBuffer))
                    console.log('Font downloaded and saved.')
                } else {
                    console.warn('Font download failed:', fontResponse.status, fontResponse.statusText)
                }
            } catch (fontErr) {
                console.warn('Failed to download Chinese font:', fontErr)
            }

            // Setup matplotlib for web
            await pyodideInstance.runPythonAsync(`
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
      `)

            isLoading = false
            if (onProgress) onProgress('准备就绪！')
            console.log('Pyodide ready!')
            return pyodideInstance
        } catch (error) {
            isLoading = false
            console.error('Pyodide init error:', error)
            throw new Error(`Failed to initialize Pyodide: ${error.message}`)
        }
    })()

    return loadPromise
}

/**
 * Execute Python code and capture output
 */
export async function runPythonCode(code, onProgress = null) {
    console.log('runPythonCode called with code length:', code.length)
    const pyodide = await initPyodide(onProgress)

    try {
        // Reset buffers
        stdoutBuffer = []
        stderrBuffer = []

        // Prepare code with plot handling
        // We don't wrap stdout/stderr here anymore, we use setStdout/setStderr
        const wrappedCode = `
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
`

        // Run the setup code (synchronous usually fine for definitions)
        pyodide.runPython(wrappedCode)

        // Now run user code
        // We append it to the wrapper logic or just run it?
        // If we run it separately, we need to make sure plt.show is still overridden.
        // Yes, running in same interpreter preserves globals.

        console.log('Executing user code...')
        await pyodide.runPythonAsync(code)
        console.log('User code execution finished')

        // Get plots
        const plotsProxy = pyodide.globals.get('_plots')
        const plots = plotsProxy ? plotsProxy.toJs() : []
        if (plotsProxy) plotsProxy.destroy()

        // Check for stderr
        if (stderrBuffer.length > 0) {
            // We can treat stderr as part of output or error
            // For now, join them
        }

        return {
            output: stdoutBuffer.join('\n'),
            plots: plots,
            error: stderrBuffer.length > 0 ? stderrBuffer.join('\n') : null
        }
    } catch (error) {
        console.error('Execution error:', error)
        // Extract Python error
        let errorMessage = error.message
        if (errorMessage.includes('PythonError:')) {
            errorMessage = errorMessage.split('PythonError:')[1].trim()
        }

        return {
            output: stdoutBuffer.join('\n'),
            plots: [],
            error: errorMessage
        }
    }
}

/**
 * Get Pyodide loading status
 */
export function getPyodideStatus() {
    if (pyodideInstance) return 'ready'
    if (isLoading) return 'loading'
    return 'not-loaded'
}
