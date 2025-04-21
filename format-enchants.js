const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ENCHANT_MAP = require('./enchant-map.json');

const RAW_DIR = path.resolve(__dirname, 'raw');
const PROCESSED_DIR = path.resolve(__dirname, 'processed');
const ARCHIVE_DIR = path.resolve(__dirname, 'archived');

[RAW_DIR, PROCESSED_DIR, ARCHIVE_DIR].forEach((dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
		console.log(`📁 Created folder: ${dir}`);
	}
});

function normalizeEnchant(raw) {
	return ENCHANT_MAP[raw] || raw.toLowerCase().replace(/_/g, '');
}

function walk(obj) {
	if (Array.isArray(obj)) {
		return obj.map((item) => {
			if (typeof item === 'string') {
				const m = item.match(/^([A-Z0-9_]+),(\d+)$/);
				if (m) {
					const [, rawName, lvl] = m;
					return `${normalizeEnchant(rawName)},${lvl}`;
				}
			}
			if (item && typeof item === 'object') {
				return walk(item);
			}
			return item;
		});
	}

	if (obj && typeof obj === 'object') {
		for (const key of Object.keys(obj)) {
			obj[key] = walk(obj[key]);
		}
	}
	return obj;
}

function processAll() {
	const files = fs
		.readdirSync(RAW_DIR)
		.filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));

	if (files.length === 0) {
		console.log('📂 No .yml files found in the raw folder.');
		return;
	}

	files.forEach((file) => {
		const rawPath = path.join(RAW_DIR, file);
		const outPath = path.join(PROCESSED_DIR, file);
		const archPath = path.join(ARCHIVE_DIR, file);

		try {
			const src = fs.readFileSync(rawPath, 'utf8');
			const doc = yaml.load(src);
			const formatted = walk(doc);
			const outYaml = yaml.dump(formatted, { noRefs: true, lineWidth: 120 });

			fs.writeFileSync(outPath, outYaml, 'utf8');
			fs.renameSync(rawPath, archPath);

			console.log(
				`✅ ${file} → processed/${file}  (original moved to archived/${file})`
			);
		} catch (err) {
			console.error(`❌ Error processing file ${file}:`, err.message);
		}
	});
}

processAll();
