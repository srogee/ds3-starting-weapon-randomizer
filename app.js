const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));
const choice = crypto.randomInt(0, data.length);

console.log(`${data[choice].name} (${data[choice].hexId || 'Unknown Item ID'})`);