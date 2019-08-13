$(document).ready(function () {
    initMap('mapbox.streets', 18);
    initMapObjects();

    infoTableContainer.hide();
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
});