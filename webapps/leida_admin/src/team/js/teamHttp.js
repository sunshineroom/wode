var TeamHttp =function(){
    var http=new Http();
    
    this.getTeamList=function (unique_tournament_id,cb){
        http.sendRequest("/leidateam/getTeam",{unique_tournament_id:unique_tournament_id},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.getPlayerList=function (team_id,cb){
        http.sendRequest("/leidateam/getPlayer",{team_id:team_id},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setName=function (id,name,cb){
        http.sendRequest("/leidateam/setName",{id:id,value:name},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setLogo=function (id,logo,cb){
        http.sendRequest("/leidateam/setLogo",{id:id,value:logo},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setPlayerName=function (id,name,cb){
        http.sendRequest("/leidateam/setPlayerName",{id:id,value:name},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setPlayerLogo=function (id,logo,cb){
        http.sendRequest("/leidateam/setPlayerLogo",{id:id,value:logo},function(data){
            cb(data.code,data.message,data.info);
        });
    }
};