// swiper-thumbnail-tour
var swiper = new Swiper(".swiper-thumbnail-tour", {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
        nextEl: ".swiper-button-next-tour",
        prevEl: ".swiper-button-prev-tour",
    },
});


// swiper-thumbnail-hotel
var swiper = new Swiper(".swiper-thumbnail-hotel", {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
        nextEl: ".swiper-button-next-hotel",
        prevEl: ".swiper-button-prev-hotel",
    },
});

// swiper-thumbnail-visa
var swiper = new Swiper(".swiper-thumbnail-visa", {
    slidesPerView: 1.6,
    spaceBetween: 20,
    navigation: {
        nextEl: ".swiper-button-next-visa",
        prevEl: ".swiper-button-prev-visa",
    },
});

// swiper-img-visa
var swiper = new Swiper(".swiper-img-visa", {
    slidesPerView: 1,
    spaceBetween: 30,
    navigation: {
        nextEl: ".swiper-button-next-visa",
        prevEl: ".swiper-button-prev-visa",
    },
    pagination: {
        el: ".swiper-pagination",
    },
});


var swiper = new Swiper(".popular-destinations", {
    slidesPerView: 1.4,
    grid: {
        fill: 'row',
        rows: 2
    },
    spaceBetween: 12,
});

// faq
const panels = document.querySelectorAll(".panel");

function removeActiveClasses() {
    panels.forEach((panel) => {
        panel.classList.remove("active");
    });
}

panels.forEach((panel) => {
    panel.addEventListener("click", () => {
        if (panel.classList.contains("active")) {
            removeActiveClasses();
        } else {
            removeActiveClasses();
            panel.classList.add("active");
        }
    });
});
