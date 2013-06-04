;
!function(window, undefined) {
    if (typeof $.fn.exists !== 'function') {
        $.fn.exists = function() { return this.length > 0; }; 
    }

    var getKeys = (function() {
        return typeof Object.keys === 'function' 
            ? Object.keys 
            : function(obj) {
                return obj.map(function(key,val) {
                    return val;
                });
            };
    })();

    var PRESENTATION_SELECTOR = '.presentation',
        HEADER_SELECTOR = '.header',
        FOOTER_SELECTOR = '.footer',
        SLIDE_SELECTOR = '.slide',
        CONTENTS_SELECTOR = '.contents',
        $currentSlide = null,
        $nextSlide = null,
        $prevSlide = null;

    var effects = {
        toggle: function($current, $next) {
            $(current).toggle();
            $(next).toggle();
        }
    };

    var applyKeyBindings = function() {
        $.each(keyMap, function(code, method) {
            $(document).bind('keydown.key' + code, function(e) {
                var pressed = e.keyCode || e.which;
                if (pressed == code) {
                    method();
                    return false;
                }
            });
        });
    };

    var resetKeyBindings = function() {
        $.each(keyMap, function(code, method) {
            $(document).unbind('keydown.key' + code);
        });
    };

    var showPrevSlide = function() {
        if ($prevSlide.exists()) {
            showSlide($prevSlide);
        }
    };

    var showNextSlide = function() {
        if ($nextSlide.exists()) {
            showSlide($nextSlide);
        } else {
            console.log('here');
            exitPresentation();
        }
    };

    var keyMap = {
        // Prev: 33 -- pgup, 37 -- left, 38 -- up
        33: showPrevSlide,
        37: showPrevSlide,
        38: showPrevSlide,

        // Next: 34 -- pgdown, 39 -- right, 40 -- down
        34: showNextSlide,
        39: showNextSlide,
        40: showNextSlide
    };


    var showSlide = function($newSlide) {
        // TODO HERE: apply effect
        if ($currentSlide) {
            $currentSlide.hide();
        }
        $newSlide.show();
        $nextSlide = $newSlide.next(SLIDE_SELECTOR);
        // $prevSlide = $currentSlide;
        $prevSlide = $newSlide.prev(SLIDE_SELECTOR);
        $currentSlide = $newSlide;
    };

    var startPresentation = function($el) {
        // check for header and footer and display them
        var hnf = $el.children(HEADER_SELECTOR + ',' + FOOTER_SELECTOR);
        if (hnf.exists()) {
            hnf.show();
        }
        $el.show();
        $currentSlide = $el.children(SLIDE_SELECTOR).first();
        applyKeyBindings();
        showSlide($currentSlide);
    };

    var exitPresentation = function() {
        resetKeyBindings();
        $(PRESENTATION_SELECTOR).hide();
        $(CONTENTS_SELECTOR).show();
    };

    $.fn.presentify = function(config) {
        var presList = {};

        this.children(PRESENTATION_SELECTOR).each(function(i, pres) {
            var $pres = $(pres);
            presList[$pres.data('pres-title')] = $pres;
        });

        var titles = getKeys(presList);
        if (titles.length == 1) {
            startPresentation(presList[titles[0]]);
        } else {
            var $container = $(CONTENTS_SELECTOR);
            $.each(presList, function(presName, $presEl) {
                $('<div></div>', { 
                    text: presName
                })
                .bind('click', function() {
                    $container.hide();
                    startPresentation($presEl);
                })
                .appendTo($container);               
            });
        }
    };

}(window);
