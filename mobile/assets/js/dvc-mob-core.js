document.addEventListener('DOMContentLoaded', function () {
    const isDesktop = window.innerWidth > 1024
    const requiredFiles = isDesktop
        ? ['dvc.ui.min.css']
        : ['dvc-mob.ui.min.css']

    function checkAllResourcesLoaded() {
        const resources = performance.getEntriesByType('resource')
        const loadedFiles = resources
            .map((res) => res.name.split('/').pop())
            .filter((name) => requiredFiles.includes(name))

        return requiredFiles.every((file) => loadedFiles.includes(file))
    }

    if (document.getElementById('search-box')) {
        function fetchEngine() {
            try {
                const xhrobj = new XMLHttpRequest()
                xhrobj.open('GET', 'search-engine.bc');
                xhrobj.send();

                xhrobj.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        const container = document.getElementById('search-box')
                        container.innerHTML = xhrobj.responseText
                        ;['.Basis_Date.end_date', '.Basis_Date.start_date'].forEach(
                            (selector) => {
                                const dateInputs = document.querySelectorAll(selector)
                                dateInputs.forEach((input) => {
                                    input.placeholder = ''
                                })
                            },
                        )


                        const scripts = container.getElementsByTagName('script')
                        for (let i = 0; i < scripts.length; i++) {
                            const scriptTag = document.createElement('script')
                            if (scripts[i].src) {
                                scriptTag.src = scripts[i].src
                                scriptTag.async = false
                            } else {
                                scriptTag.text = scripts[i].textContent
                            }
                            document.head
                                .appendChild(scriptTag)
                                .parentNode.removeChild(scriptTag)
                        }
                    }
                }
            } catch (error) {
                console.error('مشکلی پیش آمده است. لطفا صبور باشید', error)
            }
        }

        function waitForFiles() {
            if (checkAllResourcesLoaded()) {
                fetchEngine()
            } else {
                setTimeout(waitForFiles, 500)
            }
        }

        waitForFiles()
    }
})
document.addEventListener("DOMContentLoaded", function () {
    const fetchContentHeader = document.querySelector('.result-id')
    const contentCache = new Map()
    let swiperInstance = null

    // همه تب‌ها
    const tabs = document.querySelectorAll('.btn-tab .item-btn-tab')
    // ---------- Init First Tab ----------


    // ---------- Loader ----------
    function showLoader() {
        fetchContentHeader.innerHTML =
            '<div class="flex justify-center mt-2"><span class="fetch-loader"></span></div>'
    }

    // ---------- Active Tab ----------
    function setActiveTab(activeTab) {
        tabs.forEach(tab => {
            tab.classList.remove('active-visa')
            tab.classList.add('bg-zinc-100', 'text-zinc-600')
        })

        activeTab.classList.remove('bg-zinc-100', 'text-zinc-600')
        activeTab.classList.add('active-visa')
    }

    // ---------- Load Category ----------
    async function loadCategory(dataId, tabEl = null) {
        if (!dataId) return

        if (tabEl) setActiveTab(tabEl)

        const cacheKey = dataId

        showLoader()

        if (contentCache.has(cacheKey)) {
            fetchContentHeader.innerHTML = contentCache.get(cacheKey)
            initSwiperSafe()
            return
        }

        try {
            const response = await fetch(`/load-items.bc?catid=${dataId}`)
            if (!response.ok) throw new Error(response.status)

            const data = await response.text()
            contentCache.set(cacheKey, data)
            fetchContentHeader.innerHTML = data

            initSwiperSafe()

        } catch (error) {
            fetchContentHeader.innerHTML =
                `<p class="text-red-500">خطا در بارگذاری محتوا</p>`
        }
    }

    // ---------- Swiper ----------
    function initSwiperSafe() {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                initSwiper()
            })
        })
    }

    function initSwiper() {
        const swiperEl = document.querySelector('.swiper-thumbnail-visa')
        if (!swiperEl) return

        if (swiperInstance) {
            swiperInstance.destroy(true, true)
            swiperInstance = null
        }

        swiperInstance = new Swiper(swiperEl, {
            rtl: true,
            observer: true,
            observeParents: true,
            watchSlidesProgress: true,
            slidesPerView: 1.2,
            spaceBetween: 20,
            loop: false,
            navigation: {
                nextEl: swiperEl.querySelector('.swiper-button-next-visa'),
                prevEl: swiperEl.querySelector('.swiper-button-prev-visa'),
            },
            breakpoints: {
                1024: {slidesPerView: 5},
                768: {slidesPerView: 3},
                480: {slidesPerView: 1.2},
            }
        })
    }

