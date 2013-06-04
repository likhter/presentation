/*!
 * Simple presentation engine
 * @author Konstantin Likhter <konstantin@likhter.ru>
 */

;
!function(window, undefined) {
    // add .exists routine to jQuery
    if (typeof $.fn.exists !== 'function') {
        $.fn.exists = function() { return this.length > 0; }; 
    }

    /**
     * Use Object.keys if available or use jQuery based solution
     * for obtaining all of object's keys.
     *
     * @type {Function} 
     */
    var getKeys = (function() {
        return typeof Object.keys === 'function' 
            ? Object.keys 
            : function(obj) {
                return obj.map(function(key,val) {
                    return val;
                });
            };
    })();

    var 
        /**
         * List of settings for presentations grabbed from `data-` attributes
         * @type {Object}
         */
        presentationConfig, 

        /**
         * User-specified config for plug-in.
         *
         * @type {Object}
         */
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

    var 
        /** @type {jQuery|null} */
        $currentSlide = null,
        /** @type {jQuery|null} */
        $nextSlide = null,
        /** @type {jQuery|null} */
        $prevSlide = null;

    /**
     * List of effects applicable for slides.
     *
     * Every effect is described by function where first parameter is pointer to currently 
     * displayed slide (jQuery object) and second parameter is pointer to jquery object of 
     * slide to be displayed.
     *
     * @type {Object}
     */
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

    /**
     * Apply key bindings. See keyMap variable for details.
     * @function
     */
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

    /**
     * Reset key bindings. See keyMap variable for details
     * @function
     */
    var resetKeyBindings = function() {
        $.each(keyMap, function(code, method) {
            $(document).unbind('keydown.key' + code);
        });
    };

    /**
     * Show previous slide if exists.
     * @function
     */
    var showPrevSlide = function() {
        if ($prevSlide.exists()) {
            showSlide($prevSlide);
        }
    };

    /**
     * Show next slide if exists or exit presentation
     * @function
     */
    var showNextSlide = function() {
        if ($nextSlide.exists()) {
            showSlide($nextSlide);
        } else {
            exitPresentation();
        }
    };

    /**
     * Keycode -> Handler
     * See applyKeyBindings and resetKeyBindings methods.
     * 
     * @type {Object}
     */
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


    /**
     * Show new slide
     *
     * @function
     * @param {jQuery} $newSlide slide to be displayed
     */
    var showSlide = function($newSlide) {
        // select appropriate effect for the next slide and apply it
        var effect = $newSlide.data('intro-effect')             // effect specified for slide
                        || presentationConfig.defaultEffect     // effect specified for the whole presentation
                        || 'toggle';                            // default effect
        effects[effect]($currentSlide, $newSlide);

        // update pointers to next, previous and current slides
        $nextSlide = $newSlide.next(config.slideSelector);
        $prevSlide = $newSlide.prev(config.slideSelector);
        $currentSlide = $newSlide;
    };

    /**
     * Start presentation specified by jQuery object.
     * @function
     * @param {jQuery} $el jQuery element of presentation
     */
    var startPresentation = function($el) {
        // check for header and footer and display them
        var hnf = $el.children(config.headerSelector + ',' + config.footerSelector);
        if (hnf.exists()) {
            hnf.show();
        }
        $el.show();
        // load config for this presentation
        presentationConfig = $el.data();
        // load first slide
        $currentSlide = $el.children(config.slideSelector).first();
        applyKeyBindings();
        showSlide($currentSlide);
    };

    /**
     * Exit currently displayed presentation.
     * @function
     */
    var exitPresentation = function() {
        resetKeyBindings();
        $(config.presentationSelector).hide();
        $(config.contentsSelector).show();
    };

    /**
     * Entrance point for plugin.
     * See readme for usage.
     *
     * @function
     * @memberOf jQuery.fn
     */
    $.fn.presentify = function(cfg, effs) {
        // extend configs
        config = $.extend(config, cfg);
        effects = $.extend(effects, effs);

        var presList = {};

        // collect list of presentations for the container
        this.children(config.presentationSelector).each(function(i, pres) {
            var $pres = $(pres);
            presList[$pres.data('title')] = $pres;
        });

        var titles = getKeys(presList);
        if (titles.length == 1) {
            // start if only one slideshow is presented
            startPresentation(presList[titles[0]]);
        } else {
            // fill in contents container
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
