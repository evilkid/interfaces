$(window).on("load", function () {

// scroll
    $('.left-menu').bind('mousewheel DOMMouseScroll', function (e) {
        var scrollTo = null;
        if (e.type == 'mousewheel') {
            scrollTo = (e.originalEvent.wheelDelta * -1);
        } else if (e.type == 'DOMMouseScroll') {
            scrollTo = 40 * e.originalEvent.detail;
        }
        if (scrollTo) {
            e.preventDefault();
            $(this).scrollTop(scrollTo + $(this).scrollTop());
        }
    });

// filters
    $('.top-content-panel-icons a').on('click', function () {
        $(this).addClass('active-top-content-panel-icon');
        $(this).siblings().removeClass('active-top-content-panel-icon')
    });


// search
    $('.search-category input').on('input', function () {
        var value = $('.search-category input').val().toLowerCase();
        var arr = [];
        // each li wich begin with first letter push to arr and show						 
        $('.main-content-navigation li').each(function (val, item) {
            if (item.textContent.toLowerCase().trim().indexOf(value) == 0) {
                arr.push(item);
                item.style.display = 'block';
            } else {
                // else hide
                item.style.display = 'none';
            }
        });

        // add class to cross elem
        if ($('.search-category input').val()) {
            $('.search-category .search').removeClass('active-input');
            $('.search-category .cross').addClass('active-input');
        } else {
            $('.search-category .cross').removeClass('active-input');
            $('.search-category .search').addClass('active-input');
        }

        $('.search-category .cross')[0].addEventListener("click", cleanInput);

        if (arr.length == 0)
            $('.no-results').css({
                'display': 'block'
            });
        else
            $('.no-results').css({
                'display': 'none'
            });
    });

    function cleanInput() {
        $('.search-category input').val('');
        $('.search-category .cross').removeClass('active-input');
        $('.search-category .search').addClass('active-input');
        $('.main-content-navigation li').each(function (val, item) {
            item.style.display = 'block';
        });

        $('.no-results').css({
            'display': 'none'
        });
    }

// class active in left menu 
    $('.left-menu a').each(function (val, item) {
        item.addEventListener("click", addActiveClass);
    });

    function addActiveClass() {
        $('.left-menu a').each(function (val, item) {
            if (item.classList.contains("active"))
                item.classList.remove("active");
        });
        this.classList.add("active");
    }


// class active in mobile hamburfer menu 
    $('.head-navigation-mobile li a').each(function (val, item) {
        item.addEventListener("click", addActiveClass);
    });

    function addActiveClass() {
        $('.head-navigation-mobile li a').each(function (val, item) {
            if (item.classList.contains("active-link-head-navigation-mobile"))
                item.classList.remove("active-link-head-navigation-mobile");
        });
        this.classList.add("active-link-head-navigation-mobile");
    }

    $('.angle').on('click', function () {
        $("body").css("overflow", "hidden");
        $(".logo").hide();
        $('.left-side').addClass('active-left-side-menu-mobile');
        $('.hamburger-menu').addClass('active-hamburger-menu');
    });

    $('.hamburger-menu').on('click', function () {
        // console.log(this.classList.length)
        if (this.classList.length == 1) {
            $('.head-navigation-mobile').addClass('active-head-nav-mobile');
            $('.hamburger-menu').addClass('active-hamburger-menu');
            $('body').css("overflow", "hidden");
        } else {
            if ($(this).hasClass('active-hamburger-menu')) {
                $('.left-side').removeClass('active-left-side-menu-mobile');
                $('.head-navigation-mobile').removeClass('active-head-nav-mobile');
                $('.hamburger-menu').removeClass('active-hamburger-menu');
                $('body').css("overflow", "visible");
                $(".logo").show();
            }
            //..... add something to hamburger	
        }
    });

    $('.like').on('click', function () {
        $(this).toggleClass('liked');
    });
// magic-line

    $(document).on("click", ".head-navigation-mobile li a", function () {
        var step = 60;
        var indexCurrentElem = $('.head-navigation-mobile li a').index($(this));
        var markerStep = indexCurrentElem * (step);
        $('#mobile-magic-line').css({'transform': 'translateY(' + markerStep + 'px)'});


        $('.hamburger-menu').click();
    });
    $(document).on("click", ".left-menu a", function () {

        var step = 40;
        if ($(".hamburger-menu").is(":visible")) {
            step = 52;
        }


        var indexCurrentElem = $('.left-menu a').index($(this));
        var markerStep = 2 + (indexCurrentElem * (step));

        $('#magic-line').css({'transform': 'translateY(' + markerStep + 'px)'});
        cleanInput();
        if ($(".active-hamburger-menu").is(":visible")) {
            $('.hamburger-menu').click();
        }
    });

    $(document).on("selectItem", ".left-menu a", function () {
        var step = 40;

        if ($(".hamburger-menu").is(":visible")) {
            step = 52;
        }
        var indexCurrentElem = $('.left-menu a').index($(this));
        var markerStep = 2 + (indexCurrentElem * (step));
        //transition: transform .4s; */
        $('#magic-line').css({'transition': 'none'});
        $('#magic-line').css({'transform': 'translateY(' + markerStep + 'px)'});
        $('#magic-line').stop();
        setTimeout(function () {
            $('#magic-line').css({'transition': 'transform .4s'});
        }, 400);
        cleanInput();
    });

    $(window).resize(function () {
        $(".content-section > div").each(function () {
            $(this).height(calculateNewHeight($(this).width()) - 10);
        });


        $(document).trigger("selectItem");
    });

    function calculateNewHeight(width) {
        return (35 / 66) * width;
    }

    // Get the modal
    var modal = document.getElementById('myModal');

// When the user clicks anywhere outside of the modal, close it
});