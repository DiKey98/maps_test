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
        saveObjectOrNet();
        editableLayers.clearLayers();
        showObjects();
        showNets();
        alert("Изменения сохранены!");
    });

    rejectEditsButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();
        editableLayers.clearLayers();
        showObjects();
        showNets();
    });

    removeObjectButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();
        removeObjectOrNet();
        editableLayers.clearLayers();
        showObjects();
        showNets();
    });

    showObjects();
    showNets();

    saveObjectsInfo();
    saveNetsInfo();
});

function saveObjectsToCookie(infoArray) {
    let result = [];
    for (let i = 0; i < infoArray.length; i++) {
        result.push(infoArray[i].toJSON());
        for (let k = 0; k < result[i].coords[0].length; k++) {
            result[i].coords[0][k] = {
                lat: result[i].coords[0][k].lat,
                lng: result[i].coords[0][k].lng
            }
        }
    }
    $.cookie('infoObjectsArray', JSON.stringify(result), {expires: 7, path: '/'});
}

function saveNetsToCookie(infoArray, name = 'infoElectricityNetArray') {
    let result = [];
    for (let i = 0; i < infoArray.length; i++) {
        result.push(infoArray[i].toJSON());
        for (let k = 0; k < result[i].coords.length; k++) {
            result[i].coords[k] = {
                lat: result[i].coords[k].lat,
                lng: result[i].coords[k].lng
            }
        }
    }
    $.cookie(name, JSON.stringify(result), {expires: 7, path: '/'});
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

function showNets() {
    electricityNet = showLines(infoElectricityNetArray, electricityNet, true,
        true, true, true, true);
    waterSupplyNet = showLines(infoWaterSupplyNetArray, waterSupplyNet, true,
        true, true, true, true);
    gasNet = showLines(infoGasNetArray, gasNet, true, true, true,
        true, true);
}

function saveNetsInfo() {
    tmpElectricityNetArray = saveNetInfo(infoElectricityNetArray);
    tmpWaterSupplyNetArray = saveNetInfo(infoWaterSupplyNetArray);
    tmpGasNetArray = saveNetInfo(infoGasNetArray);
}

function saveObjectOrNet() {
    if (currentObjectPosition !== null) {
        applyObjectChanges();
        saveObjectsToCookie(infoObjectsArray);
    } else if (currentElectricityLinePosition !== null) {
        applyLineChanges(infoElectricityNetArray, tmpElectricityNetArray, currentElectricityLinePosition);
        saveNetsToCookie(infoElectricityNetArray, 'infoElectricityNetArray');
    }else if (currentWaterSupplyLinePosition !== null) {
        applyLineChanges(infoWaterSupplyNetArray, tmpWaterSupplyNetArray, currentWaterSupplyLinePosition);
        saveNetsToCookie(infoWaterSupplyNetArray, 'infoWaterSupplyNetArray');
    }else if (currentGasLinePosition !== null) {
        applyLineChanges(infoGasNetArray, tmpGasNetArray, currentGasLinePosition);
        saveNetsToCookie(infoGasNetArray, 'infoGasNetArray');
    }
}

function removeObjectOrNet() {
    if (currentObjectPosition !== null) {
        infoObjectsArray.splice(currentObjectPosition, 1);
        tmpObjects.splice(currentObjectPosition, 1);
        saveObjectsToCookie(infoObjectsArray);
    } else if (currentElectricityLinePosition !== null) {
        infoElectricityNetArray.splice(currentElectricityLinePosition, 1);
        tmpElectricityNetArray.splice(currentElectricityLinePosition, 1);
        saveObjectsToCookie(infoElectricityNetArray, 'infoElectricityNetArray');
    }else if (currentWaterSupplyLinePosition !== null) {
        infoWaterSupplyNetArray.splice(currentWaterSupplyLinePosition, 1);
        tmpWaterSupplyNetArray.splice(currentWaterSupplyLinePosition, 1);
        saveNetsToCookie(infoWaterSupplyNetArray, 'infoWaterSupplyNetArray');
    }else if (currentGasLinePosition !== null) {
        infoGasNetArray.splice(currentGasLinePosition, 1);
        tmpGasNetArray.splice(currentGasLinePosition, 1);
        saveNetsToCookie(infoGasNetArray, 'infoGasNetArray');
    }
}
