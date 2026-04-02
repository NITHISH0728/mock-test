import { API_BASE_URL } from '../../config';
import { useState, useEffect } from 'react';

const Performance = () => {
    const [results, setResults] = useState<any[]>([]);
    const [tests, setTests] = useState<any[]>([]);
    const [filterTest, setFilterTest] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDept, setFilterDept] = useState('');
    const [filterSec, setFilterSec] = useState('');
    const [viewModal, setViewModal] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
        fetchTests();
    }, []);

    useEffect(() => {
        fetchResults();
    }, [filterTest]);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const url = filterTest
                ? `${API_BASE_URL}/api/results?test_id=${filterTest}`
                : `${API_BASE_URL}/api/results`;
            const res = await fetch(url);
            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch results:', err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTests = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/tests`);
            const data = await res.json();
            setTests(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch tests:', err);
        }
    };

    const handleDownloadCSV = async () => {
        try {
            const url = filterTest
                ? `${API_BASE_URL}/api/results/csv?test_id=${filterTest}`
                : `${API_BASE_URL}/api/results/csv`;
            const res = await fetch(url);

            if (!res.ok) {
                const err = await res.json();
                alert(err.message || 'No results to download.');
                return;
            }

            const blob = await res.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'test_results.csv';
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (err) {
            alert('Failed to download CSV.');
        }
    };

    const formatDate = (dateStr: any) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const uniqueDepartments = Array.from(new Set(results.map((r: any) => r.student_department).filter(Boolean)));
    const uniqueSections = Array.from(new Set(results.map((r: any) => r.student_section).filter(Boolean)));

    const filteredResults = results.filter((r: any) => {
        const query = searchQuery.toLowerCase();
        const matchesSearch = !query || 
            (r.student_name || '').toLowerCase().includes(query) ||
            (r.student_email || '').toLowerCase().includes(query) ||
            (r.reg_no || '').toLowerCase().includes(query);
            
        const matchesDept = filterDept ? String(r.student_department) === String(filterDept) : true;
        const matchesSec = filterSec ? String(r.student_section) === String(filterSec) : true;
        
        return matchesSearch && matchesDept && matchesSec;
    }).sort((a: any, b: any) => {
        if (a.test_title === b.test_title) {
            return (b.score || 0) - (a.score || 0);
        }
        return (a.test_title || '').localeCompare(b.test_title || '');
    });

    return (
        <div>
            <div className="admin-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h1 className="admin-greeting">Performance</h1>
                    <p className="admin-greeting-sub">Track student test results and export data.</p>
                </div>
                <button className="admin-btn admin-btn-primary" onClick={handleDownloadCSV}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download CSV
                </button>
            </div>

            {/* Filter */}
            <div className="admin-toolbar" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <input 
                    type="text" 
                    className="admin-form-input" 
                    placeholder="Search name, email, or reg no..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ flex: 1, minWidth: '250px' }}
                />
                <select
                    className="admin-filter-select"
                    value={filterTest}
                    onChange={(e) => setFilterTest(e.target.value)}
                >
                    <option value="">All Tests</option>
                    {tests.map((t: any) => (
                        <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                </select>
                <select className="admin-filter-select" value={filterDept} onChange={(e) => setFilterDept(e.target.value)}>
                    <option value="">All Departments</option>
                    {uniqueDepartments.map(d => <option key={d as string} value={d as string}>{d as string}</option>)}
                </select>
                <select className="admin-filter-select" value={filterSec} onChange={(e) => setFilterSec(e.target.value)}>
                    <option value="">All Sections</option>
                    {uniqueSections.map(s => <option key={s as string} value={s as string}>{s as string}</option>)}
                </select>
            </div>

            {/* Results Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Reg No</th>
                            <th>Test Name</th>
                            <th>Type</th>
                            <th>Score</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>Loading...</td></tr>
                        ) : filteredResults.length === 0 ? (
                            <tr>
                                <td colSpan={10}>
                                    <div className="admin-empty-state">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                                        <p>No results found. Results will appear here once students complete their tests.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : results.map((r, i) => (
                            <tr key={r.id}>
                                <td>{i + 1}</td>
                                <td style={{ fontWeight: 600 }}>{r.student_name}</td>
                                <td>{r.student_email}</td>
                                <td>{r.reg_no || '-'}</td>
                                <td>{r.test_title}</td>
                                <td>
                                    <span className={`admin-badge ${r.test_type === 'quiz' ? 'admin-badge-quiz' : 'admin-badge-code'}`}>
                                        {r.test_type}
                                    </span>
                                </td>
                                <td style={{ fontWeight: 700 }}>{r.score}/{r.total_marks}</td>
                                <td>
                                    <span className={`admin-badge ${r.status === 'completed' ? 'admin-badge-published' : 'admin-badge-draft'}`}>
                                        {r.status}
                                    </span>
                                </td>
                                <td>{formatDate(r.submitted_at)}</td>
                                <td>
                                    <button 
                                        className="admin-btn" 
                                        style={{ padding: '4px 12px', fontSize: '12px', background: 'transparent', border: '1px solid #E2E8F0', color: '#0F172A' }}
                                        onClick={() => setViewModal(r)}
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Modal */}
            {viewModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
                }}>
                    <div style={{
                        background: '#FFFFFF', borderRadius: '12px', padding: '32px',
                        maxWidth: '500px', width: '90%', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{ marginTop: 0, color: '#0F172A', fontSize: '20px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
                            Student Test Report
                        </h2>
                        
                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Student Detail</div>
                                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>{viewModal.student_name}</div>
                                <div style={{ fontSize: '14px', color: '#475569', marginTop: '4px' }}>{viewModal.student_email} • {viewModal.reg_no}</div>
                                <div style={{ fontSize: '14px', color: '#475569', marginTop: '4px' }}>{viewModal.student_department} - Section {viewModal.student_section}</div>
                            </div>
                            
                            <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Test Detail</div>
                                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>{viewModal.test_title}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <div style={{ fontSize: '14px', color: '#475569' }}>Type: <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{viewModal.test_type}</span></div>
                                    <div style={{ fontSize: '14px', color: '#475569' }}>Status: <span style={{ textTransform: 'capitalize', fontWeight: 500, color: viewModal.status === 'completed' ? '#10B981' : '#EF4444' }}>{viewModal.status}</span></div>
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Questions Attended</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#3B82F6', marginTop: '8px' }}>{viewModal.total_questions || '-'}</div>
                                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>out of {viewModal.total_questions || '-'}</div>
                                </div>
                                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Total Points</div>
                                    <div style={{ fontSize: '24px', fontWeight: 700, color: '#10B981', marginTop: '8px' }}>{viewModal.score}</div>
                                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '4px' }}>out of {viewModal.total_marks}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
                            <button className="admin-btn" style={{ background: '#F1F5F9', color: '#64748B', border: 'none', cursor: 'pointer', padding: '10px 24px', borderRadius: '8px', fontWeight: 600 }} onClick={() => setViewModal(null)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Performance;
