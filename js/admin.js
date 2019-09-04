$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initMapObjects();

    let currentPolygone = null;
    let selectObjType = $('#selectObjType');
    let lineOptions = $('#lineOptions');

    selectObjType.hide();
    $('.objectData').hide();
    infoTableContainer.hide();

    saveEmailToCookie();
    setEmailFromCookie();

    showObjects(infoObjectsArray, false, false, false, true);

    showLines(infoElectricityNetArray, electricityNet, false, false, false, true);
    showLines(infoGasNetArray, gasNet, false, false, false, true);
    showLines(infoWaterSupplyNetArray, waterSupplyNet, false, false, false, true);

    map.on('click', function (e) {
        infoTableContainer.hide();
        $('#infoTable').empty();

        for (let i = 0; i < infoObjectsArray.length; i++) {
            if (infoObjectsArray[i].contains(e.latlng)) {
                infoObjectsArray[i].renderToTable('infoTable');
                infoTableContainer.show();
                break;
            }
        }
    });

    $('#rectButton').click(function (e) {
        if (currentPolygone !== null) {
            map.removeLayer(currentPolygone);
            currentPolygone = null;
        }

        infoTableContainer.hide();
        $('#infoTable').empty();

        currentPolygone = L.polygon([
            [map.getCenter().lat - initRectangleSize, map.getCenter().lng - initRectangleSize],
            [map.getCenter().lat + initRectangleSize, map.getCenter().lng + initRectangleSize],
            [map.getCenter().lat + initRectangleSize + 0.003, map.getCenter().lng + initRectangleSize - 0.003]])
            .addTo(editableLayers);

        $('#map').css("height", "60vh");
        currentPolygone.enableEdit();
        currentPolygone.dragging.enable();
        selectObjType.show();
    });

    $('#polylineButton').click(function (e) {
        if (currentPolygone !== null) {
            map.removeLayer(currentPolygone);
            currentPolygone = null;
        }

        infoTableContainer.hide();
        selectObjType.hide();
        $('#infoTable').empty();

        currentPolygone = L.polyline([
            [map.getCenter().lat - initRectangleSize, map.getCenter().lng - initRectangleSize],
            [map.getCenter().lat + initRectangleSize, map.getCenter().lng + initRectangleSize],
            [map.getCenter().lat + initRectangleSize + 0.003, map.getCenter().lng + initRectangleSize - 0.003]])
            .addTo(editableLayers);

        currentPolygone.setStyle({
            color: 'blue'
        });

        $('#map').css("height", "60vh");
        currentPolygone.enableEdit();
        currentPolygone.dragging.enable();
        lineOptions.show();
    });

    $('#lineColor').change(function (e) {
        updateColor(e, currentPolygone);
    });

    $('#lineWeight').on("input", function (e) {
        updateLineWeight(e, currentPolygone);
    });

    $('#lineOptionsSaveButton').click(function (e) {
        e.preventDefault();
        currentPolygone.disableEdit();
        currentPolygone.dragging.disable();
        let weight = 3;
        if (currentPolygone.options.weight !== undefined) {
            weight = currentPolygone.options.weight
        }

        switch (currentPolygone.options.color) {
            case "blue":
                infoElectricityNetArray.push(new Line(currentPolygone._latlngs,
                    $('#lineData').val(), null, currentPolygone.options.color, weight));
                saveObjectsToCookie(infoElectricityNetArray, 'infoElectricityNetArray');
                break;

            case "red":
                infoGasNetArray.push(new Line(currentPolygone._latlngs,
                    $('#lineData').val(), null, currentPolygone.options.color, weight));
                saveObjectsToCookie(infoGasNetArray, 'infoGasNetArray');
                break;

            case "green":
                infoWaterSupplyNetArray.push(new Line(currentPolygone._latlngs,
                    $('#lineData').val(), null, currentPolygone.options.color, weight));
                saveObjectsToCookie(infoWaterSupplyNetArray, 'infoWaterSupplyNetArray');
                break;
        }

        //infoElectricityNetArray.push(new Line(currentPolygone._latlngs, $('#lineData').val(), null, currentPolygone.options.color, weight));
        currentPolygone = null;
        $('#lineOptionsForm')[0].reset();
        lineOptions.hide();
        $('#map').css("height", "82vh");
        //saveObjectsToCookie(infoElectricityNetArray, 'infoElectricityNetArray');
    });

    $('#delButton').click(function (e) {
        if (currentPolygone !== null) {
            map.removeLayer(currentPolygone);
            currentPolygone = null;
            $('#map').css("height", "82vh");
            selectObjType.hide();
        }
    });

    $('.selectButton').click(function (e) {
        if (currentPolygone === null) {
            return;
        }
        e.preventDefault();

        switch (e.target.id) {
            case "houseButton":
                House.renderInputForm();
                $('#houseSaveButton').click(function (e) {
                    if (currentPolygone === null) {
                        return;
                    }
                    e.preventDefault();
                    let house = new House();
                    house.coords = currentPolygone._latlngs;
                    house.setDataFromForm();
                    infoObjectsArray.push(house);
                    House.removeInputForm();
                    save(currentPolygone);
                });
                break;

            case "commercialBuildingButton":
                CommercialBuilding.renderInputForm();
                $('#commercialBuildingSaveButton').click(function (e) {
                    if (currentPolygone === null) {
                        return;
                    }
                    e.preventDefault();
                    let commercialBuilding = new CommercialBuilding();
                    commercialBuilding.coords = currentPolygone._latlngs;
                    commercialBuilding.setDataFromForm();
                    infoObjectsArray.push(commercialBuilding);
                    CommercialBuilding.removeInputForm();
                    save(currentPolygone);
                });
                break;

            case "roadButton":
                Road.renderInputForm();
                $('#roadSaveButton').click(function (e) {
                    if (currentPolygone === null) {
                        return;
                    }
                    e.preventDefault();
                    let road = new Road();
                    road.coords = currentPolygone._latlngs;
                    road.setDataFromForm();
                    infoObjectsArray.push(road);
                    Road.removeInputForm();
                    save(currentPolygone);
                });
                break;

            case "landPlotButton":
                LandPlot.renderInputForm();
                $('#landPlotSaveButton').click(function (e) {
                    if (currentPolygone === null) {
                        return;
                    }
                    e.preventDefault();
                    let area = new LandPlot();
                    area.coords = currentPolygone._latlngs;
                    area.setDataFromForm();
                    infoObjectsArray.push(area);
                    LandPlot.removeInputForm();
                    save(currentPolygone);
                });
                break;

            default:
                break
        }

        selectObjType.hide();
    });
});

function saveObjectsToCookie(infoArray, name = 'infoObjectsArray') {
    let tmp = [];
    for (let i = 0; i < infoArray.length; i++) {
        tmp.push(infoArray[i].toJSON());
    }
    $.cookie(name, JSON.stringify(tmp), {expires: 7, path: '/'});
}

function save(currentPolygone) {
    currentPolygone.disableEdit();
    currentPolygone.dragging.disable();
    currentPolygone = null;
    $('#map').css("height", "100vh");
    saveObjectsToCookie(infoObjectsArray);
}