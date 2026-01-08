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
                                    input.placeholder = 'انتخاب تاریخ'
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
document.addEventListener("DOMContentLoaded", () => {
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
            slidesPerView: 5,
            spaceBetween: 20,
            loop: false,
            navigation: {
                nextEl: swiperEl.querySelector('.swiper-button-next-visa'),
                prevEl: swiperEl.querySelector('.swiper-button-prev-visa'),
            },
            breakpoints: {
                1024: {slidesPerView: 5},
                768: {slidesPerView: 3},
                480: {slidesPerView: 1},
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


document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".row-default");
    const titleEditor = document.querySelector(".row-default:nth-child(even) .title-editor");
    if (!container) return;
    const paragraphs = container.querySelectorAll("p");
    paragraphs.forEach(p => {
        if (p.querySelector("img")) {
            titleEditor.style.paddingRight = '53%'
        }
    });
});

// modal-video
const btnVideo = document.querySelector('.btn-view-video')
const modalVideo = document.getElementById('box-video')
const modalBox = modalVideo.querySelector('.box-video')

btnVideo.addEventListener('click', () => {
    modalVideo.classList.remove('hidden')
    modalVideo.classList.add('flex')
})

modalVideo.addEventListener('click', () => {
    modalVideo.classList.add('hidden')
    modalVideo.classList.remove('flex')
})

modalBox.addEventListener('click', (e) => {
    e.stopPropagation()
})

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

var swiper = new Swiper(".swiper-services-item", {
    slidesPerView: 2.5,
    spaceBetween: 12,
    observer: true,
    observeParents: true,
    breakpoints: {
        640: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 1.5,
        },
        1024: {
            slidesPerView: 2.5,
        }
    }
});





//---------------slider-tour


//---------------slider-hotel
let swiperHotel;

