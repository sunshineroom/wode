var NewviewController =function(){
    //ZgArZWVvR1hr2vj80vzAqIu+zOzA96jqXUpU7r1zvpRJQ9YqaHVIv1X8+jmD4HlbEVI6fKqdtS8egAfNylbBR+9uZvZW9uuGekZ3GStHHo5pk6NGBjKiCOu1PJE/78//JsUvgc/SiWcr2OITzO28mk4LWAg=
    this.viewData={};
    this.screen_height=0;
    this.screen_width=0;
  
    this.init=function(){
        var self=this;
        try{
            var thisURL = document.URL; 
            if(thisURL.charAt(thisURL.length - 1)=="#"){
                thisURL=thisURL.substr(0,thisURL.length-1);
            }
               
            var getval =thisURL.split('?')[1];
            
            if(!getval) return;
            //解密
            //var param=Base64.decode(getval,true);
            var param = utf8to16(base64decode(getval));

            var data=eval('(' + param + ')');
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
            this.webViewJavascriptBridge(function(bridge) {
                bridge.callHandler('Log', {"AQMWP":value}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
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
        WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
    
};