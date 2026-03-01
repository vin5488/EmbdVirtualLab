#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════
// VirtualLab — Client Instance Creator
// Usage:  node scripts/create-client.js
// Or:     node scripts/create-client.js --name acme --port 8081 --topics C_INT,C_ADV
// ═══════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const crypto = require('crypto');

// ── All available topic IDs ──────────────────────────────
const TOPICS = {
    C_INT: 'Intermediate C (Pointers, Bit Manipulation, Algorithms)',
    C_ADV: 'Advanced C (Data Structures, Memory Management)',
    CPP_INT: 'Intermediate C++ (OOP, STL, Templates)',
    CPP_ADV: 'Advanced C++ (Design Patterns, Modern C++)',
    MCU_SIM: 'MCU Simulations (STM32, Bare-Metal)',
    MCU_SIM_RP2040: 'RP2040 Hardware Emulation',
    MBD_FUND: 'MBD Fundamentals (Simulink-style blocks)',
    MBD_ADV: 'Advanced MBD & AUTOSAR (ECU, UDS)',
};

// ── CLI argument shortcut ────────────────────────────────
const args = {};
process.argv.slice(2).forEach((a, i, arr) => {
    if (a.startsWith('--')) args[a.slice(2)] = arr[i + 1] || '';
});

const ROOT = path.resolve(__dirname, '..');
const CLIENTS = path.join(ROOT, 'clients');

// ── Helpers ──────────────────────────────────────────────
function genSecret(len = 48) {
    return crypto.randomBytes(len).toString('hex');
}

function slug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function ask(rl, question, defaultVal = '') {
    return new Promise(resolve => {
        const hint = defaultVal ? ` [${defaultVal}]` : '';
        rl.question(`${question}${hint}: `, ans => {
            resolve(ans.trim() || defaultVal);
        });
    });
}

async function listClients() {
    if (!fs.existsSync(CLIENTS)) { console.log('No clients yet.'); return; }
    const dirs = fs.readdirSync(CLIENTS).filter(d =>
        fs.existsSync(path.join(CLIENTS, d, '.env'))
    );
    if (!dirs.length) { console.log('No clients yet.'); return; }
    console.log('\n📋  Existing clients:');
    dirs.forEach(d => {
        const env = fs.readFileSync(path.join(CLIENTS, d, '.env'), 'utf8');
        const port = (env.match(/^PORT=(.+)/m) || [])[1] || '?';
        const title = (env.match(/^PLATFORM_TITLE=(.+)/m) || [])[1] || d;
        const filter = (env.match(/^TOPIC_FILTER=(.+)/m) || [])[1] || 'ALL';
        console.log(`  • ${d.padEnd(20)} port: ${port.padEnd(6)} title: ${title}  topics: ${filter}`);
    });
    console.log('');
}

