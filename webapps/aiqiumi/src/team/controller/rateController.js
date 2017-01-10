var RateController =function(){
	this.view=new ViewController();
	this.team_id=0;
	this.action=0;
	this.token='';
	//用户信息
	this.user_info={};

	
	
	//标题
	this.title="";
	this.chart;
	this.topVue;


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
	            bridge.callHandler('Title', {"title":"球队数据"}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
		},300);
	}
	//初始化界面
	this.initView=function(){
		$("#top").height(this.view.screen_height*0.34);
		$("#space").height(this.view.screen_height*0.02);
		$("#bottom").height(this.view.screen_height*0.64);

		self.chart = echarts.init(document.getElementById('bottom'));
	}
	
	this.initData=function(){
		this.topVue = new Vue({
	      el: '#top',
	      data: {
	      	info:
	      	{
	      		level:0,
	      		
	      	}
	      },
	      methods: {
		    showLevel:function(level){
		    	return "images/level"+level+".png";
		    }
		  }
	    });
	}

	this.loadData=function(key,sub_id,is_next){
		$("#loading").show();

		self.view.post(CONFIG.GET_TEAM_LEVEL_URL,{team_id:this.team_id},this.token,function(code,message,info){
			$("#loading").hide();
			
			console.log(info);
			self.topVue.info.level=info.level;

			self.user_info=info.user_info;
			var is_admin=self.user_info["is_admin"];
		    var is_captain=self.user_info["is_captain"];
		    //非管理员
		    if(is_admin==1 || is_captain==1) {
		    	self.view.webViewJavascriptBridge(function(bridge) {
		            //通知界面右边按钮内容
		            var list=new Array();
		            var t="";
		            if(info.level==0){
		            	t="添加";
		            }else{
		            	t="修改";
		            }

		            list.push({title:t,action:"rateController.openQuestion()"});
		            bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
		                console.log(responseData);
		            });
		        });
		    }

			

			var title_list=new Array();
			var data_list=new Array();
			for (var i = info.list.length - 1; i >= 0; i--) {
				title_list.push({text:info.list[i].title,max:100});
				var value=info.list[i].value*100;
				console.log(value);
				data_list.push(value);
			}

			// 指定图表的配置项和数据
	        var option = {
	        	backgroundColor:'#ffffff',
	            radar: {
			        indicator: title_list,
			        center: ['50%', '50%'],
			        name: {
			            formatter:'{value}',
			            textStyle: {
			                color:'#333333',
			                fontSize:17,
			            }
			        }
			    },
			    series: [
			        {
			            name: '雷达图',
			            type: 'radar',
			            data: [
			                {
			                    value: data_list,
			                    name: '',
			                    areaStyle: {
			                        normal: {
			                            color: 'rgba(189, 232, 252, 1.0)'
			                        }
			                    },
			                    lineStyle: {
			                        normal: {
			                            color: '#00a7f2'
			                        }
			                    },
			                    itemStyle : {
	                                normal : {
	                                    color:'#00a7f2'
	                                }
	                            }

			                }
			            ]
			        }
			    ]
	        };

	        // 使用刚指定的配置项和数据显示图表。
	        self.chart.setOption(option);
	    });

		this.openQuestion=function(){
			this.view.webViewJavascriptBridge(function(bridge) {
				//触发按钮
				var data={team_id:self.team_id};
	            bridge.callHandler('Click', {"action":"openNewHtml","src":"team/question.html","data":data}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
		}


	}

}