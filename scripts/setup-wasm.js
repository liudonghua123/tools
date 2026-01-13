import fs from 'fs';
import path from 'path';
import https from 'https';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// Directories
const publicDir = path.resolve(__dirname, '../public');
const pyodideDir = path.join(publicDir, 'pyodide');
const phpDir = path.join(publicDir, 'php-wasm');
const sqlDir = path.join(publicDir, 'sql-wasm');
const rubyDir = path.join(publicDir, 'ruby-wasm');
const goDir = path.join(publicDir, 'go-wasm');
const rustDir = path.join(publicDir, 'rust-wasm');
const zigDir = path.join(publicDir, 'zig-wasm');
const luaDir = path.join(publicDir, 'lua-wasm');
const fortranDir = path.join(publicDir, 'fortran-wasm');
const csharpDir = path.join(publicDir, 'csharp-wasm');
const swiplDir = path.join(publicDir, 'swipl-wasm');

// Versions & Sources
const pyodideVersion = pkg.dependencies.pyodide.replace(/[^0-9.]/g, '');
const pyodideUrl = `https://github.com/pyodide/pyodide/releases/download/${pyodideVersion}/pyodide-${pyodideVersion}.tar.bz2`;

// Helper: Download file
async function download(url, dest) {
    console.log(`Downloading ${url}...`);
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = (targetUrl) => {
            https.get(targetUrl, (response) => {
                if (response.statusCode === 301 || response.statusCode === 302) {
                    request(response.headers.location);
                    return;
                }
                if (response.statusCode !== 200) {
                    reject(new Error(`Failed to download: ${response.statusCode}`));
                    return;
                }
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlink(dest, () => { });
                reject(err);
            });
        };
        request(url);
    });
}

// Helper: Copy file
function copyFile(src, dest) {
    if (!fs.existsSync(src)) {
        console.warn(`Source file not found: ${src}`);
        return;
    }
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
    console.log(`Copied ${path.basename(src)} to ${path.relative(publicDir, dest)}`);
}

async function setupPyodide() {
    if (fs.existsSync(path.join(pyodideDir, 'pyodide.js'))) {
        console.log('Pyodide already exists, skipping.');
        return;
    }
    console.log('Setting up Pyodide...');
    if (!fs.existsSync(pyodideDir)) fs.mkdirSync(pyodideDir, { recursive: true });

    const archivePath = path.resolve(__dirname, 'pyodide.tar.bz2');
    try {
        await download(pyodideUrl, archivePath);
        console.log('Extracting Pyodide...');
        execSync(`tar -xf "${archivePath}" -C "${pyodideDir}" --strip-components 1`, { stdio: 'inherit' });
        fs.unlinkSync(archivePath);
        console.log('Pyodide setup complete.');
    } catch (e) {
        console.error('Pyodide setup failed:', e);
    }
}

async function setupPhp() {
    console.log('Setting up PHP WebAssembly...');
    const nodeModulesPhp = path.resolve(__dirname, '../node_modules/php-wasm');
    if (!fs.existsSync(nodeModulesPhp)) {
        console.error('php-wasm not found in node_modules. Run npm install.');
        return;
    }

    if (!fs.existsSync(phpDir)) fs.mkdirSync(phpDir, { recursive: true });

    // Helper to copy directory recursively
    function copyDir(src, dest) {
        if (fs.statSync(src).isDirectory()) {
            if (!fs.existsSync(dest)) fs.mkdirSync(dest);
            fs.readdirSync(src).forEach(file => {
                copyDir(path.join(src, file), path.join(dest, file));
            });
        } else {
            fs.copyFileSync(src, dest);
            console.log(`Copied ${path.basename(src)} to ${path.relative(publicDir, dest)}`);
        }
    }

    try {
        console.log(`Copying all files from ${nodeModulesPhp} to ${phpDir}...`);
        fs.readdirSync(nodeModulesPhp).forEach(file => {
            copyDir(path.join(nodeModulesPhp, file), path.join(phpDir, file));
        });

        // Ensure php-web.wasm is available
        const wasmFiles = fs.readdirSync(phpDir).filter(f => f.endsWith('.wasm') && !f.includes('php-web.wasm'));
        if (wasmFiles.length > 0 && !fs.existsSync(path.join(phpDir, 'php-web.wasm'))) {
            // Heuristic: largest wasm file is likely the core
            const largest = wasmFiles.reduce((a, b) => {
                return fs.statSync(path.join(phpDir, a)).size > fs.statSync(path.join(phpDir, b)).size ? a : b;
            });
            fs.copyFileSync(path.join(phpDir, largest), path.join(phpDir, 'php-web.wasm'));
            console.log(`Aliased ${largest} to php-web.wasm`);
        }
    } catch (e) {
        console.warn('Failed to copy PHP files:', e);
    }
    console.log('PHP setup complete.');
}