// ---------- Init Default Tab ----------
    if (tabs.length > 0) {
        const firstTab = tabs[0]
        const firstId = firstTab.getAttribute('onclick')
            ?.match(/loadCategory\('(.+?)'/)?.[1]

        if (firstId) {
            loadCategory(firstId, firstTab)
        } else {
            console.error('Cannot detect catid for first tab')
        }
    }

    window.loadCategory = loadCategory
})




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


const headerMenu = document.querySelector(".header-menu");
const headerMenuClose = document.querySelector(".header-menu-close");
const bars3 = document.querySelector(".bars3");

if (window.innerWidth >= 1024) {
    headerMenuClose.addEventListener("click", function () {
        headerMenu.style.visibility = "hidden";
        headerMenu.style.opacity = "0";
        document.body.classList.remove("overflow-hidden");
    });

    bars3.addEventListener("click", function () {
        headerMenu.style.visibility = "visible";
        headerMenu.style.opacity = "1";
        document.body.classList.add("overflow-hidden");
    });
} else {
    headerMenuClose.addEventListener("click", function () {
        headerMenu.style.transform = "translateX(1024px)";
        document.body.classList.remove("overflow-hidden");
    });
    bars3.addEventListener("click", function () {
        headerMenu.style.transform = "translateX(0)";
        document.body.classList.add("overflow-hidden");
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const toggleDropdowns = document.querySelectorAll(".toggle-dropdown");
    const dropdownIcons = document.querySelectorAll(".dropdown-icon");

    toggleDropdowns.forEach((toggle, index) => {
        const submenu = toggle.nextElementSibling;
        const dropdownIcon = dropdownIcons[index];

        toggle.addEventListener("click", function () {

            dropdownIcon.classList.toggle("rotate-180");

            if (submenu.style.maxHeight) {
                submenu.style.maxHeight = null;
                submenu.style.opacity = "0";
            } else {

                submenu.style.maxHeight = (submenu.scrollHeight*30) + "px";
                submenu.style.opacity = "1";
            }
        });
    });
});



//---------------slider-tour
let swiperTour;
function initSwiperTour() {
    if (swiperTour) {
        swiperTour.destroy(true, true);
    }

    swiperTour = new Swiper(".swiper-thumbnail-tour", {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next-tour",
            prevEl: ".swiper-button-prev-tour",
        },
        observer: true,
        observeParents: true,
    });
}
function openTab(evt, tabName) {
    const allBtns = document.querySelectorAll(".btn-tab .tab-btn");
    allBtns.forEach(btn => btn.classList.remove("active"));

    const contents = document.querySelectorAll(".tab-content");
    contents.forEach(c => c.classList.remove("active"));

    const clickedBtn = evt.target.closest(".tab-btn");
    if (clickedBtn) {
        clickedBtn.classList.add("active");
    }

    // ✅ حالت پیش‌فرض: نمایش همه
    if (tabName === "all") {
        contents.forEach(item => item.classList.add("active"));
    } else {
        const matchedContents = document.querySelectorAll(
            `.tab-content[data-category="${tabName}"]`
        );
        matchedContents.forEach(item => item.classList.add("active"));
    }

    setTimeout(() => {
        initSwiperTour();
    }, 0);
}
//---------------slider-tour


//---------------slider-hotel
let swiperHotel;
function initSwiperHotel() {
    if (swiperHotel) {
        swiperHotel.destroy(true, true);
    }

    swiperHotel = new Swiper(".swiper-thumbnail-hotel", {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: ".swiper-button-next-hotel",
            prevEl: ".swiper-button-prev-hotel",
        },
        observer: true,
        observeParents: true,
    });
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
    // ✅ حالت پیش‌فرض: نمایش همه
    if (tabName === "all") {
        contents.forEach(item => item.classList.add("active"));
    } else {
        const matchedContents = document.querySelectorAll(
            `.tab-content-hotel[data-category="${tabName}"]`
        );
        matchedContents.forEach(item => item.classList.add("active"));
    }
    setTimeout(() => {
        initSwiperHotel();
    }, 0);
}
//---------------slider-hotel



//---------------popular-tour
let swiperPopular;

