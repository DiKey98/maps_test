$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initMapObjects();

    saveEmailToCookie();
    setEmailFromCookie();

    showLines(infoLinesArray, false, false, false, true);

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