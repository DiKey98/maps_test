let oldObject;

function showObjects(infoArray = infoObjectsArray, bindEditHandler = true,
                     enableEdit = true, enableDragging = true, addToMap = true) {
    let mapObjectsArray = [];
    for (let i = 0; i < infoArray.length; i++) {
        let coords = [];
        for (let j = 0; j < infoArray[i].coords[0].length; j++) {
            coords.push([infoArray[i].coords[0][j].lat, infoArray[i].coords[0][j].lng]);
        }
        let polygon = L.polygon(coords);
        mapObjectsArray.push(polygon);

        if (addToMap) {
            polygon = polygon.addTo(editableLayers);
            mapObjectsArray.pop();
            mapObjectsArray.push(polygon);
        }

        if (enableDragging) {
            polygon.dragging.enable();
        }

        if (enableEdit) {
            polygon.enableEdit();
        }

        if (bindEditHandler) {
            polygon.on('editable:editing click', objectCoordsEditHandler.bind(null, infoArray[i].id, infoArray[i].type));
        }
    }

    return mapObjectsArray;
}

function showLines(infoArray = infoElectricityNetArray, bindEditHandler = true,
                   enableEdit = true, enableDragging = true, bindClickHandler = false, addToMap = true, isRoad = false) {
    let netsArray = [];
    for (let i = 0; i < infoArray.length; i++) {
        let coords = [];
        for (let j = 0; j < infoArray[i].coords.length; j++) {
            coords.push([infoArray[i].coords[j].lat, infoArray[i].coords[j].lng]);
        }
        let polygon = L.polyline(coords, {color: infoArray[i].color, weight: infoArray[i].width});
        netsArray.push(polygon);

        console.log(infoArray.length);
        if (addToMap) {
            polygon = polygon.addTo(editableLayers);
            netsArray.pop();
            netsArray.push(polygon);
        }

        if (enableDragging) {
            polygon.dragging.enable();
        }

        if (enableEdit) {
            polygon.enableEdit();
        }

        if (bindEditHandler) {
            if (!isRoad) {
                polygon.on('editable:editing click', lineCoordsEditHandler.bind(null, infoArray[i].id, infoArray[i].type));
            } else {
                polygon.on('editable:editing click', roadEditHandler.bind(null, infoArray[i].id, infoArray[i].type));
            }
        } else if (bindClickHandler) {
            polygon.on('click', lineClickHandler.bind(null, i, infoArray));
        }
    }

    return netsArray;
}

function lineClickHandler(idx, infoArray, e) {
    L.DomEvent.stopPropagation(e);
    infoTableContainer.hide();
    $('#infoTable').empty();
    infoArray[idx].renderToTable('infoTable');
    infoTableContainer.show();
}

function lineCoordsEditHandler(id, type, e) {
    $('.objectData').hide();
    saveEdits.show();

    currentElectricityLinePosition = findCurrentPositionById(infoElectricityNetArray, id);
    if (currentElectricityLinePosition === null) {
        currentWaterSupplyLinePosition = findCurrentPositionById(infoWaterSupplyNetArray, id);
        if (currentWaterSupplyLinePosition === null) {
            currentGasLinePosition = findCurrentPositionById(infoGasNetArray, id);
            if (currentGasLinePosition === null) {
                currentRoadPosition = findCurrentPositionById(infoRoadsArray, id);
                oldObject = infoRoadsArray[currentRoadPosition];
                infoRoadsArray[currentRoadPosition].coords = e.target._latlngs;
            } else {
                oldObject = infoGasNetArray[currentGasLinePosition];
                tmpGasNetArray[currentGasLinePosition].coords = e.target._latlngs;
            }
        } else {
            oldObject = infoWaterSupplyNetArray[currentWaterSupplyLinePosition];
            tmpWaterSupplyNetArray[currentWaterSupplyLinePosition].coords = e.target._latlngs;
        }
    } else {
        oldObject = infoElectricityNetArray[currentElectricityLinePosition];
        tmpElectricityNetArray[currentElectricityLinePosition].coords = e.target._latlngs;
    }
    lineOptions.show();

    $('#lineWeight').on("input", function (e) {
        if (currentElectricityLinePosition !== null) {
            updateLineWeight(e, electricityNet[currentElectricityLinePosition]);
            return;
        }

        if (currentWaterSupplyLinePosition !== null) {
            updateLineWeight(e, waterSupplyNet[currentWaterSupplyLinePosition]);
            return;
        }

        if (currentGasLinePosition !== null) {
            updateLineWeight(e, gasNet[currentGasLinePosition]);
            return;
        }

        if (currentRoadPosition !== null) {
            updateLineWeight(e, roads[currentRoadPosition]);
        }
    }).val(oldObject.width);

    $('#lineColor').colorpicker({
        horizontal: true
    }).on("changeColor", function (e) {
        if (e.value === undefined) {
            return;
        }

        if (currentElectricityLinePosition !== null) {
            electricityNet[currentElectricityLinePosition].setStyle({
                color: e.value
            });
            return;
        }

        if (currentWaterSupplyLinePosition !== null) {
            waterSupplyNet[currentWaterSupplyLinePosition].setStyle({
                color: e.value
            });
            return;
        }

        if (currentGasLinePosition !== null) {
            gasNet[currentGasLinePosition].setStyle({
                color: e.value
            });
            return;
        }

        if (currentRoadPosition !== null) {
            roads[currentRoadPosition].setStyle({
                color: e.value
            });
        }
    }).val(oldObject.color);

    $('#lineData').val(oldObject.info);
}

