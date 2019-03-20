/**
 * 字符串
 *
 *
 */
var q = {

    // 去除空格
    trim: function (str, type) {
        var txt = str;

        switch (type) {
            // 清除前后空格
            case 'lr':
            case 'side':
                txt = txt.replace(/(^\s*)|(\s*$)/g, "");

            // 清除左侧空格
            case 'l':
            case 'left':
                txt = txt.replace(/(^\s*)/g, "");

            // 清除后空格
            case 'r':
            case 'right':
                txt = txt.replace(/(\s*$)/g, "");

            case 'all':
            default:
                txt = txt.replace(/\s+/g, ""); // 清除所有空格
        }

        return txt;
    },



    // 清除空格
    trimAll: function () {
        var reExtraSpace = /^\s*(.*?)\s+$/;
        return this.replace(reExtraSpace, "$1")
    },

    // 清除左空格/右空格
    ltrim: function (s) {
        return s.replace(/^(\s*|　*)/, "");
    },
    rtrim: function (s) {
        return s.replace(/(\s*|　*)$/, "");
    },

    // 判断是否以某个字符串开头
    startWith: function (s) {
        return this.indexOf(s) == 0
    },
    endWith: function (s) {
        var d = this.length - s.length;
        return (d >= 0 && this.lastIndexOf(s) == d)
    },

    // 字符串重复
    repeat: function (str, count) {
        var text = '';
        for (var i = 0; i < count; i++) {
            text += str;
        }
        return text;
    },

    // 大小写转化
    case: function (str, type) {
        function ToggleCase(str) {
            var itemText = ""
            str.split("").forEach(
                function (item) {
                    if (/^([a-z]+)/.test(item)) {
                        itemText += item.toUpperCase();
                    } else if (/^([A-Z]+)/.test(item)) {
                        itemText += item.toLowerCase();
                    } else {
                        itemText += item;
                    }
                });

            return itemText;
        }

        switch (type) {
            case 'u': // 转化为大写
                return str.toUpperCase();
            case 'l': // 转化为小写
                return str.toLowerCase();
            case 'u0':
                return str.replace(/\b\w+\b/g, function (word) {
                    return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
                });
            case 'l0':
                return str.replace(/\b\w+\b/g, function (word) {
                    return word.substring(0, 1).toLowerCase() + word.substring(1).toUpperCase();
                });
            case 'toggle':
                return ToggleCase(str);
            default:
                return str;
        }
    },

    // 全角半角转换
    //iCase: 0全到半，1半到全，其他不转化
    chgCase: function (sStr, iCase) {
        if (typeof sStr != "string" || sStr.length <= 0 || !(iCase === 0 || iCase == 1)) {
            return sStr;
        }
        var i, oRs = [], iCode;
        if (iCase) {/*半->全*/
            for (i = 0; i < sStr.length; i += 1) {
                iCode = sStr.charCodeAt(i);
                if (iCode == 32) {
                    iCode = 12288;
                } else if (iCode < 127) {
                    iCode += 65248;
                }
                oRs.push(String.fromCharCode(iCode));
            }
        } else {/*全->半*/
            for (i = 0; i < sStr.length; i += 1) {
                iCode = sStr.charCodeAt(i);
                if (iCode == 12288) {
                    iCode = 32;
                } else if (iCode > 65280 && iCode < 65375) {
                    iCode -= 65248;
                }
                oRs.push(String.fromCharCode(iCode));
            }
        }
        return oRs.join("");
    },

    // 半角转换为全角函数
    toDBC: function (str) {
        var result = '';
        for (var i = 0; i < str.length; i++) {
            code = str.charCodeAt(i);
            if (code >= 33 && code <= 126) {
                result += String.fromCharCode(str.charCodeAt(i) + 65248);
            } else if (code == 32) {
                result += String.fromCharCode(str.charCodeAt(i) + 12288 - 32);
            } else {
                result += str.charAt(i);
            }
        }
        return result;
    },

    // 全角转换为半角函数
    toCDB: function (str) {
        var result = '';
        for (var i = 0; i < str.length; i++) {
            code = str.charCodeAt(i);
            if (code >= 65281 && code <= 65374) {
                result += String.fromCharCode(str.charCodeAt(i) - 65248);
            } else if (code == 12288) {
                result += String.fromCharCode(str.charCodeAt(i) - 12288 + 32);
            } else {
                result += str.charAt(i);
            }
        }
        return result;
    },

    // 字符串反序
    getStrReverse: function (text) {
        return text.split('').reverse().join('');
    },

    // 字符串长度截取
    cutStr: function (str, len) {
        var temp,
            icount = 0,
            patrn = /[^\x00-\xff]/,
            strre = "";

        for (var i = 0; i < str.length; i++) {
            if (icount < len - 1) {
                temp = str.substr(i, 1);
                if (patrn.exec(temp) == null) {
                    icount = icount + 1
                } else {
                    icount = icount + 2
                }
                strre += temp
            } else {
                break;
            }
        }
        return strre + "..."
    },

    // 替换全部
    replaceAll: function (s1, s2) {
        return this.replace(new RegExp(s1, "gm"), s2)
    },


    // 统计字符串中单词出现次数
    // var strTest='sad44654blog5a1sd67as9dablog4s5d16zxc4sdweasjkblogwqepaskdkblogahseiuadbhjcibloguyeajzxkcabloguyiwezxc967'
    // countStr(strTest,'blog')
    countWordInStr: function (str, strSplit) {
        return str.split(strSplit).length - 1
    },

    // 过滤字符串
    // filterStr(str,'html,WORD,chinese,special','*','%?')
    filterStr: function (str, type, restr, spstr) {
        var typeArr = type.split(','), _str = str;
        for (var i = 0, len = typeArr.length; i < len; i++) {
            //是否是过滤特殊符号
            if (typeArr[i] === 'special') {
                var pattern, regText = '$()[]{}?\|^*+./\"\'+';
                //是否有哪些特殊符号需要保留
                if (spstr) {
                    var _spstr = spstr.split(""), _regText = "[^0-9A-Za-z\\s";
                    for (var j = 0, len1 = _spstr.length; j < len1; j++) {
                        if (regText.indexOf(_spstr[j]) === -1) {
                            _regText += _spstr[j];
                        }
                        else {
                            _regText += '\\' + _spstr[j];
                        }
                    }
                    _regText += ']'
                    pattern = new RegExp(_regText, 'g');
                }
                else {
                    pattern = new RegExp("[^0-9A-Za-z\\s]", 'g')
                }
            }
            var _restr = restr || '';
            switch (typeArr[i]) {
                case 'special':
                    _str = _str.replace(pattern, _restr);
                    break;
                case 'html':
                    _str = _str.replace(/<\/?[^>]*>/g, _restr);
                    break;
                case 'emjoy':
                    _str = _str.replace(/[^\u4e00-\u9fa5|\u0000-\u00ff|\u3002|\uFF1F|\uFF01|\uff0c|\u3001|\uff1b|\uff1a|\u3008-\u300f|\u2018|\u2019|\u201c|\u201d|\uff08|\uff09|\u2014|\u2026|\u2013|\uff0e]/g, _restr);
                    break;
                case 'word':
                    _str = _str.replace(/[a-z]/g, _restr);
                    break;
                case 'WORD':
                    _str = _str.replace(/[A-Z]/g, _restr);
                    break;
                case 'number':
                    _str = _str.replace(/[0-9]/g, _restr);
                    break;
                case 'chinese':
                    _str = _str.replace(/[\u4E00-\u9FA5]/g, _restr);
                    break;
            }
        }
        return _str;
    },

    // 格式化处理字符串
    // formatText('1234asda567asd890')
    // result："12,34a,sda,567,asd,890"
    // formatText('1234asda567asd890',4,' ')
    // result："1 234a sda5 67as d890"
    // formatText('1234asda567asd890',4,'-')
    // result："1-234a-sda5-67as-d890"
    formatText: function (str, size, delimiter) {
        var _size = size || 3, _delimiter = delimiter || ',';
        var regText = '\\B(?=(\\w{' + _size + '})+(?!\\w))';
        var reg = new RegExp(regText, 'g');
        return str.replace(reg, _delimiter);
    },

    // 找出最长单词
    // longestWord('Find the Longest word in a String')
    // result：7
    // longestWord('Find|the|Longest|word|in|a|String','|')
    // result：7
    findLongestWord: function (str, splitType) {
        var _splitType = splitType || /\s+/g,
            _max = 0,_item='';
        var strArr = str.split(_splitType);
        strArr.forEach(function (item) {
            if (_max < item.length) {
                _max = item.length
                _item=item;
            }
        })
        return {el:_item,max:_max};
    }

};


/**
 * 测试
 *
 */

// // 去除空格
// console.log(q.trim(' s  it\'s a   sad story s'));
// console.log(q.trim(' it\'s a sad story ', 'l'));
//
// // 重复
// console.log(q.repeat('apple', 4));
//
// // 大小写转化
// console.log(q.case(''));



