var q = {

    // 时间日期格式转换
    format: function (formatStr) {
        var str = formatStr;
        var Week = ['日', '一', '二', '三', '四', '五', '六'];
        str = str.replace(/yyyy|YYYY/, this.getFullYear());
        str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));
        str = str.replace(/MM/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
        str = str.replace(/M/g, (this.getMonth() + 1));
        str = str.replace(/w|W/g, Week[this.getDay()]);
        str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
        str = str.replace(/d|D/g, this.getDate());
        str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
        str = str.replace(/h|H/g, this.getHours());
        str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
        str = str.replace(/m/g, this.getMinutes());
        str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
        str = str.replace(/s|S/g, this.getSeconds());
        return str
    },

    // 日期格式化函数+调用方法
    regexFormat: function (format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(),    //day
            "h+": this.getHours(),   //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
            "S": this.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
        return format;
    },

    /*
        时间个性化输出功能

        1、< 60s, 显示为“刚刚”
        2、>= 1min && < 60 min, 显示与当前时间差“XX分钟前”
        3、>= 60min && < 1day, 显示与当前时间差“今天 XX:XX”
        4、>= 1day && < 1year, 显示日期“XX月XX日 XX:XX”
        5、>= 1year, 显示具体日期“XXXX年XX月XX日 XX:XX”
    */
    timeFormat: function (time) {
        var date = new Date(time),
            curDate = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 10,
            day = date.getDate(),
            hour = date.getHours(),
            minute = date.getMinutes(),
            curYear = curDate.getFullYear(),
            curHour = curDate.getHours(),
            timeStr;

        if (year < curYear) {
            timeStr = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute;
        } else {
            var pastTime = curDate - date,
                pastH = pastTime / 3600000;

            if (pastH > curHour) {
                timeStr = month + '月' + day + '日 ' + hour + ':' + minute;
            } else if (pastH >= 1) {
                timeStr = '今天 ' + hour + ':' + minute + '分';
            } else {
                var pastM = curDate.getMinutes() - minute;
                if (pastM > 1) {
                    timeStr = pastM + '分钟前';
                } else {
                    timeStr = '刚刚';
                }
            }
        }
        return timeStr;
    },

    // 某年某月某日为星期几
    // getWeekDay(new Date(2015, 9, 1)
    getWeekDay: function (date) {
        var weekday = ["日", "一", "二", "三", "四", "五", "六"];
        return '星期' + weekday[date.getDay()];    //2015年10月1号
    },



};

// alert(new Date().format("yyyy-MM-dd hh:mm:ss"));
