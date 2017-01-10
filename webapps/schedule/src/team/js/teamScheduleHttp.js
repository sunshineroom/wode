var TeamScheduleHttp =function(){

    //当前日程
    this.getEventByNow=function (page, team_id,cb){
        var http=new Http();
        http.sendRequest("/teamevent/getEventByNow",{page:page, team_id:team_id},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    //历史日程
    this.getEventByHistory=function (page,team_id,cb){
        var http=new Http();
        http.sendRequest("/teamevent/getEventByHistory",{page:page, team_id:team_id},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    //添加比赛
    this.addMatch=function (title,matchType,target_team_id,target_team_name,matchTime,enrollTime,place,place_lat,place_lng,teamColor,maxPlayers,desc,team_id,cb){
        var http=new Http();
        http.sendRequest("/teamevent/addMatch",{match_title:title,match_player:matchType,target_team_id:target_team_id ,target_team_name:target_team_name,match_time:matchTime,enroll_time:enrollTime,place:place,place_lat:place_lat,place_lng:place_lng,max_player:maxPlayers,team_color:teamColor, match_desc:desc,team_id:team_id},function(data){
        	cb(data.code,data.message,data.info);
        });
    };

    //编辑比赛
    this.editMatch = function (id, title, matchType,target_team_id,target_team_name, matchTime, enrollTime, place, place_lat, place_lng,teamColor,maxPlayers,match_desc,team_id,cb) {
        console.log(team_id);
        var http = new Http();
        http.sendRequest("/teamevent/editMatch",{id:id,title:title,match_player:matchType,target_team_id:target_team_id,target_team_name:target_team_name,match_time:matchTime,enroll_time:enrollTime,place:place,place_lat:place_lat,place_lng:place_lng,team_color:teamColor,max_player:maxPlayers,match_desc:match_desc,team_id:team_id}, function (data) {
            cb(data.code, data.message, data.info);
        });
    };

    //删除比赛
    this.deleteMatch = function (id, cb) {
        var http=new Http();
        http.sendRequest("/teamevent/deleteMatch",{id:id},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    //添加活动
    this.addActive=function (title,startTime,endTime,place,place_lat,place_lng,desc,team_id,max_player,cb){
        var http=new Http();
        http.sendRequest("/teamevent/addActive",{title:title,start_time:startTime,enroll_time:endTime,place:place,place_lat:place_lat,place_lng:place_lng,desc:desc,team_id:team_id, max_player:max_player},function(data){
        	cb(data.code,data.message,data.info);
        });
    };

    //编辑活动
    this.editActive=function (id,title,startTime,endTime,place,place_lat,place_lng,maxPlayer,desc,team_id,cb){
        var http=new Http();
        http.sendRequest("/teamevent/editActive",{id:id,title:title,start_time:startTime,enroll_time:endTime,place:place,place_lat:place_lat,place_lng:place_lng,max_player:maxPlayer,desc:desc,team_id:team_id},function(data){
            cb(data.code,data.message,data.info);
        });
    };


    //删除活动
    this.deleteActive=function (id,cb){
        var http=new Http();
        http.sendRequest("/teamevent/deleteActive",{id:id},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    //加入 报名,请假,无效
    this.join=function (id,team_id,type,sub_type,cb){
        var http=new Http();
        http.sendRequest("/teamevent/joinEvent",{id:id,team_id:team_id,type:type,sub_type:sub_type},function(data){
            cb(data.code,data.message,data.info);
        });
    };


    //获得比赛或者活动的详情
    this.getEventByID=function (id,team_id,type,cb){
        var http=new Http();
        http.sendRequest("/teamevent/getEventByID",{id:id,team_id:team_id,type:type},function(data){
            cb(data.code,data.message,data.info);
        });
    };


    //获得比赛或者活动的详情
    this.setMatchResult=function (id,team_id,data,cb){
        console.log(data);
        var http=new Http();
        http.sendRequest("/teamevent/addMatchResult",{id:id,team_id:team_id,result:data},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    //录入战报类型
    var matchReport = {
        goal:1,             //进球
        penalty:2,       //点球
        ownGoal:3,      //乌龙球
        assist:4,       //助攻
        redCard:6,      //红牌
        yelllowCard:5,  //黄牌
        teamScale:7   //阵容

    };

    //获得球队成员
    //type 1-进球，2-点球，3-乌龙球，4-助攻，5-红牌，6-黄牌
    this.getTeamEventPlayer = function (id, type, team_id, cb) {
        var http=new Http();
        http.sendRequest("/teamevent/getTeamEventPlayer", {id:id,type:matchReport[type],team_id:team_id}, function (data) {
            cb(data.code,data.message,data.info);
        });
    };

    //比赛战报提交
    //type = 1-进球，2-点球，3-乌龙球，4-助攻，5-红牌，6-黄牌
    this.addMatchEvent = function (match_id,team_id,type,list, cb) {
        var http = new Http();
        //var listString  = JSON.stringify(list);
        http.sendRequest("/teamevent/addMatchEvent", {id:match_id, type:matchReport[type], team_id:team_id,list:list},function (data) {
            cb(data.code, data.message, data.info);
        });
    }

    this.getMatchEventByID = function (match_id, team_id, cb) {
        var http = new Http();
        http.sendRequest("/teamevent/getMatchEventByID", {id:match_id,team_id:team_id},function (data) {
            cb(data.code, data.message, data.info);
        });
    }

};
