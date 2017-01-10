var InfoController =function(){
	this.view=new ViewController();
	this.team_id=0;
	this.token='';
	//用户信息
	this.user_info={};
	
	//标题
	this.title="";
	
	this.topVue;
	this.infoVue;
	this.dataVue;
	this.introVue;

	this.chart;

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
	            bridge.callHandler('Title', {"title":"球队基础信息"}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
	    },300);
	}
	//初始化界面
	this.initView=function(){
		var width=$(".info-item-icon").css("width");
		width=width.substr(0,width.length-2);

		var right_width=this.view.screen_width-width-25;
		$(".info-item-text").css("width",right_width+"px");
		$(".info-item-intro").css("width",right_width+"px");


		var height=$('#indicatorContainer').height();
	    $('#match_data_div').height(115);

	    var top=$('#indicatorContainer').css("margin-top");
	    $('#match_data_div').css("margin-top","13px");
	    
	    var left=$('#indicatorContainer').css("margin-left");
	    left=parseInt(left.substr(0,left.length-2));
	    
	    var width=$('#indicatorContainer').width();
	    $('#match_data_div').css("margin-left","10px");

	    var x=30+110+10+10;
	    var w=self.view.screen_width-x;
	    $('#match_data_div').width(w);


	    this.chart= radialIndicator('#indicatorContainer', {
        	barColor: '#00a7f2',
		    barWidth: 5,
	        roundCorner : true,
	        percentage: true
        });	    
	}
	
	//初始化数据
	this.initData=function(){
		this.initTopData();
		this.initInfoData();
		this.initDataData();
		this.initIntroData();
	}

	this.initIntroData=function(){
		this.introVue = new Vue({
	      el: '#text_div',
	      data: {
	      	info:
	      	{
	      		intro:'',
	      		
	      	}
	      },
	      methods: {
		    ifAdmin:function(){
		    	if(self.user_info.is_admin==1 || self.user_info.is_captain==1){
		    		return 1;
		    	}else{
		    		return 0;
		    	}
		    },
		    onSetTeamIntro:function(){
		  		if(self.user_info.is_admin==1 || self.user_info.is_captain==1){
		    		self.setTeamIntro(this.info.intro);
		    	}
		  	}
		  },
		  attached: function(){

		  }
	    });
	}

	this.initDataData=function(){
		this.dataVue = new Vue({
	      el: '#match_data_div',
	      data: {
	      	info:
	      	{
	      		win:0,
	      		lose:0,
	      		draw:0,
	      		goals:0,
	      		goals_against:0,
	      	}
	      },
	      methods: {
		    
		    
		  }
	    });
	}

	this.initInfoData=function(){
		this.infoVue = new Vue({
	      el: '#info_div',
	      data: {
	      	info:
	      	{
	      		team_name:"",
	      		team_city:"",
	      		city_id:0,
	      		team_home_color:0,
	      		team_away_color:0,
	      	},
	      	user_info:{

	      	},
	      },
	      methods: {
		    ifAdmin:function(user_info){
		    	if(user_info.is_admin==1 || user_info.is_captain==1){
		    		console.log("admin");
		    		return 1;
		    	}else{
		    		return 0;
		    	}
		    },
		    //设置球队名称
		    onSetTeamName:function(){
		    	if(self.user_info.is_admin==1 || self.user_info.is_captain==1){
		    		self.setTeamName(this.info.team_name);
		    	}
		    },
		    onSetTeamCity:function(){
		    	if(self.user_info.is_admin==1 || self.user_info.is_captain==1){
		    		self.setTeamCity(this.info.city_id);
		    	}
		    },
		    onSetTeamColor:function(){
		    	if(self.user_info.is_admin==1 || self.user_info.is_captain==1){
		    		self.setTeamColor();
		    	}
		    },
		  }
	    });
	}
	//顶部数据
	this.initTopData=function(){
		this.topVue = new Vue({
	      el: '#top_div',
	      data: {
	      	info:
	      	{
	      		team_logo:"",
	      		is_member:0
	      	}
	      },
	      methods: {
		    //点击logo
		    onClickLogo:function(info){
		    	if(self.user_info.is_admin==1 || self.user_info.is_captain==1){
		    		self.openPhoto();
		    	}
		    },
		    //退出球队
		    onClickQuit:function(){
		    	if(self.user_info.is_captain==0){
		    		var btnArray = ['否', '是'];
					mui.confirm('是否确认离开球队？', '', btnArray, function(e) {
						if (e.index == 1) {
							//非队长
		    				self.quitTeam();
						} 
					})
		    		
		    	}
		    }
		    
		  }
	    });
	}

	//打开相册
	this.openPhoto=function(){
		self.view.webViewJavascriptBridge(function(bridge) {
			//触发按钮
			bridge.callHandler('openPhoto', {count:1,type:2,action:"infoController.setTeamPhoto"}, function responseCallback(responseData) {
                console.log(responseData);
            });
        });
	}

	//设置球队头像
	this.setTeamPhoto=function(value){
		$("#loading").show();
		self.view.post(CONFIG.SET_TEAM_INFO_URL,{team_id:self.team_id,info:{logo:value}},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				mui.alert(message, '', function() {
					
				});
				return;
			}

			self.getTeamInfo();
		});
	}

	//取消管理员
	this.getTeamInfo=function(){
		var self=this;
		$("#loading").show();
		this.view.post(CONFIG.GET_TEAM_INFO_URL,{team_id:this.team_id},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				mui.alert(message, '', function() {
					
				});
				return;
			}
			self.user_info=info.user_info;
			//顶部数据
			self.topVue.info.team_logo=info.team_info.team_logo;
			self.topVue.info.is_member=info.user_info.is_member;

			//信息数据
			self.infoVue.info.team_name=info.team_info.team_name;
			self.infoVue.info.team_city=info.team_info.city_name;
			self.infoVue.info.city_id=info.team_info.city_id;
			self.infoVue.info.team_away_color=info.team_info.away_color;
			self.infoVue.info.team_home_color=info.team_info.home_color;
			self.infoVue.user_info=info.user_info;

			//比赛数据
			var total=info.match_info.win+info.match_info.lose+info.match_info.draw;
			self.dataVue.info=info.match_info;
			self.introVue.info.intro=info.team_info.team_intro;

			//比赛界面
			var chatValue=info.match_info.win/total*100;
			self.chart.value(chatValue);
	    });
	}

	this.setTeamName=function(value){
		this.view.webViewJavascriptBridge(function(bridge) {
			//触发按钮
			var data={team_id:self.team_id,value:value,action:1};
            bridge.callHandler('Click', {"action":"openNewHtml","src":"base/set-info.html","data":data}, function responseCallback(responseData) {
                console.log(responseData);
            });
        });
	}

	this.setTeamCity=function(value){
		this.view.webViewJavascriptBridge(function(bridge) {
			//触发按钮
			var data={team_id:self.team_id,value:value,action:1};
            bridge.callHandler('Click', {"action":"openNewHtml","src":"base/select-city.html","data":data}, function responseCallback(responseData) {
                console.log(responseData);
            });
        });
	}

	this.setTeamIntro=function(value){
		this.view.webViewJavascriptBridge(function(bridge) {
			//触发按钮
			var data={team_id:self.team_id,value:value,action:2};
            bridge.callHandler('Click', {"action":"openNewHtml","src":"base/set-info.html","data":data}, function responseCallback(responseData) {
                console.log(responseData);
            });
        });
	}

	this.setTeamColor=function(value){
		this.view.webViewJavascriptBridge(function(bridge) {
			//触发按钮
			var data={team_id:self.team_id};
            bridge.callHandler('Click', {"action":"openNewHtml","src":"team/set-color.html","data":data}, function responseCallback(responseData) {
                console.log(responseData);
            });
        });
	}

	this.quitTeam=function(){
		$("#loading").show();
		self.view.post(CONFIG.LEAVE_TEAM_URL,{team_id:self.team_id},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				mui.alert(message, '', function() {
					
				});
				return;
			}

			self.getTeamInfo();
		});
	}
}