function roadEditHandler(id, type, e) {
    lineCoordsEditHandler(id, type, e);

    roadData.show();
    $('#roadName').val(oldObject.name);
    $('#roadLong').val(oldObject.long);
    $('#roadLanesCount').val(oldObject.lanesCount);
    $('#roadOneWay').val(oldObject.oneWay);
    $('#roadParkingInfo').val(oldObject.parkingInfo);
    $('#roadHistoricalData').val(oldObject.historicalData);
    $('#roadColor').val(oldObject.color);
    $('#roadWeight').val(oldObject.width);
}

function objectCoordsEditHandler(id, type, e) {
    $('.objectData').hide();
    saveEdits.show();

    let oldObject;
    for (let i = 0; i < infoObjectsArray.length; i++) {
        if (infoObjectsArray[i].id !== id) {
            continue;
        }
        currentObjectPosition = i;
        tmpObjects[i].coords = e.target._latlngs;
        oldObject = infoObjectsArray[i];
        break;
    }

    switch (type) {
        case House.name:
            houseData.show();
            $('#houseAddress').val(oldObject.address);
            $('#houseLatitude').val(oldObject.displayCoords[0]);
            $('#houseLongitude').val(oldObject.displayCoords[1]);
            $('#apartmentsCount').val(oldObject.apartmentsCount);
            $('#houseSquare').val(oldObject.square);
            $('#houseHistoricalData').val(oldObject.historicalData);
            break;

        case CommercialBuilding.name:
            commercialBuildingData.show();
            $('#commercialBuildingAddress').val(oldObject.address);
            $('#commercialBuildingLatitude').val(oldObject.displayCoords[0]);
            $('#commercialBuildingLongitude').val(oldObject.displayCoords[1]);
            $('#commercialBuildingName').val(oldObject.name);
            $('#commercialBuildingSquare').val(oldObject.square);
            $('#commercialBuildingHistoricalData').val(oldObject.historicalData);
            break;

        case LandPlot.name:
            landPlotData.show();
            $('#landPlotKind').val(oldObject.kind);
            $('#landPlotName').val(oldObject.name);
            $('#landPlotSquare').val(oldObject.square);
            $('#landPlotHistoricalData').val(oldObject.historicalData);
            break;

        default:
            break;
    }
}

function saveObjectsInfo() {
    tmpObjects = [];
    for (let i = 0; i < infoObjectsArray.length; i++) {
        tmpObjects.push(infoObjectsArray[i].copy());
    }
}

function saveNetInfo(infoArray = infoElectricityNetArray) {
    let tmp = [];
    for (let i = 0; i < infoArray.length; i++) {
        tmp.push(infoArray[i].copy());
    }
    return tmp;
}

function applyObjectChanges() {
    infoObjectsArray[currentObjectPosition].coords = tmpObjects[currentObjectPosition].coords;
    switch (infoObjectsArray[currentObjectPosition].type) {
        case House.name:
            infoObjectsArray[currentObjectPosition] = new House(
                $('#houseAddress').val(),
                infoObjectsArray[currentObjectPosition].coords,
                [$('#houseLatitude').val(), $('#houseLongitude').val()],
                $('#apartmentsCount').val(),
                $('#houseSquare').val(),
                $('#houseHistoricalData').val(),
                infoObjectsArray[currentObjectPosition].id);
            break;

        case CommercialBuilding.name:
            infoObjectsArray[currentObjectPosition] = new CommercialBuilding(
                $('#commercialBuildingName').val(),
                $('#commercialBuildingAddress').val(),
                infoObjectsArray[currentObjectPosition].coords,
                [$('#commercialBuildingLatitude').val(), $('#commercialBuildingLongitude').val()],
                $('#commercialBuildingSquare').val(),
                $('#commercialBuildingHistoricalData').val(),
                infoObjectsArray[currentObjectPosition].id);
            break;

        case LandPlot.name:
            infoObjectsArray[currentObjectPosition] = new LandPlot(
                $('#landPlotName').val(),
                infoObjectsArray[currentObjectPosition].coords,
                $('#landPlotKind').val(),
                $('#landPlotSquare').val(),
                $('#landPlotHistoricalData').val(),
                infoObjectsArray[currentObjectPosition].id);
            break;

        default:
            break;
    }

    currentObjectPosition = null;
}

