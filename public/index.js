// TODO
// add pyromancers parting flame

let selection = null;

$('#randomButton1').click(() => {
    getRandomWeapon(1);
});
$('#randomButton2').click(() => {
    getRandomWeapon(2);
});

function getRandomWeapon(mode) {
    $.getJSON('/api/getRandomWeapon' + mode, (data) => {
        selection = data;
        console.log(selection);
        renderContent();
    });
}

function renderContent() {
    const div = $('#contentDiv');
    div.empty();

    div.append(`
        <div>
            <a href="${selection.weapon.url}" target="_blank" rel="noreferrer noopener">
                <img style="object-fit: contain; width: 300px; height: 300px" src="${selection.weapon.thumbnailUrl}"></img>
            </a>
        </div>
        <a class="display-5 text-reset text-decoration-none" href="${selection.weapon.url}" target="_blank" rel="noreferrer noopener">${selection.weapon.name}</a>
        <div class="d-flex align-items-center">
            <span class="fs-4 text-muted">
                <a class="text-reset text-decoration-none" href="${selection.category.url}" target="_blank" rel="noreferrer noopener">${selection.category.name}</a>
            </span>
            <code class="fs-4 ms-4">#${selection.weapon.hexId}</code>
        </div>
    `);

    $('#hexId').click(() => {
        navigator.clipboard.writeText(selection.weapon.hexId);
        
        $('#toastBody').text(`Copied '${selection.weapon.hexId}' to clipboard`);
        const toast = bootstrap.Toast.getOrCreateInstance($('.toast')[0]);
        toast.show();
    });
}

getRandomWeapon(1);