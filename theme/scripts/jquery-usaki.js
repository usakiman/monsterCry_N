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

var funSimulViewInit = function() {
    $("#pSimulView").empty();
    $("#spnResult").empty();

    $("#ddlMainEffect").val("");

    $("#ddlWeaponMain").val("");
    $("#ddlWeaponOption1").val("");
    $("#ddlWeaponOption2").val("");

    $("#ddlDefenseMain").val("");
    $("#ddlDefenseOption1").val("");
    $("#ddlDefenseOption2").val("");

    $("#ddlAssMain").val("");
    $("#ddlAssOption1").val("");
    $("#ddlAssOption2").val("");

    $("#ddlAttSpeedControl1").val("0");
    $("#ddlAttSpeedControl2").val("0");

    $("#ddlSkillSpeedControl1").val("0");
    $("#ddlSkillSpeedControl2").val("0");

}

var funSimulView = function(v) {
    var result = v;    
    funSimulViewInit();
    for (var i in result) {
        // var td = "<div class='container'>";
        // td += "<button class='btn btn-info' onclick='vItemReturn()'>돌아가기</button>";        
        // td += "<p>"+result[i].cardname+"</p>";        
        // td += "</div>";

        var td = result[i].cardname + " - 기본행동력 (" + result[i].cardactpower + ")";

        $("#hidActPower").val(result[i].cardactpower);
        $("#hidActSkill1").val(result[i].cardactive1);
        $("#hidActSkill1_w").val(result[i].cardactive1_waiting);
        $("#hidActSkill2").val(result[i].cardactive2);
        $("#hidActSkill2_w").val(result[i].cardactive2_waiting);

        console.log(td);
    }

    $("#pSimulView").append(td);        
};

var funGetEach = function(v) {
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

    var attSpeedControl1 = $("#ddlAttSpeedControl1").val();
    var attSpeedControl2 = $("#ddlAttSpeedControl2").val();

    var skillSpeedControl1 = $("#ddlSkillSpeedControl1").val();
    var skillSpeedControl2 = $("#ddlSkillSpeedControl2").val();

    var sumVal = 0.0;

    if (effect != "") {
        effect = effect.replace('%/g', '');
        var aryVal = effect.split(',');

        if (aryVal.length == 2) {
            var aryVal11 = $.trim(aryVal[0]);
            var aryVal22 = $.trim(aryVal[1]);

            var aryVal111 = aryVal11.split(' ');
            if (aryVal111.length == 2) {
                if (aryVal111[0] == v) sumVal += parseFloat(aryVal111[1]);
            }

            var aryVal222 = aryVal22.split(' ');
            if (aryVal222.length == 2) {
                if (aryVal222[0] == v) sumVal += parseFloat(aryVal222[1]);
            }

        } else {
            var aryVal2 = aryVal[0].split(' ');
        
            if (aryVal2.length == 2) {
                if (aryVal2[0] == v) sumVal += parseFloat(aryVal2[1]);
            }
        }
    }

    if (weaponMain != "") {
        var aryVal = weaponMain.split(' ');

        if (aryVal.length == 2) {
            if (aryVal[0] == v) sumVal += parseFloat(aryVal[1]);
        }
    }
    if (weaponOption1 != "") {
        var aryVal = weaponOption1.split(' ');

        if (aryVal.length == 2) {
            if (aryVal[0] == v) sumVal += parseFloat(aryVal[1]);
        }
    }
    if (weaponOption2 != "") {
        var aryVal = weaponOption2.split(' ');

        if (aryVal.length == 2) {
            if (aryVal[0] == v) sumVal += parseFloat(aryVal[1]);
        }
    }
    if (defenseMain != "") {
        var aryVal = defenseMain.split(' ');

        if (aryVal.length == 2) {
            if (aryVal[0] == v) sumVal += parseFloat(aryVal[1]);
        }
    }
    if (defenseOption1 != "") {
        var aryVal = defenseOption1.split(' ');

        if (aryVal.length == 2) {
            if (aryVal[0] == v) sumVal += parseFloat(aryVal[1]);
        }
    }
    if (defenseOption2 != "") {
        var aryVal = defenseOption2.split(' ');

        if (aryVal.length == 2) {
            if (aryVal[0] == v) sumVal += parseFloat(aryVal[1]);
        }
    }
    if (assMain != "") {
        var aryVal = assMain.split(' ');

        if (aryVal.length == 2) {
            if (aryVal[0] == v) sumVal += parseFloat(aryVal[1]);
        }
    }
    if (assOption1 != "") {
        var aryVal = assOption1.split(' ');

        if (aryVal.length == 2) {
            if (aryVal[0] == v) sumVal += parseFloat(aryVal[1]);
        }
    }
    if (assOption2 != "") {
        var aryVal = assOption2.split(' ');

        if (aryVal.length == 2) {
            if (aryVal[0] == v) sumVal += parseFloat(aryVal[1]);
        }
    }

    var as = parseFloat(attSpeedControl1 + "." + attSpeedControl2);
    if (v == "공속") {
        sumVal += as;
    }

    var ss = parseFloat(skillSpeedControl1 + "." + skillSpeedControl2);
    if (v == "스속") {
        sumVal += ss;
    }

    return sumVal.toPrecision(4); // 소수점 자리 반올림처리
}

