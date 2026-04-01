const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'data', 'db.json');

const readDb = () => {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading db.json:", err);
        return { users: [], tests: [], test_results: [] };
    }
};

const writeDb = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error("Error writing to db.json:", err);
    }
};

module.exports = { readDb, writeDb };
