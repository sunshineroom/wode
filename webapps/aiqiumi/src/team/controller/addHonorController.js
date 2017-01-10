var AddHonorController =function(){
	this.view=new ViewController();
	this.team_id=0;
	this.token='';
	//用户信息
	this.user_info={};

	this.user_id = 0;

	this.type = 0;

	//标题
	this.title="荣誉墙";
	
	this.listVue;

	var self=this;

	this.init=function(){
		this.view.init();
		this.token=this.view.getData("token");
		this.action=this.view.getData("action");
		this.type = this.view.getData("type");

		switch (self.type){
			case 1:
				this.team_id=this.view.getData("team_id");
				break;
			case 2:
				this.user_id=this.view.getData("user_id");
				break;
		}


		this.initView();
		this.initData();
		

		setTimeout(function(){
	    	self.view.webViewJavascriptBridge(function(bridge) {
				//通知界面标题内容
	            bridge.callHandler('Title', {"title":self.title}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
	    },300);
	}
	
	//初始化界面
	this.initView=function(){
		self.listVue = new Vue({
			el: '#logo-list',
			data: {
				list: [],
			},
			methods: {
				showSelect:function(obj){
					if(obj.select==1) return "select";

					return "";
				},
				onSelect:function(index){
					for (var i = this.list.length - 1; i >= 0; i--) {
						this.list[i].select=0;
					}
					this.list[index].select=1;
				}
			}
		});
	};

	//初始化数据
	this.initData=function(){
		switch (self.type){
			case 1:
				self.getTeamHonorLogo();
				break;
			case 2:
				self.getSingleHonorLogo();
				break;
		}
	};

	this.save=function(){
		var desc=$("#desc").val();
		if(desc.length==0) return;
		var logo='';
		for (var i = this.listVue.list.length - 1; i >= 0; i--) {
			if(this.listVue.list[i].select==1){
				logo=this.listVue.list[i].logo;
				break;
			}
		}
		if(logo.length==0) return;

		$("#loading").show();

		switch (self.type){
			case 1 :
				self.saveTeamHonor(logo, desc);
				break;
			case 2 :
				self.saveSingleHonor(logo, desc);
				break;
		}
	};

	this.saveTeamHonor = function (logo, desc) {
		self.view.post(CONFIG.SET_HONOR_URL,{team_id:self.team_id,logo:logo,desc:desc},this.token,function(code,message,info){
			$("#loading").hide();
			if(code!=200){
				mui.alert(message, '', function() {

				});
				return;
			}
			mui.toast("创建成功");
			//关闭当前页面，并且刷新上一个页面
			self.view.webViewJavascriptBridge(function(bridge) {
				//通知界面标题内容
				bridge.callHandler('CloseAndRefresh', {}, function responseCallback(responseData) {
					console.log(responseData);
				});
			});
		});
	};

	this.saveSingleHonor = function (logo, desc) {
		self.view.post(CONFIG.SET_HONOR_SINGLE_URL,{uid:self.user_id,logo:logo,desc:desc},this.token,function(code,message,info){
			$("#loading").hide();
			if(code!=200){
				mui.alert(message, '', function() {

				});
				return;
			}
			mui.toast("创建成功");
			//关闭当前页面，并且刷新上一个页面
			self.view.webViewJavascriptBridge(function(bridge) {
				//通知界面标题内容
				bridge.callHandler('CloseAndRefresh', {}, function responseCallback(responseData) {
					console.log(responseData);
				});
			});
		});
	};

	this.getTeamHonorLogo=function(){
		$("#loading").show();
		self.view.post(CONFIG.GET_HONOR_LOGO_URL,{team_id:self.team_id},this.token,function(code,message,info){
			$("#loading").hide();
			console.log(info.list);
			for(var i=0;i<info.list.length;i++){
				info.list[i].select=0;
			}
			self.listVue.list=info.list;

			$('#logo-list').width(info.list.length*110);

			self.user_info=info.user_info;
			var is_admin=self.user_info["is_admin"];
		    var is_captain=self.user_info["is_captain"];
		    //非管理员
		    if(is_admin==1 || is_captain==1) {
		    	setTimeout(function(){
			    	self.view.webViewJavascriptBridge(function(bridge) {
			            var list=new Array();
			            list.push({title:"完成",action:"addHonorController.save()"});
			            bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
			                console.log(responseData);
			            });
			        });
			    },1000);
		    }
	    });
	}

	this.getSingleHonorLogo = function () {
		$("#loading").show();
		self.view.post(CONFIG.GET_HONOR_SINGLE_LOGO_URL,{user_id:self.user_id},this.token,function(code,message,info){
			$("#loading").hide();
			console.log(info);
			for(var i=0;i<info.length;i++){
				info[i].select=0;
			}
			self.listVue.list=info;
			$('#logo-list').width(info.length*110);
			setTimeout(function(){
				self.view.webViewJavascriptBridge(function(bridge) {
					var list=new Array();
					list.push({title:"完成",action:"addHonorController.save()"});
					bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
						console.log(responseData);
					});
				});
			},1000);
		});
	};


};