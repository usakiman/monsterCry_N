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
            td += "</div></div></div>";

            console.log(td);

        $("#SimulList").append(td);
    }
}