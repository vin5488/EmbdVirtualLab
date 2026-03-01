// Quick backend verification test
const http = require('http');

function get(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch { resolve({ status: res.statusCode, body: data }); }
            });
        }).on('error', reject);
    });
}

function post(url, payload, headers = {}) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify(payload);
        const options = {
            hostname: 'localhost', port: 8080,
            path: new URL(url).pathname,
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body), ...headers }
        };
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
                catch { resolve({ status: res.statusCode, body: data }); }
            });
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function runTests() {
    let passed = 0, failed = 0;
    const check = (label, condition, actual) => {
        if (condition) { console.log(`  ✅ ${label}`); passed++; }
        else { console.log(`  ❌ ${label} — got: ${JSON.stringify(actual)}`); failed++; }
    };

    console.log('\n=== VirtualLab Backend Verification ===\n');

    // 1. Health check
    console.log('1. Health check');
    const h = await get('http://localhost:8080/health');
    check('status 200', h.status === 200, h.status);
    check('db = sqlite', h.body.db === 'sqlite', h.body.db);
    check('has compileQueue', !!h.body.compileQueue, h.body);

    // 2. Candidate registration
    console.log('\n2. Candidate register');
    const reg = await post('http://localhost:8080/api/auth/register', { name: 'Test User', email: 'test-verify@example.com' });
    check('status 200', reg.status === 200, reg.status);
    check('got OTP', typeof reg.body.otp === 'string' && reg.body.otp.length === 6, reg.body);
    const otp = reg.body.otp;

    // 3. Verify OTP and get JWT
    console.log('\n3. OTP verify → JWT');
    const verify = await post('http://localhost:8080/api/auth/verify', { email: 'test-verify@example.com', otp });
    check('status 200', verify.status === 200, verify.status);
    check('got token', typeof verify.body.token === 'string', verify.body);
    const token = verify.body.token;

    // 4. Admin login
    console.log('\n4. Admin login');
    const admin = await post('http://localhost:8080/api/auth/admin-login', { id: 'admin', pass: 'admin123' });
    check('status 200', admin.status === 200, admin.status);
    check('got admin token', typeof admin.body.token === 'string', admin.body);
    check('role is admin', admin.body.user && admin.body.user.role === 'admin', admin.body.user);
    const adminToken = admin.body.token;

    // 5. Wrong admin password
    console.log('\n5. Wrong admin creds → blocked');
    const badAdmin = await post('http://localhost:8080/api/auth/admin-login', { id: 'admin', pass: 'wrongpass' });
    check('status 401', badAdmin.status === 401, badAdmin.status);

    // 6. Admin-only route without token → 401
    console.log('\n6. /api/users without token → 401');
    const noAuth = await get('http://localhost:8080/api/users');
    check('status 401', noAuth.status === 401, noAuth.status);

    // 7. /api/submissions with candidate token → 403
    console.log('\n7. /api/submissions with candidate token → 403');
    const candAuth = await get('http://localhost:8080/api/submissions');
    check('not 200 (unauthorized)', candAuth.status !== 200, candAuth.status);

    // 8. Compile C code
    console.log('\n8. Compile C code');
    const compile = await post('http://localhost:8080/compile', {
        source_code: '#include<stdio.h>\nint main(){printf("hello backend");return 0;}',
        stdin: ''
    });
    check('status 200', compile.status === 200, compile.status);
    check('stdout matches', (compile.body.stdout || '').trim() === 'hello backend', compile.body.stdout);

    // 9. Save progress (with token)
    console.log('\n9. Save progress with JWT');
    const saveProg = await post('http://localhost:8080/api/progress/save', {
        projectId: 'C_INT-01',
        files: [{ name: 'main.c', content: '// test' }],
        solved: false
    }, { Authorization: 'Bearer ' + token });
    check('progress saved', saveProg.status === 200 && saveProg.body.success, saveProg.body);

    // 10. Load progress
    console.log('\n10. Load progress with JWT');
    const loadProg = await new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost', port: 8080, path: '/api/progress/C_INT-01', method: 'GET',
            headers: { Authorization: 'Bearer ' + token }
        };
        http.request(options, (res) => {
            let data = '';
            res.on('data', d => data += d);
            res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
        }).on('error', reject).end();
    });
    check('found = true', loadProg.body.found === true, loadProg.body);
    check('files correct', loadProg.body.files && loadProg.body.files[0].name === 'main.c', loadProg.body);

    // Summary
    console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
}

runTests().catch(console.error);
