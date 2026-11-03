class Statement {
    constructor(statement, oneensTypes, neutalTyepes, eensTypes) {
        this.statement = statement;
        this.eensTypes = eensTypes;
        this.neutalTyepes = neutalTyepes;
        this.oneensTypes = oneensTypes;
    }
}

(function () {
    var form = document.getElementById("selftest-form");
    if (!form) {
        return;
    }

    renderStatements();

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var scores = calculateScores();
        var normalizedScores = normalizeScores(scores.actual, scores.maximum);
        applyQuoteBonus(normalizedScores);

        var winningType = getWinningType(normalizedScores);

        console.log(normalizedScores, winningType);

        showResult(normalizedScores, winningType);
    });

    var typePages = {
        1: "/Types/DePermanentOverbelasten.html",
        2: "/Types/DeGrenszoekers.html",
        3: "/Types/DeVerstoorden.html",
        4: "/Types/DeDigitaalOnzekeren.html",
        5: "/Types/DeComfortabelVerbondenen.html",
        6: "/Types/DeNaadlozeCombineerders.html",
        7: "/Types/DeVlotteSchakelaars.html",
        8: "/Types/DeGrenswachters.html"
    };

    var typeNames = {
        1: "De permanent overbelasten",
        2: "De grenszoekers",
        3: "De verstoorden",
        4: "De digitaal onzekeren",
        5: "De comfortabel verbondenen",
        6: "De naadloze combineerders",
        7: "De vlotte schakelaars",
        8: "De grenswachters"
    };

    var CLOSE_MATCH_THRESHOLD = 0.1;

    function showResult(scores, winningType) {
        var resultContainer = document.getElementById("result-container");
        if (!resultContainer) {
            return;
        }

        var runnerUpType = getRunnerUpType(scores, winningType);
        var isCloseMatch = runnerUpType !== null &&
            (scores[winningType] - scores[runnerUpType]) <= CLOSE_MATCH_THRESHOLD;

        var html = "<div class=\"alert alert-success\">" +
            "<p class=\"mb-1\">Jouw type is: <strong>" +
            "<a href=\"" + typePages[winningType] + "\">" + typeNames[winningType] + "</a>" +
            "</strong></p>";

        if (isCloseMatch) {
            html += "<p class=\"mb-0\">Je score ligt ook dicht bij: <strong>" +
                "<a href=\"" + typePages[runnerUpType] + "\">" + typeNames[runnerUpType] + "</a>" +
                "</strong></p>";
        }

        html += "</div>";

        resultContainer.innerHTML = html;
        resultContainer.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function getWinningType(scores) {
        var winningType = 1;

        for (var type = 1; type < scores.length; type++) {
            if (scores[type] > scores[winningType]) {
                winningType = type;
            }
        }

        return winningType;
    }

    function getRunnerUpType(scores, winningType) {
        var runnerUpType = null;

        for (var type = 1; type < scores.length; type++) {
            if (type === winningType) {
                continue;
            }

            if (runnerUpType === null || scores[type] > scores[runnerUpType]) {
                runnerUpType = type;
            }
        }

        return runnerUpType;
    }

    function calculateScores() {
        // index 0 wordt niet gebruikt, zodat scores[1] overeenkomt met type 1
        var actual = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        var maximum = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        var index = 0;
        for (var statement of getStatements()) {
            index++;

            var selectedInput = form.querySelector("input[name=\"q" + index + "\"]:checked");
            if (!selectedInput) {
                continue;
            }

            statement.oneensTypes.forEach(function (type) {
                maximum[type] += 2;
            });
            statement.neutalTyepes.forEach(function (type) {
                maximum[type] += 1;
            });
            statement.eensTypes.forEach(function (type) {
                maximum[type] += 2;
            });

            var value = parseInt(selectedInput.value, 10);
            var weight = (value === 1 || value === 5) ? 2 : 1;

            var types;
            if (value === 1 || value === 2) {
                types = statement.oneensTypes;
            } else if (value === 3) {
                types = statement.neutalTyepes;
            } else {
                types = statement.eensTypes;
            }

            types.forEach(function (type) {
                actual[type] += weight;
            });
        }

        return { actual: actual, maximum: maximum };
    }

    function normalizeScores(actual, maximum) {
        var normalized = [0, 0, 0, 0, 0, 0, 0, 0, 0];

        for (var type = 1; type < actual.length; type++) {
            normalized[type] = maximum[type] > 0 ? actual[type] / maximum[type] : 0;
        }

        return normalized;
    }

    function applyQuoteBonus(scores) {
        var selectedQuote = form.querySelector("input[name=\"quote\"]:checked");
        if (!selectedQuote) {
            return;
        }

        var quoteType = parseInt(selectedQuote.value, 10);
        scores[quoteType] *= 1.2;
    }

    function renderStatements() {
        var tbody = document.getElementById("statements-tbody");
        if (!tbody) {
            return;
        }

        var answerColumns = [
            { value: "1", label: "Helemaal oneens" },
            { value: "2", label: "Eerder oneens" },
            { value: "3", label: "Neutraal" },
            { value: "4", label: "Eerder eens" },
            { value: "5", label: "Helemaal eens" }
        ];

        var index = 0;
        var rowsHtml = "";

        for (var statement of getStatements()) {
            index++;
            var questionName = "q" + index;

            rowsHtml += "<tr>";
            rowsHtml += "<td>" + statement.statement + "</td>";

            answerColumns.forEach(function (column) {
                var requiredAttribute = column.value === "1" ? " required" : "";
                rowsHtml += "<td class=\"text-center p-0\" data-label=\"" + column.label + "\">" +
                    "<label class=\"d-flex align-items-center justify-content-center h-100 m-0\" style=\"min-height: 2.5rem;\">" +
                    "<input class=\"form-check-input\" type=\"radio\" name=\"" + questionName + "\" value=\"" + column.value + "\"" + requiredAttribute + ">" +
                    "</label></td>";
            });

            rowsHtml += "</tr>";
        }

        tbody.innerHTML = rowsHtml;
    }
})();

