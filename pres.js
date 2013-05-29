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
    $currentSlide = null;

var effects = {
    toggle: function($current, $next) {
        $(current).toggle();
        $(next).toggle();
    }
}

var showSlide = function($newSlide) {
    // @TODO
}

var startPresentation = function($el) {
    // check for header and footer and display them
    var hnf = $el.children(HEADER_SELECTOR + ',' + FOOTER_SELECTOR);
    if (hnf.exists()) {
        hnf.show();
    }
    $currentSlide = $ql.children(SLIDE_SELECTOR).first();
    showSlide($currentSlide);
}

$.fn.presentify = function(config) {
    var opts = $.extend({ renderContentsTo: '.contents' }, config),
        presList = {};

    this.children(PRESENTATION_SELECTOR).each(function(i, pres) {
        var $pres = $(pres);
        presList[$pres.data('pres-title')] = $pres;
    });

    var titles = getKeys(presList);
    if (titles.length == 1) {
        startPresentation(presList[titles[0]]);
    } else {
        var $container = $(opts.renderContentsTo);
        $.each(presList, function(presName, $presEl) {
            $('<div></div>', { 
                text: presName
            })
            .bind('click', function() {
                startPresentation($presEl);
            })
            .appendTo($container);               
        });
    }
}

