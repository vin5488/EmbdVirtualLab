async downloadAllReports() {
                    if (!this.allSubmissions.length) { alert('No submissions to export.'); return; }
                    this.successToast = '⏳ Building Excel report…';
                    // Enrich all submissions with full violation_log
                    const enriched = await Promise.all(this.allSubmissions.map(async s => {
                        if (s.violationLog || s.violation_log) return s;
                        try {
                            const r = await fetch('/api/submission/' + s.id, { headers: this._authHeaders() });
                            const detail = await r.json();
                            return { ...s, violation_log: detail.violation_log, test_results: detail.test_results };
                        } catch { return s; }
                    }));
                    this.successToast = '';
                    this._buildExcelReport(enriched, 'VisteonVirtualLab_AllCandidates');
                }