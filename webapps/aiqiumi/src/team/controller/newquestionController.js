var NewquestionController =  function(){
	this.view = new ViewController();
	this.team_id = 0;
	this.action = 0;
	this.token = '';
	this.user_info = {};
	this.question_id = 1;
	this.next_question_id = 1;
	this.prev_question_id = 1;
	this.current_index = 1;
	this.ansData={};
	this.title='';
	this.is_cr=true;
	this.viewVue;
	this.toolVue;

	var self = this;
	this.init =  function(){
		this.view.init();
		this.team_id = this.view.getData('team_id');
		this.token = this.view.getData('token');

		this.initView();
		this.initData();

		setTimeout(function(){
			self.view.webViewJavascriptBridge(function(bridge){
				bridge.callHandler('Title',{'title':'球队'},function reponseCallback(reponseData){
					console.log(reponseData);
				});
			});
		},200);
	}
	//
	this.initView = function(){}
	this.initData=function(){
		self.viewVue = new Vue({
			el:'#data-list',
			data:{
				title:'',
				list:[].
			},
			methods:{
				showSelect:function(info){
					if(info.v_is_select==true){
						return "select";
					}else{
						return "";
					}
				},
				clickAns:function(info){
					for(var i=self.viewVue.list.length-1;i>=0;i--){
						self.viewVue.list[i].v_is_select=false;
					}
					info.v_is_select=true;
					self.ansData[info.question_id]=info.answer_key;
				}
			}
		});
		self.toolVuew = new Vue({
			el:'#tool',
			data:{
				page:self.current_index,
				current_question_id:self.questin_id,
				is_next:true,
			},
			methods:{
				showPrew:fundtion(){
					console.log("this.cyurrent_question_id:"+this.current_questio_id);
					if(this.current_question_id==1){
						return "no_show";
					}else{
						return "";
					}
				},
				showNext:function(){
					console.log('showNext');
					if(this.is_next==false){
						return "no_show";
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
		$('#loading').show();
		var buf=Jsonstringify(self.ansData);

		self.view.post(CONFIG.GET_TEAM_QUESSTION_URL,{team_id:this.team_id,questin_id:self.question,key:key,answer:buf,submit_question_id:sub_id,is_next:is_next},this.token,function(code.message,info){
			$('#loading').hide();
			self.view.log(info);
			self.is_cr=true;

			self.next_question_id=info.jump_question_id;
			self.prev_question_id=info.up_question_id;
			self.question_id=info.current_question_id;

			self.viewVue.title=self.current_index+". "+info.question.title;
			for(var i = info.question.questions.length-1;i>=0;i--){
				
			}
		})
	}
}