import fs from 'fs';
import path from 'path';

const REGIONS_URL = 'https://raw.githubusercontent.com/modood/Administrative-divisions-of-China/master/dist/pca-code.json';
const OUTPUT_FILE = path.resolve('public/data/regions.json');
const DATA_DIR = path.dirname(OUTPUT_FILE);

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

async function fetchRegions() {
    console.log(`Fetching regions from ${REGIONS_URL}...`);
    try {
        const res = await fetch(REGIONS_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Flatten the data to a simple 6-digit code -> Name mapping
        // The source is nested: [{ code: '11', name: '北京', children: [...] }]
        const mapping = {};

        function flatten(items, parentName = '') {
            for (const item of items) {
                const fullName = parentName ? `${parentName} ${item.name}` : item.name;
                mapping[item.code] = fullName;
                if (item.children) {
                    flatten(item.children, fullName);
                }
            }
        }

        flatten(data);

        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(mapping, null, 2));
        console.log(`Saved ${Object.keys(mapping).length} regions to ${OUTPUT_FILE}`);
    } catch (error) {
        console.error("Error fetching regions:", error);
        // Fallback: A few major ones
        const fallback = {
            "110000": "北京市",
            "110101": "北京市 东城区",
            "110105": "北京市 朝阳区",
            "310000": "上海市",
            "440000": "广东省",
            "440100": "广东省 广州市",
            "440300": "广东省 深圳市"
        };
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fallback, null, 2));
        console.log("Written fallback region data.");
    }
}

fetchRegions();
