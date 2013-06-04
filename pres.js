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

    var presentationConfig, 
        config = {
            presentationSelector: '.presentation',
            headerSelector: '.header',
            footerSelector: '.footer',
            slideSelector: '.slide',
            presentationSelector: '.presentation',
            headerSelector: '.header',
            footerSelector: '.footer',
            slideSelector: '.slide',
            contentsSelector: '.contents'
        };

    var $currentSlide = null,
        $nextSlide = null,
        $prevSlide = null;

    var effects = {
        toggle: function($current, $next) {
            $current.hide();
            $next.show();
        },
        fade: function($current, $next) {
            $current.fadeOut();
            $next.fadeIn();
        },
        slideDown: function($current, $next) {
            $current.slideUp();
            $next.slideDown();
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
        /*
        if ($currentSlide) {
            $currentSlide.hide();
        }
        $newSlide.show();
        */
        var effect = $newSlide.data('intro-effect') || presentationConfig.defaultEffect || 'toggle';
        effects[effect]($currentSlide, $newSlide);
        $nextSlide = $newSlide.next(config.slideSelector);
        // $prevSlide = $currentSlide;
        $prevSlide = $newSlide.prev(config.slideSelector);
        $currentSlide = $newSlide;
    };

    var startPresentation = function($el) {
        // check for header and footer and display them
        var hnf = $el.children(config.headerSelector + ',' + config.footerSelector);
        if (hnf.exists()) {
            hnf.show();
        }
        $el.show();
        // load config for this presentation
        presentationConfig = $el.data();
        $currentSlide = $el.children(config.slideSelector).first();
        applyKeyBindings();
        showSlide($currentSlide);
    };

    var exitPresentation = function() {
        resetKeyBindings();
        $(config.presentationSelector).hide();
        $(config.contentsSelector).show();
    };

    $.fn.presentify = function(cfg, effs) {
        config = $.extend(config, cfg);
        effects = $.extend(effects, effs);

        var presList = {};

        this.children(config.presentationSelector).each(function(i, pres) {
            var $pres = $(pres);
            presList[$pres.data('title')] = $pres;
        });

        var titles = getKeys(presList);
        if (titles.length == 1) {
            startPresentation(presList[titles[0]]);
        } else {
            var $container = $(config.contentsSelector);
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
