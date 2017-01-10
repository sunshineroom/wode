var BallHttp =function(){
    
    this.match=function (id,cb){
        var http=new Http();
        http.sendRequest("/footballmatch/match",{"id":id},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    this.matchGoal=function (id,cb){
        var http=new Http();
        http.sendRequest("/footballmatch/matchgoal",{"id":id},function(data){
            cb(data.code,data.message,data.info);
        });
    };
    
    this.matchEvent=function (id,cb){
        var http=new Http();
        http.sendRequest("/footballmatch/matchevent",{"id":id},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    this.matchLineup=function (id,cb){
        var http=new Http();
        http.sendRequest("/footballmatch/matchlineup",{"id":id},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    this.matchStatistics=function (id,cb){
        var http=new Http();
        http.sendRequest("/footballmatch/matchstatistics",{"id":id},function(data){
            cb(data.code,data.message,data.info);
        });
    };
    
    this.getAssistList = function (id, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getassistsranking",{"id":id},function (data) {
           cb(data.code,data.message, data.info); 
        });
    };

    // this.getLeagueList = function (id, cb) {
    //     var http = new Http();
    //     http.sendRequest("/footballdata/getHomeLeaguetable",{"id":id}, function (data) {
    //         cb(data.code, data.message, data.info);
    //     })
    // };

    this.getLeagueList = function (id, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getleaguetable",{"id":id}, function (data) {
            cb(data.code, data.message, data.info);
        })
    };

    this.getScheduleRound = function (id, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getscheduleround",{id:id}, function (data) {
           cb(data.code,data.message,data.info);
        });
    };

    this.getschedulelist = function (id,round_id,ord, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getschedulelist",{id:id,round_id:round_id,ord:ord}, function (data) {
           cb(data.code,data.message,data.info);
        });
    };

    this.getScheduleList = function (id, order, stage, cb) {
          var http = new Http();
        http.sendRequest("/football/schedule",{id:id, order:order, stage:stage}, function (data) {
            cb(data.code, data.message, data.info);
        });
    };
    
    this.getScoreList = function (id, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getgoalranking", {id:id}, function (data) {
           cb(data.code, data.message, data.info);
        });
    }
    
    this.getFifaClubList = function (id, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getfifaclubranking", {id:id}, function (data) {
           cb(data.code, data.message, data.info);
        });
    }
    
    this.getFifaList = function (id, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getfifaranking", {id:id}, function (data) {
           cb(data.code, data.message, data.info);
        });
    }   
    
    this.getFifaPlayersList = function (id, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getfifaplayersranking", {id:id}, function (data) {
           cb(data.code, data.message, data.info);
        });
    } 
    
    this.getTeamBaseInfo = function (name, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getteambaseinfo", {name:name}, function (data) {
           cb(data.code, data.message, data.info);
        });
    } 
    
    this.getTeamSchedule = function (name, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getteamschedule", {name:name}, function (data) {
           cb(data.code, data.message, data.info);
        });
    } 
    
    this.getTeamPlayers = function (name, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getteamplayers", {name:name}, function (data) {
           cb(data.code, data.message, data.info);
        });
    } 
    
    this.getTeamNews = function (name, cb) {
        var http = new Http();
        http.sendRequest("/football2data/getteamnews", {name:name}, function (data) {
           cb(data.code, data.message, data.info);
        });
    } 
};
