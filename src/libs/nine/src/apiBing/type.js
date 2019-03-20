var q = {
    // 判断是否为数字类型
    isDigit: function (value) {
        var patrn = /^[0-9]*$/;
        if (patrn.exec(value) == null || value == "") {
            return false
        } else {
            return true
        }
    },

    // 判断具体类型
    getType: function (a) {
        var typeArray = Object.prototype.toString.call(a).split(" ");
        return typeArray[1].slice(0, this.length - 1);
    },

    // 数据类型判断
    // istype([],'array')
    // true
    // istype([])
    // '[object Array]'
    isType: function (o, type) {
        if (type) {
            var _type = type.toLowerCase();
        }
        switch (_type) {
            case 'string':
                return Object.prototype.toString.call(o) === '[object String]';
            case 'number':
                return Object.prototype.toString.call(o) === '[object Number]';
            case 'boolean':
                return Object.prototype.toString.call(o) === '[object Boolean]';
            case 'undefined':
                return Object.prototype.toString.call(o) === '[object Undefined]';
            case 'null':
                return Object.prototype.toString.call(o) === '[object Null]';
            case 'function':
                return Object.prototype.toString.call(o) === '[object Function]';
            case 'array':
                return Object.prototype.toString.call(o) === '[object Array]';
            case 'object':
                return Object.prototype.toString.call(o) === '[object Object]';
            case 'nan':
                return isNaN(o);
            case 'elements':
                return Object.prototype.toString.call(o).indexOf('HTML') !== -1
            default:
                return Object.prototype.toString.call(o)
        }
    }


};