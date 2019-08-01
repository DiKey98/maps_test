function showObjects(bindEditHandler = true, enableEdit = true, enableDragging = true) {
    for (let i = 0; i < infoArray.length; i++) {
        let coords = [];
        for (let j = 0; j < infoArray[i].coords[0].length; j++) {
            coords.push([infoArray[i].coords[0][j].lat, infoArray[i].coords[0][j].lng]);
        }
        let polygon = L.polygon(coords).addTo(editableLayers);

        if(enableDragging) {
            polygon.dragging.enable();
        }

        if(enableEdit) {
            polygon.enableEdit();
        }

        if(bindEditHandler) {
            polygon.on('editable:editing click', editHandler.bind(null, infoArray[i].id, infoArray[i].type));
        }
    }
}

function editHandler (id, type, e) {
    $('.objectData').hide();
    saveEdits.show();

    let oldObject;
    for (let i = 0; i < infoArray.length; i++) {
        if (infoArray[i].id !== id) {
            continue;
        }
        currentPosition = i;
        tmp[i].coords = e.target._latlngs;
        oldObject = infoArray[i];
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

        case Road.name:
            roadData.show();
            $('#roadName').val(oldObject.name);
            $('#roadLong').val(oldObject.long);
            $('#roadLanesCount').val(oldObject.lanesCount);
            $('#roadOneWay').val(oldObject.oneWay);
            $('#roadParkingInfo').val(oldObject.parkingInfo);
            $('#roadHistoricalData').val(oldObject.historicalData);
            break;

        default:
            break;
    }
}

function saveObjectsInfo() {
    tmp = [];
    for (let i = 0; i < infoArray.length; i++) {
        tmp.push(infoArray[i].copy());
    }
}

function applyObjectsChanges() {
    infoArray = [];
    for (let i = 0; i < tmp.length; i++) {
        infoArray.push(tmp[i].copy());
    }

    switch (infoArray[currentPosition].type) {
        case House.name:
            infoArray[currentPosition] = new House(
                $('#houseAddress').val(),
                infoArray[currentPosition].coords,
                [$('#houseLatitude').val(), $('#houseLongitude').val()],
                $('#apartmentsCount').val(),
                $('#houseSquare').val(),
                $('#houseHistoricalData').val(),
                infoArray[currentPosition].id);
            break;

        case CommercialBuilding.name:
            infoArray[currentPosition] = new CommercialBuilding(
                $('#commercialBuildingName').val(),
                $('#commercialBuildingAddress').val(),
                infoArray[currentPosition].coords,
                [$('#commercialBuildingLatitude').val(), $('#commercialBuildingLongitude').val()],
                $('#commercialBuildingSquare').val(),
                $('#commercialBuildingHistoricalData').val(),
                infoArray[currentPosition].id);
            break;

        case LandPlot.name:
            infoArray[currentPosition] = new LandPlot(
                $('#landPlotName').val(),
                infoArray[currentPosition].coords,
                $('#landPlotKind').val(),
                $('#landPlotSquare').val(),
                $('#landPlotHistoricalData').val(),
                infoArray[currentPosition].id);
            break;

        case Road.name:
            infoArray[currentPosition] = new Road(
                $('#roadName').val(),
                infoArray[currentPosition].coords,
                $('#roadLong').val(),
                $('#roadLanesCount').val(),
                $('#roadOneWay').val(),
                $('#roadParkingInfo').val(),
                $('#roadHistoricalData').val(),
                infoArray[currentPosition].id);
            break;

        default:
            break;
    }
}

function getObjectsFromCookie() {
    if ($.cookie('infoArray') === null
        || $.cookie('infoArray') === undefined ) {
        return [];
    }

    let tmp = JSON.parse($.cookie('infoArray'));
    let result = [];
    for (let i = 0; i < tmp.length; i++) {
        switch (tmp[i].type) {
            case House.name:
                result.push(House.fromJSON(tmp[i]));
                break;

            case CommercialBuilding.name:
                result.push(CommercialBuilding.fromJSON(tmp[i]));
                break;

            case Road.name:
                result.push(Road.fromJSON(tmp[i]));
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