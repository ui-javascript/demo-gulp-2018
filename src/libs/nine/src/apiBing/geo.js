var q = {

    // 得到地理位置
    getLocation: function (callback) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (p) {
                    callback(p.coords.latitude, p.coords.longitude);
                },
                function (e) {
                    var msg = e.code + "\n" + e.message;
                }
            );
        }
    }

};