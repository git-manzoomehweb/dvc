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
    setTimeout(() => {
        initSwiperTour();
    }, 50);
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
    matchedContents.forEach(item => item.classList.add("active"));
    setTimeout(() => {
        initSwiperHotel();
    }, 50);
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

    document.querySelectorAll(".tab-btn_popular")
        .forEach(btn => btn.classList.remove("active"));

    document.querySelectorAll(".tab-content-popular")
        .forEach(c => c.classList.remove("active"));

    evt.target.closest(".tab-btn_popular").classList.add("active");

    document
        .querySelectorAll(`.tab-content-popular[data-category="${tabName}"]`)
        .forEach(el => el.classList.add("active"));

    setTimeout(() => {
        initSwiper();
    }, 50);
}
//----------------popular-tour



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
    inputElementVisa7.setAttribute('placeholder', 'ایمیل')
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
    var inputElementPhone = document.querySelector(
        '.form-faq input[data-bc-text-input]:first-child',
    )
    var inputElementUsername = document.querySelector(
        '.form-faq input[data-bc-text-input]:last-child',
    )
    inputElementPhone.setAttribute('placeholder', 'شماره تماس')
    // inputElementUsername.setAttribute('placeholder', 'نام و نام خانوادگی')
}


document.addEventListener("DOMContentLoaded", () => {
    const fetchContentHeader = document.querySelector('.result-id')
    const contentCache = new Map()
    let swiperInstance = null

    // همه تب‌ها
    const tabs = document.querySelectorAll('.btn-tab .item-btn-tab')

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
                initSwiperVisa()
            })
        })
    }

    function initSwiperVisa() {
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
                1024: { slidesPerView: 3.5 },
                768: { slidesPerView: 2.5 },
                480: { slidesPerView: 1.5 },
            }
        })
    }



    window.loadCategory = loadCategory
})

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