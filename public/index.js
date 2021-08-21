let weapon = null;
let staticData = null;
let ready = false;

const RandomizationMode = {
    CategoryThenWeapon: 1,
    EqualWeight: 2
}

$('#randomButton1').click(() => {
    getRandomWeapon(RandomizationMode.CategoryThenWeapon);
});
$('#randomButton2').click(() => {
    getRandomWeapon(RandomizationMode.EqualWeight);
});

function getCategories() {
    return new Promise((resolve) => {
        $.getJSON('/api/getStaticData', (data) => {
            staticData = data;
            staticData.categories.sort((a, b) => {
                var nameA = a.name.toUpperCase(); // ignore upper and lowercase
                var nameB = b.name.toUpperCase(); // ignore upper and lowercase
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
              
                // names must be equal
                return 0;
            });
            console.log(staticData);
            resolve();
        });
    })
}

function getAvailableWeapons() {
    const categories = getAvailableCategories();
    return staticData.weapons.filter(weapon => categories.some(category => weapon.category === category.id));
}

function getAvailableCategories() {
    return staticData.categories.filter(category => isCategoryEnabled(category));
}

function getRandomArrayElement(array) {
    return array[Math.floor((Math.random()*array.length))];
}

function getWeaponsInCategory(category) {
    return staticData.weapons.filter(weapon => weapon.category === category.id);
}

function getRandomWeapon(mode) {
    if (ready) {
        if (mode === RandomizationMode.CategoryThenWeapon) {
            const categories = getAvailableCategories();

            const category = getRandomArrayElement(categories);
            const weaponsInCategory = getWeaponsInCategory(category);

            weapon = getRandomArrayElement(weaponsInCategory);
            renderContent();
        } else if (mode === RandomizationMode.EqualWeight) {
            weapon = getRandomArrayElement(getAvailableWeapons());
            renderContent();
        }
    }
}

function renderContent() {
    if (!weapon) {
        return;
    }

    const div = $('#contentDiv');
    div.empty();

    const category = staticData.categories.find(category => category.id === weapon.category);

    div.append(`
        <div>
            <a href="${weapon.url}" target="_blank" rel="noreferrer noopener">
                <img style="object-fit: contain; width: 300px; height: 300px" src="${weapon.thumbnailUrl}"></img>
            </a>
        </div>
        <a class="display-5 text-reset text-decoration-none" href="${weapon.url}" target="_blank" rel="noreferrer noopener">${weapon.name}</a>
        <div class="d-flex align-items-center mt-4">
            <span class="fs-4 text-muted">
                <a class="text-reset text-decoration-none" href="${category.url}" target="_blank" rel="noreferrer noopener">${category.name}</a>
            </span>
            <button id="copyIdButton" class="btn btn-light btn-lg ms-4"><i class="fas fa-clipboard"></i><code class="ms-2 fs-4">#${weapon.hexId}</code></button>
            
        </div>
    `);

    $('#copyIdButton').click(() => {
        navigator.clipboard.writeText(weapon.hexId);
        
        $('#toastBody').text(`Copied '${weapon.hexId}' to clipboard`);
        const toast = bootstrap.Toast.getOrCreateInstance($('.toast')[0]);
        toast.show();
    });
}

function isCategoryEnabled(category) {
    return $(`#checkbox_${category.id}`).is(':checked');
}

function renderOptions() {
    const div = $('#optionsDiv');
    div.empty();

    for (const category of staticData.categories) {
        const count = getWeaponsInCategory(category).length;
        const style = 'background-color: #0d6efd; border-color: #0d6efd;'; // Fixes weird color
        div.append(`
        <div class="ms-1 mt-1">
            <input class="btn-check" type="checkbox" id="checkbox_${category.id}" checked autocomplete="off">
            <label class="btn btn-primary" style="${style}" id="label_${category.id}" for="checkbox_${category.id}"><i class="fas fa-check me-1"></i>${category.name} (${count})</label>
        </div>
        `);

        $(`#checkbox_${category.id}`).change(function() {
            const label = $(`#label_${category.id}`);
            const icon = label.find('i');
            if (this.checked) {
                label.removeClass('btn-light');
                label.addClass('btn-primary');
                label.attr('style', style);
                
                icon.removeClass('fa-ban');
                icon.addClass('fa-check');
            } else {
                label.removeClass('btn-primary');
                label.addClass('btn-light');
                label.attr('style', '');

                icon.removeClass('fa-check');
                icon.addClass('fa-ban');
            }
        });
    }
}

getCategories().then(() => {
    ready = true;
    renderOptions();
    getRandomWeapon(RandomizationMode.EqualWeight);
});