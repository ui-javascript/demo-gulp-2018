var q = {

    // 跨浏览器绑定事件
    addEvent: function (obj, evt, fn) {
        if (!obj) {
            return;
        }

        if (obj.addEventListener) {
            obj.addEventListener(evt, fn, false);
        } else if (obj.attachEvent) { // IE
            obj.attachEvent('on' + evt, fn);
        } else { // On类型
            obj["on" + evt] = fn;
        }
    },

    // 跨浏览器删除事件
    delEvent: function (obj, evt, fn) {
        if (!obj) {
            return;
        }

        if (obj.addEventListener) {
            obj.addEventListener(evt, fn, false);
        } else if (obj.attachEvent) {
            obj.attachEvent("on" + evt, fn);
        } else {
            obj["on" + evt] = fn;
        }
    },

    // 判断鼠标是否移出事件
    isMouseOut: function (e, handler) {
        if (e.type !== 'mouseout') {
            return false;
        }
        var reltg = e.relatedTarget ? e.relatedTarget : e.type === 'mouseout' ? e.toElement : e.fromElement;
        while (reltg && reltg !== handler) {
            reltg = reltg.parentNode;
        }
        return (reltg !== handler);
    },

};