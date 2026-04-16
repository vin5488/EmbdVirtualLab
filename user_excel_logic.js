_buildExcelReport(submissions, title) {
                    if (typeof XLSX === 'undefined') {
                        alert('Excel library not loaded. Please refresh the page.');
                        return;
                    }
                    const wb = XLSX.utils.book_new();
                    const f = (s, c, k) => this._field(s, c, k);

                    // ── Collect candidate list ─────────────────────────────
                    const candidateMap = {};
                    submissions.forEach(s => {
                        const email = s.email;
                        const name = f(s,'candidateName','candidate_name') || email;
                        if (!candidateMap[email]) candidateMap[email] = { name, email, subs: [] };
                        candidateMap[email].subs.push(s);
                    });
                    const candidates = Object.values(candidateMap);

                    // ══════════════════════════════════════════════════════
                    // SHEET 1: Candidate Summary
                    // ══════════════════════════════════════════════════════
                    const summaryRows = [[
                        'Rank', 'Candidate Name', 'Email',
                        'Problems Submitted', 'Total Tests Passed', 'Total Tests',
                        'Pass Rate %', 'Avg Score %',
                        'Total Violations', 'Tab Switches', 'Copy/Paste Attempts',
                        'Status'
                    ]];

                    const ranked = candidates.map(c => {
                        const subs = c.subs;
                        const totalTests = subs.reduce((a, s) => a + (f(s,'testsTotal','tests_total') || 0), 0);
                        const passedTests = subs.reduce((a, s) => a + (f(s,'testsPassed','tests_passed') || 0), 0);
                        const avgScore = subs.length ? Math.round(subs.reduce((a, s) => a + (f(s,'autoScore','auto_score') || 0), 0) / subs.length) : 0;
                        const totalViolations = subs.reduce((a, s) => a + (f(s,'violationCount','violation_count') || 0), 0);

                        let tabSwitches = 0, copyPaste = 0;
                        subs.forEach(s => {
                            const vlog = this._parseViolationLog(f(s,'violationLog','violation_log'));
                            tabSwitches += vlog.filter(v => v.reason && (v.reason.includes('Tab switch') || v.reason.includes('focus lost'))).length;
                            copyPaste += vlog.filter(v => v.reason && (v.reason.includes('Copy') || v.reason.includes('Paste') || v.reason.includes('Cut'))).length;
                        });

                        const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
                        return { c, subs, totalTests, passedTests, avgScore, totalViolations, tabSwitches, copyPaste, passRate };
                    }).sort((a, b) => b.avgScore - a.avgScore);

                    ranked.forEach((r, i) => {
                        summaryRows.push([
                            i + 1,
                            r.c.name,
                            r.c.email,
                            r.subs.length,
                            r.passedTests,
                            r.totalTests,
                            r.passRate + '%',
                            r.avgScore + '%',
                            r.totalViolations,
                            r.tabSwitches,
                            r.copyPaste,
                            r.totalViolations >= 10 ? '🚨 High Risk' : r.totalViolations >= 3 ? '⚠️ Warning' : '✅ Clean'
                        ]);
                    });

                    const ws1 = XLSX.utils.aoa_to_sheet(summaryRows);
                    ws1['!cols'] = [
                        { wch: 6 }, { wch: 25 }, { wch: 35 }, { wch: 18 }, { wch: 16 },
                        { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 16 }, { wch: 14 },
                        { wch: 20 }, { wch: 14 }
                    ];
                    XLSX.utils.book_append_sheet(wb, ws1, 'Candidate Summary');

                    // ══════════════════════════════════════════════════════
                    // SHEET 2: Problem-wise Breakdown
                    // ══════════════════════════════════════════════════════
                    const probRows = [[
                        'Candidate Name', 'Email', 'Problem ID', 'Problem Title',
                        'Score %', 'Tests Passed', 'Tests Total', 'Pass Rate %',
                        'Violations on Problem', 'Submitted At', 'Status'
                    ]];

                    submissions.forEach(s => {
                        const vlog = this._parseViolationLog(f(s,'violationLog','violation_log'));
                        const title_ = f(s,'projectTitle','project_title') || f(s,'projectId','project_id');
                        const probViolations = vlog.filter(v => v.problem === title_).length;
                        const totalTests = f(s,'testsTotal','tests_total') || 0;
                        const passedTests = f(s,'testsPassed','tests_passed') || 0;
                        const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
                        const submittedAt = f(s,'submittedAt','submitted_at');
                        probRows.push([
                            f(s,'candidateName','candidate_name') || s.email,
                            s.email,
                            f(s,'projectId','project_id') || '—',
                            title_ || '—',
                            f(s,'autoScore','auto_score') || 0,
                            passedTests,
                            totalTests,
                            passRate + '%',
                            probViolations,
                            submittedAt ? new Date(submittedAt).toLocaleString() : '—',
                            s.status || '—'
                        ]);
                    });

                    const ws2 = XLSX.utils.aoa_to_sheet(probRows);
                    ws2['!cols'] = [
                        { wch: 25 }, { wch: 35 }, { wch: 16 }, { wch: 40 },
                        { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 12 },
                        { wch: 20 }, { wch: 22 }, { wch: 12 }
                    ];
                    XLSX.utils.book_append_sheet(wb, ws2, 'Problem Breakdown');

                    // ══════════════════════════════════════════════════════
                    // SHEET 3: Test Case Details
                    // ══════════════════════════════════════════════════════
                    const testRows = [[
                        'Candidate Name', 'Email', 'Problem Title', 'Test Case Name', 'Result', 'Expected Output', 'Actual Output'
                    ]];

                    submissions.forEach(s => {
                        const tests = this._parseJson(f(s,'testResults','test_results'));
                        const title_ = f(s,'projectTitle','project_title') || f(s,'projectId','project_id');
                        if (!tests || !tests.length) {
                            testRows.push([
                                f(s,'candidateName','candidate_name') || s.email, s.email,
                                title_, '—', 'No test data', '—', '—'
                            ]);
                            return;
                        }
                        tests.forEach(t => {
                            testRows.push([
                                f(s,'candidateName','candidate_name') || s.email,
                                s.email,
                                title_,
                                t.name || '—',
                                t.passed ? 'PASS' : 'FAIL',
                                t.expectedOutput || t.expected || '—',
                                t.actualOutput || t.output || t.actual || '—'
                            ]);
                        });
                    });

                    const ws3 = XLSX.utils.aoa_to_sheet(testRows);
                    ws3['!cols'] = [
                        { wch: 25 }, { wch: 35 }, { wch: 40 }, { wch: 30 },
                        { wch: 10 }, { wch: 30 }, { wch: 30 }
                    ];
                    XLSX.utils.book_append_sheet(wb, ws3, 'Test Case Details');

                    // ══════════════════════════════════════════════════════
                    // SHEET 4: Violations Log
                    // ══════════════════════════════════════════════════════
                    const violRows = [[
                        'Candidate Name', 'Email', 'Violation #', 'Timestamp',
                        'Violation Type', 'Problem / Context', 'Severity'
                    ]];

                    let hasViolations = false;
                    submissions.forEach(s => {
                        const vlog = this._parseViolationLog(f(s,'violationLog','violation_log'));
                        if (!vlog.length) return;
                        hasViolations = true;
                        vlog.forEach((v, i) => {
                            const reason = v.reason || '—';
                            let severity = 'Low';
                            if (reason.includes('Tab switch') || reason.includes('focus lost')) severity = 'Medium';
                            if (reason.includes('Copy') || reason.includes('Paste') || reason.includes('Cut')) severity = 'High';
                            if (reason.includes('DevTools')) severity = 'Critical';
                            violRows.push([
                                f(s,'candidateName','candidate_name') || s.email,
                                s.email,
                                i + 1,
                                v.time || '—',
                                reason,
                                v.problem || f(s,'projectTitle','project_title') || '—',
                                severity
                            ]);
                        });
                    });

                    if (!hasViolations) {
                        violRows.push(['No violations recorded', '', '', '', '', '', '']);
                    }

                    const ws4 = XLSX.utils.aoa_to_sheet(violRows);
                    ws4['!cols'] = [
                        { wch: 25 }, { wch: 35 }, { wch: 12 }, { wch: 20 },
                        { wch: 40 }, { wch: 35 }, { wch: 12 }
                    ];
                    XLSX.utils.book_append_sheet(wb, ws4, 'Violations Log');

                    // ── Save file ──────────────────────────────────────────
                    const date = new Date().toISOString().slice(0, 10);
                    XLSX.writeFile(wb, `${title}_${date}.xlsx`);
                }