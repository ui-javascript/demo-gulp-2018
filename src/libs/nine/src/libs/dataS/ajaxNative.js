// 1、封裝AJAX函數
function nativeAjax(option, success, error) {
    // 定义domain,方便环境切换
    var domain = 'https://' + window.location.host + '/';
    var url = domain + option.urlStr;
    var type = option.ajaxType;
    var data = option.ajaxData;
    var xhrRequest = null;
    if (window.XMLHttpRequest) {
        xhrRequest = new XMLHttpRequest();
    } else {
        xhrRequest = new ActiveXObject('Microsoft.XMLHTTP')
    }
    var str = "";
    xhrRequest.open(type, url, true);
    if (type === "POST" && data != null) {
        xhrRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
        for (var key in data) {
            str += '&' + key + '=' + data[key];
        }
        str = str.slice(1);
    } else {
        str = null;
    }
    xhrRequest.onreadystatechange = function () {
        if (xhrRequest.readyState == 4) {
            if (xhrRequest.status == 200) {
                // 1.1、格式化返回的数据
                var responseData = JSON.parse(xhrRequest.responseText);
                // 1.2、这里操作数据--------
                success(responseData);
            } else {
                // 1.3、没成功返回HTTP状态码
                error(xhrRequest.status);
            }
        }
    }
    xhrRequest.send(str);
}

// 2、POST：定義請求參數
var postOption = {
    ajaxType: "POST",
    urlStr: "v2/html/broke/get_broke_ranked_info",
    ajaxData: {
        "HTTP_USER_TOKEN": token,
        "HTTP_USER_UID": pfid,
        "anchor_pfid": anchor_pfid,
        "broke_pfid": pfid,
        "date": date
    }
}
// 3、调用AJAX
nativeAjax(postOption, function (data) {
    // 3.1、请求成功回调
    console.log(data);
}, function (error) {
    // 3.2、请求失败回调,返回HTTP状态码
    console.log(error);
});


//4、GET：定义请求参数
var getOption = {
    ajaxType: "GET",
    urlStr: "v2/html/broke/get_broke_ranked_info",
    ajaxData: null
}
Ajax(getOption, function (data) {
    // 成功函数
    console.log(data);
}, function (error) {
    // 失败返回HTTP状态码
    console.log(error);

});
// 使用说明
// 一、option必须
option = {
    //1、ajaxType必须："GET"或者"POST"
    ajaxType: "",
    //2、urlStr必须："string类型"
    urlStr: "",
    //3、必须：POST时候为object{key:value}，GET的时候直接为：null
    ajaxData: null
}
// 二、success请求成功回调必须
// 三：error请求失败回调必须
