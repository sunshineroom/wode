var RankHttp =function(){
    var http=new Http();
    
    this.getShowUniqueTournament=function (cb){
        http.sendRequest("/leida/getShowUniqueTournamentList",{},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.getScoreRank=function (id,cb){
        var http=new Http();
        http.sendRequest("/Footballdata/getLeagueTable",{id:id},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.getGoalRank=function (id,cb){
        var http=new Http();
        http.sendRequest("/Footballdata/getScorerList",{id:id},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.getAssistRank=function (id,cb){
        var http=new Http();
        http.sendRequest("/Footballdata/getAssistsList",{id:id},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setMatchesTotal=function (id,value,cb){
        http.sendRequest("/Footballdata/setMatchesTotal",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setWinTotal=function (id,value,cb){
        http.sendRequest("/Footballdata/setWinTotal",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setDrawTotal=function (id,value,cb){
        http.sendRequest("/Footballdata/setDrawTotal",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setLossTotal=function (id,value,cb){
        http.sendRequest("/Footballdata/setLossTotal",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setGoalsforTotal=function (id,value,cb){
        http.sendRequest("/Footballdata/setGoalsforTotal",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setGoalsagainstTotal=function (id,value,cb){
        http.sendRequest("/Footballdata/setGoalsagainstTotal",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setPointsTotal=function (id,value,cb){
        http.sendRequest("/Footballdata/setPointsTotal",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setHomeTeamScore=function (id,value,cb){
        http.sendRequest("/Footballdata/setHomeTeamScore",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setAwayTeamScore=function (id,value,cb){
        http.sendRequest("/Footballdata/setAwayTeamScore",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setGoalRanking=function (id,value,cb){
        http.sendRequest("/Footballdata/setGoalRanking",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setGoalNumber=function (id,value,cb){
        http.sendRequest("/Footballdata/setGoalNumber",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setAssistsRanking=function (id,value,cb){
        http.sendRequest("/Footballdata/setAssistsRanking",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.setAssistsNumber=function (id,value,cb){
        http.sendRequest("/Footballdata/setAssistsNumber",{id:id,value:value},function(data){
            cb(data.code,data.message,data.info);
        });
    }
};
