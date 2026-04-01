const dotenv = require('dotenv');
dotenv.config();
const { pool } = require('./db.js');

async function migrate() {
    try {
        console.log("Starting Migration...");
        
        // 1. Add missing columns to users
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS name VARCHAR(255),
            ADD COLUMN IF NOT EXISTS roll_no VARCHAR(50),
            ADD COLUMN IF NOT EXISTS reg_no VARCHAR(50),
            ADD COLUMN IF NOT EXISTS department VARCHAR(100),
            ADD COLUMN IF NOT EXISTS class_section VARCHAR(50),
            ADD COLUMN IF NOT EXISTS profile_image TEXT,
            ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();
        `);
        console.log("Users table updated.");

        // 2. Create tests table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tests (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                test_type VARCHAR(20) NOT NULL,
                duration_minutes INTEGER DEFAULT 60,
                created_by INTEGER REFERENCES users(id),
                is_published BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);
        console.log("Tests table verified.");

        // 3. Create quiz_questions table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quiz_questions (
                id SERIAL PRIMARY KEY,
                test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
                question_number INTEGER NOT NULL,
                question_text TEXT NOT NULL,
                option_a TEXT NOT NULL,
                option_b TEXT NOT NULL,
                option_c TEXT NOT NULL,
                option_d TEXT NOT NULL,
                correct_option CHAR(1) NOT NULL,
                marks INTEGER DEFAULT 1
            );
        `);
        console.log("Quiz questions table verified.");

        // 4. Create code_problems
        await pool.query(`
            CREATE TABLE IF NOT EXISTS code_problems (
                id SERIAL PRIMARY KEY,
                test_id INTEGER REFERENCES tests(id) ON DELETE CASCADE,
                problem_number INTEGER NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                input_format TEXT,
                output_format TEXT,
                constraints_text TEXT,
                sample_input TEXT,
                sample_output TEXT,
                marks INTEGER DEFAULT 10
            );
        `);
        console.log("Code problems table verified.");

        // 5. Code test cases table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS code_test_cases (
                id SERIAL PRIMARY KEY,
                problem_id INTEGER REFERENCES code_problems(id) ON DELETE CASCADE,
                input TEXT NOT NULL,
                expected_output TEXT NOT NULL,
                is_hidden BOOLEAN DEFAULT false
            );
        `);
        console.log("Test cases table verified.");

        // 6. Test results table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS test_results (
                id SERIAL PRIMARY KEY,
                test_id INTEGER REFERENCES tests(id),
                student_id INTEGER REFERENCES users(id),
                score DECIMAL(5,2),
                total_marks INTEGER,
                submitted_at TIMESTAMP DEFAULT NOW(),
                status VARCHAR(20) DEFAULT 'completed'
            );
        `);
        console.log("Test results table verified.");

        // Seed default admin and student
        await pool.query(`
            INSERT INTO users (email, password, role, name)
            VALUES
                ('admin@gmail.com', '123', 'admin', 'Admin'),
                ('student@gmail.com', '123', 'student', 'Demo Student')
            ON CONFLICT (email) DO NOTHING;
        `);
        
        console.log("Migration and Seeding Complete!");
    } catch(e) {
        console.error("Migration Failed:");
        console.error(e.message);
    } finally {
        pool.end();
    }
}
migrate();
