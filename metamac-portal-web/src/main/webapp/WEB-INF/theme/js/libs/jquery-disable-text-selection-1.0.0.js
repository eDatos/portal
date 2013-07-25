(function ($) {

    $.fn.disableTextSelect = function () {
        return this.each(function () {
            $(this).bind("mousedown.disableTextSelect", function () {
                return false;
            });
            $(this).bind("selectstart.disableTextSelect", function () {
                return false;
            });
        });
    };
    $.fn.enableTextSelect = function () {
        return this.each(function () {
            $(this).unbind("mousedown.disableTextSelect");
            $(this).unbind("selectstart.disableTextSelect");
        });
    };

}(jQuery));

