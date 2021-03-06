(function ($) {
    "use strict";

    var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    }

    function backgroundImage() {
        var databackground = $('[data-background]');
        databackground.each(function () {
            if ($(this).attr('data-background')) {
                var image_path = $(this).attr('data-background');
                $(this).css({
                    'background': 'url(' + image_path + ')'
                });
            }
        });
    }

    function parallax() {
        $('.bg--parallax').each(function () {
            var el = $(this),
                xpos = "50%",
                windowHeight = $(window).height();
            if (isMobile.any()) {
                $(this).css('background-attachment', 'scroll');
            } else {
                $(window).scroll(function () {
                    var current = $(window).scrollTop(),
                        top = el.offset().top,
                        height = el.outerHeight();
                    if (top + height < current || top > current + windowHeight) {
                        return;
                    }
                    el.css('backgroundPosition', xpos + " " + Math.round((top - current) * 0.2) + "px");
                });
            }
        });
    }

    function menuBtnToggle() {
        var toggleBtn = $('.menu-toggle'),
            sidebar = $('.header--sidebar'),
            menu = $('.menu');
        toggleBtn.on('click', function (event) {
            var self = $(this);
            self.toggleClass('active');
            $('.ps-main, .header').toggleClass('menu--active');
            sidebar.toggleClass('active');
        });
    }

    function subMenuToggle() {
        $('body').on('click', '.header--sidebar .menu .menu-item-has-children > a', function (event) {
            event.preventDefault();
            var current = $(this).parent('.menu-item-has-children')
            current.children('.sub-menu').slideToggle(350);
            current.children('.mega-menu').slideToggle(350);
            current.siblings().find('.sub-menu').slideUp(350);
            current.siblings().find('.mega-menu').slideUp(350);
        });
    }

    function resizeHeader() {
        var header = $('.header'),
            headerSidebar = $('.header--sidebar'),
            menu = $('.menu'),
            checkPoint = 1200,
            windowWidth = $(window).innerWidth();
        // mobile
        if (checkPoint > windowWidth) {
            $('.menu').find('.sub-menu').hide();
            menu.find('.menu').addClass('menu--mobile');
            menu.prependTo('.header--sidebar');
            $('.ps-sticky').addClass('desktop');
        }
        else {
            $('.menu').find('.sub-menu').show();
            header.removeClass('header--mobile');
            menu.prependTo('.navigation__column.center');
            menu.removeClass('menu--mobile');
            $('.header--sidebar').removeClass('active');
            $('.ps-main, .header').removeClass('menu--active');
            $('.menu-toggle').removeClass('active');
            $('.ps-sticky').removeClass('desktop');
        }
        if (windowWidth < 480) {
            $('.ps-search--header').prependTo('.header--sidebar');
        }
        else {
            $('.ps-search--header').insertBefore('.ps-cart');
        }
    }

    function stickyHeader() {
        var header = $('.header'),
            scrollPosition = 0,
            headerTopHeight = $('.header .header__top').outerHeight(),
            checkpoint = 300;
        $(window).scroll(function () {
            var currentPosition = $(this).scrollTop();
            if (currentPosition < scrollPosition) {

                if (currentPosition == 0) {
                    header.removeClass('navigation--sticky navigation--unpin navigation--pin');
                    header.css("margin-top", 0);
                }
                else if (currentPosition > checkpoint) {
                    header.removeClass('navigation--unpin').addClass('navigation--sticky navigation--pin');
                }
            }

            else {
                if (currentPosition > checkpoint) {
                    header.addClass('navigation--unpin').removeClass('navigation--pin');
                    header.css("margin-top", -headerTopHeight);
                }
            }
            scrollPosition = currentPosition;
        });
    }

    function countDown() {
        var time = $(".ps-countdown");
        time.each(function () {
            var el = $(this),
                value = $(this).data('time');
            var countDownDate = new Date(value).getTime();
            var timeout = setInterval(function () {
                var now = new Date().getTime(),
                    distance = countDownDate - now;
                var days = Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds = Math.floor((distance % (1000 * 60)) / 1000);
                // el.find('.days').html(days);
                el.find('.hours').html(days * 24 + hours);
                el.find('.minutes').html(minutes);
                el.find('.seconds').html(seconds);
                if (distance < 0) {
                    clearInterval(timeout);
                    el.closest('.ps-section').hide();
                }
            }, 1000);
        });
    }

    function masonry() {
        var masonryTrigger = $('.ps-masonry');
        if (masonryTrigger.length > 0) {
            masonryTrigger.imagesLoaded(function () {
                masonryTrigger.isotope({
                    columnWidth: '.grid-sizer',
                    itemSelector: '.grid-item'
                });
            });
            var filters = masonryTrigger.closest('.masonry-root').find('.ps-masonry__filter > li > a');
            filters.on('click', function () {
                var selector = $(this).attr('data-filter');
                filters.find('a').removeClass('current');
                $(this).parent('li').addClass('current');
                $(this).parent('li').siblings('li').removeClass('current');
                console.log($(this));
                masonryTrigger.isotope({
                    itemSelector: '.grid-item',
                    isotope: {
                        columnWidth: '.grid-sizer'
                    },
                    filter: selector
                });
                return false;
            });
        }
    }



    function productVariantsAjax() {
        var selector = $('.ps-btn'),
            shoe = $('.ps-shoe');
        shoe.on('mouseenter', function () {
            var variants = $(this).find('.ps-shoe__variant');
            if (variants.children().length === 0) {
                setTimeout(function () {
                    $.ajax({
                        url: "../js/shoe-variants.js",
                        success: function (data) {
                            var images = JSON.parse(data);
                            for (var i in images) {
                                $('<img src=' + images[i] + '>').appendTo(variants);
                            }
                            variants.owlCarousel({
                                margin: 20,
                                autoplay: false,
                                loop: false,
                                nav: true,
                                dots: false,
                                mouseDrag: true,
                                touchDrag: true,
                                navSpeed: 1000,
                                items: 4,
                                navText: ["<i class='ps-icon-back'></i>", "<i class='ps-icon-next'></i>"],
                                responsive: {
                                    0: {
                                        items: 3
                                    },
                                    480: {
                                        items: 3
                                    },
                                    768: {
                                        items: 3
                                    },
                                    992: {
                                        items: 4
                                    },
                                    1200: {
                                        items: 4
                                    }
                                }
                            });
                        }
                    });
                }, 0);

            }
            else {
                return false;
            }
        });
    }

    function productThumbnailChange() {
        var originImageData;
        $('.ps-shoe__variants').on('mouseenter', 'img', function () {
            var image = $(this).attr('src');
            var originImage = $(this).closest('.ps-shoe').find('.ps-shoe__thumbnail img');
            originImageData = originImage.attr('src');
            originImage.attr('src', image);
        });
    }

    function productVaritantsNormal() {
        var variants = $('.ps-shoe__variant.normal');
        variants.owlCarousel({
            margin: 20,
            autoplay: false,
            loop: false,
            nav: true,
            dots: false,
            mouseDrag: true,
            touchDrag: true,
            navSpeed: 1000,
            items: 4,
            navText: ["<i class='ps-icon-back'></i>", "<i class='ps-icon-next'></i>"],
            responsive: {
                0: {
                    items: 3
                },
                480: {
                    items: 3
                },
                768: {
                    items: 3
                },
                992: {
                    items: 4
                },
                1200: {
                    items: 4
                }
            }
        });
    }


    function slickConfig() {
        var primary = $('.ps-product__image'),
            second = $('.ps-product__variants');
        primary.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: '.ps-product__variants',
            dots: false,
            arrows: false,

        });
        second.slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            arrows: false,
            arrow: false,
            focusOnSelect: true,
            asNavFor: '.ps-product__image',
            vertical: true,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        arrows: false,
                        slidesToShow: 4,
                        vertical: false
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 3,
                        vertical: false
                    }
                },
            ]
        });
        primary.on('afterChange', function (event, slick, currentSlide) {
            zoomAction();
        });
        primary.on('beforeChange', function (event, slick, currentSlide) {
            $('.zoomContainer').remove();
        });
    }

    function bootstrapSelect() {
        $('.selectpicker').selectpicker({
            style: 'btn-primary',
            size: 4
        });
    }



    function filterSlider() {
        var el = $('.ac-slider');
        var min = el.siblings().find('.ac-slider__min');
        var max = el.siblings().find('.ac-slider__max');
        var defaultMinValue = el.data('default-min');
        var defaultMaxValue = el.data('default-max');
        var maxValue = el.data('max');
        var step = el.data('step');

        if (el.length > 0) {
            el.slider({
                min: 0,
                max: maxValue,
                step: step,
                range: true,
                values: [defaultMinValue, defaultMaxValue],
                slide: function (event, ui) {
                    var $this = $(this),
                        values = ui.values;

                    min.text('$' + values[0]);
                    max.text('$' + values[1]);
                }
            });

            var values = el.slider("option", "values");
            min.text('$' + values[0]);
            max.text('$' + values[1]);
        }
        else {
            return false;
        }
    }



    function stickyWidget() {
        // on scroll move the sidebar
        var widget = $('.ps-sticky.desktop');

        if (widget.length > 0 && $('.ps-sidebar').length > 0) {
            var sidebarEnd = $('.ps-sidebar').offset().top + $('.ps-sidebar').height();
            var stickyHeight = widget.height(),
                sidebarTop = widget.offset().top;
        }
        $(window).scroll(function () {
            if (widget.length > 0) {
                var scrollTop = $(window).scrollTop();
                if (sidebarTop < scrollTop) {
                    widget.css('top', scrollTop - sidebarTop + 100);
                    if (scrollTop >= sidebarEnd) {
                        widget.css('top', sidebarEnd - sidebarTop - 120);
                    }
                }

                else {
                    widget.css('top', '0');
                }
            }
        });
    }

    $(document).ready(function () {
        backgroundImage();
        parallax();
        rating();
        menuBtnToggle();
        subMenuToggle();
        owlCarousel($('.owl-slider'));
        mapConfig();
        // setHeightProduct();
        navigateOwlCarousel();
        countDown();
        masonry();
        stickyHeader();
        productVariantsAjax();
        productThumbnailChange();
        bootstrapSelect();
        slickConfig();
        zoomInit();
        magnificPopup();
        productVaritantsNormal();
        // stickyWidget();
        revolution();
        filterSlider();
    });

    $(window).on('load', function () {
        $('.ps-loading').addClass('loaded');
    });

    $(window).on('load resize', function () {
        resizeHeader()
    });

})(jQuery);

//# sourceMappingURL=main.js.map