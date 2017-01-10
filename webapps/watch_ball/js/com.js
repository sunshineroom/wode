
var Com =function(){
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


    this.openLoginView = function (device) {
        if(device){
            window.location.href = "?" + JSON.stringify({action:"sys_login"});
        }
    };

    this.openUserInfoView = function (device,uid) {
        if(device){
            window.location.href = "?" + JSON.stringify({action:"sys_userInfo", user_id:uid});
        }
        console.log("打开页面数据: "+ uid);
    };


    //获取cookie的值
     this.getCookie = function (cname) {
         var name = cname + "=";
         var ca = document.cookie.split(';');
         for(var i=0; i<ca.length; i++)
         {
             var c = ca[i].trim();
             if (c.indexOf(name)==0) return c.substring(name.length,c.length);
         }
         return "";
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


    //2. 获取时间 支持多
    Handlebars.registerHelper('dateFormat', function(time, type) {
        if(time != ""){
            var dateObj = new Date(time.replace(/-/g, '/'));
            var year = dateObj.getFullYear();
            var month = dateObj.getMonth()+1;
            var date = dateObj.getDate();
            var hour = dateObj.getHours();
            var minute = dateObj.getMinutes();
            var second = dateObj.getSeconds();

            if(type == 1){
                return year+"-"+autoFillNum(month)+"-"+autoFillNum(date);
            }else if(type == 2){
                return year+"-"+autoFillNum(month)+"-"+autoFillNum(date)+" "+autoFillNum(hour)+":"+autoFillNum(minute)+":"+autoFillNum(second);
            }else if(type == 3){
                return autoFillNum(month)+"月"+autoFillNum(date)+"日";
            }else if(type == 4){
                return autoFillNum(year) + "年" + autoFillNum(month) + "月" + autoFillNum(date) + "日";
            }
        }
    });

    //自动补全
    function autoFillNum(num){
        return num < 10 ? "0" + num : num;
    }
};
