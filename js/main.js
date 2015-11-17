/**
 * Created by Viachaslau_Vashchona on 11/5/2015.
 */

function htmlSpecialChars(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


function selectRadius(plus){
    var radius = $('input[name=radius]'),
        mile = 'Miles',
        value = +radius.val();

    if(value > 1 || value == 1 && plus==1){
        value += plus;
    }
    if(value==1){
        mile = "Mile";
    }

    radius.val(value);
    $('.radius-dimension').text(value+' '+mile);


}

$('.radius-plus').on('click', function(){
    selectRadius(1);
});

$('.radius-minus').on('click', function(){
    selectRadius(-1);
});


var slider = function (selector, items, step, autoplay, duration, direction){
//   defaults
    items = items ? items : 1;
    step = step ? step : 1;
    autoplay = autoplay ? autoplay : false;
    duration = duration ? duration : 4000;
    direction = direction ? direction : 1;

// vars

    var that = this,
        sliderBlock = $(selector),
        left = sliderBlock.next('.controls').find('.arrow._left'),
        right = sliderBlock.next('.controls').find('.arrow._right'),
        sliderList = sliderBlock.find('.slider__list'),
        sliderElement = sliderList.find('.slider__list__el'),
        itemWidth = 100/items,
        count = sliderElement.length/items,
        sp = 0; //slider position, by def == 0

    that.init = function (){
        sliderList.css({
            left: 0
        });
        sliderElement.css({
            width: itemWidth + '%'
        });
        that.changetheme();
    };

    that.changetheme = function(){

        if(items == 1){

            var currenSlidePosition = sp/100,
                currentSlide = sliderElement.eq(currenSlidePosition);

            var theme = currentSlide.data('theme');



            if(theme) {
                currentSlide
                    .parents('.slider-wrapper')
                    .removeAttr('class')
                    .addClass('slider-wrapper')
                    .addClass('_' + theme);
            }


        }



    };

    that.rotate = function (dir){

        if(!sliderList.is(':animated')){



            sp += dir*step*itemWidth;

            if(sp<0){
                sp = (count-1)*100;
            }

            if(sp > (count-1)*100){
                sp=0;
            }

            sliderList.animate({
                    left: -sp + '%'
                }, 500);




            that.changetheme();
        }


    };


    that.actions = function(){

        left.on('click', function (){
            that.rotate(-1);

            //console.log(1);

        });
        right.on('click', function (){
            that.rotate(1);
            //console.log(1);

        });


        that.autoplay();





    };

    that.autoplay = function(isPaused){
        isPaused ? isPaused : false;
        if(autoplay){
            var timer = setInterval(function(){
                if(!isPaused) {
                    that.rotate(direction);
                }
            }, duration);

            sliderBlock.on('mouseover', function(){
                isPaused = true;
            });

            sliderBlock.on('mouseout', function(){
                isPaused = false;
            });
        }
    };



    that.init();
    that.actions();
}




function dropable(list){
    var listBlock = $(list),
        that = this,
        form = listBlock.parents('form'),
        currentVal = listBlock
            .find('li')
            .eq(0)
            .data('value'),
        currentDescr = listBlock.find('li').eq(0).text(),
        fieldName = listBlock.data('name');

    that.init=function(){
        form.find(list).hide();
        form.find(list).before('<div class="dropable-field">'+currentDescr+'</div><input type="hidden" name="'+fieldName+'" value="'+currentVal+'" >');

    };

    that.actions = function () {
        form.on('click', '.dropable-field', function(){
            form.find(list).slideToggle('fast');
        });
        form.find(list).find('li').on('click', function(){
            var descr = $(this).text(),
                val = $(this).data('value');

            that.selectVal(descr, val);
            form.find(list).slideUp('fast');

        });

    };

    that.selectVal = function(descr, val){
        form.find('.dropable-field').text(descr);
        form.find('input[name='+fieldName+']').val(val);
    };

    that.init();

    that.actions();
}


function selectCountry(selector){
    var block = $(selector),
        that = this,
        readyCountBlock = $('.ready-country'),
        readyCurrBlock = $('.ready-currency'),
        inputName = block.data('name'),
        elements = block.find('.currency-country__country__el'),
        selected = block.find('.currency-country__selected');
    that.insert = function(descr, val){
        selected.html(descr+'<input type="hidden" name="'+inputName+'" value="'+val+'">');
    };

    that.init = function(){
        var current = elements.eq(0),
            currentVal = current.data('value'),
            currentCurrency = block.find('.dropable-field').text(),
            currentDescr = current.html();
        current.hide();
        that.insert(currentDescr, currentVal);
        readyCountBlock.html(currentDescr);
        readyCurrBlock.text(currentCurrency);

    };

    that.select = function(element, callback){
        var currentVal = element.data('value'),
            currentDescr = element.html();

        elements.filter(':hidden').slideDown('fast', function(){
            element.slideUp('fast');
        });

        that.insert(currentDescr, currentVal);
        readyCountBlock.html(currentDescr);



    };
    that.actions = function() {
        $(block).on('click', '.currency-country__country__el', function () {
            if (!elements.is(':animated')) {
                that.select($(this));
            }
        });

        $(block).on('click', '.curr-drop__el', function () {
            readyCurrBlock.text($(this).text());
        });

    };

    that.init();
    that.actions();




}

function twoColumns(selector){
    var selectedList = $('.submenu').filter(selector),
        withList = 'submenu__item__list',
        list = selectedList.find('._first'),
        like = selectedList.find('._second'),
        newClass = withList+' _first-mod',
        newList='<ul class="'+newClass+'">';
    likeListCount = like.find('li').length;
    var i=1;
    list.find('li').each(function(){
        newList+='<li>'+$(this).html()+'</li>';
        if(i==likeListCount){
            newList+='</ul><ul class="'+newClass+'">';
        }
        i++;
    });
    newList+='</ul>';

    list.after(newList);
    list.remove();

}

function showSubmenu(e, filter, effect){
    filter = filter ? filter : '';
    effect = effect ? effect : 'fade';
    var that = e.target;

    var submenu = $('.submenu').not(filter),
        child = $(that).parents('.nav_container__main-menu__item').children('.submenu').not(filter).length > 0;

    if (!submenu.is(':animated') && child) {
        if ($(that).next(submenu).is(':visible')) {
            if(effect == 'fade') {
                $(that).next(submenu).fadeOut(500);
            }else if(effect == 'slide'){
                $(that).next(submenu).slideUp(500);
            }
            $(that).removeClass('_open');
        } else {
            if(effect == 'fade') {
                submenu.filter(':visible').fadeOut(500);
            }else if(effect == 'slide'){
                submenu.filter(':visible').slideUp(500);
            }

            $('.nav_container__main-menu__item__link').filter('._open').removeClass('_open');
            if(effect == 'fade') {
                $(that).next(submenu).filter(':hidden').fadeIn(500);
            }else if(effect == 'slide'){
                $(that).next(submenu).filter(':hidden').slideDown(500);
            }

            $(that).addClass('_open');
        }
    }

}

var countryToShow = $('.currency-country');

// drop
new dropable('.bottom-drop');
new dropable('.curr-drop');

// country
new selectCountry('.currency-country');

// two colls in main menu
twoColumns('._women');
twoColumns('._men');
twoColumns('._children');

//sliders
new slider('.main', 1, 1, false, 5000);
new slider('.product-slider._popular', 4, 1, true, 4000);
new slider('.product-slider._just-arrived', 4, 1, true, 2000);



$('.ready-currency-country').on('click', function(){
    if(!countryToShow.is(':animated')) {
        countryToShow.fadeToggle(500);
    }
});


$('.currency-country-close').on('click', function(){
    countryToShow.fadeOut(500);
});


$('.question').on('click', function(e) {
    target = $(e.target);
    if (target.is('.question')) {

        $('.question__arrow').fadeToggle(500, function () {
            $('.question__arrow__assistant').show(100);
        });
    }
});


$('.question__arrow__assistant, .question__arrow').on('click', function(){
    $('.livechat').css({
        position: 'fixed',
        right: '3%',
        top: '20%'
    });
    $('.livechat').fadeIn(500, function(){

        $('.question__arrow').fadeOut(300);
    });
});


$('.livechat__close').on('click', function(){
    $('.livechat').fadeOut(500);
});



if(!navigator.userAgent.match(/MSIE 8.0/i)){


    function getCoords(elem) {
        var box = elem.getBoundingClientRect();

        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };

    };



    var chatHead = document.getElementById('livechat-head');

    chatHead.onmousedown = function(e) {


        var chat = document.getElementById('livechat');
        var coords = getCoords(chat);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;

        chat.style.position = 'absolute';
        document.body.appendChild(chat);
        moveAt(e);

        chat.style.zIndex = 1000; // над другими элементами

        function moveAt(e) {
            chat.style.left = e.pageX - shiftX + 'px';
            chat.style.top = e.pageY - shiftY + 'px';
        }

        document.onmousemove = function(e) {
            moveAt(e);
        };

        chat.onmouseup = function() {
            document.onmousemove = null;
            chat.onmouseup = null;
        };

    }




    chatHead.ondragstart = function() {
        return false;
    };


}