async function setupSqlite() {
    console.log('Setting up SQLite WebAssembly...');
    const nodeModulesSql = path.resolve(__dirname, '../node_modules/sql.js/dist');
    if (!fs.existsSync(nodeModulesSql)) {
        console.error('sql.js not found in node_modules. Run npm install.');
        return;
    }

    if (!fs.existsSync(sqlDir)) fs.mkdirSync(sqlDir, { recursive: true });

    try {
        console.log(`Copying all files from ${nodeModulesSql} to ${sqlDir}...`);
        fs.readdirSync(nodeModulesSql).forEach(file => {
            const src = path.join(nodeModulesSql, file);
            const dest = path.join(sqlDir, file);
            if (fs.statSync(src).isFile()) {
                fs.copyFileSync(src, dest);
                console.log(`Copied ${file} to ${path.relative(publicDir, dest)}`);
            }
        });
    } catch (e) {
        console.warn('Failed to copy SQLite files:', e);
    }
    console.log('SQLite setup complete.');
}

async function setupRuby() {
    console.log('Setting up Ruby WebAssembly...');
    const nodeModulesRuby = path.resolve(__dirname, '../node_modules/@ruby/3.4-wasm-wasi/dist');
    const nodeModulesRubyWasi = path.resolve(__dirname, '../node_modules/@ruby/wasm-wasi/dist');

    if (!fs.existsSync(nodeModulesRuby)) {
        console.error('@ruby/3.4-wasm-wasi not found in node_modules. Run npm install.');
        return;
    }

    if (!fs.existsSync(rubyDir)) fs.mkdirSync(rubyDir, { recursive: true });

    try {
        // Copy main ruby files
        console.log(`Copying Ruby binary files...`);
        ['ruby+stdlib.wasm', 'ruby.wasm', 'browser.umd.js', 'browser.script.iife.js'].forEach(file => {
            const src = path.join(nodeModulesRuby, file);
            const dest = path.join(rubyDir, file);
            if (fs.existsSync(src)) {
                fs.copyFileSync(src, dest);
                console.log(`Copied ${file} to ${path.relative(publicDir, dest)}`);
            }
        });
    } catch (e) {
        console.warn('Failed to copy Ruby files:', e);
    }
    console.log('Ruby setup complete.');
}

