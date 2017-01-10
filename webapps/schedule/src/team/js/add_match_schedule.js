//设置比赛时间
function setMatchTime(obj){
    var picker = new mui.DtPicker({"type":"datetime","beginYear":1990,"endYear":2026});
    picker.show(function(rs){
        console.log(rs.text);
        $("#btnMatchTime").val(rs.text);

        cacheData["btnMatchTime"]=rs.text;
        picker.dispose();
    });
}

//设置报名时间
function setEnrollTime(obj){
    var picker = new mui.DtPicker({"type":"datetime","beginYear":1990,"endYear":2026});
    picker.show(function(rs){
        console.log(rs.text);
        $("#btnEnrollTime").val(rs.text);
        console.log(obj);
        cacheData["btnEnrollTime"]=rs.text;
        picker.dispose();
    });
}


//加载比赛数据
function loadMatchData(){
    $("#match_title").val(cacheData.match_title);
    $("#match_desc").val(cacheData.match_desc);
    $("#match_players").val(cacheData.match_players);
    if(cacheData.matchNumberType && cacheData.matchNumberType > 0){
        $("#btnType").val(cacheData.matchNumberType + "人制");
    }

    if(cacheData.btnMatchTime){
        $("#btnMatchTime").val(cacheData.btnMatchTime);
    }
    if(cacheData.btnEnrollTime){
        $("#btnEnrollTime").val(cacheData.btnEnrollTime);
    }

    if(cacheData.team && cacheData.team.team_name){
        $("#btnMatchTeam").val(cacheData.team.team_name);
    }


    if(cacheData.place && cacheData.place.name){
        $("#btnMatchPlace").val(cacheData.place.name);
    }

    var colors_dict = {
        "0": "url(images/mr-color.png)",
        "1": "rgb(235,58,55)",
        "2": "rgb(255,150,31)",
        "3": "rgb(233,231,49)",
        "4": "rgb(42,183,64)",
        "5": "rgb(51,184,195)",
        "6": "rgb(42,92,225)",
        "7": "rgb(108,29,208)",
        "8": "rgb(191,70,187)",
        "9": "rgb(255,255,255)",
        "10": "rgb(225,225,225)",
        "11": "rgb(0,0,0)",
        "12": "rgb(104,54,14)"
    };
    //设置队服颜色
    if(cacheData.matchTeamColor && cacheData.matchTeamColor > 0) {
        var matchColor = cacheData.matchTeamColor;
        $("#btnTeamColor").css("background", colors_dict[matchColor]);
        if (matchColor == 9) {
            $(".color-btn").css("border", "1px solid #999")
        } else {
            $(".color-btn").css("border", "none")
        }
    }
}

//选择比赛类型
function selectType(){
  var typePicker= new mui.PopPicker();
    typePicker.setData([{
        value: '5',
        text: '5人制'
    }, {
        value: '6',
        text: '6人制'
    }, {
        value: '7',
        text: '7人制'
    }, {
        value: '8',
        text: '8人制'
    }, {
        value: '9',
        text: '9人制'
    }, {
        value: '10',
        text: '10人制'
    }, {
        value: '11',
        text: '11人制'
    }
    ]);
    typePicker.show(function(items){
        console.log(items.text);
        $("#btnType").val(items[0].text);
        cacheData["matchNumberType"]=items[0].value;
        typePicker.dispose();
    });
}


//选择队服颜色
//   选择球衣颜色
function setColor(obj){
    //球衣颜色
    var colors_dict = {
        "0": "url(images/mr-color.png)",
        "1": "rgb(235,58,55)",
        "2": "rgb(255,150,31)",
        "3": "rgb(233,231,49)",
        "4": "rgb(42,183,64)",
        "5": "rgb(51,184,195)",
        "6": "rgb(42,92,225)",
        "7": "rgb(108,29,208)",
        "8": "rgb(191,70,187)",
        "9": "rgb(255,255,255)",
        "10": "rgb(225,225,225)",
        "11": "rgb(0,0,0)",
        "12": "rgb(104,54,14)"
    };
    $(".bg-color,.color-back").show();
    var color_select_element = $(obj);
    var value=$(obj).next().val();
    $(".color-list li").on("click",function(){
        var i=$(this).data("value");
        $(".bg-color,.color-back").hide();
        $(color_select_element).css("background",colors_dict[i]);
        value=i;
        console.log(value);
        if (value==9){
            $(".color-btn").css("border","1px solid #999")
        }else{
            $(".color-btn").css("border","none")
        }
        cacheData["matchTeamColor"] = value;
    });
}

function setTeamColor(colorIndex) {
    var colors_dict = {
        "0": "url(images/mr-color.png)",
        "1": "rgb(235,58,55)",
        "2": "rgb(255,150,31)",
        "3": "rgb(233,231,49)",
        "4": "rgb(42,183,64)",
        "5": "rgb(51,184,195)",
        "6": "rgb(42,92,225)",
        "7": "rgb(108,29,208)",
        "8": "rgb(191,70,187)",
        "9": "rgb(255,255,255)",
        "10": "rgb(225,225,225)",
        "11": "rgb(0,0,0)",
        "12": "rgb(104,54,14)"
    };

    $(".color-btn").css("background",colors_dict[colorIndex]);

    if (colorIndex==9){
        $(".color-btn").css("border","1px solid #999")
    }else{
        $(".color-btn").css("border","none")
    }
}


