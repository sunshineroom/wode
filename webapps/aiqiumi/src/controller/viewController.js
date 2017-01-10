var ViewController =function(){
    //ZgArZWVvR1hr2vj80vzAqIu+zOzA96jqXUpU7r1zvpRJQ9YqaHVIv1X8+jmD4HlbEVI6fKqdtS8egAfNylbBR+9uZvZW9uuGekZ3GStHHo5pk6NGBjKiCOu1PJE/78//JsUvgc/SiWcr2OITzO28mk4LWAg=
    this.viewData={};
    this.screen_height=0;
    this.screen_width=0;

    var self=this;
    this.init=function(){
        try{
            var thisURL = document.URL; 
            if(thisURL.charAt(thisURL.length - 1)=="#"){
                thisURL=thisURL.substr(0,thisURL.length-1);
            }
               
            var getval =thisURL.split('?')[1];
            getval = getval.split("&")[0];
            if(!getval) return;
            self.log(getval);
            //解密
            var param = utf8to16(base64decode(getval));

            var data=eval('(' + param + ')');
            self.log(data);
            self.viewData=data;
        }catch(err){
           //在此处理错误
           self.log(err);
        }

        document.body.style.backgroundColor = "#e3e8eb";
        self.screen_width=window.screen.width;
        self.screen_height=window.screen.height;
    }


    this.getData=function(key){
        return this.viewData[key];
    }

    //获取加密数据
    this.cryptData=function(){
        // var buf=JSON.stringify(this.viewData);
        // return Base64.encode(buf);
    }


    //加密分享数据
    this.encodeShareData = function (data) {
        var buf = JSON.stringify(data);
        return utf16to8(base64encode(buf));
    };


    //post数据
    this.post=function(url,body,token,callback){
        var http_url=this.viewData["http_url"]+url;

        var vue=new Vue();
        vue.$http.post(http_url,body,{emulateJSON:true,headers:{'platform':'web','token':token}}).then(function(response){
            // 响应成功回调
            var buf=response.data;
            var data=eval('(' + buf.data + ')');
            callback(data.code,data.message,data.info);
        }, function(response){
            // 响应错误回调
            callback(500,"网络错误",{});
        });
    }

    this.log=function(value){
        console.log(value);
        try{
            // this.webViewJavascriptBridge(function(bridge) {
            //     bridge.callHandler('Log', {"AQMWP":value}, function responseCallback(responseData) {
            //         console.log(responseData);
            //     });
            // });
        }catch(err){
           console.log(err);
        }
        
    }


    this.webViewJavascriptBridge=function(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 1000)
    };


    //分享按钮  0 调用分享面板操作, 1 微信分享 2-朋友圈分享 3 短信分享
    this.shareAction = function (type, title,content, url,image, otherData) {
        self.webViewJavascriptBridge(function(bridge) {
            //触发按钮
            var params = {
                type:type,
                data:{
                    share_title:title,
                    share_content:content,
                    share_url:url,
                    share_image:image,
                    share_other:otherData,
                }
            };
            bridge.callHandler('shareAction',params , function responseCallback(responseData) {
                console.log(responseData);
            });
        });
    }
    
    this.baiduNavigation = function (title, place, lat, lng) {
        self.webViewJavascriptBridge(function(bridge) {
            //触发按钮
            var params = {
                type:1,
                data:{
                    title:title,
                    place:place,
                    lat:lat,
                    lng:lng
                }
            };
            bridge.callHandler('locationNavigationAction',params , function responseCallback(responseData) {
                console.log(responseData);
            });
        });
    }
    
    this.setShareInfo = function (title) {
        var surl=location.href.split('#')[0];
        self.post(CONFIG.GET_WX_SHARE, {url:surl},"", function (code,message,info) {
            self.log(info);
            if(code != 200)return;
            wx.config({
                debug: false,
                appId: info.appId+"",
                timestamp: info.timestamp+"",
                nonceStr: info.nonceStr+"",
                signature: info.signature+"",
                jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage']
            });

            //准备数据
            wx.ready(function(){
                console.log("ready");
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                //shareInfo.url=config.share_url+surl;
                wx.onMenuShareTimeline({
                    title: title,
                    link: info.url, // 分享链接
                    imgUrl: info.image, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

                wx.onMenuShareAppMessage({
                    title: title,
                    link: info.url,
                    imgUrl: info.image,
                    desc:"",
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });
            });
        });
    }
};