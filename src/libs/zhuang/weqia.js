/**
 * weqia js Library
 * ============================
 * ============================
 */
;
(function ($) {

    var $weqia = {};
    $.wq = $weqia;
    window.$wq = $weqia;
    /**
     * 水印 =======================
     */
    $.fn.newWatermark = function (text, option) {
        $("#imgDiv_waterMark").remove();
        var markHeight = option.markHeight;
        var textWidth = option.textWidth;
        var textHeight = option.textHeight;
        var top = option.top || 0;
        var left = option.left || 0;

        var background = $(this);

        var length = text.length;
        var textLength = length * 20;

        var allMakrGroundDom = $("<canvas class='watermark'>")
        var width = background.width();
        if (width == 0) {
            width = background.parent().width();
        }
        var height = background.height();
        if (height == 0) {
            height = background.parent().height();
        }
        allMakrGroundDom.attr("width", width);
        allMakrGroundDom.attr("height", height);

        var markgroundDom = $("<canvas class='watermark' width=" + width + " height=" + textHeight + ">");
        var markground = markgroundDom[0];
        var ctx = markground.getContext("2d");
        // 绘制水印
        ctx.rotate(10 * Math.PI / 180);
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.font = "30px Arial";
        text = text + '               ';
        ctx.fillText(text + text + text + text + text + text, 0, 20);

        var allMakrGround = allMakrGroundDom[0];
        var ctxr = allMakrGround.getContext("2d");
        //清除整个画布
        ctxr.clearRect(0, 0, allMakrGround.width, allMakrGround.height);
        //平铺--重复小块的canvas
        var pat = ctxr.createPattern(markground, "repeat");
        ctxr.fillStyle = pat;
        ctxr.fillRect(0, 0, allMakrGround.width, allMakrGround.height);

        var imgDiv = $('<div id="imgDiv_waterMark" class="imgDiv_waterMark" style="position: absolute;left: 0;top:' + top + 'px;left:' + left + 'px">');
        imgDiv.attr("width", width);
        imgDiv.attr("height", height);
        var imageData = allMakrGround.toDataURL("image/png");

        var img = $('<img />')
        img.attr("src", imageData);
        imgDiv.append(img);
        background.append(imgDiv);
    }

    /**
     * 提示文本焦点变换事件 ========
     */
    $.fn.tooltipFocus = function (text) {
        $weqia.tooltipFocus(this, text);
    };

    /**
     * 提示文本焦点变换事件
     */
    $.fn.tooltipClean = function () {
        this.css('color', 'black').val('');
    };

    // dopost =====================
    $.fn.doPost = function (options) {
        if (!this.length) {
            return this;
        }

        options = $.extend(true, options, {
            "form": this
        });

        $weqia.doAjax(options);
    };

    /* 提示居中 */
    $.fn.center = function () {
        this.css("position", "absolute");
        this.css("top", ($(window).height() - this.height()) / 2 + $(window).scrollTop() - 100 + "px");
        this.css("left", ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + "px");
        return this;
    };

    /** 文本输入事件，包括粘贴复制 */
    $.fn.inputChange = function (fn) {
        if (/msie/i.test(navigator.userAgent)) {
            //ie浏览器
            var $this = $(this).get(0);
            $this.onpropertychange = fn;

        } else {
            //非ie浏览器，比如Firefox
            $(this).get(0).addEventListener("input", fn, false);
        }
    };

    //ie9以下 input默认val事件 ========================
    $.fn.inputPlaceholder = function (text) {
        if ($.getIeVersion(7) || $.getIeVersion(8) || $.getIeVersion(9)) {
            $(this).val(text);
            var val;
            $(this).focusin(function () {
                val = $(this).val();
                if (val == text) {
                    $(this).val('')
                }
            });
            $(this).focusout(function () {
                val = $(this).val();
                if (val == '') {
                    $(this).val(text)
                }
            });
        }
    }

    // ??
    $.istrackOpen = function (coId) {

        var data = $wq.jsonToArr({
            "query.company_id": coId
        });
        var open = $wq.getJsonData({
            url: "/front/isTrackOpen.htm",
            data: data,
            key: "open"
        });
        if (open == 1) {
            return true;
        } else {
            return false;
        }
    };

    /** 文本输入事件，包括粘贴复制 */
    $.fn.unbindInputChange = function (fn) {
        if (/msie/i.test(navigator.userAgent)) {
            //ie浏览器
            $(this).get(0).onpropertychange = function () {
            };
        } else {
            //非ie浏览器，比如Firefox
            $(this).get(0).addEventListener("input", function () {
            }, false);
        }
    };

    /**
     * 获取光标位置
     */
    $.fn.getCursorPos = function () {
        var target = $(this).get(0);
        if (document.selection) {
            $(this).focus();
            var rng = document.body.createTextRange();
            rng.moveToElementText(target);

            var srng = document.selection.createRange();
            srng.setEndPoint("StartToStart", rng);
            var pos = srng.text.length;
            return pos
        }
        return target.selectionStart;
    };

    /*判断ie版本*/
    $.getIeVersion = function (ver) {
        var b = document.createElement('b');
        b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->';
        return b.getElementsByTagName('i').length === 1;
    };

    $.fn.changeThousand = function (num, integer) {
        if (!num)
            return;
        var allnum;
        if (typeof (num) != "number") {
            num = parseFloat(num).toFixed(2);
        } else {
            if (!integer) {
                num = num.toFixed(2);
            }
        }
        var num = num.toString();
        if (num.indexOf('.') > 0) {
            num = num.split(".");
            var rnum = num[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            allnum = rnum + '.' + num[1];
        } else {
            allnum = num.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
        }
        if ($(this).is('p')) {
            $(this).text(allnum);
        } else {
            $(this).val(allnum);
        }

    };

    $.fn.extend({
        catchCursor: function () {
            var $this = $(this)[0];
            if (document.selection) {
                if ($this.tagName == "DIV") {
                    return $this.selectionStart;
                } else {
                    var range = document.selection.createRange();
                    var rangeLength = $this.value.length;
                    range.moveStart("character", -rangeLength);
                    cursurPosition = range.text.length;
                    return cursurPosition;
                }
            }
            ;
            if ($this.tagName == "DIV") {
                var sel = document.getSelection(),
                    range = sel.getRangeAt(0),
                    startOffset = range.startOffset,
                    endOffset = range.endOffset,
                    startContainer = range.startContainer,
                    textContent = startContainer.textContent,
                    text = textContent.substring(startOffset - 1, startOffset);
                if ((startOffset == endOffset) && (text == "@")) {
                    var startNode = $this.firstChild;
                    range.setStart(startNode, 0);
                    var text = range.toString();
                    // edge 多出‘\n’ 去掉
                    if (browser.versions.trident) {
                        text = text.replace(/\r|\n\n|\t/ig, "");
                    }
                    sel.collapseToEnd();
                    var langth = $weqia.atLength = text.length;
                    return langth;
                }
            }
        },

        insertAtCaret: function (myValue, start) {
            var $t = $(this)[0];
            var inputtext = this.inputtext;
            if (document.selection) {
                this.focus();
                var sel = document.selection.createRange();
                if (start) {
                    var length = $(this).text().length;
                    sel.moveStart("character", start - length);
                }
                sel.text = myValue;
                this.focus();
            } else if ($t.selectionStart || $t.selectionStart == '0') {
                var startPos = $t.selectionStart;
                if (start)
                    startPos = start;
                var endPos = $t.selectionEnd;
                var scrollTop = $t.scrollTop;
                $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                this.focus();
                $t.selectionStart = startPos + myValue.length;
                $t.selectionEnd = startPos + myValue.length;
                $t.scrollTop = scrollTop;
            } else if (document.getSelection) {
                var sel = document.getSelection();
                var text = $($t).text();
                var langth = text.length;
                if (sel.getRangeAt && sel.rangeCount) {
                    var range = sel.getRangeAt(0);
                    var start = start;
                    var starttext;
                    if (start != null) {
                        var endNode = range.startContainer;
                        if (browser.versions.trident) {
                            endNode = range.endContainer;
                        }
                        var inputValue = endNode.textContent;
                        var inputValueDel = inputValue.substring(0, inputValue.indexOf('@'));
                        range.setStart(endNode, inputValueDel.length);
                        range.setEnd(endNode, range.endOffset);
                        range.deleteContents();
                        var newValue = [];
                        newValue = myValue.match(/(\[=?)(\S*)(?=:|：)/);
                        var valueButton = document.createElement("button");
                        var textnbsp = document.createTextNode(' ');
                        valueButton.setAttribute('value', '@' + myValue);
                        valueButton.setAttribute('contenteditable', false);
                        valueButton.innerHTML = '@' + newValue[2];

                        range.insertNode(textnbsp);
                        range.insertNode(valueButton);
                    } else {
                        var valueButton = document.createElement("button");
                        var textnbsp = document.createTextNode(' ');
                        valueButton.setAttribute('value', myValue);
                        valueButton.setAttribute('contenteditable', false);
                        var firstValue = myValue.substring(0, 1);
                        if (firstValue == '@') {
                            var newValue = [];
                            newValue = myValue.match(/(\[=?)(\S*)(?=:|：)/);
                            valueButton.innerHTML = '@' + newValue[2];
                        } else {
                            valueButton.innerHTML = $wq.parseFace(myValue);
                        }
                        var buttonNode = $($t).find("button[value='" + myValue + "']");
                        if (buttonNode.length != 0) {
                            buttonNode.remove();
                        } else {
                            var lastEditRange = $($t).data('lastEditRange');
                            if (lastEditRange) {
                                range = lastEditRange;
                            }
                            range.insertNode(textnbsp);
                            range.insertNode(valueButton);
                        }
                    }
                    ;
                    range.setStart(textnbsp, 0);
                    range.setEnd(textnbsp, 1);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    sel.collapseToEnd(range);
                }
            } else {
                this.value += myValue;
                this.focus();
            }
        }
    });

    $.doAjaxWQ = function (options) {
        $weqia.doAjax(options);
    };

    // 重置表单 ===================
    $.resetForm = function (form) {
        form = $(form)
        form.resetForm();
        $(".error-box", form).html("").hide();
    };

    // 未知错误 ===================
    $.showUnkownError = function (error, form) {
        var error_div;
        if ($(form) && $(form).length)
            error_div = $(".sys_error", $(form));
        else
            error_div = $(".sys_error");
        if (!error_div || !error_div.length)
            return;

        error_div.html("").hide();
        var error_code;
        var error_msg;
        if (error) {
            if (error.errorCode) {
                error_code = $("<div class='sys_error_code'></div>").html(error.errorCode).hide().appendTo(error_div);
            }
            if (error.errorMsg) {
                error_msg = $("<div class='sys_error_msg'></div>").html(error.errorMsg).hide().appendTo(error_div);
            }
        }

        var id = null;
        if (error_code && error_code.length) {
            var id = $.trim(error_code.html());
        }
        if (id && id != 'SYSTEM_ERROR' && document.getElementById(id)) {
            $('#' + id).html(error_msg.html());
        } else if ($.trim(error_msg.html()) != "") {
            error_msg.show();
            error_div.show();
        }
    };

    // 校验错误 ===================
    $.showValidateError = function (error, element) {
        var msgid = element.attr("msgid");
        $("#" + msgid).show().append(error);
    };

    $.browser = {
        mozilla: /firefox/.test(navigator.userAgent.toLowerCase()),
        webkit: /webkit/.test(navigator.userAgent.toLowerCase()),
        opera: /opera/.test(navigator.userAgent.toLowerCase()),
        msie: /msie/.test(navigator.userAgent.toLowerCase())
    };

    // 获取金钱,添加.00 ================
    $.getMoney = function (s) {
        var temp = $.trim(s);
        if (temp.length == 0) {
            return "";
        }
        var flag = temp.charAt(0);
        var symbol = "";
        if (flag == "-") {
            symbol = "-";
            s = temp.substr(1, s.length);
        }
        s = s.toString();
        s = s.replace(/^(\d*)$/, "$1.");
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        s = s.replace(".", ",");
        var re = /(\d)(\d{3},)/;
        while (re.test(s))
            s = s.replace(re, "$1,$2");
        s = s.replace(/,(\d\d)$/, ".$1");
        var result = s.replace(/^\./, "0.")
        return symbol + result;
    }

    /** thousand =================== **/
    var weqiaThousand = function (options) {
        var settings = {
            target: null,
            tip: null,
            max: null,
            point: true,
            integer: false
        };
        this.settings = $.extend(settings, options);
        var target = this.target = $(options.target);
        this.init();
    };
    $.extend(weqiaThousand.prototype, {
        init: function () {
            var $this = this;
            var target = $this.target;

            if ($this.settings.point) {
                $this.keypress();
            } else {
                $this.nopoint();
            }
            target.on('focusin', function (e) {
                var val = $(this).val().replace(/,/g, '');
                $(this).val(val);
            });
            target.on('focusout', function () {
                var val = $(this).val();
                var repval;
                if (val.indexOf('.') > 0) {
                    $this.radixPoint(val);
                } else {
                    val = val.replace(/([^0-9-,-.])+/, '');
                    if ($this.settings.integer) {
                        if (val != "") {
                            val = parseInt(val) + "";
                        }
                    }
                    repval = val.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
                    if (repval != '' && !$this.settings.integer) {
                        repval += '.00';
                    }


                    $(this).val(repval);
                }
            })
        },

        radixPoint: function (val) {
            var target = this.target;
            var spval, numval;
            spval = val.split(".");
            numval = spval[0].replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            target.val(numval + '.' + spval[1].substr(0, 2));
            target.attr('maxlength')
        },

        nopoint: function () {
            var $this = this;
            this.target.on('keypress', function (e) {
                var key = e.key || e.keyCode;
                var keyCode = e.keyCode;
                if (!isNaN(key) || keyCode == '8') {
                    $this.isNum(e);
                } else {
                    e.preventDefault();
                    return false;
                }
            });
        },

        keypress: function () {
            var $this = this;
            this.target.on('keyup', function (e) {
                var key = e.key;
                var keyCode = e.keyCode;
                if (key != '.')
                    key = parseInt(key);
                if (browser.versions.gecko) {
                    if (keyCode == '8')
                        return
                }
                if (!isNaN(key) || keyCode == '8' || key == '.') {
                    $this.isNum(e);
                } else {
                    e.preventDefault();
                    return false;
                }
            });
        },

        max: function () {
            var target = this.target,
                val = target.val(),
                valpar = parseFloat(val),
                maxtarget = this.settings.maxTarget,
                maxval = maxtarget.val().replace(/,/g, ''),
                maxvalpar = parseFloat(maxval);
            if (valpar > maxvalpar) {
                target.val(maxvalpar);
                this.showTip();
                return false;
            }
        },

        isNum: function (e) {
            var target = this.target;
            var val = target.val();
            var valpar = parseFloat(val);
            var key = e.key;

            if (key == '.') {
                return;
            }
            if (valpar > this.settings.max) {
                target.val(this.settings.max);
                this.showTip();
                e.preventDefault();
                return false;
            }
        },

        showTip: function () {
            $.dialog({
                width: '250px',
                height: "80px",
                title: "提示",
                icon: 'error.gif',
                time: 3,
                content: "<h2>" + this.settings.tip + "</h2>",
                min: false,
                max: false
            });
        }
    });
    $wq.thousand = function (options) {
        return new weqiaThousand(options);
    };


    $.fn.getThoVal = function () {
        var val;
        var tagName = $(this)[0].tagName;
        if (tagName.toLowerCase() == "p") {
            val = $(this).text();
        } else {
            val = $(this).val();
        }
        val = val.replace(/,/g, '');
        if (isNaN(val)) {
            $wq.highBlink($(this), "#F93A3A");
            throw "格式错误";
        }
        return val;
    };

    /** select beautify 多选框 ================== **/
    var $View = function (str) {
            return $(eval('\'' + str.replace(/<%=([\w]+)\%>/g, '\' + $1 + \'') + '\''));
        },
        createUiId = function (el, prefix) {
            var prefix = (!prefix && typeof prefix != 'string') ? 'form' : prefix;
            if (el.attr('id')) {
                return prefix + '_ui_id_' + el.attr('id');
            } else if (el.attr('name')) {
                return prefix + '_ui_name_' + el.attr('name')
                    .replace('[]', '')
                    .replace('[', '_')
                    .replace('\']', '')
                    .replace(']', '')
                    .replace('\'', '')
                    .replace('"', '');
            } else {
                return prefix + '_ui_the_' + 'n';
            }
        },
        cssSelect = function (config) {
            var optionsPosition;
            if (config) {
                optionsPosition = config.position;
            }

            if ($(this).length <= 0) {
                return false;
            }
            return $(this).each(function () {
                var $thisEl = $(this),
                    $optsEl = $thisEl.children('option'),
                    $uiEl,
                    thisEvs = $thisEl.on('events'),
                    uiId = createUiId($thisEl, 'select'),
                    optsWidth = 0,
                    optsPosition, optionsPosition, optionsLimit,

                    /* Ui */
                    tpl = {
                        wrapper: '<div class="cssSelect"></div>',
                        select: '<div class="selectBox sNormal"></div>',
                        selectLt: '<div class="selectLt"></div>',
                        selectRt: '<div class="selectRt"></div>',
                        options: '<div class="optionsBox"></div>',
                        optionsInner: '<div class="optionsInnerBox"></div>',
                        option: '<div class="optionBox oNormal"></div>',
                        optionInner: '<span></span>'
                    },

                    /* Select box */
                    $selectEl = $View(tpl.select),
                    $sLtEl = $View(tpl.selectLt),
                    $sRtEl = $View(tpl.selectRt),

                    /* Options box */
                    $optionsEl = $View(tpl.options),
                    $optionsInnerEl = $View(tpl.optionsInner),

                    init = function () {

                        if (
                            $thisEl.length <= 1 &&
                            $thisEl.get(0).tagName === 'SELECT' &&
                            !$thisEl.attr('multiple') &&
                            $thisEl.children('optgroup').length <= 0
                        ) {

                            $uiEl = $View(tpl.wrapper).attr('id', uiId);
                            $('#' + uiId).remove();
                            $thisEl.show();
                            $thisEl.hide();

                            $uiEl.append($selectEl).append($optionsEl.append($optionsInnerEl));
                            $uiEl.click(function (event) {
                                event.stopPropagation();
                            });

                            /* Render select*/
                            $selectEl.append($sLtEl).append($sRtEl);
                            if ($thisEl.attr('disabled')) {
                                $selectEl.addClass('sDisabled');

                                return;
                            }
                            var selectElWidth = $thisEl.width();
                            if (browser.versions.trident) {
                                selectElWidth = selectElWidth - 4;
                            }
                            if (browser.versions.gecko) {
                                selectElWidth = selectElWidth + 2;
                            }
                            $sLtEl.css('width', selectElWidth - 20);
                            $selectEl.innerWidth(selectElWidth);
                            $selectEl.click(events.selectClick);
                            $selectEl.hover(events.selectHover, events.selectNormal);

                            /* Render options*/
                            $optsEl.each(function (i) {
                                var optEl = $(this),
                                    optionTxt = optEl.text(),

                                    /* Render option */
                                    $optionEl = $View(tpl.option).append($View(tpl.optionInner).text(optionTxt)).attr('title', optionTxt);

                                /* Option event */
                                $optionEl.css({
                                    float: 'left'
                                });
                                $optionEl.hover(events.optionHover, events.optionNormal);
                                $optionEl.click(events.optionClick);

                                /* Render all options*/
                                $optionsInnerEl.append($optionEl);

                                /* Set selected */
                                if (optEl.val() == $thisEl.val()) {
                                    $sLtEl.text(optionTxt).attr('title', optionTxt);

                                    /* Set select option */
                                    $optionEl.addClass('selected');
                                }

                            });

                            /* Options position */
                            $thisEl.setOptions = function () {
                                if (config && config.position) {
                                    optionsPosition = config.position;
                                }

                                if (config && config.limit) {
                                    optionsLimit = config.limit;
                                }

                                $optionsInnerEl.children('.optionBox').css({
                                    float: 'none'
                                });

                                var top,
                                    sltPosition = $selectEl.position(),
                                    sltedPosition = $optionsInnerEl.children('.selected').position(),
                                    eachOptHeight = $optionsInnerEl.outerHeight() / $optsEl.length,
                                    optsHeight = 'auto';

                                if (sltedPosition == null) {
                                    return
                                }

                                if (optionsLimit) {
                                    if (optionsLimit != 'auto' && $optsEl.length > optionsLimit) {
                                        optsHeight = Math.round(eachOptHeight) * optionsLimit;
                                    } else {
                                        optsHeight = 'auto';
                                    }
                                } else {
                                    if ($optsEl.length > 7) {
                                        optsHeight = Math.round(eachOptHeight) * 6;
                                    } else {
                                        optsHeight = 'auto';
                                    }
                                }

                                sltPosition.top = sltPosition.top + $selectEl.outerHeight();

                                $optionsEl.css({
                                    height: Math.round(optsHeight),
                                    top: sltPosition.top + 1
                                });

                                if (optsPosition &&
                                    ($(window).height() + $(document).scrollTop() <
                                        $optionsEl.offset().top + $optionsEl.outerHeight()
                                    )
                                ) {
                                    top = sltPosition.top - $optionsEl.outerHeight() - $selectEl.outerHeight() - 3;
                                } else {
                                    top = sltPosition.top;
                                }

                                $optionsEl.scrollTop(Math.round(sltedPosition.top - eachOptHeight));
                                $optionsEl.css({
                                    'top': top - 1,
                                    'left': sltPosition.left,
                                    'overflow-y': 'auto',
                                    'overflow-x': 'hidden'
                                });
                                if ($thisEl.width()) {
                                    $optionsEl.css('width', $thisEl.width() + 8);
                                }

                                if (!optsPosition) {
                                    optsPosition = $optionsEl.position();
                                }
                            };

                            /* Render $uiEl */
                            $thisEl.before($uiEl);
                            $thisEl.setOptions();
                            $optionsEl.hide();
                        }
                    },


                    events = $.extend({
                        selectNormal: function () {
                            $(this).removeClass('sHover');
                        },
                        selectHover: function () {
                            $(this).addClass('sHover');
                        },
                        selectClick: function () {
                            if ($optionsEl.css('display') != 'none') {
                                handlers.selectOff();
                            } else {
                                handlers.selectOn();
                                $thisEl.setOptions();
                            }
                        },
                        optionNormal: function () {
                            $(this).removeClass('oHover');
                        },
                        optionHover: function () {

                            $(this).addClass('oHover');
                        },
                        optionClick: function () {

                            handlers.selected(this);
                        },
                        documentClick: function () {
                            handlers.selectOff();
                        }
                    }, function () {
                    }),
                    handlers = $.extend({
                        selectOn: function () {
                            this.selectOff();

                            $selectEl.addClass('sPressDown');
                            $optionsEl.show();

                            $(document).one('click', events.documentClick);
                        },
                        selectOff: function () {
                            $thisEl.unbind('click');
                            $('.selectBox').removeClass('sPressDown');
                            $('.optionsBox').hide();
                        },
                        selected: function (el) {
                            var i = $optionsInnerEl.children('.optionBox').index(el);
                            $optionsInnerEl.children('.optionBox').removeClass('selected');
                            $(el).addClass('selected');
                            $sLtEl.text($(el).text());
                            if (thisEvs && thisEvs.change && thisEvs.change.length > 0) {
                                $thisEl[0].selectedIndex = i;
                                $.each(thisEvs.change, function () {
                                    $thisEl.one('click', this.handler);
                                    $thisEl.click();
                                });
                                $thisEl.children().eq(i).attr('selected', true);
                                $thisEl.trigger('change');

                                var iii = $('#identitySelect').children().eq(i).prop('selected', true);
                                $.each(thisEvs.change, function () {
                                    $thisEl.one('click', this.handler);
                                    $thisEl.click();
                                });
                            }
                            $thisEl[0].selectedIndex = i;
                            this.selectOff();

                        }
                    }, function () {
                    });

                return init();
            });
        }
    $.fn.extend({
        cssSelect: cssSelect
    });

    /**
     * 数据加载遮罩层控件
     * target:  遮罩层对象或选择器;
     * width:     遮罩层宽度 全屏时默认100% 局部默认target宽度;
     * height:     遮罩层高度 全屏时默认100% 局部默认target高度;
     * position: "fixed-全屏","absolute-局部",默认fixed-全屏;
     * margin: 位置偏移;
     * insert: 插入位置;
     * defer: 延迟消失 默认关闭;
     * time:  延迟时间;
     * background: 背景颜色, 默认白色;
     * color: 颜色, 默认'#999';
     */

    var weqiaLoadIng = function (options) {
        var settings = {
            target: null,
            width: null,
            height: null,
            margin: null,
            insert: null,
            top: null,
            left: null,
            position: 'fixed',
            defer: false,
            time: null,
            background: '#fff',
            color: '#999'
        };
        this.settings = $.extend(settings, options);
        var target = this.target = $(options.target);
        this.loadSetting();
    };
    $.extend(weqiaLoadIng.prototype, {
        loadSetting: function () {
            this.init();
            if (this.settings.position) {
                this.initbody.css('position', this.settings.position);
                if (this.settings.position == 'absolute') {
                    this.initbody.removeClass('fakeloader_fixed');
                    var targetWidth = this.target.width();
                    var targetHeight = this.target.height();
                    this.initbody.innerWidth(targetWidth);
                    this.initbody.innerHeight(targetHeight);
                }
                ;
            }
            if (this.settings.defer) {
                var deferTime = this.settings.time;
                setTimeout(function () {
                    this.initbody.remove();
                }, deferTime);
            }
            if (this.settings.background) {
                this.initbody.css('background', this.settings.background);
            }
            if (this.settings.width != null) {
                this.initbody.css('width', this.settings.width);
            }

            if (this.settings.height != null) {
                this.initbody.css('height', this.settings.height);
            }

            if (this.settings.margin != null) {
                this.initbody.css('margin', this.settings.margin);
            }

            if (this.settings.color) {
                var dot1 = this.initbody.find('container1');
                dot1.css('background-color', this.settings.color);
                var dot2 = this.initbody.find('container2');
                dot1.css('background-color', this.settings.color);
                var dot3 = this.initbody.find('container3');
                dot1.css('background-color', this.settings.color);
            }

            if (this.settings.top) {
                this.initbody.css('top', this.settings.top);
            }

            if (this.settings.left) {
                this.initbody.css('left', this.settings.left);
            }
        },

        init: function (target) {
            var initbody = this.initbody = $('<div class="fakeloader fakeloader_fixed"></div>');
            var loading = '<div class="fl spinner2">' +
                '<div class="spinner-container container1">' +
                '<div class="circle1"></div>' +
                '<div class="circle2"></div>' +
                '<div class="circle3"></div>' +
                '<div class="circle4"></div>' +
                '</div>' +
                '<div class="spinner-container container2">' +
                '<div class="circle1"></div>' +
                '<div class="circle2"></div>' +
                '<div class="circle3"></div>' +
                '<div class="circle4"></div>' +
                '</div>' +
                '<div class="spinner-container container2">' +
                '<div class="circle1"></div>' +
                '<div class="circle2"></div>' +
                '<div class="circle3"></div>' +
                '<div class="circle4"></div>' +
                '</div>' +
                '</div>';
            if ($.getIeVersion(7) || $.getIeVersion(8) || $.getIeVersion(9)) {
                loading = '<div class="fl spinner2">' +
                    '<img src="/frontSystem/images/waiting.gif">' +
                    '</div>';
            }
            initbody.append(loading);
            if (this.settings.insert != null && this.settings.insert.length != 0) {
                this.settings.insert.before(initbody);
            } else {
                if (this.target != null) {
                    this.target.append(initbody);
                } else {
                    $(target).append(initbody);
                }
            }
        },

        remove: function () {
            $('.fakeloader').remove();
        }
    });
    $wq.loading = function (options) {
        return new weqiaLoadIng(options);
    };
    // 全屏loading
    $wq.getLoadIng = function (target) {
        weqiaLoadIng.prototype.initbody(target);
    };
    $wq.removeload = function () {
        weqiaLoadIng.prototype.remove();
    };

    /**
     *简单WYSIWYG输入文本控件
     *target: 输入对象;
     *imgtarget: 粘贴图像对象;
     *placeholder: 提示语;
     *url: 粘贴图片url;
     *itype: 图片类型;
     *submitbut : 发送图片按钮;
     *closePaste: 关闭图片粘贴 默认开启;
     */
    var weqiaTextarea = function (options) {
        var settings = {
            target: null,
            imgtarget: null,
            placeholder: null,
            submitbut: null,
            itype: null,
            url: null,
            closePaste: true
        };
        this.settings = $.extend(settings, options);
        var target = this.target = $(options.target);
        var submitbut = this.submitbut = $(options.submitbut);
        this.loadSetting();
        this.keypress();
        this.paste();
        this.target.data('placeholder', this.settings.placeholder);
    };
    $.extend(weqiaTextarea.prototype, {

        loadSetting: function () {
            var $this = this;
            if ($this.settings.placeholder != null) {
                $this.target.text(this.settings.placeholder);
                $this.target.focusin(function () {
                    if ($(this).text() == $this.settings.placeholder) {
                        $(this).text('');
                    }
                });
                this.target.focusout(function () {
                    if ($(this).html() == '') {
                        $(this).text($this.settings.placeholder);
                    }
                    var sel = document.getSelection();
                    var lastEditRange = sel.getRangeAt(0);
                    $(this).data('lastEditRange', lastEditRange);
                });
            }
            ;
        },

        // 监听键盘事件
        keypress: function () {
            this.target.on('keypress', function (e) {
                if (e.which === 13) {
                    if (!document.selection) {
                        weqiaTextarea.prototype.insertTextAtCursor.call(this, '\n');
                        e.preventDefault();
                        return false;
                    }
                }
            })
        },

        insertTextAtCursor: function (text) {
            var sel = window.getSelection();
            var textLastChar = text.substring(text.length - 1);
            var fulltext = $(this).text();
            var newLineNode = document.createTextNode("\n");
            var lastChar = null,
                lastNode = null;
            if (fulltext !== "") {
                lastChar = fulltext.substring(fulltext.length - 1);
                lastNode = weqiaTextarea.prototype.getLastNode(this.childNodes);
            }
            var needsExtra = (textLastChar === "\n" && lastChar !== "\n" && (lastChar === null || (sel.anchorNode === lastNode && sel.anchorOffset === lastNode.length) || (sel.focusNode === lastNode && sel.focusOffset === lastNode.length)));

            var textNode = document.createTextNode(text);
            var range = null;
            range = sel.getRangeAt(0);

            range.deleteContents();
            //修复chomce 第一行 按下没有换行的BUG
            if (needsExtra) {
                if (!browser.versions.gecko) {
                    range.insertNode(newLineNode);
                }
            }
            ;
            range.insertNode(textNode);

            //新建 range
            range = document.createRange();
            range.setStartAfter(textNode);
            range.collapse(true);

            //光标移到最后
            sel.removeAllRanges();
            sel.addRange(range);
        },

        // 监听复制事件
        paste: function () {
            var $this = this;
            var target = this.target;
            var submitbut = this.submitbut;
            target.on('paste', function (e) {
                var pasteEvent;
                pasteEvent = e;
                var data = pasteEvent.clipboardData || pasteEvent.originalEvent.clipboardData;
                var text;
                var items;

                // 有文字的情况下，就不处理图片粘贴
                if (data == null) {
                    text = window.clipboardData && window.clipboardData.getData('text');
                } else {
                    text = data.getData('text/plain') || data.getData('text/html');
                }
                ;
                if (text) {
                    var flaotdiv = document.createElement("div");
                    flaotdiv.innerText = text;
                    var realText = flaotdiv.innerText;
                    weqiaTextarea.prototype.insertTextAtCursor(realText);
                    e.preventDefault();
                    return false;
                } else {
                    items = data && data.items;
                    if (items) {
                        $.each(items, function (key, value) {
                            var fileType = value.type || '';
                            var file = value.getAsFile();
                            var reader = new FileReader();
                            reader.onload = function (e) {
                                var img = $('<img src="' + e.target.result + '">');
                                target.append(img);
                            };
                            //读取粘贴的文件
                            reader.readAsDataURL(file);
                        });
                    }
                    ;
                    // 延迟
                    setTimeout(function () {
                        if ($this.settings.closePaste == false) {
                            target.find('img').remove();
                        } else {
                            if ($this.settings.imgtarget != null) {
                                var body = weqiaTextarea.prototype.addImg();
                                $this.settings.imgtarget.append(body);
                                target.find('img').remove();
                                if ($(".paste_li").length > 9) {
                                    $.dialog({
                                        width: '250px',
                                        height: "80px",
                                        title: "提示",
                                        icon: 'error.gif',
                                        time: 3,
                                        content: "<h3>最多一次只能上传9张图片！</h3>",
                                        min: false,
                                        max: false
                                    });
                                    $(".paste_li").last().remove();
                                }
                            } else {
                                var body = weqiaTextarea.prototype.imgBody(submitbut);
                                $(document.body).append(body);
                                target.find('img').remove();
                            }
                        }
                    }, 100);
                }
            });
        },

        // 底部加入图像
        addImg: function () {
            var paste_div
            var paste_ul;
            if ($('.paste_div').length <= 0) {
                var paste_div = $('<div class="paste_div"></div>');
                var paste_ul = $('<ul></ul>');
                paste_div.append(paste_ul);
            } else {
                var paste_ul = $('.paste_div').find('ul');
            }
            var paste_li = $('<li class="paste_li"></li>');
            paste_ul.append(paste_li);
            var pic_src = $(".paste_content img").attr("src");
            var newPicSrc = $('<img class="newpicsrc" src=" ' + pic_src + ' "/>');
            var pic_text = $('<div class="remove_pic" contenteditable="false">删除图片</div>');
            pic_text.click(function () {
                $(this).parent().remove();
            });
            paste_li.append(newPicSrc);
            paste_li.append(pic_text);
            return paste_div;
        },

        // 图像弹出层
        imgBody: function (submitbut) {
            var body = $('<div class="field-paste-show"></div>');
            var pasteDiv = $('<div class="pastediv"></div>');
            body.append(pasteDiv);
            var pasteTopDiv = $('<div class="pastetop">发送图片</div>');
            pasteDiv.append(pasteTopDiv);
            var pastePicDiv = $('<div class="pastepicdiv" contenteditable="true"></div>');
            pasteDiv.append(pastePicDiv);
            //获取截图图片地址
            var pic_src = $(".paste_content img").attr("src");
            var newPicSrc = $('<img class="imgshow" src=" ' + pic_src + ' "/>');
            pastePicDiv.append(newPicSrc);

            var op_div = $('<div class="pastebottom clearfix"></div>');
            pasteDiv.append(op_div);
            var confirm_btn = $('<a class="porject_paste" href="javascript:void(0)">发送</a>');
            op_div.append(confirm_btn);
            var cancel_btn = $('<a class="cancel_paste" href="javascript:void(0)">取消</a>');
            op_div.append(cancel_btn);

            confirm_btn.bind('click', function () {
                submitbut.click();
            });
            cancel_btn.click(function () {
                $('.field-paste-show').remove();
            });
            return body;
        },

        // 移除图像弹出层
        imgRemove: function () {
            $('.field-paste-show').remove();
        },

        //将以base64的图片url数据转换为Blob
        convertBase64UrlToBlob: function (urlData) {
            //去掉空格 IE下前后有空格会报错
            urlData = $.trim(urlData);
            var reg = /^data:(image\/\w+);base64/;
            var fileType = this.fileType = urlData.match(reg)[1];
            //去掉url的头，并转换为byte
            var bytes = window.atob(urlData.split(',')[1]);
            //处理异常,将ascii码小于0的转换为大于0
            var ab = new ArrayBuffer(bytes.length);
            var ia = new Uint8Array(ab);
            var i;
            for (i = 0; i < bytes.length; i++) {
                ia[i] = bytes.charCodeAt(i);
            }
            return new Blob([ab], {
                type: fileType
            });
        },

        // 获取文件扩展名
        getFileExt: function () {
            var fileType = this.fileType || 'image/png';
            // 获取文件扩展名
            var fileExt = 'png'; // 默认为 png
            if (fileType.indexOf('/') > 0 && fileType.split('/')[1]) {
                fileExt = fileType.split('/')[1];
            }
            return fileExt;
        },

        getPlaceHolder: function (content) {
            var placeholder = $(content).data('placeholder');
            return placeholder;
        },

        getLastNode: function (childNodes) {
            for (var i = childNodes.length - 1; i >= 0; i--) {
                if (childNodes[i].childNodes.length > 0) {
                    var lastNode = this.getLastNode(childNodes[i].childNodes);
                    if (lastNode !== null) {
                        return lastNode;
                    } else {
                        continue;
                    }
                } else if (childNodes[i].data !== "") {
                    return childNodes[i];
                }
            }
            return null;
        },

        getFileUrl: function (base64) {
            //得到图片的src
            if (base64 == null) {
                var base64 = $('.imgshow').attr("src");
            } else {
                base64 = base64;
            }
            var imgFile = weqiaTextarea.prototype.convertBase64UrlToBlob(base64);
            var fileExt = weqiaTextarea.prototype.getFileExt();
            var itype = this.getItype();
            var url = this.getUrl();
            var fileName = null;
            //得到文件名，默认为随机数
            fileName = fileName || Math.random().toString().slice(2);
            fileName += "." + fileExt
            //声明FormData
            var formdata = new FormData();
            //加入数据
            formdata.append("uploadFile", imgFile, fileName);
            formdata.append("itype", itype);
            //返回的图片地址
            var returnImgUrl;
            $.ajax({
                url: url,
                type: "POST",
                data: formdata,
                processData: false,
                contentType: false,
                async: false,
                success: function (result) {
                    //正则截取地址 @jin  （还不知道为什么会返回这样的数据）
                    result = result.match(/\"url\":\"([^\"]*)\"/);
                    returnImgUrl = result[1];
                },
                error: function (msg) {
                    console.log(msg);
                }
            });
            return returnImgUrl;
        },

        getItype: function () {
            return this.settings.itype;
        },
        getUrl: function () {
            return this.settings.url;
        }
    });

    $.fn.divTotextarea = function (options) {
        if (!this.length) {
            return this;
        }
        var textareaerArr = [];
        this.each(function (i, el) {
            var $this = $(el);
            var textareaer = $.data(el, 'textareaer');
            if (!textareaer) {
                textareaer = new weqiaTextarea(options);
                $.data(this, "textareaer", textareaer);
            }
            textareaerArr[i] = textareaerArr;
        });
        if (textareaerArr.length == 1)
            return textareaerArr[0];
        return textareaerArr;
    };

    $wq.divTotextarea = function (options) {
        return new weqiaTextarea(options);
    };

    $wq.getDivContent = function (content) {
        var placeholder = weqiaTextarea.prototype.getPlaceHolder(content);
        if (document.selection) {
            var p_html = $(content).html();
            if (p_html == placeholder) {
                return
            } else {
                p_html = p_html.replace(/\r|<p>|\t/ig, "");
                p_html = p_html.replace(/\r|<\/p>|\t/ig, "\n");
                return p_html;
            }
        } else {
            if ($(content).text() == placeholder) {
                return "";
            } else {
                var contentButton = $(content).find('button');
                contentButton.each(function (i, el) {
                    var $this = $(el);
                    var realValue = $this.attr('value');
                    var contentSpan = $this.html().replace(/\r|<button>|\t/ig, '<span></span>');
                    $this.html(realValue);
                });
                return $(content).text();
            }
        }
    };

    $wq.getWeqiaTextarea = function (target) {
        return $.data($(target).get(0), "textareaer");
    };


    /**
     * $weqia ajax部分 ================================
     */
    $.extend($weqia, {
        "imageServer": "",
        "appServer": "",
        "assetsPath": "",

        url: {
            "": ""
        },

        requestMap: {},

        getUrl: function (key) {
            return $weqia.appServer + this.url[key];
        },

        /**
         * ajax请求
         *
         * 参数说明:
         *
         * 示例:
         *
         */
        doAjax: function (options) {

            var url = "";
            var method = "post";

            var $form;
            var method;
            if (options.form) {
                $form = $(options.form);
                method = $form.attr('method');
                action = $form.attr('action');
                url = (typeof action === 'string') ? $.trim(action) : '';
                url = url || window.location.href || '';
            }

            var data = [];
            if ($form && $form.length)
                data = $form.formToArray();

            var req = {
                url: url,
                async: true,
                dataType: "json",
                type: method,
                data: data
            };
            req = $.extend(true, req, options);

            req.successCall = function (result) {
                if (result.errorMsg || result.errorCode) {
                    $.showUnkownError(result, $form);
                    if (req.fail) {
                        req.fail(result);
                    }
                    return;
                }
                if (req.success) {
                    req.success(result);
                }
            };


            req.errorrCall = function (xhr, textStatus, errorThrown) {
                $.showUnkownError({
                    'errorId': 'SYSTEM_ERROR',
                    'errorMsg': '系统异常，请稍候再试!'
                }, $form);
                if (req.error) {
                    req.error(xhr, textStatus, errorThrown);
                }
            };

            var actionKey = "";
            req.beforeCall = function (xhr) {

                actionKey = $wq.getRequestAction(req.url);
                //特殊请求  可以连续发送 20150305
                //20150317 增加'statsEnReadMsg'
                //20150326 增加'contact'
                var SactionKeyMap = ['readMsg', 'nodetalkret', 'statsEnReadMsg', 'contact', 'customerList', 'toCustomerMsgDraft'];

                if (SactionKeyMap.indexOf(actionKey) < 0) {
                    if ($wq.requestMap[actionKey]) {
                        //alert("请不要重复提交"+actionKey+"  "+SactionKeyMap.indexOf(actionKey));
                        alert("请不要重复提交");
                        return false;
                    }
                }
                //alert(actionKey);
                if (req.beforeSend) {
                    req.beforeSend(xhr);
                }
                $wq.requestMap[actionKey] = true;
            };

            req.completeCall = function (response, statue) {
                $wq.requestMap[actionKey] = false;
                if (req.complete) {
                    req.complete(response, statue);
                }
            };

            $.ajax({
                'url': req.url,
                'async': req.async,
                'dataType': req.dataType,
                'type': req.type,
                'beforeSend': req.beforeCall,
                'complete': req.completeCall,
                'data': req.data,
                'success': req.successCall,
                'error': req.errorrCall
            });
        },
        defaultAjax: function (req) {
            var url = req.url;
            var data = req.data;
            var onSuccess = req.onSuccess;
            $wq.doAjax({
                url: url,
                data: data,
                success: function (result) {
                    $.dialog({
                        width: '250px',
                        height: "80px",
                        title: "提示",
                        time: 3,
                        icon: 'success.gif',
                        content: "<h2>操作成功！</h2>",
                        min: false,
                        max: false
                    });
                    if (onSuccess) {
                        onSuccess.call(this, result);
                    }
                },
                fail: function (result) {
                    $.dialog({
                        width: '250px',
                        height: "80px",
                        title: "提示",
                        icon: 'error.gif',
                        time: 3,
                        content: "<h3>" + result.errorMsg + "</h3>",
                        min: false,
                        max: false
                    });
                },
                error: function () {
                    $.dialog({
                        width: '250px',
                        height: "80px",
                        title: "提示",
                        icon: 'error.gif',
                        time: 3,
                        content: "<h3>网络或系统异常，请稍候重试！</h3>",
                        min: false,
                        max: false
                    });
                }
            });
        },

        extend: function (subClass, superClass) {
            var F = function () {
            };
            F.prototype = superClass.prototype;
            subClass.prototype = new F();
            subClass.prototype.constructor = subClass
            subClass.superClass = superClass.prototype;
            if (superClass.prototype.constructor == Object.prototype.constructor) {
                superClass.prototype.constructor = superClass
            }
        },

        getRequestAction: function (url) {
            var bIndex = url.lastIndexOf("/");
            var eIndex = url.indexOf(".htm");
            return url.substring(bIndex + 1, eIndex);
        },

        /**
         * 20150416 取得url单个参数
         * 获取url值
         */
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]);
            return null;
        },
        getEncodeUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return decodeURI(r[2]);
            return null;
        },

        /**
         * ajax请求数据
         *
         * 参数说明:
         * url:请求URL,必填;
         * async:异步请求,默认false;
         * dataType:数据类型,默认json格式;
         * type:请求模式,默认'post';
         * data:请求数据，可空;
         * success: 成功回调函数,asyns为true时调用;
         * error: 错误异常回调函数,默认弹框提示
         *
         * 示例:
         * req = {
         * 	url:'',
         * 	async: true,
         * 	dataType: 'json',
         * 	type: 'post'
         * 	data: [],
         * 	success: function(){},
         * 	error: function(){}
         * }
         */
        getData: function (req) {
            req = $.extend({
                url: "",
                async: false,
                dataType: 'json',
                type: 'POST',
                data: null,
                dataName: null
            }, req);
            var data = req.data;
            if (data && !$.isArray(data))
                data = $wq.jsonToArr(data, req.dataName);


            //  ajax部分 =============
            //			/**
            //			 * 20150416 用于模拟企业内登陆    暂不使用使用企业互换
            //			 * 添加url参数 mscid
            //			 */
            var ret;
            $.ajax({
                'url': req.url,
                'async': req.async,
                'dataType': req.dataType,
                'type': req.type,
                'data': data,
                'success': function (e) {
                    if (!req.async)
                        ret = e;
                    if (req.success)
                        req.success(e);
                },
                'error': function (rep) {
                    if (req.error)
                        req.error(rep);
                    //					else
                    //						alert('请求出错!');
                }
            });
            return ret;
        },

        /**
         * ajax请求数据,返回json数据格式
         *
         * 参数说明:
         * url:请求URL,必填;
         * async:异步请求,默认false;
         * type:请求模式,默认'post';
         * data:请求数据，可空;
         * key: 获取数据的属性名;
         * success: 成功回调函数,asyns为true时调用;
         * error: 错误异常回调函数,默认弹框提示
         *
         * 示例:
         * req = {
         * 	url:'',
         * 	async: true,
         * 	type: 'post'
         * 	data: [],
         * 	success: function(){},
         * 	error: function(){}
         * }
         */
        getJsonData: function (req) {
            req = $.extend(req, {
                dataType: 'json'
            });
            var json = this.getData(req);
            if (json == undefined || !json)
                return null;

            var key = req.key;
            if (key == undefined)
                key = null;
            if (key)
                json = (json[key] == undefined ? null : json[key]);
            return json;
        },

        /**
         * 获取请求参数map ===================
         */
        getParameterMap: function (url) {
            var queryStr = this.getQueryString(url);
            if (!queryStr)
                return null;
            var urlarr = queryStr.split("&");
            var paraMap = {};
            for (var i = 0; i < urlarr.length; i++) {
                var paras = urlarr[i].split("=");
                if (paras.length == 2) {
                    var obj = paraMap[paras[0]];
                    if (obj) {
                        if (!$.isArray(obj))
                            obj = [obj];
                        obj[obj.length] = paras[1];
                    } else
                        obj = paras[1];
                    paraMap[paras[0]] = obj;
                }

            }
            return paraMap;
        },

        /**
         * 获取请求参数map =============
         */
        getParameter: function (name, url) {
            var paraMap = this.getParameterMap(url);
            if (!paraMap)
                return null;
            return paraMap[name];
        },

        // 获取成员图片 =================
        getMemberPic: function (pic) {
            if (!pic) {
                pic = this.assetsPath + "/image/default_man_small.jpg";
            }
            return pic;
        },

        /**
         * 获取请求字符串 ================
         */
        getQueryString: function (url) {
            if (!url)
                url = location.href;
            var index = url.indexOf('?');
            if (index == -1 || index == url.length - 1)
                return null;
            return url.substr(url.indexOf('?') + 1);
        },

        /**
         * 获取系统时间 =================
         */
        getSystemTime: function () {
            var url = "/common/systime.htm";
            var result = this.getJsonData({
                url: url
            });
            if (result)
                return result.systime;
            return null;
        },

        // 取值 ========================
        getValue: function (target) {
            if (!target) { //20150417 去空值
                return null;
            }
            var $target = $(target);
            if (!$target || $target.length == 0) { //20150417 去空值
                return null;
            }
            if ($.trim($target.val()) == $target.get(0).defaultValue) {
                return null;
            }
            return $target.val();
        },

        /**
         * 高亮闪烁 ======================
         *
         * 参数说明:
         * target: 选择器
         * color:色彩
         */
        highBlink: function (target, color) {
            $(target).css({
                "background-color": color,
                "opacity": "0.8"
            }).animate({
                opacity: '0.3'
            }, 200).animate({
                opacity: '0.8'
            }, 200).animate({
                opacity: '0.3'
            }, 200, function () {
                $(this).css({
                    "background-color": "#ffffff",
                    "opacity": "1"
                });
            });
        },

        /**
         * 将json数据格式转换成数据 ==================
         *
         * 示例:
         * json = {'userName':'张三','password':'123456'}
         * 转换为
         * data = [{'name':'userName','value':'张三'},{'name':'password','value':'123455'}]
         */
        jsonToArr: function (jsonObj, objName) {
            if (!objName)
                objName = "";
            var arr = [];
            for (var key in jsonObj) {
                var value = jsonObj[key];
                var name;
                if (objName && key.indexOf(objName) != 0)
                    name = objName + "." + key;
                else
                    name = key;
                if (value != null && value != undefined) {
                    if ($.isArray(value)) {
                        $.each(value, function (i, el) {
                            var obj = {
                                "name": name,
                                "value": el
                            }
                            arr.push(obj);
                        });
                    } else {
                        var obj = {
                            "name": name,
                            "value": value
                        }
                        arr.push(obj);
                    }
                }
            }
            return arr;
        },

        // 判空
        isEmpty: function (param) {
            if (param == undefined || param == null || !param)
                return true;
            return false;
        },

        /**
         * 加载数据
         *
         * 参数说明:
         * url:请求URL,必填;
         * async:异步请求,默认false;
         * dataType:数据类型,默认json格式;
         * type:请求模式,默认'post';
         * data:请求数据，可空;
         * callback: 回调函数;
         *
         * 示例:
         * req = {
         * 	url:'',
         * 	async: true,
         * 	dataType: 'json',
         * 	type: 'post'
         * 	data: [],
         * 	callback: function(){},
         * }
         */
        loadData: function (req) {
            /**20150326 参考 req.data */
            req = $.extend({
                url: "",
                async: false,
                dataType: 'json',
                data: null,
                dataName: null,
                loop: true
            }, req);
            var obj = req.data;
            if (!$.isNumeric(obj.pageSize))
                obj.pageSize = 200;
            /*20150326*/
            if (!obj.currentPage)
                obj.currentPage = 1;

            var successCall = function (result) {
                if (result.errorMsg || result.errorCode) {
                    if (req.fail) {
                        req.fail(result);
                    }
                    return;
                }
                var query = result.query;
                if (query && query.currentPage == 1 && req.init) {
                    req.init(result);
                }
                req.handle(result);

                if (req.loop === true && query &&
                    query.totalItem > query.currentPage * query.pageSize) {
                    query.currentPage = query.currentPage + 1;
                    req.data = query;
                    return doPost(req);
                }
                if (req.ready)
                    req.ready(result);
            };

            var errorrCall = function (rep) {
                if (req.error)
                    req.error(rep);
            };


            var doPost = function (req) {
                var obj = req.data;
                var param = $wq.jsonToArr(obj, req.dataName);

                $.ajax({
                    'url': req.url,
                    'async': req.async,
                    'dataType': req.dataType,
                    'type': "POST",
                    'data': param,
                    'success': successCall,
                    'error': errorrCall
                });
            }

            doPost(req);

        },

        newDate: function () {
            if (!this.weqiaDate || this.weqiaDate == undefined) {
                var systime = this.getSystemTime();
                this.weqiaDate = new WeqiaDate(systime);
            }
            return this.weqiaDate;
        },

        // 新guid
        newGuid: function () {
            var guid = "";
            for (var i = 1; i <= 32; i++) {
                var n = Math.floor(Math.random() * 16.0).toString(16);
                guid += n;
            }
            return guid;
        },

        /**
         * ajax分页查询处理模板，该方法用于优化分页，包括查询、处理数据、分页导航等步骤。
         *
         * 参数说明:
         * cond:查询条件
         * url: 查询url
         * controot: 数据内容展示root对象
         * handle: 数据处理函数(回调函数).参数optins继承至paging，options.data为分页数据，options.query为查询参数。
         * pageroot:分页导航root对象
         * pagfun: 分页函数，供pager对象调用。一般情况下为paging的上一级调用者，该方法无法传参（可参考WeqiaPage插件）。
         *
         *
         * 示例:
         * {
         * 	url:"",
         * 	cond: [],
         * 	target: $(".cont_root"),
         * 	handle: task.handle
         * }
         */
        paging: function (options) {
            var controot = options.controot;
            var handle = options.handle;
            var pagfun = options.pagfun;
            var pageroot = options.pageroot;
            var pageSize = options.pageSize;
            var pageSizeSet = options.pageSizeSet;
            var id = options.id;
            if (!pagfun)
                pagfun = options.pagfun = arguments.callee.caller;

            var cond = options.cond;
            var url = options.url;
            //加载loading
            $wq.loading({
                target: controot,
                position: 'absolute',
                height: '150px',
                insert: $('.page_nav')
            });
            $wq.pagingQuery({
                url: url,
                data: cond,
                pageSize: pageSize,
                //				//20150422 有2个pager的时候
                //				pager:options.pager||"pager",
                success: function (datas, query) {
                    options.data = datas;
                    options.query = query;
                    $wq.removeload() // 移除加载loading
                    handle(options);
                },
                paging: function (pageInfo) {
                    $wq.page({
                        selector: pageroot,
                        schFun: pagfun,
                        pageSizeSet: pageSizeSet
                    }, pageInfo);
                }
            });
        },

        /**
         * 分页查询
         * 参数说明:
         * url:请求URL,必填;
         * async:异步请求,默认false;
         * dataType: 'json',
         * type:请求模式,默认'post';
         * data:请求数据，可空;
         * extData:扩展数据,合并到data上，可空;
         * pager:分页对象或函数
         * schForm: 查询form表单,jquery选择器,可从中获取查询数据data和pager对象,优先使用指定数据和对象
         * success: 成功回调函数,默认不处理;
         * error: 错误异常回调函数,默认弹框提示
         *
         * 示例:
         * req = {
         * 	url:'',
         * 	async: true,
         * 	dataType: 'json',
         * 	type: 'post'
         * 	data: [],
         * 	extData: [],
         * 	pager: null,
         *  schForm: '',
         *  success: function(){},
         *  error: function(){}
         * }
         */
        pagingQuery: function (req) {
            var defaults = {
                url: "",
                async: true,
                dataType: 'json',
                type: 'POST',
                data: null,
                extData: null,
                pager: "pager",
                schForm: null,
                queryName: "query",
                success: function () {
                },
                fail: function () {
                },
                error: function () {
                }
            };
            req = $.extend(true, defaults, req);

            var pager = null;
            if (req.pager) {
                if (typeof req.pager === "object")
                    pager = req.pager;
                else if (typeof req.pager === "string")
                    pager = $wq.getPager(req.pager);
            } else {
                pager = $wq.getPager();
            }

            var currpage = 1;
            if (pager)
                currpage = pager.getAjaxCurrentPage();
            var pageInfo = this.jsonToArr({
                'currentPage': currpage,
                'pageSize': req.pageSize
            }, req.queryName);
            $.merge(req.data, pageInfo);

            //			/**
            //			 * 20150416 用于模拟企业内登陆    暂不使用使用企业互换
            //			 * 添加url参数 mscid
            //			 */
            //			var mscid = this.getUrlParam("mscid");
            //			if(mscid){
            //				var mscidInfo = this.jsonToArr({"mscid":mscid});
            //				req.data = $.merge(req.data,mscidInfo);
            //			}

            $.ajax({
                'url': req.url,
                'async': req.async,
                'dataType': req.dataType,
                'type': req.type,
                'data': req.data,
                'success': function (result) {
                    if (req.dataType == "html") {
                        if (req.success)
                            req.success(result);
                        if (req.paging)
                            req.paging();
                        return;
                    }
                    if (result.errorMsg || result.errorCode) {
                        if (req.fail)
                            req.fail(result);
                        return;
                    }
                    var data = result.list;
                    var query = result.query;
                    if (req.success)
                        req.success(data, query);

                    if (req.paging) {
                        var pageInfo = {
                            "totalPage": query.totalPage,
                            "page": query.currentPage,
                            "totalItem": query.totalItem
                        };
                        req.paging(pageInfo);
                    }
                },
                'error': function (rep) {
                    if (req.error)
                        req.error(rep);
                    //					else
                    //						alert('请求出错!');
                }
            });
        },

        /**
         *
         *
         */
        parseAtMan: function (content, callback) {
            var regex = /@[^\s@\:]+\s/ig;
            var atBlocks = content.match(regex);
            alert(atBlocks);
            if (atBlocks) {
                $.each(atBlocks, function (i, bl) {
                    alert("index:" + i + " " + bl);
                });
            }

        },

        resetValue: function (target) {
            var $target = $(target);
            if (!$wq.isEmpty($target.get(0).defaultValue)) {
                $target.css('color', '#999999').val($target.get(0).defaultValue);
            } else
                $target.val("");
        },

        setUrlParameter: function (url, name, value) {
            if (!url)
                return null;

            if (!$.isArray(value))
                value = [value];
            $.each(value, function (i, el) {
                if (url.indexOf("?") == -1)
                    url += "?";
                else
                    url += "&";
                url = url + name + "=" + el;
            });
            return url;
        },

        setUrlParameters: function (url, params) {
            if (!url)
                return null;
            for (var name in params) {
                var value = params[name];
                if (value != null && value != undefined) {
                    url = this.setUrlParameter(url, name, value);
                }
            }
            return url;
        },

        setValue: function (target, value) {
            target = $(target);
            if (target.length) {
                target.val(value);
                target.css('color', 'black');
            }

        },

        /**
         * 限制文本字数 ==========================
         */
        textLengthLimit: function (target, limitLength, shuzhi) {
            var $target = $(target);
            var $shuzhi = null;
            if (shuzhi)
                $shuzhi = $(shuzhi);
            if (!$shuzhi || !$shuzhi.length)
                $shuzhi = $(".shuzhitji");

            var fn = function () {

                if ($(this).prop('tagName') === 'DIV') {
                    var value = $(this).text();
                    if (value.length > limitLength)
                        $(this).text(value.substring(0, limitLength));
                    var length = $(this).text().length;
                    $shuzhi.text("" + length + "/" + limitLength);
                } else {
                    var value = $(this).val();
                    if (value.length > limitLength)
                        $(this).val(value.substring(0, limitLength));
                    var length = $(this).val().length;
                    $shuzhi.text("" + length + "/" + limitLength);
                }
            }
            $target.change(fn).inputChange(fn);
        },

        /**
         * 文本省略处理 =====================
         *
         * 参数说明:
         * el: 标签;
         * text: 文本;
         * length: 显示部分长度, 默认为150字符;
         * showlink: 显示链接文体,默认为“查看全部”;
         * hidelink: 隐藏链接文体,默认为“显示部分”;
         * 示例:
         * options = {
         *
         * }
         */
        textOmit: function (options) {
            options = $.extend({
                el: "",
                text: "",
                length: 150,
                showlink: "查看全部",
                hidelink: "显示部分"
            }, options);
            var $el = $(options.el);
            if (!$el.length || !options.text)
                return;

            if (options.text.length <= options.length) {
                $el.html("<pre>" + options.text + "</pre> <br/>");
                return;
            }
            var show = function () {
                var text = $el.data("text");
                $el.html("<pre>" + text + "</pre> <br/>");
                var hidelink = $('<a href="javascript:void(0)"></a>').html(options.hidelink).appendTo($el);
                hidelink.click(hide);
                $(this).remove();
            };
            var hide = function () {
                var text = $el.data("text");
                text = text.substring(0, options.length) + "...";
                $el.html("<pre>" + text + "</pre> <br/>");
                var showlink = $('<a href="javascript:void(0)"></a>').html(options.showlink).appendTo($el);
                showlink.click(show);
                $(this).remove();
            }

            if (options.text.length > options.length) {
                $el.data("text", options.text);
                var text = options.text.substring(0, options.length) + "...";
                $el.html("<pre>" + text + "</pre> <br/>");
                var showlink = $('<a href="javascript:void(0)"></a>').html(options.showlink).appendTo($el);
                showlink.click(show);
            }

        },

        /**
         * 设置文本框默认，并提供焦点事件 =================
         */
        tooltipFocus: function (target, value) {
            if (target && target.length > 0) {
                var $target = $(target);
                if (value)
                    $target.get(0).defaultValue = value;
                if ($target.get(0).defaultValue) {
                    $target.val($target.get(0).defaultValue);
                }
                $target.css('color', '#999999');
                $target.focus(function () {
                    var int = $(this);
                    int.css('color', 'black')
                    if (int.val() == this.defaultValue) {
                        int.val('');
                    }
                }).blur(function () {
                    var int = $(this);
                    if (int.val() == '') {
                        int.css('color', '#999999').val(this.defaultValue);
                    }
                });
            }
        }
    });


    /**
     * 浮动选择控件
     * ================================
     * 参数说明:
     * mode: 控件模式，默认为选择模式"select",支持菜单模式"menu";
     * trigger: 触发对象或选择器，必填;
     * target:  浮动层对象或选择器，必填;
     * item:     浮动层选项对象选择器，非必填，默认为".menu_item";
     * width:     浮动层宽度;
     * eventType: 事件类型，默认"click";
     * position:浮动层位置，默认"3-2";
     * showCall:浮动层显示时候的回调函数，可自定义回调函数。 函数里面this代表selectbox对象;
     * itemClick: 选择项点击事件，可自定义click事件。提供参数:选中项item、选中项索引index、回调函数callback。函数里面this代表selectbox对象;
     * callback: 选择操作回调函数。提供参数:选中项item、选中项索引index。函数里面this代表selectbox对象;
     */
    var WqFloatSelectBox = function (options) {
        var settins = {
            mode: "select",
            trigger: null,
            target: null,
            item: null,
            width: 117,
            eventType: "click",
            position: "3-2",
            offsets: {
                x: 0,
                y: 0
            },
            zIndex: 999,
            relative: false,
            showCall: null,
            hideCall: null
        };
        this.settings = options = $.extend(settins, options);
        var trigger = this.trigger = $(options.trigger);
        var target = this.target = $(options.target);

        if (!trigger.length || !target.length)
            return;
        if (trigger.text())
            this.defaultText = trigger.text();

        var itemSelector = ".menu_item";
        if (options.item)
            itemSelector = options.item;
        this.itemSelector = itemSelector;
        //var items = target.find(itemSelector);

        var $this = this;

        if (options.itemClick)
            this.settings.itemClick = options.itemClick;
        else {
            this.settings.itemClick = function (item, index) {
                if ($this.settings.mode &&
                    $this.settings.mode.toLowerCase() == "select") {
                    $this.selectIndex = index;
                    $this.trigger.text(item.text());
                    item.addClass("cur").siblings().removeClass("cur");
                }
                if ($this.settings.callback)
                    $this.settings.callback.call($this, item, index);
            }
        }
        trigger.weqiafloat({
            zIndex: options.zIndex,
            width: options.width,
            eventType: options.eventType,
            target: target,
            position: options.position,
            offsets: options.offsets,
            edgeAdjust: false,
            relative: options.relative,
            showCall: function () {
                if ($this.settings.showCall)
                    $this.settings.showCall.call(trigger, target);

                var items = target.find($this.itemSelector);
                $.each(items, function (i, el) {
                    var item = $(el);
                    item.unbind("click").click(function (e) {
                        $this.settings.itemClick.call($this, item, i);
                        $.weqiafloat.hide();
                    });
                });
            },
            hideCall: function () {
                if ($this.settings.hideCall)
                    $this.settings.hideCall.call(trigger, target);
            }
        });

        trigger.data("floatSelector", this);
        return this;
    };
    $.extend(WqFloatSelectBox, {

        get: function (trigger) {
            trigger = $(trigger);
            if (!trigger.length)
                return null;
            return trigger.data("floatSelector");
        }
    });
    $.extend(WqFloatSelectBox.prototype, {

        getValue: function () {
            var items = this.target.find(this.itemSelector);
            if (!items.length)
                return null;
            var val = items.filter(".cur").val();
            return val;
        },

        reset: function () {
            var items = this.target.find(this.itemSelector);

            if (!items.length)
                return;

            var defaultItem = items.eq(0);
            this.settings.itemClick.call(this, defaultItem, 0);
            if (this.defaultText)
                this.trigger.text(this.defaultText);

        },

        setSelectedItem: function (index) {
            var selitems = this.target.find(this.itemSelector);
            if (!selitems.length)
                return;
            if (selitems.length <= index)
                return;
            var items = selitems.eq(index);
            this.settings.itemClick.call(this, items, index);
        },

        setValue: function (value) {
            var selitems = this.target.find(this.itemSelector);
            if (!selitems.length)
                return;
            var $this = this;
            $.each(selitems, function (i, el) {
                var item = $(el);
                if (item.val() == value) {
                    $this.settings.itemClick.call($this, item, i);
                    return;
                }
            });
        }
    });
    window.WqFloatSelectBox = WqFloatSelectBox;
    $.floatSelectBox = $wq.floatSelectBox = function (options) {
        return new WqFloatSelectBox(options);
    };
    $wq.getFloatSelectBox = function (trigger) {
        return WqFloatSelectBox.get(trigger);
    };


    /**
     * 上传组件 =================================
     */
    var wqFileHandler = $wq.fileHandler = {

        thumb: {
            "403": 3,
            "501": 3,
            "711": 3,
            "310": 4,
            "360": 4
        },
        bigIcon: {
            "default": "/common/images/file_default_b.png",
            "txt": "/common/images/file_txt_b.png",
            "doc": "/common/images/file_word_b.png",
            "docx": "/common/images/file_word_b.png",
            "dot": "/common/images/file_word_b.png",
            "xls": "/common/images/file_xls_b.png",
            "xlsx": "/common/images/file_xls_b.png",
            "ppt": "/common/images/file_ppt_b.png",
            "pptx": "/common/images/file_ppt_b.png",
            "pdf": "/common/images/file_pdf_b.png",
            "exe": "/common/images/file_exe_b.png",
            "apk": "/common/images/file_apk_b.png",
            "zip": "/common/images/file_zip_b.png",
            "rar": "/common/images/file_rar_b.png",
            "psd": "/common/images/file_psd_b.png",
            "csv": "/common/images/file_csv_b.png",
            "html": "/common/images/file_html_b.png",
            "key": "/common/images/file_key_b.png"
        },
        icon: {
            "default": "/common/images/file_moren.png",
            "txt": "/common/images/file_txt.png",
            "doc": "/common/images/file_word.png",
            "docx": "/common/images/file_word.png",
            "dot": "/common/images/file_word.png",
            "xls": "/common/images/file_xls.png",
            "xlsx": "/common/images/file_xls.png",
            "ppt": "/common/images/file_ppt.png",
            "pptx": "/common/images/file_ppt.png",
            "pdf": "/common/images/file_pdf.png",
            "exe": "/common/images/file_exe.png",
            "apk": "/common/images/file_apk.png",
            "zip": "/common/images/file_zip.png",
            "mp4": "/common/images/file_video.png",
            "amr": "/common/images/file_amr.png",
            "rar": "/common/images/file_rar.png",
            "psd": "/common/images/file_psd_w.png",
            "csv": "/common/images/file_csv.png",
            "html": "/common/images/file_html.png",
            "key": "/common/images/file_key.png"
        },

        getFileExt: function (fileName) {
            if (!fileName)
                return null;
            var index = fileName.lastIndexOf(".");
            if (index == -1)
                return null;
            return fileName.substr(index + 1);
        },
        getFileBigIcon: function (ext) {
            if (!ext)
                return this.bigIcon["default"];

            ext = ext.toLocaleLowerCase();
            if (this.bigIcon[ext] != undefined && this.bigIcon[ext])
                return this.bigIcon[ext];

            return this.bigIcon["default"];
        },
        getFileIcon: function (ext) {
            if (!ext)
                return this.icon["default"];

            ext = ext.toLocaleLowerCase();
            if (this.icon[ext] != undefined && this.icon[ext])
                return this.icon[ext];

            return this.icon["default"];
        },

        getFileUrl: function (file, th) {
            var url;
            if (this.isImage(file.type, file.mime)) {
                var itype = this.settings.itype;
                url = this.getSignUrl(file.url, th);
            } else {
                var ext = this.getFileExt(file.name);
                url = this.getFileIcon(ext)
                //url = "/common/images/file_zip_b.png";
                //url = this.settings.imageServer + url;
            }

            return url;
        },
        getImageUrl: function (url, th) {
            var url = this.getSignUrl(url, th);
            return url;
        },
        getPicUrl: function (file, th) {
            var url;
            if (this.isImage(file.type, file.mime)) {
                url = this.getSignUrl(file.url, th);
            } else {
                var ext = this.getFileExt(file.name);
                url = this.getFileIcon(ext);
                //url = this.settings.imageServer + url;
            }

            return url;
        },
        getSignUrl: function (url, th) {
            var data = $wq.jsonToArr({
                "url": url,
                "th": th
            });
            url = $wq.getJsonData({
                "url": "/common/signUrl.htm",
                "data": data
            });
            return url;
        },
        getSuffixSignUrl: function (url) {
            var data = $wq.jsonToArr({
                "url": url
            });
            url = $wq.getJsonData({
                "url": "/common/suffixSignUrl.htm",
                "data": data
            });
            return url;
        },

        getSignUrlByDownload: function (url, th) {
            var data = $wq.jsonToArr({
                "url": url,
                "th": th
            });
            url = $wq.getJsonData({
                "url": "/common/getSignUrlByDownload.htm",
                "data": data
            });
            return url;
        },
        getSignUrlByDownloadWithName: function (url, th, downloadName) {
            var data = $wq.jsonToArr({
                "url": url,
                "th": th,
                "downloadName": downloadName
            });
            url = $wq.getJsonData({
                "url": "/common/getSignUrlByDownloadWithName.htm",
                "data": data
            });
            return url;
        },


        isImage: function (fileType, fileMime) {

            //if (mime =="image/jpeg" || mime == "image/png" || mime == "image/gif" || mime == "image/bmp" || mime == "image/x-icon" )
            //	return true;

            if (fileType == "1" && (fileMime == "image/jpeg" || fileMime == "image/png" || fileMime == "image/gif" || fileMime == "image/bmp" || fileMime == "image/x-icon" || fileMime == "image/x-ms-bmp" || fileMime == "???"))
                return true;

            return false;

            //var re = /^image/ig;
            //return re.test(mime);
        },
        isAudio: function (fileType, fileMime) {
            if (fileType == 2)
                return true;
            return false;
        },
        isVideo: function (fileType, fileMime) {

            if (fileType == 3)
                return true;
            return false;
        }
    };


    /**
     * upload plugin (文件上传插件)
     * ======================================
     *
     * 参数说明:
     * uploadEl: 上传标签（选择器）,必填;
     * itype: 业务类型,必填;
     * fileCount:允许上传的文件数
     * fileSize: 允许上传的文件大小,单位M
     * replace: 允许替换文件,只有当上传文件数为1的时候有效,默认为true;
     * multiple:多文件上传模式，只有当上传文件数大于1的时候有效;
     * view:文件视图（选择器）;
     * formable: 支持表单, 默认为true;
     * formEl: 表单元素（选择器） , formable为 true,提供表单元素;
     * imageServer: 静态文件服务器;
     * afterUpload: 文件上传成功后调用函数，函数内this为文件上传对象，提供参数data为文件上传成功后返回的数据
     *
     *
     * 示例:
     * options = {
     * 	uploadEl: '',
     * 	itype: 1000,
     *  fileCount: 5,
     *  fileSize: 20,
     *  replace: true,
     * 	multiple: true,
     * 	view: '',
     * 	formable: true,
     * 	formEl: '',
     * 	imageServer: '',
     * 	afterUpload: function(){}
     * }
     */
    var WeqiaUploader = function (options) {
        if (!options.uploadEl)
            return;
        var uploadEl = $(options.uploadEl);
        if (!uploadEl.length)
            return;
        this.currentUploadEl = uploadEl;

        this.GUID = $wq.newGuid();
        this.settings = $.extend(true, {}, WeqiaUploader.defaults, options);
        if (this.settings.fileCount == 1)
            this.settings.multiple = false;
        if ($.browser.msie)
            this.settings.multiple = false;
        this.prepareFiles = null;
        this.uploadingFiles = [];
        this.uploadedFiles = [];
        this.init();
    };

    $.extend(WeqiaUploader, {

        defaults: {
            itype: 1000,
            /* 业务类型。*/
            fileCount: 9,
            /* 允许上传的文件数*/
            fileSize: 300,
            /* 允许上传的文件大小,单位M*/
            replace: false,
            /* 允许替换文件*/
            multiple: true,
            /* 多文件上传模式 */
            showView: true,
            /* 是否显示视图 */
            view: null,
            /* 文件视图 */
            formable: true,
            /* 支持表单, 默认为true*/
            formEl: null,
            /* 表单元素 , formable为 true,提供表单元素*/
            allowedTypes: "all",
            /* 允许上传的文件类型 */
            uploadElClass: "ts_wx1",
            /* 上传控件样式 */
            actionUrl: "/common/upload.htm",
            /* 文件上传URL*/
            imageServer: "",
            /*20150420 3为拉伸图   缩略图修改为4截取图   原th:3*/
            th: 4,
            /* 展示的缩略图, 默认为3（180*180）*/
            inputFileClass: "file_formupoadfile",
            /* 文件输入控件样式*/
            order: 1,
            /* 新增文件顺序，1正常顺序，2倒叙*/
            noName: false,
            /*需不需要显示名字*/
            mode: false,
            /*允许上传模式，默认html5 fromData 还有from模式*/
            afterUpload: null
        },

        callBack: function (uploader, data) {
            var $uploader = $.data(document.body, uploader);
            $uploader.uploadCallBack(data);
        }
    });
    $.extend(WeqiaUploader.prototype, wqFileHandler);
    $.extend(WeqiaUploader.prototype, {
        init: function () {
            var currentUploadEl = this.currentUploadEl;
            currentUploadEl.addClass(this.settings.uploadElClass);

            var parentEl = currentUploadEl.parent();
            parentEl.css("position", "relative");

            var uploadForm = $('<form id="uploadForm" class="uploadForm" action="' + this.getActionUrl() + '" method="post" enctype="multipart/form-data"></form>').appendTo(parentEl);
            this.uploadForm = uploadForm;

            var uploadFile = $('<input id="uploaditem" type="file" class="uploaditem" name="uploadFile" style="cursor:pointer;opacity:0;filter:alpha(opacity=0);" title="" original-title="最多一次能上传' + this.settings.fileCount + '个,单个大小不能超过' + this.settings.fileSize + 'M"/>');
            uploadFile.addClass(this.settings.inputFileClass);
            uploadFile.appendTo(uploadForm);
            this.uploadFile = uploadFile;
            if (this.settings.multiple)
                uploadFile = uploadFile.attr("multiple", true);

            $('<input type="hidden" class="uploaditem" name="itype"/>').val(this.getItype()).appendTo(uploadForm);
            $('<input type="hidden" class="uploaditem" name="timestamp"/>').val(this.getSystemTime()).appendTo(uploadForm);
            $('<input type="hidden" class="uploaditem" name="callbacker"/>').val(this.GUID).appendTo(uploadForm);
            $('<input type="hidden" class="uploaditem" name="company_id"/>').val(this.getCompany_id()).appendTo(uploadForm);

            if (this.settings.formable) {
                var formEl;
                if (this.settings.formEl)
                    formEl = $(this.settings.formEl);
                else {
                    formEl = $('<input type="hidden" class="uploadFileUrl" name="file_url"/>');
                    formEl.appendTo(parentEl);
                }
                this.formEl = formEl;
                var uploading = $('<input type="hidden" class="uploadingFileCnt" value="0"/>');
                var el_name = formEl.attr("name");
                if (el_name)
                    uploading.attr("name", el_name + "_cnt");
                formEl.after(uploading);
            }

            var uploadView;
            if (this.settings.view) {
                uploadView = $(this.settings.view);
                var ul = uploadView.find("ul.file_view");
                if (!ul.length) {
                    uploadView.append('<ul class="file_view"></ul>');
                }
            } else {
                uploadView = $('<div class="gg_box_dow" style="display:none;"><ul class="file_view"></ul></div>').insertAfter(parentEl.parent().parent());
            }
            /**
             * 用于显示进度条和展示图标或缩略图
             */
            this.uploadView = uploadView;

            uploadFile.tipsy({
                gravity: 's'
            });

            var $uploader = this;
            uploadFile.unbind();
            uploadFile.bind("change", function (event) {
                //20150708  上传2次修改 过滤掉上传文件为空的那次
                var s = $(this);
                var context = s.context;
                var filelist = context.files;
                if (filelist === undefined || filelist.length > 0) {
                    $uploader.upload();
                }
            });
        },

        addUploadedData: function (data) {
            if (this.getUploadedFileCnt() < this.settings.fileCount)
                this.uploadedFiles.push(data);
            else if (this.settings.fileCount == 1 && this.settings.replace)
                this.uploadedFiles[0] = data;

            if (this.settings.formable) {
                this.setFormELValue();
            }
        },

        addUploadingData: function (data) {
            this.uploadingFiles.push(data);
            if (this.settings.formable) {
                this.setUploadingFileCnt();
            }
        },

        check: function () {
            var files = null;
            if ($.browser.msie) {
                files = [1];
                var value = this.uploadFile.val();
                var index = value.lastIndexOf("\\");
                value = value.substring(index + 1, value.length);
                files[0] = {
                    "name": value
                };
            } else {
                files = this.uploadFile.get(0).files;
            }

            if (this.settings.fileCount > 1 || !this.settings.replace) {
                var count = files.length;
                if (this.getUploadFileCnt() + count > this.settings.fileCount) {
                    this.showError("最多只能上传" + this.settings.fileCount + "个文件!");
                    return false;
                }
            } else if (this.settings.fileCount = 1 && this.settings.replace) {
                if (this.getUploadingFileCnt() > 0) {
                    this.showError("文件正在上传中!");
                    return false;
                }
            }
            var prepareFiles = [];
            var $this = this;
            var allowedTypes = true;

            $.each(files, function (i, el) {
                if (!$this.checkFileType(el)) {
                    allowedTypes = false;
                    return;
                }
                var file = {
                    "name": el.name,
                    itemId: "",
                    groupId: "",
                    status: 0,
                    "size": el.size
                };
                prepareFiles[i] = file;
            });
            if (!allowedTypes)
                return false;
            this.prepareFiles = prepareFiles;
            return true;
        },

        checkFileType: function (file) {
            if (!this.settings.allowedTypes)
                return false;
            if (this.settings.allowedTypes === "all" ||
                this.settings.allowedTypes === "ALL")
                return true;
            var name = file.name;
            var reg = new RegExp('(.+\.(' + this.settings.allowedTypes + '))$', 'i');
            if (!reg.test(name)) {
                var allowedTypes = this.settings.allowedTypes.replace(/\|/g, ",");
                var errorMsg = "仅支持" + allowedTypes + "格式的文件";
                this.showError(errorMsg);
                return false;
            }

            return true;
        },

        cleanData: function () {
            this.prepareFiles = null;
            this.uploadedFiles = [];
            this.uploadingFiles = [];
            if (this.settings.formable) {
                this.setFormELValue();
                this.setUploadingFileCnt();
            }
        },

        cleanProgress: function (groupId) {
            var uploadView = this.uploadView;
            var lis = uploadView.find("ul.file_view li");
            $.each(lis, function (i, el) {
                var tag = $(this);
                if (tag.attr("groupId") == groupId)
                    tag.remove();
            });
            if (this.getUploadFileCnt() < 1) {
                this.uploadView.hide();
            }
            this.delUploadingFilesByGroupId(groupId);
        },

        cleanView: function () {
            var uploadView = this.uploadView;
            uploadView.find("ul.file_view li").remove();
        },

        createProgressItem: function (file) {
            var uploadView = this.uploadView;
            var li = $('<li class="clearfix"></li>');
            li.attr("id", file.itemId);
            li.attr("groupid", file.groupId);
            if (this.settings.order == 2) {
                uploadView.find("ul.file_view").prepend(li);
            } else if (this.settings.order == 1) {
                uploadView.find("ul.file_view").append(li);
            } else {
                uploadView.find("ul.file_view").append(li);
            }
            $('<p class="ggbc1"></p>').html(file.name).appendTo(li);
            $('<img src="/common/images/imgloading.gif" alt=""/>').appendTo(li);
        },
        deleteFile: function (key, li) {
            this.delUploadedFiles(key);
            li.remove();
            if (this.settings.order == 1) {
                if (this.getUploadFileCnt() < 1) {
                    this.uploadView.hide();
                }
            }

            if (this.settings.afterDeleted)
                this.settings.afterDeleted.call(this);
        },

        delUploadedFiles: function (key) {
            var uploadedFiles = this.uploadedFiles;
            var files = [];
            $.each(uploadedFiles, function (i, el) {
                if (el.id != key)
                    files.push(el);
            });
            this.uploadedFiles = files;
            if (this.settings.formable) {
                this.setFormELValue();
            }
        },

        delUploadingFiles: function (key) {
            var uploadingFiles = this.uploadingFiles;
            var files = [];
            $.each(uploadingFiles, function (i, el) {
                if (el.itemId != key)
                    files.push(el);
            });
            this.uploadingFiles = files;
            if (this.settings.formable) {
                this.setUploadingFileCnt();
            }
        },

        delUploadingFilesByGroupId: function (groupId) {
            var uploadingFiles = this.uploadingFiles;
            var files = [];
            $.each(uploadingFiles, function (i, el) {
                if (el.groupId != groupId)
                    files.push(el);
            });
            this.uploadingFiles = files;
            if (this.settings.formable) {
                this.setUploadingFileCnt();
            }
        },

        encodeFileName: function (name) {
            name = encodeURI(name);
            return name.replace(/\"|\;|\'|\=|\+|\*|\&|\^|\$|\@|\!|\~|\#|\%|\.|\(|\)|\,/g, "");
        },

        getActionUrl: function () {
            return this.settings.actionUrl;
        },

        getFile: function () {
            return this.uploadedFiles;
        },

        getItype: function () {
            return this.settings.itype;
        },

        getCompany_id: function () {
            return this.settings.company_id;
        },

        getSystemTime: function () {
            return $wq.newDate().currentDate().getTime();
        },

        /**
         * 已上传文件数
         */
        getUploadFileCnt: function () {
            var uploadedCnt = this.getUploadedFileCnt();
            var uploadingCnt = this.getUploadingFileCnt();
            return uploadedCnt + uploadingCnt;
        },

        getUploadedFileCnt: function () {
            var uploadedCnt = (this.uploadedFiles == null ? 0 : this.uploadedFiles.length);
            return uploadedCnt;
        },

        getUploadingFileCnt: function () {
            var uploadingCnt = (this.uploadingFiles == null ? 0 : this.uploadingFiles.length);
            return uploadingCnt;
        },

        getUploadFileIds: function () {
            var uploadedFiles = this.uploadedFiles;
            var val = "";
            $.each(uploadedFiles, function (i, el) {
                val += "," + el.id;
            });
            return val.substr(1);
        },

        getValue: function () {
            var uploadedFiles = this.uploadedFiles;
            var val = [];
            $.each(uploadedFiles, function (i, el) {
                val.push(el.id);
            });
            return val;
        },

        getUrls: function () {
            var uploadedFiles = this.uploadedFiles;
            var val = [];
            $.each(uploadedFiles, function (i, el) {
                val.push(el.url);
            });
            return val;
        },

        hasUploadComplete: function () {
            var uploadingCnt = this.uploadingFiles.length;
            if (uploadingCnt == 0)
                return true;
            return false;
        },

        loadData: function (data, key) {
            if (data == undefined || !data || !data.length)
                return;

            var files = [];
            if (!jQuery.isArray(data))
                data = [data];

            if (this.settings.fileCount == 1)
                files[0] = data[0];
            else
                files = data;

            var $this = this;
            $.each(files, function (i, el) {
                $this.addUploadedData(el);
                if (key) {
                    var name = el.name;
                    var encodeName = $this.encodeFileName(name);
                    var item_id = "" + key + encodeName;
                    $this.delUploadingFiles(item_id);
                    $this.loadFileView(el, item_id);
                } else {
                    $this.loadFileView(el);
                }
            });
        },

        loadFileView: function (file, key) {
            if (this.settings.showView) {
                this.uploadView.show();
            } else {
                this.uploadView.find("li").remove();
                this.uploadView.hide();
                return;
            }

            var li, imgUrl;
            if (key) {
                li = $("#" + key);
                var imgUrl = li.find('img').attr('src');
                li.children().remove();
            } else {
                li = $("<li></li>").addClass("clearfix");
                this.uploadView.find("ul.file_view").append(li);
            }

            if (this.isImage(file.type, file.mime)) {
                var url = imgUrl;
                if (imgUrl == null || imgUrl == '/common/images/imgloading.gif') {
                    var url = this.getImageUrl(file.url, this.settings.th);
                }
                var gg_box_div = $('<div class="gg_box_div"></div>');
                gg_box_div.append('<img class="gg_box_dowimg" src="' + url + '"/>');
                gg_box_div.appendTo(li);
            } else {
                var ext = this.getFileExt(file.name);
                var url = this.getFileBigIcon(ext);
                $('<img class="gg_box_dowimg" src="' + url + '"/>').appendTo(li);
            }
            if (!this.settings.noName) {
                $('<p class="ggbc1"></p>').html(file.name).appendTo(li);
                $('<p class="ggbc2">上传成功</p>').appendTo(li);
                var p = $('<p class="ggbcp"></p>').appendTo(li);
                var del = $('<a class="ggbc3" href="javascript:void(0)" >删除文件</a>').appendTo(p);
                var $uploader = this;
                del.bind("click", function () {
                    $uploader.deleteFile(file.id, li);
                });
            }
        },

        progress: function () {
            var time = this.timestamp;
            var prepareFiles = this.prepareFiles;
            var uploadingFiles = this.uploadingFiles;
            this.uploadView.show();
            if (this.settings.fileCount == 1)
                this.cleanView();

            var $this = this;
            $.each(prepareFiles, function (i, el) {
                var name = $this.encodeFileName(el.name);
                var size = $this.encodeFileName(el.size);
                var item_id = "" + time + name;
                el.itemId = item_id;
                el.groupId = time;
                el.status = 1;
                $this.addUploadingData(el);
                $this.createProgressItem(el);
            });
        },

        romoveIframe: function (key) {
            $("#uploader_" + key + "_iframe").remove();
        },

        reset: function () {
            this.cleanData();
            this.uploadView.find("ul.file_view").empty();
            this.uploadView.hide();
            this.uploadFile.val("");
        },

        removeFirst: function () {
            this.cleanData();
            this.uploadView.find("ul.file_view li").get(0).remove();
            this.uploadFile.val("");
        },

        resetForm: function () {
            this.timestamp = $wq.newDate().currentDate().getTime();
            this.uploadForm.find("[name='timestamp']").val(this.timestamp);
            var iframe_name = "uploader_" + this.timestamp + "_iframe";
            var newIframe = $('<iframe id="' + iframe_name + '" name="' + iframe_name + '" style="display:none;"></iframe>');
            $(document.body).append(newIframe);
            this.uploadForm.attr("target", iframe_name);
        },

        setFormELValue: function () {
            var formEl = this.formEl;
            formEl.val(this.getUploadFileIds());
        },

        setUploadingFileCnt: function () {
            var uploading = this.formEl.siblings(".uploadingFileCnt");
            uploading.val(this.uploadingFiles.length);
        },

        showError: function (errorMsg) {
            if ($.dialog)
                $.dialog({
                    width: '250px',
                    height: "80px",
                    title: "提示",
                    icon: 'error.gif',
                    time: 3,
                    content: "<h3>" + errorMsg + "</h3>",
                    min: false,
                    max: false
                });
            else
                alert(errorMsg);
        },

        showView: function () {
            var showView = this.settings.showView;
            return !!showView;
        },

        isIE: function (ver) {
            var b = document.createElement('b')
            b.innerHTML = '<!--[if IE ' + ver + ']><i></i><![endif]-->'
            return b.getElementsByTagName('i').length === 1
        },

        bytesToSize: function (bytes) {
            if (bytes == 0) return 'n/a';
            return (bytes / Math.pow(1024, 2)).toFixed(1);
        },

        upload: function () {
            var $this = this;

            if (!this.check()) {
                this.uploadFile.val("");
                return false;
            }

            this.resetForm();

            if ($this.isIE(7) || $this.isIE(8) || $this.isIE(9) || $this.settings.mode == 'from') {
                this.progress();
                this.uploadForm.submit();
            } else {
                var file_data = this.uploadFile.get(0).files;
                $.each(file_data, function (index, filedata) {
                    var form_data = new FormData();
                    var file_data = filedata;
                    var fileSize = $this.bytesToSize(file_data.size);

                    if (fileSize >= 300) {
                        $.dialog({
                            width: '250px',
                            height: "80px",
                            title: "提示",
                            icon: 'error.gif',
                            time: 3,
                            content: "<h2>" + '不能上传大于300M的文件' + "</h2>",
                            min: false,
                            max: false
                        });
                    } else {
                        var itype = $this.getItype();
                        var company_id = $this.getCompany_id()
                        form_data.append("uploadFile", file_data);
                        form_data.append("itype", itype);
                        if (company_id) {
                            form_data.append("company_id", company_id);
                        }
                        var loadingTime = $this.getSystemTime();
                        form_data.append("timestamp", loadingTime);
                        form_data.append("callbacker", $this.GUID);
                        document.nowUploader = $.data(document.body, $this.GUID);
                        document.nowUploader.loadingTime = loadingTime;
                        var files = $this.getFile();
                        var url = $this.getActionUrl();
                        $this.uploadView.show();
                        $this.uploadData(filedata);
                        $.ajax({
                            url: url,
                            data: form_data,
                            type: "POST",
                            dataType: "json",
                            processData: false,
                            contentType: false,
                            xhr: $this.uploadXHR,
                            success: function (res) {
                                var uploader = res.callbacker;
                                var data = res.data;
                                $wq.uploadCallback(uploader, data);
                                var timestamp = data.timestamp;
                                $this.delUploadingFilesByGroupId(timestamp);
                                console.log('已经上传成功啦');
                            }
                        })
                    }
                });
            }
        },

        uploadData: function (filedata) {
            var file_data = filedata;
            var uploader = document.nowUploader;
            var name = uploader.encodeFileName(file_data.name);
            var size = file_data.size;
            var time = uploader.loadingTime;
            var item_id = "" + time + name;
            var prepareFiles = {
                "name": name,
                itemId: "",
                groupId: time,
                status: 0,
                "size": size
            };
            this.addUploadingData(prepareFiles);
            var li = $('<li class="clearfix"></li>');
            li.attr("id", item_id);
            li.attr("groupid", time);
            var url;
            if (file_data.type == "image/jpeg" ||
                file_data.type == "image/png" ||
                file_data.type == "image/gif" ||
                file_data.type == "image/bmp" ||
                file_data.type == "image/x-icon") {
                url = window.URL.createObjectURL(file_data);

            } else {
                var ext = $wq.fileHandler.getFileExt(file_data.name);
                url = $wq.fileHandler.getFileBigIcon(ext);
            }

            var pro_div = $('<div class="pro_div"></div>');
            $('<img class="gg_box_dowimg" src="' + url + '"/>').appendTo(pro_div);
            var progress_div = $('<div class="progress_div"></div>');
            progress_div.attr("id", 'progress_div' + time);
            pro_div.append(progress_div);
            li.append(pro_div);
            if (!this.settings.noName) {
                $('<p class="ggbcpro"></p>').html(file_data.name).appendTo(li);
            }
            var progress_p = $('<p class="ggbcpro2"></p>');
            progress_p.attr("id", 'ggbcpro2' + time);
            progress_p.appendTo(li);
            this.uploadView.find("ul.file_view").prepend(li);
        },

        uploadXHR: function () {
            var uploader = document.nowUploader;
            var time = uploader.loadingTime;
            var xhr = $.ajaxSettings.xhr();
            xhr.upload.onprogress = function (e) {
                if (e.lengthComputable) {
                    var iloaded = e.loaded;
                    var iTotal = e.total;
                    var iPercentComplete = Math.round(e.loaded * 100 / e.total);
                    if (iPercentComplete > 0 && iPercentComplete < 95) {
                        $('#' + 'progress_div' + time).attr("style", "width:" + iPercentComplete.toString() + '%');
                        $('#' + 'ggbcpro2' + time).text('已经上传' + iPercentComplete.toString() + '%');
                    } else {
                        $('#' + 'progress_div' + time).attr("style", "width:95%");
                    }
                }
            };
            return xhr;
        },

        uploadCallBack: function (data) {
            var $this = this;
            var status = true;
            if (!data || data.errorMsg || data.errorCode) {
                status = false;
            }
            //var result = data.result;
            if (!data.result || data.result.length < 1)
                status = false;

            var result = data.result;
            if (status) {
                $this.uploadSucc(data);
            } else {
                $this.uploadFail(data);
            }
            var timestamp = data.timestamp;
            $this.romoveIframe(timestamp);
            $this.uploadFile.val("");
        },

        uploadFail: function (res) {
            if (!res) {
                this.showError("文件上传失败!");
                return;
            }

            var timestamp = res.timestamp;
            if (res.errorMsg || res.errorCode) {
                this.showError(res.errorMsg);
                this.cleanProgress(timestamp);
            }
        },

        uploadSucc: function (data) {
            var timestamp = data.timestamp;
            var result = data.result;
            this.loadData(result, timestamp);
            if (this.settings.afterUpload)
                this.settings.afterUpload.call(this, result);

        }

    });

    /**
     * 文件上传回调函数
     */
    $wq.uploadCallback = function (uploader, data) {
        WeqiaUploader.callBack(uploader, data);
    };

    /**
     * 创建文件上传控件
     */
    $.fn.weqiaUpload = function (options) {
        if (!this.length) {
            return this;
        }

        var uploaderArr = [];
        this.each(function (i, el) {
            var $this = $(el);
            var uploader = $.data(el, "uploader");
            if (!uploader) {
                options = $.extend(options, {
                    "uploadEl": el
                });
                uploader = new WeqiaUploader(options);
                $.data(el, "uploader", uploader);
                $.data(document.body, uploader.GUID, uploader);
            }
            uploaderArr[i] = uploader;
        });

        if (uploaderArr.length == 1)
            return uploaderArr[0];
        return uploaderArr;
    };

    /**
     * 创建文件上传控件
     */
    $wq.weqiaUpload = function (uploadEl, options) {
        return $(uploadEl).weqiaUpload(options);
    };

    /**
     * 重置上传控件
     */
    $.resetUploader = $wq.resetUploader = function (el) {
        var uploader = $.data($(el).get(0), "uploader");
        if (uploader != undefined && uploader)
            uploader.reset();
    };

    $wq.getUploader = function (target) {
        return $.data($(target).get(0), "uploader");
    };

    /**
     * file view plugin (文件视图插件) ========================
     */
    var WeqiaFileViewer = function (files, options) {
        var settings = {
            imageServer: "",
            showList: true, // 是否展示文件列表
            showNav: true, // 是否显示预览导航
            showMini: false, // 是否显示预览导航
            showSource: false, // 是否直接查看原图
            thumbnail: false, // 是否显示缩略图
            bth: 1,
            mth: 2,
            sth1: 3,
            sth2: 4,
            mWidth: 290,
            sWidth: 120,
            ssWidth: 80,
            playSimpl: false, // 播放器是否精简
            playWidth: 640, // 播放宽度
            playHeight: 360 // 播放高度
        };
        this.settings = $.extend(settings, options);
        this.handleFile(files);
        this.expand = false;
    };

    $.extend(WeqiaFileViewer.prototype, wqFileHandler);

    $.extend(WeqiaFileViewer.prototype, {

        choose: function (index) {
            var viewer = this.viewer;
            var image = this.imageFiles[index];
            if (image) {
                this.currentIndex = index;
                var mWidth = this.settings.mWidth;
                var url = image.url;
                var imgUrl = this.getSignUrl(url, this.settings.mth);
                var img = $('<img align="center" class="m_pic" src="' + imgUrl + '"/>');
                img.load(function () {
                    if (this.width > mWidth) {
                        $(this).attr("width", mWidth);
                    }
                    var data = {
                        width: this.width,
                        hight: this.height,
                        angle: 0
                    };
                    $(this).data("data", data);
                });

                var viewerExpand = viewer.children(".pic_viewer_expand");
                var view = viewerExpand.find(".pic_view .imgBox");
                view.empty();

                view.append(img);


                if (this.hasPicChooseBox) {
                    var pic_choose = viewerExpand.children(".pic_choose_box");
                    var img_a = pic_choose.find(".stage_box .choose_box li a");
                    img_a.removeClass("current");
                    img_a.eq(index).addClass("current");
                    this.shift(index + 1);
                }
            }
        },

        chooseNext: function () {
            var imgCnt = this.imageFiles.length;
            var chooseCnt = this.chooseCnt;
            if (imgCnt <= chooseCnt)
                return;

            var page = this.choosePage;
            var totalPage = Math.ceil(imgCnt / chooseCnt);
            if (page < totalPage) {
                ++page;
                var n = page * chooseCnt < imgCnt ? (page - 1) * chooseCnt : imgCnt - chooseCnt;

                this.chooseBoxShift(n);
                this.choosePage = page;
            }
        },

        choosePrev: function () {
            var imgCnt = this.imageFiles.length;
            var chooseCnt = this.chooseCnt;
            if (imgCnt <= chooseCnt)
                return;

            var page = this.choosePage;
            var totalPage = Math.ceil(imgCnt / chooseCnt);
            if (page > 1) {
                --page;
                var n = (page - 1) * chooseCnt;

                this.chooseBoxShift(n);
                this.choosePage = page;
            }
        },

        expandImageView: function () {
            var viewer = this.viewer;
            var viewerExpand = viewer.children(".pic_viewer_expand");
            var viewerList = viewer.children(".pic_viewer_list");
            var $this = this;
            if (!viewerExpand.length) {
                viewerExpand = $('<div class="pic_viewer_expand" style="display:none;"></div>');
                if (viewerList.length)
                    viewerList.after(viewerExpand);
                else
                    viewer.append(viewerExpand);
            } else {
                viewerExpand.children().remove();
            }
            var pic_tools = $('<div class="pic_tools"></div>');
            viewerExpand.append(pic_tools);
            var hide_btn = $('<a class="hideImg" href="javascript:void(0)" title="收起">收起</a>');
            pic_tools.append(hide_btn);
            var source_btn = $('<a class="sourceImg" href="javascript:void(0)" title="查看原图">查看原图</a>');
            pic_tools.append(source_btn);
            var right_btn = $('<a class="rigthImg" href="javascript:void(0)" title="向右转">向右转</a>');
            pic_tools.append(right_btn);
            var left_btn = $('<a class="leftImg" href="javascript:void(0)" title="向左转">向左转</a>');
            pic_tools.append(left_btn);

            var view_div = $('<div class="pic_view" style="text-align:center;"></div>');
            var mWidth = this.settings.mWidth;
            view_div.css({
                "width": mWidth
            });
            viewerExpand.append(view_div);
            var small_btn = $('<div class="imgBox" style="position: relative;text-align: center;"></div>');
            //small_btn.css({"width":mWidth});
            small_btn.mousemove(function (event) {
                var l = small_btn.offset().left;
                var x = event.pageX;
                var index = $this.currentIndex;
                var imgCnt = $this.imageFiles.length;
                if (x - l < 100 && index > 0) {
                    if (!small_btn.hasClass("leftcursor")) {
                        small_btn.removeClass("rightcursor");
                        small_btn.removeClass("smallcursor");
                        small_btn.addClass("leftcursor");
                        small_btn.unbind("click").click(function () {
                            var index = $this.currentIndex;
                            index--;
                            $this.choose(index);
                        });
                    }
                } else if (l + mWidth - x < 100 && index < imgCnt - 1) {
                    if (!small_btn.hasClass("rightcursor")) {
                        small_btn.removeClass("leftcursor");
                        small_btn.removeClass("smallcursor");
                        small_btn.addClass("rightcursor");
                        small_btn.unbind("click").click(function () {
                            var index = $this.currentIndex;
                            index++;
                            $this.choose(index);
                        });
                    }
                } else {
                    if (!small_btn.hasClass("smallcursor")) {
                        small_btn.removeClass("rightcursor");
                        small_btn.removeClass("leftcursor");
                        small_btn.addClass("smallcursor");
                        small_btn.unbind("click").click(function () {
                            $this.retract();
                            viewerList.show();
                        });
                    }
                }
            });
            view_div.append(small_btn);

            hide_btn.click(function () {
                $this.retract();
                viewerList.show();
            });

            source_btn.click(function () {
                var index = $this.currentIndex;
                var img = $this.imageFiles[index];
                var url = img.url;
                $this.sourceImageView(url);
            });

            right_btn.click(function () {
                var m_pic = view_div.find(".m_pic");
                $this.rotateR(m_pic);
            });

            left_btn.click(function () {
                var m_pic = view_div.find(".m_pic");
                $this.rotateL(m_pic);
            });

            if (!$.support.leadingWhitespace) {
                right_btn.hide();
                left_btn.hide();
            }
            if (this.settings.showNav == true) {
                this.viewChooseBox();
            }

            this.currentIndex = 0;

            return viewerExpand;
        },

        sourceImageView: function (url) {
            var $this = this;
            var imgUrl = $this.getSignUrl(url, $this.settings.bth);
            var down_url = $this.getSignUrlByDownload(url, $this.settings.bth);
            //$('body').scrollTop(0);
            // 新建弹出层
            var sourceImg = $('<div class="sourceimg"></div>');
            // 背景
            var sourceBg = $('<div class="sourcebg"></div>');
            sourceImg.append(sourceBg);
            // 图片容器
            var sourceBody = $('<div class="sourcebody"></div>');
            sourceImg.append(sourceBody);
            // 图片
            var sourceUrl = $('<img>');
            sourceUrl.attr('src', imgUrl);
            sourceBody.append(sourceUrl);
            //控制栏
            var sourceControl = $('<div class="sourcecontrol"></div>');
            sourceImg.append(sourceControl);
            var down_btn = $('<a class="down_btn"></a>');
            down_btn.attr('href', down_url)
            sourceControl.append(down_btn);
            var left_btn = $('<a class="sourceleft" href="javascript:void(0)" title="向左转"></a>');
            sourceControl.append(left_btn);
            var right_btn = $('<a class="sourceright" href="javascript:void(0)" title="向右转"></a>');
            sourceControl.append(right_btn);
            var dataAngle = {
                angle: 0
            };
            sourceUrl.data("data", dataAngle);
            right_btn.click(function () {
                var data = sourceUrl.data("data");
                var sourceUrlAngle = data.angle;
                sourceUrlAngle = (sourceUrlAngle == 0 ? 360 : sourceUrlAngle);
                sourceUrlAngle -= 90;
                sourceUrlAngle = (sourceUrlAngle == 360 ? 0 : sourceUrlAngle);
                sourceUrl.rotate({
                    angle: sourceUrlAngle
                });
                data.angle = sourceUrlAngle;
            });
            left_btn.click(function () {
                var data = sourceUrl.data("data");
                var sourceUrlAngle = data.angle;
                sourceUrlAngle = (sourceUrlAngle == 0 ? 360 : sourceUrlAngle);
                sourceUrlAngle += 90;
                sourceUrlAngle = (sourceUrlAngle == 360 ? 0 : sourceUrlAngle);
                sourceUrl.rotate({
                    angle: sourceUrlAngle
                });
                data.angle = sourceUrlAngle;
            });
            if (!$.support.leadingWhitespace) {
                sourceControl.hide();
            }
            // 关闭弹出层
            var sourceClose = $('<a class="sourceclose"></a>');
            sourceBody.append(sourceClose);
            sourceClose.click(function () {
                sourceImg.remove();
            });
            // 初始化图片容器宽度 居中
            sourceUrl.load(function () {
                var clienteidth = document.body.clientWidth;
                var scrollTop = $('body').scrollTop() || $(window).scrollTop();
                $('body').append(sourceImg);
                var topHeight = scrollTop + 100;
                var leftWidth = (clienteidth - sourceUrl.width()) / 2;
                sourceBody.css({
                    'top': topHeight,
                    'left': leftWidth,
                    'width': sourceUrl.width()
                });
            });
            // 兼容 firefox 禁止图片下载
            if (browser.versions.gecko) {
                sourceUrl.mousedown(function (e) {
                    e = e || event;
                    e.preventDefault()
                })
            }
            ;
            // 移动
            sourceBody.mousedown(function (e) {
                e = e || event;
                var tempx = e.clientX - sourceBody.offset().left;
                var tempy = e.clientY - sourceBody.offset().top;
                sourceBody.mousemove(function (e) {
                    e = e || event;
                    e.preventDefault()
                    sourceBody.css({
                        'left': e.clientX - tempx,
                        'top': e.clientY - tempy
                    });
                });
                sourceBody.mouseup(function () {
                    sourceBody.off("mousemove");
                });
            });
            // 滚轮放大缩小
            sourceBody.bind("mousewheel", function (e) {
                var e = e || event;
                var clienteidth = document.body.clientWidth;
                var leftWidth = (clienteidth - sourceUrl.width()) / 2;
                var v = e.originalEvent.wheelDelta || e.originalEvent.detail;
                if (v > 0) {
                    sourceBody.width(sourceBody.width() * 1.1);
                    sourceBody.css({
                        'left': leftWidth
                    });
                } else {
                    sourceBody.width(sourceBody.width() * 0.9);
                    sourceBody.css({
                        'left': leftWidth
                    });
                }
                window.event.returnValue = false;
                return false;
            });
            if (browser.versions.gecko) {
                var clienteidth = document.body.clientWidth;
                sourceBody.bind("DOMMouseScroll", function (e) {
                    if (e.originalEvent.detail < 0) {
                        var leftWidth = (clienteidth - sourceUrl.width()) / 2;
                        sourceBody.width(sourceBody.width() * 1.1);
                        sourceBody.css({
                            'left': leftWidth
                        });
                    } else {
                        var leftWidth = (clienteidth - sourceUrl.width()) / 2;
                        sourceBody.width(sourceBody.width() * 0.9);
                        sourceBody.css({
                            'left': leftWidth
                        });
                    }
                    e.preventDefault()
                });
            }
        },

        expandPlayView: function () {
            var viewer = this.viewer;
            var viewerExpand = viewer.children(".pic_viewer_expand");
            var viewerList = viewer.children(".pic_viewer_list");
            var $this = this;
            if (!viewerExpand.length) {
                viewerExpand = $('<div class="pic_viewer_expand" style="display:none;"></div>');
                if (viewerList.length)
                    viewerList.after(viewerExpand);
                else
                    viewer.append(viewerExpand);
            } else {
                viewerExpand.children().remove();
            }
            var pic_tools = $('<div class="pic_tools"></div>');
            viewerExpand.append(pic_tools);
            var hide_btn = $('<a class="hideImg" href="javascript:void(0)" title="收起">收起</a>');
            pic_tools.append(hide_btn);
            var view_div = $('<div class="pic_view" style="text-align:center;"></div>');

            //			var mWidth = this.settings.mWidth;
            //			view_div.css({"width":mWidth});
            //
            viewerExpand.append(view_div);

            var jp_container = this.jplayer();
            view_div.append(jp_container);

            var jplayer = jp_container.find(".jp-jplayer");
            hide_btn.click(function () {
                $this.retract();
                viewerList.show();
            });
            var up_btn = jp_container.find(".jp-slideUp");
            if (up_btn.length) {
                up_btn.click(function () {
                    $this.retract();
                    viewerList.show();
                });
            }

            return viewerExpand;
        },

        handleFile: function (files) {

            var imageFiles = [];
            var audioFiles = [];
            var videoFiles = [];
            var otherFiles = [];

            if (files) {
                if (!$.isArray(files))
                    files = [files];
                var $this = this;
                $.each(files, function (i, file) {
                    if ($this.isImage(file.type, file.mime))
                        imageFiles.push(file);
                    else if ($this.isAudio(file.type, file.mime))
                        audioFiles.push(file);
                    else if ($this.isVideo(file.type, file.mime))
                        videoFiles.push(file);
                    else
                        otherFiles.push(file);
                });
            }

            this.imageFiles = imageFiles;
            this.audioFiles = audioFiles;
            this.videoFiles = videoFiles;
            this.otherFiles = otherFiles;
            if (imageFiles.length > 1 || videoFiles.length > 0) {
                this.smallImg = true;
            } else {
                this.smallImg = false;
            }

        },

        isExpend: function () {
            return this.expand;
        },

        jplayer: function () {
            var jp_container = $('<div id="jp_container_1" class="jp-video jp-video-360p" style="margin:0 auto;"></div>');
            var playWidth = this.settings.playWidth;
            jp_container.css({
                "width": playWidth
            });
            var single = $('<div class="jp-type-single"></div>');
            jp_container.append(single);

            var jplayer = $('<div id="jquery_jplayer_1" class="jp-jplayer"></div>');
            single.append(jplayer);

            var gui = $('<div class="jp-gui"></div>');
            single.append(gui);
            gui.append('<div class="jp-video-play"><a href="javascript:;" class="jp-video-play-icon" tabindex="1">play</a></div>');
            var jp_interface = $('<div class="jp-interface"></div>');
            gui.append(jp_interface);
            var holder = $('<div class="jp-controls-holder"></div>');
            jp_interface.append(holder);
            var progress = $('<div class="jp-progress"></div>');
            holder.append(progress);
            var seek_bar = $('<div class="jp-seek-bar"><div class="jp-play-bar"></div></div>');
            progress.append(seek_bar);
            holder.append('<div class="jp-current-time"></div>');
            holder.append('<div class="jp-duration"></div>');
            var toggles = $('<ul class="jp-toggles"></ul>');
            if (this.settings.playSimpl == true) {
                toggles.css({
                    "width": "30px",
                    "right": "5px"
                });
            }
            holder.append(toggles);
            if (this.settings.playSimpl == false) {
                var up_btn = $();
                toggles.append('<li><a title="收起视屏" tabindex="1" class="jp-slideUp" href="javascript:;">收起</a></li>');

            }
            toggles.append('<li><a href="javascript:;" class="jp-full-screen" tabindex="1" title="full screen">full screen</a></li>');
            toggles.append('<li><a href="javascript:;" class="jp-restore-screen" tabindex="1" title="restore screen">restore screen</a></li>');
            if (this.settings.playSimpl == false) {
                toggles.append('<li><a href="javascript:;" class="jp-repeat" tabindex="1" title="repeat">repeat</a></li>');
                toggles.append('<li><a href="javascript:;" class="jp-repeat-off" tabindex="1" title="repeat off">repeat off</a></li>');
            }
            var controls = $('<ul class="jp-controls"></ul>');
            if (this.settings.playSimpl == true) {
                controls.css({
                    "width": "40px"
                });
            }
            holder.append(controls);
            controls.append('<li><a href="javascript:;" class="jp-play" tabindex="1">play</a></li>');
            controls.append('<li><a href="javascript:;" class="jp-pause" tabindex="1">pause</a></li>');
            if (this.settings.playSimpl == false) {
                controls.append('<li><a href="javascript:;" class="jp-stop" tabindex="1">stop</a></li>');
            }
            controls.append('<li><a href="javascript:;" class="jp-mute" tabindex="1" title="mute">mute</a></li>');
            controls.append('<li><a href="javascript:;" class="jp-unmute" tabindex="1" title="unmute">unmute</a></li>');
            controls.append('<li><a href="javascript:;" class="jp-volume-max" tabindex="1" title="max volume">max volume</a></li>');
            holder.append('<div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div>');

            var solution = $('<div class="jp-no-solution"></div>');
            single.append(solution);
            solution.append('<span>Update Required</span>');
            solution.append('To play the media you will need to either update your browser to a recent version or update your <a href="http://get.adobe.com/flashplayer/" target="_blank">Flash plugin</a>.');


            return jp_container;
        },

        loadAudioFileList: function () {
            var audioFiles = this.audioFiles;
            if (audioFiles && audioFiles.length > 0) {
                var viewer = this.viewer;

                var $this = this;
                $.each(audioFiles, function (i, file) {
                    if (file.playTime || file.playTime == 0) {
                        var file_view = $('<span class="item-player-inner"> </span> ');
                        viewer.append(file_view);

                        var file_span = $('<span class="item-player-length">' + file.playTime + '"</span>');
                        file_view.append(file_span);

                        var file_play = $('<span class="mp3_player"> </span>');
                        file_view.append(file_play);

                        var url = file.url;

                        var mp3_url = $this.getSuffixSignUrl(url);
                        //var jplayer_mp3 = $(this).find(".mp3_player");

                        file_play.jPlayer({
                            ready: function (event) {
                                $(this).jPlayer("setMedia", {
                                    mp3: mp3_url
                                });
                            },
                            swfPath: "js",
                            supplied: "mp3",
                            ended: function () {
                                file_view.removeClass("item-btn-pause");
                            },
                            play: function () {
                                $(this).jPlayer("pauseOthers", 0);
                            },
                            error: function (event) {
                                if ($(this.parentElement).hasClass("item-btn-pause")) {
                                    console.log("错误");
                                    this.click();
                                }
                            }
                        });

                        file_view.click(function () {
                            var item_bg = $(this).hasClass("item-btn-pause");

                            if (item_bg) {
                                file_view.removeClass("item-btn-pause");
                                file_play.jPlayer("pause");
                            } else {
                                $(".item-player-inner").removeClass("item-btn-pause");
                                file_view.addClass("item-btn-pause");
                                file_play.jPlayer("play");
                            }
                            ;

                        });
                    }
                });
            }

        },

        loadImageFileList: function (setviewer) {

            var imageFiles = this.imageFiles;
            if (imageFiles && imageFiles.length > 0) {
                var viewer = this.viewer;
                var viewer_list = this.viewList();
                var pic_list = viewer_list.children(".pic_list");

                var sWidth;
                if (this.smallImg) {
                    sWidth = this.settings.ssWidth;
                } else {
                    sWidth = this.settings.sWidth;
                }
                var showMini = this.settings.showMini;
                var thumbnail = this.settings.thumbnail;
                var $this = this;
                var finish_count = 0;
                $.each(imageFiles, function (i, file) {
                    var pic_url;
                    if (thumbnail) {
                        pic_url = appServer + '/frontSystem/images/shoulurtu.png'
                    } else {
                        if ($this.smallImg) {
                            pic_url = $this.getSignUrl(file.url, $this.settings.sth2);
                        } else {
                            pic_url = $this.getSignUrl(file.url, $this.settings.sth1);
                        }
                    }
                    file.smallUrl = pic_url;
                    var pic_li = $('<li></li>');
                    if (thumbnail) {
                        pic_li.css('margin', 0)
                    }
                    ;
                    pic_list.append(pic_li);

                    var big_btn = $('<div class="bigcursor"></div>');
                    pic_li.append(big_btn);
                    //20150529  隐藏图片class
                    var pic_img = $('<img class="pic_img_hide_start" alt="" src="' + pic_url + '"/>');
                    pic_img.load(function () {
                        pic_img.hide();
                        if (thumbnail) {
                            $(this).attr("width", 20);
                            $(this).attr("height", 16);
                        } else {
                            if (showMini) {
                                $(this).attr("width", 45);
                                $(this).attr("height", 45);
                            } else {
                                if (this.width > this.height) {
                                    $(this).attr("width", sWidth);
                                } else {
                                    $(this).attr("height", sWidth);
                                }
                            }
                        }
                        //20150529 load中  设置好长宽后显示
                        pic_img.show();
                    });
                    pic_img.data("url", file.url);
                    big_btn.append(pic_img);

                    big_btn.click(function () {
                        if ($this.settings.showSource) {
                            $this.sourceImageView(file.url);
                        } else {
                            $this.preview(i);
                        }
                    });

                });

            }
        },

        loadOtherFileList: function () {
            var otherFiles = this.otherFiles;
            if (otherFiles && otherFiles.length > 0) {
                var viewer = this.viewer;
                var $this = this;
                $.each(otherFiles, function (i, file) {
                    var ext = $this.getFileExt(file.name);
                    var icon = $this.getFileIcon(ext);
                    //var file_url = $this.getSignUrl(file.url, $this.settings.sth1);
                    var file_view = $('<div class="file_view weibo_file01 clearfix"></div>');
                    viewer.append(file_view);
                    var file_li = $('<div class="weibo_file02"></div>');
                    file_view.append(file_li);

                    var file_icon = $('<img alt="图示" src="' + icon + '">');
                    file_li.append(file_icon);

                    file_view.append('<p class="weibo_file03">' + file.name + '<span class="kb_nffed">(' + file.fileSize + 'KB)</span></p>');
                    var down_btn = $('<a class="down_faridl" title="" href="javascript:void(0)">下载</a>');
                    file_view.append('<span class="fun_aridl"></span>');
                    file_view.find("span.fun_aridl").append(down_btn);
                    down_btn.click(function () {
                        var url = file.url;
                        var file_url = $this.getSignUrlByDownload(url, $this.settings.sth1);
                        window.open(file_url);
                    });


                    var canPreview = $wq.preview.canPreviewFileMimes(file.mime, file.name);

                    if (canPreview && file.fileSize <= 51200) { //50M
                        var preview_btn = $('<a class="original_faridl" href="javascript:void(0)">预览</a>');
                        file_view.append('<span class="preview_aridl"></span>');
                        file_view.find("span.preview_aridl").append(preview_btn);
                        preview_btn.click(function () {
                            var url = "/front/preview.htm";
                            window.open(url + "?query.fileUrl=" + file.url);
                        });
                    }
                });

            }
        },

        loadVideoFileList: function () {
            var videoFiles = this.videoFiles;
            if (videoFiles && videoFiles.length > 0) {
                var viewer = this.viewer;
                var viewer_list = this.viewList();
                var pic_list = viewer_list.children(".pic_list");

                var sWidth = this.settings.ssWidth;

                var $this = this;
                $.each(videoFiles, function (i, file) {
                    var play_img_url = "/common/images/file_video.png";
                    var pic_url = "/common/images/file_video.png";
                    if (file.preFileUrl) {
                        pic_url = $this.getSignUrl(file.preFileUrl, $this.settings.sth2);
                        play_img_url = "/common/images/file_video_new.png";
                    }

                    var pic_li = $('<li></li>');
                    pic_list.append(pic_li);
                    var play_btn = $('<div class="video_view"></div>');
                    pic_li.append(play_btn);
                    var play_img = $('<img class="video_view_img1" width="' + sWidth + '" height="' + sWidth + '" alt="" src="' + play_img_url + '"/>');
                    play_btn.append(play_img);
                    var pic_img = $('<img width="' + sWidth + '" height="' + sWidth + '" alt="" src="' + pic_url + '"/>');
                    pic_img.data("url", file.url);
                    play_btn.append(pic_img);

                    play_btn.click(function () {
                        $this.play(i);
                    });
                });
            }
        },

        play: function (index) {
            var viewer = this.viewer;
            var viewerExpand = this.expandPlayView();
            var viewerList = viewer.children(".pic_viewer_list");
            var playWidth = this.settings.playWidth;
            var playHeight = this.settings.playHeight;

            if (!index)
                index = 0;
            var videoFiles = this.videoFiles;
            if (!videoFiles || !videoFiles.length)
                return;
            var video = videoFiles[index];
            if (!video)
                return;
            var url = this.getSignUrl(video.url);
            if (!url)
                return;

            viewerExpand.show();
            viewerList.hide();
            this.expand = true;

            var jplayer = viewerExpand.find(".jp-jplayer");
            jplayer.jPlayer({
                ready: function () {
                    $(this).jPlayer("setMedia", {
                        m4v: url
                    }).jPlayer("play");
                },
                swfPath: "common/js/jPlayer/",
                supplied: "m4v",
                size: {
                    width: playWidth,
                    height: playHeight,
                    cssClass: "jp-video-360p"
                },
                smoothPlayBar: true,
                keyEnabled: true,
                remainingDuration: true,
                toggleDuration: true
            });
        },

        preview: function (index) {
            var viewer = this.viewer;
            var viewerExpand = this.expandImageView();
            var viewerList = viewer.children(".pic_viewer_list");
            viewerExpand.show();
            viewerList.hide();
            this.expand = true;

            if (!index)
                index = 0;
            this.choose(index);
        },

        retract: function () {
            var viewer = this.viewer;
            var viewerExpand = viewer.children(".pic_viewer_expand");
            var viewerList = viewer.children(".pic_viewer_list");
            var jplayer = viewer.find(".jp-jplayer");
            if (jplayer.length)
                jplayer.jPlayer("clearMedia");

            viewerExpand.children().remove();
            viewerExpand.hide();
            //viewerList.show();
            this.expand = false;
        },

        rotate: function (imgTag, angle) {
            var parent = imgTag.parent();
            var mWidth = this.settings.mWidth;
            if (parent.hasClass("imgBox")) {
                parent.append('<div style="position: relative; text-align: center; "></div>');
                parent = parent.children("div");
                parent.css("width", mWidth);
                parent.append(imgTag);

            }

            var data = imgTag.data("data");
            var width = data.width;
            var hight = data.hight;

            angle = (angle == 360 ? 0 : angle);

            var imgWidth = width;
            var imgHight = hight;
            var div_hight = hight;
            if (angle == 90 || angle == 270) {
                if (hight > width) {
                    imgWidth = mWidth / hight * width;
                    imgHight = mWidth;
                }
                div_hight = imgWidth;
            }
            var imgTop = (div_hight - imgHight) / 2;
            var imgLeft = (mWidth - imgWidth) / 2;
            imgTag.attr("width", imgWidth);
            imgTag.attr("height", imgHight);
            imgTag.css({
                "position": "absolute",
                "top": imgTop,
                "left": imgLeft
            });
            parent.css("height", div_hight);
            imgTag.rotate({
                angle: angle
            });
            data.angle = angle;
        },

        rotateL: function (imgTag) {
            var data = imgTag.data("data");
            var angle = data.angle;
            angle = (angle == 0 ? 360 : angle);
            angle -= 90;
            this.rotate(imgTag, angle);
        },

        rotateR: function (imgTag) {
            var data = imgTag.data("data");
            var angle = data.angle;
            angle = (angle == 360 ? 0 : angle);
            angle += 90;
            this.rotate(imgTag, angle);
        },

        chooseBoxShift: function (n) {
            var m_left = 59 * n;
            var choose_box = this.viewer.find(".choose_box");
            choose_box.css({
                "margin-left": -m_left
            });
        },

        shift: function (i) {
            var chooseCnt = this.chooseCnt;
            var imgCnt = this.imageFiles.length;
            if (imgCnt < chooseCnt)
                return;
            var threshold = Math.ceil(chooseCnt / 2);
            if (threshold <= i) {
                var n = i - threshold;
                if (n > imgCnt - chooseCnt)
                    n = imgCnt - chooseCnt;
                this.chooseBoxShift(n);
                this.choosePage = Math.ceil(n / chooseCnt) + 1;
            }
        },

        view: function (files, setviewer) {
            var viewer = this.viewer = $('<div class="pic_viewer"></div>');
            var $this = this;
            if (this.settings.showList == true) {
                this.loadImageFileList(setviewer);
                this.loadAudioFileList();
                this.loadOtherFileList();
                this.loadVideoFileList();
            }
            return viewer;
        },

        viewChooseBox: function () {
            var imageFiles = this.imageFiles;
            if (imageFiles.length > 1) {
                this.hasPicChooseBox = true;

                var viewerExpand = this.viewer.children(".pic_viewer_expand");
                var mWidth = this.settings.mWidth;
                var box_width = mWidth - 27;
                this.chooseCnt = Math.ceil(box_width / 59);
                this.choosePage = 1;

                var pic_choose = $('<div class="pic_choose_box"></div>');
                pic_choose.css({
                    "width": mWidth
                });
                viewerExpand.append(pic_choose);
                var prev_btn = $('<a class="arrow_left_small btn_pic_prevdis S_bg2" title="上一页" href="javascript:void(0);"><em class="ico_pic_prev S_txt3"><</em></a>');
                pic_choose.append(prev_btn);
                var stage_box = $('<div class="stage_box"></div>');
                stage_box.css({
                    "width": box_width
                });
                pic_choose.append(stage_box);
                var choose_box = $('<ul class="choose_box"></ul>');
                stage_box.append(choose_box);

                var $this = this;
                $.each(imageFiles, function (i, file) {
                    var img_li = $('<li></li>');
                    choose_box.append(img_li);
                    var img_a = $('<a href="javascript:void(0);"></a>');
                    img_li.append(img_a);
                    var imgUrl = file.smallUrl;
                    var s_img = $('<img src="' + imgUrl + '"/>');
                    img_a.append(s_img);
                    img_a.click(function () {
                        $this.choose(i);
                    });
                });

                var next_btn = $('<a class="arrow_right_small btn_pic_prevdis S_bg2" title="上一页" href="javascript:void(0);"><em class="ico_pic_prev S_txt3">></em></a>');
                pic_choose.append(next_btn);

                prev_btn.click(function () {
                    $this.choosePrev();
                });

                next_btn.click(function () {
                    $this.chooseNext();
                });
            }
        },

        viewList: function () {
            var viewer = this.viewer;
            var viewerList = viewer.children(".pic_viewer_list");
            if (!viewerList.length) {
                viewerList = $('<div class="pic_viewer_list"></div>');
                viewer.append(viewerList);
                var pic_list = $('<ul class="pic_list"></ul>');
                viewerList.append(pic_list);

                if (this.smallImg) {
                    var sWidth = this.settings.ssWidth;
                    var group_width = (sWidth + 5) * 3;
                    /**
                     * 20150305 viewerList 不限制长度 test
                     */
                    //viewerList.css("width", group_width);
                }

            }
            return viewerList;
        }
    });

    $wq.fileviewer = function (files, options) {
        return new WeqiaFileViewer(files, options);
    }


    /**
     * pagination plugin (分页插件)
     * ======================================
     * 参数说明:
     * id: 实例ID，可WeqiaPage.get()查找实例。
     * selector:
     * schFun: 分页查询函数。
     * schForm:支持表单查询。
     * pagingMode: 分页模式。目前支持tradition(传统分页)。
     * pagination: 显示页码个数,默认为5个。
     * flPage:是否首尾页标,默认显示。
     * npPage:是否上下页标,默认显示。
     *
     * 示例:
     * options = {
     * 	id: "weqiapager",
     * 	schFun: funciton(){},
     * 	schForm: "#schForm",
     *  pagingMode: "tradition",
     *  pagination: 5,
     *  flPage: true,
     *  npPage: false
     * `}`
     *
     */
    var WeqiaPage = function (options) {

        var defaults = {
            schFun: null,
            /* 查询函数   */
            pagingMode: "tradition",
            /* 分页模式。目录支持tradition(传统分页)*/
            pageSize: 10,
            /* 每页记录数   */
            pageSizeSet: true,
            /* 设置每页记录数   */
            pagination: 5,
            /* 显示页码个数   */
            formable: false,
            /* 是否响应表单form */
            pageTotalItem: false,
            /* 是否查询总条数 默认关闭*/
            schForm: null,
            /* 查询form对象。在formable为true生效 */
            currPageEl: null,
            /* 表单元素:当前页。在formable为true生效 */
            totalPageEl: null,
            /* 表单元素:共页数。在formable为true生效 */
            flPage: true,
            /* 是否首尾页标   */
            npPage: true,
            /* 是否上下页标   */
            htNum: true,
            /* 是否显示首尾数字页标*/
            autoHide: true,
            /* 当没有数据的时候是否自动隐藏   */
            margin: null,
            /* 间距   */
            nvgClass: "nvg",
            /* 分页导航条样式  */
            flBtnClass: "btnPage",
            /* 首尾btn样式  */
            npBtnClass: "btnPage",
            /* 上下btn样式  */
            numBtnClass: "",
            /* 页码btn样式  */
            activeClass: "current",
            /* 页码激活样式  */
            omitBtnClass: "" /* 省略btn样式  */
        };

        this.settings = $.extend(true, {}, defaults, options);
        this.pageInfo = {
            page: 1,
            totalPage: 1,
            totalSize: 0,
            totalItem: 0,
            pageSize: 10,
            pagination: 5
        };

        if (this.settings.pageSize)
            this.pageInfo.pageSize = this.settings.pageSize;
        if (this.settings.pagination < 5)
            this.settings.pagination = 5;
        if (this.settings.pagination)
            this.pageInfo.pagination = this.settings.pagination;


        if (this.settings.formable === true) {
            var schForm = $(this.settings.schForm);
            if (!schForm.length) {
                this.schForm = schForm;
                var currPageEl = $(this.settings.currPageEl);
                if (currPageEl.length) {
                    var val = parseInt(currPageEl.val());
                    if (typeof val === "number")
                        this.setCurrentPage(val);
                } else {
                    currPageEl = $('<input type="hidden" name="query.currentPage" value="' + this.getCurrentPage() + '"/>');
                    schForm.append(currPageEl);
                }
                this.currPageEl = currPageEl;

                var totalPageEl = $(this.settings.totalPageEl);
                if (totalPageEl.length) {
                    var val = parseInt(totalPageEl.val());
                    if (typeof val === "number")
                        this.setTotalPage(val);
                } else {
                    totalPageEl = $('<input type="hidden" name="query.totalPage" value="' + this.getTotalPage() + '"/>');
                    schForm.append(totalPageEl);
                }
                this.totalPageEl = totalPageEl;

            } else {
                this.settings.formable = false;
            }
        }

        var id = "pager";
        if (this.settings.id)
            id = this.settings.id;
        $.data(document.body, id, this);
    };

    $.extend(WeqiaPage.prototype, {

        createActiveBtn: function (num) {
            var active_btn = $('<span>' + num + '</span>');
            active_btn.data('pagination', num);
            if (this.settings.activeClass)
                active_btn.addClass(this.settings.activeClass);
            return active_btn;
        },

        createFirstBtn: function () {
            var first_page = $('<a href="javascript:void(0)">首页</a>');
            first_page.data('pagination', 'first');
            if (this.settings.flBtnClass)
                first_page.addClass(this.settings.flBtnClass);
            if (this.isFirstPage())
                first_page.css({
                    'cursor': 'default',
                    'color': '#aaaaaa'
                });
            return first_page;
        },

        createNextBtn: function () {
            var next_page = $('<a href="javascript:void(0)" class="nextPage">下一页</a>');
            next_page.data('pagination', 'next');
            if (this.settings.npBtnClass)
                next_page.addClass(this.settings.npBtnClass);
            if (this.isLastPage())
                next_page.css({
                    'cursor': 'default',
                    'color': '#aaaaaa'
                });
            return next_page;
        },

        createLastBtn: function () {
            var last_page = $('<a href="javascript:void(0)">尾页</a>');
            last_page.data('pagination', 'last');
            if (this.settings.flBtnClass)
                last_page.addClass(this.settings.flBtnClass);
            if (this.isLastPage())
                last_page.css({
                    'cursor': 'default',
                    'color': '#aaaaaa'
                });
            return last_page;
        },

        createPageSize: function (val) {
            var Pagediv = $('<div class="Pagediv"><div>');
            var Pagespan = $('<span>每页</span>');
            Pagediv.append(Pagespan);
            var Pagesize = $('<select></select>');
            Pagesize.append('<option value="10">10</option>',
                '<option value="20">20</option>',
                '<option value="30">30</option>',
                '<option value="50">50</option>',
                '<option value="100">100</option>');
            var PageVal = Pagesize.val(val);
            Pagesize.data('pagination', 'pagesize');
            Pagediv.append(Pagesize);
            var Pagespan = $('<span>行</span>');
            Pagediv.append(Pagespan);
            return Pagediv;
        },

        createNumPage: function (num) {
            var num_btn = $('<span style="margin:0 10px" href="javascript:void(0)">' + num + '</span>');
            num_btn.data('pagination', num);
            return num_btn;
        },

        createNumBtn: function (num) {
            var num_btn = $('<a href="javascript:void(0)">' + num + '</a>');
            num_btn.data('pagination', num);
            if (this.settings.numBtnClass)
                num_btn.addClass(this.settings.numBtnClass);
            return num_btn;
        },

        createOmitBtn: function () {
            var omit_btn = $('<span>...</span>');
            if (this.settings.omitBtnClass)
                omit_btn.addClass(this.settings.omitBtnClass);
            return omit_btn;
        },

        createPrevBtn: function () {
            var prev_page = $('<a href="javascript:void(0)">上一页</a>')
            prev_page.data('pagination', 'prev');
            if (this.settings.npBtnClass)
                prev_page.addClass(this.settings.npBtnClass);
            if (this.isFirstPage())
                prev_page.css({
                    'cursor': 'default',
                    'color': '#aaaaaa'
                });
            return prev_page;
        },

        autoHide: function () {
            if (this.settings.autoHide == true) {
                if (!this.pageInfo.totalItem || this.pageInfo.totalItem == 0)
                    this.hide();
            }
        },

        getCurrentPage: function () {
            return this.pageInfo.page;
        },

        getAjaxCurrentPage: function () {
            var page;
            page = this.pageInfo.page;
            //文件分页特殊处理
            if (this.parentEl) {
                if (this.parentEl.find('.list-li').length == 1) {
                    page = parseInt(page) - 1
                }
            }
            return page;
        },

        getCurrentpageSize: function () {
            return this.pageInfo.pageSize;
        },
        getPagination: function () {
            return this.pageInfo.pagination;
        },

        getTotalPage: function () {
            return this.pageInfo.totalPage;
        },

        hide: function () {
            this.body.hide();
        },

        html: function () {
            var totalPage = this.getTotalPage();
            var page = this.getCurrentPage();
            var pagination = this.getPagination();

            var pageSize = this.getCurrentpageSize();
            var $this = this;

            var rtPagination = 0,
                ltPagination = 0;
            var dynamic = false;

            if (pagination === "all")
                pagination = totalPage;
            if (totalPage > pagination) {
                dynamic = true;
                if (this.settings.htNum === true) {
                    ltPagination = rtPagination = parseInt((pagination - 2) / 2);
                    if ((page - 1) <= ltPagination) {
                        ltPagination = page - 2;

                        rtPagination = rtPagination * 2 - ltPagination;
                        ltPagination = (ltPagination < 0 ? 0 : ltPagination);
                    } else if (page >= (totalPage - 1 - rtPagination)) {
                        rtPagination = totalPage - 1 - page;

                        ltPagination = ltPagination * 2 - rtPagination;
                        rtPagination = (rtPagination < 0 ? 0 : rtPagination);
                    }
                } else {
                    ltPagination = rtPagination = parseInt(pagination / 2);
                    if (page <= ltPagination) {
                        ltPagination = page - 1;
                        rtPagination = rtPagination * 2 - ltPagination;
                    } else if (page >= totalPage - rtPagination) {
                        rtPagination = totalPage - page;
                        ltPagination = ltPagination * 2 - rtPagination;
                    }
                }
            }

            var html = $('<div class="page_nav"></div>');
            if (this.settings.id)
                html.attr("id", this.settings.id);
            if (this.settings.nvgClass)
                html.addClass(this.settings.nvgClass);
            if (this.settings.margin) {
                html.css("margin", this.settings.margin);
            }

            if (this.settings.flPage) {
                var first_page = this.createFirstBtn();
                first_page.appendTo(html);
            }
            if (this.settings.npPage) {
                var prev_page = this.createPrevBtn();
                prev_page.appendTo(html);
            }

            if (dynamic) {
                if (this.settings.htNum === true) {
                    if (page != 1) {
                        var num = this.createNumBtn(1);
                        num.appendTo(html);
                    }
                    if (page - 2 > ltPagination) {
                        var omit = this.createOmitBtn();
                        omit.appendTo(html);
                    }
                } else {
                    if (page - 1 > ltPagination) {
                        var omit = this.createOmitBtn();
                        omit.appendTo(html);
                    }
                }

                for (var i = 0; i < ltPagination; i++) {
                    var page_no = page - ltPagination + i;
                    var num = this.createNumBtn(page_no);
                    num.appendTo(html);
                }

                var active = this.createActiveBtn(page);
                active.appendTo(html);

                for (var i = 0; i < rtPagination; i++) {
                    var page_no = page + i + 1;
                    var num = this.createNumBtn(page_no);
                    num.appendTo(html);
                }

                if (this.settings.htNum === true) {
                    if (page + rtPagination < totalPage - 1) {
                        var omit = this.createOmitBtn();
                        omit.appendTo(html);
                    }
                    if (page != totalPage) {
                        var num = this.createNumBtn(totalPage);
                        num.appendTo(html);
                    }
                } else {
                    if (page + rtPagination < totalPage) {
                        var omit = this.createOmitBtn();
                        omit.appendTo(html);
                    }
                }

            } else {
                if (this.settings.htNum === true) {
                    for (var i = 0; i < totalPage; i++) {
                        var page_no = i + 1;
                        if (page_no == page) {
                            var active = this.createActiveBtn(page_no);
                            active.appendTo(html);
                        } else {
                            var num = this.createNumBtn(page_no);
                            num.appendTo(html);
                        }
                    }
                }
            }
            if (this.settings.pageTotalItem) {
                var page_num = this.createNumPage(page);
                page_num.appendTo(html);
            }

            if (this.settings.npPage) {
                var next_page = this.createNextBtn();
                next_page.appendTo(html);
            }
            if (this.settings.flPage) {
                var last_page = this.createLastBtn();
                last_page.appendTo(html);
            }
            if (this.settings.pageSizeSet) {
                var pageSize = this.createPageSize(pageSize);
                pageSize.appendTo(html);

                html.find('select').change(function (event) {
                    var tag = $(this);
                    $this.paging(tag, event);
                });
            }

            html.find('a').unbind('click').bind('click', function (event) {
                var tag = $(this);
                $this.paging(tag, event);
            });

            this.body = html;
            var $this = this;
            if (this.settings.pagingMode == 'srcoll') {
                this.parentEl.scroll(function () {
                    var viewH = $(this).height(),
                        contentH = $(this).get(0).scrollHeight,
                        scrollTop = $(this).scrollTop();
                    if (scrollTop / (contentH - viewH) > 0.95) {
                        $this.body.find('.nextPage').click();
                        $($this.parentEl).unbind('scroll');
                        $($this.parentEl).unbind('scroll');
                    }
                });
                this.hide();
            }

            return html;
        },

        isFirstPage: function () {
            if (this.pageInfo.page <= 1) {
                this.setCurrentPage(1);
                return true;
            }
            return false;
        },

        isLastPage: function () {
            if (this.settings.pageTotalItem) {
                return false;
            } else {
                if (this.pageInfo.page >= this.pageInfo.totalPage) {
                    this.setCurrentPage(this.pageInfo.totalPage);
                    return true;
                }
            }
        },

        paging: function (tag, event) {
            var page_no = tag.data('pagination');
            //alert(page_no);
            if (typeof page_no === "number") {
                this.setCurrentPage(page_no);
            } else if (page_no == "first") {
                if (this.isFirstPage())
                    return;
                this.setCurrentPage(1);
            } else if (page_no == "prev") {
                if (this.isFirstPage())
                    return;
                var page = this.getCurrentPage() - 1;
                this.setCurrentPage(page);
            } else if (page_no == "next") {
                if (this.isLastPage())
                    return;
                var page = this.getCurrentPage() + 1;
                this.setCurrentPage(page);
            } else if (page_no == "last") {
                if (this.isLastPage())
                    return;
                this.setCurrentPage(this.getTotalPage());
            } else if (page_no == "pagesize") {
                var val = tag.val();
                this.setPageSize(val);
                this.setCurrentPage(1);
            }
            ;

            if (this.settings.schFun)
                this.settings.schFun.call(this, event);
            else if (this.settings.schForm) {
                var schForm = $(this.settings.schForm);
                if (schForm.attr("action") != "")
                    schForm.submit();
                else
                    this.redraw();
            } else
                this.redraw();
        },

        redraw: function () {
            if (this.parentEl) {
                this.body.remove();
                this.view(this.parentEl);
                this.autoHide();
            }
            return this;
        },

        remove: function () {
            if (this.body && this.body.length)
                this.body.remove();
        },

        setPageSize: function (val) {
            var valnum = parseInt(val)
            this.pageInfo.pageSize = valnum;
            return this;
        },

        setCurrentPage: function (page_no) {
            this.pageInfo.page = page_no;
            if (this.settings.schForm) {
                var schForm = $(this.settings.schForm);
                $("input[name='query.currentPage']", schForm).val(page_no);
            }
            ;
            var pageSize = this.getCurrentpageSize();
            if (pageSize != 10) {
                this.pageInfo.pageSize = pageSize;
                this.body.find('a').attr('value', pageSize);
            }
        },
        setPageInfo: function (pageInfo) {
            this.pageInfo = pageInfo = $.extend(this.pageInfo, pageInfo);
            //this.setCurrentPage(pageInfo.page);
            //this.setTotalPage(pageInfo.totalPage);
            return this;
        },
        setTotalPage: function (total_page) {
            this.pageInfo.totalPage = total_page;
            if (this.settings.schForm) {
                var schForm = $(this.settings.schForm);
                $("input[name='query.totalPage']", schForm).val(total_page);
            }
        },

        unload: function () {
            if (this.body)
                this.body.remove();
        },

        view: function (selector) {
            var parent = $(selector);
            this.parentEl = parent;
            parent.append(this.html());
            this.autoHide();
            return this;
        }


    });
    /**
     * 获取page对象
     */
    $wq.getPager = function (id) {
        var pager = null;
        if (id && id != undefined) {
            pager = $.data(document.body, id);
        } else {
            pager = $.data(document.body, "pager");
        }
        return pager;
    };

    /**
     * 创建pager对象
     * 参数说明:
     *
     * 示例:
     * options = {
     *
     * }
     */
    $wq.newPage = function (options) {
        options = $.extend({}, options);
        var pager = new WeqiaPage(options);
        return pager;
    };

    $wq.page = function (options, pageInfo) {
        options = $.extend({}, options);
        var pager = null;
        var selector = $(options.selector);
        pager = $wq.getPager(options.id);
        if (!pager) {
            pager = new WeqiaPage(options);
            if (pageInfo)
                pager.setPageInfo(pageInfo);
            if (selector.length) {
                pager.view(selector);
            }
        } else {
            if (pageInfo)
                pager.setPageInfo(pageInfo);
            pager.redraw();
        }

        return pager;
    };

    $wq.removePage = function (id) {
        var pager = $wq.getPager(id);
        if (pager)
            pager.remove();
        if (id)
            $.removeData(document.body, id);
        else
            $.removeData(document.body, "pager");
        pager = null;
    };

    $wq.unloadPage = function (id) {
        var pager = $wq.getPager(id);
        if (pager)
            pager.unload();
    };


    /**
     * Date function (时间函数) ======================
     */
    var WeqiaDate = function (systime) {
        var sysDate = new Date(systime);
        var curDate = new Date();
        this.adjustedVal = sysDate - curDate;
    };

    $.extend(WeqiaDate, {

        time: {
            second: 1000,
            minute: 1000 * 60,
            hour: 1000 * 60 * 60,
            day: 1000 * 60 * 60 * 24,
            week: 1000 * 60 * 60 * 24 * 7
        },

        prototype: {

            compareDay: function (date1, date2) {
                if (!date2)
                    date2 = this.currentDate();
                return Math.ceil((date1.getTime() - date2.getTime()) / WeqiaDate.time.day);
            },

            currentDate: function () {
                var date = new Date;
                date.setTime(date.getTime() + this.adjustedVal);
                return date;
            },

            dynamicShow: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;

                var show = "";
                //var currDate = this.currentDate();
                //var l1 = currDate.getTime() - date.getTime();
                //if (l1 < WeqiaDate.time.minute){
                //	show = "刚刚";
                //} else if (l1 < WeqiaDate.time.hour) {
                //    show = parseInt(l1 /WeqiaDate.time.minute) + "分钟前";
                //} else if (l1 < WeqiaDate.time.day){
                //    show = parseInt(l1 /WeqiaDate.time.hour) + "小时前";
                //} else if (l1 < WeqiaDate.time.week){
                //    show = parseInt(l1 /WeqiaDate.time.day) + "天前";
                //} else{
                show = this.getDateMDDHS(date);
                //}
                return show;
            },

            formatDate: function (date, fmt) {
                return date.pattern(fmt);
            },

            getDate: function (date) {
                if (!date) {
                    return null;
                }
                if (date.constructor == String)
                    return this.stringToDate(date);
                else if (date.constructor == Number)
                    return this.longToDate(date);
                else if (date.constructor == Date)
                    return date;
                return null;
            },

            getDateMDDHS: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;
                return this.formatDate(date, "M月dd日 HH:mm");
            },

            getDateMMDD: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;
                return this.formatDate(date, "M月d日");
            },

            getDateYMD: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;
                return this.formatDate(date, "yyyy/MM/dd");
            },

            /** #20150908 4.2.2 push 审批 **/
            //20150908 yyyy-MM-dd 形式
            getDateYMDline: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;
                if (browser.versions.trident) {
                    return this.formatDate(date, "yyyy/MM/dd");
                } else {
                    return this.formatDate(date, "yyyy-MM-dd");
                }

            },

            /** #20150911 4.2.2 push 审批 **/
            //201509011 yyyy/MM/dd HH:mm 形式
            getDateYMDHMline: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;
                return this.formatDate(date, "yyyy/MM/dd HH:mm");
            },

            /** 20160119 报销日期 @jin **/
            /** yyyy年MM月dd日形式 **/
            getDateYMDCline: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;
                return this.formatDate(date, "yyyy年MM月dd日");
            },

            getDateYMDH: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;
                return this.formatDate(date, "yyyy/MM/dd HH:00:00");
            },

            getDateYMDHMS: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;
                return this.formatDate(date, "yyyy/MM/dd HH:mm:ss");
            },

            getDateYMDHM: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;
                return this.formatDate(date, "yyyy/MM/dd HH:mm");
            },

            getTimeHS: function (date) {
                date = this.getDate(date);
                if (!date)
                    return;
                return this.formatDate(date, "HH:mm");
            },

            longToDate: function (millisecond) {
                return new Date(millisecond);
            },

            stringToDate: function (str) {
                return new Date(str);
            },
            getSimpleDate: function (date) {
                var str = this.getDateYMDline(date);
                str += " 00:00:00";
                return new Date(str);
            }
        }
    });

    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符
     * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * eg:
     * (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
            "H+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    $wq.newDate();


    /**
     * retrieve plugin ============================
     * 元素
     * target 目标对象。
     * trigger 触发器。用来解发浮动层(注:使用weqiafloat插件)。特殊情况下与inputTag是同一对象。
     * floatDiv 浮动层。用于检索并展示检索结果的。
     * floator weqiafloat对象。
     * inputElem 输入标签。用于接收检索条件并触发检索的入口。特殊情况下与outputTag是同一对象。
     * outputElem 输出标签。用于展示输出结果的标签，可以为"input"、"textarea"、"div"。特殊情况下与outputTag是同一对象。
     * selectItem 选择项。用于展示检索结果的项，可配置"单选"或"多选"。
     * selectedItem 选中标项。用于展示选择结果的标签，一般用于"多选"模式。
     *
     * 参数
     * mode 检索模式。该模式在"search"版（提供条件搜索、部门搜索、多选等功能）有效。
     * multiple 是否多选，默认为true.
     * selectDp 是否支持选部门，默认为false.
     * allowNull 是否允许条件为空，条件为空的情况下搜索全公司的员工和部门，默认为false.
     * retType 检索类型。1-只检索员工 2-可检索员工和部门
     * outputMode 输出模式."key-val"键值对，"tag"标签，"attext"@员工或部门.默认为"key-val",但多选并且"outputElem"为"div"的情况下默认为"tag";
     *
     * 事件
     * onFloat 浮动事件。trigger触发float的事件，相当于trigger.click().
     * onInput 输入事件。输入标签接收输入时触发的事件，等于inputTag.focus()和inputTag.change().
     * onSearch 搜索事件。点击搜索按键时触发的事件，等于schBtn.click();
     * onItemSelect 选项选中事件。选中选项时触发的事件，等于selectItem.click().
     * onDpItemSelect 部门选中事件。选中部门时触发的事件.
     * onKeydown 键位事件。"enter"、"up"、"down"键位触发的事件。
     * onChanged 输出结果发现触发的事件
     *
     * 回调函数
     * selectCall 选中选项前回调的函数
     * selectedCall 选中选项后回调的函数
     * changeCall 输出结果发现变化时回调的函数
     * showCall 浮动层显示时回调的函数
     * hideCall 浮动层隐藏时回调的函数
     * tagCloseCall 删除输出结果回调的函数
     *
     */

    /**
     * retrieve helper (检索助手)
     *
     */
    var wqretrievehelper = {

        url: {
            "retrieve": "/front/retrieve/retrieve.htm",
            "contact": "/front/retrieve/contact.htm",
            "department": "/front/retrieve/department.htm",
            "discussman": "/front/discussMemberList.htm",
            //20150409 取得所有企业
            "findallowncompany": "/front/retrieve/findallowncompany.htm",
            //20150410 取得标签
            "findLabel": "/front/retrieve/findLabel.htm",
            //20150410 取得标签成员
            "labelcontact": "/front/retrieve/labelcontact.htm",
            //20150410 取得好友成员
            "friendcontact": "/front/retrieve/friendcontact.htm",
            //20160614
            "projectmans": "/front/findProjectCanAtMan.htm",
            //20170516 得到项目部列表
            "workerContact": "/front/retrieve/workerContact.htm",
            "findWorkers": "/front/retrieve/findWorkers.htm"
        },

        canAddTage: function (elem) {
            if (elem.is("div"))
                return true;
            //    		if(elem.is("span"))
            //    			return true;
            return false;
        },

        cleanItems: function () {
            var floatDiv = this.floatDiv;
            floatDiv.find("ul li").remove();
        },

        close: function () {
            $.weqiafloat.hide();
        },

        createAtText: function (data, type) {
            var atText = ""
            if (type == "contact") {
                var name = data.name;
                var account = "";
                if (data.weqiaNo)
                    account = data.weqiaNo;
                else if (data.mobile)
                    account = data.mobile;
                else if (data.contact)
                    account = data.email;
                atText = "[" + name + ":" + account + "]";
            } else if (type == "dp") {
                name = data.dpName;
                id = data.dpId;
                atText = "[" + name + "：" + id + "]";
                //20150410 @标签
            } else if (type == "lb") {
                name = data.title;
                id = data.lid;
                atText = "[标签：" + name + "：" + id + "]";
            } else if (type == "pb") {
                name = '全公司';
                atText = "[" + name + ":" + 1 + "]";
            } else if (type == "group") {
                name = data.name;
                id = data.id;
                atText = "[班组:" + name + ":" + id + "]";
            } else if (type == "worker") {
                name = data.name;
                id = data.mid;
                atText = "[工人:" + name + ":" + id + "]";
            } else if (type == "personProject") {
                name = data.name;
                id = data.id;
                atText = "[项目部:" + name + ":" + id + "]";
            } else if (type == "allWorker") {
                name = '全体工人';
                atText = "[" + name + ":" + 1 + "]";
            }
            return atText;
        },

        createFloatDiv: function () {
            var float_div = $(".wqr_simplify");
            if (!float_div.length) {
                float_div = $('<div class="wqr_simplify wq_contact" style="display:none;height:60px;"></div>');
                float_div.append('<div class="hint"  style="color:#999999;font-size: 11px;">请输入要查找的同事信息(如:名称、通行证帐号、手机、邮箱)</div>');
                float_div.append('<ul></ul>');
                $(document.body).append(float_div);
            }
            return float_div;
        },

        createTag: function () {
            var tag = $('<span class="tag"></span>');
            tag.append('<span style="padding: 0 10px 0 0;"></span>');
            var del_btn = $('<a href="javascript:void(0)">x</a>');
            tag.append(del_btn);
            var $this = this;
            del_btn.click(function () {
                var mid = $(this).parent().attr('mid')
                if ($this.settings.tagCloseCall) {
                    $this.settings.tagCloseCall(mid)
                }
                tag.remove();
                $this.onChanged();
            });

            return tag;
        },

        /** #20150907 4.2.2 push 审批 **/
        /** 生成带方向的方形标签 主要用于显示多个员工 **/
        createDirectionTag: function () {
            var tag = $('<span class="tag directionTag"></span>');
            tag.append('<span style="padding: 0 10px 0 0;"></span>');
            var del_btn = $('<a href="javascript:void(0)">x</a>');
            tag.append(del_btn);
            var direction_span = $('<div class="direction"></div>');
            tag.append(direction_span);
            var $this = this;
            del_btn.click(function () {
                tag.remove();
                $this.onChanged();
            });

            return tag;
        },

        get: function (target) {
            return $(target).data("retrieve");
        },

        getCurrItem: function () {
            var floatDiv = this.floatDiv;
            return floatDiv.find("ul li.cur");
        },

        getRetType: function () {
            return this.settings.retType;
        },

        getUrl: function (key) {
            return $wq.getUrl.call(this, key);
        },

        handleLoadContactData: function (data) {
            var floatDiv = this.floatDiv
            var contacts = data.list;
            var query = data.query;
            //20150401  自己隐藏
            var memid = data.memid;
            var $this = this;
            //20150401  增加只有一个隐藏的自己的情况
            if (!contacts || !contacts.length || (contacts.length == 1 && contacts[0].mid == memid)) {
                floatDiv.height(60);
                return;
            } else if (contacts.length < 5) {
                this.floatDiv.height(100);
            } else {
                this.floatDiv.height(250);
            }
            floatDiv.find(".hint").hide();

            var hasDefaultCur = false;
            if (floatDiv.find("li.cur").length)
                hasDefaultCur = true;
            $.each(contacts, function (i, el) {
                //20150401 自己隐藏
                if (!el.mid) {
                    el.mid = el.member_id
                }
                if (el.mid == memid) {
                    return;
                }
                //20160216 兼容el.member_name @jin
                if (!el.name) {
                    el.name = el.member_name;
                }
                var contant = el.name;
                var info = el.info ? el.info : "";
                var account;
                if ($this.matchCond(el.weqiaNo, query.schCond, true)) {
                    contant += "(" + el.weqiaNo + ")";
                } else if ($this.matchCond(el.mobile, query.schCond, true)) {
                    contant += "(" + el.mobile + ")";
                } else if ($this.matchCond(el.email, query.schCond, true)) {
                    contant += "(" + el.email + ")";
                } else if (el.weqiaNo) {
                    contant += "(" + el.weqiaNo + ")";
                } else if (el.mobile) {
                    contant += "(" + el.mobile + ")";
                } else if (el.email) {
                    contant += "(" + el.email + ")";
                }

                var item = $('<li class="menu_item contant_item" value="1"></li>');
                if (i == 0 && !hasDefaultCur) {
                    item.addClass("cur");
                }
                var selector = '.contant_item a[no="' + el.weqiaNo + '"]';
                if ($(selector).length) {
                    return true;
                }
                item.append('<a no="' + el.weqiaNo + '" href="javascript:void(0)" title="' + info + '">' + contant + '</a>');
                item.data("contact", el);
                floatDiv.find("ul").append(item);

                item.mouseenter(function () {
                    var currItem = $this.getCurrItem();
                    currItem.removeClass("cur");
                    $(this).addClass("cur");
                }).click(function () {
                    //var item = $(this);
                    $this.onItemSelect(item, "contact");
                });
            });

        },

        handleLoadDpData: function (dps) {
            var floatDiv = this.floatDiv
            var $this = this;

            if (!dps || !dps.length) {
                return;
            }
            floatDiv.find(".hint").hide();

            var hasDefaultCur = false;
            if (floatDiv.find("li.cur").length)
                hasDefaultCur = true;
            $.each(dps, function (i, el) {
                var dpName = el.dpName;
                var dpLevel = el.dpLevel;

                var item = $('<li class="menu_item dp_item" value="1"></li>');
                if (i == 0 && !hasDefaultCur) {
                    item.addClass("cur");
                }
                item.append('<a href="javascript:void(0)" title="' + dpLevel + '">' + dpName + '</a>');
                item.data("dp", el);
                floatDiv.find("ul").append(item);

                item.mouseenter(function () {
                    var currItem = $this.getCurrItem();
                    currItem.removeClass("cur");
                    $(this).addClass("cur");
                }).click(function () {
                    //var item = $(this);
                    $this.onItemSelect(item, "dp");
                });
            });
        },

        handleSelectItem: function (item, type) {
            var outputMode = this.settings.outputMode;
            if (outputMode == "key-val") {
                this.outputKeyVal(item, type);
            } else if (outputMode == "tag") {
                this.outputTag(item, type);
            } else if (outputMode == "attext") {
                this.outputAtText(item, type);
            }
        },

        isInputElem: function (elem) {
            if (elem.is(":text") || elem.is("textarea"))
                return true;
            return false;
        },

        matchCond: function (field, cond, exact) {
            if (!field || !field.length)
                return false;

            if (exact)
                cond = "/^" + cond + "/ig";
            var rgExp = new RegExp(cond);
            return rgExp.test(field);
        },

        onArrowKeyListener: function (event) {
            if (this.show && event.keyCode == 38) {
                var currItem = this.getCurrItem();
                var prev = currItem.prev();
                if (prev.length) {
                    currItem.removeClass("cur");
                    prev.addClass("cur");
                }
            }
            if (this.show && event.keyCode == 40) {
                var currItem = this.getCurrItem();
                var next = currItem.next();
                if (next.length) {
                    currItem.removeClass("cur");
                    next.addClass("cur");
                }
            }
        },

        onChanged: function () {
            if (this.settings.changeCall)
                this.settings.changeCall.call(this, this.outputElem);
        },

        onInput: function () {
            var val = this.inputElem.val();
            var dpId;
            if (this.dp) {
                dpId = this.dp.attr("did");
            }
            var schCond = null;
            if (val) {
                schCond = {
                    "schCond": val,
                    'dpId': dpId
                };
            }
            this.timeOutRetrieve(schCond);
        },

        onItemSelect: function (item, type) {
            if (this.settings.selectCall)
                this.settings.selectCall.call(this, item);
            this.handleSelectItem(item, type);

            if (this.settings.selectedCall)
                this.settings.selectedCall.call(this, item);
            $.weqiafloat.hide();
            //this.inputElem.blur();
            this.onChanged();
        },

        onLoad: function () {
            this.floatDiv.find(".hint").show();
            this.floatDiv.find("ul li").remove();
            var val = this.inputElem.val();
            var dpId;
            if (this.dp) {
                dpId = this.dp.attr("did");
            }
            var schCond = null;
            if (val) {
                schCond = {
                    "schCond": val,
                    'dpId': dpId
                };
            }
            this.retrieve(schCond);
        },

        outputKeyVal: function (selectItem, type) {
            var outputElem = this.outputElem;
            outputElem.unbindInputChange();
            outputElem.focus();
            if (type == "dp") {
                var dp = selectItem.data("dp");
                outputElem.val(dp.dpName);
                outputElem.attr("dpid", dp.dpId);
                outputElem.removeAttr("mid");
            } else if (type == "contact") {
                var contact = selectItem.data("contact");
                outputElem.val(contact.name || contact.mName);
                outputElem.attr("mid", contact.mid);
                outputElem.removeAttr("dpid");
            } else if (type == "pb") {
                outputElem.val('全公司');
                outputElem.attr("choosecom", 1);
                outputElem.removeAttr("mid");
                outputElem.removeAttr("dpid");
            } else if (type == "group") {
                var group = selectItem.data("group");
                outputElem.val(group.name);
                outputElem.attr("groupId", group.id);
                outputElem.removeAttr("mid");
                outputElem.removeAttr("dpid");
            } else if (type == "worker") {
                var worker = selectItem.data("contact");
                outputElem.val(worker.name);
                outputElem.attr("workerId", worker.mid);
                outputElem.attr("mid", worker.mid);
                outputElem.removeAttr("dpid");
            } else if (type == "personProject") {
                outputElem.val(selectItem.name);
                outputElem.attr("pjId", selectItem.id);
                outputElem.removeAttr("mid");
                outputElem.removeAttr("dpid");
            } else if (type == "allWorker") {
                outputElem.val('全体工人');
                outputElem.attr("allWorker", 1);
                outputElem.removeAttr("mid");
                outputElem.removeAttr("dpid");
            }
            //outputElem.blur();
        },

        outputTag: function (selectItem, type) {
            var outputElem = this.outputElem;
            outputElem.focus();
            var tag;
            if (type == "dp") {
                var dp = selectItem.data("dp");
                var dpId = dp.dpId;
                if (outputElem.find("span[dpid='" + dpId + "']").length || outputElem.find("span[choosecom='1']").length)
                    return;

                tag = this.createTag();
                tag.find("span").text(dp.dpName);
                tag.attr("dpid", dpId);
            } else if (type == "pb") {
                if (outputElem.find("span[choosecom='1']").length)
                    return;
                outputElem.find("span[dpid]").remove();
                tag = this.createTag();
                tag.find("span").text('全公司');
                tag.attr("choosecom", 1);
            } else if (type == "contact") {
                var contact = selectItem.data("contact");
                var mid = contact.mid;
                if (outputElem.find("span[mid='" + mid + "']").length || outputElem.find("span[choosecom='1']").length)
                    return;

                tag = this.createTag();
                tag.find("span").text(contact.name);
                tag.attr("mid", mid);
            } else if (type == "lb") {
                //20150723 添加标签
                var contact = selectItem.data("lb");
                var lid = contact.lid;
                if (outputElem.find("span[lid='" + lid + "']").length || outputElem.find("span[choosecom='1']").length)
                    return;

                tag = this.createTag();
                tag.find("span").text(contact.title);
                tag.attr("lid", lid);
            } else if (type == "drtcontact") {
                /** #20150907 4.2.2 push 审批 **/
                /** 带方向的多人员输入容器 **/
                var contact = selectItem.data("contact");
                var mid = contact.mid;
                if (outputElem.find("span[mid='" + mid + "']").length || outputElem.find("span[allWorker='1']").length)
                    return;

                tag = this.createDirectionTag();
                tag.find("span").text(contact.name);
                tag.attr("mid", mid);
            } else if (type == "group") {
                var group = selectItem.data("group");
                var groupId = group.id;
                if (outputElem.find("span[groupId='" + groupId + "']").length || outputElem.find("span[allWorker='1']").length)
                    return;

                tag = this.createTag();
                tag.find("span").text(group.name);
                tag.attr("groupId", groupId);
            } else if (type == "worker") {
                var worker = selectItem.data("contact");
                var wkId = worker.mid;
                if (outputElem.find("span[wkId='" + wkId + "']").length || outputElem.find("span[allWorker='1']").length)
                    return;

                tag = this.createTag();
                tag.find("span").text(worker.name);
                tag.attr("wkId", wkId);
            } else if (type == "personProject") {
                var id = selectItem.id;
                var name = selectItem.name;
                if (outputElem.find("span[pjId='" + id + "']").length || outputElem.find("span[allWorker='1']").length)
                    return;

                tag = this.createTag();
                tag.find("span").text(name);
                tag.attr("pjId", id);
            } else if (type == "allWorker") {
                if (outputElem.find("span[allWorker='1']").length)
                    return;
                outputElem.find("span[pjid]").remove();
                tag = this.createTag();
                tag.find("span").text('全体工人');
                tag.attr("allWorker", 1);
            }

            if (outputElem.find("span.tag").length) {
                outputElem.find("span.tag:last").after(tag);
            } else {
                outputElem.prepend(tag);
            }
            outputElem.blur();
        },

        outputAtText: function (selectItem, type) {
            var outputElem = this.outputElem;
            outputElem.focus();
            var atText = "";
            if (type == "dp") {
                var dp = selectItem.data("dp");
                atText = "@" + this.createAtText(dp, type);
            } else if (type == "contact") {
                var contact = selectItem.data("contact");
                atText = "@" + this.createAtText(contact, type);
                //20150410 标签
            } else if (type == "lb") {
                var contact = selectItem.data("lb");
                atText = "@" + this.createAtText(contact, type);
            } else if (type == "pb") {
                var contact = '全公司';
                atText = "@" + this.createAtText(contact, type);
            } else if (type == "worker") {
                var worker = selectItem.data("contact");
                atText = "@" + this.createAtText(worker, type);
            } else if (type == "personProject") {
                var contact = '全项目部';
                atText = "@" + this.createAtText(selectItem, type);
            } else if (type == "allWorker") {
                var contact = '全体工人';
                atText = "@" + this.createAtText(selectItem, type);
            }
            outputElem.insertAtCaret(atText);
        },

        parseLabel: function (content, labels) {
            if (!labels || labels.length < 1 || !content)
                return content;
            $.each(labels, function (i, label) {
                var labelId = label.labelId;
                var labelTitle = label.labelTitle;
                // 待替换部分
                var rgExp = new RegExp("@\\[l-" + labelId + "\\]", "g");
                var withSb = '<a class="at_label" href="javascript:void(0)" labelId="' + labelId + '">@' + labelTitle + " </a>";
                content = content.replace(rgExp, withSb);

            });
            return content;
        },

        parseDp: function (content, dps) {
            if (!dps || dps.length < 1 || !content)
                return content;
            $.each(dps, function (i, dp) {
                var dpId = dp.dpId;
                var name = dp.dpName;
                // 待替换部分
                var rgExp = new RegExp("@\\[d-" + dpId + "\\]", "g");
                var withSb = '<a class="at_dp" href="javascript:void(0)" dpId="' + dpId + '">@' + name + " </a>";
                content = content.replace(rgExp, withSb);

            });
            return content;
        },

        parseMan: function (content, mans) {
            if (!mans || mans.length < 1 || !content)
                return content;
            $.each(mans, function (i, man) {
                var wid = man.wid;
                var name = man.name || man.mname || man.mbName;
                // 待替换部分
                var rgExp = new RegExp("@\\[" + wid + "\\]", "g");
                var withSb = '<a class="at_man" href="javascript:void(0)" wid="' + wid + '">@' + name + " </a>";
                content = content.replace(rgExp, withSb);

            });
            return content;
        },

        retrieve: function (schCond) {
            this.cleanItems();
            this.showHint();
            this.floatDiv.height(60);
            if (schCond) {
                var $this = this;
                //20150325
                $wq.loadData({
                    url: this.getUrl("contact"),
                    data: schCond,
                    dataName: "query",
                    loop: "false",
                    handle: function (data) {
                        $this.handleLoadContactData(data);
                    }
                });
                if (this.settings.retType != 1) {
                    var dpItems = $wq.getJsonData({
                        url: this.getUrl("department"),
                        data: schCond,
                        dataName: "query",
                        key: "result"
                    });
                    this.handleLoadDpData(dpItems);
                }

                if (this.settings.isProjectTask && this.settings.isProjectTask != 0) {
                    schCond = $.extend(schCond, {
                        "project_id": this.settings.isProjectTask
                    });
                    $wq.loadData({
                        url: $this.getUrl("projectmans"),
                        data: schCond,
                        dataName: "query",
                        key: "list",
                        loop: "false",
                        handle: function (data) {
                            $this.handleLoadContactData(data);
                        }
                    });
                }
            }
        },

        //20150401
        discussretrieve: function (schCond) {
            /* 会议最大人数  */
            var maxpageSize = 1000;
            this.cleanItems();
            this.showHint();
            this.floatDiv.height(60);
            if (schCond) {
                schCond.discuss_id = -2;
                schCond.currentPage = "1";
                schCond.pageSize = maxpageSize;
                schCond.discuss_id = this.settings.dsId;
                var $this = this;
                //20150401
                $wq.loadData({
                    url: this.getUrl("discussman"),
                    data: schCond,
                    dataName: "query",
                    loop: "false",
                    handle: function (data) {
                        $this.handleLoadContactData(data);
                    }
                });
            }
        },

        //自定义的@人员检索器 @jin
        otherRetrieve: function (url, schCond, dataName) {
            var maxpageSize = 1000;
            this.cleanItems();
            this.showHint();
            this.floatDiv.height(60);
            if (schCond) {
                schCond.currentPage = "1";
                schCond.pageSize = maxpageSize;
                var $this = this;
                //20150401
                $wq.loadData({
                    url: url,
                    data: schCond,
                    dataName: dataName,
                    loop: "false",
                    handle: function (data) {
                        $this.handleLoadContactData(data);
                    }
                });
            }
        },

        showHint: function () {
            var floatDiv = this.floatDiv;
            floatDiv.find(".hint").show();
        },

        timeOutRetrieve: function (schCond) {
            if (this.timeout)
                clearTimeout(this.timeout);
            var $this = this;
            this.timeout = setTimeout(function () {
                //20150401 区分是不是微会议
                var t = typeof ($this);
                var isDiscuss = $this.settings.isDiscuss;
                //判断是否调用自定义的检索器 @jin
                var isOther = false;
                //判断是否有reply.js导入，从ReplyBox.retrieve中得到自定义数据
                //20160506 判断 是否为 聊天框 ".paste_content"
                if (window.ReplyBox && ReplyBox.retrieve && $this.target.hasClass("paste_content")) {
                    $this.ReplyBoxSettings = ReplyBox.retrieve.settings;
                    isOther = $this.ReplyBoxSettings.isOther;
                    schCond = $.extend(schCond, $this.ReplyBoxSettings.otherSchCond);
                }
                if (isDiscuss) {
                    //20150401 会议  retrieve
                    $this.discussretrieve(schCond);
                } else if (isOther) {
                    //20160216 审批retrieve
                    $this.otherRetrieve($this.ReplyBoxSettings.retrieveUrl, schCond, $this.ReplyBoxSettings.retrieveDataName);
                } else {
                    $this.retrieve(schCond);
                }

            }, 500);
        }
    };

    $wq.parseLabel = function (content, labels) {
        return wqretrievehelper.parseLabel(content, labels);
    };

    $wq.parseDp = function (content, dps) {
        return wqretrievehelper.parseDp(content, dps);
    };

    $wq.parseMan = function (content, mans) {
        return wqretrievehelper.parseMan(content, mans);
    };


    /**
     * input contact plugin (文本框输入查询企业联系人选择插件)
     * 通过输入用户名或帐号（通行证帐号，手机号或邮箱）查询企业联系人，然后通过选择联系人item来获取数据
     *
     * 参数说明:
     * target:输入框目标选择器，必填。
     *
     * 回调函数
     * selectCall 选中选项前回调的函数.
     * selectedCall 选中选项后回调的函数.
     * changeCall 输出结果发现变化时回调的函数.
     * showCall 浮动层显示时回调的函数.
     * hideCall 浮动层隐藏时回调的函数.
     *
     * 示例:
     * options = {
     * 	target:""
     * }
     */
    var wqinputcontact = function (options) {

        var target = $(options.target);
        var dp = options.dp;
        if (!target.length)
            return

        var settings = {
            target: null,
            dp: null,
            width: "280px",
            offsets: {
                x: 0,
                y: 0
            },
            position: "4-1"
        };

        this.settings = options = $.extend(settings, options);
        this.settings.multiple = false;
        this.settings.selectDp = false;
        this.settings.allowNull = false;
        this.settings.outputMode = "key-val"
        this.settings.retType = 1;

        this.target = this.trigger = this.inputElem = this.outputElem = target;
        if (dp) {
            this.dp = $(dp);
        }
        this.floatDiv = this.createFloatDiv();

        var $this = this;
        this.trigger.weqiafloat({
            zIndex: 1998,
            eventType: "click",
            target: this.floatDiv,
            width: options.width,
            position: "4-1",
            offsets: options.offsets,
            edgeAdjust: false,
            showCall: function () {
                $this.show = true;
                $this.init();
                $this.onLoad();
                if ($this.settings.showCall)
                    $this.settings.showCall.call($this);
            },
            hideCall: function () {
                $this.show = false;
                if ($this.settings.hideCall)
                    $this.settings.hideCall.call($this);
            }
        });

        this.inputElem.keydown(function (e) {
            if ($this.show && e.keyCode == 13) {
                var currItem = $this.getCurrItem();
                currItem.click();
            }
            $this.onArrowKeyListener(e);
        });

        this.target.data("retrieve", this);
    };

    $.extend(wqinputcontact.prototype, wqretrievehelper);

    $.extend(wqinputcontact.prototype, {
        cleanValue: function () {
            if (this.inputElem.attr("mid"))
                this.inputElem.removeAttr("mid");
        },

        init: function () {
            this.inputElem.unbindInputChange();
            var $this = this;
            this.inputElem.inputChange(function () {
                if ($this.show == true) {
                    $this.cleanValue();
                    $this.onInput();
                }
            });
        }
    });

    $.wqinputcontact = $wq.inputcontact = function (options) {
        return new wqinputcontact(options);
    };

    /**
     * tags contact plugin (企业联系人标签选择插件)
     * 通过输入用户名或帐号（通行证帐号，手机号或邮箱）查询企业联系人，通过选择联系人item在目标选择器中添加tag的形式来实现多选的目的
     *
     * 参数说明:
     * target:目标选择器（div），必填。
     * outputElem:输入层，必填。
     *
     * 示例:
     * options = {
     * 	target:""
     * }
     */
    var wqtagscontact = function (options) {

        var target = $(options.target);
        if (!target.length)
            return

        var settings = {
            target: null,
            outputElem: null,
            selectDp: false,
            width: "280px",
            offsets: {
                x: 0,
                y: 0
            },
            position: "4-1"
        };

        this.settings = options = $.extend(settings, options);
        this.settings.multiple = false;
        this.settings.allowNull = false;
        this.settings.outputMode = "tag";
        if (options.selectDp == true)
            this.settings.retType = 2;
        else
            this.settings.retType = 1;

        this.target = target;
        this.floatDiv = this.createFloatDiv();
        var outputElem = $('<div class="wq_tagscontact clearfix"></div>');
        target.append(outputElem);
        this.outputElem = outputElem;
        this.inputElem = $('<input class="tag_input" type="text" style="z-index: 11"/ value="">');
        this.trigger = this.inputElem;
        outputElem.append(this.trigger);

        /** #20150907 4.2.2 push 审批 **/
        /*后置添加按钮   默认隐藏*/
        this.inputElemAddBtn = $('<div class="tag_add_input" type="text" style="z-index: 11"/>');
        outputElem.append(this.inputElemAddBtn);

        this.inputSubs = $('<span class="input_subs" style="font-family: sans-serif; font-size: 14px; font-style: normal; font-variant: normal; font-weight: 400; left: -9999px; letter-spacing: 0px; position: absolute; text-transform: none; top: -9999px; white-space: nowrap; width: auto; word-spacing: 0px;"></span>');
        outputElem.append(this.inputSubs);
        this.tishi = target.find(".weiqia_ctishi");

        var $this = this;

        this.trigger.weqiafloat({
            zIndex: 1998,
            eventType: "click",
            target: this.floatDiv,
            width: options.width,
            position: "4-1",
            offsets: options.offsets,
            edgeAdjust: false,
            showCall: function () {
                $this.show = true;
                $this.onLoad();
                if ($this.settings.showCall)
                    $this.settings.showCall.call($this);
            },
            hideCall: function () {
                $this.show = false;
                if ($this.enable == false)
                    $this.outputElem.blur();
                if ($this.settings.hideCall)
                    $this.settings.hideCall.call($this);
            }
        });

        if (this.tishi.length) {
            this.inputElem.focus(function () {
                $this.enable = true;
                //$this.tishi.hide();
            }).blur(function () {
                $this.enable = false;
            });
            this.outputElem.blur(function () {
                //if($this.show == false){
                $this.inputElem.val("");
                $this.showTishi();
                //}
            });
            this.tishi.click(function (event) {
                if (event.target == this) {
                    $this.inputElem.focus();
                    $this.trigger.click();
                }
            });
        }

        outputElem.click(function (event) {
            if (event.target == this) {
                $this.inputElem.focus();
                $this.trigger.click();
            }
        });

        this.inputElem.inputChange(function () {
            $this.onInput();
        });

        this.inputElem.keydown(function (e) {
            if ($this.show && e.keyCode == 13) {
                var currItem = $this.getCurrItem();
                currItem.click();
            }
            $this.onArrowKeyListener(e);
        });

        this.show = false;
        this.enable = false;
        target.data("retrieve", this);
        return this;
    };

    $.extend(wqtagscontact.prototype, wqretrievehelper);

    $.extend(wqtagscontact.prototype, {

        getValue: function () {
            var tags = this.outputElem.find("span.tag");

            if (!tags.length)
                return null;

            var values = {};

            $.each(tags, function (i, el) {
                if ($(el).attr('choosecom') == 1) {
                    values.choosecom = 1;
                }
                if ($(el).attr('allWorker') == 1) {
                    values.allWorker = 1;
                }
            });


            if (this.settings.selectDp == true) {
                //20150723 增加标签   pending
                values["mbIds"] = [];
                values["dpIds"] = [];
                var mbIds = [];
                var dpIds = [];
                var lbIds = []; //标签ids
                var groupIds = [];
                var wkIds = [];
                var pjIds = [];
                $.each(tags, function (i, el) {
                    var tag = $(el);
                    var val = tag.attr("mid");
                    var dpid = tag.attr("dpid");
                    var lbid = tag.attr("lid");
                    var groupId = tag.attr("groupid");
                    var workerId = tag.attr("wkid");
                    var pjId = tag.attr("pjid");
                    if (val) {
                        mbIds.push(val);
                    } else if (dpid) {
                        val = dpid;
                        dpIds.push(val);
                    } else if (lbid) {
                        val = lbid;
                        lbIds.push(val);
                    } else if (groupId) {
                        val = groupId;
                        groupIds.push(val);
                    } else if (workerId) {
                        val = workerId;
                        wkIds.push(val);
                    } else if (pjId) {
                        val = pjId;
                        pjIds.push(val);
                    }
                });

                values["mbIds"] = mbIds;
                values["dpIds"] = dpIds;
                values["lbIds"] = lbIds;
                values["groupIds"] = groupIds;
                values["wkIds"] = wkIds;
                values["pjIds"] = pjIds;
            } else {
                values = [];
                $.each(tags, function (i, el) {
                    var val = $(el).attr("mid");
                    var tkmid = $(el).attr("wkid");
                    if (val) {
                        values[i] = val;
                    } else {
                        values[i] = tkmid;
                    }


                });
            }

            return values;
        },

        handleSelectItem: function (item, type) {
            var outputMode = this.settings.outputMode;
            if (outputMode == "key-val") {
                this.outputKeyVal(item, type);
            } else if (outputMode == "tag") {
                this.outputTag(item, type);
            } else if (outputMode == "attext") {
                this.outputAtText(item, type);
            }
            this.inputElem.val("");
            this.inputElem.css("width", "64px");
        },

        onChanged: function () {
            this.showTishi();
            if (this.settings.changeCall)
                this.settings.changeCall.call(this, this.outputElem);
        },

        onInput: function () {
            var val = this.inputElem.val();
            this.inputSubs.html(val);
            if (this.inputSubs.width() > this.outputElem.width() && this.inputSubs.width() < this.inputElem.width())
                this.inputElem.css("width", this.inputSubs.width());

            var schCond = null;
            if (val) {
                schCond = {
                    "schCond": val
                };
            }

            this.timeOutRetrieve(schCond);
        },

        reset: function () {
            var tags = this.outputElem.find("span.tag");
            if (tags)
                tags.remove();
            if (this.tishi)
                this.tishi.show();
        },

        setValue: function (memebers, departments, projects, groups, scWks, pubScope, workerScope) {
            if (memebers && !$.isArray(memebers))
                memebers = [memebers];
            if (departments != 1) {
                if (departments && !$.isArray(departments))
                    departments = [departments];
            }
            var outputElem = this.outputElem;
            var tags = outputElem.find("span.tag");
            if (tags)
                tags.remove();
            if (this.tishi)
                this.tishi.hide();
            var $this = this;
            var tag;
            if (memebers && memebers.length > 0) {
                $.each(memebers, function (i, el) {
                    tag = $this.createTag();
                    tag.find("span").text(el.mbName);
                    tag.attr("mid", el.mid);
                    if (outputElem.find("span.tag").length) {
                        outputElem.find("span.tag:last").after(tag);
                    } else {
                        outputElem.prepend(tag);
                    }
                });
            }
            ;
            if (departments && departments.length > 0) {
                $.each(departments, function (i, el) {
                    tag = $this.createTag();
                    tag.find("span").text(el.dpName);
                    tag.attr("dpid", el.dpId);
                    if (outputElem.find("span.tag").length) {
                        outputElem.find("span.tag:last").after(tag);
                    } else {
                        outputElem.prepend(tag);
                    }
                });
            }
            ;
            if (projects && projects.length > 0) {
                $.each(projects, function (i, el) {
                    tag = $this.createTag();
                    tag.find("span").text(el.projectName);
                    tag.attr("pjid", el.projectId);
                    if (outputElem.find("span.tag").length) {
                        outputElem.find("span.tag:last").after(tag);
                    } else {
                        outputElem.prepend(tag);
                    }
                });
            }
            if (groups && groups.length > 0) {
                $.each(groups, function (i, el) {
                    tag = $this.createTag();
                    tag.find("span").text(el.groupName);
                    tag.attr("groupid", el.groupId);
                    if (outputElem.find("span.tag").length) {
                        outputElem.find("span.tag:last").after(tag);
                    } else {
                        outputElem.prepend(tag);
                    }
                });
            }
            if (scWks && scWks.length > 0) {
                $.each(scWks, function (i, el) {
                    tag = $this.createTag();
                    tag.find("span").text(el.mbName);
                    tag.attr("wkid", el.mid);
                    if (outputElem.find("span.tag").length) {
                        outputElem.find("span.tag:last").after(tag);
                    } else {
                        outputElem.prepend(tag);
                    }
                });
            }
            if (departments == 1) {
                tag = $this.createTag();
                tag.find("span").text('全公司');
                tag.attr("choosecom", 1);
                if (outputElem.find("span.tag").length) {
                    outputElem.find("span.tag:last").after(tag);
                } else {
                    outputElem.prepend(tag);
                }
            }
            if (pubScope == 1) {
                tag = $this.createTag();
                tag.find("span").text('全公司');
                tag.attr("choosecom", 1);
                if (outputElem.find("span.tag").length) {
                    outputElem.find("span.tag:last").after(tag);
                } else {
                    outputElem.prepend(tag);
                }
            }
            if (workerScope == 1) {
                tag = $this.createTag();
                tag.find("span").text('全体工人');
                tag.attr("allworker", 1);
                if (outputElem.find("span.tag").length) {
                    outputElem.find("span.tag:last").after(tag);
                } else {
                    outputElem.prepend(tag);
                }
            }
        },

        showTishi: function () {
            if (this.tishi.length && !this.outputElem.find("span.tag").length) {
                this.tishi.show();
            }
        }
    });

    //window.wqtagscontact = wqtagscontact;

    $.wqtagscontact = $wq.tagscontact = function (options) {
        var target = $(options.target);
        if (!target.length)
            return;
        var tags = wqretrievehelper.get(target);
        if (!tags) {
            tags = new wqtagscontact(options);
        } else {
            $.extend(tags.settings, options);
        }
        return tags;
    };


    /**
     * at contact plugin (@用户选择插件) =====================================
     * 通过@并输入用户名或帐号（通行证帐号，手机号或邮箱）查询企业联系人，以@的形式插入到文本中
     *
     * 参数说明:
     * target:目标选择器（文本域），必填。
     *
     * 示例:
     * options = {
     * 	target:""
     * }
     */
    var wqatcontact = function (options, type, additons) {

        var target = $(options.target);
        if (!target.length)
            return

        var settings = {
            target: null,
            width: "280px",
            //20150401 增加 isDiscuss  判断
            isDiscuss: type == "discuss" ? true : false
        };

        this.settings = options = $.extend(settings, options);
        //additons 20150401
        this.settings = options = $.extend(settings, additons);
        this.settings.multiple = false;
        this.settings.selectDp = false;
        this.settings.allowNull = false;
        this.settings.outputMode = "attext"
        this.settings.retType = 2;

        this.target = target;
        this.inputElem = target;
        this.outputElem = target;
        this.floatDiv = this.createFloatDiv();
        this.contactSubs = this.createSubs();
        this.trigger = this.contactSubs;

        var $this = this;

        this.inputElem.click(function () {
            $this.onInput();
        }).inputChange(function () {
            $this.onInput();
        });

        this.inputElem.keydown(function (e) {
            if (e.keyCode != 38 && e.keyCode != 40) {
                $this.onInput();
                //修复ie 下 不能@人问题
                if (browser.versions.trident) {
                    setTimeout(function () {
                            $this.onInput();
                        },
                        100);
                }
            }
            if ($this.show && e.keyCode == 13) {
                var currItem = $this.getCurrItem();
                if (currItem.length) {
                    currItem.click();
                    return false;
                }
                $this.close();
            }
            $this.onArrowKeyListener(e);

            if (e.keyCode == 38) {

                var cur = $this.floatDiv.find('.cur');
                if (cur[0].offsetTop < 234) {
                    var scrollTop = $this.floatDiv.scrollTop();
                    $this.floatDiv.scrollTop(scrollTop - 26)
                }
            }
            if (e.keyCode == 40) {
                var cur = $this.floatDiv.find('.cur');
                if (cur[0].offsetTop >= 234) {
                    var scrollTop = $this.floatDiv.scrollTop();
                    $this.floatDiv.scrollTop(scrollTop + 26)
                }
            }
        });

        this.show = false;
        this.enable = false;

        target.data("retrieve", this);
        return this;
    };

    $.extend(wqatcontact.prototype, wqretrievehelper);

    $.extend(wqatcontact.prototype, {

        activate: function (at) {
            var $this = this;
            var inputElem = this.inputElem;
            if (this.enable == false) {
                var subs = this.contactSubs;
                var content = subs.find(".content");

                currBindRetrieve = subs.data("retrieve");
                if (currBindRetrieve) {
                    currBindRetrieve.unbind();
                }
                this.enable = true;
                subs.data("retrieve", this);
            }
            if (document.selection) {
                var text = this.inputElem.html();
                var content = this.contactSubs.find(".content");
                content.find(".before").html(text);
                content.find(".after").html(text.substring(at.index + 1));
                this.trigger.data("atdata", at);
                this.bind();
            } else {
                var text = this.inputElem.val() || this.inputElem.text();
                var b_text = text.substring(0, at.index);
                b_text = b_text.replace(/\n|\t/ig, "<br>");
                b_text = b_text.replace(/\s/ig, "<span> </span>");
                var content = this.contactSubs.find(".content");
                content.find(".before").html(b_text);
                content.find(".after").html(text.substring(at.index + 1));
                this.trigger.data("atdata", at);
                this.bind();
            }
        },

        bind: function () {
            var subs = this.contactSubs;
            var content = subs.find(".content");
            var atflag = subs.find(".atflag");
            var inputElem = this.inputElem;
            var width = inputElem.width();
            var height = inputElem.height();
            content.css("width", width);
            content.css("height", height);

            var l = inputElem.offset().left;
            var t = inputElem.offset().top;
            var ih = inputElem.height();
            var s = inputElem.scrollTop();
            var sh = inputElem.get(0).scrollHeight;

            //			var s1 = inputElem.get(0).scrollTop;
            var x = atflag.offset().left;
            var y = atflag.offset().top;
            var ah = atflag.height();

            l = l + x;
            y = y + ah;
            if (s == 0) {
                t = t + y;
            } else {
                t = t + y - s;
            }
            ;

            var offsets = subs.data("offsets");
            if (!offsets || (offsets.x != l || offsets.y != t)) {
                this.close();
                var $this = this;
                this.trigger.unbind();
                this.trigger.weqiafloat({
                    offsets: {
                        "x": l,
                        "y": t
                    },
                    eventType: "click",
                    target: this.floatDiv,
                    position: "4-1",
                    edgeAdjust: false,
                    showCall: function () {
                        $this.show = true;
                    },
                    hideCall: function () {
                        $this.show = false;
                    }
                });

                subs.data("offsets", {
                    "x": l,
                    "y": t
                });
            }
        },

        createSubs: function () {
            var subs = $(".wqatcontact_subs");
            if (!subs.length) {
                subs = $('<div class="wqatcontact_subs" style="position:absolute; height:0; visibility:hidden; overflow:hidden"></div>');
                var content = $('<div class="content"></div>');
                subs.append(content);
                content.append('<span class="before"></span>');
                content.append('<span class="atflag">@</span>');
                content.append('<span class="after"></span>');
                $(document.body).prepend(subs);
            }

            return subs;
        },

        disenable: function () {
            if (this.enable == true) {
                this.contactSubs.removeData("retrieve");
                this.contactSubs.find("span.before").text("");
                this.contactSubs.find("span.after").text("");
                this.enable = false;
                this.show = false;
            }
        },

        onInput: function () {
            var at = this.touchAt();
            if (at) {
                this.activate(at);
                if (this.show == false)
                    this.trigger.click();

                var schCond = null;
                if (at.cond) {
                    schCond = {
                        "schCond": at.cond
                    };
                }

                this.timeOutRetrieve(schCond);
            } else if (this.show == true) {
                this.close();
            }
        },

        outputAtText: function (selectItem, type) {
            var outputElem = this.outputElem;
            outputElem.focus();
            var atText = "";
            if (type == "dp") {
                var dp = selectItem.data("dp");
                atText = this.createAtText(dp, type);
            } else if (type == "contact") {
                var contact = selectItem.data("contact");
                atText = this.createAtText(contact, type);
                //20150410 标签 lb
            } else if (type == "lb") {
                var contact = selectItem.data("lb");
                atText = this.createAtText(contact, type);
            } else if (type == "pb") {
                var contact = '全公司';
                atText = "@" + this.createAtText(contact, type);
            } else if (type == "group") {
                var group = selectItem.data("group");
                atText = this.createAtText(group, type);
            }
            var atdata = this.trigger.data("atdata");
            outputElem.insertAtCaret(atText, atdata.index + 1);
            //this.trigger.removeData();
            //outputElem.blur();
        },

        touchAt: function () {
            var inputElem = this.inputElem;
            var text = inputElem.text();
            if (!text)
                return false;
            if (text.indexOf("@") == -1)
                return false;
            var cursorPos = inputElem.catchCursor();
            var validText = text.substring(0, cursorPos);

            if (validText.indexOf("@") == -1)
                return false;
            var regE = /@[^\[\]\s]*$/;
            if (!regE.test(validText))
                return false;
            regE = /@\[[^\[\]]+@[^\[\]\s]*$/;
            if (regE.test(validText))
                return false;

            var atIndex = validText.lastIndexOf("@");
            var cond = validText.substring(atIndex + 1);
            var at = {
                index: atIndex,
                cursor: cursorPos,
                cond: cond
            };
            //this.trigger.data("atdata", at);
            return at;
        },

        unbind: function () {
            this.enable = false;
            this.show = false;
        }
    });

    $.wqatcontact = $wq.atcontact = function (target, type, addtions) {
        var $target = $(target);
        if (!$target.length)
            return;
        var tags = wqretrievehelper.get(target);
        if (!tags) {
            var options = {
                target: target
            };
            tags = new wqatcontact(options, type, addtions);
        }
        return tags;
    };


    /**
     * retrieve plugin (检索插件)
     * "search"版.根据搜索条件检索企业内部员工和部门。
     * ================================================
     *
     * 参数说明:
     * mode 检索模式。mode 检索模式。目前支持"input"输入框模式, "tag"标签模式, "at"@模式。
     *        "input"模式为单选模式，不支持选部门。outputMode默认以"key-val"键值对的形式返回结果，outputElem一般为输入框.
     *        "tag"模式为多选模式，默认不支持选部门（可配置）。outputMode默认以"tag"标签的形式返回结果，要求outputElem必须为div(类似层)否则视为自定义.
     *        "at"模式默认为多选模式（可配置），默认支持选部门（可配置）。outputMode默认以"attext"文本的形式返回结果,outputElem一般为文本域.
     * target:目标选择器，必填。
     * outputElem 输出标签，必填。
     * multiple 是否多选，默认为false.
     * selectDp 是否支持选部门，默认为false.
     * outputMode 输出模式."key-val"键值对，"tag"标签，"attext"文本.默认为"key-val",可自定义;
     * clean 是否显示消除按钮。
     * 其它参数
     * offsets
     * position
     *
     * 回调函数
     * selectCall 选中选项前回调的函数.
     * selectedCall 选中选项后回调的函数. 参数为当前选中项（可能是数组）
     * changeCall 输出结果发现变化时回调的函数.
     * showCall 浮动层显示时回调的函数.
     * hideCall 浮动层隐藏时回调的函数.
     *
     * 示例:
     * options = {
     * 	target:""
     * }
     */
    var wqretrieve = function (options) {
        if (!options)
            return;

        var target = $(options.target);
        if (!target.length)
            return;
        var dp = $(options.dp);
        if (dp.length) {
            this.dp = dp;
        }

        var settings = {
            mode: "input",
            target: null,
            outputElem: null,
            multiple: false,
            selectDp: false,
            outputMode: "key-val",
            clean: false,
            offsets: {
                x: 0,
                y: 0
            },
            position: "4-1",
            edgeAdjust: false,
            //20150409 读取企业类型  all所有  own当前
            companyType: "all",
            //20150423 读取权限型 与companyType own 配合使用   all所有 auth权限
            authType: "all",
            //20160104 业务类型 与authType auth配合使用，auth时，default表示部门管理员管理部门 attendance表示考勤结果查看部门权限 customer表示统计结果查看权限
            busType: "default",
            labelType: "yes",
            friendType: "yes",
            retType: 1, //检索类型 1-只查人 2-查人和部门 3-客户查询权限部门下的人员
            workType: "no", //工人通讯录 默认关闭
            typeid: "0",
            /** #20150907 4.2.2 push 审批 **/
            //20150907 审批人员显示模式
            contactMode: "normal", //drtcontact有箭头模式  contact正常模式
            projectTag: false,
            choosecCompany: false, // 选择全公司
            choosecAllWorker: false, // 选择全体工人
            chooseProject: false //选择
        };
        if (options.mode == "tag") {
            settings.multiple = true;
            settings.outputMode = "tag";
            settings.clean = true;
        } else if (options.mode == "at") {
            settings.multiple = true;
            settings.selectDp = true;
            settings.outputMode = "attext";
        }

        this.settings = options = $.extend(settings, options);
        this.settings.allowNull = false;

        this.target = this.trigger = target;
        //自定义的@选项 @jin
        if (options.replyTool) {
            if (options.replyTool.createFloatDiv) {
                this.floatDiv = options.replyTool.createFloatDiv();
            }
            if (options.replyTool.onLoad) {
                wqretrieve.prototype.onLoad = options.replyTool.onLoad;
            }
            if (options.replyTool.retrieve) {
                wqretrieve.prototype.retrieve = options.replyTool.retrieve;
            }
            if (options.replyTool.handleLoadManData) {
                wqretrieve.prototype.handleLoadManData = options.replyTool.handleLoadManData;
            }
            if (options.replyTool.getManContainer) {
                wqretrieve.prototype.getManContainer = options.replyTool.getManContainer;
            }
            if (options.replyTool.initContRoot) {
                wqretrieve.prototype.initContRoot = options.replyTool.initContRoot;
            }
        } else {
            this.floatDiv = this.createFloatDiv();
            this.showOtherTag({
                projectTag: this.settings.projectTag,
                workerTag: this.settings.workType == "true"
            });
            wqretrieve.prototype.onLoad = wqretrieveExtend.onLoad;
            wqretrieve.prototype.retrieve = wqretrieveExtend.retrieve;
        }

        this.inputElem = this.floatDiv.find(".search_cond");
        this.schBtn = this.floatDiv.find(".search_btn");
        this.cleanBtn = this.floatDiv.find(".clean_btn");
        this.cancelBtn = this.floatDiv.find(".cancel_btn");
        this.outputElem = $(options.outputElem);
        if (!this.outputElem.length)
            this.settings.outputMode = "";
        if (this.settings.multiple == true && this.settings.outputMode == "input")
            this.settings.outputMode = "tag";
        if (this.settings.multiple == true && this.settings.outputMode == "tag" &&
            !this.canAddTage(this.outputElem))
            this.settings.outputMode = "";

        var $this = this;
        this.trigger.weqiafloat({
            zIndex: 1998,
            eventType: "click",
            target: this.floatDiv,
            position: "5-5",
            offsets: options.offsets,
            edgeAdjust: options.edgeAdjust,
            showCall: function () {
                $this.init();
                $this.show = true;
                setTimeout(function () {
                    $this.onLoad()
                }, 500);
                if ($this.settings.showCall)
                    $this.settings.showCall.call($this);
            },
            hideCall: function () {
                // 重置选择人员
                var firstTag = $('.select_tool_tag :first-child');
                var tagState = firstTag.attr('state');
                if (tagState == 'hidden')
                    firstTag = firstTag.next();
                firstTag.click();
                $this.show = false;
                if ($this.settings.hideCall)
                    $this.settings.hideCall.call($this);
            }
        });

        this.target.data("retrieve", this);
    };

    $.extend(wqretrieve.prototype, wqretrievehelper);

    var wqretrieveExtend = {
        cleanDpTree: function () {
            var floatDiv = this.floatDiv;
            var dp_root = floatDiv.find(".tree_box");
            var tree = $wq.getTree(dp_root);
            if (tree)
                tree.removeChildNode();
        },

        cleanItems: function () {
            var floatDiv = this.floatDiv;
            floatDiv.find(".webim-container").children().remove();
        },

        cleanLabelItems: function () {
            var floatDiv = this.floatDiv;
            floatDiv.find(".webim-container-label").children().remove();
        },

        //20150413 清除搜索框 需要移除焦点
        cleanSearchBean: function () {
            var floatDiv = this.floatDiv;
            floatDiv.find(".search_cond").val("搜索手机号码/通行证帐号/姓名/邮箱");
            floatDiv.find(".search_cond").removeAttr("onfocus");
            floatDiv.find(".search_cond").css("color", "#AAA");
        },

        //修改滑动把手的 显示    不能滑动则不显示
        changeShortHandler: function (root) {
            //
            var crh = parseInt($(root).find(".dumascroll_area").children().eq(0).css("height"));
            var brh = parseInt($(root).find(".dumascroll_bar").css("height"));
            if (brh >= crh) {
                $(root).find(".dumascroll_handle").addClass("short_bar");
            } else {
                $(root).find(".dumascroll_handle").removeClass("short_bar");
            }
        },

        showProjectTag: function (projectTag, tagDiv) {
            var project = tagDiv.find(".tag_project");
            var ent = tagDiv.find(".tag_enterprise");
            var label = tagDiv.find(".tag_label");
            var friend = tagDiv.find(".tag_friends");
            $(".select_tool_tag_div").removeClass("select_tool_selected");
            if (projectTag) {
                project.addClass("select_tool_selected");
                project.width("95px");
                ent.width("96px");
                label.width("95px");
                friend.width("95px");
                project.show();
                project.attr('state', 'visible');
            } else {
                ent.addClass("select_tool_selected");
                ent.width("129px");
                label.width("129px");
                friend.width("128px");
                project.hide();
                project.attr('state', 'hidden');
            }
        },

        showOtherTag: function (options) {
            var tagDiv = $(".select_tool_tag");
            var allPx = 387;
            var worker = tagDiv.find(".tag_workers");
            var project = tagDiv.find(".tag_project");
            var ent = tagDiv.find(".tag_enterprise");
            var label = tagDiv.find(".tag_label");
            var friend = tagDiv.find(".tag_friends");
            $(".select_tool_tag_div").removeClass("select_tool_selected");

            var pTag = options.projectTag;
            var wTag = options.workerTag;
            var cnt = 0;

            if (pTag) {
                project.addClass("select_tool_selected");
                project.show();
                project.attr('state', 'visible');
                cnt++;
                $(".zhuzhi-wrap").hide();
                $(".webim-cont_box").hide();
                $(".project-wrap").show();
                this.loadProjectMan(pTag);
            } else {
                ent.addClass("select_tool_selected");
                project.hide();
                project.attr('state', 'hidden');
                $(".zhuzhi-wrap").show();
                $(".webim-cont_box").show();
                $(".project-wrap").hide();
            }
            if (wTag) {
                cnt++;
                worker.show();
            } else {
                worker.hide();
            }

            var singlePx = allPx / (cnt + 3);
            var width = singlePx + "px";
            project.width(width);
            ent.width(width);
            label.width(width);
            friend.width(width);
            worker.width(width);

        },

        // showWorkerTag:function(workerTag){
        //    var open = workerTag == "yes";
        //     var tagDiv = $(".select_tool_tag");
        //     var worker = tagDiv.find(".tag_workers");
        //     var ent = tagDiv.find(".tag_enterprise");
        //     var label = tagDiv.find(".tag_label");
        //     var friend = tagDiv.find(".tag_friends");
        //     $(".select_tool_tag_div").removeClass("select_tool_selected");
        //     if(open){
        //         ent.addClass("select_tool_selected");
        //         worker.width("95px");
        //         ent.width("96px");
        //         label.width("95px");
        //         friend.width("95px");
        //         worker.show();
        //         worker.attr('state','visible');
        //     }else{
        //         ent.addClass("select_tool_selected");
        //         ent.width("129px");
        //         label.width("129px");
        //         friend.width("128px");
        //         worker.hide();
        //         worker.attr('state','hidden');
        //     }
        // },

        createFloatDiv: function () {
            var $this = this;
            //20150409
            var float_div = $(".wqr_search");
            if ((!float_div.length)) {
                //20150409
                float_div = $('<div class="wqr_search add_pow1 clearfix wqr_search_' + this.settings.typeid + '" style="display:none;"></div>');
                $(document.body).append(float_div);

                var webim_title = $('<div class="webim_title">选择人员</div>');
                float_div.append(webim_title);
                // 移动
                webim_title.mousedown(function (e) {
                    e = e || event;
                    var tempx = e.clientX - float_div.offset().left;
                    var tempy = e.clientY - float_div.offset().top;
                    float_div.mousemove(function (e) {
                        e = e || event;
                        e.preventDefault()
                        float_div.css({
                            'left': e.clientX - tempx,
                            'top': e.clientY - tempy
                        });
                    });
                    webim_title.mouseup(function () {
                        float_div.off("mousemove");
                    });
                });
                var body = $('<div class="webim-joined2"></div>');
                float_div.append(body);

                body.append('<span class="webim-text"></span>');
                //20150316 更新ie7 兼容性 *margin: 8px 2px 10px;
                var sch_div = $('<div class="user_top_serch clearfix" style="width:408px; border:#d9d9d9 solid 1px;float:left; margin: 10px 0px 10px;*margin: 10px 2px 10px;background:#fff"></div>');
                body.append(sch_div);
                //20150408 搜索下方的选择类型模块
                var tag_div = $('<div class="select_tool_tag clearfix"></div>');
                body.append(tag_div);

                var tag_project_div = $('<div class="tag_project select_tool_tag_div">项目成员</div>');
                //20150408 搜索下方的选择类型模块 三个分项
                var tag_enterprise_div = $('<div class="tag_enterprise select_tool_tag_div select_tool_selected">企业通讯录</div>');
                var tag_label_div = $('<div class="tag_label select_tool_tag_div">我的标签</div>');
                var tag_friends_div = $('<div class="tag_friends select_tool_tag_div">我的朋友</div>');
                var tag_workers_div = $('<div class="tag_workers select_tool_tag_div none">工人通讯录</div>')
                //20150423 空tag 用于调节边框

                tag_div.append(tag_project_div);
                tag_div.append(tag_enterprise_div);
                tag_div.append(tag_workers_div);
                tag_div.append(tag_label_div);
                tag_div.append(tag_friends_div);
                //20150423 空tag 用于调节边框
                /*tag_div.append(tag_none);*/

                $(tag_project_div).unbind();
                $(tag_project_div).click(function () {
                    if ($(this).hasClass("select_tool_selected")) {
                        return;
                    }
                    $(".select_tool_tag_div").removeClass("select_tool_selected");
                    $(this).addClass("select_tool_selected");
                    $(float_div).find(".select_tool_con_div").children().hide();
                    $(float_div).find(".select_tool_con_div .project-wrap").show();
                    $this.changeShortHandler($(float_div).find(".select_tool_con_div .project-wrap"));
                });

                //绑定选择事件
                $(tag_enterprise_div).unbind();
                $(tag_enterprise_div).click(function () {
                    if ($(this).hasClass("select_tool_selected")) {
                        return;
                    }
                    $(".select_tool_tag_div").removeClass("select_tool_selected");

                    //20150413 直接点一下
                    var cont_root = $this.floatDiv.find(".tree_box");
                    var ds = cont_root.find("a.tree-all span").eq(0);
                    if (ds) {
                        setTimeout(function () {
                            ds.click();
                            $wq.removeload()
                        }, 500);
                    }

                    $(this).addClass("select_tool_selected");
                    $(float_div).find(".select_tool_con_div").children().hide();
                    $(float_div).find(".select_tool_con_div .zhuzhi-wrap").show();

                    $this.changeShortHandler($(float_div).find(".select_tool_con_div .zhuzhi-wrap"));
                    $(float_div).find(".select_tool_con_div .webim-cont_box").show();
                    $this.changeShortHandler($(float_div).find(".select_tool_con_div .webim-cont_box"));
                    wqretrieveExtend.onLoadIng()
                });

                $(tag_label_div).unbind();
                $(tag_label_div).click(function () {
                    if ($(this).hasClass("select_tool_selected")) {
                        return;
                    }
                    $(".select_tool_tag_div").removeClass("select_tool_selected");

                    //20150413 直接点一下
                    var cont_root = $this.floatDiv.find(".label_box");
                    var ds = cont_root.find("a.tree-all span").eq(0);
                    if (ds) {
                        setTimeout(function () {
                            ds.click();
                            $wq.removeload()
                        }, 500);
                    }

                    $(this).addClass("select_tool_selected");
                    $(float_div).find(".select_tool_con_div").children().hide();
                    $(float_div).find(".select_tool_con_div .my-label-wrap").show();
                    $this.changeShortHandler($(float_div).find(".select_tool_con_div .my-label-wrap"));
                    //20150410 label 与    dp  box  分开
                    $(float_div).find(".select_tool_con_div .webim-cont_box_label").show();
                    $this.changeShortHandler($(float_div).find(".select_tool_con_div .webim-cont_box_label"));
                    wqretrieveExtend.onLoadIng()
                });

                $(tag_friends_div).unbind();
                $(tag_friends_div).click(function () {
                    if ($(this).hasClass("select_tool_selected")) {
                        return;
                    }
                    $(".select_tool_tag_div").removeClass("select_tool_selected");

                    //20150413
                    if ($(".friend_selected_bar .letter_bean.letter_bean_selected")) {
                        $(".friend_selected_bar .letter_bean.letter_bean_selected").click();
                    }
                    ;

                    $(this).addClass("select_tool_selected");
                    $(float_div).find(".select_tool_con_div").children().hide();
                    $(float_div).find(".select_tool_con_div .friend_selected_bar").show();
                    $(float_div).find(".select_tool_con_div .webim-cont_box-friend").show();
                    $this.changeShortHandler($(float_div).find(".select_tool_con_div .webim-cont_box-friend"));
                });

                tag_workers_div.off('click').click(function () {
                    if ($(this).hasClass("select_tool_selected")) {
                        return;
                    }
                    $(".select_tool_tag_div").removeClass("select_tool_selected");

                    $(this).addClass("select_tool_selected");
                    $(float_div).find(".select_tool_con_div").children().hide();
                    $(float_div).find(".select_tool_con_div .worker-wrap").show();

                    $(float_div).find(".select_tool_con_div .webim-cont_box_worker").show();
                    $this.changeShortHandler($(float_div).find(".select_tool_con_div .webim-cont_box_worker"));
                });

                //20150408 add select_tool_con_div
                var con_div = $('<div class="clearfix select_tool_con_div"></div>');
                body.append(con_div);
                var btn_div = $('<div class="webim_cancel"></div>');
                webim_title.append(btn_div);

                //20150408 搜索 -> 搜索手机号码/通行证帐号/姓名/邮箱
                var sch_input = $('<input class="user_top_serch1 search_cond" style="color:#aaaaaa; width:375px;height:27px;background:none" type="text" value="搜索手机号码/通行证帐号/姓名/邮箱"/>');
                sch_div.append(sch_input);
                var sch_btn = $('<input class="user_top_serch2 search_btn" type="button"/>');
                sch_div.append(sch_btn);

                //20160614项目成员
                var projectMan_div = $('<div class="project-wrap" style="margin-bottom:10px;"></div>');
                var project_scroll = $('<div class="dumascroll" style="height:310px;"></div>');
                projectMan_div.append(project_scroll);
                project_scroll.append('<div class="projectMan_box"></div>');
                con_div.append(projectMan_div);

                //20150408 企业通讯录
                var department_div = $('<div class="zhuzhi-wrap" style="margin-bottom:10px;"></div>');
                var depa_scroll = $('<div class="dumascroll" style="height:310px;"></div>');
                department_div.append(depa_scroll);
                depa_scroll.append('<div class="tree_box"></div>');
                con_div.append(department_div);

                //20150408 我的标签
                var my_label_div = $('<div class="my-label-wrap" style="margin-bottom:10px;"></div>');
                var label_scroll = $('<div class="dumascroll" style="height:310px;"></div>');
                my_label_div.append(label_scroll);
                label_scroll.append('<div class="label_box"></div>');
                con_div.append(my_label_div);
                $(my_label_div).hide();

                //20170516 工人
                var worker_div = $('<div class="worker-wrap" style="margin-bottom:10px;"></div>');
                var worker_scroll = $('<div class="dumascroll" style="height:310px;"></div>');
                worker_div.append(worker_scroll);
                worker_scroll.append('<div class="worker_box"></div>');
                con_div.append(worker_div);
                $(worker_div).hide();

                //20150408 190->192 去掉了边框
                var contact_div = $('<div class="dumascroll webim-cont_box" style="width:180px; margin:0 0 0 10px;"></div>');
                con_div.append(contact_div);

                //20150410
                var contact_div_label = $('<div class="dumascroll webim-cont_box_label " style="width:180px; margin:0 0 0 10px;"></div>');
                con_div.append(contact_div_label);
                $(contact_div_label).hide();

                //20150408 我的朋友组件 ABC选择器
                var friend_selected_bar = $('<div class="friend_selected_bar"></div>');
                var friend_selected_bar_contend = '<div class="friend_selected_bar_a_content">' +
                    '<div class="letter_bean letter_bean_selected">@</div>' +
                    '<div class="letter_bean">A</div>' +
                    '<div class="letter_bean">B</div>' +
                    '<div class="letter_bean">C</div>' +
                    '<div class="letter_bean">D</div>' +
                    '<div class="letter_bean">E</div>' +
                    '<div class="letter_bean">F</div>' +
                    '<div class="letter_bean">G</div>' +
                    '<div class="letter_bean">H</div>' +
                    '<div class="letter_bean">I</div>' +
                    '<div class="letter_bean">J</div>' +
                    '<div class="letter_bean">K</div>' +
                    '<div class="letter_bean">L</div>' +
                    '<div class="letter_bean">M</div>' +
                    '<div class="letter_bean">N</div>' +
                    '<div class="letter_bean">O</div>' +
                    '<div class="letter_bean">P</div>' +
                    '<div class="letter_bean">Q</div>' +
                    '<div class="letter_bean">R</div>' +
                    '<div class="letter_bean">S</div>' +
                    '<div class="letter_bean">T</div>' +
                    '<div class="letter_bean">U</div>' +
                    '<div class="letter_bean">V</div>' +
                    '<div class="letter_bean">W</div>' +
                    '<div class="letter_bean">X</div>' +
                    '<div class="letter_bean">Y</div>' +
                    '<div class="letter_bean">Z</div>' +
                    '<div class="letter_bean">#</div>' +
                    '</div>';
                friend_selected_bar.append(friend_selected_bar_contend);
                con_div.append(friend_selected_bar);
                $(friend_selected_bar).hide();
                //20150408 我的朋友组件
                var contact_div_friend = $('<div class="dumascroll webim-cont_box-friend" style="width:399px; margin:0 0 10px 0;"></div>');
                con_div.append(contact_div_friend);
                $(contact_div_friend).hide();

                var contact_div_worker = $('<div class="dumascroll webim-cont_box_worker " style="width:180px; margin:0 0 0 10px;"></div>');
                con_div.append(contact_div_worker);
                contact_div_worker.append('<div class="webim-container-worker"></div>')
                contact_div_worker.hide();

                contact_div.append('<div class="webim-container"></div>');
                contact_div_label.append('<div class="webim-container-label"></div>');
                contact_div_friend.append('<div class="webim-container-friend"></div>');

                btn_div.append('<a class="gg_box_fabg1 clean_btn" href="javascript:void(0)">清除</a>');
                btn_div.append('<a class="webim_cancel_btn cancel_btn" href="javascript:void(0)"></a>');
            }
            return float_div;
        },

        showProjectMember: function (projectTag) {
            var tag_div = $(".select_tool_tag");
            //是否显示项目成员tag
            this.showProjectTag(projectTag, tag_div);
            //有项目成员Tag 2016/06/14
            if (projectTag) {
                $(".zhuzhi-wrap").hide();
                $(".webim-cont_box").hide();
                $(".project-wrap").show();
                this.loadProjectMan(projectTag);
            } else {
                $(".zhuzhi-wrap").show();
                $(".webim-cont_box").show();
                $(".project-wrap").hide();
            }
        },

        // showOtherTag:function(options){
        //     var tag_div = $(".select_tool_tag");
        //    var projectTag = options.projectTag;
        //    var workerTag = options.workerTag;
        //
        //
        //    if(projectTag){
        //
        //         $(".zhuzhi-wrap").hide();
        //         $(".webim-cont_box").hide();
        //         $(".project-wrap").show();
        //         this.loadProjectMan(projectTag)
        //
        //     }else{
        //         $(".zhuzhi-wrap").show();
        //         $(".webim-cont_box").show();
        //         $(".project-wrap").hide();
        //     }
        //
        //     this.showOtherTag(options,tag_div);
        //
        // },

        handleLoadContactData: function (data, loop, labelBean, friendBean, workerBean) {
            var cont_root = this.getEmployeeContainer();
            if (labelBean) {
                cont_root = this.getLabelEmployeeContainer();
            }
            if (friendBean) {
                cont_root = this.getFriendsContainer();
            }
            if (workerBean) {
                cont_root = this.getWorkersSelectBar();
            }
            var contacts = data.list;
            var $this = this;

            var group_ul = cont_root.children("ul");
            if (contacts && contacts.length) {
                $.each(contacts, function (i, el) {
                    var item_li = $('<li></li>');
                    item_li.data("contact", el);
                    //20160216 兼容el.member_name @jin
                    if (!el.name) {
                        el.name = el.member_name;
                    }
                    item_li.append('<a href="javascript:void(0);" title="' + el.name + '">' + $wq.parseFace($wq.getOverFlowText("12px", el.name, 150), 's') + '</a>');
                    group_ul.append(item_li);
                    item_li.click(function () {
                        $this.onItemSelect(item_li);
                    });
                });
            } else {
                //20150326
                if (!loop) {
                    group_ul.find(".nonemployee_ee").remove();
                    group_ul.append('<span class="nonemployee_ee" style="padding: 25px 10px; text-align:center;display: block;">未找到匹配条件的员工</span>');
                } else {
                    group_ul.find(".nonemployee_ee").remove();
                    group_ul.append('<span class="nonemployee_ee" style="padding: 25px 10px; text-align:center;display: block;">已加载全部人员</span>');
                }

            }

            //20150413   处理无法拉动的情况
            if (cont_root) {
                var crh = parseInt(cont_root.css("height"));
                var brh = parseInt(cont_root.parent().next().css("height"));
                if (brh >= crh) {
                    cont_root.parent().next().find(".dumascroll_handle").addClass("short_bar");
                } else {
                    cont_root.parent().next().find(".dumascroll_handle").removeClass("short_bar");
                }
            }
        },

        //20150409 增加了多公司的情况
        handleLoadDpData: function (dpItems, options) {

            //20150409
            if (options && options.coId) {
                //指定企业
                var $this = this;
                var coName = options.coName;
                var coId = options.coId;
                var cont_company_root = $("#tree_box_company_" + coId);
                var tree = $wq.tree({
                    selector: cont_company_root,
                    text: coName,
                    unfold: true
                });
                var root = tree.getRoot();
                $this.loadDpEmployee({
                    "name": coName,
                    "company_id": coId
                });
            } else {
                //20160830 增加选择全公司
                if (this.settings.choosecCompany == true) {
                    // choosecom = 1 选择全公司
                    var choosecom;
                    var $this = this;
                    var cont_root = this.floatDiv.find(".tree_box");
                    //20150409  pedding
                    cont_root.children().remove();
                    var tree = $wq.tree({
                        selector: cont_root,
                        text: "全公司",
                        unfold: true,
                        choosecom: 1
                    });
                    var root = tree.getRoot();
                    if (!options || !options.dpId) {
                        root.click(function () {
                            $this.loadDpEmployee({
                                "name": "全公司"
                            });
                        });
                    }
                    var node_obj = this.floatDiv.find("a[choosecom=1]");
                    //20150515 test ie7兼容
                    var op_div = $('<div style="display:none; float:right;margin-right:8px;*margin-top:-19px;"></div>');
                    node_obj.append(op_div);

                    //20150515 test ie7兼容
                    var dp_op_btn = $('<div class="operate-dropdown" style="background-color:#fff;cursor:pointer; padding:0px 5px;"></div>');
                    dp_op_btn.addClass("check_dp");

                    op_div.prepend(dp_op_btn);

                    node_obj.hover(function () {

                        node_obj.addClass("t_posi_re");
                        op_div.show();
                    }, function () {
                        node_obj.removeClass("t_posi_re");
                        op_div.hide();
                    });
                    dp_op_btn.click(function () {
                        $this.onDpCompanySelect(node_obj);
                    });
                } else {
                    //默认
                    var $this = this;
                    var cont_root = this.floatDiv.find(".tree_box");
                    //20150409  pedding
                    cont_root.children().remove();
                    var tree = $wq.tree({
                        selector: cont_root,
                        text: "全公司",
                        unfold: true
                    });
                    var root = tree.getRoot();
                    if (!options || !options.dpId) {
                        root.click(function () {
                            $this.loadDpEmployee({
                                "name": "全公司"
                            });
                        });
                    }
                }
            }
            if (dpItems && dpItems.length) {
                $.each(dpItems, function (i, el) {
                    var dpId = el.dpId;
                    var dpName = el.dpName;

                    //20161107 修护部门重复
                    var old = $('.tree_box').find($('#tree_box_department_' + dpId));
                    if (old.length > 0) {
                        return;
                    }

                    //20151014 增加最大长度
                    var parems = {
                        "text": dpName,
                        "value": dpId,
                        expsigninCallBack: $this.expsigninCallBack,
                        expsignoutCallBack: $this.expsignoutCallBack,
                        textMax: 100
                    };
                    var parentId = el.parentId;
                    var dpNode;
                    if (parentId) {
                        if (tree.findChildNode(parentId) == null) {
                            //console.error("部门ID:"+dpId+" 父部门ID:"+parentId);
                            dpNode = tree.addChildNode(parems);
                        } else {
                            dpNode = tree.findChildNode(parentId).addChildNode(parems);
                        }
                    } else {
                        dpNode = tree.addChildNode(parems);
                    }

                    dpNode.data("dp", el);

                    dpNode.click(function () {
                        var dpId = this.value();
                        var dpName = this.text();
                        if (options && options.coId) {
                            $this.loadDpEmployee({
                                "id": dpId,
                                "name": dpName,
                                "company_id": coId
                            });
                        } else {
                            $this.loadDpEmployee({
                                "id": dpId,
                                "name": dpName
                            });
                        }

                    });
                    if ($this.settings.selectDp == true) {
                        var node_obj = dpNode.getNodeObj();
                        //20150515 test ie7兼容
                        var op_div = $('<div style="display:none; float:right;margin-right:8px;*margin-top:-19px;"></div>');
                        node_obj.append(op_div);

                        //20150515 test ie7兼容
                        var dp_op_btn = $('<div class="operate-dropdown" style="background-color:#fff;cursor:pointer; padding:0px 5px;"></div>');

                        if ($this.settings.outputMode == "attext") {
                            dp_op_btn.text("@部门");
                        } else {
                            dp_op_btn.addClass("check_dp");
                        }
                        op_div.prepend(dp_op_btn);

                        node_obj.hover(function () {
                            node_obj.addClass("t_posi_re");
                            op_div.show();
                        }, function () {
                            node_obj.removeClass("t_posi_re");
                            op_div.hide();
                        });

                        dp_op_btn.click(function () {
                            $this.onDpItemSelect(dpNode.getNodeObj());
                        });
                    }
                });
            }

            //20150413   处理无法拉动的情况
            if (cont_root) {
                var crh = parseInt(cont_root.css("height"));
                var brh = parseInt(cont_root.parent().next().css("height"));

                //20150413 直接选中第一个
                var onSearchTag = $(".select_tool_tag .select_tool_selected");
                if (onSearchTag.hasClass("tag_label") || onSearchTag.hasClass("tag_friends")) {

                } else {
                    //直接选中第一个
                    if (!options || !options.dpId) {
                        var ds = cont_root.find("a.tree-all span").eq(0);
                        ds.click();
                    } else {
                        this.cleanItems();
                    }
                }

            }

            //增加为分配部门
            var old = $('.tree_box').find($('#tree_box_department_-1'));
            if (old.length == 0) {
                var UnDepartment = tree.addChildNode({
                    text: "未分配部门",
                    value: -1
                });
                UnDepartment.click(function () {
                    var dpId = this.value();
                    var dpName = this.text();
                    if (options && options.coId) {
                        $this.loadDpEmployee({
                            "id": dpId,
                            "name": dpName,
                            "company_id": coId
                        });
                    } else {
                        $this.loadDpEmployee({
                            "id": dpId,
                            "name": dpName
                        });
                    }
                });
            }
        },

        //20150410 加载标签
        handleLoadLabelData: function (lbItems, options) {
            var $this = this;
            var cont_root = this.floatDiv.find(".label_box");
            cont_root.children().remove();
            if (lbItems && lbItems.length) {
                $.each(lbItems, function (i, el) {
                    var title = el.title;
                    var lid = el.lid;
                    var old = $('#label_box_label_' + el.lid);
                    if (old.length > 0) {
                        //20150409 排重  重复加载的情况有待修改
                        return;
                    }
                    var cont_label_root = $("<div id='label_box_label_" + lid + "' class='label_box_label'></div>");
                    cont_root.append(cont_label_root);
                    //20151014 增加最大长度
                    var tree = $wq.tree({
                        selector: cont_label_root,
                        text: title,
                        unfold: true,
                        textMax: 100
                    });
                    var root = tree.getRoot();

                    //20150410 标签点击事件
                    root.click(function () {
                        //var item = $(this);
                        //20150410pending
                        $this.loadLabelEmployee({
                            "id": 0,
                            "name": title,
                            "lid": lid
                        });
                    });

                    //20150410 @标签
                    //20150410 暂时使用 selectDp判断
                    if ($this.settings.selectDp == true) {
                        var node_obj = root.target.find(".tree-all");
                        node_obj.data("lb", {
                            "title": title,
                            "lid": lid
                        });
                        var op_div = $('<div style="display:none; float:right; margin-right:-30px;"></div>');
                        node_obj.append(op_div);

                        var dp_op_btn = $('<span class="operate-dropdown" style="background-color:#fff;cursor:pointer; padding:0px 5px;"></span>');

                        if ($this.settings.outputMode == "attext") {
                            dp_op_btn.text("@标签");
                        } else {
                            dp_op_btn.addClass("check_dp");
                        }
                        op_div.prepend(dp_op_btn);

                        node_obj.hover(function () {
                            node_obj.addClass("t_posi_re");
                            op_div.show();
                        }, function () {
                            node_obj.removeClass("t_posi_re");
                            op_div.hide();
                        });

                        dp_op_btn.click(function () {
                            $this.onLBItemSelect(node_obj);
                        });
                    }
                });
            }

            //20150413   处理无法拉动的情况
            if (cont_root) { //拉动 +第一个
                var crh = parseInt(cont_root.css("height"));
                var brh = parseInt(cont_root.parent().next().css("height"));
                if (brh >= crh) {
                    cont_root.parent().next().find(".dumascroll_handle").addClass("short_bar");
                } else {
                    cont_root.parent().next().find(".dumascroll_handle").removeClass("short_bar");
                }

                //20150413 直接选中第一个
                var onSearchTag = $(".select_tool_tag .select_tool_selected");
                if (onSearchTag.hasClass("tag_label") && cont_root.find("a.tree-all span") && cont_root.find("a.tree-all span").length > 0) {
                    //直接选中第一个
                    var ds = cont_root.find("a.tree-all span").eq(0);
                    ds.click();
                } else {
                    this.getLabelEmployeeContainer().children().remove();
                }
            }

        },

        //20160614 加载项目成员信息
        handleLoadProjectManData: function (item) {
            var $this = this;
            var cont_root = this.floatDiv.find(".projectMan_box");
            cont_root.children().remove();
            var group_ul = $('<ul class="contact_group clearfix" style="display: block;"></ul>');
            cont_root.append(group_ul);
            if (item && item.length) {
                $.each(item, function (i, el) {
                    el.mid = el.member_id;
                    var li = $('<li id="pman_' + el.member_id + '" >');
                    var a = $('<a href="javascript:void(0);" title="' + el.name + '">' + el.name + '</a>')
                    li.append(a);
                    li.data("contact", el);
                    li.click(function () {
                        $this.onItemSelect(li);
                    });
                    group_ul.append(li);
                });
            }
        },

        //20150409 加载企业信息
        handleLoadCompanyData: function (cos) {
            var $this = this;
            var cont_root = this.floatDiv.find(".tree_box");
            //20150409
            cont_root.children().remove();
            if (cos && cos.length) {
                $.each(cos, function (i, el) {
                    var coName = el.coName;
                    var coId = el.coId;
                    var old = $('#tree_box_company_' + el.coId);
                    if (old.length > 0) {
                        //20150409 排重  重复加载的情况有待修改
                        return;
                    }
                    var cont_company_root = $("<div id='tree_box_company_" + el.coId + "' class='tree_box_company'></div>");
                    cont_root.append(cont_company_root);
                    var tree = $wq.tree({
                        selector: cont_company_root,
                        text: coName,
                        unfold: true
                    });
                    var root = tree.getRoot();
                    root.click(function () {
                        var options = {
                            "root": cont_company_root,
                            "coName": coName,
                            "coId": coId
                        };
                        $this.loadDepartment(options);
                    });
                });
            }

            //20150413   处理无法拉动的情况
            if (cont_root) {
                var crh = parseInt(cont_root.css("height"));
                var brh = parseInt(cont_root.parent().next().css("height"));

                //20150413 直接选中第一个
                var onSearchTag = $(".select_tool_tag .select_tool_selected");
                if (onSearchTag.hasClass("tag_label") || onSearchTag.hasClass("tag_friends")) {

                } else {
                    //直接选中第一个
                    var ds = cont_root.find("a.tree-all span").eq(0);
                    ds.click();
                }
            }
        },

        handleLoadWorkerData: function (data) {
            var $this = this;
            var cont_root = this.floatDiv.find(".worker_box");
            //20150409
            cont_root.children().remove();

            // choosecom = 1 选择全公司
            var allWorker;
            var $this = this;
            var cont_root = this.floatDiv.find(".worker_box");
            //20150409  pedding
            cont_root.children().remove();


            var cont_worker_root = $("<div id='tree_box_worker_' class='tree_box_company'></div>");
            cont_root.append(cont_worker_root);
            var tree = $wq.tree({
                selector: cont_worker_root,
                text: "全体工人",
                unfold: true,
                allWorker: 1
            });


            var root = tree.getRoot();

            var node_obj = this.floatDiv.find(".tree-all");
            //20150515 test ie7兼容
            var op_div = $('<div style="display:none; float:right;margin-right:8px;*margin-top:-19px;"></div>');
            node_obj.append(op_div);

            //20150515 test ie7兼容
            var dp_op_btn = $('<div class="operate-dropdown" style="background-color:#fff;cursor:pointer; padding:0px 5px;"></div>');
            dp_op_btn.addClass("check_dp");

            op_div.prepend(dp_op_btn);

            if ($this.settings.choosecAllWorker == true) {
                node_obj.hover(function () {
                    node_obj.addClass("t_posi_re");
                    op_div.show();
                }, function () {
                    node_obj.removeClass("t_posi_re");
                    op_div.hide();
                });
                dp_op_btn.click(function () {
                    $this.onAllWorker(node_obj);
                });
            }


            if (data && data.length) {
                $.each(data, function (i, el) {

                    var name = el.name;
                    var id = el.id;
                    var type = el.type;
                    var old = $('#tree_box_worker_' + id);
                    if (old.length > 0) {
                        //20150409 排重  重复加载的情况有待修改
                        return;
                    }

                    var parems = {
                        "text": name,
                        "value": id,
                        expsigninCallBack: $this.expsigninCallBack,
                        expsignoutCallBack: $this.expsignoutCallBack,
                        textMax: 90
                    };
                    var parentId = el.parentId;
                    var dpNode;
                    if (parentId) {
                        if (tree.findChildNode(parentId) == null) {
                            //console.error("部门ID:"+dpId+" 父部门ID:"+parentId);
                            dpNode = tree.addChildNode(parems);
                        } else {
                            dpNode = tree.findChildNode(parentId).addChildNode(parems);
                        }
                    } else {
                        dpNode = tree.addChildNode(parems);
                    }

                    // var root = tree.getRoot();
                    dpNode.click(function () {
                        console.log($(this))
                        var options = {
                            "root": this.target,
                            "name": name,
                            "id": id,
                            "type": type,
                            "tree": this
                        };
                        $this.loadGroups(options);
                        $this.loadWorkerManData({
                            projectId: id,
                            name: name
                        })
                    });

                    if ($this.settings.chooseProject == true) {
                        var node_obj = $this.floatDiv.find(".worker-wrap").find(".tree-all");
                        //20150515 test ie7兼容
                        var op_div = $('<div class="op_div_worker" style="display:none; float:right;margin-right:8px;*margin-top:-19px;"></div>');
                        node_obj.append(op_div);

                        //20150515 test ie7兼容
                        var dp_op_btn = $('<div class="operate-dropdown" style="background-color:#fff;cursor:pointer; padding:0px 5px;"></div>');
                        dp_op_btn.addClass("check_dp");

                        op_div.prepend(dp_op_btn);

                        node_obj.hover(function () {
                            $thisObj = $(this);
                            $thisObj.addClass("t_posi_re");
                            $thisObj.find(".op_div_worker").show();
                        }, function () {
                            $thisObj.removeClass("t_posi_re");
                            $thisObj.find(".op_div_worker").hide();
                        });
                        dp_op_btn.click(function () {
                            $this.onPersonProjectSelect($(this).parent().parent());
                        });
                    }

                });
            }

            //20150413   处理无法拉动的情况
            if (cont_root) {
                var crh = parseInt(cont_root.css("height"));
                var brh = parseInt(cont_root.parent().next().css("height"));

                //20150413 直接选中第一个
                var onSearchTag = $(".select_tool_tag .select_tool_selected");
                if (onSearchTag.hasClass("tag_label") || onSearchTag.hasClass("tag_friends")) {

                } else {
                    //直接选中第一个
                    var ds = cont_root.find("a.tree-all span").eq(0);
                    ds.click();
                }
            }
        },

        //加载班组
        handleLoadGroupData: function (groups, options) {
            var $this = this;
            var pjId = options.pjId;
            var tree = options.tree;
            var cont_root = this.floatDiv.find(".worker_box");

            if (groups && groups.length) {
                $.each(groups, function (i, el) {
                    var id = el.id;
                    var name = el.name;

                    //20161107 修护部门重复
                    var old = $('.worker_box').find($('#tree_box_group_' + id));
                    if (old.length > 0) {
                        return;
                    }

                    //20151014 增加最大长度
                    var parems = {
                        "text": name,
                        "value": id,
                        expsigninCallBack: $this.expsigninCallBack,
                        expsignoutCallBack: $this.expsignoutCallBack,
                        textMax: 100
                    };

                    var dpNode = tree.addProjectChildNode(parems);
                    ;

                    dpNode.data("group", el);
                    dpNode.click(function () {
                        var id = this.value();
                        var name = this.text();
                        $this.loadWorkerManData({
                            groupId: id,
                            name: name
                        })
                    });

                    if ($this.settings.selectDp == true) {
                        var node_obj = dpNode.getNodeObj();
                        //20150515 test ie7兼容
                        var op_div = $('<div style="display:none; float:right;margin-right:8px;*margin-top:-19px;"></div>');
                        node_obj.append(op_div);

                        //20150515 test ie7兼容
                        var dp_op_btn = $('<div class="operate-dropdown" style="background-color:#fff;cursor:pointer; padding:0px 5px;"></div>');

                        if ($this.settings.outputMode == "attext") {
                            dp_op_btn.text("@班组");
                        } else {
                            dp_op_btn.addClass("check_dp");
                        }
                        op_div.prepend(dp_op_btn);

                        node_obj.hover(function () {
                            node_obj.addClass("t_posi_re");
                            op_div.show();
                        }, function () {
                            node_obj.removeClass("t_posi_re");
                            op_div.hide();
                        });

                        dp_op_btn.click(function () {
                            $this.onGroupSelect(dpNode.getNodeObj());
                        });
                    }


                });
            }

            //20150413   处理无法拉动的情况
            if (cont_root) {
                var crh = parseInt(cont_root.css("height"));
                var brh = parseInt(cont_root.parent().next().css("height"));

                //20150413 直接选中第一个
                var onSearchTag = $(".select_tool_tag .select_tool_selected");
                if (onSearchTag.hasClass("tag_label") || onSearchTag.hasClass("tag_friends")) {

                } else {
                    //直接选中第一个
                    if (!options || !options.gId) {
                        var ds = cont_root.find(".group_li:eq(0) span");
                        ds.click();
                    } else {
                        this.cleanItems();
                    }
                }

            }


        },

        handleSelectContactItem: function (item) {
            item.children("a").addClass("hover");
            var outputMode = this.settings.outputMode;
            /** #20150907 4.2.2 push 审批  **/
            var contactMode = this.settings.contactMode;
            var type = "contact"; //w
            if (contactMode && contactMode == "normal") {
                type = "contact";
            } else if (contactMode && contactMode == "drtcontact") {
                type = "drtcontact";
            }

            if (outputMode == "key-val") {
                this.outputKeyVal(item, type);
            } else if (outputMode == "tag") {
                this.outputTag(item, type);
            } else if (outputMode == "attext") {
                this.outputAtText(item, type);
            }
        },

        handleSelectWorkerItem: function (item) {
            item.children("a").addClass("hover");
            var outputMode = this.settings.outputMode;
            /** #20150907 4.2.2 push 审批  **/
            var contactMode = this.settings.contactMode;
            var type = "worker"; //w


            if (outputMode == "key-val") {
                this.outputKeyVal(item, type);
            } else if (outputMode == "tag") {
                this.outputTag(item, type);
            } else if (outputMode == "attext") {
                this.outputAtText(item, type);
            }
        },

        handleSelectPersonProjectItem: function (item) {
            var outputMode = this.settings.outputMode;
            /** #20150907 4.2.2 push 审批  **/
            var contactMode = this.settings.contactMode;
            var type = "personProject"; //w


            if (outputMode == "key-val") {
                this.outputKeyVal(item, type);
            } else if (outputMode == "tag") {
                this.outputTag(item, type);
            } else if (outputMode == "attext") {
                this.outputAtText(item, type);
            }
        },

        // 全公司
        handleSelectCompanyItem: function (item) {
            item.addClass("current");
            var outputMode = this.settings.outputMode;
            var type = "pb";
            if (outputMode == "key-val") {
                this.outputKeyVal(item, type);
            } else if (outputMode == "tag") {
                this.outputTag(item, type);
            } else if (outputMode == "attext") {
                this.outputAtText(item, type);
            }
        },

        handleSelectAllworker: function (item) {
            item.addClass("current");
            var outputMode = this.settings.outputMode;
            var type = "allWorker";
            if (outputMode == "key-val") {
                this.outputKeyVal(item, type);
            } else if (outputMode == "tag") {
                this.outputTag(item, type);
            } else if (outputMode == "attext") {
                this.outputAtText(item, type);
            }
        },

        // 部门
        handleSelectDpItem: function (item) {
            item.addClass("current");

            var outputMode = this.settings.outputMode;
            var type = "dp";
            if (outputMode == "key-val") {
                this.outputKeyVal(item, type);
            } else if (outputMode == "tag") {
                this.outputTag(item, type);
            } else if (outputMode == "attext") {
                this.outputAtText(item, type);
            }
        },

        // 班组
        handleSelectGroupItem: function (item) {
            item.addClass("current");

            var outputMode = this.settings.outputMode;
            var type = "group";
            if (outputMode == "key-val") {
                this.outputKeyVal(item, type);
            } else if (outputMode == "tag") {
                this.outputTag(item, type);
            } else if (outputMode == "attext") {
                this.outputAtText(item, type);
            }
        },

        //20150410 标签
        handleSelectLBItem: function (item) {
            item.addClass("current");

            var outputMode = this.settings.outputMode;
            var type = "lb";
            if (outputMode == "key-val") {
                this.outputKeyVal(item, type);
            } else if (outputMode == "tag") {
                this.outputTag(item, type);
            } else if (outputMode == "attext") {
                this.outputAtText(item, type);
            }
        },

        init: function () {
            var $this = this;
            this.inputElem.unbind();
            this.inputElem.focus(function () {
                var int = $(this);
                if (int.val() == this.defaultValue) {
                    int.css('color', 'black').val('');
                }
            }).blur(function () {
                var int = $(this);
                if (int.val() == '') {
                    int.css('color', '#aaaaaa').val(this.defaultValue);
                }
            });

            this.schBtn.unbind("click").click(function () {
                $this.onSearch();
            });

            this.inputElem.keydown(function (e) {
                if (e.keyCode == 13) {
                    $this.onSearch();
                }
            });

            this.cleanBtn.unbind("click").click(function () {
                if ($this.outputElem.length) {
                    if ($this.settings.outputMode == "tag") {
                        $this.outputElem.find("span.tag").remove();
                    } else if ($this.settings.outputMode == "key-val") {
                        $this.outputElem.val("");
                        $this.outputElem.removeAttr("mid");
                        $this.outputElem.removeAttr("dpid");
                    }
                    $this.onChanged();
                }
            });
            if (this.settings.clean == false)
                this.cleanBtn.hide();
            else
                this.cleanBtn.hide();

            this.cancelBtn.unbind("click").click(function () {
                $this.close();
            });
            var projectTag = this.settings.projectTag;
            if (!projectTag) {
                this.onLoadIng()
            }
        },

        onLoadIng: function () {
            $wq.loading({
                target: $('.select_tool_con_div'),
                position: 'absolute',
                height: '320px'
            });
        },

        getDepartmentContainer: function () {
            return this.floatDiv.find(".tree_box");
        },

        getDepartmentTree: function () {
            var target = this.floatDiv.find(".tree_box");
            var tree = $wq.getTree(target);
        },

        getEmployeeContainer: function () {
            return this.floatDiv.find(".webim-container");
        },

        //20150410 获取标签成员容器
        getLabelEmployeeContainer: function () {
            return this.floatDiv.find(".webim-container-label");
        },

        //20150410 获取好友成员容器
        getFriendsContainer: function () {
            return this.floatDiv.find(".webim-container-friend");
        },

        //20150410 获取好友字母选择器
        getFriendsSelectBar: function () {
            return this.floatDiv.find(".friend_selected_bar");
        },

        //获取工人通讯录容器
        getWorkersSelectBar: function () {
            return this.floatDiv.find(".webim-container-worker");
        },

        getProjectManContainer: function () {
            return this.floatDiv.find(".projectMan_box");
        },

        //20150409 可能要改变执行位置
        loadDepartment: function (options) {
            var data;
            if (this.dp) {
                var dpId = this.dp.attr("did");
                data = {
                    "dpId": dpId
                };
                if (dpId) {
                    if (options) {
                        options.dpId = dpId;
                    } else {
                        options = {
                            "dpId": dpId
                        };
                    }
                }
            }
            //data = {"company_id":4}
            if (options && options.coId) {
                data = {
                    "company_id": options.coId
                }
            }

            var authType = this.settings.authType;
            if (authType && authType == "auth") {
                data = $.extend(data, {
                    "authType": "auth"
                });
                var busType = this.settings.busType;
                data = $.extend(data, {
                    "busType": busType
                });
            }
            var dpItems = $wq.getJsonData({
                url: this.getUrl("department"),
                data: data,
                dataName: "query",
                key: "result"
            });
            if (options) {
                this.handleLoadDpData(dpItems, options);
            } else {
                this.handleLoadDpData(dpItems);
            }
        },

        //20160614 取得项目成员
        loadProjectMan: function (pId, keyword) {
            var data = {
                project_id: pId,
                schCond: keyword
            };
            var manItems = $wq.getJsonData({
                url: this.getUrl("projectmans"),
                data: data,
                dataName: "query",
                key: "list"
            });
            this.handleLoadProjectManData(manItems);
        },

        loadGroups: function (option) {
            var root = option.root;
            var name = option.name;
            var id = option.id;
            var type = option.type;

            var url = this.getUrl("workerContact");
            var groups = $wq.getJsonData({
                url: url,
                data: {
                    "constructionProjectId": id
                },
                dataName: "query",
                key: "result"
            });
            this.handleLoadGroupData(groups, {
                pjId: id,
                tree: option.tree
            });

        },

        //20150409 取得企业列表
        loadCompany: function () {
            var data;
            var coItems = $wq.getJsonData({
                url: this.getUrl("findallowncompany"),
                data: data,
                dataName: "query",
                key: "result"
            });
            this.handleLoadCompanyData(coItems);
        },

        //20150410 options 取得标签列表
        loadLabel: function (options) {
            var data;
            var companyType = this.settings.companyType;
            if (companyType && companyType == "own") {
                data = {
                    "companyType": companyType
                };
                if (options && options.coId) {
                    data = {
                        "company_id": options.coId,
                        "companyType": companyType
                    };
                }
            }

            var lbItems = $wq.getJsonData({
                url: this.getUrl("findLabel"),
                data: data,
                dataName: "query",
                key: "result"
            });
            //20150410 options
            if (options) {
                this.handleLoadLabelData(lbItems, options);
            } else {
                this.handleLoadLabelData(lbItems);
            }

        },

        //20150410 options 取得好友模块
        loadFriendsModule: function (options) {
            var friendsSelectBar = this.getFriendsSelectBar();
            var $this = this;
            friendsSelectBar.find(".letter_bean").unbind().click(function () {
                var h = $(this).html();
                $this.loadFriends({
                    "friendFletter": h
                });
            });
        },

        //取得工人模块
        loadWorkModule: function (options) {
            var coItems = $wq.getJsonData({
                url: this.getUrl("workerContact"),
                dataName: "query",
                key: "result"
            });
            this.handleLoadWorkerData(coItems);
        },

        loadDpEmployee: function (dp) {
            var $this = this;
            var emp_container = this.getEmployeeContainer();
            emp_container.children().remove();
            var dp_h = $('<h3 class="contact_group_h"></h3>');
            //dp_h.attr("dpid", dpId);
            //20150615 部门名称截取 $wq.getOverFlowText("14px",title,100) 增加title
            //20150723 改为95
            dp_h.append('<span class="span_txt1" title="' + dp.name + '" dpid="' + dp.id + '" coid="' + dp.company_id + '" >' + $wq.getOverFlowText("14px", dp.name, 85) + '<em class="span_txt"></em></span>');
            emp_container.append(dp_h);
            var group_ul = $('<ul class="contact_group clearfix" style="display: block;"></ul>');
            //group_ul.attr("dpid", dpId);
            emp_container.append(group_ul);
            if (this.settings.multiple == true) {
                var dp_op_btn = $('<a class="dp_op_btn span_r check_add" href="javascript:void(0)" style="display: none;"></a>');
                dp_h.prepend(dp_op_btn);
                dp_op_btn.click(function () {
                    var c_items = group_ul.children("li");
                    if (c_items.length)
                        $this.onItemSelect(c_items);
                });
                dp_h.hover(function () {
                    //20150616 有未载入的项 就不能全选
                    var p_items = group_ul.children(".employee_pending");
                    if (p_items.length && p_items.length > 0) {

                    } else {
                        dp_op_btn.show();
                    }
                }, function () {
                    dp_op_btn.hide();
                });
            }
            //20150409 增加company_id
            if (dp.company_id) {
                var schCond = {
                    "dpId": dp.id,
                    "company_id": dp.company_id
                };
            } else {
                var schCond = {
                    "dpId": dp.id
                };
            }

            /**
             * 20150423
             * 增加权限限制标识
             */
            var authType = this.settings.authType;
            if (authType && authType == "auth") {
                schCond = $.extend(schCond, {
                    "authType": "auth"
                });
            }

            this.retrieve(schCond);
        },

        //20150410 载入标签成员
        loadLabelEmployee: function (lb) {
            var $this = this;
            var emp_container = this.getLabelEmployeeContainer();
            emp_container.children().remove();
            var lb_h = $('<h3 class="contact_group_h"></h3>');
            //lb_h.attr("lbid", lbId);
            //20150826 标签名称截取 $wq.getOverFlowText("14px",lb.name,100) 增加title
            lb_h.append('<span class="span_txt1" title="' + lb.name + '" lang="' + lb.lid + '" langa="' + lb.id + '">' + $wq.getOverFlowText("14px", lb.name, 95) + '<em class="span_txt"></em></span>');
            emp_container.append(lb_h);
            var group_ul = $('<ul class="contact_group clearfix" style="display: block;"></ul>');
            //group_ul.attr("lbid", lbId);
            emp_container.append(group_ul);
            if (this.settings.multiple == true) {
                var lb_op_btn = $('<a class="lb_op_btn span_r check_add" href="javascript:void(0)" style="display: none;"></a>');
                lb_h.prepend(lb_op_btn);
                lb_op_btn.click(function () {
                    var c_items = group_ul.children("li");
                    if (c_items.length)
                        $this.onItemSelect(c_items);
                });

                //    				lb_h.hover(function(){
                //    					lb_op_btn.show();
                //        			},function(){
                //        				lb_op_btn.hide();
                //        			});
            }
            //20150410 增加lid
            if (lb.lid) {
                var schCond = {
                    "lbId": lb.id,
                    "lid": lb.lid
                };
            } else {
                var schCond = {
                    "lbId": lb.id
                };
            }
            //20150410 labelBean
            var url = this.getUrl("labelcontact");
            var labelBean = {
                "url": url
            };
            this.retrieve(schCond, labelBean);
        },

        //20150410 载入好友成员
        loadFriends: function (fs) {
            var $this = this;
            var emp_container = this.getFriendsContainer();
            emp_container.children().remove();
            var lb_h = $('<h3 class="contact_group_h"></h3>');
            //lb_h.attr("lbid", lbId);
            //20150410
            var title = fs.friendFletter;
            if (fs.friendFletter == "@") {
                title = "全部";
                fs.friendFletter = "";
            }
            //20150615
            lb_h.append('<span class="span_txt1" lang="' + title + '">' + title + '<em class="span_txt"></em></span>');
            emp_container.append(lb_h);
            var group_ul = $('<ul class="contact_group clearfix" style="display: block;"></ul>');
            //group_ul.attr("lbid", lbId);
            emp_container.append(group_ul);
            if (this.settings.multiple == true) {
                var lb_op_btn = $('<a class="lb_op_btn span_r check_add" href="javascript:void(0)" style="display: none;"></a>');
                lb_h.prepend(lb_op_btn);
                lb_op_btn.click(function () {
                    var c_items = group_ul.children("li");
                    if (c_items.length)
                        $this.onItemSelect(c_items);
                });
                //    				lb_h.hover(function(){
                //    					lb_op_btn.show();
                //        			},function(){
                //        				lb_op_btn.hide();
                //        			});
            }
            //20150410 增friendFletter
            if (fs.friendFletter) {
                var schCond = {
                    "friendFletter": fs.friendFletter
                };
            } else {
                var schCond = {};
            }
            //20150410 labelBean
            var url = this.getUrl("friendcontact");
            var friendBean = {
                "url": url
            };
            this.retrieve(schCond, null, friendBean);
        },

        loadWorkerManData: function (g) {
            var $this = this;
            var worker_container = this.getWorkersSelectBar();
            worker_container.children().remove();
            var lb_h = $('<h3 class="contact_group_h"></h3>');
            //lb_h.attr("lbid", lbId);
            //20150826 标签名称截取 $wq.getOverFlowText("14px",lb.name,100) 增加title
            lb_h.append('<span class="span_txt1" title="' + g.name + '" langa="' + g.id + '">' + $wq.getOverFlowText("14px", g.name, 95) + '<em class="span_txt"></em></span>');
            worker_container.append(lb_h);
            var group_ul = $('<ul class="contact_group clearfix" style="display: block;"></ul>');
            //group_ul.attr("lbid", lbId);
            worker_container.append(group_ul);
            if (this.settings.multiple == true) {
                var lb_op_btn = $('<a class="lb_op_btn span_r check_add" href="javascript:void(0)" style="display: none;"></a>');
                lb_h.prepend(lb_op_btn);
                lb_op_btn.click(function () {
                    var c_items = group_ul.children("li");
                    if (c_items.length)
                        $this.onWorkerSelect(c_items);
                });
                //                    lb_h.hover(function(){
                //                        lb_op_btn.show();
                //                    },function(){
                //                        lb_op_btn.hide();
                //                    });
            }

            var schCond = {
                "groupId": g.groupId,
                "projectId": g.projectId
            };

            //20150410 labelBean
            var url = this.getUrl("findWorkers");
            var workerBean = {
                "url": url
            };
            this.retrieve(schCond, null, null, workerBean);

        },

        // 全公司
        onDpCompanySelect: function (dpCompany) {
            if (this.settings.choosecCompany == false)
                return;

            if (this.settings.selectCall)
                this.settings.selectCall.call(this, dpCompany);

            this.handleSelectCompanyItem(dpCompany);

            if (this.settings.selectedCall)
                this.settings.selectedCall.call(this, dpCompany);

            if (this.settings.multiple != true)
                $.weqiafloat.hide();
            this.onChanged();
        },

        // 部门
        onDpItemSelect: function (dpItem) {

            if (this.settings.selectDp == false)
                return;

            if (this.settings.selectCall)
                this.settings.selectCall.call(this, dpItem);

            this.handleSelectDpItem(dpItem);

            if (this.settings.selectedCall)
                this.settings.selectedCall.call(this, dpItem);

            if (this.settings.multiple != true)
                $.weqiafloat.hide();
            this.onChanged();
        },

        onLBItemSelect: function (lbItem) {
            if (this.settings.selectDp == false)
                return;

            if (this.settings.selectCall)
                this.settings.selectCall.call(this, lbItem);

            this.handleSelectLBItem(lbItem);

            if (this.settings.selectedCall)
                this.settings.selectedCall.call(this, lbItem);

            if (this.settings.multiple != true)
                $.weqiafloat.hide();
            this.onChanged();
        },

        onItemSelect: function (items) {
            var $this = this;
            if (this.settings.selectCall)
                this.settings.selectCall.call(this, items);

            if (this.ajaxCall)
                return false

            items.each(function (i, el) {
                var item = $(el);

                //20160207 增加是否加入判断辨识 isIgnore @jin
                if (!item.data().contact.isIgnore) {
                    //判断是否为工人
                    var data = item.data("contact");
                    if (data && data.gId) {
                        $this.handleSelectWorkerItem(item);
                    } else {
                        $this.handleSelectContactItem(item);
                    }
                }
            });

            if (this.settings.selectedCall)
                this.settings.selectedCall.call(this, items);
            if (this.settings.multiple == false)
                $.weqiafloat.hide();
            this.onChanged();
        },

        onPersonProjectSelect: function (items) {
            var $this = this;

            if (this.settings.selectCall)
                this.settings.selectCall.call(this, items);

            items.each(function (i, el) {
                var item = $(el);
                var obj = {
                    id: item.attr('value'),
                    name: item.text()
                }
                $this.handleSelectPersonProjectItem(obj);
            });

            if (this.settings.selectedCall)
                this.settings.selectedCall.call(this, items);
            if (this.settings.multiple == false)
                $.weqiafloat.hide();
            this.onChanged();
        },

        onWorkerSelect: function (items) {
            var $this = this;

            if (this.settings.selectCall)
                this.settings.selectCall.call(this, items);

            items.each(function (i, el) {
                var item = $(el);
                //20160207 增加是否加入判断辨识 isIgnore @jin
                if (!item.data().contact.isIgnore) {
                    $this.handleSelectWorkerItem(item);
                }
            });

            if (this.settings.selectedCall)
                this.settings.selectedCall.call(this, items);
            if (this.settings.multiple == false)
                $.weqiafloat.hide();
            this.onChanged();
        },

        onGroupSelect: function (gpItem) {
            if (this.settings.selectDp == false)
                return;

            if (this.settings.selectCall)
                this.settings.selectCall.call(this, gpItem);

            this.handleSelectGroupItem(gpItem);

            if (this.settings.selectedCall)
                this.settings.selectedCall.call(this, gpItem);

            if (this.settings.multiple != true)
                $.weqiafloat.hide();
            this.onChanged();
        },

        // 全工人
        onAllWorker: function (allWorker) {
            if (this.settings.choosecCompany == false)
                return;

            if (this.settings.selectCall)
                this.settings.selectCall.call(this, allWorker);

            this.handleSelectAllworker(allWorker);

            if (this.settings.selectedCall)
                this.settings.selectedCall.call(this, allWorker);

            if (this.settings.multiple != true)
                $.weqiafloat.hide();
            this.onChanged();
        },

        onLoad: function () {
            //20150409
            var ssetting = this.settings;
            var scompanyType = this.settings.companyType;
            var sauthType = this.settings.authType;
            var slabelType = this.settings.labelType;
            var sfriendType = this.settings.friendType;
            var projectTag = this.settings.projectTag;
            var sworkTypr = this.settings.workType;
            this.cleanDpTree();
            this.cleanSearchBean();

            //20150409 单企业与多企业 显示不同
            if (this.settings.companyType == "own" || sfriendType == "no") {
                $(".select_tool_tag_div").addClass("own");
                if ($(".tag_friends").hasClass("select_tool_selected")) {
                    $(".tag_enterprise").click();
                }
            } else {
                $(".select_tool_tag_div").removeClass("own");
            }

            //20150409 有无labelType时显示不同   显示不同
            if (!slabelType || (slabelType && slabelType == "yes")) {
                $(".select_tool_tag_div").addClass("label");
            } else {
                $(".select_tool_tag_div").addClass("nolabel");
            }

            //20160614
            if (projectTag) {
                this.loadProjectMan(projectTag);
            }
            //20150409
            if (scompanyType && scompanyType == "all") {
                this.loadCompany();
            } else {
                this.loadDepartment();
            }

            //20150410  载入Label
            //20150519 有权限时  不加载
            if (!slabelType || (slabelType && slabelType == "yes")) {
                this.loadLabel();
            }
            var emp_container = this.getEmployeeContainer();
            var label_emp_container = this.getLabelEmployeeContainer();
            //20150410 朋友选择器 激活
            if (scompanyType && scompanyType == "all") {
                this.loadFriendsModule();
            }

            //激活工人通讯录
            if (sworkTypr == "true") {
                this.loadWorkModule();
            }
            $wq.removeload();
        },

        onSearch: function () {
            var val = this.inputElem.val();
            //20150408 搜索 -> 搜索手机号码/通行证帐号/姓名/邮箱
            val = (val == "搜索手机号码/通行证帐号/姓名/邮箱" ? "" : val);
            var schCond;
            if (val) {
                schCond = {
                    "schCond": val
                };

                //20150413 搜索   分别对应3个窗口
                var onSearchTag = $(".select_tool_tag .select_tool_selected");
                var labelBean = null;
                var friendBean = null;
                if (onSearchTag.hasClass("tag_label")) {
                    var url = this.getUrl("labelcontact");
                    var labelc = this.getLabelEmployeeContainer();
                    labelc.find(".contact_group").children().remove();
                    var databean = labelc.find(".span_txt1");
                    var lbId = databean.attr("langa");
                    var lid = databean.attr("lang");
                    schCond.lbId = lbId || null;
                    schCond.lid = lid || null;
                    labelBean = {
                        "url": url
                    };
                } else if (onSearchTag.hasClass("tag_friends")) {
                    var url = this.getUrl("friendcontact");
                    var labelc = this.getFriendsContainer();
                    labelc.find(".contact_group").children().remove();
                    var databean = labelc.find(".span_txt1");
                    var friendFletter = databean.attr("lang");
                    //20150413 暂时调整  未统一
                    if (friendFletter == "全部") {
                        friendFletter = "";
                    }
                    schCond.friendFletter = friendFletter || null;
                    friendBean = {
                        "url": url
                    };
                } else if (onSearchTag.hasClass("tag_project")) {
                    var pjId = taskEdit.taskInfo.pjId;
                    var url = this.getUrl("projectmans");
                    var projectManC = this.getProjectManContainer();
                    projectManC.find(".contact_group").children().remove();
                    this.loadProjectMan(pjId, val);
                    return;
                } else {
                    var emp_container = this.getEmployeeContainer();
                    //20150727 加上了  参数    以前会只能搜当前的企业
                    var databean = emp_container.find(".span_txt1");
                    var dpid = databean.attr("dpid");
                    if (dpid == 0) {
                        dpid = null;
                    }
                    var coid = databean.attr("coid");
                    schCond.dpId = dpid || null;
                    schCond.company_id = coid || null;
                    /*20150806 搜索出现'undefined'*/
                    if (schCond.dpId && schCond.dpId == 'undefined') {
                        schCond.dpId = null;
                    }
                    if (schCond.company_id && schCond.company_id == 'undefined') {
                        schCond.company_id = null;
                    }
                    emp_container.find(".contact_group").children().remove();
                }


                this.retrieve(schCond, labelBean, friendBean);
            }
        },

        //20150408 如果为label 时 labelBean不为空
        retrieve: function (schCond, labelBean, friendBean, workerBean) {
            var retType = this.getRetType(),
                obj = {};
            if (!schCond) {
                if (!this.settings.allowNull)
                    return null;
                schCond = {
                    "schType": retType,
                    "retAll": true,
                    "pageSize": 50
                };
            } else {
                schCond.schType = retType;
                schCond.pageSize = 25;
            }
            var $this = this;
            //20150325
            var url = this.getUrl("contact");
            //20150410 分配URl
            if (labelBean) {
                url = labelBean.url;
            }
            if (friendBean) {
                url = friendBean.url;
            }
            if (workerBean) {
                url = workerBean.url;
            }

            $wq.loadData({
                url: url,
                data: schCond,
                dataName: "query",
                loop: "false",
                init: function (data) {
                    $this.setQueryResult(data, null, url);
                },
                handle: function (data) {
                    $this.handleLoadContactData(data, null, labelBean, friendBean, workerBean);
                }
            });
        },

        setQueryResult: function (data, loop, url) {
            /**
             * 20150325  滑动分步加载
             */
            if (!loop) {
                if (data.list.length > 0) {
                    var query = data.query;
                    $wq.retrieveGold.CoId = query.company_id;
                    $wq.retrieveGold.DpId = query.dpId;
                    $wq.retrieveGold.schType = query.schType;
                    $wq.retrieveGold.pageSize = query.pageSize;
                    $wq.retrieveGold.currentPage = query.currentPage;
                    $wq.retrieveGold.getconcaturl = url;
                    var emp_container = this.getEmployeeContainer();
                    var dp_h = emp_container.children("h3");
                    dp_h.find(".span_txt").text(query.totalItem + "人");
                } else {
                    $wq.retrieveGold.currentPage++
                    var _data = {
                        dpId: $wq.retrieveGold.DpId,
                        schType: $wq.retrieveGold.schType,
                        currentPage: $wq.retrieveGold.currentPage,
                        pageSize: $wq.retrieveGold.pageSize,
                        company_id: $wq.retrieveGold.CoId
                    };
                    $wq.loadData({
                        url: $wq.retrieveGold.getconcaturl,
                        data: _data,
                        dataName: "query",
                        loop: "false",
                        handle: function (data) {
                            $wq.retrieveGold.handleLoadContactData(data, true);
                        }
                    })
                }
            }
        }
    };

    $.extend(wqretrieve.prototype, wqretrieveExtend);

    $wq.retrieve = function (options) {
        $wq.retrieveGold = new wqretrieve(options)
        return $wq.retrieveGold;
    }

    $wq.loadOnce = function (params) {

    }


    /** 表情插件 =====================================================**/
    var wqFaceHandler = {
        faces: {
            "害羞": "f000.png",
            "微笑": "f001.png",
            "撇嘴": "f002.png",
            "色": "f003.png",
            "发呆": "f004.png",
            "得意": "f005.png",
            "流泪": "f006.png",
            "闭嘴": "f007.png",
            "睡": "f008.png",
            "大哭": "f009.png",
            "尴尬": "f010.png",
            "发怒": "f011.png",
            "调皮": "f012.png",
            "呲牙": "f013.png",
            "惊讶": "f014.png",
            "难过": "f015.png",
            "酷": "f016.png",
            "冷汗": "f017.png",
            "抓狂": "f018.png",
            "吐": "f019.png",
            "偷笑": "f020.png",
            "可爱": "f021.png",
            "白眼": "f022.png",
            "傲慢": "f023.png",
            "饥饿": "f024.png",
            "困": "f025.png",
            "惊恐": "f026.png",
            "流汗": "f027.png",
            "憨笑": "f028.png",
            "大兵": "f029.png",
            "奋斗": "f030.png",
            "咒骂": "f031.png",
            "疑问": "f032.png",
            "嘘": "f033.png",
            "晕": "f034.png",
            "折磨": "f035.png",
            "衰": "f036.png",
            "骷髅": "f037.png",
            "敲打": "f038.png",
            "再见": "f039.png",
            "擦汗": "f040.png",
            "抠鼻": "f041.png",
            "鼓掌": "f042.png",
            "糗大了": "f043.png",
            "坏笑": "f044.png",
            "左哼哼": "f045.png",
            "右哼哼": "f046.png",
            "哈欠": "f047.png",
            "鄙视": "f048.png",
            "委屈": "f049.png",
            "快哭了": "f050.png",
            "阴险": "f051.png",
            "亲亲": "f052.png",
            "吓": "f053.png",
            "可怜": "f054.png",
            "菜刀": "f055.png",
            "西瓜": "f056.png",
            "啤酒": "f057.png",
            "篮球": "f058.png",
            "乒乓球": "f059.png",
            "咖啡": "f060.png",
            "饭": "f061.png",
            "猪头": "f062.png",
            "玫瑰": "f063.png",
            "凋谢": "f064.png",
            "示爱": "f065.png",
            "爱心": "f066.png",
            "心碎": "f067.png",
            "蛋糕": "f068.png",
            "闪电": "f069.png",
            "炸弹": "f070.png",
            "刀": "f071.png",
            "足球": "f072.png",
            "飘虫": "f073.png",
            "便便": "f074.png",
            "月亮": "f075.png",
            "太阳": "f076.png",
            "礼物": "f077.png",
            "拥抱": "f078.png",
            "强": "f079.png",
            "弱": "f080.png",
            "握手": "f081.png",
            "胜利": "f082.png",
            "抱拳": "f083.png",
            "勾引": "f084.png",
            "拳头": "f085.png",
            "差劲": "f086.png",
            "爱你": "f087.png",
            "NO": "f088.png",
            "OK": "f089.png",
            "爱情": "f090.png",
            "飞吻": "f091.png",
            "跳跳": "f092.png",
            "发抖": "f093.png",
            "怄火": "f094.png",
            "转圈": "f095.png",
            "磕头": "f096.png",
            "回头": "f097.png",
            "跳绳": "f098.png",
            "挥手": "f099.png",
            "哈哈": "f100.png",
            "口罩": "f101.png",
            "大笑": "f102.png",
            "闭眼": "f103.png",
            "吃惊": "f104.png",
            "脸红": "f105.png",
            "恐怖": "f106.png",
            "思考": "f107.png",
            "眨眼": "f108.png",
            "满足": "f109.png",
            "不高兴": "f110.png",
            "恶魔": "f111.png",
            "幽灵": "f112.png",
            "心型礼盒": "f113.png",
            "合掌": "f114.png",
            "肌肉": "f115.png",
            "钱": "f116.png",
            "生日": "f117.png",
            "派对": "f118.png",
            "皇冠": "f119.png"
        },
        imageServer: "",
        facePath: "/common/face/",

        getFacePicUrl: function (key) {
            var value = this.faces[key];
            return this.imageServer + this.facePath + value;
        },

        parse: function (content, small) {
            var faces = this.faces;
            var imageServer = this.imageServer;
            var facePath = this.facePath;
            for (var key in faces) {
                var rgExp = new RegExp("\\[" + key + "\\]", "g");
                var picURL = this.getFacePicUrl(key);
                if (small || small != undefined) {
                    var faceImg = '<img width="20" height="20" src="' + picURL + '" class="emoji_small">';
                } else {
                    var faceImg = '<img width="20" height="20" src="' + picURL + '">';
                }
                //20150127
                if (content) {
                    content = content.replace(rgExp, faceImg);
                }
            }
            return content;
        }
    };

    var WeqiaFace = function (options) {
        var settings = {
            trigger: null,
            eventType: "click",
            offsets: {
                x: 10,
                y: 5
            },
            position: "4-1",
            width: 392
        };
        this.settings = options = $.extend(settings, options);
        var trigger = $(options.trigger);
        var target = $(options.target);
        if (!trigger.length || !target.length)
            return;

        this.trigger = trigger;

        var floatTag = this.createFloat();

        var $this = this;
        trigger.weqiafloat({
            eventType: options.eventType,
            target: floatTag,
            position: options.position,
            offsets: options.offsets,
            edgeAdjust: false,
            showCall: function () {
                $this.loadFaces();
                floatTag.find("img").unbind("click").each(function () {
                    $(this).click(function () {
                        $this.enlarge.hide();
                        $this.enlarge.children().remove();
                        //		        		if($this.settings.clickFace)
                        //		        			$this.settings.clickFace.call(this);
                        var val = $(this).attr("value");
                        target.focus();
                        target.insertAtCaret(val);
                        target.change();

                        $.weqiafloat.hide();
                    });
                });
                if ($this.settings.showCall)
                    $this.settings.showCall.call($this);
            }
        });
    };

    $.extend(WeqiaFace.prototype, wqFaceHandler);

    $.extend(WeqiaFace.prototype, {

        createFloat: function () {
            var float = $('.wqface_view');
            if (!float.length) {
                float = $('<div class="wqface_view faceImgDiv" style="display: none;"></div>').appendTo(document.body);
                float.append('<div class="faceimgtop"></div>');
            }
            var enlarge = $(".enlarge_images");
            if (!enlarge.length) {
                enlarge = $('<div class="enlarge_images" style="position:absolute;display:block;z-index:9999;border:0px solid #f4f4f4;background-color:#FFFFFF;"></div>').appendTo(document.body);
            }
            this.floatTag = float;
            this.enlarge = enlarge;
            return float;
        },

        createFaceView: function () {

            //var face_view = $('<div class="faceimgtop"></div>');
            var face_tb = $('<table class="face_tb" cellpadding="0" cellspacing="0"></table>');
            //face_view.find(".faceimgtop").append(face_tb);

            var faces = this.faces;
            var i = 0;
            var $this = this;
            for (var key in faces) {
                var tr_num = parseInt(i / 15);
                if (i % 15 == 0)
                    face_tb.append('<tr></tr>');
                var tr = face_tb.find("tr:eq(" + tr_num + ")");
                var td = $('<td></td>');
                tr.append(td);
                var picUrl = this.getFacePicUrl(key);
                var img = $('<img href="javascript:void(0);" width="25" height="25" src="' + picUrl + '" title="' + key + '" value="[' + key + ']">');
                td.append(img);
                i++;
            }

            face_tb.find("img").mousemove(function (event) {
                var mX = event.pageX || event.clientX + document.body.scroolLeft;
                //20150126
                var mY = event.pageY || event.clientY + document.body.scrollTop;
                event = event || window.event;
                var enlarge = $this.enlarge;
                enlarge.children().remove();
                enlarge.append('<img src="' + this.src + '" />');
                //20150126
                //var top = document.body.scrollTop + mY - 70 + "px";
                var top = mY - 70 + "px";
                var left = mX - 25 + "px";
                enlarge.css({
                    "top": top,
                    "left": left
                });
                enlarge.show();
            }).mouseout(function () {
                var enlarge = $this.enlarge;
                enlarge.children().remove();
                enlarge.hide();
            });

            return face_tb;
        },


        loadFaces: function () {
            var view = this.floatTag.find(".face_tb");
            if (!view.length) {
                view = this.createFaceView();
                this.floatTag.find(".faceimgtop").after(view);
            }
        }

    });

    $.wqface = $wq.face = function (options) {
        return new WeqiaFace(options);
    };

    //20150209 emoji test
    $wq.parseFace = function (content, small) {
        content = wqFaceHandler.parse(content, small);
        //20150209
        content = emoji.replace_unified(content, small);
        return content;
    };

    // 预览 ================================
    $wq.preview = {
        canPreviewFileMimes: function (mime, name) {
            // 文件预览
            var previewFileTypes = ["application/pdf",
                "application/msword",
                "application/vnd.ms-wordml",
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "text/plain",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-powerpoint",
                "application/x-tika-ooxml",
                "application/x-tika-msoffice",
                "application/xml"
            ];
            var canPreview = false;
            var t;
            for (t in previewFileTypes) {
                if (mime == previewFileTypes[t]) {
                    canPreview = true;
                    break;
                }
            }
            ;
            if (mime == "application/zip") {
                canPreview = this.canPreviewZip(name);
            }
            ;
            return canPreview;
        },
        canPreviewZip: function (fileName) {
            var previewFileExt = ["docx", "pptx", "xlsx", "doc", "ppt", "xls"];
            var i;
            for (i in previewFileExt) {
                var extName = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length);
                if (extName.toLowerCase() == previewFileExt[i].toLowerCase()) {
                    return true;
                }
            }
            return false;
        }
    };


    /** 其他插件
     =====================================================**/

    // 将连接转化为点击
    $wq.parseUrlToClick = function (content) {
        //修改 增加了:;# 原var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/ig;
        var regh = /(((ht|f)tp(s?)):\/\/)/ig;
        var reg = /(((ht|f)tp(s?)):\/\/)?((www\.|[a-zA-Z]+\.)?[a-zA-Z0-9-\.]+\.(com|cn|edu|gov|mil|net|org|biz|info|name|museum|us|ca|uk)|(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]))(\:[0-9]+)?(\/)?(\?)?((\/)?[0-9a-zA-Z_!~*\'.;?:@&=+$,%#-]+)*\/?/ig;
        return content.replace(reg, function (m) {
            if (m.indexOf("http") == 0 || m.indexOf("ftp") == 0) {
                return '<a target="_blank" href="' + m + '">' + m + '</a>';
            } else {
                return '<a target="_blank" href="//' + m + '">' + m + '</a>';
            }
        });
    };


    /**
     * 地区助手 ======================
     */
    var wqZoneHandler = {
        zone: [{
            "citys": [{
                "cityId": 1,
                "cityName": "北京市"
            }],
            "provName": "北京市",
            "provId": 1
        }, {
            "citys": [{
                "cityId": 2,
                "cityName": "天津市"
            }],
            "provName": "天津市",
            "provId": 2
        }, {
            "citys": [{
                "cityId": 3,
                "cityName": "上海市"
            }],
            "provName": "上海市",
            "provId": 3
        }, {
            "citys": [{
                "cityId": 4,
                "cityName": "重庆市"
            }],
            "provName": "重庆市",
            "provId": 4
        }, {
            "citys": [{
                "cityId": 5,
                "cityName": "石家庄市"
            }, {
                "cityId": 6,
                "cityName": "衡水市"
            }, {
                "cityId": 7,
                "cityName": "邢台市"
            }, {
                "cityId": 8,
                "cityName": "邯郸市"
            }, {
                "cityId": 9,
                "cityName": "沧州市"
            }, {
                "cityId": 10,
                "cityName": "唐山市"
            }, {
                "cityId": 11,
                "cityName": "廊坊市"
            }, {
                "cityId": 12,
                "cityName": "秦皇岛市"
            }, {
                "cityId": 13,
                "cityName": "承德市"
            }, {
                "cityId": 14,
                "cityName": "保定市"
            }, {
                "cityId": 15,
                "cityName": "张家口市"
            }],
            "provName": "河北省",
            "provId": 5
        }, {
            "citys": [{
                "cityId": 16,
                "cityName": "济南市"
            }, {
                "cityId": 17,
                "cityName": "聊城市"
            }, {
                "cityId": 18,
                "cityName": "德州市"
            }, {
                "cityId": 19,
                "cityName": "淄博市"
            }, {
                "cityId": 20,
                "cityName": "滨州市"
            }, {
                "cityId": 21,
                "cityName": "东营市"
            }, {
                "cityId": 22,
                "cityName": "潍坊市"
            }, {
                "cityId": 23,
                "cityName": "烟台市"
            }, {
                "cityId": 24,
                "cityName": "威海市"
            }, {
                "cityId": 25,
                "cityName": "青岛市"
            }, {
                "cityId": 26,
                "cityName": "泰安市"
            }, {
                "cityId": 27,
                "cityName": "莱芜市"
            }, {
                "cityId": 28,
                "cityName": "济宁市"
            }, {
                "cityId": 29,
                "cityName": "菏泽市"
            }, {
                "cityId": 30,
                "cityName": "临沂市"
            }, {
                "cityId": 31,
                "cityName": "日照市"
            }, {
                "cityId": 32,
                "cityName": "枣庄市"
            }],
            "provName": "山东省",
            "provId": 6
        }, {
            "citys": [{
                "cityId": 33,
                "cityName": "沈阳市"
            }, {
                "cityId": 34,
                "cityName": "辽阳市"
            }, {
                "cityId": 35,
                "cityName": "铁岭市"
            }, {
                "cityId": 36,
                "cityName": "抚顺市"
            }, {
                "cityId": 37,
                "cityName": "鞍山市"
            }, {
                "cityId": 38,
                "cityName": "大连市"
            }, {
                "cityId": 39,
                "cityName": "本溪市"
            }, {
                "cityId": 40,
                "cityName": "丹东市"
            }, {
                "cityId": 41,
                "cityName": "朝阳市"
            }, {
                "cityId": 42,
                "cityName": "阜新市"
            }, {
                "cityId": 43,
                "cityName": "盘锦市"
            }],
            "provName": "辽宁省",
            "provId": 7
        }, {
            "citys": [{
                "cityId": 44,
                "cityName": "哈尔滨市"
            }, {
                "cityId": 45,
                "cityName": "绥化市"
            }, {
                "cityId": 46,
                "cityName": "伊春市"
            }, {
                "cityId": 47,
                "cityName": "佳木斯市"
            }, {
                "cityId": 48,
                "cityName": "鹤岗市"
            }, {
                "cityId": 49,
                "cityName": "七台河市"
            }, {
                "cityId": 50,
                "cityName": "双鸭山市"
            }, {
                "cityId": 51,
                "cityName": "牡丹江市"
            }, {
                "cityId": 52,
                "cityName": "鸡西市"
            }, {
                "cityId": 53,
                "cityName": "齐齐哈尔市"
            }, {
                "cityId": 54,
                "cityName": "大庆市"
            }, {
                "cityId": 55,
                "cityName": "黑河市"
            }],
            "provName": "黑龙江省",
            "provId": 8
        }, {
            "citys": [{
                "cityId": 56,
                "cityName": "南京市"
            }, {
                "cityId": 57,
                "cityName": "镇江市"
            }, {
                "cityId": 58,
                "cityName": "常州市"
            }, {
                "cityId": 59,
                "cityName": "无锡市"
            }, {
                "cityId": 60,
                "cityName": "苏州市"
            }, {
                "cityId": 61,
                "cityName": "徐州市"
            }, {
                "cityId": 62,
                "cityName": "连云港市"
            }, {
                "cityId": 63,
                "cityName": "淮安市"
            }, {
                "cityId": 64,
                "cityName": "宿迁市"
            }, {
                "cityId": 65,
                "cityName": "盐城市"
            }, {
                "cityId": 66,
                "cityName": "扬州市"
            }, {
                "cityId": 67,
                "cityName": "泰州市"
            }, {
                "cityId": 68,
                "cityName": "南通市"
            }],
            "provName": "江苏省",
            "provId": 9
        }, {
            "citys": [{
                "cityId": 69,
                "cityName": "杭州市"
            }, {
                "cityId": 70,
                "cityName": "绍兴市"
            }, {
                "cityId": 71,
                "cityName": "湖州市"
            }, {
                "cityId": 72,
                "cityName": "嘉兴市"
            }, {
                "cityId": 73,
                "cityName": "宁波市"
            }, {
                "cityId": 74,
                "cityName": "舟山市"
            }, {
                "cityId": 75,
                "cityName": "台州市"
            }, {
                "cityId": 76,
                "cityName": "金华市"
            }, {
                "cityId": 77,
                "cityName": "丽水市"
            }, {
                "cityId": 78,
                "cityName": "衢州市"
            }, {
                "cityId": 79,
                "cityName": "温州市"
            }],
            "provName": "浙江省",
            "provId": 10
        }, {
            "citys": [{
                "cityId": 80,
                "cityName": "西安市"
            }, {
                "cityId": 81,
                "cityName": "咸阳市"
            }, {
                "cityId": 82,
                "cityName": "渭南市"
            }, {
                "cityId": 83,
                "cityName": "延安市"
            }, {
                "cityId": 84,
                "cityName": "榆林市"
            }, {
                "cityId": 85,
                "cityName": "宝鸡市"
            }, {
                "cityId": 86,
                "cityName": "汉中市"
            }, {
                "cityId": 87,
                "cityName": "安康市"
            }, {
                "cityId": 88,
                "cityName": "商洛市"
            }, {
                "cityId": 89,
                "cityName": "铜川市"
            }],
            "provName": "陕西省",
            "provId": 11
        }, {
            "citys": [{
                "cityId": 90,
                "cityName": "太原市"
            }, {
                "cityId": 91,
                "cityName": "吕梁市"
            }, {
                "cityId": 92,
                "cityName": "忻州市"
            }, {
                "cityId": 93,
                "cityName": "朔州市"
            }, {
                "cityId": 94,
                "cityName": "大同市"
            }, {
                "cityId": 95,
                "cityName": "晋中市"
            }, {
                "cityId": 96,
                "cityName": "临汾市"
            }, {
                "cityId": 97,
                "cityName": "运城市"
            }, {
                "cityId": 98,
                "cityName": "阳泉市"
            }, {
                "cityId": 99,
                "cityName": "长治市"
            }, {
                "cityId": 100,
                "cityName": "晋城市"
            }],
            "provName": "山西省",
            "provId": 12
        }, {
            "citys": [{
                "cityId": 101,
                "cityName": "福州市"
            }, {
                "cityId": 102,
                "cityName": "莆田市"
            }, {
                "cityId": 103,
                "cityName": "宁德市"
            }, {
                "cityId": 104,
                "cityName": "南平市"
            }, {
                "cityId": 105,
                "cityName": "厦门市"
            }, {
                "cityId": 106,
                "cityName": "泉州市"
            }, {
                "cityId": 107,
                "cityName": "漳州市"
            }, {
                "cityId": 108,
                "cityName": "龙岩市"
            }, {
                "cityId": 109,
                "cityName": "三明市"
            }],
            "provName": "福建省",
            "provId": 13
        }, {
            "citys": [{
                "cityId": 110,
                "cityName": "广州市"
            }, {
                "cityId": 111,
                "cityName": "清远市"
            }, {
                "cityId": 112,
                "cityName": "韶关市"
            }, {
                "cityId": 113,
                "cityName": "梅州市"
            }, {
                "cityId": 114,
                "cityName": "汕头市"
            }, {
                "cityId": 115,
                "cityName": "汕尾市"
            }, {
                "cityId": 116,
                "cityName": "河源市"
            }, {
                "cityId": 117,
                "cityName": "深圳市"
            }, {
                "cityId": 118,
                "cityName": "珠海市"
            }, {
                "cityId": 119,
                "cityName": "潮州市"
            }, {
                "cityId": 120,
                "cityName": "揭阳市"
            }, {
                "cityId": 121,
                "cityName": "东莞市"
            }, {
                "cityId": 122,
                "cityName": "湛江市"
            }, {
                "cityId": 123,
                "cityName": "茂名市"
            }, {
                "cityId": 124,
                "cityName": "肇庆市"
            }, {
                "cityId": 125,
                "cityName": "云浮市"
            }, {
                "cityId": 126,
                "cityName": "佛山市"
            }, {
                "cityId": 127,
                "cityName": "中山市"
            }, {
                "cityId": 128,
                "cityName": "江门市"
            }, {
                "cityId": 129,
                "cityName": "阳江市"
            }],
            "provName": "广东省",
            "provId": 14
        }, {
            "citys": [{
                "cityId": 130,
                "cityName": "郑州市"
            }, {
                "cityId": 131,
                "cityName": "新乡市"
            }, {
                "cityId": 132,
                "cityName": "焦作市"
            }, {
                "cityId": 133,
                "cityName": "安阳市"
            }, {
                "cityId": 134,
                "cityName": "濮阳市"
            }, {
                "cityId": 135,
                "cityName": "鹤壁市"
            }, {
                "cityId": 136,
                "cityName": "许昌市"
            }, {
                "cityId": 137,
                "cityName": "漯河市"
            }, {
                "cityId": 138,
                "cityName": "驻马店市"
            }, {
                "cityId": 139,
                "cityName": "信阳市"
            }, {
                "cityId": 140,
                "cityName": "周口市"
            }, {
                "cityId": 141,
                "cityName": "平顶山市"
            }, {
                "cityId": 142,
                "cityName": "洛阳市"
            }, {
                "cityId": 143,
                "cityName": "三门峡市"
            }, {
                "cityId": 144,
                "cityName": "南阳市"
            }, {
                "cityId": 145,
                "cityName": "开封市"
            }, {
                "cityId": 146,
                "cityName": "商丘市"
            }],
            "provName": "河南省",
            "provId": 15
        }, {
            "citys": [{
                "cityId": 168,
                "cityName": "长沙市"
            }, {
                "cityId": 169,
                "cityName": "湘潭市"
            }, {
                "cityId": 170,
                "cityName": "株洲市"
            }, {
                "cityId": 171,
                "cityName": "益阳市"
            }, {
                "cityId": 172,
                "cityName": "岳阳市"
            }, {
                "cityId": 173,
                "cityName": "常德市"
            }, {
                "cityId": 174,
                "cityName": "湘西土家族苗族自治州"
            }, {
                "cityId": 175,
                "cityName": "娄底市"
            }, {
                "cityId": 176,
                "cityName": "怀化市"
            }, {
                "cityId": 177,
                "cityName": "衡阳市"
            }, {
                "cityId": 178,
                "cityName": "邵阳市"
            }, {
                "cityId": 179,
                "cityName": "郴州市"
            }, {
                "cityId": 180,
                "cityName": "永州市"
            }, {
                "cityId": 181,
                "cityName": "张家界市"
            }],
            "provName": "湖南省",
            "provId": 17
        }, {
            "citys": [{
                "cityId": 147,
                "cityName": "成都市"
            }, {
                "cityId": 148,
                "cityName": "乐山市"
            }, {
                "cityId": 149,
                "cityName": "凉山彝族自治州"
            }, {
                "cityId": 150,
                "cityName": "攀枝花市"
            }, {
                "cityId": 151,
                "cityName": "德阳市"
            }, {
                "cityId": 152,
                "cityName": "眉山市"
            }, {
                "cityId": 153,
                "cityName": "绵阳市"
            }, {
                "cityId": 154,
                "cityName": "阿坝藏族羌族自治州"
            }, {
                "cityId": 155,
                "cityName": "雅安市"
            }, {
                "cityId": 156,
                "cityName": "甘孜藏族自治州"
            }, {
                "cityId": 157,
                "cityName": "广元市"
            }, {
                "cityId": 158,
                "cityName": "遂宁市"
            }, {
                "cityId": 159,
                "cityName": "达州市"
            }, {
                "cityId": 160,
                "cityName": "巴中市"
            }, {
                "cityId": 161,
                "cityName": "南充市"
            }, {
                "cityId": 162,
                "cityName": "广安市"
            }, {
                "cityId": 163,
                "cityName": "内江市"
            }, {
                "cityId": 164,
                "cityName": "资阳市"
            }, {
                "cityId": 165,
                "cityName": "自贡市"
            }, {
                "cityId": 166,
                "cityName": "宜宾市"
            }, {
                "cityId": 167,
                "cityName": "泸州市"
            }],
            "provName": "四川省",
            "provId": 16
        }, {
            "citys": [{
                "cityId": 199,
                "cityName": "合肥市"
            }, {
                "cityId": 200,
                "cityName": "淮南市"
            }, {
                "cityId": 201,
                "cityName": "蚌埠市"
            }, {
                "cityId": 202,
                "cityName": "宿州市"
            }, {
                "cityId": 203,
                "cityName": "淮北市"
            }, {
                "cityId": 204,
                "cityName": "阜阳市"
            }, {
                "cityId": 205,
                "cityName": "毫州市"
            }, {
                "cityId": 206,
                "cityName": "六安市"
            }, {
                "cityId": 207,
                "cityName": "巢湖市"
            }, {
                "cityId": 208,
                "cityName": "滁州市"
            }, {
                "cityId": 209,
                "cityName": "芜湖市"
            }, {
                "cityId": 210,
                "cityName": "宣城市"
            }, {
                "cityId": 211,
                "cityName": "马鞍山市"
            }, {
                "cityId": 212,
                "cityName": "铜陵市"
            }, {
                "cityId": 213,
                "cityName": "黄山市"
            }, {
                "cityId": 214,
                "cityName": "安庆市"
            }, {
                "cityId": 215,
                "cityName": "池州市"
            }],
            "provName": "安徽省",
            "provId": 19
        }, {
            "citys": [{
                "cityId": 182,
                "cityName": "武汉市"
            }, {
                "cityId": 183,
                "cityName": "天门市"
            }, {
                "cityId": 184,
                "cityName": "孝感市"
            }, {
                "cityId": 185,
                "cityName": "仙桃市"
            }, {
                "cityId": 186,
                "cityName": "潜江市"
            }, {
                "cityId": 187,
                "cityName": "荆州市"
            }, {
                "cityId": 188,
                "cityName": "黄石市"
            }, {
                "cityId": 189,
                "cityName": "鄂州市"
            }, {
                "cityId": 190,
                "cityName": "咸宁市"
            }, {
                "cityId": 191,
                "cityName": "黄冈市"
            }, {
                "cityId": 192,
                "cityName": "襄樊市"
            }, {
                "cityId": 193,
                "cityName": "随州市"
            }, {
                "cityId": 194,
                "cityName": "十堰市"
            }, {
                "cityId": 195,
                "cityName": "神农架林区"
            }, {
                "cityId": 196,
                "cityName": "宜昌市"
            }, {
                "cityId": 197,
                "cityName": "恩施土家族苗族自治州"
            }, {
                "cityId": 198,
                "cityName": "荆门市"
            }],
            "provName": "湖北省",
            "provId": 18
        }, {
            "citys": [{
                "cityId": 227,
                "cityName": "海口市"
            }, {
                "cityId": 228,
                "cityName": "定安县"
            }, {
                "cityId": 229,
                "cityName": "文昌市"
            }, {
                "cityId": 230,
                "cityName": "西沙群岛"
            }, {
                "cityId": 231,
                "cityName": "琼海市"
            }, {
                "cityId": 232,
                "cityName": "万宁市"
            }, {
                "cityId": 233,
                "cityName": "屯昌县"
            }, {
                "cityId": 234,
                "cityName": "儋州市"
            }, {
                "cityId": 235,
                "cityName": "临高县"
            }, {
                "cityId": 236,
                "cityName": "澄迈县"
            }, {
                "cityId": 237,
                "cityName": "三亚市"
            }, {
                "cityId": 238,
                "cityName": "五指山市"
            }, {
                "cityId": 239,
                "cityName": "保亭黎族苗族自治县"
            }, {
                "cityId": 240,
                "cityName": "陵水黎族自治县"
            }, {
                "cityId": 241,
                "cityName": "乐东黎族自治县"
            }, {
                "cityId": 242,
                "cityName": "昌江黎族自治县"
            }, {
                "cityId": 243,
                "cityName": "白沙黎族自治县"
            }, {
                "cityId": 244,
                "cityName": "琼中黎族苗族自治县"
            }, {
                "cityId": 245,
                "cityName": "中沙群岛的岛礁及其海域"
            }, {
                "cityId": 246,
                "cityName": "南沙群岛"
            }],
            "provName": "海南省",
            "provId": 21
        }, {
            "citys": [{
                "cityId": 216,
                "cityName": "南昌市"
            }, {
                "cityId": 217,
                "cityName": "九江市"
            }, {
                "cityId": 218,
                "cityName": "景德镇市"
            }, {
                "cityId": 219,
                "cityName": "上饶市"
            }, {
                "cityId": 220,
                "cityName": "鹰潭市"
            }, {
                "cityId": 221,
                "cityName": "宜春市"
            }, {
                "cityId": 222,
                "cityName": "萍乡市"
            }, {
                "cityId": 223,
                "cityName": "新余市"
            }, {
                "cityId": 224,
                "cityName": "赣州市"
            }, {
                "cityId": 225,
                "cityName": "吉安市"
            }, {
                "cityId": 226,
                "cityName": "抚州市"
            }],
            "provName": "江西省",
            "provId": 20
        }, {
            "citys": [{
                "cityId": 263,
                "cityName": "贵阳市"
            }, {
                "cityId": 264,
                "cityName": "毕节地区"
            }, {
                "cityId": 265,
                "cityName": "六盘水市"
            }, {
                "cityId": 266,
                "cityName": "铜仁地区"
            }, {
                "cityId": 267,
                "cityName": "黔东南苗族侗族自治州"
            }, {
                "cityId": 268,
                "cityName": "黔南布依族苗族自治州"
            }, {
                "cityId": 269,
                "cityName": "安顺市"
            }, {
                "cityId": 270,
                "cityName": "黔西南布依族苗族自治州"
            }, {
                "cityId": 271,
                "cityName": "遵义市"
            }],
            "provName": "贵州省",
            "provId": 23
        }, {
            "citys": [{
                "cityId": 247,
                "cityName": "昆明市"
            }, {
                "cityId": 248,
                "cityName": "玉溪市"
            }, {
                "cityId": 249,
                "cityName": "曲靖市"
            }, {
                "cityId": 250,
                "cityName": "昭通市"
            }, {
                "cityId": 251,
                "cityName": "文山壮族苗族自治州"
            }, {
                "cityId": 252,
                "cityName": "红河哈尼族彝族自治州"
            }, {
                "cityId": 253,
                "cityName": "普洱市"
            }, {
                "cityId": 254,
                "cityName": "西双版纳傣族自治州"
            }, {
                "cityId": 255,
                "cityName": "大理白族自治州"
            }, {
                "cityId": 256,
                "cityName": "怒江傈僳族自治州"
            }, {
                "cityId": 257,
                "cityName": "丽江市"
            }, {
                "cityId": 258,
                "cityName": "迪庆藏族自治州"
            }, {
                "cityId": 259,
                "cityName": "楚雄彝族自治州"
            }, {
                "cityId": 260,
                "cityName": "临沧市"
            }, {
                "cityId": 261,
                "cityName": "保山市"
            }, {
                "cityId": 262,
                "cityName": "德宏傣族景颇族自治州"
            }],
            "provName": "云南省",
            "provId": 22
        }, {
            "citys": [{
                "cityId": 286,
                "cityName": "西宁市"
            }, {
                "cityId": 287,
                "cityName": "黄南藏族自治州"
            }, {
                "cityId": 288,
                "cityName": "海北藏族自治州"
            }, {
                "cityId": 289,
                "cityName": "海南藏族自治州"
            }, {
                "cityId": 290,
                "cityName": "海东地区"
            }, {
                "cityId": 291,
                "cityName": "果洛藏族自治州"
            }, {
                "cityId": 292,
                "cityName": "玉树藏族自治州"
            }, {
                "cityId": 293,
                "cityName": "海西蒙古族藏族自治州"
            }],
            "provName": "青海省",
            "provId": 25
        }, {
            "citys": [{
                "cityId": 272,
                "cityName": "兰州市"
            }, {
                "cityId": 273,
                "cityName": "白银市"
            }, {
                "cityId": 274,
                "cityName": "临夏回族自治州"
            }, {
                "cityId": 275,
                "cityName": "武威市"
            }, {
                "cityId": 276,
                "cityName": "张掖市"
            }, {
                "cityId": 277,
                "cityName": "酒泉市"
            }, {
                "cityId": 278,
                "cityName": "嘉峪关市"
            }, {
                "cityId": 279,
                "cityName": "金昌市"
            }, {
                "cityId": 280,
                "cityName": "天水市"
            }, {
                "cityId": 281,
                "cityName": "陇南市"
            }, {
                "cityId": 282,
                "cityName": "定西市"
            }, {
                "cityId": 283,
                "cityName": "平凉市"
            }, {
                "cityId": 284,
                "cityName": "庆阳市"
            }, {
                "cityId": 285,
                "cityName": "甘南藏族自治州"
            }],
            "provName": "甘肃省",
            "provId": 24
        }, {
            "citys": [{
                "cityId": 299,
                "cityName": "呼和浩特市"
            }, {
                "cityId": 300,
                "cityName": "乌兰察布市"
            }, {
                "cityId": 301,
                "cityName": "包头市"
            }, {
                "cityId": 302,
                "cityName": "巴彦淖尔市"
            }, {
                "cityId": 303,
                "cityName": "乌海市"
            }, {
                "cityId": 304,
                "cityName": "鄂尔多斯市"
            }, {
                "cityId": 305,
                "cityName": "呼伦贝尔市"
            }, {
                "cityId": 306,
                "cityName": "赤峰市"
            }, {
                "cityId": 307,
                "cityName": "锡林郭勒盟"
            }, {
                "cityId": 308,
                "cityName": "通辽市"
            }, {
                "cityId": 309,
                "cityName": "兴安盟"
            }, {
                "cityId": 310,
                "cityName": "阿拉善盟"
            }],
            "provName": "内蒙古自治区",
            "provId": 27
        }, {
            "citys": [{
                "cityId": 294,
                "cityName": "银川市"
            }, {
                "cityId": 295,
                "cityName": "吴忠市"
            }, {
                "cityId": 296,
                "cityName": "石嘴山市"
            }, {
                "cityId": 297,
                "cityName": "中卫市"
            }, {
                "cityId": 298,
                "cityName": "固原市"
            }],
            "provName": "宁夏回族自治区",
            "provId": 26
        }, {
            "citys": [{
                "cityId": 318,
                "cityName": "南宁市"
            }, {
                "cityId": 319,
                "cityName": "崇左市"
            }, {
                "cityId": 320,
                "cityName": "百色市"
            }, {
                "cityId": 321,
                "cityName": "钦州市"
            }, {
                "cityId": 322,
                "cityName": "北海市"
            }, {
                "cityId": 323,
                "cityName": "贵港市"
            }, {
                "cityId": 324,
                "cityName": "玉林市"
            }, {
                "cityId": 325,
                "cityName": "防城港市"
            }, {
                "cityId": 326,
                "cityName": "桂林市"
            }, {
                "cityId": 327,
                "cityName": "贺州市"
            }, {
                "cityId": 328,
                "cityName": "梧州市"
            }, {
                "cityId": 329,
                "cityName": "柳州市"
            }, {
                "cityId": 330,
                "cityName": "来宾市"
            }, {
                "cityId": 331,
                "cityName": "河池市"
            }],
            "provName": "广西壮族自治区",
            "provId": 29
        }, {
            "citys": [{
                "cityId": 311,
                "cityName": "拉萨市"
            }, {
                "cityId": 312,
                "cityName": "那曲地区"
            }, {
                "cityId": 313,
                "cityName": "昌都地区"
            }, {
                "cityId": 314,
                "cityName": "山南地区"
            }, {
                "cityId": 315,
                "cityName": "日喀则地区"
            }, {
                "cityId": 316,
                "cityName": "阿里地区"
            }, {
                "cityId": 317,
                "cityName": "林芝地区"
            }],
            "provName": "西藏自治区",
            "provId": 28
        }, {
            "citys": [{
                "cityId": 350,
                "cityName": "香港特别行政区"
            }],
            "provName": "香港特别行政区",
            "provId": 31
        }, {
            "citys": [{
                "cityId": 332,
                "cityName": "乌鲁木齐市"
            }, {
                "cityId": 333,
                "cityName": "昌吉回族自治州"
            }, {
                "cityId": 334,
                "cityName": "石河子市"
            }, {
                "cityId": 335,
                "cityName": "博尔塔拉蒙古自治州"
            }, {
                "cityId": 336,
                "cityName": "克拉玛依市"
            }, {
                "cityId": 337,
                "cityName": "塔城地区"
            }, {
                "cityId": 338,
                "cityName": "伊犁哈萨克自治州"
            }, {
                "cityId": 339,
                "cityName": "阿勒泰地区"
            }, {
                "cityId": 340,
                "cityName": "吐鲁番地区"
            }, {
                "cityId": 341,
                "cityName": "哈密地区"
            }, {
                "cityId": 342,
                "cityName": "巴音郭楞蒙古自治州"
            }, {
                "cityId": 343,
                "cityName": "阿克苏地区"
            }, {
                "cityId": 344,
                "cityName": "喀什地区"
            }, {
                "cityId": 345,
                "cityName": "阿拉尔市"
            }, {
                "cityId": 346,
                "cityName": "图木舒克市"
            }, {
                "cityId": 347,
                "cityName": "五家渠市"
            }, {
                "cityId": 348,
                "cityName": "克孜勒苏柯尔克孜自治州"
            }, {
                "cityId": 349,
                "cityName": "和田地区"
            }],
            "provName": "新疆维吾尔自治区",
            "provId": 30
        }, {
            "citys": [{
                "cityId": 379,
                "cityName": "长春市"
            }, {
                "cityId": 380,
                "cityName": "吉林市"
            }, {
                "cityId": 381,
                "cityName": "吉林市"
            }, {
                "cityId": 382,
                "cityName": "延边朝鲜族自治州"
            }, {
                "cityId": 383,
                "cityName": "通化市"
            }, {
                "cityId": 384,
                "cityName": "白山市"
            }, {
                "cityId": 385,
                "cityName": "四平市"
            }, {
                "cityId": 386,
                "cityName": "辽源市"
            }, {
                "cityId": 387,
                "cityName": "白城市"
            }, {
                "cityId": 388,
                "cityName": "松原市"
            }],
            "provName": "吉林省",
            "provId": 34
        }, {
            "citys": [{
                "cityId": 351,
                "cityName": "澳门特别行政区"
            }],
            "provName": "澳门特别行政区",
            "provId": 32
        }, {
            "citys": [{
                "cityId": 352,
                "cityName": "台北市"
            }, {
                "cityId": 353,
                "cityName": "基隆市"
            }, {
                "cityId": 354,
                "cityName": "台北县"
            }, {
                "cityId": 355,
                "cityName": "宜兰县"
            }, {
                "cityId": 356,
                "cityName": "新竹市"
            }, {
                "cityId": 357,
                "cityName": "新竹县"
            }, {
                "cityId": 358,
                "cityName": "桃园县"
            }, {
                "cityId": 359,
                "cityName": "苗栗县"
            }, {
                "cityId": 360,
                "cityName": "台中市"
            }, {
                "cityId": 361,
                "cityName": "台中县"
            }, {
                "cityId": 362,
                "cityName": "彰化县"
            }, {
                "cityId": 363,
                "cityName": "南投市"
            }, {
                "cityId": 364,
                "cityName": "南投县"
            }, {
                "cityId": 365,
                "cityName": "嘉义市"
            }, {
                "cityId": 366,
                "cityName": "嘉义县"
            }, {
                "cityId": 367,
                "cityName": "云林县"
            }, {
                "cityId": 368,
                "cityName": "台南市"
            }, {
                "cityId": 369,
                "cityName": "台南县"
            }, {
                "cityId": 370,
                "cityName": "高雄市"
            }, {
                "cityId": 371,
                "cityName": "高雄县"
            }, {
                "cityId": 372,
                "cityName": "澎湖县"
            }, {
                "cityId": 373,
                "cityName": "马祖县"
            }, {
                "cityId": 374,
                "cityName": "金门县"
            }, {
                "cityId": 375,
                "cityName": "屏东县"
            }, {
                "cityId": 376,
                "cityName": "台东县"
            }, {
                "cityId": 377,
                "cityName": "台东县"
            }, {
                "cityId": 378,
                "cityName": "花莲县"
            }],
            "provName": "台湾省",
            "provId": 33
        }],

        getProvArray: function () {
            return this.zone;
        },

        getCityArray: function (provId) {
            var zone = this.zone;
            for (var i in zone) {
                if (provId == zone[i].provId) {
                    return zone[i].citys;
                }
            }
            return null;
        },

        getProvName: function (provId) {
            var zone = this.zone;
            for (var i in zone) {
                if (provId == zone[i].provId) {
                    var prov = zone[i];
                    return prov.provName;
                }
            }
            return "";
        },

        getCityName: function (provId, cityId) {
            var zone = this.zone;
            for (var i in zone) {
                if (provId == zone[i].provId) {
                    var prov = zone[i];
                    var citys = prov.citys;
                    for (var j in citys) {
                        if (cityId == citys[j].cityId) {
                            var city = citys[j];
                            return city.cityName;
                        }
                    }
                }
            }
            return "";
        },

        getProvCity: function (provId, cityId) {
            var zone = this.zone;
            for (var i in zone) {
                if (provId == zone[i].provId) {
                    var prov = zone[i];
                    var citys = prov.citys;
                    for (var j in citys) {
                        if (cityId == citys[j].cityId) {
                            var city = citys[j];
                            var provName = prov.provName;
                            var cityName = city.cityName;
                            var provCity;
                            if (provName == cityName)
                                provCity = cityName;
                            else
                                provCity = provName + cityName;
                            return provCity;
                        }
                    }
                }
            }
            return "";
        }
    };

    $.wqzone = $wq.zone = wqZoneHandler;


    /**
     * 校验 ============================
     */
    var wqValidateHandle = {

        isNull: function (value) {
            return !$.trim(value);
        },

        //  常见几个判断
        methods: {
            decimal: function (value, param) {
                var reg = "^";
                if (param && param.minus)
                    reg += "-?";
                var precision = param.prec ? param.prec : 0;
                if (param && param.length && param.length > 0) {
                    var length = param.length - precision - 1;
                    reg += "([1-9][0-9]{0," + length + "}|0)"
                } else {
                    reg += "([1-9][0-9]*|0)";
                }
                if (precision > 0) {
                    reg += "(\\.[0-9]{1," + precision + "})?"
                } else {
                    reg += "(\\.[0-9]+)?"
                }
                reg += "$";
                var patrn = new RegExp(reg);
                return patrn.exec(value);
            },
            money: function (value, param) {
                if (!param)
                    return true;
                var patrn = /^(([1-9]{1}\d*)|([0]{1}))(\.(\d){1,2})?$/;
                return patrn.exec(value);
            },
            integer: function (value, param) {
                var reg = "^";
                if (param && param.minus)
                    reg = "-?";

                reg += "\\d";
                if (param && param.m && param.n) {
                    reg += "{" + param.m + "," + param.n + "}";
                } else if (param && (param.m || param.n)) {
                    reg += "{" + (param.m | param.n) + "}";
                } else {
                    reg += "+";
                }
                reg += "$";
                var patrn = new RegExp(reg);
                return patrn.exec(value);
            }
        },

        valid: function (value, element, validate) {
            var isNull = this.isNull(value);
            if (validate.required && isNull)
                return false;
            for (var key in validate) {
                if (key != "required" && !isNull) {
                    var param = validate[key];
                    var res = this.methods[key].call(this, value, param);
                    if (!res)
                        return false;
                }
            }
            return true;
        },

        required: function (value) {
            return $.trim(value);
        },

        validMoney: function (value) {
            return this.methods["money"].call(this, value, true);
        },

        length: function (value, max) {
            if (value.length > max) {
                return false;
            }
            return true;
        },

        max: function (value, max) {
            if (max != undefined || max != null) {
                if (value > max) {
                    return false;
                }
            }
            return true;
        },
        min: function (value, min) {
            if (min != undefined || min != null) {
                if (value < min) {
                    return false;
                }
            }
            return true;
        },
        nEqual: function (val, temp) {
            return val != temp;
        },
        number: function (val, t) {
            var r = new RegExp("^(\\-|\\+)?\\d+(\\.\\d+)?$");
            var status = r.test(val);
            if (t) {
                return status;
            } else {
                return !status;
            }
        }
    }

    $.wqvalidate = $wq.validate = wqValidateHandle;

    /** form表单校验 @jin 2017/02/09 ============ **/
    function WqFormPlugin(form, key, allowEmptyValue) {
        this.h = wqValidateHandle;
        this.form = form;
        this.formObj = {};
        this.custom = {};
        this.key = key || "";
        this.head = "";
        this.allowEmptyValue = allowEmptyValue || false;
        if (!this.h.isNull(key)) {
            this.head = key + ".";
        }
        return this;
    }

    $.extend(WqFormPlugin.prototype, {
        getFormObj: function () {
            var $this = this;
            var k = $this.key;
            var fields = this.form.find("[field]");
            var formObj = $this.formObj;
            var success = true;
            var h = $this.h;
            $.each(fields, function (i, el) {
                var name = $(el).attr("field");
                name = $.trim(name);
                var handlers = [];
                var attrH = $(el).attr("h");
                attrH = $.trim(attrH);
                if (attrH) {
                    handlers = attrH.split(",");
                }

                var requireType = $this.isRequire(name);
                var fieldName = requireType.name;
                var formName = $this.head + fieldName;
                var val = $this.getValue(el);
                if (requireType.require) {
                    if (h.isNull(val)) {
                        success = false;
                        $wq.highBlink(el, "#F93A3A");
                        throw fieldName + "校验失败";
                        return false;
                    }
                }
                if (!h.isNull(val)) {
                    if (handlers.length > 0) {
                        if (!$this.valid(val, handlers)) {
                            success = false;
                            $wq.highBlink(el, "#F93A3A");
                            throw fieldName + "校验失败";
                            return false;
                        }
                    }
                    formObj[formName] = val;
                } else {
                    if ($this.allowEmptyValue) {
                        formObj[formName] = "";
                    }
                }

            });
            if (!success) {
                return null;
            } else {
                return $this.build(formObj);
            }

        },

        data: function (key) {
            var obj = this.getFormObj(key);
            if (obj == null) {
                return null;
            } else {
                return $wq.jsonToArr(obj);
            }
        },

        otherFields: function (fields) {
            var $this = this;
            for (var k in fields) {
                var newKey = $this.head + k;
                $this.custom[newKey] = fields[k]
            }
        },

        build: function (obj) {
            var $this = this;
            return $.extend({}, obj, $this.custom);
        },

        isRequire: function (s) {
            if (s.substr(0, 1) == "#") {
                var newName = s.substr(1, s.length);
                return {
                    "require": true,
                    "name": newName
                };
            } else {
                return {
                    "require": false,
                    "name": s
                };
            }

        },

        getValue: function (dom) {
            var $dom = $(dom);
            var obj = $(dom)[0];
            var type = obj.tagName;
            //判断类型
            if (type == "DIV") {
                return $dom.text();
            } else if ($dom.hasClass("money")) {
                return $dom.getThoVal();
            } else {
                return $dom.val();
            }
        },

        setValue: function (e, v) {
            if (v || v == 0) {
                var tagName = e[0].tagName;
                if (tagName == "SELECT") {
                    var opts = e.find("option");
                    $.each(opts, function (i, el) {
                        var e = $(el);
                        if (e.val() == v) {
                            e.attr("selected", true);
                            return false;
                        }
                    });
                    e.cssSelect();
                } else if (tagName == "P") {
                    e.text(v);
                } else {
                    e.val(v);
                }
            }
        },

        parseHandlersStr: function (str) {
            var hs = [];
            $.each(str, function (i, s) {
                var keys = s.split("=");
                var handler = {
                    key: keys[0],
                    val: keys[1]
                };
                hs.push(handler);
            });
            return hs;
        },

        valid: function (val, handlers) {
            var hs = this.parseHandlersStr(handlers);
            var success = true;
            var h = this.h;
            $.each(hs, function (i, handler) {
                var status = h[handler.key](val, handler.val);
                if (!status) {
                    success = false;
                    return false;
                }
            });
            return success;
        },

        validSingle: function (jqDom) {
            var exception = "参数校验错误";
            var val = jqDom.val();
            var h = this.h;
            var name = $(jqDom).attr("field");
            name = $.trim(name);
            var isNull = h.isNull(val);
            if (!isNull) {
                var attrH = $(jqDom).attr("h");
                attrH = $.trim(attrH);
                var handlers = [];
                if (attrH) {
                    handlers = attrH.split(",");
                }
                if (handlers.length > 0) {
                    if (!this.valid(val, handlers)) {
                        success = false;
                        $wq.highBlink(jqDom, "#F93A3A");
                        throw exception;
                        return false;
                    }
                }
            } else {
                if (name.substr(0, 1) == "#") {
                    $wq.highBlink(jqDom, "#F93A3A");
                    throw exception;
                    return false;
                }
            }
            return true;
        },

        mapperValue: function (obj) {
            var $this = this;
            var fields = this.form.find("[field]");
            $.each(fields, function (i, el) {
                var e = $(el);
                var require = $this.isRequire(e.attr("field"));
                var field = require.name;
                $this.setValue(e, obj[field]);
            });
        }
    });

    $.wqForm = $wq.wqForm = function (t, k, a) {
        return new WqFormPlugin(t, k, a);
    };
    $.wqSingleForm = $wq.singleForm = new WqFormPlugin();


    /**
     * 树状图 ==================================
     * 用于树状态结构的显示和操作。WeqiaTree的实例对象代表一棵"树"，亦代表了"树"的某个"子树"，因此既可以将它当作一棵树来操作，亦可以当作一个节点来操作。
     *
     * 结构说明:
     * target: 树的据点对象，为jquery对象。
     * node obj: 本节点对象，为jquery对象。
     * text obj: 本节点文本对象，为jquery对象。
     * branch obj: 树的分枝对象，为jquery对象。
     * root: 整棵树结构的根节点对象，为WeqiaTree对象。
     * child node:树的任意子节点，为WeqiaTree对象。
     *
     * 参数说明:
     * selector:选择器，树的据点对象。控件将以此对象为据点创造一个"树".
     * text:节点文本。
     * value: 节点值。
     * collapsible:可收缩。
     * unfold:"分枝"是否展开，默认为false.该属性只在collapsible为true时生效
     * parent:父节点，为WeqiaTree对象。。
     *
     *
     *
     */
    function WeqiaTree(options) {

        var settings = {
            selector: null,
            text: null,
            value: null,
            collapsible: true,
            unfold: false,
            parent: null,
            multiple: false,
            choosecom: false, // 20160830 选择全公司
            expsigninCallBack: null, //20151010 点击展开回调
            expsignoutCallBack: null, //20151010 点击收起回调
            textMax: null //20151014 需要增加长度限制时  可以设置整数值  比如120
        }

        options = this.settings = $.extend(settings, options);
        var target = $(options.selector);
        if (!target.length) {
            target = $("<li></li>");
        }
        this.target = target;
        if (this.settings.collapsible == false) {
            this.settings.unfold = true;
        }
        if (options.parent) {
            this.isRoot = false;
            this.parent = options.parent;
        } else {
            this.isRoot = true;
            this.parent = null;
        }

        this.init();

        if (this.parent)
            this.parent.addChild(this);

        this.attr = {};
        target.data("tree", this);
        return this;
    }

    $.extend(WeqiaTree.prototype, {

        addChild: function (child) {
            if (!this.isParentNode()) {
                this.transToParent();
            }
            var node_target = child.get();

            var branch = this.getBranch();
            var last_node_target = branch.children(".last");
            if (last_node_target.length) {
                last_node_target.removeClass("last");
            }
            if (node_target.hasClass("treeview"))
                node_target.removeClass("treeview");
            node_target.addClass("last");
            branch.append(node_target);
        },

        addChildNode: function (params) {

            var child_node;
            if (params instanceof WeqiaTree) {
                child_node = params;
                child_node.parent = this;
                child_node.isRoot = false;
                this.addChild(child_node)
            } else {
                params = $.extend({}, params);
                var node_target = $('<li></li>');
                node_target.attr('id', 'tree_box_department_' + params.value);
                params.selector = node_target;
                params.parent = this;
                child_node = new WeqiaTree(params);
            }
            return child_node;
        },

        addProjectChildNode: function (params) {

            var child_node;
            if (params instanceof WeqiaTree) {
                child_node = params;
                child_node.parent = this;
                child_node.isRoot = false;
                this.addChild(child_node)
            } else {
                params = $.extend({}, params);
                var node_target = $('<li class="group_li"></li>');
                node_target.attr('id', 'tree_box_group_' + params.value);
                params.selector = node_target;
                params.parent = this;
                child_node = new WeqiaTree(params);
            }
            return child_node;
        },

        before: function (params) {
            params = $.extend({}, params);

            var node = $('<li></li>');

            this.target.before(node);
            params.selector = node;
            params.parent = this.parent;
            return new WeqiaTree(params);
        },


        click: function (fun) {
            if (!$.isFunction(fun))
                return;
            var node = this.target;
            var node_obj = this.getNodeObj();
            var text_obj = this.getTextObj();
            var root_target = this.getRoot().get();
            var $this = this;
            text_obj.unbind("click").click(function (event) {
                fun.call($this, event);
            });
        },

        cursor: function () {
            var node_obj = this.getNodeObj();
            node_obj.addClass("current");
            node_obj.parents().siblings().find(".tree-all").removeClass("current");
        },

        data: function (name, value) {
            var node_obj = this.getNodeObj();
            if (value === undefined)
                return node_obj.data(name);
            else
                node_obj.data(name, value);
        },

        /**
         * return child Node
         */
        findChildNode: function (value) {
            var node_obj = this.target.find("a[value='" + value + "']");
            if (node_obj.length) {
                var node = node_obj.parent();
                return node.data("tree");
            }
            return null;
        },

        /**
         * return current selected node
         */
        findSelectedNode: function () {
            var target = this.target;
            var selected_node_obj = target.find("a.tree-all").filter(".current");
            if (selected_node_obj.length) {
                var node = selected_node_obj.parent();
                return node.data("tree");
            }
            return null;
        },

        /**
         * return target obj
         */
        get: function () {
            return this.target;
        },

        getAttr: function () {
            var attr = this.attr;
            if (!attr)
                return null;
            if (arguments)
                return attr[arguments]
            return attr;
        },

        /**
         * retrun branch obj
         */
        getBranch: function () {
            return this.target.children("ul");
        },

        //		getChildren: function(){
        //			return this.getBranch().children("li");
        //		},

        /**
         * return node obj
         */
        getNodeObj: function () {
            return this.target.children("a.tree-all");
        },

        /**
         * return root node
         */
        getRoot: function () {
            if (this.isRoot)
                return this;
            return this.parent.getRoot();
        },

        getTextObj: function () {
            var node_obj = this.getNodeObj();
            return node_obj.children("span.text");
        },

        hasChildren: function () {
            var children = this.getBranch().children("li");
            if (children.length)
                return true;
            return false;
        },

        init: function () {
            var node = this.target;

            if (this.isRoot) {
                if (!node.hasClass("treeview"))
                    node.addClass("treeview");
            }

            var node_obj = $('<a class="tree-all"></a>');
            node.append(node_obj);
            if (this.settings.value) {
                node_obj.attr("value", this.settings.value);
            }
            if (this.settings.choosecom) {
                node_obj.attr("choosecom", this.settings.choosecom);
            }
            var text_obj = $('<span class="org-name text"></span>');
            if (this.settings.text) {
                /** 20151014 可以限制最大长度**/
                if (this.settings.textMax) {
                    var textst = $wq.getOverFlowText("12px", this.settings.text, this.settings.textMax);
                    text_obj.text(textst);
                    text_obj.attr("title", this.settings.text);
                } else {
                    text_obj.text(this.settings.text);
                }
            }

            node_obj.append(text_obj);
            var $this = this;
            node_obj.click(function (event) {
                var root = $this.getRoot();
                if (!$this.settings.multiple) {
                    root.removeAllCursor();
                    $this.cursor();
                }

            });
        },

        isParentNode: function () {
            var exp_sign = this.target.children("ul");
            if (exp_sign.length)
                return true;
            return false;
        },

        last: function () {
            var tree = this.target;
            var last = tree.children("ul").children("li").last();
            if (last.length)
                return last.data("tree");
            return null;
        },

        remove: function () {
            var target = this.target;
            var parent = this.parent;
            target.remove();
            if (parent && !parent.hasChildren()) {
                parent.transToSingleNode();
            }
        },

        removeAllCursor: function () {
            var root_target = this.get();
            root_target.find(".tree-all").filter(".current").removeClass("current");
        },

        removeChildNode: function (value) {
            if (value) {
                var node_obj = this.target.find("a[value='" + value + "']");
                if (node_obj.length) {
                    var node = node_obj.parent();
                    var chileTree = node.data("tree");
                    chileTree.remove();
                }
            } else {
                this.transToSingleNode();
            }
        },

        setAttr: function (name, value) {
            var attr = this.attr;
            attr[name] = value;
        },

        setText: function (text) {
            var text_obj = this.getTextObj();
            text_obj.text(text);
        },

        text: function () {
            var text_obj = this.getTextObj();
            return text_obj.text();
        },

        transToParent: function () {
            var $this = this;
            var target = this.target;
            var branch = $('<ul></ul>');

            //20151010    将 ul 都加上level属性 pending
            var plv = $(target).parent("ul").attr("plevel");
            if (plv) {
                branch.attr("plevel", parseInt(plv) + 1);
            } else {
                branch.attr("plevel", 1);
            }

            target.append(branch);
            if (this.settings.unfold == false) {
                branch.hide();
            }


            if (this.settings.collapsible == true) {
                var exp_sign = $('<div class="expsign"></div>');

                var hitarea_css = "hitarea";
                var expa_css = "expandable-hitarea";
                if (this.isRoot) {
                    hitarea_css = "rootarea";
                    expa_css = "expandable-rootarea";
                }
                exp_sign.addClass(hitarea_css);
                target.prepend(exp_sign);

                if (this.settings.unfold == false) {
                    exp_sign.addClass(expa_css);
                }

                var $this = this;

                exp_sign.click(function () {
                    var branch = $this.getBranch();
                    if (branch.is(':hidden')) {
                        exp_sign.removeClass(expa_css);
                        branch.slideDown();
                        if ($this.settings.expsigninCallBack) {
                            $this.settings.expsigninCallBack();
                        }

                    } else {
                        exp_sign.addClass(expa_css);
                        branch.slideUp();
                        if ($this.settings.expsignoutCallBack) {
                            $this.settings.expsignoutCallBack();
                        }

                    }
                });
            }
        },

        transToSingleNode: function () {
            var expsign = this.target.children(".expsign");
            var branch = this.getBranch();
            branch.remove();
            expsign.remove();
        },

        value: function () {
            var node_obj = this.getNodeObj();
            return node_obj.attr("value");
        }
    });

    $.wqtree = $wq.tree = function (options) {
        options = $.extend({}, options);
        var tree;
        if (options.selector) {
            tree = $wq.getTree(options.selector);
        }
        //20150409
        if (!tree || $(options.selector).children().length == 0)
            tree = new WeqiaTree(options)
        return tree;
    };

    $wq.getTree = function (selector) {
        var tree = null;
        selector = $(selector);
        if (selector.length) {
            tree = selector.data("tree");
        }
        return tree;
    };


    /**
     * 导入时加载效果
     * content 文本内容
     * src     loading图片
     * root
     */
    $wq.loading_start = function (content, src, root) {
        var h = $(document).height();
        var hw = $(window).height();
        var ajaxload = $("<div class='overlay' style='display: none; opacity: 0;'></div>");
        $("body").append(ajaxload)
        var ajaxload1 = $("<div class='showbox' id='AjaxLoading' style='opacity: 0; margin-top:200px;'></div>");
        $("body").append(ajaxload1)
        var ajaxload2 = $("<div class='loadingWord'><img src='" + src + "'>" + content + "</div>")
        ajaxload1.append(ajaxload2);
        $(".overlay").css({
            "height": h,
            'display': 'block',
            'opacity': '0.6'
        });
        $(".showbox").stop(true).animate({
            'margin-top': hw / 2,
            'opacity': '1'
        }, 200);

    };

    /**
     * 去掉加载效果
     * loading_end
     */
    $wq.loading_end = function () {
        var h = $(document).height();
        var hw = $(window).height();
        if ($(".showbox")) {
            $(".showbox").stop(true).animate({
                'margin-top': hw / 2 - 50,
                'opacity': '0'
            }, 400).remove();
        }
        if ($(".overlay")) {
            $(".overlay").stop(true).animate({
                'display': 'none',
                'opacity': '0'
            }, 400).remove();
        }
    };

    /**
     * 20150122 获得显示字符串截取
     */
    $wq.getOverFlowText = function (fontSize, str, width, thisSpan, fontWeight) {
        var tres = $wq.textSize(fontSize, str);
        if (width >= tres.width) {
            return str;
        }
        var outstr = "";
        //省略号
        var ellipsis = "...";
        var growingLengthSize = 0;
        growingLengthSize += $wq.textSize(fontSize, ellipsis).width;
        if (str) {
            for (var i = 0; i < str.length; i++) {
                //增加了对空字符的兼容度   //str.charAt
                //growingLengthSize += $wq.textSize(fontSize, str.charAt(i)).width;
                growingLengthSize = $wq.textSize(fontSize, str.substr(0, i + 1)).width;
                if (growingLengthSize >= width) {
                    if (thisSpan) {
                        thisSpan.css("width", width);
                    }
                    return outstr + ellipsis;
                } else {
                    //outstr += str.charAt(i);
                    outstr = str.substr(0, i + 1);
                }
            }
        }
        return outstr + ellipsis;
    };

    //20150122 取得宽高  增加fontWeight
    $wq.textSize = function (fontSize, text, fontWeight) {
        var span = document.createElement("span");
        var result = {};
        result.width = span.offsetWidth;
        result.height = span.offsetWidth;
        span.style.visibility = "hidden";
        //	    if(fontWeight){
        //	    	span.style.fontWeight = fontWeight;
        //	    }
        $("body").append(span);
        if (typeof span.textContent != "undefined")
            span.textContent = text;
        else span.innerText = text;
        result.width = span.offsetWidth - result.width;
        result.height = span.offsetHeight - result.height;
        $(span).remove();
        //span.remove();
        return result;
    };

    $wq.money = changePrice2money;

    $wq.wqListSearch = {
        start: function (options) {
            var settings = this.settings = {
                target: null,
                outputElem: null,
                relative: false,
                url: null,
                data: null,
                showCall: null,
                defaultText: null,
                all: true,
                allData: false, //获取全部数据 默认关闭
                offsetY: 0,
                offsetX: 0,
                onClick: null
            };
            this.settings = options = $.extend(settings, options);
            this.ready();
        },
        handleClick: function () {
            var busi_status = $(this).attr("lang");
            var busi_status_content = $(this).html();
            var data = $(this).data("data");
            $this.settings.outputElem.attr("lang", busi_status);
            if ($this.settings.outputElem.is('input')) {
                $this.settings.outputElem.val(busi_status_content);
            } else {
                $this.settings.outputElem.html(busi_status_content);
            }
            $.weqiafloat.hide();
            $this.list.hide();
            var click = $this.settings.onClick;
            if (click) {
                click(data);
            }
        },
        ready: function () {
            this.init();
            this.bind();
        },
        init: function () {
            var $this = this;
            if ($(".wqListSearch_list") && $(".wqListSearch_list").length) {
                $(".wqListSearch_list").empty();
                this.list = $(".wqListSearch_list");
            } else {
                this.list = $('<div class="wqListSearch_list" style="display:none;"></div>');
            }
            var list = this.list;
            var list_search = this.list_search = $('<input type="text" class="wqListSearch_keyword" autocomplete="off" placeholder="' + $this.settings.defaultText + '">');
            var list_ul = $('<ul class="wqListSearch_ul"></ul>');
            if (this.settings.all) {
                var allLi = $('<li class="wqListSearch_ul_li" lang="0">全部</li>');
                list_ul.append(allLi);
                allLi.click(function () {
                    $this.handleClick.call(this);
                });
            }
            $this.settings.data = $this.settings.getData();
            $.doAjaxWQ({
                url: $this.settings.url,
                data: $this.settings.data,
                success: function (datas) {
                    var data;
                    //任务中的项目
                    if (datas.list && datas.list.length) {
                        data = datas.list;
                    } else {
                        data = datas;
                    }
                    if (data && data.length) {
                        $.each(data, function (i, el) {
                            var li = $('<li class="wqListSearch_ul_li" lang="' + el[$this.settings.id] + '">');
                            li.data("data", el);
                            li.html(el[$this.settings.title]);
                            list_ul.append(li);
                            li.click(function () {
                                $this.handleClick.call(this);
                            });
                            if (!$this.settings.allData) {
                                if (i == 9) {
                                    var li = $('<li class="wqListSearch_ul_li">');
                                    li.text("更多请在搜索中查找");
                                    list_ul.append(li);
                                    return false;
                                }
                            }
                        });
                    }
                }
            });
            list.append(list_search);
            list.append(list_ul);
            this.settings.target.append(list);
        },
        bind: function () {
            $this = this;
            var outputElem = this.settings.outputElem;
            outputElem.tooltipFocus();
            outputElem.weqiafloat({
                eventType: "click",
                target: $this.list,
                position: "4-1",
                offsets: {
                    x: this.settings.offsetX,
                    y: this.settings.offsetY
                },
                //20150408  超出边界不判断 edgeAdjust:false,
                edgeAdjust: false,
                relative: this.settings.relative,
                showCall: function () {
                    $this.showCall();
                },
                hideCall: function () {
                    $this.init();
                }
            });
        },
        showCall: function () {
            $this = this;
            $this.list_search.autocomplete({
                source: function (request, response) {
                    $this.settings.data = $this.settings.getData();
                    $.doAjaxWQ({
                        url: $this.settings.url,
                        data: $this.settings.data,
                        success: function (datas) {
                            var data;
                            //任务中的项目
                            if (datas.list && datas.list.length) {
                                data = datas.list;
                            } else {
                                data = datas;
                            }
                            if (data && data.length) {
                                $(".wqListSearch_ul").empty();
                                if ($this.settings.all) {
                                    var allLi = $('<li class="wqListSearch_ul_li" lang="0">全部</li>');
                                    list_ul.append(allLi);
                                    allLi.click(function () {
                                        $this.handleClick.call(this);
                                    });
                                    $(".wqListSearch_ul").append(allLi);
                                    allLi.click(function () {
                                        $this.handleClick.call(this);
                                    });
                                }

                                $.each(data, function (i, el) {
                                    var li = $('<li class="wqListSearch_ul_li" lang="' + el[$this.settings.id] + '">');
                                    li.html(el[$this.settings.title]);
                                    $(".wqListSearch_ul").append(li);
                                    li.click(function () {
                                        $this.handleClick.call(this);
                                    });
                                });
                            }
                        }
                    });
                }
            });
        }

    };

    function changePrice2money(s) {
        var temp = $.trim(s);
        if (temp.length == 0) {
            return "";
        }
        var flag = temp.charAt(0);
        var symbol = "";
        if (flag == "-") {
            symbol = "-";
            s = temp.substr(1, s.length);
        }
        s = s.toString();
        s = s.replace(/^(\d*)$/, "$1.");
        s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
        s = s.replace(".", ",");
        var re = /(\d)(\d{3},)/;
        while (re.test(s))
            s = s.replace(re, "$1,$2");
        s = s.replace(/,(\d\d)$/, ".$1");
        var result = s.replace(/^\./, "0.")
        return symbol + result;
    }

    jQuery.fn.extend({
        money: function (money) {
            if (money == undefined) {
                return this.attr("v");
            } else {
                var template = changePrice2money(money);
                this.attr("v", money);
                this.text(template);
            }
        }
    });

})(jQuery);


