const dotenv = require('dotenv');
dotenv.config();
const { pool } = require('./db.js');

async function update() {
    try {
        await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image TEXT');
        console.log('Successfully added profile_image column to users table');
    } catch(e) {
        console.error(e);
    } finally {
        pool.end();
    }
}
update();