async function setupWebPerl() {
    console.log('Setting up WebPerl...');
    const webperlDir = path.join(publicDir, 'webperl');
    const wasmFile = path.join(webperlDir, 'emperl.wasm');

    if (fs.existsSync(wasmFile)) {
        console.log('WebPerl already exists, skipping download/extract.');
    } else {
        if (!fs.existsSync(webperlDir)) fs.mkdirSync(webperlDir, { recursive: true });

        const zipUrl = 'https://github.com/haukex/webperl/releases/download/v0.09-beta/webperl_prebuilt_v0.09-beta.zip';
        const zipPath = path.resolve(__dirname, 'webperl.zip');

        try {
            await download(zipUrl, zipPath);
            console.log('Extracting WebPerl...');
            // Try 'bsdtar' with --strip-components 1 (installed in CI via libarchive-tools)
            // other tool like unzip, 7z are not support --strip-components 1 
            try {
                // bsdtar -xvf <file> --strip-components 1 -C <dest>
                // Note: -f needed before the filename, -C before destination
                execSync(`bsdtar -xf "${zipPath}" --strip-components 1 -C "${webperlDir}"`, { stdio: 'inherit' });
            } catch (err) {
                console.error('Failed to extract WebPerl with bsdtar:', err);
                throw err;
            }
            fs.unlinkSync(zipPath);
            console.log('WebPerl extraction complete.');
        } catch (e) {
            console.error('WebPerl setup failed:', e);
            return;
        }
    }

    // Patch webperl.js to fix getScriptURL issue with Vite
    const webperlJs = path.join(webperlDir, 'webperl.js');
    if (fs.existsSync(webperlJs)) {
        let content = fs.readFileSync(webperlJs, 'utf8');
        if (!content.includes('indexOf(\'webperl.js\')')) {
            console.log('Patching webperl.js for better base URL detection...');
            const search = /var getScriptURL = \(function\(\) \{[\s\S]*?var myScript = scripts\[index\];\s*return function\(\) \{ return myScript\.src; \};\s*\}\)\(\);/;
            const replacement = `var getScriptURL = (function() { 
	var scripts = document.getElementsByTagName('script');
	for (var i = scripts.length - 1; i >= 0; i--) {
		if (scripts[i].src && scripts[i].src.indexOf('webperl.js') !== -1) {
			return function() { return scripts[i].src; };
		}
	}
	var myScript = scripts[scripts.length - 1];
	return function() { return myScript.src; };
})();`;
            content = content.replace(search, replacement);
            fs.writeFileSync(webperlJs, content);
            console.log('WebPerl patch applied.');
        }
    }
}

const webrDir = path.join(publicDir, 'webr');

async function setupWebr() {
    console.log('Setting up WebR...');
    const nodeModulesWebr = path.resolve(__dirname, '../node_modules/webr/dist');

    if (!fs.existsSync(nodeModulesWebr)) {
        console.error('webr not found in node_modules. Run npm install.');
        return;
    }

    if (!fs.existsSync(webrDir)) fs.mkdirSync(webrDir, { recursive: true });

    try {
        console.log(`Copying all files from ${nodeModulesWebr} to ${webrDir}...`);
        // Recursive copy manually since fs.cpSync is Node 16.7+ (using read/write for safety or simple recursion)
        const copyRecursive = (src, dest) => {
            if (fs.statSync(src).isDirectory()) {
                if (!fs.existsSync(dest)) fs.mkdirSync(dest);
                fs.readdirSync(src).forEach(child => {
                    copyRecursive(path.join(src, child), path.join(dest, child));
                });
            } else {
                fs.copyFileSync(src, dest);
                // console.log(`Copied ${path.basename(src)}`); // Too verbose
            }
        };
        copyRecursive(nodeModulesWebr, webrDir);
        console.log('WebR setup complete.');
    } catch (e) {
        console.warn('Failed to copy WebR files:', e);
    }
}

const clangDir = path.join(publicDir, 'wasm-clang');

async function setupClang() {
    console.log('Setting up Clang WebAssembly...');

    if (!fs.existsSync(clangDir)) fs.mkdirSync(clangDir, { recursive: true });

    // Files to download from the demo site
    const files = [
        'worker.js',
        'shared.js',
        'clang',
        'lld',
        'sysroot.tar',
        'memfs'
    ];

    const baseUrl = 'https://binji.github.io/wasm-clang';

    try {
        for (const file of files) {
            const dest = path.join(clangDir, file);
            if (!fs.existsSync(dest)) {
                await download(`${baseUrl}/${file}`, dest);
            } else {
                console.log(`${file} already exists, skipping.`);
            }
        }
        console.log('Clang setup complete.');
    } catch (e) {
        console.error('Clang setup failed:', e);
    }
}

const octaveDir = path.join(publicDir, 'octave-wasm');

