$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initMapObjects();
    initNetArrays();
    infoObjectsArray = getObjectsFromCookie();
    infoRoadsArray = getRoadsFromCookie();

    $('.objectData').hide();
    infoTableContainer.hide();

    saveEmailToCookie();
    setEmailFromCookie();

    electricityNet = showLines(infoElectricityNetArray, false, false, false, true, false);
    waterSupplyNet = showLines(infoWaterSupplyNetArray, false, false, false, true, false);
    gasNet = showLines(infoGasNetArray, false, false, false, true, false);
    mapObjects = showObjects(infoObjectsArray, false, false, false, false);
    roads = showLines(infoRoadsArray, false, false, false, true, false);

    let overlayMap = {
        "Электрическая сеть": L.layerGroup(electricityNet),
        "Газовая сеть": L.layerGroup(gasNet),
        "Водопроводная сеть": L.layerGroup(waterSupplyNet),
        "Дороги": L.layerGroup(roads),
        "Информация об объектах": L.layerGroup(mapObjects),
    };
    L.control.layers({}, overlayMap).addTo(map);

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
        console.log(e.name);
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
