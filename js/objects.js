$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initMapObjects();
    infoObjectsArray = getObjectsFromCookie();

    let currentPolygone = null;
    let selectObjType = $('#selectObjType');

    selectObjType.hide();
    $('.objectData').hide();
    infoTableContainer.hide();

    saveEmailToCookie();
    setEmailFromCookie();
    showObjects(infoObjectsArray, false, false, false, true);

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
        currentPolygone = null;
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

            // case "roadButton":
            //     Road.renderInputForm();
            //     $('#roadSaveButton').click(function (e) {
            //         if (currentPolygone === null) {
            //             return;
            //         }
            //         e.preventDefault();
            //         let road = new Road();
            //         road.coords = currentPolygone._latlngs;
            //         road.setDataFromForm();
            //         infoObjectsArray.push(road);
            //         Road.removeInputForm();
            //         save(currentPolygone);
            //     });
            //     break;

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
    $.cookie(name, JSON.stringify(tmp), {expires: 31, path: '/'});
}

function save(currentPolygone) {
    currentPolygone.disableEdit();
    currentPolygone.dragging.disable();
    currentPolygone = null;
    $('#map').css("height", "82vh");
    saveObjectsToCookie(infoObjectsArray);
}