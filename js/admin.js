$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initObjectForms();
    initMapObjects();

    let currentPolygone = null;
    let selectObjType = $('#selectObjType');

    selectObjType.hide();
    $('.objectData').hide();
    infoTableContainer.hide();

    saveEmailToCookie();
    setEmailFromCookie();

    showObjects(false, false, false);

    map.on('click', function (e) {
        infoTableContainer.hide();
        $('#infoTable').empty();

        for (let i = 0; i < infoArray.length; i++) {
            if (infoArray[i].contains(e.latlng)) {
                infoArray[i].renderToTable('infoTable');
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

    $('#delButton').click(function (e) {
        if (currentPolygone !== null) {
            map.removeLayer(currentPolygone);
            currentPolygone = null;
            $('#map').css("height", "82vh");
            selectObjType.hide();
        }
    });

    $('.saveButton').click(function (e) {
        if (currentPolygone === null) {
            return;
        }
        e.preventDefault();

        switch (e.target.id) {
            case "houseSaveButton":
                let house = new House();
                house.coords = currentPolygone._latlngs;
                house.setDataFromForm();
                infoArray.push(house);
                houseData.hide();
                $('#houseInfoForm')[0].reset();
                break;

            case "commercialBuildingSaveButton":
                let commercialBuilding = new CommercialBuilding();
                commercialBuilding.coords = currentPolygone._latlngs;
                commercialBuilding.setDataFromForm();
                infoArray.push(commercialBuilding);
                commercialBuildingData.hide();
                $('#commercialBuildingInfoForm')[0].reset();
                break;

            case "roadSaveButton":
                let road = new Road();
                road.coords = currentPolygone._latlngs;
                road.setDataFromForm();
                infoArray.push(road);
                roadData.hide();
                $('#roadInfoForm')[0].reset();
                break;

            case "landPlotSaveButton":
                let area = new LandPlot();
                area.coords = currentPolygone._latlngs;
                area.setDataFromForm();
                infoArray.push(area);
                landPlotData.hide();
                $('#landPlotInfoForm')[0].reset();
                break;

            default:
                break
        }

        currentPolygone.disableEdit();
        currentPolygone.dragging.disable();
        currentPolygone = null;
        $('#map').css("height", "100vh");
        saveObjectsToCookie(infoArray);
    });

    $('.selectButton').click(function (e) {
        if (currentPolygone === null) {
            return;
        }
        e.preventDefault();

        switch (e.target.id) {
            case "houseButton":
                houseData.show();
                break;

            case "commercialBuildingButton":
                commercialBuildingData.show();
                break;

            case "roadButton":
                roadData.show();
                break;

            case "landPlotButton":
                landPlotData.show();
                break;

            default:
                break
        }

        selectObjType.hide();
    });
});

function saveObjectsToCookie(infoArray) {
    let tmp = [];
    for (let i = 0; i < infoArray.length; i++) {
        tmp.push(infoArray[i].toJSON());
    }
    $.cookie('infoArray', JSON.stringify(tmp), { expires: 7, path: '/' });
}