//获取开发的token
function get_access_token(){
    var app = getApp();
    var APP_ID=app.globalData.APP_ID;
    var APP_SECRET=app.globalData.APP_SECRET;

    var http_url="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+APP_ID+"&secret="+APP_SECRET;
    wx.request({
        url: http_url,
        method:"GET",
        success: function(res) {
            var access_token=res.data.access_token;
            console.log(access_token);
            //保存access_token到全局变量
            app.globalData.ACCESS_TOKEN=access_token;
        },
        fail:function(err){
            
        }
    })
}

module.exports = {
  get_access_token: get_access_token
}
