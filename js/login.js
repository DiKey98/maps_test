$(document).ready(function () {
    $('#loginWithYandex').click(function (e) {
        e.preventDefault();
        location.href = `${yandexAuthUrl}?response_type=${responseType}&client_id=${yandexClientId}&display=${display}`;
    });

    $('#loginWithGoogle').click(function (e) {
        e.preventDefault();
        location.href = `${googleAuthUrl}?response_type=${responseType}&client_id=${googleClientId}&scope=${scope}&redirect_uri=${googleRedirectUri}`;
    });

    $('#loginWithMailRu').click(function (e) {
        e.preventDefault();
        location.href = `${mailRuAuthUrl}?response_type=${responseType}&client_id=${mailRuClientId}&redirect_uri=${mailRuRedirectUri}`;
    });
});