$(document).ready(function () {
    saveEmailToCookie();
    setEmailFromCookie();

    $.ajax({
        url: "/users/",
        method: "POST",
        success: function (json) {
            let data = JSON.parse(json);
            renderUsersTable(data);
        }
    });
});

function renderUsersTable(data) {
    $('#example tfoot th').each(function () {
        let title = $(this).text();
        $(this).html(`<input type="text" placeholder="${title}..."/>`);
    });

    let table = $('#example').DataTable({
        language: {
            "processing": "Подождите...",
            "search": "Поиск:",
            "lengthMenu": "Показать _MENU_ записей",
            "info": "Записи с _START_ до _END_ из _TOTAL_ записей",
            "infoEmpty": "Записи с 0 до 0 из 0 записей",
            "infoFiltered": "(отфильтровано из _MAX_ записей)",
            "infoPostFix": "",
            "loadingRecords": "Загрузка записей...",
            "zeroRecords": "Записи отсутствуют.",
            "emptyTable": "В таблице отсутствуют данные",
            "paginate": {
                "first": "Первая",
                "previous": "Предыдущая",
                "next": "Следующая",
                "last": "Последняя"
            },
            "aria": {
                "sortAscending": ": активировать для сортировки столбца по возрастанию",
                "sortDescending": ": активировать для сортировки столбца по убыванию"
            }
        },
        data: data,
        columns: [
            {"data": "first_name"},
            {"data": "last_name"},
            {"data": "position"},
            {"data": "office"},
            {"data": "start_date"},
            {"data": "salary"}
        ]
    });

    table.columns().every(function () {
        let that = this;
        $('input', this.footer()).on('keyup change clear', function () {
            if (that.search() !== this.value) {
                that
                    .search(this.value)
                    .draw();
            }
        });
    });

    table.on('draw', function () {
        setButtons();
    });

    setButtons();
}

function setButtons() {
    $('td').each(function (idx, element) {
        if (element.innerHTML === "Нет" || element.innerHTML === "нет") {
            $(element).html(`<button id="grant${idx}" type="button" class="btn btn-success">Выдать привелегии</button>`);
            $(`#grant${idx}`).on("click", grantClickHandler.bind(null, element.parentElement.childNodes[0].innerHTML));
            return
        }

        if (element.innerHTML === "Да" || element.innerHTML === "да") {
            $(element).html(`<button id="revoke${idx}" type="button" class="btn btn-danger">Отменить привелегии</button>`);
            $(`#revoke${idx}`).on("click", revokeClickHandler.bind(null, element.parentElement.childNodes[0].innerHTML));
        }
    });
}

function grantClickHandler(id, e) {
    alert(id);
}

function revokeClickHandler(id, e) {
    alert(id);
}