async function setupOctave() {
    console.log('Setting up Octave WebAssembly...');
    const nodeModulesOctave = path.resolve(__dirname, '../node_modules/@liudonghua123/octave-wasm/dist');

    if (!fs.existsSync(nodeModulesOctave)) {
        console.error('@liudonghua123/octave-wasm not found in node_modules. Run npm install.');
        return;
    }

    if (!fs.existsSync(octaveDir)) fs.mkdirSync(octaveDir, { recursive: true });

    try {
        console.log(`Copying all files from ${nodeModulesOctave} to ${octaveDir}...`);
        // Recursive copy manually since fs.cpSync is Node 16.7+ (using read/write for safety or simple recursion)
        const copyRecursive = (src, dest) => {
            if (fs.statSync(src).isDirectory()) {
                if (!fs.existsSync(dest)) fs.mkdirSync(dest);
                fs.readdirSync(src).forEach(child => {
                    copyRecursive(path.join(src, child), path.join(dest, child));
                });
            } else {
                fs.copyFileSync(src, dest);
            }
        };
        copyRecursive(nodeModulesOctave, octaveDir);
        console.log('Octave setup complete.');
    } catch (e) {
        console.warn('Failed to copy Octave files:', e);
    }
}

async function setupRust() {
    console.log('Setting up Rust (Rune) WebAssembly...');

    if (!fs.existsSync(rustDir)) fs.mkdirSync(rustDir, { recursive: true });

    const runeJsUrl = 'https://rune-rs.github.io/js/rune.js';
    const runeJsPath = path.join(rustDir, 'rune.js');

    try {
        // Step 1: Download rune.js if not exists
        if (!fs.existsSync(runeJsPath)) {
            await download(runeJsUrl, runeJsPath);
        } else {
            console.log('rune.js already exists.');
        }

        // Step 2: Read content and parse WASM path
        let content = fs.readFileSync(runeJsPath, 'utf8');

        // Regex to find the wasm path: /js/assets/rune_wasm-<hash>.wasm
        const wasmMatch = content.match(/\/js\/assets\/rune_wasm-[a-f0-9]+\.wasm/);

        if (wasmMatch) {
            const wasmPathFromJs = wasmMatch[0];
            const wasmUrl = `https://rune-rs.github.io${wasmPathFromJs}`;
            const wasmLocalName = 'rune_wasm.wasm';
            const wasmDest = path.join(rustDir, wasmLocalName);

            // Step 3: Download WASM
            if (!fs.existsSync(wasmDest)) {
                await download(wasmUrl, wasmDest);
            } else {
                console.log(`${wasmLocalName} already exists, skipping.`);
            }

            // Step 4: Patch rune.js path
            console.log(`Patching rune.js to use local wasm file (replacing ${wasmPathFromJs})...`);
            content = content.replace(wasmPathFromJs, wasmLocalName);
        } else {
            // Check if already patched
            if (content.includes('rune_wasm.wasm')) {
                console.log('rune.js seems to be already patched with rune_wasm.wasm.');
            } else {
                console.warn('Could not find match for rune_wasm file in rune.js. Skipping WASM download/patch.');
            }
        }

        // Existing patch for init(opt)
        if (content.includes('async function init() {')) {
            console.log('Patching rune.js init() to accept options...');
            content = content.replace('async function init() {', 'async function init(opt) {');
            content = content.replace('exports.module = await wasm();', 'exports.module = await wasm(opt);');
        }

        fs.writeFileSync(runeJsPath, content);

        console.log('Rust (Rune) setup complete.');
    } catch (e) {
        console.error('Rust (Rune) setup failed:', e);
    }
}

async function setupGo() {
    console.log('Setting up Go WebAssembly...');

    if (!fs.existsSync(goDir)) fs.mkdirSync(goDir, { recursive: true });

    const files = [
        'main.wasm',
        'wasm_exec.js'
    ];

    const baseUrl = 'https://raw.githubusercontent.com/Aryan-Bagale/go-browser-interpreter/main';

    try {
        for (const file of files) {
            const dest = path.join(goDir, file);
            if (!fs.existsSync(dest)) {
                await download(`${baseUrl}/${file}`, dest);
            } else {
                console.log(`${file} already exists, skipping.`);
            }
        }
        console.log('Go setup complete.');
    } catch (e) {
        console.error('Go setup failed:', e);
    }
}

