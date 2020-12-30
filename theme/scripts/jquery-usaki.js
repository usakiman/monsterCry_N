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
};

var funSimulView = function(v) {
    var result = v;
    $("#pSimulView").empty();
    for (var i in result) {
        // var td = "<div class='container'>";
        // td += "<button class='btn btn-info' onclick='vItemReturn()'>돌아가기</button>";        
        // td += "<p>"+result[i].cardname+"</p>";        
        // td += "</div>";

        var td = result[i].cardname;        

        console.log(td);
    }

    $("#pSimulView").append(td);        
};

var funAllCalc = function() {
    var effect = $("#ddlMainEffect").val();

    var weaponMain = $("#ddlWeaponMain").val();
    var weaponOption1 = $("#ddlWeaponOption1").val();
    var weaponOption2 = $("#ddlWeaponOption2").val();

    var defenseMain = $("#ddlDefenseMain").val();
    var defenseOption1 = $("#ddlDefenseOption1").val();
    var defenseOption2 = $("#ddlDefenseOption2").val();

    var assMain = $("#ddlAssMain").val();
    var assOption1 = $("#ddlAssOption1").val();
    var assOption2 = $("#ddlAssOption2").val();
 
    console.log(effect);
    console.log(weaponMain);
    console.log(weaponOption1);
    console.log(weaponOption2);
    console.log(defenseMain);
    console.log(defenseOption1);
    console.log(defenseOption2);
    console.log(assMain);
    console.log(assOption1);
    console.log(assOption2);
};