function applyRoadChanges() {
    let width = parseInt($('#roadWeight').val());
    if (width !== width) {
        width = tmpRoads[currentRoadPosition].width;
    }

    infoRoadsArray[currentRoadPosition] = new Road(
        $('#roadName').val(),
        infoRoadsArray[currentRoadPosition].coords,
        $('#roadLong').val(),
        $('#roadLanesCount').val(),
        $('#roadOneWay').val(),
        $('#roadParkingInfo').val(),
        $('#roadHistoricalData').val(),
        $('#roadColor').val(),
        width,
        infoRoadsArray[currentRoadPosition].id);
}

function applyLineChanges(infoArray, tmpArray, currentPosition) {
    let width = parseInt($('#lineWeight').val());
    if (width !== width) {
        width = tmpArray[currentPosition].width;
    }

    infoArray[currentPosition] = new Line(tmpArray[currentPosition].coords,
        $('#lineData').val(),
        tmpArray[currentPosition].id,
        $('#lineColor').val(),
        width);

    currentPosition = null;
}

function getObjectsFromCookie(name = 'infoObjectsArray') {
    if ($.cookie(name) === null
        || $.cookie(name) === undefined) {
        return [];
    }

    let tmp = JSON.parse($.cookie(name));
    let result = [];
    for (let i = 0; i < tmp.length; i++) {
        switch (tmp[i].type) {
            case House.name:
                result.push(House.fromJSON(tmp[i]));
                break;

            case CommercialBuilding.name:
                result.push(CommercialBuilding.fromJSON(tmp[i]));
                break;

            case LandPlot.name:
                result.push(LandPlot.fromJSON(tmp[i]));
                break;

            default:
                break;
        }
    }
    return result;
}

function getRoadsFromCookie(name = 'infoRoadsArray') {
    if ($.cookie(name) === null
        || $.cookie(name) === undefined) {
        return [];
    }

    let tmp = JSON.parse($.cookie(name));
    let result = [];

    for (let i = 0; i < tmp.length; i++) {
        result.push(Road.fromJSON(tmp[i]));
    }

    return result;
}

function getNetsFromCookie(name = 'infoElectricityNetArray') {
    if ($.cookie(name) === null
        || $.cookie(name) === undefined) {
        return [];
    }

    let tmp = JSON.parse($.cookie(name));
    let result = [];
    for (let i = 0; i < tmp.length; i++) {
        result.push(new Line(tmp[i].coords, tmp[i].info, tmp[i].id, tmp[i].color, tmp[i].width));
    }
    return result;
}

function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName;

    for (let i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }

    return null;
}

function initMap(id, maxZoom) {
    map = L.map('map', {editable: true}).setView(mapCenter, 13);
    L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
        maxZoom: maxZoom,
        id: id,
        accessToken: accessToken
    }).addTo(map);
}

function initMapObjects() {
    editableLayers = L.featureGroup().addTo(map);
    infoTableContainer = $('#infoTableContainer');
    showObjectsInfo = false;
}

function initNetArrays() {
    infoElectricityNetArray = getNetsFromCookie('infoElectricityNetArray');
    infoGasNetArray = getNetsFromCookie('infoGasNetArray');
    infoWaterSupplyNetArray = getNetsFromCookie('infoWaterSupplyNetArray');
}

function saveEmailToCookie() {
    let email = getUrlParameter("email");
    if (email !== null && email !== undefined) {
        $.cookie("email", email, {path: "/", expires: 31});
    }
}

function setEmailFromCookie() {
    if ($.cookie("email") !== undefined) {
        $('#userLogin').html(`<i class="fa fa-user" aria-hidden="true"></i> ${$.cookie("email")}`);
        $('#loginLogout').html(`Выход <i class="fa fa-sign-out" aria-hidden="true">`).attr('href', '/logout/').click(function (e) {
            $.removeCookie('email', {path: "/", expires: 31});
        });
    }
}

function updateLineWeight(e, currentPolygone) {
    if (e.target.value === "") {
        currentPolygone.setStyle({
            weight: 1
        });
        return;
    }

    let weight = parseInt(e.target.value);
    if (weight !== weight) {
        return;
    }
    currentPolygone.setStyle({
        weight: weight
    });
}

function findCurrentPositionById(infoArray, id) {
    for (let i = 0; i < infoArray.length; i++) {
        if (infoArray[i].id !== id) {
            continue;
        }
        return i;
    }
    return null;
}
