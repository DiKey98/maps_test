class ObjectInfo {
    data1;
    data2;
    data3;
    data4;
    coords;
    coordsXY;

    constructor(data1, data2, data3, data4, coords = [], coordsXY = []) {
        this.data1 = data1;
        this.data2 = data2;
        this.data3 = data3;
        this.data4 = data4;
        this.coords = coords;
        this.coordsXY = coordsXY;
    }

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