function initSwiper() {
    if (swiperPopular) {
        swiperPopular.destroy(true, true);
    }

    swiperPopular = new Swiper(".popular-destinations", {
        slidesPerView: 1.4,
        spaceBetween: 12,
        observer: true,
        observeParents: true,
    });
}

function openTabPopular(evt, tabName) {
    if (evt && typeof evt.preventDefault === "function") evt.preventDefault();

    // دکمه‌ها
    document
        .querySelectorAll(".tab-btn_popular")
        .forEach((btn) => btn.classList.remove("active"));

    // محتواها
    document
        .querySelectorAll(".tab-content-popular")
        .forEach((c) => c.classList.remove("active"));

    const clickedBtn =
        evt?.currentTarget || evt?.target?.closest(".tab-btn_popular");

    if (clickedBtn) clickedBtn.classList.add("active");

    if (tabName === "all") {
        document
            .querySelectorAll(".tab-content-popular")
            .forEach((el) => el.classList.add("active"));
    } else {
        document
            .querySelectorAll(`.tab-content-popular[data-category="${tabName}"]`)
            .forEach((el) => el.classList.add("active"));
    }

    // ⬅️ همیشه بعد از تغییر DOM
    setTimeout(() => {
        initSwiper();
    }, 0);
}
document.addEventListener("DOMContentLoaded", () => {
    const allBtn = document.querySelector('.tab-btn_popular[data-tab="all"]');

    if (allBtn) {
        openTabPopular({ currentTarget: allBtn }, "all");
    }
});


//----------------popular-tour


document.addEventListener("DOMContentLoaded", () => {
    const defaultBtn = document.querySelector(".btn-tab[data-default='true'] .tab-btn");
    if (defaultBtn) {
        defaultBtn.click();
    }
});


// -----------------
const target = document.querySelector("main");
document.addEventListener("DOMContentLoaded", function () {
    if (document.querySelector(".footer-landing-items")) {
        const homePaths = [
            "/",
            "/flight",
            "/hotel",
            "/flighthotel",
            "/tour",
            "/insurance",
        ];

        const currentPath = window.location.pathname;
        const isHomePage = homePaths.includes(currentPath);
        const isNotHome = !isHomePage;

        const flightItem = document.querySelectorAll('li[data-id="flight"]');
        const hotelItem = document.querySelectorAll('li[data-id="hotel"]');
        const flightHotelItem = document.querySelectorAll(
            'li[data-id="flighthotel"]'
        );
        const tourItem = document.querySelectorAll('li[data-id="tour"]');
        const trainItem = document.querySelectorAll('li[data-id="train"]');
        const insuranceItem = document.querySelectorAll('li[data-id="insurance"]');
        if (isNotHome) {
            if (flightItem) {
                flightItem.forEach((item) => {
                    item.addEventListener("click", function (e) {
                        e.preventDefault();
                        window.location.href = "/flight";
                    });
                });
            }
            if (tourItem) {
                tourItem.forEach((item) => {
                    item.addEventListener("click", function (e) {
                        e.preventDefault();
                        window.location.href = "/tour";
                    });
                });
            }
            if (trainItem) {
                trainItem.forEach((item) => {
                    item.addEventListener("click", function (e) {
                        e.preventDefault();
                        window.location.href = "/train";
                    });
                });
            }
            if (insuranceItem) {
                insuranceItem.forEach((item) => {
                    item.addEventListener("click", function (e) {
                        e.preventDefault();
                        window.location.href = "/insurance";
                    });
                });
            }
            if (flightHotelItem) {
                flightHotelItem.forEach((item) => {
                    item.addEventListener("click", function (e) {
                        e.preventDefault();
                        window.location.href = "/flighthotel";
                    });
                });
            }

            if (hotelItem) {
                hotelItem.forEach((item) => {
                    item.addEventListener("click", function (e) {
                        e.preventDefault();
                        window.location.href = "/hotel";
                    });
                });
            }
        } else {
            if (flightItem) {
                flightItem.forEach((item) => {
                    item.addEventListener("click", function () {
                        if (target) {
                            target.scrollIntoView({ behavior: "smooth" });
                        }
                        check_searchHistory("flight");
                        check_landing("flight");
                    });
                });
            }
            if (tourItem) {
                tourItem.forEach((item) => {
                    item.addEventListener("click", function () {
                        if (target) {
                            target.scrollIntoView({ behavior: "smooth" });
                        }
                        check_searchHistory("tour");
                        check_landing("tour");
                    });
                });
            }
            if (trainItem) {
                trainItem.forEach((item) => {
                    item.addEventListener("click", function () {
                        if (target) {
                            target.scrollIntoView({ behavior: "smooth" });
                        }
                        check_searchHistory("train");
                        check_landing("train");
                    });
                });
            }
            if (insuranceItem) {
                insuranceItem.forEach((item) => {
                    item.addEventListener("click", function () {
                        if (target) {
                            target.scrollIntoView({ behavior: "smooth" });
                        }
                        check_searchHistory("insurance");
                        check_landing("insurance");
                    });
                });
            }
            if (flightHotelItem) {
                flightHotelItem.forEach((item) => {
                    item.addEventListener("click", function () {
                        if (target) {
                            target.scrollIntoView({ behavior: "smooth" });
                        }
                        check_searchHistory("flighthotel");
                        check_landing("flighthotel");
                    });
                });
            }
            if (hotelItem) {
                hotelItem.forEach((item) => {
                    item.addEventListener("click", function () {
                        if (target) {
                            target.scrollIntoView({ behavior: "smooth" });
                        }
                        check_searchHistory("hotel");
                        check_landing("hotel");
                    });
                });
            }
        }
    }
});




