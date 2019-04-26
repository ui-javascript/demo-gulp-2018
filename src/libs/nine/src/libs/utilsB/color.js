var q = {

    // RGB转十六进制
    rgbToHex: function (red, green, blue) {
        // 处理输入数字
        var color = '#',
            len = arguments.length,
            i = 0;

        for (i=0;i<len;i++) {
            if (!(isNaN(arguments[i])) || 255 - arguments[i] < 0 ) {
                color += this.rgbCheckDigit(parseInt(arguments[i]).toString(16));
            }
        }

        return color;
    },

    // 处理位数
    rgbCheckDigit: function (str) {
        if (str.length < 2) {
            str = "0" + str;
        }
        return str;
    },

    // 随进产生颜色
    getRandomColor: function () {
        // 写法1
        //return 'rgb(' + this.randomNumber(255) + ',' + this.randomNumber(255) + ',' + this.randomNumber(255) + ')';

        // 写法2
        return '#' + Math.random().toString(16).substring(2).substr(0, 6);

        // 写法3
        //var color='#',_index=this.randomNumber(15);
        //for(var i=0;i<6;i++){
        //color+='0123456789abcdef'[_index];
        //}
        //return color;
    }


};

console.log(q.rgbToHex(180, 7, 177)); // #b407b1
// Math.floor(Math.random()*0xffffff).toString(16);