// swiper-thumbnail-tour
var swiper = new Swiper(".swiper-thumbnail-tour", {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
        nextEl: ".swiper-button-next-tour",
        prevEl: ".swiper-button-prev-tour",
    },
});

// swiper-thumbnail-hotel
var swiper = new Swiper(".swiper-thumbnail-hotel", {
    slidesPerView: 3,
    spaceBetween: 20,
    navigation: {
        nextEl: ".swiper-button-next-hotel",
        prevEl: ".swiper-button-prev-hotel",
    },
});

// swiper-thumbnail-visa
var swiper = new Swiper(".swiper-thumbnail-visa", {
    slidesPerView: 5,
    spaceBetween: 30,
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
// swiper-comment-user
var swiper = new Swiper(".swiper-comment-user", {
    scrollbar: {
        el: ".swiper-scrollbar-comment",
        hide: false,
        draggable: true,
        snapOnRelease: true,
    },
    slidesPerView: 3,
    spaceBetween: 20,
    freeMode: true,
    navigation: {
        nextEl: ".swiper-button-next-comment",
        prevEl: ".swiper-button-prev-comment",
    },
    breakpoints: {
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
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


function openTab(evt, tabName) {
    const buttons = document.getElementsByClassName("btn-tab");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("active");
    }

    const contents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < contents.length; i++) {
        contents[i].classList.remove("active");
    }

    evt.currentTarget.classList.add("active");

    const matchedContents = document.querySelectorAll(
        `.tab-content[data-category="${tabName}"]`
    );

    matchedContents.forEach(item => {
        item.classList.add("active");
    });
}
document.addEventListener("DOMContentLoaded", function () {
    const activeTab = document.body.getAttribute("data-active-tab");
    if (activeTab) {
        const btn = document.querySelector(`.btn-tab[data-tab="${activeTab}"]`);
        if (btn) {
            btn.click();
        }
    }
});
