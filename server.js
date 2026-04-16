```javascript
// ================= FINAL CLEAN SERVER.JS =================

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

// 👉 IMPORTANT: Adjust this if your DB is in root
const DB_PATH = './virtuallab.db'; 
const JWT_SECRET = process.env.JWT_SECRET || "replace_with_secure_key";

// ================= DB INIT =================
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS hackathon_submissions (
    id TEXT PRIMARY KEY,
    email TEXT,
    candidateName TEXT,
    projectId TEXT,
    code TEXT,
    autoScore INTEGER DEFAULT 0,
    manualScore INTEGER DEFAULT 0,
    finalScore INTEGER DEFAULT 0,
    solveTime INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 1,
    feedback TEXT,
    hackathonGrade TEXT,
    submittedAt TEXT DEFAULT CURRENT_TIMESTAMP
);
`);

// ================= AUTH =================
function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

// ================= SUBMIT =================
app.post('/api/hackathon/submit', requireAuth, (req, res) => {
    try {
        const { projectId, code, solveTime = 0, attempts = 1 } = req.body;

        if (!projectId || !code) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Replace this with real evaluation later
        const autoScore = Math.floor(Math.random() * 100);

        const id = 'sub_' + Date.now();

        db.prepare(`
            INSERT INTO hackathon_submissions
            (id, email, candidateName, projectId, code, autoScore, solveTime, attempts)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            req.user.email,
            req.user.name,
            projectId,
            code,
            autoScore,
            solveTime,
            attempts
        );

        res.json({
            success: true,
            autoScore
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Submission failed' });
    }
});

// ================= MY SUBMISSIONS =================
app.get('/api/hackathon/my-submissions', requireAuth, (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT * FROM hackathon_submissions
            WHERE email=?
            ORDER BY submittedAt DESC
        `).all(req.user.email);

        res.json(rows);

    } catch (err) {
        res.status(500).json([]);
    }
});

// ================= ADMIN: GET ALL =================
app.get('/api/hackathon/all-submissions', (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT * FROM hackathon_submissions
            ORDER BY submittedAt DESC
        `).all();

        res.json(rows);

    } catch (err) {
        res.status(500).json([]);
    }
});

// ================= ADMIN: EVALUATE =================
app.post('/api/hackathon/evaluate', (req, res) => {
    try {
        const { id, manualScore = 0, feedback = "" } = req.body;

        const sub = db.prepare(`
            SELECT * FROM hackathon_submissions WHERE id=?
        `).get(id);

        if (!sub) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        // FINAL SCORE = 50% AUTO + 50% MANUAL
        const finalScore = Math.round(
            (sub.autoScore * 0.5) + (manualScore * 0.5)
        );

        db.prepare(`
            UPDATE hackathon_submissions
            SET manualScore=?, finalScore=?, feedback=?, hackathonGrade=?
            WHERE id=?
        `).run(
            manualScore,
            finalScore,
            feedback,
            JSON.stringify({ compositeScore: finalScore }),
            id
        );

        res.json({ success: true });

    } catch (err) {
        res.status(500).json({ error: 'Evaluation failed' });
    }
});

// ================= LEADERBOARD =================
app.get('/api/hackathon/leaderboard', (req, res) => {
    try {
        const rows = db.prepare(`
            SELECT * FROM hackathon_submissions
        `).all();

        const users = {};

        rows.forEach(r => {
            if (!users[r.email]) {
                users[r.email] = {
                    name: r.candidateName,
                    problems: {},
                    totalScore: 0,
                    totalTime: 0,
                    attempts: 0
                };
            }

            const user = users[r.email];

            const grade = r.hackathonGrade
                ? JSON.parse(r.hackathonGrade)
                : null;

            const score = grade?.compositeScore || r.autoScore;

            // BEST submission per problem
            if (
                !user.problems[r.projectId] ||
                user.problems[r.projectId].score < score
            ) {
                user.problems[r.projectId] = {
                    score,
                    time: r.solveTime || 0,
                    attempts: r.attempts || 1
                };
            }
        });

        // Aggregate totals
        Object.values(users).forEach(u => {
            Object.values(u.problems).forEach(p => {
                u.totalScore += p.score;
                u.totalTime += p.time;
                u.attempts += p.attempts;
            });
        });

        const leaderboard = Object.values(users)
            .sort((a, b) =>
                b.totalScore - a.totalScore ||
                a.totalTime - b.totalTime ||
                a.attempts - b.attempts
            )
            .map((u, i) => ({
                rank: i + 1,
                name: u.name,
                score: u.totalScore,
                time: u.totalTime,
                attempts: u.attempts
            }));

        res.json(leaderboard);

    } catch (err) {
        res.status(500).json([]);
    }
});

// ================= START SERVER =================
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```
