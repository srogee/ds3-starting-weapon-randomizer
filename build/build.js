const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const { count } = require('console');

const fextralifeRoot = 'https://darksouls3.wiki.fextralife.com';

async function process() {
    const weapons = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/weapons.json')));
    const itemIds = parse(fs.readFileSync(path.join(__dirname, 'itemIds.csv')), {
        columns: true
    });

    let counts = {
        total: weapons.length,
        withNames: 0,
        withIds: 0,
        withUrls: 0,
        withThumbnails: 0,
        withCategories: 0
    };

    for (const element of weapons) {
        if (!element.hexId) {
            const itemIdRow = itemIds.find(row => row.name === element.name);
            if (!itemIdRow) {
                console.log(`Couldn't find item id row for "${element.name}"`);
            } else {
                element.hexId = itemIdRow.hexId;
            }
        }
    
        if (!element.url) {
            element.url = fextralifeRoot + '/' + element.name.replaceAll(' ', '+');
        }
    
        if (!element.thumbnailUrl) {
            const tempUrl = await findThumbnailUrl(element.url);
            if (tempUrl) {
                element.thumbnailUrl = tempUrl;
            }
        }

        if (!element.category) {
            const tempCategory = await findCategory(element.url);
            if (tempCategory) {
                element.category = getCategoryIdFromName(tempCategory);
            }
        }

        saveData(weapons);

        if (element.name) counts.withNames++;
        if (element.hexId) counts.withIds++;
        if (element.url) counts.withUrls++;
        if (element.thumbnailUrl) counts.withThumbnails++;
        if (element.category) counts.withCategories++;
    }

    console.log(counts);

    let categories = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/categories.json')));

    console.log([...new Set(weapons.map(weapon => weapon.category))]);

    for (const category of categories) {
        if (!category.id) {
            category.id = getCategoryIdFromName(category.name);
        }

        if (!category.url) {
            category.tempUrl = weapons.find(weapon => weapon.category === category.id).url;
        }

        if (category.tempUrl && category.url) {
            delete category.tempUrl;
        }
    }

    fs.writeFileSync(path.join(__dirname, '../data/categories.json'), JSON.stringify(categories, null, 4));
}

function saveData(data) {
    fs.writeFileSync(path.join(__dirname, '../data/weapons.json'), JSON.stringify(data, null, 4));
}

async function findThumbnailUrl(url) {
    try {
        const html = await fetch(url).then(res => res.text());
        const $ = cheerio.load(html);
        const url = $('#infobox').find('img').first().attr('src');
        return fextralifeRoot + url;
    } catch (e) {
        return null;
    }
}

async function findCategory(url) {
    try {
        const html = await fetch(url).then(res => res.text());
        const $ = cheerio.load(html);
        return $(`img[title='Weapon Type']`).parent().siblings().find('a.wiki_link').first().text();
    } catch (e) {
        return null;
    }
}

function getCategoryIdFromName(str) {
    return str.replaceAll(' ', '_').toLowerCase();
}

process();