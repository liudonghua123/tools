import fs from 'fs';
import path from 'path';

const WIKI_URL = 'https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers';
const OUTPUT_FILE = path.resolve('public/data/ports.json');

// To use real LLM translation, set OPENAI_API_KEY or similar and implement the call.
// For now, we use an enhanced dictionary and a rule-based system.
const TRANSLATIONS = {
    "File Transfer Protocol": "文件传输协议",
    "Secure Shell": "安全外壳协议",
    "Hypertext Transfer Protocol": "超文本传输协议",
    "Domain Name System": "域名系统",
    "Simple Mail Transfer Protocol": "简单邮件传输协议",
    "Post Office Protocol": "邮局协议",
    "Internet Message Access Protocol": "互联网邮件访问协议",
    "Dynamic Host Configuration Protocol": "动态主机配置协议",
    "Bootstrap Protocol": "引导协议",
    "Simple Network Management Protocol": "简单网络管理协议",
    "Remote Desktop Protocol": "远程桌面协议",
    "Network Time Protocol": "网络时间协议",
    "Virtual Network Computing": "虚拟网络控制台",
    "Elasticsearch": "分布式搜索和分析引擎",
    "Redis": "远程字典服务",
    "MySQL": "数据库管理系统",
    "PostgreSQL": "对象关系数据库系统",
    "Secure": "安全",
    "Data": "数据",
    "Control": "控制",
    "Login": "登录",
    "Transfer": "传输",
    "Protocol": "协议",
    "System": "系统",
    "Service": "服务",
    "Message": "消息",
    "Access": "访问",
    "Network": "网络",
    "Management": "管理",
    "Shell": "外壳",
    "Mail": "邮件",
    "Time": "时间",
    "Host": "主机",
    "Configuration": "配置",
    "Internet": "互联网"
};

function translateText(text) {
    if (!text) return '';
    let zh = text;
    for (const [en, cn] of Object.entries(TRANSLATIONS)) {
        const regex = new RegExp(`\\b${en}\\b`, 'gi');
        zh = zh.replace(regex, cn);
    }
    return zh === text ? '' : zh;
}

async function fetchPorts() {
    console.log(`Scraping ports from ${WIKI_URL}...`);
    try {
        const res = await fetch(WIKI_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();

        // Simple regex parser for Wikipedia tables
        const ports = [];
        const tableRegex = /<table class="wikitable.*?>([\s\S]*?)<\/table>/g;
        const rowRegex = /<tr>([\s\S]*?)<\/tr>/g;
        const cellRegex = /<t[dh].*?>([\s\S]*?)<\/t[dh]>/g;

        for (let tableMatch of html.matchAll(tableRegex)) {
            const tableContent = tableMatch[1];
            const rows = tableContent.match(rowRegex);
            if (!rows) continue;

            for (const row of rows) {
                const cellsRaw = row.match(cellRegex);
                // A typical row should have at least Port, TCP, UDP, Description (4 cells)
                // Some tables might include DCCP/SCTP, making it 5 or 6 cells.
                if (!cellsRaw || cellsRaw.length < 4) continue;

                // Clean citations and entities thoroughly
                const cleanTxt = (htmlStr) => {
                    if (!htmlStr) return '';
                    return htmlStr.replace(/<.*?>/g, '') // remove tags
                        .replace(/&#91;.*?&#93;/g, '') // remove [12] style citations (encoded)
                        .replace(/\[.*?\]/g, '') // remove literal [12]
                        .replace(/&[#a-zA-Z0-9]+;/g, '') // remove other entities completely
                        .replace(/\s+/g, ' ') // Normalize whitespace
                        .trim();
                };

                const cells = cellsRaw.map(c => cleanTxt(c));
                const portNumRaw = cells[0];
                if (!/^\d+/.test(portNumRaw)) continue;
                const portNum = portNumRaw.match(/^\d+/)[0];

                let tcp = cells[1] || '';
                let udp = cells[2] || '';
                let sctp = '';
                let dccp = '';
                let descIndex = 3;

                // Dynamic mapping based on cell count
                if (cells.length === 5) {
                    sctp = cells[3];
                    descIndex = 4;
                } else if (cells.length >= 6) {
                    dccp = cells[3];
                    sctp = cells[4];
                    descIndex = 5;
                }

                const entry = {
                    port: portNum,
                    tcp: tcp,
                    udp: udp,
                    sctp: sctp,
                    dccp: dccp,
                    service: '',
                    desc: '',
                    meta: {}
                };

                const lastCellRaw = cellsRaw[descIndex] || '';
                const lastCellClean = cleanTxt(lastCellRaw);

                // Service name detection
                const boldMatch = lastCellRaw.match(/<b>(.*?)<\/b>/);
                const linkMatch = lastCellRaw.match(/<a [^>]*>(.*?)<\/a>/);

                let service = '';
                if (boldMatch) service = cleanTxt(boldMatch[1]);
                else if (linkMatch) service = cleanTxt(linkMatch[1]);

                if (!service || ['Yes', 'No', 'Assigned', 'Unofficial', 'Reserved', 'Official'].includes(service) || service.length < 3) {
                    const split = lastCellClean.split(/[:\u2014]/);
                    if (split.length > 1 && split[0].trim().length > 2 && split[0].length < 30) {
                        service = split[0].trim();
                    }
                }

                // Final fallback: if service name is just a status or too short, clear it
                if (['Yes', 'No', 'Assigned', 'Unofficial', 'Reserved', 'Official'].includes(service) || (service && service.length < 3)) {
                    service = '';
                }

                entry.service = service;
                entry.desc = lastCellClean;

                // Avoid duplicate service in desc if it started with it
                if (entry.service && entry.desc.startsWith(entry.service)) {
                    const suffix = entry.desc.substring(entry.service.length).trim();
                    if (suffix.startsWith(':') || suffix.startsWith('-') || suffix.startsWith('—')) {
                        entry.desc = suffix.substring(1).trim();
                    }
                }

                entry.desc_zh = translateText(entry.desc);
                entry.service_zh = translateText(entry.service);

                ports.push(entry);
            }
        }

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(ports, null, 2));
        console.log(`Saved ${ports.length} port entries to ${OUTPUT_FILE}`);
    } catch (error) {
        console.error('Error fetching ports:', error);
    }
}

fetchPorts();
