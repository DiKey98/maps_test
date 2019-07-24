$(document).ready(function () {
    let accessToken = 'pk.eyJ1IjoiZGlrZXkiLCJhIjoiY2pueDBxYmc4MDFjMTN2bzU5ZGVwM3JtZyJ9.Ngqk6QMrH0NlzNu52YcBuQ';
    let mapCenter = [54.5293, 36.2754];
    let map = L.map('map', {editable: true}).setView(mapCenter, 13);
    let initRectangleSize = 0.005;
    let currentPolygone = null;
    let editableLayers = L.featureGroup().addTo(map);
    let formData = $('#data');
    let infoTableContainer = $('#infoTableContainer');
    let infoArray = [];

    formData.hide();
    infoTableContainer.hide();
    L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: accessToken
    }).addTo(map);

    map.on('click', function (e) {
        $('#mapContainer').css("marginRight", "auto");
        infoTableContainer.hide();
        $('#infoTable').empty();
        for (let i = 0; i < infoArray.length; i++) {
            if (infoArray[i].contains(e.latlng)) {
                $('#infoTable').append(
                    ` <tbody>
                        <tr>
                            <td>Данные: </td>
                            <td>${infoArray[i].data1}</td>
                        </tr>
                        <tr>
                            <td>Данные:</td>
                            <td>${infoArray[i].data2}</td>
                        </tr>
                        <tr>
                            <td>Данные:</td>
                            <td>${infoArray[i].data3}</td>
                        </tr>
                        <tr>
                            <td>Данные:</td>
                            <td>${infoArray[i].data4}</td>
                        </tr>
                    </tbody>
                `);
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
        formData.show();
    });

    $('#delButton').click(function (e) {
        if (currentPolygone !== null) {
            map.removeLayer(currentPolygone);
            currentPolygone = null;
            $('#map').css("height", "80vh");
            formData.hide();
        }
    });

    $('#saveButton').click(function (e) {
        if (currentPolygone === null) {
            return;
        }

        e.preventDefault();
        let data1 = $('#data1').val();
        let data2 = $('#data2').val();
        let data3 = $('#data3').val();
        let data4 = $('#data4').val();
        infoArray.push(new ObjectInfo(data1, data2, data3, data4, currentPolygone._latlngs, currentPolygone._parts));
        map.removeLayer(currentPolygone);
        currentPolygone = null;
        $('#infoForm')[0].reset();
        $('#map').css("height", "80vh");
        formData.hide();
    });
});
