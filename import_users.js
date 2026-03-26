// ═══════════════════════════════════════════════════════
// import_users.js — Bulk import Participants_List.csv
//                   into the VirtualLab whitelist table
//
// Usage:  node import_users.js
//   (run this from the same folder as your server.js)
// ═══════════════════════════════════════════════════════

const fs      = require('fs');
const path    = require('path');
const Database = require('better-sqlite3');
require('dotenv').config();

// ── Config ───────────────────────────────────────────
const CSV_PATH = path.join(__dirname, 'Participants_List.csv');
const DB_PATH  = process.env.DB_PATH || path.join(__dirname, 'data', 'virtuallab.db');
const ROLE     = 'candidate'; // change to 'admin' if needed
// ─────────────────────────────────────────────────────

// 1. Read & parse CSV
if (!fs.existsSync(CSV_PATH)) {
    console.error(`❌  CSV not found at: ${CSV_PATH}`);
    process.exit(1);
}

const lines = fs.readFileSync(CSV_PATH, 'utf8')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);

// Skip header row
const header = lines[0].toLowerCase();
if (!header.includes('mailid') && !header.includes('email')) {
    console.error('❌  Could not find a MailID/email column in the CSV header.');
    process.exit(1);
}

const users = [];
for (let i = 1; i < lines.length; i++) {
    // Handle quoted fields like: "Doe, John (J.D.)",jdoe@visteon.com
    const line = lines[i];
    let name, email;

    if (line.startsWith('"')) {
        // Quoted name field
        const closingQuote = line.indexOf('"', 1);
        name  = line.substring(1, closingQuote).trim();
        email = line.substring(closingQuote + 2).trim(); // skip closing quote + comma
    } else {
        const parts = line.split(',');
        name  = parts[0].trim();
        email = parts[1]?.trim();
    }

    if (!email || !email.includes('@')) {
        console.warn(`⚠️   Skipping line ${i + 1} — invalid email: "${email}"`);
        continue;
    }

    users.push({ name, email: email.toLowerCase() });
}

if (users.length === 0) {
    console.error('❌  No valid users found in CSV.');
    process.exit(1);
}

// 2. Open DB and insert
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

const insertWhitelist = db.prepare(`
    INSERT INTO whitelist (email, role)
    VALUES (@email, @role)
    ON CONFLICT(email) DO UPDATE SET role = @role
`);

const insertUser = db.prepare(`
    INSERT INTO users (name, email)
    VALUES (@name, @email)
    ON CONFLICT(email) DO UPDATE SET name = @name
`);

const importAll = db.transaction((users) => {
    let inserted = 0, updated = 0;
    for (const u of users) {
        const existing = db.prepare('SELECT email FROM whitelist WHERE email = ?').get(u.email);
        insertWhitelist.run({ email: u.email, role: ROLE });
        insertUser.run({ name: u.name, email: u.email });
        if (existing) updated++; else inserted++;
    }
    return { inserted, updated };
});

console.log(`\n📋  Found ${users.length} users in CSV`);
console.log(`🗄️   Database: ${DB_PATH}\n`);

try {
    const { inserted, updated } = importAll(users);
    console.log(`✅  Done!`);
    console.log(`   • ${inserted} new users added to whitelist`);
    console.log(`   • ${updated} existing users updated`);
    console.log(`\n💡  Make sure ENABLE_WHITELIST=true is set in your .env\n`);
} catch (err) {
    console.error('❌  Import failed:', err.message);
    process.exit(1);
} finally {
    db.close();
}
