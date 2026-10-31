(function () {
    fetch("/partials/navbar.html")
        .then(function (response) { return response.text(); })
        .then(function (html) {
            var placeholder = document.getElementById("navbar-placeholder");
            if (!placeholder) {
                return;
            }

            placeholder.innerHTML = html;
            highlightActiveLink();
        })
        .catch(function (error) {
            console.error("Kon de navigatiebalk niet laden:", error);
        });

    function highlightActiveLink() {
        var currentPath = window.location.pathname.toLowerCase();
        var links = document.querySelectorAll("#navbar-placeholder .nav-link, #navbar-placeholder .dropdown-item");

        links.forEach(function (link) {
            var linkPath = new URL(link.getAttribute("href"), window.location.origin).pathname.toLowerCase();

            if (linkPath === currentPath) {
                link.classList.add("active");

                var parentDropdownMenu = link.closest(".dropdown-menu");
                if (parentDropdownMenu) {
                    var toggle = parentDropdownMenu.previousElementSibling;
                    if (toggle) {
                        toggle.classList.add("active");
                    }
                }
            }
        });
    }
})();
