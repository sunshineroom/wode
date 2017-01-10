// pages/match/info.js
var http = require('../../utils/http.js');
var ranking = require('./ranking.js');
var schedule = require('./schedule.js');

var custom = require('../../utils/custom.js');

Page({
  data:{
      view:{},
      tab_view:{},
      content_view:{},

      ranking_view:{
          select_index:1
      },

      ranking_goal_list:null,
      ranking_assist_list:null,
      ranking_card_list:null,
      ranking_score_list:null,

      schedule_data:null,
  },
  onLoad:function(options){
      // 页面初始化 options为页面跳转所带来的参数
      this.initView();
      this.initData();

      custom.get_access_token();
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
  //点击榜单的tab
  clickRankingTab:function(e){
      var id=e.currentTarget.id;
      id=id.substr(12);
      
      var data=this.data;
      var ranking_data=data.ranking_view;
      ranking_data.select_index=id;
      data.ranking_view=ranking_data;
      this.setData(data);

      if(id==2){
          //射手榜
          this.loadGoalList();
      }else if(id==3){
          //助攻榜
          this.loadAssistList();
      }else if(id==4){
          //助攻榜
          this.loadCardList();
      }
  },
  //tab 点击
  clickTabLabel:function(e){
      var id=e.currentTarget.id;
      id=id.substr(4);
      
      var data=this.data;
      var tab_data=data.tab_view;
      tab_data.select_index=id;
      data.tab_view=tab_data;
      this.setData(data);

      if(id==2){
          //赛程
          this.loadSchedule();
      }else if(id==5){
          //客服
          this.loadContact();
      }
  },
  //初始化界面
  initView:function(){
      var app = getApp();
      var data=this.data;
      data.view={width:app.globalData.SYSTEM_INFO.windowWidth,height:app.globalData.SYSTEM_INFO.windowHeight};
      var tab_height=40;
      data.tab_view={top:app.globalData.SYSTEM_INFO.windowHeight-tab_height,height:tab_height,select_index:1};
      var content_height=app.globalData.SYSTEM_INFO.windowHeight-tab_height;
      var sub_height=content_height-100-30;//top高度,sub-tab高度
      data.content_view={height:content_height,sub_height:sub_height};
      var right_width=app.globalData.SYSTEM_INFO.windowWidth-90-10;
      data.top_view={right_width:right_width};
 
      this.setData(data);
  },
  //初始化数据
  initData:function(){
      this.getLeagueInfo(6);
  },
  //设置界面信息
  setView:function(){
      var title=this.data.info.league_name;
      wx.setNavigationBarTitle({
        title: title
    });
  },
  //获取赛事信息
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
        if(info.league_city_name.length==0) info.league_city_name="全国";

        var data=self.data;
        data.info=info;
        self.setData(data);

        self.setView();
        console.log(info);


        self.loadScoreList();
    });
  },
  //获取射手榜数据
  loadGoalList:function(){
      var self=this;
      if(!this.data.ranking_goal_list){
          ranking.getGoalList(this.data.info.league_id,function(list){
              var data=self.data;
              data.ranking_goal_list=list;
              self.setData(data);
          });
      }
  },
  //获取助攻榜数据
  loadAssistList:function(){
      var self=this;
      if(!this.data.ranking_assist_list){
          ranking.getAssistList(this.data.info.league_id,function(list){
              var data=self.data;
              data.ranking_assist_list=list;
              self.setData(data);
          });
      }
  },
  //获取助攻榜数据
  loadCardList:function(){
      var self=this;
      if(!this.data.ranking_card_list){
          ranking.getCardList(this.data.info.league_id,function(list){
              var data=self.data;
              data.ranking_card_list=list;
              self.setData(data);
          });
      }
  },
  //获取积分榜数据
  loadScoreList:function(){
      var self=this;
      if(!this.data.ranking_score_list){
          ranking.getScoreList(this.data.info.league_id,function(list){
              var data=self.data;
              data.ranking_score_list=list;
              self.setData(data);
          });
      }
  },
  //读取赛程轮次
  loadScheduleRound:function(){
    var self=this;
    schedule.getScheduleRound(this.data.info.league_id,function(list){
        var data=self.data;
        var schedule_data={};
        schedule_data.round_list=list;
        schedule_data.current_round=0;
        schedule_data.max_round=list.length;
        schedule_data.current_round_title=list[schedule_data.current_round].title;
        schedule_data.current_round_id=list[schedule_data.current_round].id;
        schedule_data.data={};
        data.schedule_data=schedule_data;
        self.setData(data);


        self.loadScheduleList();
    });
  },
  //获取赛程数据
  loadScheduleList:function(){
      var self=this;
    schedule.getScheduleList(this.data.info.league_id,this.data.schedule_data.current_round_id,function(list){
        var data=self.data;
        var schedule_data=data.schedule_data;
        schedule_data.data[self.data.schedule_data.current_round_id]=list;
        schedule_data.current_list=list;
        data.schedule_data=schedule_data;
        console.log(data); 
        self.setData(data);
    }); 
  },
  //获取赛程
  loadSchedule:function(){
      if(this.data.schedule_data==null){
          //第一次
          this.loadScheduleRound();
      }else{
          var list=this.data.schedule_data.data[this.data.schedule_data.current_round_id];
          
      }
      
  },
  //赛程轮次选择
  bindRoundChange: function(e) {
    var data=this.data;
    var schedule_data=data.schedule_data;
    schedule_data.current_round=e.detail.value;
    schedule_data.current_round_title=schedule_data.round_list[schedule_data.current_round].title;
    schedule_data.current_round_id=schedule_data.round_list[schedule_data.current_round].id;

    data.schedule_data=schedule_data;
    this.setData(data);

    this.loadScheduleList();
  },

  //客服
  loadContact:function(e){
      var app = getApp();
      var OPEN_ID=app.globalData.OPEN_ID;
      if(OPEN_ID.length==0){
          //没有登录
          wx.login({
            success: _getUserInfo
          })

          function _getUserInfo() {
            wx.getUserInfo({
                success: function (res) {
                    console.log(res);
                }
            })
          }
      }
  }
})