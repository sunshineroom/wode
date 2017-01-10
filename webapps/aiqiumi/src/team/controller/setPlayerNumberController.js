var SetPlayerNumberController =function(){
	this.view=new ViewController();
	this.team_id=0;
	this.player_uid=0;
	this.token='';
	//用户信息
	this.user_info={};
	
	//标题
	this.title="";

	this.viewVue;

	var self=this;

	this.init=function(){
		this.view.init();
		this.team_id=this.view.getData("team_id");
		this.player_uid=this.view.getData("player_uid");
		this.token=this.view.getData("token");

		this.initView();
		this.initData();

		setTimeout(function(){
	    	self.view.webViewJavascriptBridge(function(bridge) {
		    	//通知界面标题内容
	            bridge.callHandler('Title', {"title":"设置队员号码和位置"}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
	    },300);
	}
	//初始化界面
	this.initView=function(){
		this.viewVue = new Vue({
	      el: '#data',
	      data: {
	      	info:
	      	{
	      		number:0,
	      		position:""
	      	}
	      },
	      methods: {
		    showClass:function(value){
		    	if(value==this.info.position){
		    		return 'currt';
		    	}else{
		    		return '';
		    	}
		    },
		    onClickPosition:function(value){
		    	this.info.position=value;
		    },
		    onChangeNumber:function(value){
		    	this.info.number=value;
		    }
		    
		  }
	    });
	}
	
	//初始化数据
	this.initData=function(){

	}

	

	//取消管理员
	this.getNumberInfo=function(){
		var self=this;
		$("#loading").show();
		this.view.post(CONFIG.GET_PLAYER_NUMBER_URL,{team_id:this.team_id,player_uid:self.player_uid},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				mui.alert(message, '', function() {
					
				});
				return;
			}

			self.viewVue.info.position=info.position;
			self.viewVue.info.number=info.number;

			self.view.webViewJavascriptBridge(function(bridge) {
				var buttonArray = [
					{"title":"保存","action":"setNumberController.save()"},
				];
				bridge.callHandler("RightButtonInfo", {"buttons":buttonArray}, function responseCallback (responseData) {
					console.log(responseData);
				});
			});
	    });
	}

	this.save=function(){
		$("#loading").show();
		this.view.post(CONFIG.SET_PLAYER_NUMBER_URL,{team_id:this.team_id,player_uid:self.player_uid,number:self.viewVue.info.number,position:self.viewVue.info.position},this.token,function(code,message,info){
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