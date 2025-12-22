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
        execSync(`tar -xf "${archivePath}" -C "${pyodideDir}" --strip-components=1`, { stdio: 'inherit' });
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

async function main() {
    try {
        await setupPyodide();
        await setupPhp();
        await setupSqlite();
        console.log('All WASM assets setup complete.');
    } catch (e) {
        console.error('Setup failed:', e);
        process.exit(1);
    }
}

main();
