/**
 * Created by lan on 2016/12/30.
 */

var ActiveScheduleDetailController = function () {
    this.view;
    this.vm;


    var self = this;
    this.init = function () {
        self.view = new ViewController();
        self.view.init();
        self.initView();
        self.initData();
        self.initNavigation();
    };

    this.initNavigation = function () {
        //设置标题头
        setTimeout(function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                bridge.callHandler('Title',{"title":"活动日程详情"} , function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        },300);
    };

    this.initData = function () {

        //显示分享下载按钮
        if(self.view.viewData.share && self.view.viewData.share === 1 ) {
            $("#btnOpenApp").show();
        }
        self.reloadHttp();

    };


    this.initNavigationRightBtn = function () {

        //设置右键
        self.view.webViewJavascriptBridge(function(bridge) {
            //触发按钮
            bridge.callHandler('Title',{"title":"活动日程详情"} , function responseCallback(responseData) {
                console.log(responseData);
            });
            var buttonArray = [{"title":"编辑基本信息","action":"activeScheduleDetailController.editAction()", type:"edit"},
                                {"title":"删除活动","action":"activeScheduleDetailController.deleteActive()", type:"delete"}];
            bridge.callHandler("RightButtonInfo", {"buttons":buttonArray}, function responseCallback (responseData) {
                console.log(responseData);
            });
        });

    }
    

    //加载网络
    this.reloadHttp = function () {
        $("#loading").show();
        var params = {
            id:self.view.viewData.id,
            team_id:self.view.viewData.team_id,
            type:3,
        };

        this.view.post(CONFIG.SCHEDULE_SCHEDULE_DETAIL,params,self.view.viewData.token,function(code,message,info) {
            $("#loading").hide();
            self.view.log(info);
            if (code != 200) {
                mui.alert(message, '', function () {
                });
                return;
            };

            self.vm.activeTeamLogo = info.team_logo;
            self.vm.activeName = info.title;
            self.vm.activeTeamName = info.team_name;
            self.vm.activeBeginTime = info.start_time;
            self.vm.activeApplyEndTime = info.enroll_time && info.enroll_time.length>0? "截止报名时间:"+info.enroll_time:"" ;
            self.vm.activePlaceName = info.place;
            self.vm.activePlaceLat = info.place_lat;
            self.vm.activePlaceLng = info.place_lng;
            self.vm.activeMaxPeople = info.max_player;
            self.vm.activeDesc = info.desc;

            //报名人数
            self.vm.enroll_count = info.enroll_count;
            self.vm.pending_count = info.pending_count;
            self.vm.off_count = info.off_count;
            self.vm.max_player = info.max_player;
            self.vm.owner_join = info.owner_join;
            self.vm.enroll_list = info.players[1];
            self.vm.off_list = info.players[2];
            self.vm.pending_list = info.players[3];

            if(self.view.viewData.share && self.view.viewData.share == 1){
                self.setShareInfo();
            }

            if(info.is_captain && info.is_captain == 1 || info.is_admin && info.is_admin == 1){
                self.initNavigationRightBtn();
            }
            
        });
    };

    this.setShareInfo = function () {
        var content = self.vm.activeTeamName + ":";
        if(self.vm.activeName && self.vm.activeName.length>0){
            content +=  self.vm.activeName + ",";
        }
        content += self.vm.activeBeginTime+",";
        if(self.vm.activePlaceName && self.vm.activePlaceName.length > 0){
            content  += self.vm.activePlaceName + ",";
        }
        content += "快来报名!";

        self.view.setShareInfo(content);
    };

    this.initView = function () {
        this.vm = new Vue({
            el:"#active_schedule",
            data:{
                activeTeamLogo:"./images/team-logo-default.png",
                activeName:"",
                activeTeamName:"",
                activeBeginTime:"",
                activeApplyEndTime:"",
                activePlaceName:"",
                activeMaxPeople:0,
                activeDesc:"",
                isShareState:self.view.viewData.share && self.view.viewData.share === 1? false:true,
                enroll_count:0,
                off_count:0,
                pending_count:0,
                max_player:0,
                enroll_list:[],
                off_list:[],
                pending_list:[],
                owner_join:0,


                showEnrollList:true,
                showOffList:true,
                showPendingList:true,
                
            },
            methods:{
                wxShareAction:function () {
                    self.shareAction(1);
                },
                wbShareAction:function () {
                    self.shareAction(2);
                },
                messsageShareAction:function () {
                    self.shareAction(3);
                },

                //性别
                sexImage:function (sex) {
                    return "images/icon-sex-"+sex+".png";
                },
                //点击报名
                tapEnrollAction:function () {
                    self.vm.showEnrollList = !self.vm.showEnrollList;
                },
                //点击请假
                tapOffAction:function () {
                    self.vm.showOffList = !self.vm.showOffList;
                },
                //点击待定请假
                tapPendingAction:function () {
                    self.vm.showPendingList = !self.vm.showPendingList;
                },

                joinSchedule:function (owner_join, type) {
                    if(owner_join == type)return;
                    $("#loading").show();
                    self.view.post(CONFIG.SCHEDULE_TEAM_JOINEVENT,{id:self.view.viewData.id,team_id:self.view.viewData.team_id,type:type,sub_type:3},self.view.viewData.token,function (code,message,info) {
                        $("#loading").hide();
                        if(code!=200){
                            mui.alert(message, '', function() {

                            });
                            return;
                        };
                        self.view.log(info);
                        self.reloadHttp();
                    });
                },
                owner_join_style:function (owner_join,type) {
                    if(owner_join == type){
                        return {
                            color:"#00a8ef",
                        }
                    }else{
                        return {
                            color:"#808992"
                        }
                    }
                },

                locationNavigaition:function (lat, lng) {
                    self.view.baiduNavigation("活动位置", self.vm.activePlaceName, lat, lng);
                },
            }
        });

        //分享处理
        this.shareAction = function (type) {
            var content = self.vm.activeTeamName + ":";
            if(self.vm.activeName && self.vm.activeName.length>0){
                content +=  self.vm.activeName + ",";
            }
            content += self.vm.activeBeginTime+",";
            if(self.vm.activePlaceName && self.vm.activePlaceName.length > 0){
                content  += self.vm.activePlaceName + ",";
            }
            content += "快来报名!";
            var url = self.view.viewData.http_url +
                "/webapps/aiqiumi/src/schedule/active_schedule_detail.html?" +
                this.view.encodeShareData({team_id:self.view.viewData.team_id, id:self.view.viewData.id,share:1});
            console.log(content);
            self.view.shareAction(type,content,content,url,"",{schedule_id:self.view.viewData.id,schedule_type:3});
        };

        //编辑活动页面
        this.editAction = function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                var params = {
                    action:"openNewHtml",
                    src:"schedule/edit_schedule_active.html",
                    data: {  team_id:self.view.viewData.team_id, id:self.view.viewData.id}
                };

                //触发按钮
                bridge.callHandler('Click',params, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        };

        this.deleteActive = function () {
            var btnArray = ['是', '否'];
            mui.confirm('确认删除这个活动？', '删除活动', btnArray, function(e) {
                if (e.index == 0) {
                    //删除操作
                    $("#loading").show();
                    self.view.post(CONFIG.SCHEDULE_TEAM_DELETE_ACTIVE, {id: self.view.viewData.id}, self.view.viewData.token, function (code, message, info) {
                        $("#loading").hide();
                        self.view.log(info);
                        if (code != 200) {
                            mui.alert(message, '', function () {

                            });
                            return;
                        }

                        //关闭并且刷新
                        self.view.webViewJavascriptBridge(function(bridge) {
                            //触发按钮
                            bridge.callHandler('CloseAndRefresh', function responseCallback(responseData) {
                                console.log(responseData);
                            });
                        });

                    });
                }
            });
        };

    };
};