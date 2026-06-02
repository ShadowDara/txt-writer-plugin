const fs = require("fs");
const path = require("path");

const BUILD_DIR = process.argv[2] || "./";
const OUTPUT_DIR = path.join(BUILD_DIR, "export");

// Dateien, die Obsidian Plugin braucht
const FILES_TO_COPY = [
	"main.js",
	"manifest.json",
	"styles.css"
];

function ensureDir(dir) {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}
}

function copyFile(file) {
	const src = path.join(BUILD_DIR, file);
	const dest = path.join(OUTPUT_DIR, file);

	if (!fs.existsSync(src)) {
		console.warn("Missing:", file);
		return;
	}

	fs.copyFileSync(src, dest);
	console.log("Copied:", file);
}

function main() {
	ensureDir(OUTPUT_DIR);

	console.log("Exporting Obsidian plugin build...\n");

	for (const file of FILES_TO_COPY) {
		copyFile(file);
	}

	console.log("\nDone →", OUTPUT_DIR);
}

main();
