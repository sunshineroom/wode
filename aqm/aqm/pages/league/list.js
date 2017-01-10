// pages/league/list.js
var http = require('../../utils/http.js');

Page({
  data:{
    current_page:1,
    list:null,
    is_next:true,
    league_id:0,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var league_id=options.league_id;
    var title=options.title;
    var data=this.data;
    data.league_id=league_id;
    this.setData(data);
    this.getLeagueList();
    console.log(options);
    wx.setNavigationBarTitle({
      title: title
    })
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
  loadMore:function(){
      if(this.data.is_next==true){
          this.data.current_page++;
          this.getLeagueList();
      }
  },
  getLeagueList:function(){
      var self=this;
      http.post("v1/league/getList",{page:this.data.current_page,limit:10,pid:this.data.league_id},function(code,message,info){
        if(code!=200){
            console.log(message);
            wx.showModal({
                content: message,
                showCancel:false,
            });
            return;
        }

        self.setData({
            list:info.list,
            is_next:info.is_next,
            page:info.page,
        });
        console.log(self.data);
    });
  },
  clickLeague:function(info){
    var index=info.currentTarget.id;
    var info=this.data.list[index];
    if(info.child!=0){
        //子赛事
        var url='../league/list?league_id='+info.league_id+"&title="+info.league_name;
        wx.navigateTo({url: url});
    }else{
        //赛事详情
        var url='../league/info?league_id='+info.league_id+"&title="+info.league_name;
        wx.navigateTo({url: url});
    }
    
  }
})