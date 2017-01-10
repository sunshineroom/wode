var SetColorController =function(){
	this.view=new ViewController();
	this.team_id=0;
	this.token='';
	//用户信息
	this.user_info={};
	
	//标题
	this.title="";

	this.home_color=0;
	this.away_color=0;
	
	this.colors_dict = {
        "0": "url(/public/mobile/images/bifen/color0.png) no-repeat",
        "1": "rgb(235,58,55)",
        "2": "rgb(255,150,31)",
        "3": "rgb(233,231,49)",
        "4": "rgb(42,183,64)",
        "5": "rgb(51,184,195)",
        "6": "rgb(42,92,225)",
        "7": "rgb(108,29,208)",
        "8": "rgb(191,70,187)",
        "9": "rgb(255,255,255)",
        "10": "rgb(225,225,225)",
        "11": "rgb(0,0,0)",
        "12": "rgb(104,54,14)"
    };

	var self=this;

	this.init=function(){
		this.view.init();
		this.team_id=this.view.getData("team_id");
		this.token=this.view.getData("token");

		this.initView();
		this.initData();

		setTimeout(function(){
	    	self.view.webViewJavascriptBridge(function(bridge) {
		    	//通知界面标题内容
	            bridge.callHandler('Title', {"title":"设置球队球衣颜色"}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
	    },300);
	}
	//初始化界面
	this.initView=function(){
		
	}
	
	//初始化数据
	this.initData=function(){
		$(".home-color-box li").on("tap",function(){
            var i =$(this).data("value");
            self.home_color=i;
            console.log($(this));
            text =$(this).find(".color-ft").text();
            console.log(text);
            $(this).css("border-color",self.colors_dict[i]);
            $(this).siblings("li").css("border-color","#fff");
            if(i==9||i==0){
                $(this).css("border-color","#d4d4d4");
            }

        })

        $(".away-color-box li").on("tap",function(){
            var i =$(this).data("value");
            self.away_color=i;
            console.log($(this));
            text =$(this).find(".color-ft").text();
            console.log(text);
            $(this).css("border-color",self.colors_dict[i]);
            $(this).siblings("li").css("border-color","#fff");
            if(i==9||i==0){
                $(this).css("border-color","#d4d4d4");
            }

        })
	}

	
	this.setHomeColor=function(i){
		console.log(i);
        $(".home-color-box li").each(function(){
            if($(this).data("value")==i){
                $(this).css("border-color",self.colors_dict[i]);
                self.home_color=i;
            }
        })
    }

    this.setAwayColor=function(i){
    	console.log(i);
        $(".away-color-box li").each(function(){
            if($(this).data("value")==i){
                $(this).css("border-color",self.colors_dict[i]);
                self.away_color=i;
            }
        })
    }

	//取消管理员
	this.getColorInfo=function(){
		var self=this;
		$("#loading").show();
		this.view.post(CONFIG.GET_TEAM_COLOR_URL,{team_id:this.team_id},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				mui.alert(message, '', function() {
					
				});
				return;
			}

			self.home_color=info.team_info.home_color;
			self.away_color=info.team_info.away_color;
			self.setHomeColor(info.team_info.home_color);
			self.setAwayColor(info.team_info.away_color);


			self.view.webViewJavascriptBridge(function(bridge) {
				var buttonArray = [
					{"title":"保存","action":"setColorController.save()"},
				];
				bridge.callHandler("RightButtonInfo", {"buttons":buttonArray}, function responseCallback (responseData) {
					console.log(responseData);
				});
			});
	    });
	}

	this.save=function(){
		$("#loading").show();
		this.view.post(CONFIG.SET_TEAM_COLOR_URL,{team_id:this.team_id,home_color:self.home_color,away_color:self.away_color},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				mui.alert(message, '', function() {
					
				});
				return;
			}

			//关闭当前页面，并且刷新上一个页面
			self.view.webViewJavascriptBridge(function(bridge) {
				//通知界面标题内容
	            bridge.callHandler('CloseAndRefresh', {}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
	    });
	}

}