async function setupZig() {
    console.log('Setting up Zig WebAssembly...');

    if (!fs.existsSync(zigDir)) fs.mkdirSync(zigDir, { recursive: true });

    const requiredFiles = ['zig.wasm', 'zls.wasm', 'zig.tar.gz'];
    let missingFn = [];
    requiredFiles.forEach(f => {
        if (!fs.existsSync(path.join(zigDir, f))) {
            missingFn.push(f);
        }
    });

    if (missingFn.length > 0) {
        console.warn(`Missing Zig files: ${missingFn.join(', ')}. Please verify they are placed in ${zigDir}`);
    } else {
        console.log('Zig WASM files found.');
    }
}

async function setupLua() {
    console.log('Setting up Lua (wasmoon) WebAssembly...');
    const nodeModulesLua = path.resolve(__dirname, '../node_modules/wasmoon/dist');

    if (!fs.existsSync(nodeModulesLua)) {
        console.error('wasmoon not found in node_modules. Run npm install.');
        return;
    }

    if (!fs.existsSync(luaDir)) fs.mkdirSync(luaDir, { recursive: true });

    try {
        const file = 'glue.wasm';
        const src = path.join(nodeModulesLua, file);
        const dest = path.join(luaDir, file);
        if (fs.existsSync(src)) {
            fs.copyFileSync(src, dest);
            console.log(`Copied ${file} to ${path.relative(publicDir, dest)}`);
        } else {
            console.warn(`Source file not found: ${src}`);
        }
        console.log('Lua setup complete.');
    } catch (e) {
        console.warn('Failed to copy Lua files:', e);
    }
}

async function setupFortran() {
    console.log('Setting up Fortran (LFortran) WebAssembly...');

    if (!fs.existsSync(fortranDir)) fs.mkdirSync(fortranDir, { recursive: true });

    const files = [
        'lfortran.wasm',
        'lfortran.js',
        'lfortran.data'
    ];

    // The latest release is not working, using the same version as https://dev.lfortran.org/
    // The error is: semantic error: Function 'test_template' not found (not user defined nor intrinsic) when execute template_add.f90 
    // see also https://github.com/lfortran/lcompilers_frontend/blob/main/utils/commit.json, https://lfortran.github.io/wasm_builds/data.json
    const { id, build_type } = await (await fetch('https://raw.githubusercontent.com/lfortran/lcompilers_frontend/refs/heads/main/utils/commit.json')).json();
    console.log(`LFortran version: ${id} (${build_type})`);
    const baseUrl = `https://lfortran.github.io/wasm_builds/release/${id}`;

    try {
        for (const file of files) {
            const dest = path.join(fortranDir, file);
            if (!fs.existsSync(dest)) {
                await download(`${baseUrl}/${file}`, dest);
            } else {
                console.log(`${file} already exists, skipping.`);
            }
        }
        console.log('Fortran setup complete.');
    } catch (e) {
        console.error('Fortran setup failed:', e);
    }
}

const cobolDir = path.join(publicDir, 'cobol-wasm');

