/**
 * Created by lan on 2016/12/28.
 */

var CreateActiveScheduleController = function () {
    this.view;
    this.vm;                    //渲染节点

    var self = this;

    this.init = function () {
        self.view = new ViewController();
        self.view.init();

        self.initView();
        self.initData();
        self.initNavigation();
    };

    this.initNavigation = function () {
        setTimeout(function () {
            //触发内容
            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                bridge.callHandler('Title',{"title":"活动日程"} , function responseCallback(responseData) {
                    console.log(responseData);
                });
                var buttonArray = [{"title":"完成","action":"createActiveScheduleController.done()"}];
                bridge.callHandler("RightButtonInfo", {"buttons":buttonArray}, function responseCallback (responseData) {
                    console.log(responseData);
                })
            });
        },300);
    };

    this.initData = function () {
        var params = {
            id:self.view.viewData.id,
            team_id:self.view.viewData.team_id,
            type:3,
        };

        $("#loading").show();
        this.view.post(CONFIG.SCHEDULE_SCHEDULE_DETAIL,params,self.view.viewData.token,function(code,message,info) {
            $("#loading").hide();
            self.view.log(info);
            if (code != 200) {
                mui.alert(message, '', function () {
                });
                return;
            };
            console.log(info);

            self.vm.activeTeamLogo = info.team_logo;
            self.vm.activeName = info.title;
            self.vm.activeTeamName = info.team_name;
            self.vm.activeBeginTime = info.start_time;
            self.vm.activeApplyEndTime = info.enroll_time && info.enroll_time.length>0? "截止报名时间:"+info.enroll_time:"" ;
            self.vm.activePlaceName = info.place;
            self.vm.activeMaxPeople = info.max_player;
            self.vm.activeDesc = info.desc;
        });
        
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
                isShareState:self.view.viewData.share && self.view.viewData.share ===1? false:true,
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
                editAction:function () {
                    self.view.webViewJavascriptBridge(function(bridge) {

                        var params = {
                            action:"openAndReplace",
                            src:"schedule/edit_schedule_active.html",
                            data: {  team_id:self.view.viewData.team_id, id:self.view.viewData.id}
                        };

                        //触发按钮
                        bridge.callHandler('Click',params, function responseCallback(responseData) {
                            console.log(responseData);
                        });
                    });
                }
            }
        });
    };

    //分享操作
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
            "/webapps/aiqiumi/src/scheduele/active_schedule_detail.html?" +
            this.view.encodeShareData({team_id:self.view.viewData.team_id, id:self.view.viewData.id,share:1});
        self.view.shareAction(type,content,content,url,"",{schedule_id:self.view.viewData.id,schedule_type:3});
    };



    this.done = function () {
        self.view.webViewJavascriptBridge(function(bridge) {

            //触发按钮
            bridge.callHandler('CloseAndRefresh', function responseCallback(responseData) {
                console.log(responseData);
            });
        });
    };
};
