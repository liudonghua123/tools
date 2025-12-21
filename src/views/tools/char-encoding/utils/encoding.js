/**
 * Character Encoding Utilities
 * Core functions for encoding conversions and analysis
 */

// GBK encoding table (simplified - common characters only)
// Full GBK would require a large lookup table
const GBK_ENCODER = new TextEncoder();

/**
 * Get Unicode code point(s) from a string
 * @param {string} str - Input string
 * @returns {number[]} Array of code points
 */
export function getCodePoints(str) {
    return [...str].map(char => char.codePointAt(0));
}

/**
 * Convert code point to formatted Unicode notation
 * @param {number} codePoint
 * @returns {string} e.g., "U+4E2D"
 */
export function formatCodePoint(codePoint) {
    return `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
}

/**
 * Convert character to UTF-8 bytes
 * @param {string} char - Single character
 * @returns {number[]} UTF-8 byte array
 */
export function charToUtf8(char) {
    const encoder = new TextEncoder();
    return [...encoder.encode(char)];
}

/**
 * Convert UTF-8 bytes to character
 * @param {number[]} bytes - UTF-8 byte array
 * @returns {string} Decoded character
 */
export function utf8ToChar(bytes) {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(new Uint8Array(bytes));
}

/**
 * Convert character to UTF-16 bytes
 * @param {string} char - Single character
 * @param {string} endian - 'BE' or 'LE'
 * @returns {number[]} UTF-16 byte array
 */
export function charToUtf16(char, endian = 'BE') {
    const codePoint = char.codePointAt(0);
    const bytes = [];

    if (codePoint <= 0xFFFF) {
        // BMP character - single 16-bit code unit
        if (endian === 'BE') {
            bytes.push((codePoint >> 8) & 0xFF);
            bytes.push(codePoint & 0xFF);
        } else {
            bytes.push(codePoint & 0xFF);
            bytes.push((codePoint >> 8) & 0xFF);
        }
    } else {
        // Supplementary character - surrogate pair
        const adjusted = codePoint - 0x10000;
        const highSurrogate = 0xD800 + ((adjusted >> 10) & 0x3FF);
        const lowSurrogate = 0xDC00 + (adjusted & 0x3FF);

        if (endian === 'BE') {
            bytes.push((highSurrogate >> 8) & 0xFF);
            bytes.push(highSurrogate & 0xFF);
            bytes.push((lowSurrogate >> 8) & 0xFF);
            bytes.push(lowSurrogate & 0xFF);
        } else {
            bytes.push(highSurrogate & 0xFF);
            bytes.push((highSurrogate >> 8) & 0xFF);
            bytes.push(lowSurrogate & 0xFF);
            bytes.push((lowSurrogate >> 8) & 0xFF);
        }
    }

    return bytes;
}

/**
 * Convert character to UTF-32 bytes
 * @param {string} char - Single character
 * @param {string} endian - 'BE' or 'LE'
 * @returns {number[]} UTF-32 byte array
 */
export function charToUtf32(char, endian = 'BE') {
    const codePoint = char.codePointAt(0);
    const bytes = [];

    if (endian === 'BE') {
        bytes.push((codePoint >> 24) & 0xFF);
        bytes.push((codePoint >> 16) & 0xFF);
        bytes.push((codePoint >> 8) & 0xFF);
        bytes.push(codePoint & 0xFF);
    } else {
        bytes.push(codePoint & 0xFF);
        bytes.push((codePoint >> 8) & 0xFF);
        bytes.push((codePoint >> 16) & 0xFF);
        bytes.push((codePoint >> 24) & 0xFF);
    }

    return bytes;
}

/**
 * Format bytes as hex string
 * @param {number[]} bytes
 * @returns {string} e.g., "E4 B8 AD"
 */
export function formatBytes(bytes) {
    return bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' ');
}

/**
 * Format byte as binary string
 * @param {number} byte
 * @returns {string} e.g., "11100100"
 */
export function formatBinary(byte) {
    return byte.toString(2).padStart(8, '0');
}

/**
 * Analyze UTF-8 byte structure
 * @param {string} char - Single character
 * @returns {object} Structure analysis
 */
export function analyzeUtf8Structure(char) {
    const codePoint = char.codePointAt(0);
    const bytes = charToUtf8(char);
    const byteCount = bytes.length;

    let pattern = '';
    let dataBits = '';

    if (byteCount === 1) {
        pattern = '0xxxxxxx';
        dataBits = formatBinary(bytes[0]).slice(1);
    } else if (byteCount === 2) {
        pattern = '110xxxxx 10xxxxxx';
        dataBits = formatBinary(bytes[0]).slice(3) + formatBinary(bytes[1]).slice(2);
    } else if (byteCount === 3) {
        pattern = '1110xxxx 10xxxxxx 10xxxxxx';
        dataBits = formatBinary(bytes[0]).slice(4) +
            formatBinary(bytes[1]).slice(2) +
            formatBinary(bytes[2]).slice(2);
    } else if (byteCount === 4) {
        pattern = '11110xxx 10xxxxxx 10xxxxxx 10xxxxxx';
        dataBits = formatBinary(bytes[0]).slice(5) +
            formatBinary(bytes[1]).slice(2) +
            formatBinary(bytes[2]).slice(2) +
            formatBinary(bytes[3]).slice(2);
    }

    return {
        char,
        codePoint,
        codePointHex: formatCodePoint(codePoint),
        byteCount,
        bytes,
        bytesHex: formatBytes(bytes),
        bytesBinary: bytes.map(formatBinary),
        pattern,
        dataBits,
        range: getUtf8Range(byteCount)
    };
}

/**
 * Get UTF-8 encoding range description
 * @param {number} byteCount
 * @returns {object}
 */
function getUtf8Range(byteCount) {
    const ranges = {
        1: { start: 0x0000, end: 0x007F, description: 'ASCII (0-127)' },
        2: { start: 0x0080, end: 0x07FF, description: 'Latin Extended, Greek, etc.' },
        3: { start: 0x0800, end: 0xFFFF, description: 'CJK, symbols, BMP' },
        4: { start: 0x10000, end: 0x10FFFF, description: 'Emoji, historical scripts' }
    };
    return ranges[byteCount] || null;
}

/**
 * Analyze UTF-16 surrogate pair
 * @param {string} char - Single character (may be represented as surrogate pair)
 * @returns {object} Surrogate pair analysis
 */
export function analyzeSurrogatePair(char) {
    const codePoint = char.codePointAt(0);
    const needsSurrogate = codePoint > 0xFFFF;

    if (!needsSurrogate) {
        return {
            needsSurrogate: false,
            codePoint,
            codePointHex: formatCodePoint(codePoint),
            utf16BE: formatBytes(charToUtf16(char, 'BE')),
            utf16LE: formatBytes(charToUtf16(char, 'LE'))
        };
    }

    // Calculate surrogate pair
    const adjusted = codePoint - 0x10000;
    const highSurrogate = 0xD800 + ((adjusted >> 10) & 0x3FF);
    const lowSurrogate = 0xDC00 + (adjusted & 0x3FF);

    return {
        needsSurrogate: true,
        codePoint,
        codePointHex: formatCodePoint(codePoint),
        adjusted: adjusted.toString(16).toUpperCase(),
        highBits: ((adjusted >> 10) & 0x3FF).toString(16).toUpperCase(),
        lowBits: (adjusted & 0x3FF).toString(16).toUpperCase(),
        highSurrogate,
        highSurrogateHex: highSurrogate.toString(16).toUpperCase(),
        lowSurrogate,
        lowSurrogateHex: lowSurrogate.toString(16).toUpperCase(),
        utf16BE: formatBytes(charToUtf16(char, 'BE')),
        utf16LE: formatBytes(charToUtf16(char, 'LE'))
    };
}

/**
 * Check if character is ASCII
 * @param {string} char
 * @returns {boolean}
 */
export function isAscii(char) {
    const code = char.charCodeAt(0);
    return code >= 0 && code <= 127;
}

/**
 * Get ASCII character info
 * @param {number} code - ASCII code (0-127)
 * @returns {object}
 */
export function getAsciiInfo(code) {
    if (code < 0 || code > 127) return null;

    const controlChars = {
        0: 'NUL (Null)',
        1: 'SOH (Start of Heading)',
        2: 'STX (Start of Text)',
        3: 'ETX (End of Text)',
        4: 'EOT (End of Transmission)',
        5: 'ENQ (Enquiry)',
        6: 'ACK (Acknowledge)',
        7: 'BEL (Bell)',
        8: 'BS (Backspace)',
        9: 'HT (Horizontal Tab)',
        10: 'LF (Line Feed)',
        11: 'VT (Vertical Tab)',
        12: 'FF (Form Feed)',
        13: 'CR (Carriage Return)',
        14: 'SO (Shift Out)',
        15: 'SI (Shift In)',
        16: 'DLE (Data Link Escape)',
        17: 'DC1 (Device Control 1)',
        18: 'DC2 (Device Control 2)',
        19: 'DC3 (Device Control 3)',
        20: 'DC4 (Device Control 4)',
        21: 'NAK (Negative Acknowledge)',
        22: 'SYN (Synchronous Idle)',
        23: 'ETB (End of Trans. Block)',
        24: 'CAN (Cancel)',
        25: 'EM (End of Medium)',
        26: 'SUB (Substitute)',
        27: 'ESC (Escape)',
        28: 'FS (File Separator)',
        29: 'GS (Group Separator)',
        30: 'RS (Record Separator)',
        31: 'US (Unit Separator)',
        32: 'Space',
        127: 'DEL (Delete)'
    };

    const isControl = code < 32 || code === 127;
    const isPrintable = code >= 32 && code < 127;
    const isDigit = code >= 48 && code <= 57;
    const isUpperLetter = code >= 65 && code <= 90;
    const isLowerLetter = code >= 97 && code <= 122;

    let category = 'Other';
    if (isControl) category = 'Control';
    else if (isDigit) category = 'Digit';
    else if (isUpperLetter) category = 'Uppercase Letter';
    else if (isLowerLetter) category = 'Lowercase Letter';
    else if (isPrintable) category = 'Symbol/Punctuation';

    return {
        code,
        char: isPrintable ? String.fromCharCode(code) : '',
        hex: code.toString(16).toUpperCase().padStart(2, '0'),
        binary: code.toString(2).padStart(7, '0'),
        octal: code.toString(8),
        isControl,
        isPrintable,
        category,
        description: controlChars[code] || (isPrintable ? String.fromCharCode(code) : '')
    };
}

/**
 * Parse hex string to bytes
 * @param {string} hexStr - e.g., "E4 B8 AD" or "E4B8AD"
 * @returns {number[]}
 */
export function parseHexString(hexStr) {
    const cleaned = hexStr.replace(/\s+/g, '').replace(/0x/gi, '');
    if (!/^[0-9A-Fa-f]*$/.test(cleaned)) return [];
    if (cleaned.length % 2 !== 0) return [];

    const bytes = [];
    for (let i = 0; i < cleaned.length; i += 2) {
        bytes.push(parseInt(cleaned.substr(i, 2), 16));
    }
    return bytes;
}

/**
 * Get all encoding representations for a character
 * @param {string} char - Single character
 * @returns {object}
 */
export function getAllEncodings(char) {
    const codePoint = char.codePointAt(0);

    return {
        char,
        codePoint,
        unicode: formatCodePoint(codePoint),
        decimal: codePoint,
        ascii: codePoint <= 127 ? codePoint : null,
        utf8: {
            bytes: charToUtf8(char),
            hex: formatBytes(charToUtf8(char)),
            byteCount: charToUtf8(char).length
        },
        utf16BE: {
            bytes: charToUtf16(char, 'BE'),
            hex: formatBytes(charToUtf16(char, 'BE'))
        },
        utf16LE: {
            bytes: charToUtf16(char, 'LE'),
            hex: formatBytes(charToUtf16(char, 'LE'))
        },
        utf32BE: {
            bytes: charToUtf32(char, 'BE'),
            hex: formatBytes(charToUtf32(char, 'BE'))
        },
        utf32LE: {
            bytes: charToUtf32(char, 'LE'),
            hex: formatBytes(charToUtf32(char, 'LE'))
        }
    };
}

/**
 * Get the grapheme clusters from a string (handles emoji properly)
 * @param {string} str
 * @returns {string[]}
 */
export function getGraphemes(str) {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
        return [...segmenter.segment(str)].map(s => s.segment);
    }
    // Fallback for older browsers
    return [...str];
}
