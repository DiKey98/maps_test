$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initObjectForms();
    initMapObjects();
    initEdits();

    $.removeCookie("email");
    setEmailFromCookie();
    $('#loginLogout').click(function (e) {
        $.removeCookie("email");
    });

    saveEdits.hide();
    infoTableContainer.hide();
    $('.objectData').hide();

    saveEditsButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();
        applyObjectChanges();
        saveObjectsToCookie(infoArray);
        editableLayers.clearLayers();
        showObjects();
        alert("Изменения сохранены!");
    });

    rejectEditsButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();
        editableLayers.clearLayers();
        showObjects();
    });

    removeObjectButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();
        infoArray.splice(currentPosition, 1);
        tmp.splice(currentPosition, 1);
        saveObjectsToCookie(infoArray);
        editableLayers.clearLayers();
        showObjects();
    });

    showObjects();
    saveObjectsInfo();
});

function saveObjectsToCookie(infoArray) {
    let result = [];
    for (let i = 0; i < infoArray.length; i++) {
        result.push(infoArray[i].toJSON());
        for(let k = 0; k < result[i].coords[0].length; k++) {
            result[i].coords[0][k] = {
                lat: result[i].coords[0][k].lat,
                lng: result[i].coords[0][k].lng
            }
        }
    }
    $.cookie('infoArray', JSON.stringify(result), { expires: 7, path: '/' });
}

function initEdits() {
    saveEdits = $('#saveEdits');
    rejectEditsButton = $('#rejectEditsButton');
    saveEditsButton = $('#saveEditsButton');
    removeObjectButton = $('#removeObjectButton');
}