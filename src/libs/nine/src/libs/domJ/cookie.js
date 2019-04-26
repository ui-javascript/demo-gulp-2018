var q = {
    // 获取Cookie
    getCookie: function (key) {
        var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
        if (arr != null) {
            return decodeURIComponent(arr[2]);
        }
        return null
    },

    // 设置Cookie
    setCookie: function (name, value, Hours) {
        var d = new Date(),
            offset = 8,
            utc = d.getTime() + (d.getTimezoneOffset() * 60000),
            nd = utc + (3600000 * offset),
            exp = new Date(nd);

        exp.setTime(exp.getTime() + Hours * 60 * 60 * 1000);
        document.cookie = name + "=" + decodeURI(value) + ";path=/;expires=" + exp.toGMTString() + ";"
    },

    //cookie
    //设置cookie
    setCookie: function (name, value, iDay) {
        var oDate = new Date();
        oDate.setDate(oDate.getDate() + iDay);
        document.cookie = name + '=' + value + ';expires=' + oDate;
    },
    // 获取cookie
    getCookie: function (name) {
        var arr = document.cookie.split('; ');
        for (var i = 0; i < arr.length; i++) {
            var arr2 = arr[i].split('=');
            if (arr2[0] == name) {
                return arr2[1];
            }
        }
        return '';
    },

    // 删除cookie
    removeCookie: function (name) {
        this.setCookie(name, 1, -1);
    },


};