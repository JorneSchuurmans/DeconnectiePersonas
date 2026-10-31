(function () {
    var form = document.getElementById("selftest-form");
    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // TODO: bereken het resultaat op basis van de antwoorden
        // en navigeer naar de bijbehorende type-pagina, bv.:
        // window.location.href = "/Types/DePermanentOverbelasten.html";


    });
})();
