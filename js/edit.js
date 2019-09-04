$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initMapObjects();
    initEdits();
    initObjectsData();

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

        if (currentObjectPosition !== null) {
            applyObjectChanges();
            saveObjectsToCookie(infoObjectsArray);
        }

        if (currentLinePosition !== null) {
            applyLineChanges();
            saveLinesToCookie(infoLinesArray);
        }

        editableLayers.clearLayers();
        showObjects();
        showLines();
        alert("Изменения сохранены!");
    });

    rejectEditsButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();
        editableLayers.clearLayers();
        showObjects();
        showLines();
    });

    removeObjectButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();

        if (currentObjectPosition !== null) {
            infoObjectsArray.splice(currentObjectPosition, 1);
            tmpObjects.splice(currentObjectPosition, 1);
            saveObjectsToCookie(infoObjectsArray);
        }

        if (currentLinePosition !== null) {
            infoLinesArray.splice(currentLinePosition, 1);
            tmpLines.splice(currentLinePosition, 1);
            saveLinesToCookie(infoLinesArray);
        }

        editableLayers.clearLayers();
        showObjects();
        showLines();
    });

    showObjects();
    showLines();
    saveObjectsInfo();
    saveLinesInfo();
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
    $.cookie('infoObjectsArray', JSON.stringify(result), { expires: 7, path: '/' });
}

function saveLinesToCookie(infoArray) {
    let result = [];
    for (let i = 0; i < infoArray.length; i++) {
        result.push(infoArray[i].toJSON());
        for(let k = 0; k < result[i].coords.length; k++) {
            result[i].coords[k] = {
                lat: result[i].coords[k].lat,
                lng: result[i].coords[k].lng
            }
        }
    }
    $.cookie('infoLinesArray', JSON.stringify(result), { expires: 7, path: '/' });
}

function initEdits() {
    saveEdits = $('#saveEdits');
    lineOptions = $('#lineOptions');
    rejectEditsButton = $('#rejectEditsButton');
    saveEditsButton = $('#saveEditsButton');
    removeObjectButton = $('#removeObjectButton');
}

function initObjectsData() {
    houseData = $('#houseData');
    commercialBuildingData = $('#commercialBuildingData');
    landPlotData = $('#landPlotData');
    roadData = $('#roadData');
}
