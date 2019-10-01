$(document).ready(function () {
    $('#lineColor').colorpicker({
        horizontal: true
    }).on("changeColor", function (e) {
        if (e.value !== undefined) {
            currentPolygone.setStyle({
                color: e.value
            });
        }
    });

    infoRoadsArray = getRoadsFromCookie();
    initMap('mapbox.streets', 18);
    initMapObjects();
    roads = showLines(infoRoadsArray, false, false, false, true);

    $('.objectData').hide();
    infoTableContainer.hide();

    let currentPolygone = null;
    let lineOptions = $('#lineOptions');

    saveEmailToCookie();
    setEmailFromCookie();

    $('#polylineButton').click(function (e) {
        if (currentPolygone !== null) {
            map.removeLayer(currentPolygone);
            currentPolygone = null;
        }

        currentPolygone = L.polyline([
            [map.getCenter().lat - initRectangleSize, map.getCenter().lng - initRectangleSize],
            [map.getCenter().lat + initRectangleSize, map.getCenter().lng + initRectangleSize],
            [map.getCenter().lat + initRectangleSize + 0.003, map.getCenter().lng + initRectangleSize - 0.003]])
            .addTo(editableLayers);

        currentPolygone.setStyle({
            color: 'rgba(0, 0, 255)'
        });

        $('#map').css("height", "60vh");
        currentPolygone.enableEdit();
        currentPolygone.dragging.enable();
        lineOptions.show();
    });

    $('#delButton').click(function (e) {
        if (currentPolygone !== null) {
            map.removeLayer(currentPolygone);
            currentPolygone = null;
            $('#map').css("height", "82vh");
            lineOptions.hide();
        }
    });

    $('#lineWeight').on("input", function (e) {
        updateLineWeight(e, currentPolygone);
    });

    $('#lineOptionsSaveButton').click(function (e) {
        e.preventDefault();
        currentPolygone.disableEdit();
        currentPolygone.dragging.disable();
        let weight = 3;
        let color = 'rgba(0, 0, 255)';

        if (currentPolygone.options.weight !== undefined) {
            weight = currentPolygone.options.weight
        }

        if (currentPolygone.options.color !== undefined) {
            color = currentPolygone.options.color
        }

        let road = new Road();
        road.coords = currentPolygone._latlngs;
        road.setDataFromForm();
        road.color = color;
        road.width= weight;
        infoRoadsArray.push(road);
        saveNetsToCookie(infoRoadsArray, 'infoRoadsArray');

        currentPolygone.addTo(editableLayers).on('click', function (e) {
            L.DomEvent.stopPropagation(e);
            infoTableContainer.show();
            infoRoadsArray[infoRoadsArray.length-1].renderToTable('infoTable');
        });

        currentPolygone = null;
        $('#lineOptionsForm')[0].reset();
        lineOptions.hide();
        $('#map').css("height", "82vh");
    });

    map.on("click", function (e) {
        infoTableContainer.hide();
        $('#infoTable').empty();
    });

    $('#editButton').click(function (e) {
        window.location.href = `edit.html?type=${"roads"}`;
    });
});

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
