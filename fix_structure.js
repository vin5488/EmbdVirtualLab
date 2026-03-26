const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Remove script blocks before counting
const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '');
const lines = withoutScripts.split('\n');
let depth = 0;

// Find the last place where depth drops and what it was before
let lastDrop = { line: 0, depth: 0 };
for (let i = 0; i < lines.length; i++) {
    const prev = depth;
    depth += (lines[i].match(/<div[\s>]/gi) || []).length;
    depth -= (lines[i].match(/<\/div>/gi) || []).length;
    if (depth < prev && depth > 0) {
        lastDrop = { line: i + 1, depth: depth, prev: prev };
    }
}
console.log('Last depth drop:', lastDrop);
console.log('Final depth:', depth);

// Find where the depth drops near the very end (should identify unclosed divs)
depth = 0;
for (let i = 0; i < lines.length; i++) {
    depth += (lines[i].match(/<div[\s>]/gi) || []).length;
    depth -= (lines[i].match(/<\/div>/gi) || []).length;
}

// Reset and track where we end up with non-zero depth
depth = 0;
const openDivs = [];
for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const divMatches = line.match(/<div[\s>][^>]*>/gi) || [];
    const closeMatches = line.match(/<\/div>/gi) || [];

    for (const m of divMatches) {
        openDivs.push({ line: i + 1, tag: m.substring(0, 50) });
    }
    for (let j = 0; j < closeMatches.length; j++) {
        openDivs.pop();
    }
}

console.log('\nUnclosed divs:');
openDivs.forEach(d => console.log('  L' + d.line + ': ' + d.tag));
