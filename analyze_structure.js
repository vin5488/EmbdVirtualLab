const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

// Find where the flex-1 container (L263) closes
// Depth after L263 = 3 (0-indexed: line 262)
// It closes when depth returns to 2
let depth = 0;
const flex1Line = 262; // 0-indexed

for (let i = 0; i <= flex1Line; i++) {
    depth += (lines[i].match(/<div[\s>]/gi) || []).length;
    depth -= (lines[i].match(/<\/div>/gi) || []).length;
}
console.log('Depth after flex-1 container:', depth); // Should be 3

const targetDepth = depth - 1; // When depth drops to 2, flex-1 is closed

for (let i = flex1Line + 1; i < lines.length; i++) {
    depth += (lines[i].match(/<div[\s>]/gi) || []).length;
    depth -= (lines[i].match(/<\/div>/gi) || []).length;
    if (depth === targetDepth) {
        console.log('flex-1 container CLOSES at L' + (i + 1) + ': ' + lines[i].trim().substring(0, 100));
        break;
    }
}
