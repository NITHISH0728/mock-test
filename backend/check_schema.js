const dotenv = require('dotenv');
dotenv.config();
const { pool } = require('./db.js');

async function checkSchema() {
    try {
        const result = await pool.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'users';
        `);
        console.log("COLUMNS:");
        result.rows.forEach(r => console.log(r.column_name));
    } catch(e) {
        console.error(e.message);
    } finally {
        pool.end();
    }
}
checkSchema();
