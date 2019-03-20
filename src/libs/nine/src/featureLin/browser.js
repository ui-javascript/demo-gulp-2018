/**
 * 浏览器常用方法
 * @type {{}}
 */
var q = {

    // 加入收藏夹
    addFavorite: function (sURL, sTitle) {
        try {
            window.external.addFavorite(sURL, sTitle)
        } catch (e) {
            try {
                window.sidebar.addPanel(sTitle, sURL, "")
            } catch (e) {
                alert("加入收藏失败，请使用Ctrl+D进行添加")
            }
        }
    },

    // 设为首页
    setHomepage: function () {
        if (document.all) {
            document.body.style.behavior = 'url(#default#homepage)';
            document.body.setHomePage('http://w3cboy.com')
        } else if (window.sidebar) {
            if (window.netscape) {
                try {
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect")
                } catch (e) {
                    alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入 about:config,然后将项 signed.applets.codebase_principal_support 值该为true")
                }
            }
            var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
            prefs.setCharPref('browser.startup.homepage', 'http://w3cboy.com')
        }
    },

    // 确认是否键盘有效输入值
    checkKey: function (iKey) {
        if (iKey == 32 || iKey == 229) {
            return true;
        }
        /*空格和异常*/
        if (iKey > 47 && iKey < 58) {
            return true;
        }
        /*数字*/
        if (iKey > 64 && iKey < 91) {
            return true;
        }
        /*字母*/
        if (iKey > 95 && iKey < 108) {
            return true;
        }
        /*数字键盘1*/
        if (iKey > 108 && iKey < 112) {
            return true;
        }
        /*数字键盘2*/
        if (iKey > 185 && iKey < 193) {
            return true;
        }
        /*符号1*/
        if (iKey > 218 && iKey < 223) {
            return true;
        }
        /*符号2*/
        return false;
    },

    // 返回顶部
    backTop: function (btnId) {
        var btn = document.getElementById(btnId);
        var d = document.documentElement;
        var b = document.body;
        window.onscroll = set;
        btn.style.display = "none";
        btn.onclick = function () {
            btn.style.display = "none";
            window.onscroll = null;
            this.timer = setInterval(function () {
                d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                if ((d.scrollTop + b.scrollTop) == 0) clearInterval(btn.timer, window.onscroll = set);
            }, 10);
        };

        function set() {
            btn.style.display = (d.scrollTop + b.scrollTop > 100) ? 'block' : "none"
        }
    },

    // 打开一个窗体通用方法
    openWindow: function (url, windowName, width, height) {
        var x = parseInt(screen.width / 2.0) - (width / 2.0),
            y = parseInt(screen.height / 2.0) - (height / 2.0),
            retval = null,
            isMSIE = (navigator.appName == "Microsoft Internet Explorer");

        if (isMSIE) {
            var p = "resizable=1,location=no,scrollbars=no,width=";
            p = p + width;
            p = p + ",height=";
            p = p + height;
            p = p + ",left=";
            p = p + x;
            p = p + ",top=";
            p = p + y;
            retval = window.open(url, windowName, p);
        } else {
            var win = window.open(url, "ZyiisPopup", "top=" + y + ",left=" + x + ",scrollbars=" + scrollbars + ",dialog=yes,modal=yes,width=" + width + ",height=" + height + ",resizable=no");
            eval("try { win.resizeTo(width, height); } catch(e) { }");
            win.focus();
        }

    },

    // 清除html代码中的脚本
    clear_script: function () {
        K1.value = K1.value.replace(/<script.*?>[\s\S]*?<\/script>|\s+on[a-zA-Z]{3,16}\s?=\s?"[\s\S]*?"|\s+on[a-zA-Z]{3,16}\s?=\s?'[\s\S]*?'|\s+on[a-zA-Z]{3,16}\s?=[^ >]+/ig, "");
    },

    // 动态执行JavaScript脚本
    javascript: function () {
        try {
            eval(K1.value);
        } catch (e) {
            alert(e.message);
        }
    },


    // 动态执行VBScript脚本
    vbscript: function () {
        try {
            var script = document.getElementById("K1").value;
            if (script.trim() == "") return;
            window.execScript('On Error Resume Next \n' + script + '\n If Err.Number<>0 Then \n MsgBox "请输入正确的VBScript脚本!",48,"脚本错误!" \n End If', "vbscript")
        } catch (e) {
            alert(e.message);
        }
    },

    // 获取浏览器信息
    getBrowserInfo: function () {
        var Info = {};
        var str = window.navigator.userAgent.toLowerCase();
        var bReg = /(msie|firefox|chrome|opera|version).*?([\d.]+)/;
        var infoArr = str.match(bReg);
        Info.browser = infoArr[1].replace(/version/, "safari");
        Info.ver = infoArr[2];
        return Info;
    },


};

// backTop('goTop');