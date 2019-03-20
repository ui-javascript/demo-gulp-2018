// 全局配置
$.extend($.fn.dataTable.defaults, {
    // searching: false,
    // ordering:  false,
    lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "全部"]],

    // pagingType: "simple",
    // pagingType: "numbers",
    // pagingType: "first_last_numbers",
    pagingType: "full_numbers",

} );


// 语言
$.fn.dataTable.defaults.oLanguage = {
    "sProcessing": "处理中...",
    "sLengthMenu": "每页显示 _MENU_ 项",
    "sZeroRecords": "没有匹配结果",
    "sInfo": "显示第 _START_ 至 _END_ 项结果，共 _TOTAL_ 项",
    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
    "sInfoPostFix": "",
    "sSearch": "搜索筛选：",
    "sUrl": "",
    "sEmptyTable": "表中数据为空",
    "sLoadingRecords": "载入中...",
    "sInfoThousands": ",",
    "oPaginate": {
        "sFirst": "首页",
        "sPrevious": "上页",
        "sNext": "下页",
        "sLast": "末页"
    },
    "oAria": {
        "sSortAscending": ": 以升序排列此列",
        "sSortDescending": ": 以降序排列此列"
    },
    "zeroRecords": "没有找到",

    // 数字
    // decimal: ",",
    // thousands: ".",
}


// $.extend($.fn.dataTable.ext.order, {
//     'dom-text': function (settings, col) {
//         return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
//             return $('input', td).val()
//         });
//     },
//     'dom-text-numeric': function (settings, col) {
//         return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
//             return $('input', td).val() * 1;
//         });
//     },
//     'dom-select': function (settings, col) {
//         return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
//             return $('select', td).val();
//         });
//     },
//     'dom-checkbox': function (settings, col) {
//         return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
//             return $('input', td).prop('checked') ? '1' : '0';
//         });
//     }
// } );


// /* Create an array with the values of all the input boxes in a column */
// $.fn.dataTable.ext.order['dom-text'] = function (settings, col) {
//     return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
//         return $('input', td).val()
//     });
// }
//
// /* Create an array with the values of all the input boxes in a column, parsed as numbers */
// $.fn.dataTable.ext.order['dom-text-numeric'] = function (settings, col) {
//     return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
//         return $('input', td).val() * 1;
//     });
// }
//
// /* Create an array with the values of all the select options in a column */
// $.fn.dataTable.ext.order['dom-select'] = function (settings, col) {
//     return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
//         return $('select', td).val();
//     });
// }
//
// /* Create an array with the values of all the checkboxes in a column */
// $.fn.dataTable.ext.order['dom-checkbox'] = function (settings, col) {
//     return this.api().column(col, {order: 'index'}).nodes().map(function (td, i) {
//         return $('input', td).prop('checked') ? '1' : '0';
//     });
// }
