//设置比赛时间
function setActiveStartTime(obj){
    var picker = new mui.DtPicker({"type":"datetime","beginYear":1990,"endYear":2026});
    picker.show(function(rs){
        console.log(rs.text);
        $("#btnActiveStartTime").val(rs.text);
        cacheData["btnActiveStartTime"]=rs.text;
        picker.dispose();

    });
}

function setActiveEndTime(obj) {
    var picker = new mui.DtPicker({"type":"datetime","beginYear":1990,"endYear":2026});
    picker.show(function(rs){
        console.log(rs.text);
        $("#btnActiveEndTime").val(rs.text);
        cacheData["btnActiveEndTime"]=rs.text;
        picker.dispose();
    });
}



function loadActiveData(){

    //活动名称
    $("#active_title").val(cacheData.active_title);

    //开始时间
    if(cacheData.btnActiveStartTime){
        $("#btnActiveStartTime").val(cacheData.btnActiveStartTime);
    }

    if(cacheData.btnActiveEndTime){
        $("#btnActiveEndTime").val(cacheData.btnActiveEndTime);
    }

    //位置
    if(cacheData.active_place && cacheData.active_place.name){
        $("#btnActivePlace").val(cacheData.active_place.name);
    }

    //上限人数
    if(cacheData.active_maxPlayer && cacheData.active_maxPlayer > 0){
        $("#active_maxPlayer").val(cacheData.active_maxPlayer);
    }

    //备注
    if(cacheData.active_desc){
        $("#active_desc").val(cacheData.active_desc);
    }

    
}
