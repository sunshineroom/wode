var TeamHttp =function(){

    this.searchTeam=function (name,cb){
        var http=new Http();
        http.sendRequest("/team/searchTeam",{team_name:name},function(data){
            cb(data.code,data.message,data.info);
        });
    }

};