document.getElementById("opinionForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const messageDiv = document.getElementById("Message-Form");

    fetch("/Tem1_OpinionAction.bc", {
        method: "POST",
        body: formData,
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        }
    })
        .then(res => res.text())
        .then(data => {
            messageDiv.innerHTML = data;
        })
        .catch(() => {
            messageDiv.innerHTML = `<span class="text-red-500">خطا در ارتباط با سرور</span>`;
        });
});


// form-footer
function uploadDocumentFooter(args) {
    document.querySelector('#form-footer .Loading_Form').style.display =
        'block'
    const captcha = document
        .querySelector('#form-footer')
        .querySelector("#captchaContainer input[name='captcha']").value
    const captchaid = document
        .querySelector('#form-footer')
        .querySelector("#captchaContainer input[name='captchaid']").value
    const stringJson = JSON.stringify(args.source?.rows[0])
    $bc.setSource('cms.uploadFooter', {
        value: stringJson,
        captcha: captcha,
        captchaid: captchaid,
        run: true,
    })
}

function refreshCaptchaFooter(e) {
    $bc.setSource('captcha.refreshFooter', true)
}

async function OnProcessedEditObjectFooter(args) {
    var response = args.response
    var json = await response.json()
    var errorid = json.errorid
    if (errorid == '6') {
        document.querySelector('#form-footer .Loading_Form').style.display =
            'none'
        document.querySelector('#form-footer .message-api').innerHTML =
            'درخواست شما با موفقیت ثبت شد.'
        document.querySelector('#form-footer .message-api').style.color =
            'rgb(60 200 60)'
    } else {
        refreshCaptchaFooter()
        setTimeout(() => {
            document.querySelector(
                '#form-footer .Loading_Form',
            ).style.display = 'none'
            document.querySelector('#form-footer .message-api').innerHTML =
                'خطایی رخ داده, لطفا مجدد اقدام کنید.'
            document.querySelector('#form-footer .message-api').style.color =
                'rgb(220 38 38)'
        }, 2000)
    }
}

async function RenderFormFooter() {
    var inputElementVisa7 = document.querySelector(
        '.footer-form-email input[data-bc-text-input]',
    )
    inputElementVisa7.setAttribute('placeholder', 'ایمیل خود را وارد کنید')
}


// form-faq
function uploadDocumentFaq(args) {
    document.querySelector('#form-faq .Loading_Form').style.display =
        'block'
    const captcha = document
        .querySelector('#form-faq')
        .querySelector("#captchaContainer input[name='captcha']").value
    const captchaid = document
        .querySelector('#form-faq')
        .querySelector("#captchaContainer input[name='captchaid']").value
    const stringJson = JSON.stringify(args.source?.rows[0])
    $bc.setSource('cms.uploadFaq', {
        value: stringJson,
        captcha: captcha,
        captchaid: captchaid,
        run: true,
    })
}

function refreshCaptchaFaq(e) {
    $bc.setSource('captcha.refreshFaq', true)
}

