$("#submitNote").click(function(event){
    event.preventDefault();
    var post = {};
    post.title = $("#title").val();
    post.body = $("#body").val();
    
    
    var id = $("#key").text();
    $.post("/articles/" + id, post).done(function(data){
        console.log("posted");
        
    });
    alert("Note Created");
    
})