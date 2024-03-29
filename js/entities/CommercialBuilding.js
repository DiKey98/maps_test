class CommercialBuilding extends MapObject{
    name;
    address;
    displayCoords;
    square;
    historicalData;

    constructor(name, address, coords, displayCoords, square, historicalData, id = null) {
        super(coords, id);
        this.name = name;
        this.address = address;
        this.displayCoords = displayCoords;
        this.square = square;
        this.historicalData = historicalData;
    }

    copy() {
        super.copy();
        let obj = new CommercialBuilding(this.name, this.address, this.coords,
            this.displayCoords, this.square, this.historicalData);
        obj.id = this.id;
        return obj;
    }

    renderToTable(tableId) {
        super.renderToTable(tableId);
        $(`#${tableId}`).append(
            ` <tbody>
                <tr>
                    <td>Тип:</td>
                    <td>Коммерческое здание</td>
                </tr>
                <tr>
                    <td>Название:</td>
                    <td>${this.name}</tr>
                <tr>
                    <td>Адрес: </td>
                    <td>${this.address}</td>
                </tr>
                <tr>
                    <td>Координаты:</td>
                    <td>${this.displayCoords[0]} ${this.displayCoords[1]}</td>
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
        this.name = $('#commercialBuildingName').val();
        this.address = $('#commercialBuildingAddress').val();
        let lat = $('#commercialBuildingLatitude').val();
        let lng = $('#commercialBuildingLongitude').val();
        this.displayCoords = [lat, lng];
        this.square = $('#commercialBuildingSquare').val();
        this.historicalData = $('#commercialBuildingHistoricalData').val();
    }

    toJSON() {
        return super.toJSON();
    }

    static fromJSON(jsonObj) {
        return new CommercialBuilding(jsonObj.name, jsonObj.address, jsonObj.coords,
            jsonObj.displayCoords, jsonObj.square, jsonObj.historicalData, jsonObj.id);
    }

    static renderInputForm() {
        $('body').append(
            `<div id="commercialBuildingData" class="container-fluid objectData">
    <form id="commercialBuildingInfoForm">
        <div class="form-row row">
            <div class="col">
                <input id="commercialBuildingAddress" type="text" class="form-control" placeholder="Адрес">
            </div>
        </div>
        <div class="form-row row">
            <div class="col">
                <input id="commercialBuildingLatitude" type="text" class="form-control" placeholder="Широта">
            </div>
            <div class="col">
                <input id="commercialBuildingLongitude" type="text" class="form-control" placeholder="Долгота">
            </div>
        </div>
        <div class="form-row row">
            <div class="col">
                <input id="commercialBuildingName" type="text" class="form-control" placeholder="Название">
            </div>
            <div class="col">
                <input id="commercialBuildingSquare" type="text" class="form-control" placeholder="Площадь (кв. метры)">
            </div>
        </div>
        <div class="form-row row">
            <textarea id="commercialBuildingHistoricalData" type="text" class="form-control"
                      placeholder="Исторические сведения" rows="5"></textarea>
        </div>
        <button id="commercialBuildingSaveButton" type="submit" class="btn btn-outline-success btn-sm btn-block saveButton">Сохранить</button>
    </form>
</div>`);
    }

    static removeInputForm() {
        $("#commercialBuildingData").remove();
    }
}