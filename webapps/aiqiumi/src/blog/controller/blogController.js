var BlogController =function(){
	this.view=new ViewController();
	this.team_id=0;
	this.token='';
	//用户信息
	this.user_info={};
	
	//标题
	this.title="发布动态";
	this.from_id='';
	this.show_id='';
	this.league_id='';
	this.sub_type = '';

	
	this.editor=null;

	var self=this;

	this.init=function(){
		this.view.init();
		this.team_id=this.view.getData("team_id");
		this.from_id=this.view.getData("from_id");
		this.show_id=this.view.getData("show_id");
		this.token=this.view.getData("token");
		this.league_id = this.view.getData("league_id");
		this.sub_type = this.view.getData("sub_type");
		self.editor=$("#rice_content").aqmeditor();

		

		this.initView();
		

		setTimeout(function(){
			self.view.webViewJavascriptBridge(function(bridge) {
				//通知界面标题内容
	            bridge.callHandler('Title', {"title":self.title}, function responseCallback(responseData) {
	                console.log(responseData);
	            });

	            //通知界面右边按钮内容
	            var list=new Array();
	            list.push({title:"发布",action:"blogController.send()"});
	            bridge.callHandler('RightButtonInfo', {"buttons":list}, function responseCallback(responseData) {
	                console.log(responseData);
	            });
	        });
		},1000);


		$("#rice_title").on("focus tap", function(){
			console.log("rice_title_click");
			alert("rice_title_click");
			self.view.webViewJavascriptBridge(function(bridge){
				//触发按钮
                bridge.callHandler('clickTitle','', function responseCallback(responseData) {
                     console.log(responseData);
                });
	        });
		});

		$("#rice_content").on("focus tap", function(){
			console.log("rice_content_click");
			alert("rice_content_click");
			self.view.webViewJavascriptBridge(function(bridge){
				//触发按钮
                bridge.callHandler('clickContent','', function responseCallback(responseData) {
                     console.log(responseData);
                });
	        });
		});




	}

	this.initView=function(){
		//--- 设置字体大小 ----
		var cw = document.documentElement.clientWidth;
		var dp = window.devicePixelRatio;
		var percent = cw/750 * 100;
		var fs = 100 * percent / 100;
		document.documentElement.style.fontSize = fs + "px";
	}


	this.insertImg=function(img_list){

        
        if (img_list == null || img_list == '' || img_list == undefined) {

        	return ;
        }
        var list = img_list.split(",");
        for(var i in list){
		    self.editor.insertImage(list[i], '', '', '');
        }
	}


	this.send=function(){
		var title = $.trim($("#rice_title").val());
		var body = self.editor.getContent();

		$("#loading").show();
		self.view.post(CONFIG.SEND_BLOG_URL,{title:title,body:body,team_id:self.team_id,from_id:self.from_id,show_id:self.show_id,create_type:1,league_id:self.league_id,sub_type:self.sub_type},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				alert(message);
				return;
			}


			
			self.view.webViewJavascriptBridge(function(bridge) {
                bridge.callHandler('CloseAndRefresh',null, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });

			
			self.view.webViewJavascriptBridge(function(bridge){

						var params = {

                            action:"sendBlogSuccess",
                            data:{team_id:self.team_id}
                        };
						//触发按钮
                        bridge.callHandler('sendBlogSuccess',params, function responseCallback(responseData) {
                             console.log(responseData);
                        });
			      });

		});
	}

    

























	
}