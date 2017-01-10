var PlayerController =function(){
	this.view=new ViewController();
	this.team_id=0;
	this.action=0;
	this.token='';
	//用户信息
	this.user_info={};
	this.current_page=1;
	this.hav_next_page=true;

	//选择的用户设置信息节点
	this.selectSettingInfo={is_admin:1};

	//界面信息
	this.right_width=0;
	this.left_width=0;
	this.viewVue;
	this.settingVue;
	//标题
	this.title="";

	var self=this;

	this.init=function(){
		this.view.init();

		this.team_id=this.view.getData("team_id");
		this.token=this.view.getData("token");
		this.action=this.view.getData("action");

		self.initView();
		self.initData();
		self.checkToken();
		self.getTeamPlayer();
		self.initNavigation();

	};

	this.initNavigation = function () {

		setTimeout(function () {
			self.view.webViewJavascriptBridge(function(bridge) {
				//通知界面标题内容
				bridge.callHandler('Title', {"title":self.title}, function responseCallback(responseData) {
					console.log(responseData);
				});

				//通知界面右边按钮内容
				var list=new Array();
				list.push({title:"显示名字",action:"playerController.showRealname()"});
				bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
					console.log(responseData);
				});
			});
		},300);
	};

	this.checkToken = function () {
		if(this.token.length>0){
			var height=$("#bottom-tool").css("height");
			height=height.substr(0,height.length-2);

			height=this.view.screen_height-height;
			$("#pullrefresh").css("height",height+"px");
			//$("#bottom-tool").show();
		}else{
			$("#pullrefresh").css("height",this.view.screen_height+"px");
			//$("#bottom-tool").hide();
		}
	};

	//初始化界面
	this.initView=function(){
		this.initRefresh();
	    //初始化界面
		var width=$("#data-list").css("width");
		width=width.substr(0,width.length-2);
		
		if(this.action==1){
			//设置队员
			this.right_width=120;
			this.left_width=width-this.right_width;
			$("#data-list .right").css("width",this.right_width+"px");
			$("#data-list .left").css("width",this.left_width+"px");

			this.title="队员";
		}else if(this.action==2){
			//选择队员
			this.right_width=40;
			this.left_width=width-this.right_width;
			$("#data-list .right").css("width",this.right_width+"px");
			$("#data-list .left").css("width",this.left_width+"px");

			this.title="全体队员";
		}
	};

	this.initRefresh=function(){
		//初始化下拉
		mui.init({
	        pullRefresh: {
	            container: '#pullrefresh',
	            down: {
	                callback: playerController.pulldownRefresh
	            },
	            up: {
	                contentrefresh: '正在加载...',
	                callback: playerController.pullupRefresh
	            }
	        }

	    });
	}


	//初始化数据
	this.initData=function(){
		this.initDataList();
		this.initSettingData();
	};
	
	//初始化设置面板数据
	this.initSettingData=function(){
		var self=this;
		this.settingVue = new Vue({
	      el: '#userSetting',
	      data: {data:self.selectSettingInfo},
	      methods: {
		    //点击设置
		    onSetting:function(info){
		    	self.selectInfos.length=0
		    	mui('#userSetting').popover('toggle');
		    },
		    //踢人
		    onKick:function(){
		    	mui('#userSetting').popover('toggle');

		    	var btnArray = ['否', '是'];
				mui.confirm('是否确认将该队员移除球队？', '', btnArray, function(e) {
					if (e.index == 1) {
						self.kickPlayer(self.selectSettingInfo.uid);
					} 
				})
		    },
		    //设为管理员
		    onSetAdmin:function(){
		    	mui('#userSetting').popover('toggle');

		    	var btnArray = ['否', '是'];
				mui.confirm('是否确认将该队员设为管理员？', '', btnArray, function(e) {
					if (e.index == 1) {
						self.setAdmin(self.selectSettingInfo.uid);
					} 
				})
		    },
		    //取消管理员
		    onCancelAdmin:function(){
		    	mui('#userSetting').popover('toggle');

		    	var btnArray = ['否', '是'];
				mui.confirm('是否确认解除该队员的管理员身份？', '', btnArray, function(e) {
					if (e.index == 1) {
						self.cancelAdmin(self.selectSettingInfo.uid);
					} 
				})
		    },
		    //移交队长
		    onChangeCaptain:function(){
		    	mui('#userSetting').popover('toggle');

		    	var btnArray = ['否', '是'];
				mui.confirm('是否确认将队长移交给该队员？', '', btnArray, function(e) {
					if (e.index == 1) {
						self.changeCaptain(self.selectSettingInfo.uid);
					} 
				})
		    },
		  }
	    });
	}

	//初始化列表数据
	this.initDataList=function(){
		var self=this;

		this.viewVue = new Vue({
	      el: '#data-list',
	      data: {
	        list: [],
	      },
	      methods: {
	      	//显示对应的性别图片
	      	showSex:function(sex){
	      		return "images/icon-sex-"+sex+".png";
		    },
		    //显示对应的号码
		    showNumber:function(number){
		    	if(number==-1) return '';
	      		return number;
		    },
		    //是否显示电话
		    ifPhone:function(phone){
		    	if(phone && phone.length==11){
		    		return true;
		    	}else{
		    		return false;
		    	}
		    },
		    //是否显示设置
		    ifSetting:function(info){
		    	var uid=info.uid;
		    	var is_admin=self.user_info["is_admin"];
		    	var is_captain=self.user_info["is_captain"];
		    	var is_member=self.user_info["is_member"];

		    	if(is_member==0) return false;
		    	//非管理员
		    	if(is_admin==0 && is_captain==0) return false;
		    	//是自己
		    	if(uid==self.user_info["uid"]) return false;
		    	//是队长
		    	if(info.is_captain==1) return false;

		    	return true;
		    },
		    //判断是否是球队成员
		    ifMember:function(){
		    	self.view.log(self.user_info);
		    	var is_member=self.user_info["is_member"];
		    	return is_member;
		    },
		    //点击设置
		    onSetting:function(info){
		    	self.selectSettingInfo=info;
		    	self.settingVue.data=self.selectSettingInfo;
		    	mui('#userSetting').popover('toggle');
		    },
		    //点击球衣
		    onShirt:function(info){
		    	console.log(info.uid);
		    	self.openShirt(info.uid);
		    },
		    //页面类型
		    getViewAction:function(){
		    	return self.action;
		    },
		    //显示选择
		    showSelect:function(info){
		    	if(info.v_is_select==false){
		    		return "../../images/icon-unselect.png";
		    	}else{
		    		return "../../images/icon-select.png";
		    	}
		    	
		    },
		    //点击选择
		    onSelectPlayer: function(info){
		    	self.selectPlayer(info);
		    },
			  //显示球员身份
			  showIdentity:function(info){
				  var value="";
				  if(info.is_captain==1){
					  value="队长";
				  }

				  if(info.is_admin==1){
					  value="管理员";
				  }

				  if(value==''){
					  return '';
				  }else{
					  var left="53px";
					  if(info.position==''){
						  left="10px";
					  }
					  return { template: '<span class="identity" style="left:'+left+'">'+value+'</span>' };
				  }
			  },
			  //显示名字
			  showName:function(info){
				  //高度是否将下来
				  var is_top=false;
				  if(info.position.length>0) is_top=true;
				  if(info.is_captain==1) is_top=true;
				  if(info.is_admin==1) is_top=true;

				  var margin_top=-42;
				  if(is_top==false) margin_top+=9;
				  var username_width=self.left_width-57;

				  var name=info.nickname;
				  if(info.v_is_show_realname==true) {
					  name=info.realname;
					  if(!name) name="未设置名字";
				  }

				  return  {template: '<span class="nickname" style="width:'+username_width+'px;margin-top:'+margin_top+'px;">'+name+'</span>' };
			  },
			  userInfoAction:function (uid) {

				  self.view.webViewJavascriptBridge(function (birdge) {
					  var obj = {
						  nativeUrl:"aiqiumi://otherinfo",
						  nativeParams:{uid:uid},
					  };
					  bridge.callHandler('openNative',obj, function responseCallback(responseData) {
						  console.log(responseData);
					  });
				  });
			  },
		  }
	    });
	};

	//选择球员
	this.selectPlayer=function(index){
		this.viewVue.list[index].v_is_select=!this.viewVue.list[index].v_is_select;
	}

	this.loadPlayerList=function(callback){
		self.view.post(CONFIG.GET_TEAM_PLAYER_URL,{team_id:this.team_id,page:this.current_page},this.token,function(code,message,info){
			self.view.log(info);
	        if(info.user_info) self.user_info=info.user_info;
	        for (var i = info.list.length - 1; i >= 0; i--) {
	        	info.list[i].v_is_select=false;
	        	info.list[i].v_is_show_realname=false;
	        }
	        callback(info);
	    });
	}


	this.getTeamPlayer=function(){
		if(self.hav_next_page==true){
			$("#loading").show();
			self.current_page=1;
			self.loadPlayerList(function(info){
				$("#loading").hide();

				self.viewVue.list = self.viewVue.list.concat(info.list);
		        self.hav_next_page=info.isNext;

		        $("#btnInvite").html("邀请新队员("+info.invite_code+")");
		        if(self.user_info.is_member==0){
		        	$("#bottom-tool").hide();
		        }else{
		        	$("#bottom-tool").show();
		        }

		        setTimeout(function() {
		        	if(info.isNext==false){
		        		mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
		        	}
		        },100);
			});
			
		}
	};

	//踢人
	this.kickPlayer=function(uid){
		var self=this;
		$("#loading").show();
		this.view.post(CONFIG.KICK_PLAYER_URL,{team_id:this.team_id,player_uid:uid},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				mui.alert(message, '', function() {
					
				});
				return;
			}

			//删除当前数据
			for (var i = 0; i < self.viewVue.list.length; i++) {
				var obj=self.viewVue.list[i];
				if(obj.uid==uid){
					self.viewVue.list.splice(i, 1);
					break;
				}
			}

	    });
	}

	//设置管理员
	this.setAdmin=function(uid){
		var self=this;
		$("#loading").show();
		this.view.post(CONFIG.SET_ADMIN_URL,{team_id:this.team_id,player_uid:uid},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				mui.alert(message, '', function() {
					
				});
				return;
			}

			//删除当前数据
			for (var i = 0; i < self.viewVue.list.length; i++) {
				var obj=self.viewVue.list[i];
				if(obj.uid==uid){
					self.viewVue.list[i].is_admin=1;
					break;
				}
			}

	    });
	}
	
	//取消管理员
	this.cancelAdmin=function(uid){
		var self=this;
		$("#loading").show();
		this.view.post(CONFIG.CANCEL_ADMIN_URL,{team_id:this.team_id,player_uid:uid},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				mui.alert(message, '', function() {
					
				});
				return;
			}

			//删除当前数据
			for (var i = 0; i < self.viewVue.list.length; i++) {
				var obj=self.viewVue.list[i];
				if(obj.uid==uid){
					self.viewVue.list[i].is_admin=0;
					break;
				}
			}

	    });
	}

	//移交队长
	this.changeCaptain=function(uid){
		var self=this;
		$("#loading").show();
		this.view.post(CONFIG.CHANGE_CAPTAIN_URL,{team_id:this.team_id,player_uid:uid},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				mui.alert(message, '', function() {
					
				});
				return;
			}

			//删除当前数据
			for (var i = 0; i < self.viewVue.list.length; i++) {
				var obj=self.viewVue.list[i];
				if(obj.uid==uid){
					//对方
					self.viewVue.list[i].is_admin=0;
					self.viewVue.list[i].is_captain=1;
				}else if(obj.uid==self.user_info.uid){
					//自己
					self.viewVue.list[i].is_admin=0;
					self.viewVue.list[i].is_captain=0;
				}
			}

	    });
	}

	//显示姓名
	this.showRealname=function(){
		for (var i = 0; i < this.viewVue.list.length; i++) {
			this.viewVue.list[i].v_is_show_realname=true;
		}

		this.view.webViewJavascriptBridge(function(bridge) {
            //通知界面右边按钮内容
            var list=new Array();
            list.push({title:"显示昵称",action:"playerController.showNickname()"});
            bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
                console.log(responseData);
            });
        });
	}

	//显示昵称
	this.showNickname=function(){
		for (var i = 0; i < this.viewVue.list.length; i++) {
			this.viewVue.list[i].v_is_show_realname=false;
		}

		this.view.webViewJavascriptBridge(function(bridge) {
            //通知界面右边按钮内容
            var list=new Array();
            list.push({title:"显示名字",action:"playerController.showRealname()"});
            bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
                console.log(responseData);
            });
        });
	}


	//刷新
    this.pulldownRefresh=function(){
    	self.current_page=1;
		self.loadPlayerList(function(info){
			self.viewVue.list = info.list; 
	        self.hav_next_page=info.isNext;

	        setTimeout(function() {
	            mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);//参数为true代表没有更多数据了。
	            if(info.isNext==false){
	        		mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
	        	}
	        },100);
		});
    }

    this.pullupRefresh=function() {
        self.current_page++;
		self.loadPlayerList(function(info){
			self.viewVue.list = self.viewVue.list.concat(info.list); 
	        self.hav_next_page=info.isNext;

	        setTimeout(function() {
	            if(info.isNext==false){
	        		mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
	        	}else{
	        		mui('#pullrefresh').pullRefresh().endPullupToRefresh();
	        	}
	        },100);
		});
    }

    this.openShirt=function(uid){
    	this.view.webViewJavascriptBridge(function(bridge) {
			//触发按钮
			var data={team_id:self.team_id,player_uid:uid};
            bridge.callHandler('Click', {"action":"openNewHtml","src":"team/set-player-number.html","data":data}, function responseCallback(responseData) {
                console.log(responseData);
            });
        });
    }
}