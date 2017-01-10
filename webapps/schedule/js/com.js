
var Com =function(){
	this.loadScript=function(url, callback){
		var script = document.createElement("script");
		script.type = "text/javascript";
		if (script.readyState) { //IE
			script.onreadystatechange = function() {
				if (script.readyState == "loaded" || script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else { //Others: Firefox, Safari, Chrome, and Opera
			script.onload = function() {
				callback();
			};
		}
		script.src = url;
		document.body.appendChild(script);
	};
	
    this.getParams=function(){
        var thisURL = document.URL;  
        if(thisURL.length>0 && thisURL.substr(thisURL.length-1)=="#"){

            thisURL=thisURL.substr(0,thisURL.length-1);
        }
        var getval =thisURL.split('?')[1];
        var data={};
        if(getval){
            var vv=getval.split('&');
        
            for(var i=0;i<vv.length;i++){
                var v=vv[i];
                var s=v.split('=');
                data[s[0]]=decodeURI(s[1]);
            }
        }
        
        return data;
    };

    //打开页面
    this.openNewHtml=function (device,html,query){
        if(device){

            window.location.href="aiqiumi://openNewHtml/"+html+"?"+query;
        }else{
            window.location.href=html+"?"+query; 
        }
    };

    //打开页面关闭上一个界面
    this.openNewHtmlAndCloseLastView = function(device,html,query) {
        if(device){
            window.location.href="aiqiumi://openNewHtmlAndCloseLastView/"+html+"?"+query;
        }else{
            window.location.href=html+"?"+query;
        }
    };


    //返回页面
    this.goback=function (device){
        if(device){
            window.location.href="aiqiumi://goback";
        }else{
            window.history.back(); 
        }
    };

    //打开评论
    this.openComment=function (device){
        if(device){
            window.location.href="aiqiumi://openComment";
        }else{
            
        }
    };

    //返回页面并且刷新
    this.gobackAndRefresh=function (device){
        if(device){
            window.location.href="aiqiumi://gobackAndRefresh";
        }else{
            window.history.back(); 
        }
    };

    //返回页面带参数 主要是创建日程
    this.gobackByData=function (device,html,query){
        if(device){

            window.location.href="aiqiumi://gobackByData?"+query;
        }else{
            window.location.href=html+"?"+query; 
        }
    };

    //回调球队主页
    this.goBackToMyTeamView = function (device) {
        if (device) {
            window.location.href = "aiqiumi://goBackToMyTeamView";
        } else {

        }
    };

    //返回到指定页面并刷新
    this.gobackToTargetWebView = function (device, html) {
        if(device){
            window.location.href = "aiqiumi://gobackToTargetWebView/"+html;
        }else{

        }
    };

    // 0-  弹出框选择 1 - 微信 2 - 微博
    this.shareAction = function (device,type , url, title, content) {
        if(device) {
            var string = {type:type,shareUrl:url,title:title,content:content };
            window.location.href = "aiqiumi://shareAction?"+JSON.stringify(string);
        }
    };

    //刷新指定页面的数据
    this.refreshTargetView = function (device, html) {
        if(device) {
            window.location.href = "aiqiumi://refreshTargetView/"+html;
        }
    };

    //开始导航
    this.startNavigation = function (device,title,name,lat,lng) {
        var json = JSON.stringify({title:title,name:name,lat:lat,lng:lng});
        if(device){
            window.location.href = "aiqiumi://startNavigation?"+json;
        }else{
            window.location.href = "http://api.map.baidu.com/marker?location="+lat + ","+ lng + "&title="+name+"&output=html";
        }
    };

    //打开新的页面
    this.openWebViewWithURL = function (device,url) {
       var json = JSON.stringify({url:url});
        if(device){
            window.location.href = "aiqiumi://openWebViewWithURL?"+json;
        }else{
            window.location.href = url;
        }
    };

    //打开球队主页
    this.openTeamHomeView = function (device, team_id) {
        if(device){
            var json = JSON.stringify({team_id:team_id});
            window.location.href = "aiqiumi://openTeamHomeView?"+json;
        }
    };

    //打开用户信息
    this.openUserInfoView = function (device, user_id) {
        if(device){
            var json = JSON.stringify({user_id:user_id});
            window.location.href = "aiqiumi://openUserInfoView?"+json;
        }
    };


    //模板插件
    Handlebars.registerHelper('compare', function(left, operator, right, options) {
        if (arguments.length < 3) {
            throw new Error('Handlerbars Helper "compare" needs 2 parameters');
        }

        var operators = {
            '==' : function(l, r) {
                return l == r;
            },
            '===' : function(l, r) {
                return l === r;
            },
            '!=' : function(l, r) {
                return l != r;
            },
            '!==' : function(l, r) {
                return l !== r;
            },
            '<' : function(l, r) {
                return l < r;
            },
            '>' : function(l, r) {
                return l > r;
            },
            '<=' : function(l, r) {
                return l <= r;
            },
            '>=' : function(l, r) {
                return l >= r;
            },
            'typeof' : function(l, r) {
                return typeof l == r;
            }
        };

        if (!operators[operator]) {
            throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
        }
        var result = operators[operator](left, right);
        if (result) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    });
};
