class Line {
    id;
    coords;
    type;
    info;
    color;
    width;

    constructor(coords, info, id = null, color = null, width = null) {
        this.id = id === null ? lil.uuid() : id;
        this.coords = coords;
        this.type = this.constructor.name;
        this.info = info;
        this.color = color;
        this.width = width;
    }

    copy(){
        return new Line(this.coords, this.info, this.id, this.color, this.width);
    };

    contains(latlng) {
        for(let i = 0; i < this.coords.length - 1; i++) {
            if (Line.containsInSegment(this.coords[i], this.coords[i+1], latlng)) {
                return true;
            }
        }
        console.log('false');
        return false;
    };

    static containsInSegment(begin, end, latlng) {
        let crossProduct = (latlng.lng - begin.lng) * (end.lat - begin.lat) - (latlng.lat - begin.lat) * (end.lng - begin.lng);
        if (Math.abs(crossProduct) !== 0) {
            return false;
        }

        let dotProduct = (latlng.lat - begin.lat) * (end.lat - begin.lat) + (latlng.lng - begin.lng)*(end.lng - begin.lng);
        if (dotProduct < 0) {
            return false;
        }

        let squaredLength = (end.lat - begin.lat)*(end.lat - begin.lat) + (end.lng - begin.lng)*(end.lng - begin.lng);
        return dotProduct <= squaredLength;
    }

    renderToTable(tableId) {
        $(`#${tableId}`).append(
            ` <tbody>
                <tr>
                    <td>Информация: </td>
                    <td>${this.info}</td>
                </tr>
             </tbody>
        `);
    }

    toJSON(){
        let tmp = {};
        for(let key in this) {
            tmp[key] = this[key];
        }
        tmp.type = this.type;
        return tmp;
    };
}