$('a[href="#"]').click(function(){

    return false;
});


$(window).on('load resize', function(){
    var width = $(window).width(),
        sliders =  $('.product-slider'),
        tablet = false,
        mobile = false;


    if(width <= 850){
        tablet = true;
    }
    if(width < 570){
        tablet = false;
        mobile = true;
        $('.nav_container__main-menu__item__link').removeClass('_act');

    }




    if(tablet){
        var submitSearchForm = $('.nav_container__main-menu__item__submit'),
            inputSearchForm = $('.nav_container__main-menu__item__input'),
            form = inputSearchForm.parents('form');
        submitSearchForm.not('._act').on('click', function(){
            $(this).addClass('_act');
            inputSearchForm.addClass('_visible');
            //console.log(1);
            return false;
        });
        form.on('click', '._act', function(){
            form.trigger('submit');

        });



        $(document).on('click', function(e){
           var target = $(e.target);

            if(!target.is('.nav_container__main-menu__item__input._visible') && !target.is('.nav_container__main-menu__item__submit._act')){
                inputSearchForm.removeClass('_visible');
                submitSearchForm.removeClass('_act');

            }
        });


    }

    if(mobile || tablet){
        //sliders stop
        sliders.trigger('mouseenter');
        sliders.on('mouseout', function(){
            sliders.trigger('mouseenter');
        });
    }

    $('.nav_container__main-menu__item__link').on('click', function(e){
        if(mobile){
            showSubmenu(e, '', 'slide');

        }else {
            showSubmenu(e, '._search');

        }


    });

    if(!mobile) {
        $('.submenu._search').filter(':hidden').show();
        $('.submenu__item__list').css({display: 'inline-block'});
        $('.nav_container__main-menu__list').show();
    }else{
        $('.submenu._search').filter(':visible').hide();
        $('.submenu__item__list').hide();
        $('.submenu__item__heading').removeClass('_submenu-act');

        $('.submenu__item__heading').on('click', function(e){
            var target = $(e.target);
            $('.submenu__item__list').filter(':visible').not(':animated').not(target).slideUp(500);

            $(this).nextAll('.submenu__item__list').not(':animated').slideToggle(500);
            $(this).toggleClass('_submenu-act');
        });

        $(document).on('click', function(e) {
            var target = $(e.target);

            if(!target.parents('.nav_container__main-menu').length>0){
                $('.hamburger').removeClass('_active');
                $('.nav_container__main-menu__list').slideUp(500);
            }

        });
    }





});



