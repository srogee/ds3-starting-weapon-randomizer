const fs = require('fs');
const path = require('path');
const random = require('random');
const express = require('express');

const weapons = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/weapons.json')));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/categories.json')));
const publicDir = path.join(__dirname, 'public');

const app = express();
app.use(express.static(publicDir));
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

const port = process.env.PORT || 3000;

function getRandomArrayElement(array) {
    if (array.length === 0) {
        return null;
    }
    const index = random.int(0, array.length - 1);
    return array[index];
}

function getRandomWeapon() {
    const category = getRandomArrayElement(categories);
    const weaponsInCategory = weapons.filter(weapon => weapon.category === category.id);
    const weapon = getRandomArrayElement(weaponsInCategory);
    return {
        weapon: weapon,
        category: category
    };
}

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/api/getRandomWeapon', (req, res) => {
    res.json(getRandomWeapon());
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});