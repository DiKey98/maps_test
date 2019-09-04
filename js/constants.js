// общие константы
let infoObjectsArray = [];
let infoElectricityNetArray = [];
let infoWaterSupplyNetArray = [];
let infoGasNetArray = [];
let accessToken = 'pk.eyJ1IjoiZGlrZXkiLCJhIjoiY2pueDBxYmc4MDFjMTN2bzU5ZGVwM3JtZyJ9.Ngqk6QMrH0NlzNu52YcBuQ';
let mapCenter = [54.5293, 36.2754];
let map;
let initRectangleSize = 0.005;
let editableLayers;
let infoTableContainer;

// для редактирования
let tmpObjects = [];
let tmpLines = [];
let saveEditsButton;
let rejectEditsButton;
let removeObjectButton;
let saveEdits;
let currentObjectPosition;
let currentLinePosition;
let houseData;
let commercialBuildingData;
let landPlotData;
let roadData;
let lineOptions;
let electricityNet = [];
let waterSupplyNet = [];
let gasNet = [];

// для аутентификации общее
let responseType = 'code';

// для аутентификации Yandex
let yandexAuthUrl = "https://oauth.yandex.ru/authorize";
let display = 'popup';
let yandexClientId = "948e781f207845efb78fe3ba7dbaec6d";

// для аутентификации Google
let googleClientId = "689567246305-urqq4d9fcieqp22p1u90kf26mu7q5e8f.apps.googleusercontent.com";
let googleAuthUrl = "https://accounts.google.com/o/oauth2/auth";
let googleRedirectUri = "http://localhost:3000/google-auth";
let scope = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

// для аутентификации Mail.Ru
let mailRuAuthUrl = "https://connect.mail.ru/oauth/authorize";
let mailRuClientId = "766480";
let mailRuRedirectUri = "http://localhost:3000/mailru-auth";

