/**
 * 移动设备 常用方法
 */
var q = {

    // 判断是否移动设备
    // 未处理
    isMobile: function () {
        if (typeof this._isMobile === 'boolean') {
            return this._isMobile;
        }

        var screenWidth = this.getScreenWidth();
        var fixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport;
        var fixViewPortsExperimentRunning = fixViewPortsExperiment && (fixViewPortsExperiment.toLowerCase() === "new");
        if (!fixViewPortsExperiment) {
            if (!this.isAppleMobileDevice()) {
                screenWidth = screenWidth / window.devicePixelRatio;
            }
        }
        var isMobileScreenSize = screenWidth < 600;
        var isMobileUserAgent = false;
        this._isMobile = isMobileScreenSize && this.isTouchScreen();
        return this._isMobile;
    },

    // 判断是否移动设备访问
    isMobileUserAgent: function () {
        return (/iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(window.navigator.userAgent.toLowerCase()));
    },

    // 判断是否苹果移动设备访问
    isAppleMobileDevice: function () {
        return (/iphone|ipod|ipad|Macintosh/i.test(navigator.userAgent.toLowerCase()));
    },

    // 判断是否安卓移动设备访问
    isAndroidMobileDevice: function () {
        return (/android/i.test(navigator.userAgent.toLowerCase()));
    },

    // 判断是否Touch屏幕
    isTouchScreen: function () {
        return (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    },

    // 判断是否打开视窗
    isViewportOpen: function () {
        return !!document.getElementById('wixMobileViewport');
    },

    // 获取移动设备初始化大小
    getInitZoom: function () {
        if (!this._initZoom) {
            var screenWidth = Math.min(screen.height, screen.width);
            if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
                screenWidth = screenWidth / window.devicePixelRatio;
            }
            this._initZoom = screenWidth / document.body.offsetWidth;
        }
        return this._initZoom;
    },

    // 获取移动设备最大化大小
    getZoom: function () {
        var screenWidth = (Math.abs(window.orientation) === 90) ? Math.max(screen.height, screen.width) : Math.min(screen.height, screen.width);
        if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
            screenWidth = screenWidth / window.devicePixelRatio;
        }
        var FixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport;
        var FixViewPortsExperimentRunning = FixViewPortsExperiment && (FixViewPortsExperiment === "New" || FixViewPortsExperiment === "new");
        if (FixViewPortsExperimentRunning) {
            return screenWidth / window.innerWidth;
        } else {
            return screenWidth / document.body.offsetWidth;
        }
    },

    // 获取移动设备屏幕宽度
    getScreenWidth: function () {
        var smallerSide = Math.min(screen.width, screen.height);
        var fixViewPortsExperiment = rendererModel.runningExperiments.FixViewport || rendererModel.runningExperiments.fixviewport;
        var fixViewPortsExperimentRunning = fixViewPortsExperiment && (fixViewPortsExperiment.toLowerCase() === "new");
        if (fixViewPortsExperiment) {
            if (this.isAndroidMobileDevice() && !this.isNewChromeOnAndroid()) {
                smallerSide = smallerSide / window.devicePixelRatio;
            }
        }
        return smallerSide;
    },

    //  判断微信客户端
    // Mozilla/5.0 (iPhone; CPU iPhone OS 8_3 like Mac OS X)
    // AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12F70 MicroMessenger/6.1.5 NetType/WIFI
    isWechat: function () {
        var ua = navigator.userAgent.toLowerCase();
        return /micromessenger/i.test(ua) || /windows phone/i.test(ua);
    },

    // 手机类型判断
    isMobileType: function (type) {
        switch (type) {
            case 'android':
                return navigator.userAgent.toLowerCase().indexOf('android') !== -1
            case 'iphone':
                return navigator.userAgent.toLowerCase().indexOf('iphone') !== -1
            case 'ipad':
                return navigator.userAgent.toLowerCase().indexOf('ipad') !== -1
            case 'weixin':
                return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
            default:
                return navigator.userAgent.toLowerCase()
        }
    },

};