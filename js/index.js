$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initMapObjects();

    saveEmailToCookie();
    setEmailFromCookie();

    electricityNet = showLines(infoElectricityNetArray, electricityNet, false, false, false, true, false);
    waterSupplyNet = showLines(infoWaterSupplyNetArray, waterSupplyNet, false, false, false, true, false);
    gasNet = showLines(infoGasNetArray, gasNet, false, false, false, true, false);

    console.log(electricityNet);
    console.log(waterSupplyNet);
    console.log(gasNet);
    //
    // console.log(infoElectricityNetArray);
    // console.log(infoWaterSupplyNetArray);
    // console.log(infoGasNetArray);

    let overlayMap = {
        "Эл. сеть": L.layerGroup(electricityNet),
        "Газовая сеть": L.layerGroup(gasNet),
        "Водопроводная сеть": L.layerGroup(waterSupplyNet)
    };

    L.control.layers({}, overlayMap).addTo(map);

    infoTableContainer.hide();
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
});

// TODO переделать редактирование с учетом 3-х массивов!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!