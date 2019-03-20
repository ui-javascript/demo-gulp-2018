/*首页固定左侧导航 ============ */
(function ($) {
    $.fn.capacityFixed = function (options) {
        var opts = $.extend({}, $.fn.capacityFixed.deflunt, options);
        var FixedFun = function (element) {
            var top = opts.top;
            element.css({
                "top": top
            });
            $(window).scroll(function () {
                var scrolls = $(this).scrollTop();
                if (scrolls > top) {

                    if (window.XMLHttpRequest) {
                        element.css({
                            position: "fixed",
                            top: 10
                        });
                    } else {
                        element.css({
                            top: scrolls
                        });
                    }
                } else {
                    element.css({
                        position: "absolute",
                        top: top
                    });
                }
            });

        };
        return $(this).each(function () {
            FixedFun($(this));
        });
    };
    $.fn.capacityFixed.deflunt = {
        left: 0, //相对于页面宽度的右边定位
        top: 69,
        pageWidth: 960
    };
})(jQuery);