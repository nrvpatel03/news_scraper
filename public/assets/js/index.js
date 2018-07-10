$(".createNote").click(function(){
    window.location.href = "/articles/" + $(this).attr("_id");
})

$(".deleteNote").click(function(){
    var id = $(this).attr("_id");
    $.ajax({
        url: "/articles/" + id,
        method: "DELETE",
    }).done(function(){
        console.log("deleted");
    })
})