import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignoredDirectories = new Set(['.git', '.claude', '.vscode', 'node_modules']);
const files = [];

function collect(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const fullPath = path.join(directory, entry.name);
        if (entry.isDirectory() && !ignoredDirectories.has(entry.name)) collect(fullPath);
        else if (entry.isFile()) files.push(fullPath);
    }
}

collect(root);

const missing = [];
let checked = 0;

function matchesCase(target) {
    const relative = path.relative(root, target);
    if (relative.startsWith('..') || path.isAbsolute(relative)) return false;
    let directory = root;
    for (const segment of relative.split(path.sep)) {
        if (!fs.readdirSync(directory).includes(segment)) return false;
        directory = path.join(directory, segment);
    }
    return true;
}

function checkReference(source, base, reference) {
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(reference) || reference.includes('${')) return;
    const clean = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    if (!clean) return;

    const target = path.resolve(clean.startsWith('/') ? root : base, clean.replace(/^\//, ''));
    const resolved = fs.existsSync(target) && fs.statSync(target).isDirectory()
        ? path.join(target, 'index.html') : target;
    checked++;
    if (!fs.existsSync(resolved) || !matchesCase(resolved)) {
        missing.push(`${path.relative(root, source)} → ${reference}`);
    }
}

for (const file of files) {
    const extension = path.extname(file).toLowerCase();
    if (!['.html', '.css', '.js'].includes(extension)) continue;
    const content = fs.readFileSync(file, 'utf8');
    const base = path.dirname(file);
    let match;

    if (extension === '.html') {
        const attribute = /\b(?:href|src|poster)\s*=\s*["']([^"']+)["']/gi;
        while ((match = attribute.exec(content))) checkReference(file, base, match[1]);
    }

    if (extension === '.css') {
        const cssUrl = /url\(\s*["']?([^"')]+)["']?\s*\)|@import\s+["']([^"']+)["']/gi;
        while ((match = cssUrl.exec(content))) checkReference(file, base, match[1] || match[2]);
    }

    if (extension === '.js') {
        // Caminhos de mídia no JavaScript são relativos à página que carrega o script.
        const pageBase = path.basename(base) === 'js' ? path.dirname(base) : base;
        const media = /["']((?:\.\.\/|\.\/)*(?:images|assets)\/[^"']+\.(?:png|jpe?g|webp|gif|svg|mp4|webm|glb|pdf))["']/gi;
        while ((match = media.exec(content))) checkReference(file, pageBase, match[1]);
    }
}

if (missing.length) {
    console.error(`Encontrados ${missing.length} caminhos locais ausentes:\n${missing.join('\n')}`);
    process.exitCode = 1;
} else {
    console.log(`OK: ${checked} caminhos locais conferidos.`);
}
