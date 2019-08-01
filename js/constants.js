// общие константы
window.infoArray = [];
let accessToken = 'pk.eyJ1IjoiZGlrZXkiLCJhIjoiY2pueDBxYmc4MDFjMTN2bzU5ZGVwM3JtZyJ9.Ngqk6QMrH0NlzNu52YcBuQ';
let mapCenter = [54.5293, 36.2754];
let map;
let initRectangleSize = 0.005;
let editableLayers;
let infoTableContainer;
let houseData;
let commercialBuildingData;
let roadData;
let landPlotData;

// для редактирования
let tmp = [];
let saveEditsButton;
let rejectEditsButton;
let removeObjectButton;
let saveEdits;
let currentPosition;