document.addEventListener('DOMContentLoaded', function () {
    const container = document.getElementById('search-box')
    if (!container) return

    function toAbsUrl(href) {
        try {
            return new URL(href, document.baseURI).href
        } catch {
            return href
        }
    }

    function fetchEngine() {
        return new Promise((resolve, reject) => {
            const x = new XMLHttpRequest()
            x.open('GET', 'search-engine.bc')
            x.onreadystatechange = function () {
                if (x.readyState !== 4) return
                if (x.status !== 200) return reject(new Error('XHR failed: ' + x.status))
                resolve(x.responseText)
            }
            x.send()
        })
    }

    function ensureStylesheetLoaded(href) {
        const abs = toAbsUrl(href)

        return new Promise((resolve) => {
            const existing = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                .find(l => (l.href || '') === abs)

            if (existing) {
                if (existing.sheet) return resolve()
                existing.addEventListener('load', () => requestAnimationFrame(resolve), { once: true })
                existing.addEventListener('error', () => resolve(), { once: true }) // fail-open
                return
            }

            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = abs
            link.addEventListener('load', () => requestAnimationFrame(resolve), { once: true })
            link.addEventListener('error', () => resolve(), { once: true })
            document.head.appendChild(link)
        })
    }

    function moveInlineStylesToHead(tmpRoot) {
        const styles = Array.from(tmpRoot.querySelectorAll('style'))
        styles.forEach((st) => {
            const tag = document.createElement('style')
            tag.textContent = st.textContent || ''
            document.head.appendChild(tag)
            st.remove()
        })
    }

    function runScriptsInOrder(tmpRoot) {
        const scripts = Array.from(tmpRoot.querySelectorAll('script'))
        scripts.forEach(s => s.remove())

        for (const s of scripts) {
            const tag = document.createElement('script')
            if (s.src) {
                tag.src = toAbsUrl(s.getAttribute('src'))
                tag.async = false
            } else {
                tag.text = s.textContent || ''
            }
            document.head.appendChild(tag)
            document.head.removeChild(tag)
        }
    }

    function postDomFixes() {
        ;['.Basis_Date.end_date', '.Basis_Date.start_date'].forEach((selector) => {
            document.querySelectorAll(selector).forEach((input) => (input.placeholder = ''))
        })
    }

    ;(async function boot() {
        try {

            const html = await fetchEngine()

            const tmp = document.createElement('div')
            tmp.innerHTML = html

            const cssLinks = Array.from(tmp.querySelectorAll('link[rel="stylesheet"]'))
            const cssHrefs = cssLinks
                .map(l => l.getAttribute('href'))
                .filter(Boolean)

            cssLinks.forEach(l => l.remove())

            moveInlineStylesToHead(tmp)

            await Promise.all(cssHrefs.map(ensureStylesheetLoaded))

            container.innerHTML = tmp.innerHTML

            const tmp2 = document.createElement('div')
            tmp2.innerHTML = html
            Array.from(tmp2.querySelectorAll('link[rel="stylesheet"]')).forEach(l => l.remove())
            Array.from(tmp2.querySelectorAll('style')).forEach(s => s.remove())
            runScriptsInOrder(tmp2)

            postDomFixes()
        } catch (e) {
            console.error('مشکلی پیش آمده است. لطفا صبور باشید', e)
            container.innerHTML =
                '<div class="text-center p-3">خطا در بارگذاری. لطفاً دوباره تلاش کنید.</div>'
        }
    })()
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


    const pageL = document.querySelectorAll('.pagination')
    pageL.forEach(item => {
        if (item.childElementCount === 0) {
            item.style.opacity = '0'
        }
    })

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
        inputs[0].setAttribute('type' , 'number')
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

document.addEventListener('DOMContentLoaded' , function (){
    const textEmpty=document.querySelectorAll('.item-text-empty')
    textEmpty.forEach(item=>{
        if (item.innerHTML=== ''){
            item.innerHTML='----'
        }
    })
})


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
function showSwiperLoading(container, duration = 1000) {
    if (!container) return Promise.resolve();

    // اگر قبلا لودر هست، پاکش کن
    const old = container.querySelector(".swiper-loading-overlay");
    if (old) old.remove();

    container.classList.add("is-loading");
    container.style.position = container.style.position || "relative";

    // اسلایدر رو موقتا مخفی کن (کل wrapper)
    const swiperEl = container.querySelector(".swiper-thumbnail-tour");
    if (swiperEl) swiperEl.classList.add("hidden");

    // overlay loader
    const overlay = document.createElement("div");
    overlay.className = "swiper-loading-overlay my-18";
    overlay.innerHTML = `
    <div class="h-[200px] flex items-center justify-center"><div class="flex justify-center box-loading "><span class="fetch-loader"></span></div></div>
  `;
    container.appendChild(overlay);

    return new Promise((resolve) => {
        setTimeout(() => {
            overlay.remove();
            container.classList.remove("is-loading");
            if (swiperEl) swiperEl.classList.remove("hidden");
            resolve();
        }, duration);
    });
}

async function openTab(evt, tabName) {
    const allBtns = document.querySelectorAll(".btn-tab .tab-btn");
    allBtns.forEach((btn) => btn.classList.remove("active"));

    const contents = document.querySelectorAll(".tab-content");
    contents.forEach((c) => c.classList.remove("active"));

    const clickedBtn = evt.target.closest(".tab-btn");
    if (clickedBtn) clickedBtn.classList.add("active");

    // ✅ حالت پیش‌فرض: نمایش همه
    if (tabName === "all") {
        contents.forEach((item) => item.classList.add("active"));
    } else {
        const matchedContents = document.querySelectorAll(
            `.tab-content[data-category="${tabName}"]`
        );
        matchedContents.forEach((item) => item.classList.add("active"));
    }

    // کانتینری که میخوای لودر روش بیاد (بهتره نزدیک‌ترین wrapper اسلایدر باشه)
    // اگر wrapper خاص داری این selector رو تغییر بده
    const sliderWrapper =
        document.querySelector(".tour-slider-wrapper") ||
        document.querySelector(".swiper-thumbnail-tour")?.closest("section") ||
        document.querySelector(".swiper-thumbnail-tour")?.parentElement;

    // اول لودینگ، بعد از 2 ثانیه نمایش و init
    await showSwiperLoading(sliderWrapper, 1000);

    // بعد از اینکه DOM تب‌ها active شد و لودینگ رفت، اسلایدر رو init کن
    // یک tick هم میدیم که layout نهایی بشه
    setTimeout(() => {
        initSwiperTour();
    }, 0);
}




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
