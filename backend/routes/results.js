const express = require('express');
const router = express.Router();
const { readDb, writeDb } = require('../jsonDb');

module.exports = () => {

    // GET /api/results - Get all results with optional filters
    router.get('/', (req, res) => {
        try {
            const { test_id, student_id } = req.query;
            const db = readDb();
            
            let results = db.test_results;

            if (test_id) {
                results = results.filter(tr => String(tr.test_id) === String(test_id));
            }
            if (student_id) {
                results = results.filter(tr => String(tr.student_id) === String(student_id));
            }
            
            // Enrich results
            results = results.map(tr => {
                const student = db.users.find(u => u.id === tr.student_id) || {};
                const test = db.tests.find(t => t.id === tr.test_id) || {};
                
                return {
                    ...tr,
                    student_name: student.name || 'Unknown',
                    student_email: student.emailId || 'Unknown',
                    student_department: student.department || 'Unknown',
                    student_section: student.classSection || 'Unknown',
                    reg_no: student.registrationNumber || 'Unknown',
                    test_title: test.title || 'Unknown',
                    test_type: test.test_type || 'Unknown',
                    total_questions: test.test_type === 'quiz' ? (test.questions?.length || 0) : (test.problems?.length || 0)
                };
            }).sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime());

            res.json(results);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching results', error: error.message });
        }
    });

    // GET /api/results/count - Result stats for dashboard
    router.get('/count', (req, res) => {
        try {
            const db = readDb();
            const results = db.test_results;
            
            const total = results.length;
            const pending = results.filter(tr => tr.status === 'pending').length;
            const completed = results.filter(tr => tr.status === 'completed').length;

            res.json({ total, pending, completed });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching result stats', error: error.message });
        }
    });

    // GET /api/results/csv - Download results as CSV
    router.get('/csv', (req, res) => {
        try {
            const { test_id } = req.query;
            const db = readDb();
            
            let results = db.test_results;

            if (test_id) {
                results = results.filter(tr => String(tr.test_id) === String(test_id));
            }
            
            // Enrich results
            results = results.map(tr => {
                const student = db.users.find(u => u.id === tr.student_id) || {};
                const test = db.tests.find(t => t.id === tr.test_id) || {};
                
                return {
                    "Student Name": student.name || 'Unknown',
                    "Email": student.emailId || 'Unknown',
                    "Reg No": student.registrationNumber || 'Unknown',
                    "Test Name": test.title || 'Unknown',
                    "Score": tr.score,
                    "Total Marks": tr.total_marks,
                    "Submitted At": tr.submitted_at
                };
            }).sort((a, b) => (a["Student Name"] || "").localeCompare(b["Student Name"] || ""));

            if (results.length === 0) {
                return res.status(404).json({ message: 'No results found' });
            }

            const headers = Object.keys(results[0]);
            let csv = headers.join(',') + '\n';
            for (const row of results) {
                const values = headers.map(h => {
                    const val = row[h] !== null && row[h] !== undefined ? String(row[h]) : '';
                    return `"${val.replace(/"/g, '""')}"`;
                });
                csv += values.join(',') + '\n';
            }

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=test_results.csv');
            res.send(csv);
        } catch (error) {
            res.status(500).json({ message: 'Error generating CSV', error: error.message });
        }
    });

    // POST /api/results - Submit a test result
    router.post('/', (req, res) => {
        try {
            const { test_id, student_id, score, total_marks, status } = req.body;
            const db = readDb();
            
            const newResultId = db.test_results.length > 0 ? Math.max(...db.test_results.map(tr => tr.id)) + 1 : 1;
            
            const newResult = {
                id: newResultId,
                test_id,
                student_id,
                score,
                total_marks,
                status: status || 'completed',
                submitted_at: new Date().toISOString()
            };
            
            db.test_results.push(newResult);
            writeDb(db);
            
            res.status(201).json({ message: 'Test result submitted successfully', result: newResult });
        } catch (error) {
            res.status(500).json({ message: 'Error submitting result', error: error.message });
        }
    });

    return router;
};
