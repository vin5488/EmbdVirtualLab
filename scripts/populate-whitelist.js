const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'virtuallab.db');
const db = new Database(DB_PATH);

const testEmails = ['test@example.com', 'candidate1@example.com'];

console.log('--- Whitelisting Users ---');
const stmt = db.prepare("INSERT OR IGNORE INTO whitelist (email, role) VALUES (?, 'candidate')");

testEmails.forEach(email => {
    stmt.run(email);
    console.log(`Whitelisted: ${email}`);
});

console.log('Done.');
db.close();
