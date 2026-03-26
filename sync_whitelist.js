const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const csvPath = 'C:/Users/Vinay/Downloads/embedded-coding-challenge-platform/Participants.csv';
const dbPath = 'C:/Users/Vinay/Downloads/embedded-coding-challenge-platform/data/virtuallab.db';

if (!fs.existsSync(csvPath)) {
    console.error('CSV not found');
    process.exit(1);
}

const content = fs.readFileSync(csvPath, 'utf8');
const emails = content.match(/[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+/g) || [];

console.log(`Found ${emails.length} emails in CSV.`);

const db = new Database(dbPath);

const insert = db.prepare('INSERT OR IGNORE INTO whitelist (email, role) VALUES (?, ?)');

const transaction = db.transaction((emails) => {
    for (const email of emails) {
        insert.run(email.trim().toLowerCase(), 'candidate');
    }
});

transaction(emails);

console.log('Whitelist populated successfully.');
db.close();