$('.hamburger').on('click', function(){
   $(this).next('.nav_container__main-menu__list').slideToggle(500);
    $(this).toggleClass('_active');
});



$(document).on('click', function(e){
    var target = $(e.target),
        currencyCountryBlock = $('.currency-country'),
        submenu = $('.submenu').not('._search');
    //console.log(target.parents('.header-content__currency').length);
    if(currencyCountryBlock.is(':visible')) {
        if (target.parents('.header-content__currency').length == 0) {

                currencyCountryBlock.fadeOut(500);


        }
    }
    if(submenu.is(':visible')) {
        if (target.parents('.nav_container__main-menu__item').length == 0) {


                submenu.fadeOut(500);




            $('.nav_container__main-menu__item__link._open').removeClass('_open');

        }
    }
});


$('form').on('submit', function(){

    var form = $(this),
        modal = $('.modal'),
        text = '';
        error = false;

    form.find('input').not('[type=submit], [type=hidden], .no-validation').each(function(){
        var value = $(this).val().trim();

        if(value == ''){
            $(this).val(htmlSpecialChars(value));
            $(this).addClass('_err');
            error = true;
        }


    });

    if(!error){
        if(form.attr('name')!='search'){
            form.trigger('reset');
            text = "Thank you";
        }else{
            text = "Well, let's look for the \""+form.find('.nav_container__main-menu__item__input').val()+"\"";
        }

    }
    else{
        text = "Please, fill the red fields.";
    }
    modal.text(text);
    modal.show('fast');

    setTimeout(function(){
        modal.hide('fast');
    }, 3000);

    return false;
});

$(document).on('click', '._err', function(){

    $(this).removeClass('_err');
});

