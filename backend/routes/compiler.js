const express = require('express');
const router = express.Router();
const { readDb } = require('../jsonDb');

// AWS Lambda Compiler API configuration
const COMPILER_API_URL = process.env.COMPILER_API_URL || 'https://YOUR_API_GATEWAY_ID.execute-api.YOUR_REGION.amazonaws.com/prod/execute';
const COMPILER_API_KEY = process.env.COMPILER_API_KEY || '';

/**
 * Call the AWS Lambda compiler API
 * @param {string} code - The source code to execute
 * @param {string} input - stdin input for the program
 * @returns {Promise<{output: string, error: string|null, statusCode: number}>}
 */
async function callCompiler(code, input = '') {
    try {
        // Build the request body in the format the ghost-runner Lambda expects
        const requestBody = {
            studentCode: code,
            functionName: 'main',
            testCases: [],
            inputData: input ? input.split('\n') : [],
            timeoutMs: 10000
        };

        const response = await fetch(COMPILER_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': COMPILER_API_KEY
            },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(30000) // 30s timeout
        });

        const data = await response.json();
        
        // Handle Lambda response format
        // Lambda may return: { statusCode, body } or direct response
        let result;
        if (data.body && typeof data.body === 'string') {
            try {
                result = JSON.parse(data.body);
            } catch {
                result = { output: data.body, error: null };
            }
        } else if (data.body && typeof data.body === 'object') {
            result = data.body;
        } else {
            result = data;
        }

        // Normalize various output field names the Lambda might use
        const output = (result.output || result.stdout || result.consoleOutput || '').toString();
        const error = result.error || result.stderr || result.errorMessage || null;

        return {
            output: output,
            error: error,
            statusCode: response.status
        };
    } catch (err) {
        console.error('Compiler API error:', err.message);
        return {
            output: '',
            error: `Compiler service error: ${err.message}`,
            statusCode: 500
        };
    }
}

/**
 * Normalize output for comparison
 * Trims whitespace, normalizes line endings
 */
function normalizeOutput(str) {
    return (str || '')
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim();
}

module.exports = () => {

    // POST /api/compile - Execute code directly (single run, no test case validation)
    router.post('/', async (req, res) => {
        try {
            const { code, input } = req.body;

            if (!code || code.trim().length === 0) {
                return res.status(400).json({ error: 'Code cannot be empty' });
            }

            const result = await callCompiler(code, input || '');

            res.json({
                output: result.output,
                error: result.error,
                statusCode: result.statusCode
            });
        } catch (error) {
            console.error('Compile error:', error);
            res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    });

    // POST /api/compile/run - Run code against all test cases for a specific problem
    router.post('/run', async (req, res) => {
        try {
            const { code, testId, problemIndex } = req.body;

            if (!code || code.trim().length === 0) {
                return res.status(400).json({ error: 'Code cannot be empty' });
            }

            // Fetch test data
            const db = readDb();
            const test = db.tests.find(t => String(t.id) === String(testId));
            
            if (!test) {
                return res.status(404).json({ error: 'Test not found' });
            }

            if (!test.problems || test.problems.length === 0) {
                return res.status(404).json({ error: 'No problems found in this test' });
            }

            const pIndex = parseInt(problemIndex) || 0;
            const problem = test.problems[pIndex];

            if (!problem) {
                return res.status(404).json({ error: 'Problem not found at the given index' });
            }

            const testCases = problem.test_cases || [];

            if (testCases.length === 0) {
                // If no test cases defined, use sample_input/sample_output as a test case
                if (problem.sample_output) {
                    testCases.push({
                        input: problem.sample_input || '',
                        expected_output: problem.sample_output,
                        is_hidden: false
                    });
                } else {
                    return res.status(400).json({ error: 'No test cases defined for this problem' });
                }
            }

            // Run code against each test case
            const results = [];
            let passedCount = 0;

            for (let i = 0; i < testCases.length; i++) {
                const tc = testCases[i];
                const compilerResult = await callCompiler(code, tc.input || '');

                const actualOutput = normalizeOutput(compilerResult.output);
                const expectedOutput = normalizeOutput(tc.expected_output);
                const passed = !compilerResult.error && actualOutput === expectedOutput;

                if (passed) passedCount++;

                results.push({
                    test_case: i + 1,
                    input: tc.is_hidden ? '[Hidden]' : (tc.input || '(no input)'),
                    expected: tc.is_hidden ? '[Hidden]' : tc.expected_output,
                    actual: compilerResult.error ? compilerResult.error : compilerResult.output,
                    passed: passed,
                    is_hidden: tc.is_hidden || false,
                    error: compilerResult.error || null
                });
            }

            res.json({
                results,
                all_passed: passedCount === testCases.length,
                passed_count: passedCount,
                total_count: testCases.length,
                problem_title: problem.title,
                marks: problem.marks || 10
            });

        } catch (error) {
            console.error('Run error:', error);
            res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    });

    // POST /api/compile/submit - Final submission (validates all test cases and saves result)
    router.post('/submit', async (req, res) => {
        try {
            const { code, testId, problemIndex, studentId } = req.body;

            if (!code || code.trim().length === 0) {
                return res.status(400).json({ error: 'Code cannot be empty' });
            }

            // Fetch test data
            const db = readDb();
            const test = db.tests.find(t => String(t.id) === String(testId));

            if (!test || !test.problems) {
                return res.status(404).json({ error: 'Test or problems not found' });
            }

            const pIndex = parseInt(problemIndex) || 0;
            const problem = test.problems[pIndex];

            if (!problem) {
                return res.status(404).json({ error: 'Problem not found' });
            }

            const testCases = problem.test_cases || [];
            if (testCases.length === 0 && problem.sample_output) {
                testCases.push({
                    input: problem.sample_input || '',
                    expected_output: problem.sample_output,
                    is_hidden: false
                });
            }

            // Run ALL test cases (including hidden ones)
            let passedCount = 0;
            const results = [];

            for (let i = 0; i < testCases.length; i++) {
                const tc = testCases[i];
                const compilerResult = await callCompiler(code, tc.input || '');

                const actualOutput = normalizeOutput(compilerResult.output);
                const expectedOutput = normalizeOutput(tc.expected_output);
                const passed = !compilerResult.error && actualOutput === expectedOutput;

                if (passed) passedCount++;
                results.push({
                    test_case: i + 1,
                    passed,
                    error: compilerResult.error || null
                });
            }

            const totalMarks = problem.marks || 10;
            const score = testCases.length > 0 
                ? Math.round((passedCount / testCases.length) * totalMarks * 100) / 100
                : 0;
            

            res.json({
                score,
                total_marks: totalMarks,
                passed_count: passedCount,
                total_count: testCases.length,
                all_passed: passedCount === testCases.length,
                results,
                message: passedCount === testCases.length 
                    ? '🎉 All test cases passed! Submission successful.' 
                    : `${passedCount}/${testCases.length} test cases passed.`
            });

        } catch (error) {
            console.error('Submit error:', error);
            res.status(500).json({ error: 'Internal server error', message: error.message });
        }
    });

    return router;
};
