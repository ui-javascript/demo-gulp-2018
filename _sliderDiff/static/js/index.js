// function handleBeforeInput(e) {
//     var textRange = $(this).createRange()
//     console.log(textRange)
// }

$("#hello").on("input propertychange", function () {
    // var textRange = document.body.createTextRange()
    // console.log(textRange)


    var text = $(this).val()
    var textlen = $(this).val().length
    if (textlen > 10) {
        var lenText = text.substring(0, 10)
        $(this).val(lenText)
    }
});
