$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initMapObjects();
    initNetArrays();
    infoObjectsArray = getObjectsFromCookie();

    saveEmailToCookie();
    setEmailFromCookie();

    electricityNet = showLines(infoElectricityNetArray, false, false, false, true, false);
    waterSupplyNet = showLines(infoWaterSupplyNetArray, false, false, false, true, false);
    gasNet = showLines(infoGasNetArray, false, false, false, true, false);

    let overlayMap = {
        "Электрическая сеть": L.layerGroup(electricityNet),
        "Газовая сеть": L.layerGroup(gasNet),
        "Водопроводная сеть": L.layerGroup(waterSupplyNet),
        "Дороги": L.layerGroup(),
        "Информация об объектах": L.layerGroup(),
    };

    L.control.layers({}, overlayMap).addTo(map);

    infoTableContainer.hide();
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
        if (e.name === "Информация об объектах") {
            showObjectsInfo = true;
        }
    });

    map.on('overlayremove', function(e) {
        if (e.name === "Информация об объектах") {
            showObjectsInfo = false;
        }
    });
});
