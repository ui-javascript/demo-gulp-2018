var q = {
    // 随机数时间戳
    getUniqueId: function () {
        var a = Math.random, b = parseInt;
        return Number(new Date()).toString() + b(10 * a()) + b(10 * a()) + b(10 * a());
    },

    // 获取随机数
    getRandomNum: function (m, n) {
        return Math.random() * (n - m) + m;
    },

    getRandomNumEx: function (n1, n2) {
        if (arguments.length === 2) {
            return Math.round(n1 + Math.random() * (n2 - n1));
        }
        else if (arguments.length === 1) {
            return Math.round(Math.random() * n1)
        }
        else {
            return Math.round(Math.random() * 255)
        }
    },

    // 随机码（toString详解）
    // count取值范围0-36
    // randomWord(10)
    randomWord: function (count) {
        return Math.random().toString(count).substring(2);
    }


};