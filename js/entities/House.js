class House extends MapObject {
    address;
    displayCoords;
    apartmentsCount;
    square;
    historicalData;

    constructor(address, coords, displayCoords, apartmentsCount, square, historicalData, id = null) {
        super(coords, id);
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

    toJSON() {
        return super.toJSON();
    }

    static fromJSON(jsonObj) {
        return new House(jsonObj.address, jsonObj.coords, jsonObj.displayCoords,
            jsonObj.apartmentsCount, jsonObj.square, jsonObj.historicalData, jsonObj.id);
    }

    static renderInputForm(withSaveButton = true) {
        let form = `<div id="houseData" class="container-fluid objectData">
    <form id="houseInfoForm">
        <div class="form-row row">
            <div class="col">
                <input id="houseAddress" type="text" class="form-control" placeholder="Адрес">
            </div>
        </div>
        <div class="form-row row">
            <div class="col">
                <input id="houseLatitude" type="text" class="form-control" placeholder="Широта">
            </div>
            <div class="col">
                <input id="houseLongitude" type="text" class="form-control" placeholder="Долгота">
            </div>
        </div>
        <div class="form-row row">
            <div class="col">
                <input id="apartmentsCount" type="text" class="form-control" placeholder="Число квартир">
            </div>
            <div class="col">
                <input id="houseSquare" type="text" class="form-control" placeholder="Площадь (кв. метры)">
            </div>
        </div>
        <div class="form-row row">
            <textarea id="houseHistoricalData" type="text" class="form-control" placeholder="Исторические сведения" rows="5"></textarea>
        </div>
    `;

        let saveButton = `<button id="houseSaveButton" type="submit" class="btn btn-outline-success btn-sm btn-block saveButton">Сохранить</button>`;
        let end = `</form></div>`;

        if (withSaveButton) {
            form += saveButton;
        }
        form += end;
        $('body').append(form);
    }

    static removeInputForm() {
        $("#houseData").remove();
    }
}