async function OnProcessedEditObjectFaq(args) {
    var response = args.response
    var json = await response.json()
    var errorid = json.errorid
    if (errorid == '6') {
        document.querySelector('#form-faq .Loading_Form').style.display =
            'none'
        document.querySelector('#form-faq .message-api').innerHTML =
            'درخواست شما با موفقیت ثبت شد.'
        document.querySelector('#form-faq .message-api').style.color =
            'rgb(60 200 60)'
    } else {
        refreshCaptchaFaq()
        setTimeout(() => {
            document.querySelector(
                '#form-faq .Loading_Form',
            ).style.display = 'none'
            document.querySelector('#form-faq .message-api').innerHTML =
                'خطایی رخ داده, لطفا مجدد اقدام کنید.'
            document.querySelector('#form-faq .message-api').style.color =
                'rgb(220 38 38)'
        }, 2000)
    }
}

async function RenderFormFaq() {
    const inputs = document.querySelectorAll('.form-faq [data-bc-text-input]')

    if (inputs.length >= 2) {
        inputs[0].placeholder = 'شماره تماس'
        inputs[1].placeholder = 'نام و نام خانوادگی'
    }
}



document.addEventListener("DOMContentLoaded", () => {
    const fetchContentVisa = document.querySelector('.result-id-visa')
    const contentCacheVisa = new Map()

    // همه تب‌ها
    const tabsVisa = document.querySelectorAll('.btn-tab .item-btn-tab')
    // ---------- Loader ----------
    function showLoader() {
        fetchContentVisa.innerHTML =
            '<div class="flex justify-center box-loading mt-2"><span class="fetch-loader"></span></div>'
    }

    // ---------- Active Tab ----------
    function setActiveTab(activeTab) {
        tabsVisa.forEach(tab => {
            tab.classList.remove('active-visa')
            tab.classList.add('bg-zinc-100', 'text-zinc-600')
        })

        activeTab.classList.remove('bg-zinc-100', 'text-zinc-600')
        activeTab.classList.add('active-visa')
    }

    // ---------- Load Category ----------
    async function loadCategoryVisa(dataId, tabEl = null) {
        if (!dataId) return

        if (tabEl) setActiveTab(tabEl)

        const cacheKey = dataId

        showLoader()
        if (contentCacheVisa.has(cacheKey)) {
            fetchContentVisa.innerHTML = contentCacheVisa.get(cacheKey)
            return
        }
        try {
            const response = await fetch(`/visa-load-items.bc?catid=${dataId}`)
            if (!response.ok) throw new Error(response.status)

            const data = await response.text()
            contentCacheVisa.set(cacheKey, data)
            fetchContentVisa.innerHTML = data

        } catch (error) {
            fetchContentVisa.innerHTML =
                `<p class="text-red-500">خطا در بارگذاری محتوا</p>`
        }
    }

    if (tabsVisa.length > 0) {
        const firstTabVisa = tabsVisa[0]
        const firstIdVisa = firstTabVisa.getAttribute('onclick')
            ?.match(/loadCategoryVisa\('(.+?)'/)?.[1]

        if (firstIdVisa) {
            loadCategoryVisa(firstIdVisa, firstTabVisa)
        }
    }
    window.loadCategoryVisa = loadCategoryVisa
})


// swiper-thumbnail-visa
var swiper = new Swiper(".swiper-thumbnail-visa", {
    slidesPerView: 1.6,
    spaceBetween: 20,
    navigation: {
        nextEl: ".swiper-button-next-visa",
        prevEl: ".swiper-button-prev-visa",
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
var swiperComment = new Swiper(".swiper-comment-user", {
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
            slidesPerView: 1.2,
        },
        768: {
            slidesPerView: 2,
        },
        1024: {
            slidesPerView: 3,
        }
    }
});




document.addEventListener('DOMContentLoaded', function () {

    // گرفتن همه input ها داخل footer-form-email
    const inputs = document.querySelectorAll('.footer-form-email input[data-bc-text-input]');

    inputs.forEach(input => {
        input.setAttribute('type', 'email');
        input.setAttribute('required', 'required');
    });

});

// اعتبارسنجی ایمیل
document.addEventListener('input', function (e) {
    const input = e.target;

    if (input.tagName === 'INPUT' && input.closest('.footer-form-email')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (input.value && !emailRegex.test(input.value)) {
            input.setCustomValidity('لطفاً فقط ایمیل معتبر وارد کنید');
        } else {
            input.setCustomValidity('');
        }
    }
});

