var q = {
    // 清除相同的数组
    unique: function () {
        var x = this.split(/[\r\n]+/);
        var y = '';
        for (var i = 0; i < x.length; i++) {
            if (!new RegExp("^" + x.replace(/([^\w])/ig, "\\$1") + "$", "igm").test(y)) {
                y += x + "\r\n"
            }
        }
        return y
    },


    // 按字母排序，对每行进行数组排序
    setArrSort: function () {
        var text = K1.value.split(/[\r\n]/).sort().join("\r\n");//顺序
        var test = K1.value.split(/[\r\n]/).sort().reverse().join("\r\n");//反序
        K1.value = K1.value != text ? text : test;
    },

    // 数组去重
    removeRepeatArray: function (arr) {
        return arr.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });
    },

    // 筛选数组
    // 删除值为'val'的数组元素
    // removeArrayForValue(['test','test1','test2','test','aaa'],'test',')
    // result：["aaa"]   带有'test'的都删除
    removeArrayForValue: function (arr, val, type) {
        return arr.filter(function (item) {
            return type ? item.indexOf(val) === -1 : item !== val
        })
    },


    // 数组顺序打乱
    shuffleArr: function (arr) {
        return arr.sort(function () {
            return Math.random() - 0.5
        });
    },

    // 数组最大值最小值
    //数组最大值
    maxArr: function (arr) {
        return Math.max.apply(null, arr);
    },
    minArr: function (arr) {
        return Math.min.apply(null, arr);
    },

    // 数组求和，平均值
    // 求和
    sumArr: function (arr) {
        return arr.reduce(function (pre, cur) {
            return pre + cur
        })
    },
    // 数组平均值, 小数点可能会有很多位
    covArr: function (arr) {
        return this.sumArr(arr) / arr.length;
    },

    // 从数组中随机获取元素
    // ecDo.randomOne([1,2,3,6,8,5,4,2,6])
    // 2
    getRandomOne: function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // 返回数组（字符串）一个元素出现的次数
    getEleCount: function (obj, ele) {
        var num = 0;
        for (var i = 0, len = obj.length; i < len; i++) {
            if (ele === obj[i]) {
                num++;
            }
        }
        return num;
    },

    // 获取对象数组某些项
    // var arr=[{a:1,b:2,c:9},{a:2,b:3,c:5},{a:5,b:9},{a:4,b:2,c:5},{a:4,b:5,c:7}]
    // getOptionArray(arr,'a,c')
    // result：[{a:1,c:9},{a:2,c:5},{a:5,c:underfind},{a:4,c:5},{a:4,c:7}]
    // getOptionArray(arr,'b')
    // result：[2, 3, 9, 2, 5]
    getOptionArray: function (arr, keys) {
        var newArr = []
        if (!keys) {
            return arr
        }
        var _keys = keys.split(','), newArrOne = {};
        //是否只是需要获取某一项的值
        if (_keys.length === 1) {
            for (var i = 0, len = arr.length; i < len; i++) {
                newArr.push(arr[i][keys])
            }
            return newArr;
        }
        for (var i = 0, len = arr.length; i < len; i++) {
            newArrOne = {};
            for (var j = 0, len1 = _keys.length; j < len1; j++) {
                newArrOne[_keys[j]] = arr[i][_keys[j]]
            }
            newArr.push(newArrOne);
        }
        return newArr
    },

    // 排除对象数组某些项
    // var arr=[{a:1,b:2,c:9},{a:2,b:3,c:5},{a:5,b:9},{a:4,b:2,c:5},{a:4,b:5,c:7}]
    // filterOptionArray(arr,'a')
    // result：[{b:2,c:9},{b:3,c:5},{b:9},{b:2,c:5},{b:5,c:7}]
    // filterOptionArray(arr,'a,c')
    // result：[{b:2},{b:3},{b:9},{b:2},{b:5}]
    filterOptionArray: function (arr, keys) {
        var newArr = []
        var _keys = keys.split(','), newArrOne = {};
        for (var i = 0, len = arr.length; i < len; i++) {
            newArrOne = {};
            for (var key in arr[i]) {
                //如果key不存在排除keys里面,添加数据
                if (_keys.indexOf(key) === -1) {
                    newArrOne[key] = arr[i][key];
                }
            }
            newArr.push(newArrOne);
        }
        return newArr
    },


    // 对象数组排序
    // var arr=[{a:1,b:2,c:9},{a:2,b:3,c:5},{a:5,b:9},{a:4,b:2,c:5},{a:4,b:5,c:7}]
    // arraySort(arr,'a,b')a是第一排序条件，b是第二排序条件
    // result：[{"a":1,"b":2,"c":9},{"a":2,"b":3,"c":5},{"a":4,"b":2,"c":5},{"a":4,"b":5,"c":7},{"a":5,"b":9}]
    arraySort: function (arr, sortText) {
        if (!sortText) {
            return arr
        }
        var _sortText = sortText.split(',').reverse(), _arr = arr.slice(0);
        for (var i = 0, len = _sortText.length; i < len; i++) {
            _arr.sort(function (n1, n2) {
                return n1[_sortText[i]] - n2[_sortText[i]]
            })
        }
        return _arr;
    },

    // 数组扁平化
    // ecDo.steamroller([1,2,[4,5,[1,23]]])
    // [1, 2, 4, 5, 1, 23]
    steamroller: function (arr) {
        var newArr = [],_this=this;
        for (var i = 0; i < arr.length; i++) {
            if (Array.isArray(arr[i])) {
                // 如果是数组，调用(递归)steamroller 将其扁平化
                // 然后再 push 到 newArr 中
                newArr.push.apply(newArr, _this.steamroller(arr[i]));
            } else {
                // 不是数组直接 push 到 newArr 中
                newArr.push(arr[i]);
            }
        }
        return newArr;
    },




};