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

    initNetArrays();
    initMap('mapbox.streets', 18);
    initMapObjects();

    let netType = getUrlParameter("nets");
    showNets(netType);

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

        if (currentPolygone.options.weight !== undefined) {
            weight = currentPolygone.options.weight
        }

        switch (netType) {
            case "gas":
                infoGasNetArray.push(new Line(currentPolygone._latlngs,
                    $('#lineData').val(), null, currentPolygone.options.color, weight));
                saveObjectsToCookie(infoGasNetArray, 'infoGasNetArray');
                break;

            case "water":
                infoWaterSupplyNetArray.push(new Line(currentPolygone._latlngs,
                    $('#lineData').val(), null, currentPolygone.options.color, weight));
                saveObjectsToCookie(infoWaterSupplyNetArray, 'infoWaterSupplyNetArray');
                break;

            default:
                infoElectricityNetArray.push(new Line(currentPolygone._latlngs,
                    $('#lineData').val(), null, currentPolygone.options.color, weight));
                saveObjectsToCookie(infoElectricityNetArray, 'infoElectricityNetArray');
                break;
        }

        currentPolygone.addTo(editableLayers).on('click', function (e) {
            L.DomEvent.stopPropagation(e);
            infoTableContainer.show();
            switch (netType) {
                case "gas":
                    infoGasNetArray[infoGasNetArray.length-1].renderToTable('infoTable');
                    break;

                case "water":
                    infoWaterSupplyNetArray[infoWaterSupplyNetArray.length-1].renderToTable('infoTable');
                    break;

                default:
                    infoElectricityNetArray[infoElectricityNetArray.length-1].renderToTable('infoTable');
                    break;
            }
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
        window.location.href = `edit.html?type=${netType}`;
    });
});

function showNets(netType) {
    switch (netType) {
        case "gas":
            $('title').text("Газовые сети");
            gasNet = showLines(infoGasNetArray, false, false, false, true);
            break;

        case "water":
            $('title').text("Водопроводные сети");
            waterSupplyNet = showLines(infoWaterSupplyNetArray, false, false, false, true);
            break;

        default:
            $('title').text("Электрические сети");
            electricityNet = showLines(infoElectricityNetArray, false, false, false, true);
            break;
    }
}

function saveObjectsToCookie(infoArray, name = 'infoObjectsArray') {
    let tmp = [];
    for (let i = 0; i < infoArray.length; i++) {
        tmp.push(infoArray[i].toJSON());
    }
    $.cookie(name, JSON.stringify(tmp), {expires: 31, path: '/'});
}
