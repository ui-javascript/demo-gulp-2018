var q = {

    // 去掉url前缀
    removeUrlPrefix: function (a) {
        a = a.replace(/：/g, ":").replace(/．/g, ".").replace(/／/g, "/");
        while (trim(a).toLowerCase().indexOf("http://") == 0) {
            a = trim(a.replace(/http:\/\//i, ""));
        }
        return a;
    },

    // 设置url参数
    // setUrlPrmt({'a':1,'b':2})
    // result：a=1&b=2
    setUrlPrmt: function (obj) {
        var _rs = [];
        for (var p in obj) {
            if (obj[p] != null && obj[p] != '') {
                _rs.push(p + '=' + obj[p])
            }
        }
        return _rs.join('&');
    },

    // 获取url参数
    // getUrlPrmt('test.com/write?draftId=122000011938')
    // result：Object{draftId: "122000011938"}
    getUrlPrmt: function (url) {
        url = url ? url : window.location.href;
        var _pa = url.substring(url.indexOf('?') + 1),
            _arrS = _pa.split('&'),
            _rs = {};
        for (var i = 0, _len = _arrS.length; i < _len; i++) {
            var pos = _arrS[i].indexOf('=');
            if (pos == -1) {
                continue;
            }
            var name = _arrS[i].substring(0, pos),
                value = window.decodeURIComponent(_arrS[i].substring(pos + 1));
            _rs[name] = value;
        }
        return _rs;
    },

    // 获取链接参数
    getUrlParam: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null; //返回参数值
    },

    // 完美判断是否为网址
    isURL: function (strUrl) {
        var regular = /^\b(((https?|ftp):\/\/)?[-a-z0-9]+(\.[-a-z0-9]+)*\.(?:com|edu|gov|int|mil|net|org|biz|info|name|museum|asia|coop|aero|[a-z][a-z]|((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d))\b(\/[-a-z0-9_:\@&?=+,.!\/~%\$]*)?)$/i
        if (regular.test(strUrl)) {
            return true;
        } else {
            return false;
        }
    },

    // 检验URL链接是否有效
    getUrlState: function (URL) {
        var xmlhttp = new ActiveXObject("microsoft.xmlhttp");
        xmlhttp.Open("GET", URL, false);

        try {
            xmlhttp.Send();
        } catch (e) {

        } finally {
            var result = xmlhttp.responseText;
            if (result) {
                if (xmlhttp.Status == 200) {
                    return (true);
                } else {
                    return (false);
                }
            } else {
                return (false);
            }
        }
    },

    // 获取当前路径
    getCurrUrl: function () {
        var currentPageUrl = "";
        if (typeof this.href === "undefined") {
            currentPageUrl = document.location.toString().toLowerCase();
        } else {
            currentPageUrl = this.href.toString().toLowerCase();
        }
        return currentPageUrl;
    },

    // 获得URL中GET参数值
    // 用法：如果地址是 test.htm?t1=1&t2=2&t3=3, 那么能取得：GET["t1"], GET["t2"], GET["t3"]
    getUrlGet: function () {
        var querystr = window.location.href.split("?"),
            GETs = null,
            GET = [],
            tmp_arr = [],
            key = null,
            i;

        if (querystr[1]) {
            GETs = querystr[1].split("&");
            GET = [];
            for (i = 0; i < GETs.length; i++) {
                tmp_arr = GETs.split("=")
                key = tmp_arr[0]
                GET[key] = tmp_arr[1]
            }
        }
        return querystr[1];
    },

    // 提取页面代码中所有网址
    getAllUrl: function () {
        var aa = document.documentElement.outerHTML.match(/(url\(|src=|href=)[\"\']*([^\"\'\(\)\<\>\[\] ]+)[\"\'\)]*|(http:\/\/[\w\-\.]+[^\"\'\(\)\<\>\[\] ]+)/ig).join("\r\n").replace(/^(src=|href=|url\()[\"\']*|[\"\'\>\) ]*$/igm, "");
        return aa;
    },


};