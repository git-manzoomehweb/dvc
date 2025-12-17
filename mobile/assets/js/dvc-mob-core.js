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

// swiper-comment-user
var swiper = new Swiper(".swiper-comment-user", {
    scrollbar: {
        el: ".swiper-scrollbar-comment",
        hide: false,
        draggable: true,
        snapOnRelease: true,
    },
    slidesPerView: 1.2,
    spaceBetween: 14,
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
    const allBtns = document.querySelectorAll(".btn-tab .tab-btn");
    allBtns.forEach(btn => btn.classList.remove("active"));
    const contents = document.querySelectorAll(".tab-content");
    contents.forEach(c => c.classList.remove("active"));
    const defaultTab = document.querySelector(".btn-tab[data-default='true']");
    if (defaultTab) {
        const btn = defaultTab.querySelector(".tab-btn");
        if (btn) {
            btn.click();
        }
    }
    const clickedBtn = evt.target.closest(".tab-btn");
    if (clickedBtn) {
        clickedBtn.classList.add("active");
    }
    const matchedContents = document.querySelectorAll(
        `.tab-content[data-category="${tabName}"]`
    );
    matchedContents.forEach(item => item.classList.add("active"));
}

function openTabHotel(evt, tabName) {
    const allBtnsHotel = document.querySelectorAll(".btn-tab .tab-btn_hotel");
    allBtnsHotel.forEach(btn => btn.classList.remove("active"));
    const contents = document.querySelectorAll(".tab-content-hotel");
    contents.forEach(c => c.classList.remove("active"));
    const defaultTab = document.querySelector(".btn-tab[data-default='true']");
    if (defaultTab) {
        const btn = defaultTab.querySelector(".tab-btn_hotel");
        if (btn) {
            btn.click();
        }
    }
    const clickedBtn = evt.target.closest(".tab-btn_hotel");
    if (clickedBtn) {
        clickedBtn.classList.add("active");
    }
    const matchedContents = document.querySelectorAll(
        `.tab-content-hotel[data-category="${tabName}"]`
    );
    matchedContents.forEach(item => item.classList.add("active"));
}

function openTabPopular(evt, tabName) {
    const allBtnsPopular = document.querySelectorAll(".btn-tab .tab-btn_popular");
    allBtnsPopular.forEach(btn => btn.classList.remove("active"));
    const contents = document.querySelectorAll(".tab-content-popular");
    contents.forEach(c => c.classList.remove("active"));
    const defaultTab = document.querySelector(".btn-tab[data-default='true']");
    if (defaultTab) {
        const btn = defaultTab.querySelector(".tab-btn_popular");
        if (btn) {
            btn.click();
        }
    }
    const clickedBtn = evt.target.closest(".tab-btn_popular");
    if (clickedBtn) {
        clickedBtn.classList.add("active");
    }
    const matchedContents = document.querySelectorAll(
        `.tab-content-popular[data-category="${tabName}"]`
    );
    matchedContents.forEach(item => item.classList.add("active"));
}

document.addEventListener("DOMContentLoaded", function () {
    const defaultBtn = document.querySelector(".tab-btn[data-default='true']");
    const defaultBtnHotel = document.querySelector(".tab-btn_hotel[data-default='true']");
    const defaultBtnPopular = document.querySelector(".tab-btn_popular[data-default='true']");
    if (defaultBtn ||defaultBtnHotel||defaultBtnPopular) {
        defaultBtn.click();
        defaultBtnHotel.click();
        defaultBtnPopular.click();
    }
});

