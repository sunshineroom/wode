// pages/league/info.js
var http = require('../../utils/http.js');

Page({
  data:{
      info:{},
      team:[],
      select_tab_index:1,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 页面初始化 options为页面跳转所带来的参数
    var league_id=options.league_id;
    var title=options.title;
    wx.setNavigationBarTitle({
        title: title
    });
    this.getLeagueInfo(league_id);
  },
  onReady:function(){
    // 页面渲染完成
    
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },
  clickDataTab:function(info){
      var index=info.currentTarget.id;
      var data=this.data;
      data.select_tab_index=index;
      this.setData(data);
      console.log(index);
  },
  getLeagueInfo:function(league_id){
      var self=this;
      http.post("league/info",{league_id:league_id},function(code,message,info){
        if(code!=200){
            console.log(message);
            wx.showModal({
                content: message,
                showCancel:false,
            });
            return;
        }
        var data=self.data;
        data.info=info;
        self.setData(data);

        
        console.log(info);

        self.getLeagueTeam();
    });
  },
  getLeagueTeam:function(){
      var self=this;
      http.post("league/getJoinTeam",{league_id:self.data.info.league_id,limit:200},function(code,message,info){
        if(code!=200){
            console.log(message);
            wx.showModal({
                content: message,
                showCancel:false,
            });
            return;
        }
        
        var data=self.data;
        data.team=info.list;
        self.setData(data);
        
        console.log(info);
    });
  }
})