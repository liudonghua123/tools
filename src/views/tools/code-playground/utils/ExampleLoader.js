/**
 * Utility to load examples for the code playground
 */

const BASE_URL = import.meta.env.BASE_URL || '/';
const EXAMPLES_PATH = `${BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/'}examples/`;

/**
 * Fetches the manifest for a given language
 * @param {string} lang 
 * @returns {Promise<Object>}
 */
export async function fetchManifest(lang) {
    const response = await fetch(`${EXAMPLES_PATH}${lang}/manifest.json`);
    if (!response.ok) {
        throw new Error(`Failed to load manifest for ${lang}`);
    }
    return await response.json();
}

/**
 * Fetches the content of an example file
 * @param {string} lang 
 * @param {string} path 
 * @returns {Promise<string>}
 */
export async function fetchExample(lang, path) {
    const response = await fetch(`${EXAMPLES_PATH}${lang}/${path}`);
    if (!response.ok) {
        throw new Error(`Failed to load example: ${path}`);
    }
    return await response.text();
}
