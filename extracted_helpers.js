_field(s, camel, snake) {
                    return s[camel] !== undefined ? s[camel] : s[snake];
                },

_parseViolationLog(f(s,'violationLog','violation_log'));
                            tabSwitches += vlog.filter(v => v.reason && (v.reason.includes('Tab switch') || v.reason.includes('focus lost'))).length;
                            copyPaste += vlog.filter(v => v.reason && (v.reason.includes('Copy') || v.reason.includes('Paste') || v.reason.includes('Cut'))).length;
                        });

                        const passRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
                        return { c, subs, totalTests, passedTests, avgScore, totalViolations, tabSwitches, copyPaste, passRate },

_parseJson(f(s,'testResults','test_results'));
                        const title_ = f(s,'projectTitle','project_title') || f(s,'projectId','project_id');
                        if (!tests || !tests.length) {
                            testRows.push([
                                f(s,'candidateName','candidate_name') || s.email, s.email,
                                title_, '—', 'No test data', '—', '—'
                            ]);
                            return;
                        },

