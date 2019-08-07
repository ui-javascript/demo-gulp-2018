
function showNum() {
    let length = $("input[type='checkbox']:checked").length;
    console.log(length)
}

$("input").change(function () { showNum() })

