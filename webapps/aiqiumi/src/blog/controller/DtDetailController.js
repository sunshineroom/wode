var DtDetailController = function(){
	
	this.view = new ViewController();
	this.blog_id = '';
	this.token = '';
	
	//用户信息
	this.user_info = {};
	this.title = '';

    this.nowPage = 1;

    this.deleteComment_id;

	
	this.contentVue;
	this.commentVue;
	this.blogDeleteVue;
	var self=this;
	
	//初始化
	this.init = function(){
		this.view.init();
		//获取参数
		this.blog_id=this.view.getData("blog_id");
		this.token=this.view.getData("token");
		//加载数据
		this.initRefresh();
		this.initData();
		this.commentAction();
		this.initDeleteBlog();
		this.initNavigation();

		//显示分享下载按钮
        if(self.view.viewData.share && self.view.viewData.share == 1 ) {
            $("#btnOpenApp").show();
        }
	}


	this.initNavigation = function () {

        setTimeout(function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //通知界面标题内容
                bridge.callHandler('Title', {"title":"动态详情"}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        }, 300);
        

    };

	this.initDeleteBlog = function(){

		self.blogDeleteVue = new Vue({
			el:'#blogDelegate',
			methods:{

				deleteBlog:function(){//删除评论BLOG_DELETE
                    $('#loading').show();
					self.view.post(CONFIG.BLOG_DELETE,{id:self.deleteComment_id},self.token,function(code,message,info){
						$('#loading').hide();

						if(code != 200){
							mui.alert(message, '', function() {
					
				            });

				            return;
						}

						//刷新
			            self.getCommentsInfo(1);

					});
				},

			},

		});


	}

	//加载数据
	this.initData = function(){
		
		this.contentVue = new Vue({
			
			el:'.mui-content',
			data:{
				    info:
				    {
	      		        title:'',
	      		        time:'',
	      		        content:'',
	      		        name:'',
	      		        img_list:[],
	      		        hot_num:'',
	      		        zan_list:[],
	      		        zan_status:'',
	      		        comments_list:[],
	      	        }
			},
			methods:{
				userPhoto:function(photo){
					return { 
						background:"url("+photo+") no-repeat center center",
						};
				},
				comment_userPhoto:function(photo){
					
					return {
						background: "url("+photo+") no-repeat center center",
						backgroundSize:"cover"
					};
					
				},
				
				contentPhoto:function(photo){
				
					return {
						background: "url("+photo+") no-repeat center center",
						backgroundSize:"cover"
					};
					
				},
				
				onclickZan:function(sta){//点赞
					
					$("#loading").show();
					
					self.view.post(CONFIG.BLOG_ZAN_URL,{id:self.blog_id,status:sta},self.token,function(code,message,info){
						
						$("#loading").hide();
						self.view.log(info);
						if(code != 200){
							
							mui.alert(message, '', function() {
					
				            });
				            return;
							
						}
						//刷新
						self.getInfo();
						
					})
					
				},
				
				/**---------------------------------  跟客户端交互  ------------------------------ */
				comments:function(placeholder,comment_id,is_my_comment){//评论

                    //
					if (is_my_comment == 1) {//自己点自己的评论需要删除 BLOG_DELETE

						self.deleteComment_id = comment_id;

                        mui('#blogDelegate').popover('toggle');

						return;
					}
					self.view.webViewJavascriptBridge(function(bridge){

						var params = {

                            action:"commentData",
                            data: {blog_id:self.blog_id,placeholder:placeholder,comment_id:comment_id}
                        };
						//触发按钮
                        bridge.callHandler('Comments',params, function responseCallback(responseData) {
                             console.log(responseData);
                        });
			      });
				},
				
				onclickUserPhoto:function(uid){//点击用户头像  名字等 
					
					self.view.webViewJavascriptBridge(function(bridge){
						//触发按钮
                        bridge.callHandler('openNative',{nativeParams:{uid:uid},nativeUrl:"aiqiumi://otherinfo"}, function responseCallback(responseData) {
                             console.log(responseData);
                        });
			      });
					
				},
				
				replyComment:function(name,id){//回复评论 
					
					self.view.webViewJavascriptBridge(function(bridge){
						//触发按钮
                        bridge.callHandler('replyComment',{userName:name,comment_id:id}, function responseCallback(responseData) {
                             console.log(responseData);
                        });
			      });
					
				},
			}
		});
		
	}

	

	this.commentAction=function() {
		
		this.commentVue = new Vue({

			el:'.allpl-frame',

			methods:{

				comments:function(placeholder,comment_id){

					self.view.webViewJavascriptBridge(function(bridge){

						var params = {

                            action:"commentData",
                            data: {blog_id:self.blog_id,placeholder:placeholder,comment_id:comment_id}
                        };
						//触发按钮
                        bridge.callHandler('Comments',params, function responseCallback(responseData) {
                             console.log(responseData);
                        });
			      });
				
		
					
				},


			}

		});
	}

	this.initRefresh=function(){
        mui.init({
            pullRefresh: {
                container: '#mui-pullrefresh',
                up: {
                    contentrefresh: '正在加载...',
                    callback: self.pullupRefresh
                }
            }
        });
    };

   

    this.pullupRefresh = function () {//上啦加载更多
        self.nowPage ++ ;
        self.getCommentsInfo(self.nowPage);
           

    };
	
	//评论
	this.initComments = function(contents,com_id){//评论请求
		
		$("#loading").show();
		this.view.post(CONFIG.BLOG_COMMENTS,{id:this.blog_id,content:contents,comment_id:com_id},this.token,function(code,message,info){
			$("#loading").show();
			self.view.log(info);
			if(code != 200){


				self.view.webViewJavascriptBridge(function(bridge){
				//触发按钮
                bridge.callHandler('comment_failure','', function responseCallback(responseData) {
                        console.log(responseData);
                });
			});

				mui.alert(message, '', function() {
					
				});


				return;
			}
			//刷新
			self.getCommentsInfo(1);

			self.view.webViewJavascriptBridge(function(bridge){
				//触发按钮
                bridge.callHandler('comment_successful','', function responseCallback(responseData) {
                        console.log(responseData);
                });
			});


			
		})
	}
	
	//网络请求数据 --- 动态详情
	this.getInfo = function(){
		$("#loading").show();
		this.view.post(CONFIG.GET_BLOG_URL,{id:this.blog_id},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code!=200){
				
				mui.alert(message, '', function() {
					
				});
				return;
			}
			
			self.contentVue.info.title = info.title;
			self.contentVue.info.time = info.create_time_str;
			self.contentVue.info.content = info.body;
			self.contentVue.info.img_list = info.img;
			self.contentVue.info.hot_num = info.hot_num;
			self.contentVue.info.zan_status = info.zan_status;
			self.contentVue.info.zan_list = info.zan_user_list;
		})
		
	}
	
	//网络请求 ------- 评论列表
	this.getCommentsInfo = function(page){
		$("#loading").show();
		this.view.post(CONFIG.GET_BLOG_COMMENTS_URL,{id:this.blog_id,page},this.token,function(code,message,info){
			$("#loading").hide();
			self.view.log(info);
			if(code != 200){
				mui.alert(message,'',function(){
					
				});
				return;
			}


			if (page == 1) {

				self.contentVue.info.comments_list = info.list;
				//mui('#mui-pullrefresh').pullRefresh().endPulldownToRefresh();

			}else{

				for (var i = 0; i<info.list.length; i++) {
					
					self.contentVue.info.comments_list.push(info.list[i]);
				}
			}

			if(info.list.length < 10){
				//禁用上拉刷新
				mui('#mui-pullrefresh').pullRefresh().disablePullupToRefresh(); 
            }else{
            	//结束上拉刷新
                mui('#mui-pullrefresh').pullRefresh().endPullupToRefresh();
            }
			
		});
		
	}
	
	
	
}
