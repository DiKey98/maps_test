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
}