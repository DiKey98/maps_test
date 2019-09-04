class LandPlot extends MapObject {
    name;
    kind;
    square;
    historicalData;

    constructor(name, coords, kind, square, historicalData, id = null) {
        super(coords, id);
        this.name = name;
        this.kind = kind;
        this.square = square;
        this.historicalData = historicalData;
    }

    copy() {
        super.copy();
        let obj = new LandPlot(this.name, this.coords, this.kind,
            this.square, this.historicalData);
        obj.id = this.id;
        return obj;
    }

    renderToTable(tableId) {
        super.renderToTable(tableId);
        $(`#${tableId}`).append(
            ` <tbody>
                <tr>
                    <td>Тип:</td>
                    <td>${this.kind}</td>
                </tr>
                <tr>
                    <td>Название: </td>
                    <td>${this.name}</tr>
                <tr>
                    <td>Площадь:</td>
                    <td>${this.square} км<sup>2</sup></tr>
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
        this.kind = $('#landPlotKind').val();
        this.name = $('#landPlotName').val();
        this.square = $('#landPlotSquare').val();
        this.historicalData = $('#landPlotHistoricalData').val();
    }

    toJSON() {
        return super.toJSON();
    }

    static fromJSON(jsonObj) {
        return new LandPlot(jsonObj.name, jsonObj.coords, jsonObj.kind,
            jsonObj.square, jsonObj.historicalData, jsonObj.id);
    }

    static renderInputForm() {
        $('body').append(`
        <div id="landPlotData" class="container-fluid objectData">
    <form id="landPlotInfoForm">
        <div class="form-row row">
            <div class="col">
                <select id="landPlotKind" class="form-control">
                    <option>Парк</option>
                    <option>Сквер</option>
                    <option>Пустой участок</option>
                </select>
            </div>
        </div>
        <div class="form-row row">
            <div class="col">
                <input id="landPlotName" type="text" class="form-control" placeholder="Название">
            </div>
            <div class="col">
                <input id="landPlotSquare" type="text" class="form-control" placeholder="Площадь (кв. км)">
            </div>
        </div>
        <div class="form-row row">
            <textarea id="landPlotHistoricalData" type="text" class="form-control"
                      placeholder="Исторические сведения" rows="5"></textarea>
        </div>
        <button id="landPlotSaveButton" type="submit" class="btn btn-outline-success btn-sm btn-block saveButton">Сохранить</button>
    </form>
</div>
        `)
    }

    static removeInputForm() {
        $("#landPlotData").remove();
    }
}