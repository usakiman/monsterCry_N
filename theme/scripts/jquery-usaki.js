var funSimulList = function(v) {
    var result = v;
    $("#SimulList").empty();
    for (var i in result) {
        var td = "<div class='old-simul each-testi'>";
        td += "<div class='profile'>";
        td += "<img src='/theme/images/non.jpg' alt=''>";
        td += "<div class='designation'>";
        td += "<button class='btn btn-link' onclick='vItem("+result[i].seq+")'>"+result[i].cardname+"</button>";
        td += "<p>"+result[i].cardlevel+"-"+result[i].cardtype+"-"+result[i].cardrace+"</p>";
        td += "<p>"+result[i].maineffect+"</p>";
        td += "</div></div></div>";

        console.log(td);

        $("#SimulList").append(td);
    }
}

var funSimulView = function(v) {
    var result = v;
    $("#SimulView").empty();
    for (var i in result) {
        var td = "<div class='container'>";
        td += "<button class='btn btn-info' onclick='vItemReturn()'>돌아가기</button>";        
        td += "<p>"+result[i].cardname+"</p>";        
        td += "</div>";

        console.log(td);
    }

    $("#SimulView").append(td);        
}