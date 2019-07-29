class House extends MapObject {
    address;
    displayCoords;
    apartmentsCount;
    square;
    historicalData;

    constructor(address, coords, displayCoords, apartmentsCount, square, historicalData) {
        super(coords);
        this.address = address;
        this.displayCoords = displayCoords;
        this.apartmentsCount = apartmentsCount;
        this.square = square;
        this.historicalData = historicalData;
    }

    copy() {
        super.copy();
        let obj = new House(this.address, this.coords, this.displayCoords,
            this.apartmentsCount, this.square, this.historicalData);
        obj.id = this.id;
        return obj;
    }

    renderToTable(tableId) {
        super.renderToTable(tableId);
        $(`#${tableId}`).append(
            ` <tbody>
                <tr>
                    <td>Тип:</td>
                    <td>Жилое здание</td>
                </tr>
                <tr>
                    <td>Адрес: </td>
                    <td>${this.address}</td>
                </tr>
                <tr>
                    <td>Координаты:</td>
                    <td>${this.displayCoords[0]} ${this.displayCoords[1]}</td>
                </tr>
                <tr>
                    <td>Число квартир:</td>
                    <td>${this.apartmentsCount}</td>
                </tr>
                <tr>
                    <td>Площадь:</td>
                    <td>${this.square} м<sup>2</sup></td>
                </tr>
                <tr>
                    <td>Исторические сведения:</td>
                    <td>${this.historicalData}</td>
                </tr>
             </tbody>
        `);
    }

    contains(latlng) {
        return super.contains(latlng);
    }

    setDataFromForm() {
        super.setDataFromForm();
        this.address = $('#houseAddress').val();
        let lat = $('#houseLatitude').val();
        let lng = $('#houseLongitude').val();
        this.displayCoords = [lat, lng];
        this.apartmentsCount = $('#apartmentsCount').val();
        this.square = $('#houseSquare').val();
        this.historicalData = $('#houseHistoricalData').val();
    }
}