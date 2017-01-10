var MatchHttp =function(){
    var http=new Http();
    
    this.getMatchList=function (page,unique_tournament_id,search_key,cb){
        http.sendRequest("/leidamatch/getMatch",{page:page,unique_tournament_id:unique_tournament_id,search_key:search_key},function(data){
            cb(data.code,data.message,data.info);
        });
    }
    
    this.getRecommendMatchList=function (page,unique_tournament_id,search_key,cb){
        http.sendRequest("/leidamatch/getRecommendMatch",{page:page,unique_tournament_id:unique_tournament_id,search_key:search_key},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.getShowUniqueTournament=function (cb){
        http.sendRequest("/leida/getShowUniqueTournamentList",{},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.saveMatch=function (data,cb){
        http.sendRequest("/leidamatch/saveMatch",{data:data},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.removeMatch=function (id,cb){
        http.sendRequest("/leidamatch/removeMatch",{id:id},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.recommendMatch=function (id,is_check,cb){
        http.sendRequest("/leidamatch/recommendMatch",{id:id,is_check:is_check},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.recommendMatchs=function (ids,cb){
        http.sendRequest("/leidamatch/recommendMatchs",{ids:ids},function(data){
            cb(data.code,data.message,data.info);
        });
    }
};
