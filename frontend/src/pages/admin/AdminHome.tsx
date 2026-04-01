import { API_BASE_URL } from '../../config';
import { useState, useEffect } from 'react';

const AdminHome = () => {
    const [stats, setStats] = useState({ students: 0, tests: 0, results: { total: 0, pending: 0, completed: 0 } });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [studentsRes, testsRes, resultsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/students/count`),
                    fetch(`${API_BASE_URL}/api/tests/count`),
                    fetch(`${API_BASE_URL}/api/results/count`),
                ]);
                const students = await studentsRes.json();
                const tests = await testsRes.json();
                const results = await resultsRes.json();
                setStats({
                    students: students.total || 0,
                    tests: tests.total || 0,
                    results: results || { total: 0, pending: 0, completed: 0 },
                });
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();
    }, []);



    const overviewCards = [
        { title: 'Total Students', value: stats.students },
        { title: 'Total Quizzes', value: stats.tests },
        { title: 'Active Users', value: Math.max(1, Math.floor(stats.students * 0.8)) }, // Mock active users
        { title: 'Reports Generated', value: stats.results.completed || 0 },
    ];

    return (
        <div className="admin-dashboard-container">
            {/* Page Title */}
            <div className="admin-page-header-new">
                <h1 className="admin-title-main">Admin Dashboard</h1>
                <div className="admin-title-underline"></div>
            </div>

            {/* Overview Cards */}
            <div className="admin-overview-grid">
                {overviewCards.map((card, idx) => (
                    <div key={idx} className="admin-overview-card">
                        <div className="admin-overview-card-title">{card.title}</div>
                        <div className="admin-overview-card-value">{card.value}</div>
                    </div>
                ))}
            </div>

            {/* Management Table */}
            <div className="admin-table-section admin-card-new">
                <h3 className="admin-section-title-new">System Overview</h3>
                <div className="admin-table-container-new">
                    <table className="admin-modern-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Last Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={4} className="admin-table-empty">
                                    No data for table
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* Pagination Footer */}
                <div className="admin-table-footer">
                    <div className="admin-table-rows">
                        <span>Rows per page:</span>
                        <select className="admin-rows-select">
                            <option>20</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                    </div>
                    <div className="admin-table-pagination">
                        <span>0–0 of 0</span>
                        <button className="admin-page-btn" disabled>Previous</button>
                        <button className="admin-page-btn" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
