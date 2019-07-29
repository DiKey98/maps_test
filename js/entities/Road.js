class Road extends MapObject {
    name;
    long;
    lanesCount;
    oneWay;
    parkingInfo;
    historicalData;

    constructor(name, coords, long, lanesCount, oneWay, parkingInfo, historicalData) {
        super(coords);
        this.name = name;
        this.long = long;
        this.lanesCount = lanesCount;
        this.oneWay = oneWay;
        this.parkingInfo = parkingInfo;
        this.historicalData = historicalData;
    }

    copy() {
        super.copy();
        let obj = new Road(this.name, this.coords, this.long,
            this.lanesCount, this.oneWay, this.parkingInfo, this.historicalData);
        obj.id = this.id;
        return obj;
    }

    renderToTable(tableId) {
        super.renderToTable(tableId);
        $(`#${tableId}`).append(
            ` <tbody>
                <tr>
                    <td>Тип:</td>
                    <td>Дорога</td>
                </tr>
                <tr>
                    <td>Название: </td>
                    <td>${this.name}</tr>
                <tr>
                    <td>Длина:</td>
                    <td>${this.long} км</td>
                </tr>
                <tr>
                    <td>Число полос:</td>
                    <td>${this.lanesCount}</tr>
                <tr>
                    <td>Движение:</td>
                    <td>${this.oneWay}</td>
                </tr>
                <tr>
                    <td>Информация о парковке:</td>
                    <td>${this.parkingInfo}</td>
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
        this.name = $('#roadName').val();
        this.long = $('#roadLong').val();
        this.lanesCount = $('#roadLanesCount').val();
        this.oneWay = $('#roadOneWay').val();
        this.parkingInfo = $('#roadParkingInfo').val();
        this.historicalData = $('#roadHistoricalData').val();
    }
}