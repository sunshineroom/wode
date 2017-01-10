var QuestionController =function(){
	this.view=new ViewController();
	this.team_id=0;
	this.action=0;
	this.token='';
	//用户信息
	this.user_info={};

	this.question_id=1;
	this.next_question_id=1;
	this.prev_question_id=1;
	this.current_index=1;

	this.ansData={};
	
	//标题
	this.title="";
	//可以控制
	this.is_cr=true;


	this.viewVue;
	this.toolVue;

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
	            bridge.callHandler('Title', {"title":"球队"}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
		},300);
	}
	//初始化界面
	this.initView=function(){
		
	}
	
	this.initData=function(){
		self.viewVue = new Vue({
	      el: '#data-list',
	      data: {
	      	title:'',
	        list: [],
	      },
	      methods: {
	      	showSelect:function(info){
	      		if(info.v_is_select==true){
	      			return "select";
	      		}else{
	      			return "";
	      		}
	      	},
	      	clickAns:function(info){
	      		for (var i = self.viewVue.list.length - 1; i >= 0; i--) {
	      			self.viewVue.list[i].v_is_select=false;
	      		}
	      		info.v_is_select=true;
	      		self.ansData[info.question_id]=info.answer_key;
	      	}
		  }
	    });

	    self.toolVue = new Vue({
	      el: '#tool',
	      data: {
	      	page:self.current_index,
	      	current_question_id:self.question_id,
	      	is_next:true,
	      },
	      methods: {
	      	showPrev:function(){
	      		console.log("this.current_question_id:"+this.current_question_id);
	      		if(this.current_question_id==1){
	      			return "no-show";
	      		}else{
	      			return "";
	      		}
	      	},
	      	showNext:function(){
	      		console.log("showNext");
	      		if(this.is_next==false){
	      			return "no-show";
	      		}else{
	      			return "";
	      		}
	      	},
	      	onNext:function(){
	      		self.nextQuest();
	      	},
	      	onPrev:function(){
	      		self.prevQuest();
	      	}
		  }
	    });
	}

	this.loadQuestion=function(key,sub_id,is_next){
		$("#loading").show();
		var buf=JSON.stringify(self.ansData);

		self.view.post(CONFIG.GET_TEAM_QUESTION_URL,{team_id:this.team_id,question_id:self.question_id,key:key,answer:buf,submit_question_id:sub_id,is_next:is_next},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			self.is_cr=true;

	        self.next_question_id=info.jump_question_id;
	        self.prev_question_id=info.up_question_id;
	        self.question_id=info.current_question_id;

	        self.viewVue.title=self.current_index+". "+info.question.title;
	        for (var i = info.question.questions.length - 1; i >= 0; i--) {
	        	var obj=info.question.questions[i];
	        	
	        	if(self.ansData[info.current_question_id]==obj.answer_key){
	        		obj.v_is_select=true;
	        	}else{
	        		obj.v_is_select=false;
	        	}
	        	

	        	obj.question_id=info.current_question_id;
	        	info.question.questions[i]=obj;
	        }
	        self.viewVue.list=info.question.questions;

	        self.toolVue.current_question_id=self.question_id;
	        self.toolVue.page=self.current_index;
	        self.toolVue.is_next=info.is_next;

	        if(info.is_next==false){
	        	//显示完成
	        	self.view.webViewJavascriptBridge(function(bridge) {
		            //通知界面右边按钮内容
		            var list=new Array();
		            list.push({title:"完成",action:"questionController.save()"});
		            bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
		                console.log(responseData);
		            });
		        });
	        }else{
	        	self.view.webViewJavascriptBridge(function(bridge) {
		            //通知界面右边按钮内容
		            var list=new Array();
		            bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
		                console.log(responseData);
		            });
		        });
	        }
	    });
	}

	this.nextQuest=function(){
		if(this.is_cr==false) return;
		if(!self.ansData[self.question_id]) return;
		
		this.is_cr=false;
		var sub_id=self.question_id;
		

		var key=self.ansData[self.question_id];

		self.question_id=self.next_question_id;
		self.current_index++;

		questionController.loadQuestion(key,sub_id,1);
	}

	this.prevQuest=function(){
		if(this.is_cr==false) return;
		this.is_cr=false;

		self.question_id=self.prev_question_id;
		var sub_id=self.question_id;
		var key=self.ansData[self.question_id];

		self.current_index--;

		questionController.loadQuestion(key,sub_id,-1);
	}

	this.save=function(){
		if(!self.ansData[self.question_id]) return;

		$("#loading").show();
		var buf=JSON.stringify(self.ansData);

		self.view.post(CONFIG.SET_TEAM_QUESTION_URL,{team_id:this.team_id,answer:buf},this.token,function(code,message,info){
			$("#loading").hide();

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