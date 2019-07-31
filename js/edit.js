let saveEdits;
let saveEditsButton;
let rejectEditsButton;
let infoTableContainer;
let editableLayers;
let tmp = [];

$(document).ready(function () {
    let accessToken = 'pk.eyJ1IjoiZGlrZXkiLCJhIjoiY2pueDBxYmc4MDFjMTN2bzU5ZGVwM3JtZyJ9.Ngqk6QMrH0NlzNu52YcBuQ';
    let mapCenter = [54.5293, 36.2754];
    let map = L.map('map', {editable: true}).setView(mapCenter, 13);
    infoArray = getObjectsFromCookie();

    L.tileLayer(`https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=${accessToken}`, {
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: accessToken
    }).addTo(map);

    saveEditsButton = $('#saveEditsButton');
    rejectEditsButton = $('#rejectEditsButton');
    saveEdits = $('#saveEdits');
    infoTableContainer = $('#infoTableContainer');
    editableLayers = L.featureGroup().addTo(map);

    saveEdits.hide();
    infoTableContainer.hide();

    saveEditsButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        applyObjectsChanges();
        saveObjectsToCookie(infoArray);
        editableLayers.clearLayers();
        showObjects();
        alert("Изменения сохранены!");
    });

    rejectEditsButton.click(function (e) {
        e.preventDefault();
        saveEdits.hide();
        editableLayers.clearLayers();
        showObjects();
        saveObjectsInfo();
    });

    showObjects();
    saveObjectsInfo();
});

function getObjectsFromCookie() {
    if ($.cookie('infoArray') === null
        || $.cookie('infoArray') === undefined ) {
        return [];
    }

    let tmp = JSON.parse($.cookie('infoArray'));
    let result = [];
    for (let i = 0; i < tmp.length; i++) {
        switch (tmp[i].type) {
            case House.name:
                result.push(House.fromJSON(tmp[i]));
                break;

            case CommercialBuilding.name:
                result.push(CommercialBuilding.fromJSON(tmp[i]));
                break;

            case Road.name:
                result.push(Road.fromJSON(tmp[i]));
                break;

            case LandPlot.name:
                result.push(LandPlot.fromJSON(tmp[i]));
                break;

            default:
                break;
        }
    }
    return result;
}

function editHandler (id, e) {
    saveEdits.show();
    for (let i = 0; i < infoArray.length; i++) {
        if (infoArray[i].id !== id) {
            continue;
        }
        tmp[i].coords = e.target._latlngs;
        break;
    }
}

function showObjects() {
    for (let i = 0; i < infoArray.length; i++) {
        let coords = [];
        for (let j = 0; j < infoArray[i].coords[0].length; j++) {
            coords.push([infoArray[i].coords[0][j].lat, infoArray[i].coords[0][j].lng]);
        }
        let polygon = L.polygon(coords).addTo(editableLayers);
        polygon.enableEdit();
        polygon.dragging.enable();
        polygon.on('editable:editing', editHandler.bind(null, infoArray[i].id));
    }
}

function saveObjectsInfo() {
    tmp = [];
    for (let i = 0; i < infoArray.length; i++) {
        tmp.push(infoArray[i].copy());
    }
}

function applyObjectsChanges() {
    infoArray = [];
    for (let i = 0; i < tmp.length; i++) {
        infoArray.push(tmp[i].copy());
    }
}

function saveObjectsToCookie(infoArray) {
    let result = [];
    for (let i = 0; i < infoArray.length; i++) {
        result.push(infoArray[i].toJSON());
        for(let k = 0; k < result[i].coords[0].length; k++) {
            result[i].coords[0][k] = {
                lat: result[i].coords[0][k].lat,
                lng: result[i].coords[0][k].lng
            }
        }
    }
    $.cookie('infoArray', JSON.stringify(result), { expires: 7, path: '/' });
}