function post(url,body,callback){
    wx.showToast({
        title: '加载中',
        icon: 'loading',
        duration: 10000
    });

    var app = getApp();
    var token=app.globalData.USER_TOKEN;
    var http_url=app.globalData.SERVER_URL+url;
    wx.request({
        url: http_url,
        data: body,
        method:"POST",
        dataType: "json", 
        header: {
            'content-type': 'application/x-www-form-urlencoded',
            'platform':'web',
            'token':token
        },
        success: function(res) {
            var data=res.data.data;
            data=JSON.parse(data);
            console.log(data);
            wx.hideToast();
            callback(data.code,data.message,data.info);
        },
        fail:function(err){
            wx.hideToast();
        }
    })
}

module.exports = {
  post: post
}
