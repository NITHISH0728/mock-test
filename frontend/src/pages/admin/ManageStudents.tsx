import { API_BASE_URL } from '../../config';
import { useState, useEffect } from 'react';

const DEPARTMENTS = ['', 'CSE', 'ECE', 'EEE', 'MECH', 'IT', 'AIDS', 'AIML'];
const SECTIONS = ['', 'A', 'B', 'C'];

const ManageStudents = () => {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [department, setDepartment] = useState('');
    const [classSection, setClassSection] = useState('');
    const [alert, setAlert] = useState<{type: string, message: string} | null>(null);

    useEffect(() => {
        fetchStudents();
    }, [search, department, classSection]);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (department) params.append('department', department);
            if (classSection) params.append('classSection', classSection);

            const res = await fetch(`${API_BASE_URL}/api/students?${params.toString()}`);
            const data = await res.json();
            setStudents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch students:', err);
            setStudents([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number | string, name: string) => {
        if (!window.confirm(`Delete student "${name}"? This action cannot be undone.`)) return;

        try {
            const res = await fetch(`${API_BASE_URL}/api/students/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setAlert({ type: 'success', message: `Student "${name}" deleted successfully.` });
                fetchStudents();
            } else {
                setAlert({ type: 'error', message: 'Failed to delete student.' });
            }
        } catch (err) {
            setAlert({ type: 'error', message: 'Failed to connect to server.' });
        }

        setTimeout(() => setAlert(null), 3000);
    };

    return (
        <div>
            <div className="admin-page-header">
                <h1 className="admin-greeting">Manage Students</h1>
                <p className="admin-greeting-sub">View, search, and manage enrolled students.</p>
            </div>

            {alert && (
                <div className={`admin-alert ${alert.type === 'success' ? 'admin-alert-success' : 'admin-alert-error'}`}>
                    {alert.message}
                </div>
            )}

            {/* Toolbar */}
            <div className="admin-toolbar">
                <input
                    className="admin-search-input"
                    placeholder="Search by name, email, or roll number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select className="admin-filter-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
                    <option value="">All Departments</option>
                    {DEPARTMENTS.filter(d => d).map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select className="admin-filter-select" value={classSection} onChange={(e) => setClassSection(e.target.value)}>
                    <option value="">All Sections</option>
                    {SECTIONS.filter(s => s).map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
            </div>

            {/* Student Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Roll No</th>
                            <th>Reg No</th>
                            <th>Department</th>
                            <th>Class</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>Loading...</td></tr>
                        ) : students.length === 0 ? (
                            <tr>
                                <td colSpan={8}>
                                    <div className="admin-empty-state">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                        <p>No students found. Use the Onboard Student page to add students.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : students.map((s: any, i: number) => (
                            <tr key={s.id}>
                                <td>{i + 1}</td>
                                <td style={{ fontWeight: 600 }}>{s.name || '-'}</td>
                                <td>{s.emailId || s.email}</td>
                                <td>{s.rollNumber || '-'}</td>
                                <td>{s.registrationNumber || '-'}</td>
                                <td>
                                    {s.department ? (
                                        <span className="admin-badge admin-badge-quiz">{s.department}</span>
                                    ) : '-'}
                                </td>
                                <td>{s.classSection || '-'}</td>
                                <td>
                                    <button
                                        className="admin-btn admin-btn-danger admin-btn-sm"
                                        onClick={() => handleDelete(s.id, s.name)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageStudents;
