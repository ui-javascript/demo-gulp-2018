var q = {
    
    // 金额大写转换函数
    transform: function (tranvalue) {
        try {
            var i = 1;
            var dw2 = new Array("", "万", "亿"); //大单位
            var dw1 = new Array("拾", "佰", "仟"); //小单位
            var dw = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //整数部分用
            //以下是小写转换成大写显示在合计大写的文本框中
            //分离整数与小数
            var source = this.splits(tranvalue);
            var num = source[0];
            var dig = source[1];
            //转换整数部分
            var k1 = 0; //计小单位
            var k2 = 0; //计大单位
            var sum = 0;
            var str = "";
            var len = source[0].length; //整数的长度
            for (i = 1; i <= len; i++) {
                var n = source[0].charAt(len - i); //取得某个位数上的数字
                var bn = 0;
                if (len - i - 1 >= 0) {
                    bn = source[0].charAt(len - i - 1); //取得某个位数前一位上的数字
                }
                sum = sum + Number(n);
                if (sum != 0) {
                    str = dw[Number(n)].concat(str); //取得该数字对应的大写数字，并插入到str字符串的前面
                    if (n == '0') sum = 0;
                }
                if (len - i - 1 >= 0) { //在数字范围内
                    if (k1 != 3) { //加小单位
                        if (bn != 0) {
                            str = dw1[k1].concat(str);
                        }
                        k1++;
                    } else { //不加小单位，加大单位
                        k1 = 0;
                        var temp = str.charAt(0);
                        if (temp == "万" || temp == "亿") //若大单位前没有数字则舍去大单位
                            str = str.substr(1, str.length - 1);
                        str = dw2[k2].concat(str);
                        sum = 0;
                    }
                }
                if (k1 == 3) { //小单位到千则大单位进一
                    k2++;
                }
            }
            //转换小数部分
            var strdig = "";
            if (dig != "") {
                var n = dig.charAt(0);
                if (n != 0) {
                    strdig += dw[Number(n)] + "角"; //加数字
                }
                var n = dig.charAt(1);
                if (n != 0) {
                    strdig += dw[Number(n)] + "分"; //加数字
                }
            }
            str += "元" + strdig;
        } catch (e) {
            return "0元";
        }
        return str;
    },

    splits: function (tranvalue) {
        var value = new Array('', '');
        temp = tranvalue.split(".");
        for (var i = 0; i < temp.length; i++) {
            value = temp;
        }
        return value;
    },

    /**
     * 参数说明：
     * number：要格式化的数字
     * decimals：保留几位小数
     * dec_point：小数点符号
     * thousands_sep：千分位符号
     */
    //
    // var num=number_format(1234567.089, 2, ".", ",");//1,234,567.09
    //
    numberFormat: function (number, decimals, dec_point, thousands_sep) {

        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.ceil(n * k) / k;
            };

        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }

        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },

    // number_format(1234567.089, 2, ".", ",");//1,234,567.08
    number_format: function (number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,

            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.floor(n * k) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.floor(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        console.log(s)
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }

        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },

};