async function setupCobol() {
    console.log('Setting up COBOL WebAssembly...');

    if (!fs.existsSync(cobolDir)) fs.mkdirSync(cobolDir, { recursive: true });

    // Based on the file listing from the user:
    // clang, cobc, sysroot.tar, wasm-ld
    // Assuming these are hosted somewhere or reused from clang-wasm for now?
    // Wait, the user already had them. But for reproducibility we need a source.
    // The previous conversation mentioned checking public/cobol-wasm.
    // Since I don't have a definitive external URL for the "cobol-tuned" clang/wasm-ld right now,
    // I will add the function frame but warn if files are missing, or try to download if I can find a source.
    // However, looking at the user's `sysroot.tar` content (gnucobol config), this seems custom.
    // I'll skip downloading if files exist, but I need to know WHERE they came from to make this script actually useful for a fresh clone.
    // For now, I will assume they are manually placed or I should use the ones from a known release if available.
    // Let's just ensure the directory exists and log what we find.

    // Actually, I should probably try to download them if I knew the URL.
    // Since I don't, I will just log.

    // EDIT: The user asked to "Add setupCobol...". I will add it but effectively it checks existence.
    // If I knew the source I'd add download logic.
    // The prompt implied I should "ensure reproducibility". I'll assume they might be in `node_modules` or I should simply check.

    const files = ['cobc', 'clang', 'wasm-ld', 'sysroot.tar'];
    let missing = [];
    files.forEach(f => {
        if (!fs.existsSync(path.join(cobolDir, f))) {
            missing.push(f);
        }
    });

    if (missing.length > 0) {
        console.warn(`Missing COBOL files: ${missing.join(', ')}. Please manually place them in ${cobolDir} or update setup-wasm.js with a download source.`);
    } else {
        console.log('COBOL WASM files found.');
    }
}

async function setupCSharp() {
    console.log('Setting up C# (WasmSharp) WebAssembly...');
    const nodeModulesCSharp = path.resolve(__dirname, '../node_modules/@wasmsharp/core');

    if (!fs.existsSync(nodeModulesCSharp)) {
        console.error('@wasmsharp/core not found in node_modules. Run npm install.');
        return;
    }

    if (!fs.existsSync(csharpDir)) fs.mkdirSync(csharpDir, { recursive: true });

    try {
        console.log(`Copying all files from ${nodeModulesCSharp} to ${csharpDir}...`);
        // Recursive copy function
        const copyRecursive = (src, dest) => {
            if (fs.statSync(src).isDirectory()) {
                if (!fs.existsSync(dest)) fs.mkdirSync(dest);
                fs.readdirSync(src).forEach(child => {
                    copyRecursive(path.join(src, child), path.join(dest, child));
                });
            } else {
                fs.copyFileSync(src, dest);
            }
        };
        copyRecursive(nodeModulesCSharp, csharpDir);
        console.log('C# setup complete.');
    } catch (e) {
        console.warn('Failed to copy C# files:', e);
    }
}

async function setupSwiProlog() {
    console.log('Setting up SWI-Prolog WebAssembly...');
    const nodeModulesSwipl = path.resolve(__dirname, '../node_modules/swipl-wasm/dist');

    if (!fs.existsSync(nodeModulesSwipl)) {
        console.error('swipl-wasm not found in node_modules. Run npm install.');
        return;
    }

    if (!fs.existsSync(swiplDir)) fs.mkdirSync(swiplDir, { recursive: true });

    try {
        console.log(`Copying all files from ${nodeModulesSwipl} to ${swiplDir}...`);
        // Recursive copy function
        const copyRecursive = (src, dest) => {
            if (fs.statSync(src).isDirectory()) {
                if (!fs.existsSync(dest)) fs.mkdirSync(dest);
                fs.readdirSync(src).forEach(child => {
                    copyRecursive(path.join(src, child), path.join(dest, child));
                });
            } else {
                fs.copyFileSync(src, dest);
            }
        };
        copyRecursive(nodeModulesSwipl, swiplDir);
        console.log('SWI-Prolog setup complete.');
    } catch (e) {
        console.warn('Failed to copy SWI-Prolog files:', e);
    }
}

async function main() {
    try {
        await setupPyodide();
        await setupPhp();
        await setupSqlite();
        await setupRuby();
        await setupWebPerl();
        await setupWebr();
        await setupClang();
        await setupOctave();
        await setupGo();
        await setupZig();
        await setupRust();
        await setupLua();
        await setupFortran();
        await setupCobol();
        // await setupCSharp();
        await setupSwiProlog();
        console.log('All WASM assets setup complete.');
    } catch (e) {
        console.error('Setup failed:', e);
        process.exit(1);
    }
}

main();
