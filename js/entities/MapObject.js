class MapObject {
    id;
    coords;

    constructor(coords, id = null) {
        this.id = id === null ? lil.uuid() : id;
        this.coords = coords;
    }

    copy(){};
    renderToTable(tableId){};
    setDataFromForm(){};

    toJSON(){
        let tmp = {};
        for(let key in this) {
            tmp[key] = this[key];
        }
        tmp.type = this.constructor.name;
        return tmp;
    };

    contains(latlng) {
        let polyPoints = this.coords[0];
        let x = latlng.lat;
        let y = latlng.lng;
        let inside = false;

        for (let i = 0, j = polyPoints.length - 1; i < polyPoints.length; j = i++) {
            let xi = polyPoints[i].lat, yi = polyPoints[i].lng;
            let xj = polyPoints[j].lat, yj = polyPoints[j].lng;
            let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) {
                inside = !inside;
            }
        }

        return inside;
    }
}