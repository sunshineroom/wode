var SelectCityController =function(){
	this.view=new ViewController();
	
	this.team_id=0;
	this.city_id=0;
	this.token='';
	//用户信息
	this.user_info={};
	
	//标题
	this.title="";

	this.sectionVue;
	this.listVue;

	var self=this;

	this.init=function(){
		this.view.init();

		this.team_id=this.view.getData("team_id");
		this.city_id=this.view.getData("value");
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
	            list.push({title:"保存",action:"selectCityController.save()"});
	            bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
	    },300);
	}
	//初始化界面
	this.initView=function(){
		var height=this.view.screen_height;
		$("#list").height(height);

		mui.init();
	    mui.ready(function() {
	        var list = document.getElementById('list');
	        //calc hieght
	        list.style.height = document.body.offsetHeight + 'px';
	        //create
	        window.indexedList = new mui.IndexedList(list);
	    });

		this.title="选择城市";

	}

	
	//初始化数据
	this.initData=function(){
	    var list=ZONE.RECORDS;
	    var city_data={};
	    for (var i = 0; i < list.length; i++) {
	        var obj=list[i];
	        var key=obj.pinyin.substr(0,1);
	        var array=city_data[key];
	        if(!array) array=new Array();
	        array.push(obj);
	        city_data[key]=array;
	    }

	    var section_list=new Array();
	    var city_list=new Array();

	    for(var key in city_data){  
	    	section_list.push(key);
	    	city_list.push({is_group:1,short_name:key});

	    	var array=city_data[key];
	    	for (var i = 0; i < array.length; i++) {
	    		var obj=array[i];
	    		obj.is_group=0;
	    		if(obj.id==self.city_id){
	    			obj.v_is_select=true;
	    		}else{
	    			obj.v_is_select=false;
	    		}
	    		
	    		city_list.push(obj);
	    	}
	    }
	    this.initSection(section_list);
	    this.initList(city_list);
	    console.log(city_list);
	}

	this.initSection=function(list){
		this.viewVue = new Vue({
			el: '#city-section',
			data: {
				list: list,
			},
			methods: {
				
			}
	    });
	}

	this.initList=function(list){
		this.listVue = new Vue({
			el: '#city-list',
			data: {
				list: list,
			},
			methods: {
				showClass:function(info){
					if(info.is_group==1){
						return "mui-table-view-divider mui-indexed-list-group";
					}else{
						return "mui-table-view-cell mui-indexed-list-item";
					}
				},
				showGroup:function(info){
					if(info.is_group==1){
						return info.short_name;
					}else{
						return "";
					}
				},
				showTags:function(info){
					if(info.is_group==1){
						return '';
					}else{
						return info.pinyin;
					}
				},
				onSelectCity:function(index){
					console.log(index);
					if(self.listVue.list[index].is_group==1) return ;

					self.listVue.list[index].v_is_select=!self.listVue.list[index].v_is_select;
					if(self.listVue.list[index].v_is_select==true){
						self.city_id=self.listVue.list[index].id;
					}else{
						self.city_id=0;
					}
					

					for (var i = self.listVue.list.length - 1; i >= 0; i--) {
						var obj=self.listVue.list[i];
						if(i!==index)
							obj.v_is_select=false;
					}
				},
				//显示选择
			    showSelect:function(info){
			    	if(info.is_group==1) return ;

			    	if(info.v_is_select==false){
			    		return "../../images/icon-unselect.png";
			    	}else{
			    		return "../../images/icon-select.png";
			    	}
			    },
			}
	    });
	}

	this.save=function(){
		console.log(self.city_id);
		if(self.city_id==0){
			mui.alert("请选择城市", '', function() {
				
			});
			return;
		}

		var data={};
		if(this.action==1){
			data["area_id"]=self.city_id;
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