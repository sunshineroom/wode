var SetInfoController =function(){
	this.view=new ViewController();
	this.uString=new utilsStirng();

	this.team_id=0;
	this.token='';
	this.value='';
	//用户信息
	this.user_info={};
	
	//标题
	this.title="";

	var self=this;

	this.init=function(){
		this.view.init();
		this.team_id=this.view.getData("team_id");
		this.value=this.view.getData("value");
		this.token=this.view.getData("token");
		this.action=this.view.getData("action");

		this.initView();
		this.initData();

		setTimeout(function(){
			self.view.webViewJavascriptBridge(function(bridge) {
				//通知界面标题内容
	            bridge.callHandler('Title', {"title":self.title}, function responseCallback(responseData) {
	                console.log(responseData);
	            });

	            //通知界面右边按钮内容
	            var list=new Array();
	            list.push({title:"保存",action:"setInfoController.save()"});
	            bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
		},300);
	}
	//初始化界面
	this.initView=function(){
		if(this.action==1){
			this.title="修改球队名称";
			$("#inValue_t").hide();
		}else if(this.action==2){
			this.title="修改球队介绍";
			$("#inValue_i").hide();
		}

		
	}

	
	//初始化数据
	this.initData=function(){
		if(this.action==1){
			$("#inValue_i").val(this.value);
		}else if(this.action==2){
			$("#inValue_t").val(this.value);
		}

		$("#inValue_t").keypress(function(e){
	        var eCode = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;
	        if (eCode == 13){
	            self.save();
	        }
		})
	}

	this.save=function(){
		var value;
		if(this.action==1){
			value=$("#inValue_i").val();
			if(self.uString.valid(value)==true) {
				mui.alert("不能包含特殊字符或者空格", '', function() {
						
				});
				return  ;
			}
		}else if(this.action==2){
			value=$("#inValue_t").val();
		}


		var data={};
		if(this.action==1){
			data["team_name"]=value;
		}else if(this.action==2){
			data["intro"]=value;
		}

		$("#loading").show();
		this.view.post(CONFIG.SET_TEAM_INFO_URL,{team_id:self.team_id,info:data},this.token,function(code,message,info){
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