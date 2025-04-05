document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link");

    window.addEventListener("scroll", () => {
        const scrollY = window.pageYOffset;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop -130; // ajuste por causa do navbar
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                const id = section.getAttribute("id");

                navLinks.forEach((link) => {
                    link.classList.remove("dark-beige");
                    if (link.getAttribute("href") === `#${id}`) {
                        link.classList.add("dark-beige");
                    }
                });
            }
        });
    });
});
