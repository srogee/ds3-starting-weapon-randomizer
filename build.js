const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));
const itemIds = parse(fs.readFileSync(path.join(__dirname, 'itemIds.csv')), {
    columns: true
});

for (const element of data) {
    if (!element.hexId) {
        const itemIdRow = itemIds.find(row => row.name === element.name);
        if (!itemIdRow) {
            console.log(`Couldn't find row for "${element.name}"`);
        } else {
            element.hexId = itemIdRow.hexId;
        }
    }
}

fs.writeFileSync(path.join(__dirname, 'data.json'), JSON.stringify(data, null, 4));