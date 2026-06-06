// Modules in Node.js

// Built-in modules example - path
const path = require('path');
console.log("Path demo:");
console.log("  Base name:", path.basename('/foo/bar/test.js'));
console.log("  Dir name:", path.dirname('/foo/bar/test.js'));
console.log("  Extension:", path.extname('test.js'));

// Built-in modules example - fs (readFileSync)
const fs = require('fs');
console.log("\nFile system demo:");
console.log("  Current directory:", process.cwd());

// Built-in modules example - os
const os = require('os');
console.log("\nOS info:");
console.log("  Platform:", os.platform());
console.log("  CPU cores:", os.cpus().length);
console.log("  Total memory:", Math.round(os.totalmem() / 1024 / 1024), "MB");
console.log("  Free memory:", Math.round(os.freemem() / 1024 / 1024), "MB");

// Built-in modules example - url
const url = require('url');
const myUrl = new URL('https://example.com:8080/path?query=1#hash');
console.log("\nURL parsing:");
console.log("  Hostname:", myUrl.hostname);
console.log("  Port:", myUrl.port);
console.log("  Pathname:", myUrl.pathname);
console.log("  Search:", myUrl.search);

// Built-in modules example - crypto
const crypto = require('crypto');
console.log("\nCrypto demo:");
console.log("  Random UUID:", crypto.randomUUID());
console.log("  MD5 hash:", crypto.createHash('md5').update('hello').digest('hex'));

// Built-in modules example - util
const util = require('util');
const promise = new Promise((resolve) => resolve('Hello!'));
util.callbackify(Promise.resolve.bind(Promise))('test', (err, result) => {
    console.log("  Callback result:", result);
});