function* getStatements()
{
    yield new Statement("1. Ik ervaar druk en/of moeilijkheden met mentaal loskoppelen van het werk omwille van de aanwezigheid van werkgerelateerd ICTs in mijn privéleven.", [5, 6], [3, 7, 8], [1, 2]);
    yield new Statement("2. Door werkgerelateerde ICT's heb ik soms het gevoel dat werk nooit eindigt, wat me stress bezorgt.", [5, 6], [3, 7, 8], [1, 2]);
    yield new Statement("3. Ik ervaar focusverlies en/of mentale uitputting omwille van werkgerelateerd ICTs die mijn werktaken onderbreken.", [5, 7], [2, 6, 8], [1, 3]);
    yield new Statement("4. Ik voel me angstig en ben bang om fouten te maken omwille van het gebruik van werkgerelateerde ICTs.", [], [], [4]);
    yield new Statement("5. Soms voel ik mij dom omdat ik niet weet hoe ik werkgerelateerde ICTs moet gebruiken.", [], [], [4]);
    yield new Statement("6. Ik ervaar controle en voel me comfortabel omwille van de aanwezigheid van van werkgerelateerde ICTs buiten de werkuren.", [1, 2], [3, 7, 8], [5, 6]);
    yield new Statement("7. Ik ervaar onderbrekingen van werktaken door werkgerelateerde ICTs als energie-gevend, en ze houden me alert en gefocust.", [1, 2], [3, 6, 8], [5, 7]);
    yield new Statement("8. Ik voel mij rustig en ontspannen omdat werkgerelateerde ICT's buiten de werkuren weinig of geen rol spelen in mijn leven.", [1, 2], [3, 6], [3, 7, 8]);
    yield new Statement("9. Wanneer ik tijdens de werkuren veel digitale communicatie, berichten en vragen krijg, blijf ik me comfortabel en in controle voelen.", [1, 2], [3, 6, 8], [5, 7]);
    yield new Statement("10. Werkgerelateerde ICTs zijn zo dominant in mijn leven dat ik nadenk om een andere job te zoeken.", [], [], [1]);
    yield new Statement("11. Door de alomtegenwoordigheid van werkgerelateerde ICTs ben ik bezorgd om mijn welzijn en vrees ik op termijn een burnout te ervaren.", [], [], [1]);
    yield new Statement("12. Het geeft mij rust wanneer ik via werkgerelateerde ICTs op de hoogte blijf van wat er op het werk gebeurt.", [1, 2], [3, 7, 8], [5, 6]);
    yield new Statement("13. Werkgerelateerde ICTs halen mij vaak uit mijn werkritme, waardoor ik prikkelbaar of gefrustreerd raak.", [7], [6, 8], [3]);
    yield new Statement("14. Regelmatig schakelen tussen berichten, vragen en taken geeft mij energie tijdens mijn werkdag.", [1, 3], [2, 6, 8], [5, 7]);
    yield new Statement("15. Wanneer werkgerelateerde ICTs veranderen of niet werken zoals verwacht, verlies ik vertrouwen in mijn eigen vaardigheden", [], [], [4]);
    yield new Statement("16. Nieuwe digitale systemen of toepassingen doen mij onzeker voelen.", [], [], [4]);
    yield new Statement("17. Buiten de werkuren spelen werkgerelateerde ICTs niet of nauwelijks een rol in mijn leven, en dat geeft me rust.", [1, 2], [3, 6], [5, 7, 8]);
    yield new Statement("18. Ik voel weinig nood om via werkgerelateerde ICTs verbonden te blijven met mijn werk wanneer mijn werkdag voorbij is.", [1, 2], [5, 6], [3, 7, 8]);
    yield new Statement("19. Ik ervaar werkgerelateerde ICT's als ondersteunend voor mijn werk, zonder dat ze mijn aandacht voortdurend opeisen.", [1, 3, 5, 7], [], [8, 6, 2]);
    yield new Statement("20. Werkgerelateerde ICT's helpen mij om mijn werk uit te voeren zonder dat ze voor veel druk, afleiding of onderbrekingen zorgen.", [1, 3, 5, 7], [], [8, 6, 2]);
    yield new Statement("21. Tijdens mijn werkdag ervaar ik werkgerelateerde ICT's als voorspelbaar en rustig.", [1, 3, 5, 7], [], [8, 6, 2]);
    yield new Statement("22. Het gebruik van werkgerelateerde ICT's verloopt meestal vlot, waardoor ik mij kalm en geconcentreerd kan voelen tijdens het werk.", [1, 3, 5, 7], [], [8, 6, 2]);
    yield new Statement("23. Wanneer ik buiten de werkuren via werkgerelateerde ICTs in contact sta met het werk, voel ik druk of spanning.", [5, 6], [3, 7, 8], [1, 2]);
    yield new Statement("24. De mogelijkheid om buiten de werkuren gebruik te maken van werkgerelateerde ICT's past goed bij de manier waarop ik mijn werk organiseer. Ik vind het fijn en het geeft me standvastigheid.", [1, 2], [3, 7, 8], [5, 6]);
    yield new Statement("25. Vooral de opeenstapeling van onderbrekingen tijdens de werkdag zorgt ervoor dat ik buiten de werkuren nog met het werk bezig blijf, eerder dan onzekerheid over wat er van mij verwacht wordt.", [2], [], [1]);
    yield new Statement("26. Zelfs als er geen concrete aanleiding toe is, controleer ik buiten de werkuren uit voorzorg berichten, uit angst iets te missen of iets verkeerd te doen.", [1, 8], [], [2]);
    yield new Statement("27. Digitale onderbrekingen tijdens de werkdag laten geen sporen na zodra mijn werkdag voorbij is.", [1], [], [3, 7, 8]);
    yield new Statement("28. Of ik mij comfortabel voel met werkgerelateerde ICT's hangt vooral af van hoe vlot ik tijdens een drukke werkdag kan schakelen tussen taken, eerder dan van wat er buiten de werkuren gebeurt.", [6], [], [5, 7]);
    yield new Statement("29. Het voelt voor mij geruststellend om buiten de werkuren af en toe kort met werkgerelateerde ICT's bezig te zijn, zonder dat dit belastend aanvoelt.", [5], [], [6]);
    yield new Statement("30. Mijn gevoel van balans met werkgerelateerde ICT's hangt af van het kunnen compenseren van extra beschikbaarheid buiten de werkuren op een ander moment.", [7], [], [5]);
}


