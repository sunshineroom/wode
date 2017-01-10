var HonorController =function(){
	this.view=new ViewController();
	this.team_id=0;
	this.user_id=0;
	this.action=0;
	this.token='';
	this.type = 0;  // 1表示球队 2 表示个人
	//用户信息
	this.user_info={};
	this.current_page=1;
	this.hav_next_page=true;
	this.team_name = "";
	this.user_name = "";


	//界面信息

	this.viewVue;

	//标题
	this.title="荣誉墙";

	var self=this;

	this.init=function(){
		this.view.init();
		this.type    =  this.view.viewData.type;
		this.token	 =	this.view.viewData.token;

		switch (self.type){
			case 1:
				self.team_id = self.view.viewData.team_id;
				break;
			case 2:
				self.user_id = self.view.viewData.user_id;
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
		this.initRefresh();
	  	this.initDataList();

	};

	this.initNavigationRightBtn = function () {

		self.view.webViewJavascriptBridge(function(bridge) {
			var buttonArray = [
				{"title":"分享","action":"honorController.shareAction()", type:"share"},
			];
			bridge.callHandler("RightButtonInfo", {"buttons":buttonArray}, function responseCallback (responseData) {
				console.log(responseData);
			});
		});
	};


	this.shareAction = function () {

		var url= "";
		var title  = "";
		switch (self.type){
			case 1:
			 	url = self.view.viewData.http_url + "/webapps/aiqiumi/src/scheduele/honor.html?" + this.view.encodeShareData({team_id:self.team_id,type:1, id:self.view.viewData.id,share:1});
				title = "【" + self.team_name + "】荣誉墙";
				break;
			case 2:
				url = self.view.viewData.http_url + "/webapps/aiqiumi/src/scheduele/honor.html?" + this.view.encodeShareData({user_id:self.user_id,type:2, id:self.view.viewData.id,share:1});
				title =  "【" + self.user_name + "】荣誉墙";
				break;
		}
		//分享事件
		self.view.shareAction(0,title,title,url,"",null);
	};

	
	this.initRefresh=function(){
		//初始化下拉
		mui.init({
	        pullRefresh: {
	            container: '#pullrefresh',
                down: {
					callback: honorController.pulldownRefresh
				},
	            up: {
	                contentrefresh: '正在加载...',
	                callback: honorController.pullupRefresh
	            }
	        }
	    });
	};

	//初始化数据
	this.initData=function(){
		$("#btnAdd").click(function(){
			self.view.webViewJavascriptBridge(function(bridge) {
				//触发按钮
				var data = {};
				switch (self.type){
					case 1:
						data={team_id:self.team_id, type:1};
						break;
					case 2:
						data={user_id:self.user_id, type:2};
						break;
				}
	            bridge.callHandler('Click', {"action":"openNewHtml","src":"team/add-honor.html","data":data}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
		});
	};

	//初始化列表数据
	this.initDataList=function(){
		var self=this;

		this.viewVue = new Vue({
	      el: '#data-list',
	      data: {
			  is_slider:true,
	        list: [],
	      },
	      methods: {
			  delete_honor:function (obj,index,ievent) {
				  console.log(obj);
				  var ievent = ievent;
				  mui.confirm('确认删除该条记录？', 'Hello MUI', ['确认', '取消'], function(e) {
					  if (e.index == 0) {
						  var params = {
							  honor_type:self.view.viewData.type,
							  honor_id:obj.id,
							  type_id: self.view.viewData.type == 1? self.team_id:self.user_id,
						  }
						  self.view.post(CONFIG.DEL_HONOR, params,self.view.viewData.token,function (code, message, info) {
							  if (code != 200) {
								  mui.alert(message, '', function () {
								  });
								  return;
							  };
							  mui.swipeoutClose(ievent.target.parentNode.parentNode);
							  self.viewVue.list.splice(index,1);
						  });

					  } else {
						  // setTimeout(function() {
						  //   $.swipeoutClose(li);
						  // }, 0);
					  }
				  });
			  },
		  }
	    });
	};

	this.loadHonorList=function(callback){

		switch (self.type){
			case 1:
				self.loadTeamHonorList(callback);
				break;
			case 2:
				self.loadSingleHonorList(callback);
				break;
		}


	};

	this.loadSingleHonorList = function (callback) {
		self.view.post(CONFIG.GET_HONOR_SINGLE_URL,{uid:self.user_id,page:this.current_page},this.token,function(code,message,info){
			self.view.log(info);
			if(info.user_info) self.user_info=info.user_info;

			if(self.user_info.is_mtself == 1 ){
				if(! self.view.viewData.share || self.view.viewData.share == 0){
					$("#btnAdd").show();
				}else{
					$("#btnOpenApp").show();
				}
			}else{
				self.viewVue.is_slider = false;
			}

			for (var i = info.list.length - 1; i >= 0; i--) {
				info.list[i].v_is_select=false;
				info.list[i].v_is_show_realname=false;
			}
			callback(info);

			self.user_name = info.user_info.nickname;



			self.initNavigationRightBtn();

			self.setShareInfo();
		});
	};

	this.setShareInfo = function () {

		if(self.view.viewData.share && self.view.viewData.share == 1){
			switch (self.type){
				case 1:
					self.view.setShareInfo("【" + self.team_name + "】荣誉墙")
					break;
				case 2:
					self.view.setShareInfo("【" + self.user_name + "】荣誉墙")
					break;
			}


		}
	};

	this.loadTeamHonorList = function (callback) {
		self.view.post(CONFIG.GET_HONOR_URL,{team_id:this.team_id,page:this.current_page},this.token,function(code,message,info){
			self.view.log(info);
			if(info.user_info) self.user_info=info.user_info;
			for (var i = info.list.length - 1; i >= 0; i--) {
				info.list[i].v_is_select=false;
				info.list[i].v_is_show_realname=false;
			}
			callback(info);

			self.team_name = info.team_info.team_name;

			if(self.user_info.is_admin == 1 || self.user_info.is_captain==1 ){
				if(! self.view.viewData.share || self.view.viewData.share == 0){
					$("#btnAdd").show();
				}else{
					$("#btnOpenApp").show();
				}
				self.viewVue.is_slider = true;
			}else{
				self.viewVue.is_slider = false;
			}

			self.initNavigationRightBtn();
			self.setShareInfo();
		});
	};



	this.getHonor=function(callback){
		$("#loading").show();
		self.current_page=1;
		//mui('#pullrefresh').pullRefresh().scrollTo(0,0,0);
		self.loadHonorList(function(info){
			$("#loading").hide();

			if(self.current_page == 1){
				self.viewVue.list = info.list;
				self.hav_next_page=info.isNext;
			}else{
				self.viewVue.list = self.viewVue.list.concat(info.list);
				self.hav_next_page=info.isNext;
			}
	        setTimeout(function() {
	        	if(info.isNext==false){
	        		mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
	        	}
	        },100);
		});
	}

	//刷新
    this.pulldownRefresh=function(){
    	console.log("pulldownRefresh");
    	self.current_page=1;
		self.loadHonorList(function(info){
			self.viewVue.list = info.list;
	        self.hav_next_page=info.isNext;

			setTimeout(function() {
				mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
				if(info.isNext==false){
					mui('#pullrefresh').pullRefresh().disablePullupToRefresh();
				}else{
					mui('#pullrefresh').pullRefresh().enablePullupToRefresh();
				}
			},100);
		});
    };

    this.pullupRefresh=function() {
        self.current_page++;
		self.loadHonorList(function(info){
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
    };
};