class Road {
    name;
    long;
    lanesCount;
    oneWay;
    parkingInfo;
    historicalData;
    color;
    width;
    coords;
    type;

    constructor(name, coords, long, lanesCount, oneWay, parkingInfo, historicalData, color, width, id = null) {
        this.coords = coords;
        this.name = name;
        this.long = long;
        this.lanesCount = lanesCount;
        this.oneWay = oneWay;
        this.parkingInfo = parkingInfo;
        this.historicalData = historicalData;
        this.color = color;
        this.width = width;
        this.id = id;
        this.type = this.constructor.name;
    }

    copy() {
        let obj = new Road(this.name, this.coords, this.long,
            this.lanesCount, this.oneWay, this.parkingInfo, this.historicalData,
            this.color, this.width);
        obj.id = this.id;
        return obj;
    }

    renderToTable(tableId) {
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

    setDataFromForm() {
        this.name = $('#roadName').val();
        this.long = $('#roadLong').val();
        this.lanesCount = $('#roadLanesCount').val();
        this.oneWay = $('#roadOneWay').val();
        this.parkingInfo = $('#roadParkingInfo').val();
        this.historicalData = $('#roadHistoricalData').val();
    }

    toJSON(){
        let tmp = {};
        for(let key in this) {
            tmp[key] = this[key];
        }
        return tmp;
    };

    static fromJSON(jsonObj) {
        return new Road(jsonObj.name, jsonObj.coords, jsonObj.long, jsonObj.lanesCount,
            jsonObj.oneWay, jsonObj.parkingInfo, jsonObj.historicalData, jsonObj.color, jsonObj.width, jsonObj.id);
    }

    // static renderInputForm(withSaveButton = true) {
    //     let form = `
    //     <div id="roadData" class="container-fluid objectData">
    // <form id="roadInfoForm">
    //     <div class="form-row row">
    //         <div class="col">
    //             <input id="roadName" type="text" class="form-control" placeholder="Название">
    //         </div>
    //         <div class="col">
    //             <input id="roadLong" type="text" class="form-control" placeholder="Длина (км)">
    //         </div>
    //     </div>
    //     <div class="form-row row">
    //         <div class="col">
    //             <input id="roadLanesCount" type="text" class="form-control" placeholder="Число полос">
    //         </div>
    //         <div class="col">
    //             <select id="roadOneWay" class="form-control">
    //                 <option>Одностроннее движение</option>
    //                 <option>Двустроннее движение</option>
    //             </select>
    //         </div>
    //     </div>
    //     <div class="form-row row">
    //         <textarea id="roadParkingInfo" type="text" class="form-control"
    //                   placeholder="Парковка" rows="3"></textarea>
    //     </div>
    //     <div class="form-row row">
    //         <textarea id="roadHistoricalData" type="text" class="form-control"
    //                   placeholder="Исторические сведения" rows="5"></textarea>
    //     </div>`;
    //
    //     let saveButton = `<button id="roadSaveButton" type="submit" class="btn btn-outline-success btn-sm btn-block saveButton">Сохранить</button>`;
    //     let end = `</form></div>`;
    //
    //     if (withSaveButton) {
    //         form += saveButton;
    //     }
    //     form += end;
    //     $('body').append(form);
    // }

    // static removeInputForm() {
    //     $("#roadData").remove();
    // }
}