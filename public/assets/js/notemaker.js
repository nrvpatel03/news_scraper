$("#submitNote").click(function(event){
    event.preventDefault();
    var post = {};
    post.title = $("#title").val();
    post.body = $("#body").val();
    
    console.log(post.title);
    console.log(post.body);
    var id = $("#key").text();
    $.post("/articles/" + id, post).done(function(data){
        console.log("posted");
    });
})