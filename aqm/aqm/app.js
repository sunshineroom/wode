//app.js
App({
    onLaunch: function () {
        this.getSystemInfo();
    },
    //获取当前设备信息
    getSystemInfo:function(){
        var self=this;
        wx.getSystemInfo({
            success: function(res) {
                self.globalData.SYSTEM_INFO=res;
            }
        });
    },
    globalData:{
        SERVER_URL:'https://server.aiqiumi.com/api/v1/',
        USER_TOKEN:'',
        
        APP_ID:'wx595e700700697282',
        APP_SECRET:'7259f9479c543f7cdf3a41fe2308b7ea',
        ACCESS_TOKEN:'',

        OPEN_ID:'',

        //设备信息
        SYSTEM_INFO:{},
    }
})