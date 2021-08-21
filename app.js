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

function getRandomWeapon1() {
    // Every weapon category has an equal chance
    const category = getRandomArrayElement(categories);
    const weaponsInCategory = weapons.filter(weapon => weapon.category === category.id);
    const weapon = getRandomArrayElement(weaponsInCategory);
    return weapon;
}

function getRandomWeapon2() {
    // Every weapon has an equal chance
    const weapon = getRandomArrayElement(weapons);
    return weapon;
}

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
});

app.get('/api/getRandomWeapon1', (req, res) => {
    res.json(getRandomWeapon1());
});

app.get('/api/getRandomWeapon2', (req, res) => {
    res.json(getRandomWeapon2());
});

app.get('/api/getStaticData', (req, res) => {
    res.json({
        categories,
        weapons
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});