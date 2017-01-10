var http = require('../../utils/http.js');

function getScheduleRound(league_id,cb){
    http.post("leagueround/leagueNode",{league_id:league_id},function(code,message,info){
          if(code!=200){
              console.log(message);
              wx.showModal({
                  content: message,
                  showCancel:false,
              });
              return;
          }
          console.log(info);
          cb(info);
      });
}

function getScheduleList(league_id,round_id,cb){
    http.post("leagueround/leagueSchedule",{league_id:league_id,pid:round_id,limit:1000},function(code,message,info){
          if(code!=200){
              console.log(message);
              wx.showModal({
                  content: message,
                  showCancel:false,
              });
              return;
          }
          console.log(info);
          cb(info.list);
      });
}

module.exports = {
    getScheduleRound: getScheduleRound,
    getScheduleList: getScheduleList
}
