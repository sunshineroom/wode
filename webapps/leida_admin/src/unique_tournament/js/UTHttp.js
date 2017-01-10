var UTHttp =function(){

    this.getUniqueTournament=function (page,search_key,cb){
        var http=new Http();
        http.sendRequest("/leida/getUniqueTournamentList",{page:page,search_key:search_key},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.getTournament=function (page,search_key,cb){
        var http=new Http();
        http.sendRequest("/leida/getTournamentList",{page:page,search_key:search_key},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setShow=function (id,is_show,cb){
        var http=new Http();
        http.sendRequest("/leida/setShow",{id:id,is_show:is_show},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setCup=function (id,is_cup,cb){
        var http=new Http();
        http.sendRequest("/leida/setCup",{id:id,is_cup:is_cup},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setOrd=function (id,ord,cb){
        var http=new Http();
        http.sendRequest("/leida/setOrd",{id:id,value:ord},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setName=function (id,name,cb){
        var http=new Http();
        http.sendRequest("/leida/setName",{id:id,value:name},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setDQDID=function (id,name,cb){
        var http=new Http();
        http.sendRequest("/leida/setDQDID",{id:id,value:name},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setLogo=function (id,logo,cb){
        var http=new Http();
        http.sendRequest("/leida/setLogo",{id:id,value:logo},function(data){
            cb(data.code,data.message,data.info);
        });
    }


    this.setTournamentOrd=function (id,ord,cb){
        var http=new Http();
        http.sendRequest("/leida/setTournamentOrd",{id:id,value:ord},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setTournamentName=function (id,name,cb){
        var http=new Http();
        http.sendRequest("/leida/setTournamentName",{id:id,value:name},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setTournamentStage=function (id,name,cb){
        var http=new Http();
        http.sendRequest("/leida/setTournamentStage",{id:id,value:name},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setTournamentStageName=function (id,name,cb){
        var http=new Http();
        http.sendRequest("/leida/setTournamentStageName",{id:id,value:name},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setTournamentFirstNum=function (id,name,cb){
        var http=new Http();
        http.sendRequest("/leida/setTournamentFirstNum",{id:id,value:name},function(data){
            cb(data.code,data.message,data.info);
        });
    }

    this.setTournamentLastNum=function (id,name,cb){
        var http=new Http();
        http.sendRequest("/leida/setTournamentLastNum",{id:id,value:name},function(data){
            cb(data.code,data.message,data.info);
        });
    }


    this.setTournamentData=function (data,cb){
        var http=new Http();
        http.sendRequest("/leida/setTournamentData",{list:data},function(data){
            cb(data.code,data.message,data.info);
        });
    }
};