// ── Main ────────────────────────────────────────────────
async function main() {
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║   VirtualLab — Client Instance Creator   ║');
    console.log('╚══════════════════════════════════════════╝\n');

    await listClients();

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

    // ── 1. Client name ──
    let name = args.name;
    if (!name) name = await ask(rl, '1. Client name (e.g. acme, infosys-batch1)', 'client1');
    name = slug(name);
    const clientDir = path.join(CLIENTS, name);

    if (fs.existsSync(clientDir)) {
        const overwrite = await ask(rl, `   ⚠️  Client "${name}" already exists. Overwrite?`, 'no');
        if (!overwrite.startsWith('y')) { console.log('Aborted.'); rl.close(); return; }
    }

    // ── 2. Port ──
    let port = args.port;
    if (!port) port = await ask(rl, '2. HTTP port for this instance', '8081');

    // ── 3. Topics ──
    console.log('\n3. Select topics (space to toggle, enter to confirm)');
    console.log('   Available:');
    Object.entries(TOPICS).forEach(([id, desc]) => {
        console.log(`     ${id.padEnd(18)} — ${desc}`);
    });

    let topicFilter = args.topics || '';
    if (!topicFilter) {
        topicFilter = await ask(rl,
            '   Enter topic IDs (comma-separated, leave blank for ALL)',
            ''
        );
    }
    // Validate
    const topicIds = topicFilter
        .split(',').map(t => t.trim()).filter(Boolean)
        .filter(t => {
            if (!TOPICS[t]) { console.log(`   ⚠️  Unknown topic "${t}", skipping.`); return false; }
            return true;
        });

    // ── 4. Branding ──
    console.log('');
    const title = await ask(rl, '4. Platform title (shown in browser tab)', `${name} VirtualLab`);
    const subtitle = await ask(rl, '   Subtitle', 'Embedded Coding Platform');

    // ── 5. Admin credentials ──
    console.log('');
    const adminEmail = await ask(rl, '5. Admin email', `admin@${name}.com`);
    const adminPass = await ask(rl, '   Admin password', 'Admin@123');

    // ── 6. Whitelist ──
    const whitelistEnabled = await ask(rl, '6. Enable email whitelist? (yes/no)', 'yes');

    // ── 7. SMTP (optional) ──
    console.log('');
    console.log('7. SMTP settings (leave blank to skip / configure later)');
    const smtpHost = await ask(rl, '   SMTP Host', '');
    const smtpPort = await ask(rl, '   SMTP Port', '587');
    const smtpUser = await ask(rl, '   SMTP User', '');
    const smtpPass = await ask(rl, '   SMTP Pass', '');
    const smtpFrom = await ask(rl, '   SMTP From', `"${title}" <noreply@${name}.com>`);

    rl.close();

    // ── Generate files ──────────────────────────────────
    fs.mkdirSync(clientDir, { recursive: true });
    fs.mkdirSync(path.join(clientDir, 'data'), { recursive: true });

    const jwtSecret = genSecret();
    const envContent = `# VirtualLab — Client: ${name}
# Generated: ${new Date().toISOString()}

# Server
PORT=${port}
WORKERS=2
MAX_COMPILES=8
NODE_ENV=production
DEBUG_AUTH=false

# Security
JWT_SECRET=${jwtSecret}

# Admin
ADMIN_EMAILS=${adminEmail}
ADMIN_PASS=${adminPass}

# Database
DB_PATH=/app/data/${name}.db

# Whitelist
ENABLE_WHITELIST=${whitelistEnabled.startsWith('y') ? 'true' : 'false'}

# Topic Filter (blank = show all)
TOPIC_FILTER=${topicIds.join(',')}

# Branding
PLATFORM_TITLE=${title}
PLATFORM_SUBTITLE=${subtitle}

# SMTP
SMTP_HOST=${smtpHost}
SMTP_PORT=${smtpPort}
SMTP_USER=${smtpUser}
SMTP_PASS=${smtpPass}
SMTP_FROM=${smtpFrom}
`;

    const composeContent = `version: '3.8'
# VirtualLab — Client: ${name}
# Start this instance:  docker compose -f clients/${name}/docker-compose.yml up -d

services:
  virtuallab-${name}:
    build:
      context: ../..
      dockerfile: Dockerfile
    container_name: vlab-${name}
    ports:
      - "${port}:8080"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
    volumes:
      - ${name}_db:/app/data
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
        reservations:
          cpus: '0.5'
          memory: 512M
    restart: always
    healthcheck:
      test: ["CMD", "node", "-e", "const http=require('http');http.get('http://localhost:8080/health',(r)=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s

volumes:
  ${name}_db:
    driver: local
`;

    const readmeContent = `# ${title} — VirtualLab Instance

**Client:** ${name}  
**Port:** ${port}  
**Topics:** ${topicIds.length ? topicIds.join(', ') : 'ALL'}  
**Admin:** ${adminEmail}  
**Created:** ${new Date().toLocaleString()}

## Start

\`\`\`bash
# From the project root:
docker compose -f clients/${name}/docker-compose.yml up -d
\`\`\`

## Access
- Platform: http://localhost:${port}
- Health:   http://localhost:${port}/health

## Update .env
Edit \`clients/${name}/.env\` and restart the container.

## Add candidates to whitelist
\`\`\`bash
node scripts/populate-whitelist.js clients/${name}/.env
\`\`\`
`;

    fs.writeFileSync(path.join(clientDir, '.env'), envContent);
    fs.writeFileSync(path.join(clientDir, 'docker-compose.yml'), composeContent);
    fs.writeFileSync(path.join(clientDir, 'README.md'), readmeContent);

    console.log('\n✅  Client instance created!\n');
    console.log(`   📁 Location:   clients/${name}/`);
    console.log(`   🌐 Port:       ${port}`);
    console.log(`   📚 Topics:     ${topicIds.length ? topicIds.join(', ') : 'ALL'}`);
    console.log(`   🔑 Admin:      ${adminEmail} / ${adminPass}`);
    console.log('');
    console.log('   ▶  To start this instance:');
    console.log(`      docker compose -f clients/${name}/docker-compose.yml up -d`);
    console.log('');
    console.log('   📋  To list all clients:');
    console.log('      node scripts/create-client.js --list');
    console.log('');
}

// ── Entry point ─────────────────────────────────────────
if (args.list !== undefined) {
    listClients().then(() => process.exit(0));
} else {
    main().catch(e => { console.error(e); process.exit(1); });
}
