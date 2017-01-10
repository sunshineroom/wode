/**
 * Created by lan on 16/11/5.
 */


//选择球队需要传入上一页面的地址
function selectTeam(lastPage){
    var com=new Com();
    com.openNewHtml(view.device,"select_team.html","last_page=" +lastPage+"&title=选择球队"+"&team_id="+team_id+"&data="+encodeURIComponent(JSON.stringify(cacheData)));
}

//选择球队需要传入上一页面的地址
function selectPlace(lastPage){
    var com=new Com();
    com.openNewHtml(view.device,"select_place.html","last_page=" +lastPage+"&title=选择地点"+"&team_id="+team_id+"&data="+ encodeURIComponent(JSON.stringify(cacheData)));
}

function setData(info){
    cacheData[info.id]=info.value;
}


function checkNum(obj){
    var e =$(this);
    if(isNaN(e.val())){
        e.val(e.val().match(/[0-9]*/));
    }
    // if(/\D/.test(obj.value)){
    //     mui.alert('只能输入数字');
    //     obj.value='';
    //     return;
    // }
    setData(e[0]);
}