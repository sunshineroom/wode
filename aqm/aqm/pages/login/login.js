// pages/loing/login.js
var http = require('../../utils/http.js')

Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
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
  formSubmit: function(e) {
    var obj=e.detail.value;
    console.log(obj);
    http.post("v1/user/login",{account:obj.phone,password:obj.password},function(code,message,info){
        if(code!=200){
            console.log(message);
            wx.showModal({
                content: message,
                showCancel:false,
            });
            return;
        }
        console.log(info.token);
        var app = getApp();
        app.globalData.USER_TOKEN=info.token;

        wx.navigateTo({url: '../league/list?league_id=0&title=球迷赛事'});
    });
  },
})