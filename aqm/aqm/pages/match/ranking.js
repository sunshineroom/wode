var http = require('../../utils/http.js');

function getGoalList(league_id,cb){
    http.post("leagueranklist/getGoalList",{league_id:league_id,limit:200},function(code,message,info){
          if(code!=200){
              console.log(message);
              wx.showModal({
                  content: message,
                  showCancel:false,
              });
              return;
          }

          for(var i=0;i<info.list.length;i++){
              var obj=info.list[i];
              var realname=obj.realname;
              var a=realname.split('<');
              realname=a[0];
              info.list[i].realname=realname;
          }
          cb(info.list);
      });
}

function getAssistList(league_id,cb){
    http.post("leagueranklist/getAssistList",{league_id:league_id,limit:200},function(code,message,info){
          if(code!=200){
              console.log(message);
              wx.showModal({
                  content: message,
                  showCancel:false,
              });
              return;
          }

          for(var i=0;i<info.list.length;i++){
              var obj=info.list[i];
              var realname=obj.realname;
              var a=realname.split('<');
              realname=a[0];
              info.list[i].realname=realname;
          }
          cb(info.list);
      });
}

function getCardList(league_id,cb){
    http.post("leagueranklist/getCardList",{league_id:league_id,limit:200},function(code,message,info){
          if(code!=200){
              console.log(message);
              wx.showModal({
                  content: message,
                  showCancel:false,
              });
              return;
          }

          for(var i=0;i<info.list.length;i++){
              var obj=info.list[i];
              var realname=obj.realname;
              var a=realname.split('<');
              realname=a[0];
              info.list[i].realname=realname;
          }
          cb(info.list);
      });
}

function getScoreList(league_id,cb){
    http.post("leagueranklist/getScoreList",{league_id:league_id,limit:200},function(code,message,info){
          if(code!=200){
              console.log(message);
              wx.showModal({
                  content: message,
                  showCancel:false,
              });
              return;
          }
          console.log(info);
          cb(info.list.around);
      });
}

module.exports = {
    getGoalList: getGoalList,
    getAssistList: getAssistList,
    getCardList: getCardList,
    getScoreList: getScoreList
}