function initSwiperHotel() {
    if (swiperHotel) {
        swiperHotel.destroy(true, true);
    }
    swiperHotel = new Swiper(".swiper-thumbnail-hotel", {
        slidesPerView: 3,
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

function openTabPopular(evt, tabName) {
    // جلوگیری از رفتارهای پیش‌فرض (اگر بعداً دکمه تبدیل به <a> شد)
    if (evt && typeof evt.preventDefault === "function") evt.preventDefault();

    // 1) غیر فعال کردن همه دکمه‌ها
    document
        .querySelectorAll(".tab-btn_popular")
        .forEach((btn) => btn.classList.remove("active"));

    // 2) مخفی/غیرفعال کردن همه آیتم‌ها
    document
        .querySelectorAll(".tab-content-popular")
        .forEach((c) => c.classList.remove("active"));

    // 3) فعال کردن دکمه کلیک‌شده
    const clickedBtn =
        (evt && evt.currentTarget) ||
        (evt && evt.target && evt.target.closest(".tab-btn_popular"));

    if (clickedBtn) clickedBtn.classList.add("active");

    // 4) اگر all بود => همه آیتم‌ها
    if (tabName === "all") {
        document
            .querySelectorAll(".tab-content-popular")
            .forEach((el) => el.classList.add("active"));
        return;
    }

    // 5) فیلتر بر اساس data-category
    document
        .querySelectorAll(`.tab-content-popular[data-category="${tabName}"]`)
        .forEach((el) => el.classList.add("active"));
}

// ✅ پیش‌فرض: "همه" فعال باشد و همه آیتم‌ها نمایش داده شوند
document.addEventListener("DOMContentLoaded", function () {
    const allBtn = document.querySelector('.tab-btn_popular[data-tab="all"]');

    if (allBtn) {
        // اجرای تابع با یک evt ساختگی که currentTarget داشته باشد
        openTabPopular({ preventDefault() {}, currentTarget: allBtn }, "all");
    } else {
        // اگر دکمه "همه" نبود، حداقل همه آیتم‌ها نمایش داده شوند
        document
            .querySelectorAll(".tab-content-popular")
            .forEach((el) => el.classList.add("active"));
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const defaultBtn = document.querySelector(".btn-tab[data-default='true'] .tab-btn");
    if (defaultBtn) {
        defaultBtn.click();
    }
});


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

document.addEventListener("DOMContentLoaded", function () {
    const defaultBtn = document.querySelector(".tab-btn[data-default='true']");
    const defaultBtnHotel = document.querySelector(".tab-btn_hotel[data-default='true']");
    const defaultBtnPopular = document.querySelector(".tab-btn_popular[data-default='true']");
    if (defaultBtn) {
        defaultBtn.click();
        defaultBtnPopular.click();
    }
    if (defaultBtnHotel) {
        defaultBtnHotel.click();
    }
    if (defaultBtnPopular) {
        defaultBtnPopular.click();
    }
});

// form-footer
function uploadDocumentFooter(args) {
    const form = document.querySelector('#form-footer')
    const textMail = document.getElementById('text-email')
    const emailInput = form.querySelector('[data-bc-text-input]')
    const emailValue = emailInput?.value.trim()

    // الگوی ساده اعتبارسنجی ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(emailValue)) {
        textMail.innerHTML= 'لطفاً یک ایمیل معتبر وارد کنید'
        emailInput.focus()
        return // جلوگیری از ثبت فرم
    }

    // اگر ایمیل معتبر بود، ادامه بده
    form.querySelector('.Loading_Form').style.display = 'block'

    const captcha = form.querySelector("#captchaContainer input[name='captcha']").value
    const captchaid = form.querySelector("#captchaContainer input[name='captchaid']").value
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
    const inputElementVisa7 = document.querySelector(
        '.footer-form-email [data-bc-text-input]'
    );

    inputElementVisa7.setAttribute('placeholder', 'ایمیل خود را وارد کنید');

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
        console.log(errorid)
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


// form-about
function uploadDocumentAbout(args) {
    document.querySelector('#form-about .Loading_Form').style.display =
        'block'
    const captcha = document
        .querySelector('#form-about')
        .querySelector("#captchaContainerAbout input[name='captcha']").value
    const captchaid = document
        .querySelector('#form-about')
        .querySelector("#captchaContainerAbout input[name='captchaid']").value
    const stringJson = JSON.stringify(args.source?.rows[0])
    $bc.setSource('cms.uploadAbout', {
        value: stringJson,
        captcha: captcha,
        captchaid: captchaid,
        run: true,
    })
}

function refreshCaptchaAbout(e) {
    $bc.setSource('captcha.refreshAbout', true)
}

async function OnProcessedEditObjectAbout(args) {
    var response = args.response
    var json = await response.json()
    var errorid = json.errorid
    if (errorid == '6') {
        document.querySelector('#form-about .Loading_Form').style.display =
            'none'
        document.querySelector('#form-about .message-api').innerHTML =
            'درخواست شما با موفقیت ثبت شد.'
        document.querySelector('#form-about .message-api').style.color =
            'rgb(60 200 60)'
    } else {
        refreshCaptchaAbout()
        setTimeout(() => {
            document.querySelector(
                '#form-about .Loading_Form',
            ).style.display = 'none'
            document.querySelector('#form-about .message-api').innerHTML =
                'خطایی رخ داده, لطفا مجدد اقدام کنید.'
            document.querySelector('#form-about .message-api').style.color =
                'rgb(220 38 38)'
        }, 2000)
    }
}


async function RenderFormAbout() {
    var inputElementEmail = document.querySelector(
        '.form-about input[data-bc-text-input]',
    )
    inputElementEmail.setAttribute('placeholder', 'ایمیل خود را وارد کنید')
}

function ShareSocialMedia(event, containerid) {
    event.stopPropagation(); // جلوگیری از بسته شدن هنگام کلیک داخل باکس

    const container = document.getElementById(containerid);
    const shareBox = container.querySelector(".socialmedia-box-share");
    const txtcontainer = container.querySelector(".text-share-box");
    const bgactivation = container.querySelector(".bg-activation-sharebtn");
    const onlybtncontainer = document.getElementById("sharebutton-content");

    if (!container || !shareBox) return;

    // بررسی باز یا بسته بودن
    const isOpen = container.classList.contains("hovered");

    if (isOpen) {
        // بستن باکس
        shareBox.classList.add("invisible", "opacity-0");
        container.classList.remove("hovered", "w-[302px]");
        onlybtncontainer.classList.remove("w-[302px]");
        txtcontainer.classList.remove("text-white");
        bgactivation.classList.remove(
            "right-0",
            "!mx-0",
            "h-full",
            "w-full",
            "p-0"
        );
    } else {
        // بستن سایر باکس‌ها (در صورتی که چندین باکس وجود داشته باشد)
        document.querySelectorAll(".share-container").forEach((el) => {
            el.classList.remove("hovered", "w-[302px]");
            onlybtncontainer.classList.remove("w-[302px]");
            txtcontainer.classList.remove("text-white");
            bgactivation.classList.remove(
                "right-0",
                "!mx-0",
                "h-full",
                "w-full",
                "p-0"
            );
            el.querySelector(".socialmedia-box-share").classList.add(
                "invisible",
                "opacity-0"
            );
        });

        // باز کردن باکس
        shareBox.classList.remove("invisible", "opacity-0", "w-full");
        container.classList.add("hovered", "w-full");
        onlybtncontainer.classList.add("w-full");
        txtcontainer.classList.add("text-white");
        bgactivation.classList.add("right-0", "!mx-0", "h-full", "w-full", "p-0");
    }
}





document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".row-default");
    const titleEditor = document.querySelector(".row-default:nth-child(even) .title-editor");
    if (!container) return;
    const paragraphs = container.querySelectorAll("p");
    paragraphs.forEach(p => {
        if (p.querySelector("img")) {
            titleEditor.style.paddingRight = '53%'
        }
    });
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
                            target.scrollIntoView({behavior: "smooth"});
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
                            target.scrollIntoView({behavior: "smooth"});
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
                            target.scrollIntoView({behavior: "smooth"});
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
                            target.scrollIntoView({behavior: "smooth"});
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
                            target.scrollIntoView({behavior: "smooth"});
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
                            target.scrollIntoView({behavior: "smooth"});
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




//---------------slider-tour
let swiperTour;

function initSwiperTour() {
    if (swiperTour) {
        swiperTour.destroy(true, true);
    }

    swiperTour = new Swiper(".swiper-thumbnail-tour", {
        slidesPerView: 3,
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