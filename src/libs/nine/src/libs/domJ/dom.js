/**
 * DOM 元素操作常用方法
 */

var q = {

    // 加载样式文件
    loadStyle: function (url) {
        try {
            document.createStyleSheet(url)
        } catch (e) {
            var cssLink = document.createElement('link');
            cssLink.rel = 'stylesheet';
            cssLink.type = 'text/css';
            cssLink.href = url;
            var head = document.getElementsByTagName('head')[0];
            head.appendChild(cssLink)
        }
    },

    // 返回脚本内容
    evalscript: function (s) {
        if (s.indexOf('<script') == -1) return s;
        var p = /<script[^\>]*?>([^\x00]*?)<\/script>/ig;
        var arr = [];
        while (arr = p.exec(s)) {
            var p1 = /<script[^\>]*?src=\"([^\>]*?)\"[^\>]*?(reload=\"1\")?(?:charset=\"([\w\-]+?)\")?><\/script>/i;
            var arr1 = [];
            arr1 = p1.exec(arr[0]);
            if (arr1) {
                appendscript(arr1[1], '', arr1[2], arr1[3]);
            } else {
                p1 = /<script(.*?)>([^\x00]+?)<\/script>/i;
                arr1 = p1.exec(arr[0]);
                appendscript('', arr1[2], arr1[1].indexOf('reload=') != -1);
            }
        }
        return s;
    },

    // 清除脚本内容
    stripScript: function (s) {
        return s.replace(/<script.*?>.*?<\/script>/ig, '');
    },

    // 动态加载脚本文件
    appendscript: function (src, text, reload, charset) {
        var id = hash(src + text);
        if (!reload && in_array(id, evalscripts)) return;
        if (reload && $(id)) {
            $(id).parentNode.removeChild($(id));
        }

        evalscripts.push(id);
        var scriptNode = document.createElement("script");
        scriptNode.type = "text/javascript";
        scriptNode.id = id;
        scriptNode.charset = charset ? charset : (BROWSER.firefox ? document.characterSet : document.charset);
        try {
            if (src) {
                scriptNode.src = src;
                scriptNode.onloadDone = false;
                scriptNode.onload = function () {
                    scriptNode.onloadDone = true;
                    JSLOADED[src] = 1;
                };
                scriptNode.onreadystatechange = function () {
                    if ((scriptNode.readyState == 'loaded' || scriptNode.readyState == 'complete') && !scriptNode.onloadDone) {
                        scriptNode.onloadDone = true;
                        JSLOADED[src] = 1;
                    }
                };
            } else if (text) {
                scriptNode.text = text;
            }
            document.getElementsByTagName('head')[0].appendChild(scriptNode);
        } catch (e) {

        }
    },

    // 获取js所在路径
    getJSDir: function (src) {
        var script = null;

        if (src) {
            script = [].filter.call(document.scripts, function (v) {
                return v.src.indexOf(src) !== -1;
            })[0];
        } else {
            script = document.scripts[document.scripts.length - 1];
        }

        return script ? script.src.substr(0, script.src.lastIndexOf('/')) : script;
    },

    // 获取页面高度
    getPageHeight: function () {
        var g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat"
            ? a
            : g.documentElement;
        return Math.max(f.scrollHeight, a.scrollHeight, d.clientHeight);
    },

    // 获取页面宽度
    getPageWidth: function () {
        var g = document, a = g.body, f = g.documentElement, d = g.compatMode == "BackCompat"
            ? a
            : g.documentElement;
        return Math.max(f.scrollWidth, a.scrollWidth, d.clientWidth);
    },

    // 获取页面scrollLeft
    getPageScrollLeft: function () {
        var a = document;
        return a.documentElement.scrollLeft || a.body.scrollLeft;
    },

    // 获取页面scrollTop
    getPageScrollTop: function () {
        var a = document;
        return a.documentElement.scrollTop || a.body.scrollTop;
    },

    // 获取页面可视宽度
    getPageViewWidth: function () {
        var d = document, a = d.compatMode == "BackCompat"
            ? d.body
            : d.documentElement;
        return a.clientWidth;
    },

    // 获取页面可视高度
    getPageViewHeight: function () {
        var d = document, a = d.compatMode == "BackCompat"
            ? d.body
            : d.documentElement;
        return a.clientHeight;
    },

    // 获取窗体可见范围的宽与高
    getViewSize: function () {
        var de = document.documentElement;
        var db = document.body;
        var viewW = de.clientWidth == 0 ? db.clientWidth : de.clientWidth;
        var viewH = de.clientHeight == 0 ? db.clientHeight : de.clientHeight;
        return Array(viewW, viewH);
    },

    // 获取网页被卷去的位置
    getScrollXY: function () {
        return document.body.scrollTop ? {
            x: document.body.scrollLeft,
            y: document.body.scrollTop
        } : {
            x: document.documentElement.scrollLeft,
            y: document.documentElement.scrollTop
        }
    },

    // 解决offsetX兼容性问题
    // 针对火狐不支持offsetX/Y
    getOffset: function (e) {
        var target = e.target, // 当前触发的目标对象
            eventCoord,
            pageCoord,
            offsetCoord;

        // 计算当前触发元素到文档的距离
        pageCoord = this.getPageCoord(target);

        // 计算光标到文档的距离
        eventCoord = {
            X: window.pageXOffset + e.clientX,
            Y: window.pageYOffset + e.clientY
        };

        // 相减获取光标到第一个定位的父元素的坐标
        offsetCoord = {
            X: eventCoord.X - pageCoord.X,
            Y: eventCoord.Y - pageCoord.Y
        };
        return offsetCoord;
    },

    getPageCoord: function (element) {
        var coord = {X: 0, Y: 0};
        // 计算从当前触发元素到根节点为止，
        // 各级 offsetParent 元素的 offsetLeft 或 offsetTop 值之和
        while (element) {
            coord.X += element.offsetLeft;
            coord.Y += element.offsetTop;
            element = element.offsetParent;
        }
        return coord;
    },

    // resize的操作
    resize: function () {
        (function () {
            var fn = function () {
                var w = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth,
                    r = 1255,
                    b = Element.extend(document.body),
                    classname = b.className;
                if (w < r) {
                    //当窗体的宽度小于1255的时候执行相应的操作
                } else {
                    //当窗体的宽度大于1255的时候执行相应的操作
                }
            };

            if (window.addEventListener) {
                window.addEventListener('resize', function () {
                    fn();
                });
            } else if (window.attachEvent) {
                window.attachEvent('onresize', function () {
                    fn();
                });
            }
            fn();
        })();
    },

    /**
     * 获取当前元素样式
     *
     *
     */
    //
    // div#container{
    //     font: 2em/2.25em Verdana, Geneva, Arial, Helvetica, sans-serif;
    // }
    //
    // var elementFontSize = getStyle(document.getElementById("container"), "font-size");
    //

    getStyle: function (oElm, strCssRule) {
        var strValue = "";
        if (document.defaultView && document.defaultView.getComputedStyle) {
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        }
        else if (oElm.currentStyle) {
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
            strValue = oElm.currentStyle[strCssRule];
        }
        return strValue;
    },


};