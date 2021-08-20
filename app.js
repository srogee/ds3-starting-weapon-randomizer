const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
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

function getRandomWeapon() {
    const categoryIndex = crypto.randomInt(0, categories.length);
    const weaponsInCategory = weapons.filter(weapon => weapon.category === categories[categoryIndex].id);
    const weaponIndex = crypto.randomInt(0, weaponsInCategory.length);
    return {
        weapon: weaponsInCategory[weaponIndex],
        category: categories[categoryIndex]
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