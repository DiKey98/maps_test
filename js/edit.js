$(document).ready(function () {
    map = L.map('map', {editable: true}).setView(mapCenter, 13);
    infoArray = getObjectsFromCookie();

    L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: accessToken
    }).addTo(map);

    infoTableContainer = $('#infoTableContainer');
    editableLayers = L.featureGroup().addTo(map);

    houseData = $('#houseData');
    commercialBuildingData = $('#commercialBuildingData');
    roadData = $('#roadData');
    landPlotData = $('#landPlotData');

    saveEdits = $('#saveEdits');
    rejectEditsButton = $('#rejectEditsButton');
    saveEditsButton = $('#saveEditsButton');
    removeObjectButton = $('#removeObjectButton');

    saveEdits.hide();
    infoTableContainer.hide();
    $('.objectData').hide();

    saveEditsButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();
        applyObjectsChanges();
        saveObjectsInfo();
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
        saveObjectsInfo();
    });

    removeObjectButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();
        editableLayers.clearLayers();
        infoArray.splice(currentPosition, 1);
        saveObjectsToCookie(infoArray);
        showObjects();
        saveObjectsInfo();
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