var funAllCalc = function() {
    
    var vAttSpeed = funGetEach("공속");
    var vSkillSpeed = funGetEach("스속");
    var vResult;

    $.ajax({
        type : "POST",
        url : "/card/actResult",
        dataType : "JSON",            
        data : {
            "actPower" : $("#hidActPower").val(),
            "skill1_w" : $("#hidActSkill1_w").val(),
            "skill2_w" : $("#hidActSkill2_w").val(),
            "attSpeed" : vAttSpeed,
            "skillSpeed" : vSkillSpeed
        },
        success: function(result){       
            if (result.length > 0) {
                
                vResult = result.split(',');

                var msg = "[계산 결과]" + "<br/>";
                msg += "행동력: ("+vResult[0]+") 초" + "<br/>";
                msg += $("#hidActSkill1").val() + " 쿨타임 ("+vResult[1]+") 초" + "<br/>";
                msg += vResult[3] + " 번째 턴 올때 초기화" + "<br/>";
                msg += $("#hidActSkill2").val() + " 쿨타임 ("+vResult[2]+") 초" + "<br/>";
                msg += vResult[4] + " 번째 턴 올때 초기화" + "<br/>";    

                var vTotalHealth = funGetEach("최대생명력");
                var vCritical = funGetEach("치명타");
                var vCounterAttack = funGetEach("반격");
                var vBlock = funGetEach("막기");
                var vEvasion = funGetEach("회피");

                var vRecoveryA = funGetEach("회복량");
                var vAttackA = funGetEach("공격량");
                var vDefenseA = funGetEach("방어량");
                var vOffence = funGetEach("공격력");
                var vDefense = funGetEach("방어력");

                var vHit = funGetEach("명중");
                var vCureA = funGetEach("치유량");
                var vMaximzation = funGetEach("극대화");
                var vElasticity = funGetEach("탄력");
                var vDamageReflection = funGetEach("피해반사량");
                var vBloodSuckingA = funGetEach("흡혈량");
                
                var msgResult = msg + "<br/><br/>";

                msgResult += "공속:" + parseFloat(vAttSpeed+100) + "<br>";
                msgResult += "스속:" + parseFloat(vSkillSpeed+100) + "<br>";
                msgResult += "최대생명력:" + vTotalHealth + "<br>";
                msgResult += "치명타:" + vCritical + "<br>";
                msgResult += "반격:" + vCounterAttack + "<br>";
                msgResult += "막기:" + vBlock + "<br>";
                msgResult += "회피:" + vEvasion + "<br>";
                msgResult += "회복량:" + vRecoveryA + "<br>";
                msgResult += "공격량:" + vAttackA + "<br>";
                msgResult += "방어량:" + vDefenseA + "<br>";
                msgResult += "공격력:" + vOffence + "<br>";
                msgResult += "방어력:" + vDefense + "<br>";
                msgResult += "명중확률:" + vHit + "<br>";
                msgResult += "치유량:" + vCureA + "<br>";
                msgResult += "극대화:" + vMaximzation + "<br>";
                msgResult += "탄력:" + vElasticity + "<br>";
                msgResult += "피해반사량:" + vDamageReflection + "<br>";
                msgResult += "흡혈량:" + vBloodSuckingA + "<br>";
                
                $("#spnResult").html(msgResult);
            }                                                        
        },
        error : function(e) {                
            console.log("ERROR: ", e);
        }
    });
    
};