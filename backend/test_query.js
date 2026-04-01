const dotenv = require('dotenv');
dotenv.config();
const { pool } = require('./db.js');

async function testQuery() {
    try {
        const result = await pool.query(`
            SELECT t.*, u.name as creator_name,
                (SELECT COUNT(*) FROM quiz_questions qq WHERE qq.test_id = t.id) as question_count,
                (SELECT COUNT(*) FROM code_problems cp WHERE cp.test_id = t.id) as problem_count
            FROM tests t
            LEFT JOIN users u ON t.created_by = u.id
            ORDER BY t.created_at DESC
        `);
        console.log("SUCCESS:", result.rows.length, "rows");
    } catch(e) {
        console.error("ERROR CAUGHT:");
        console.error(e.message);
    } finally {
        pool.end();
    }
}
testQuery();
