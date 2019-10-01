$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initMapObjects();
    initEdits();
    initObjectsData();

    let type = getUrlParameter("type");
    switch (type) {
        case "objects":
            infoObjectsArray = getObjectsFromCookie();
            break;

        case "water":
            infoWaterSupplyNetArray = getNetsFromCookie('infoWaterSupplyNetArray');
            break;

        case "gas":
            infoGasNetArray = getNetsFromCookie('infoGasNetArray');
            break;

        case "roads":
            infoRoadsArray = getRoadsFromCookie();
            break;

        default:
            infoElectricityNetArray = getNetsFromCookie('infoElectricityNetArray');
            break;
    }

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
        showNets(type);
        alert("Изменения сохранены!");
    });

    rejectEditsButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();
        editableLayers.clearLayers();
        showNets(type);
    });

    removeObjectButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        $('.objectData').hide();
        removeObjectOrNet();
        editableLayers.clearLayers();
        showNets(type);
    });

    showNets(type);

    map.on('click', function (e) {
        infoTableContainer.hide();
        $('#infoTable').empty();

        if (!showObjectsInfo) {
            return;
        }

        for (let i = 0; i < infoObjectsArray.length; i++) {
            if (infoObjectsArray[i].contains(e.latlng)) {
                infoObjectsArray[i].renderToTable('infoTable');
                infoTableContainer.show();
                break;
            }
        }
    });

    map.on('overlayadd', function(e) {
        switch (e.name) {
            case "Электрическая сеть":
                break;

            case "Газовая сеть":
                break;

            case "Водопроводная сеть":
                break;

            case "Информация об объектах":
                showObjectsInfo = true;
                break;
        }
    });

    map.on('overlayremove', function(e) {
        if (e.name === "Информация об объектах и дорогах") {
            showObjectsInfo = false;
        }
    });

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
    $.cookie('infoObjectsArray', JSON.stringify(result), {expires: 31, path: '/'});
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
    $.cookie(name, JSON.stringify(result), {expires: 31, path: '/'});
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

function showNets(type) {
    switch (type) {
        case "objects":
            mapObjects = showObjects(infoObjectsArray, true, true, true, true);
            break;

        case "water":
            waterSupplyNet = showLines(infoWaterSupplyNetArray, true,
                true, true, true, true);
            break;

        case "gas":
            gasNet = showLines(infoGasNetArray, true, true, true,
                true, true);
            break;

        case "roads":
            roads = showLines(infoRoadsArray, true, true, true,
                true, true, true);
            break;

        default:
            electricityNet = showLines(infoElectricityNetArray, true,
                true, true, true, true);
            break;
    }
}

function saveNetsInfo() {
    tmpElectricityNetArray = saveNetInfo(infoElectricityNetArray);
    tmpWaterSupplyNetArray = saveNetInfo(infoWaterSupplyNetArray);
    tmpGasNetArray = saveNetInfo(infoGasNetArray);
    tmpRoads = saveNetInfo(infoRoadsArray);
}

function saveObjectOrNet() {
    if (currentObjectPosition !== null) {
        applyObjectChanges();
        saveObjectsToCookie(infoObjectsArray);
    } else if (currentElectricityLinePosition !== null) {
        applyLineChanges(infoElectricityNetArray, tmpElectricityNetArray, currentElectricityLinePosition);
        saveNetsToCookie(infoElectricityNetArray, 'infoElectricityNetArray');
    } else if (currentWaterSupplyLinePosition !== null) {
        applyLineChanges(infoWaterSupplyNetArray, tmpWaterSupplyNetArray, currentWaterSupplyLinePosition);
        saveNetsToCookie(infoWaterSupplyNetArray, 'infoWaterSupplyNetArray');
    } else if (currentGasLinePosition !== null) {
        applyLineChanges(infoGasNetArray, tmpGasNetArray, currentGasLinePosition);
        saveNetsToCookie(infoGasNetArray, 'infoGasNetArray');
    } else if (currentRoadPosition !== null) {
        applyRoadChanges();
        saveNetsToCookie(infoRoadsArray, 'infoRoadsArray');
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
    else if (currentRoadPosition !== null) {
        infoRoadsArray.splice(currentRoadPosition, 1);
        tmpRoads.splice(currentRoadPosition, 1);
        saveNetsToCookie(infoRoadsArray, 'infoRoadsArray');
    }
}
