(function () {
    const startTime = performance.now();

    window.addEventListener("load", () => {
        const endTime = performance.now();
        const loadTime = (endTime - startTime).toFixed(0);
        const footer = document.querySelector("footer");
        if (footer) {
            const el = document.createElement("p");
            el.textContent = `Время загрузки страницы: ${loadTime} мс`;
            footer.appendChild(el);
        }
    });

    window.addEventListener("DOMContentLoaded", () => {
        const current = document.location.pathname;
        const links = document.querySelectorAll(".nav a");
        links.forEach(link => {
            const linkPath = new URL(link.href).pathname;
            if (linkPath === current) {
                link.classList.add("active");
            }
        });
    });
})();


