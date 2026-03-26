// add_users.js — Adds 2 specific users to the whitelist
// Usage: node add_users.js

const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'virtuallab.db');
const db = new Database(DB_PATH);

const users = [
    { name: 'Candidate One', email: 'candidate@visteon.com', role: 'candidate' },
    { name: 'Shilpa',                   email: 'shilpa@skill-lync.com',                role: 'candidate' }
];

const insertWhitelist = db.prepare(`
    INSERT INTO whitelist (email, role)
    VALUES (?, ?)
    ON CONFLICT(email) DO UPDATE SET role = ?
`);

const insertUser = db.prepare(`
    INSERT INTO users (name, email, role)
    VALUES (?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET name = ?, role = ?
`);

const run = db.transaction(() => {
    for (const u of users) {
        insertWhitelist.run(u.email, u.role, u.role);
        insertUser.run(u.name, u.email, u.role, u.name, u.role);
        console.log(`✅  Added: ${u.email}`);
    }
});

run();
console.log('\n✔  Both users can now log in using their email + OTP.\n');
db.close();
