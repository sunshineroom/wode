/**
 * Created by lan on 2016/12/28.
 */


var CreateMatchScheduleController = function () {

    this.view;
    this.matchNode;             //节点数据
    this.vm;                    //渲染节点


    //颜色对象
    this.colorDict = {
        "0": "url(images/mr-color.png) no-repeat",
        "1": "rgb(235,58,55)",
        "2": "rgb(255,150,31)",
        "3": "rgb(233,231,49)",
        "4": "rgb(42,183,64)",
        "5": "rgb(51,184,195)",
        "6": "rgb(42,92,225)",
        "7": "rgb(108,29,208)",
        "8": "rgb(191,70,187)",
        "9": "rgb(255,255,255)",
        "10": "rgb(225,225,225)",
        "11": "rgb(0,0,0)",
        "12": "rgb(104,54,14)"
    };


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
                bridge.callHandler('Title',{"title":"比赛日程"} , function responseCallback(responseData) {
                    console.log(responseData);
                });
                var buttonArray = [{"title":"完成","action":"createMatchScheduleController.done()"}];
                bridge.callHandler("RightButtonInfo", {"buttons":buttonArray}, function responseCallback (responseData) {
                    console.log(responseData);
                })
            });
        }, 200);

    };

    this.initData = function () {

        var params = {
            id:self.view.viewData.id,
            team_id:self.view.viewData.team_id,
            type:2,
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

            self.vm.home_team_logo = info.team_logo;
            self.vm.home_team_name = info.team_name;
            self.vm.away_team_logo = info.target_team_logo;
            self.vm.away_team_name = info.target_team_name;
            self.vm.matchName = info.title;
            self.vm.matchType = info.player;
            self.vm.matchPlaceName = info.place;
            self.vm.matchBeginTime = info.start_time;
            self.vm.matchApplyEndTime =  info.enroll_time && info.enroll_time.length>0? "截止报名时间:"+info.enroll_time:"";
            self.vm.matchMaxPeople = info.max_player;
            self.vm.matchDesc = info.desc;

            self.vm.matchColor = {
                background: self.colorDict[info.team_color],
                backgroundSize: "30px 16px",
                border:"1px solid #999",
            };
        });
        
    };
    this.initView = function () {
        this.vm = new Vue({
            el:"#match_schedule",
            data:{
                home_team_logo:"./images/team-logo-default.png",
                home_team_name:"待定",
                away_team_logo:"./images/team-logo-default.png",
                away_team_name:"待定",
                matchName:"",
                matchType:"",
                matchBeginTime:"",
                matchApplyEndTime:"",
                matchPlaceName:"",
                matchColor:"",
                matchMaxPeople:0,
                matchDesc:"",
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
                            src:"schedule/edit_schedule_match.html",
                            data: {  team_id:self.view.viewData.team_id, id:self.view.viewData.id}
                        };

                        //触发按钮
                        bridge.callHandler('Click', params, function responseCallback(responseData) {
                            console.log(responseData);
                        });
                    });
                }
            }
        });
    };


    //分享操作
    this.shareAction = function (type) {
        var content = self.vm.home_team_name + " VS " + self.vm. away_team_name + "," + self.vm.matchBeginTime;
        if(self.vm.matchPlaceName && self.vm.matchPlaceName.length > 0){
            content  += self.vm.matchPlaceName + ",";
        }
        content += "快来报名!";
        var url = self.view.viewData.http_url +
            "/webapps/aiqiumi/src/scheduele/match_schedule_detail.html?" +
            this.view.encodeShareData({team_id:self.view.viewData.team_id, id:self.view.viewData.id,share:1});
        self.view.shareAction(type,content,content,url,"",{schedule_id:self.view.viewData.id,schedule_type:2});
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