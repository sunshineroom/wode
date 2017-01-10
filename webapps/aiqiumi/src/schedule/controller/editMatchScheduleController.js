/**
 * Created by lan on 2016/12/28.
 */


var EditMatchScheduleController = function () {
    this.vm;                //Vue组件名称
    this.view;              //接口, 解析url类

    this.matchTeam;         //比赛球队
    this.matchPlace         //比赛地点

    this.editMatchComponent; //初始化编辑比赛组件

    var self = this;
    this.init = function () {
        self.view = new ViewController();
        self.view.init();
        self.initView();
        self.initData();
    };

    //初始化数据
    this.initData = function () {
        self.editMatchComponent.selectPlaceCallBack = function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                bridge.callHandler('Click', {"action":"openNewHtml","src":"schedule/select_place.html"}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        };

        self.editMatchComponent.selectMatchTeamCallBack = function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                bridge.callHandler('Click', {"action":"openNewHtml","src":"schedule/select_team.html"}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        };

        self.getMatchSchedule();
    };

    this.getMatchSchedule = function () {

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

            self.editMatchComponent.matchNode.matchName = info.title;
            self.editMatchComponent.matchNode.matchType = info.player;
            self.editMatchComponent.matchNode.matchTeamName = info.target_team_id == 0? "":info.target_team_name;
            self.editMatchComponent.matchNode.matchPlaceName = info.place;
            self.editMatchComponent.matchNode.matchBeginTime = info.start_time;
            self.editMatchComponent.matchNode.matchApplyEndTime =  info.enroll_time;
            self.editMatchComponent.matchNode.matchMaxPeople = info.max_player;
            self.editMatchComponent.matchNode.matchDesc = info.desc;
            self.editMatchComponent.matchNode.matchDescLength = info.desc? info.desc.length:0;
            self.editMatchComponent.matchNode.matchColor =  info.team_color;

            self.matchPlace = {
                name:info.place,
                location:{
                    lat:info.place_lat,
                    lng:info.place_lng,
                }
            }

            self.matchTeam = {
                team_name:info.target_team_name,
                team_id:info.target_team_id,
            }


        });
    };

    this.initView = function () {
        self.editMatchComponent = new MatchComponent();  //初始化组件组件内容
        self.vm = new Vue({
            el:"#schedule_content",
            data:{
            }
        });

        setTimeout(function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //通知界面标题内容
                bridge.callHandler('Title', {"title":"修改日程"}, function responseCallback(responseData) {
                    console.log(responseData);
                });

                var buttonArray = [{"title":"确定","action":"editScheduleController.done()"}];
                bridge.callHandler('RightButtonInfo', {"buttons":buttonArray}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        }, 300);
    };

    this.done = function () {
        self.saveMatchSchedule();
    };


    //提交比赛日程接口
    this.saveMatchSchedule = function () {
        //开始拷贝数据
        if(!self.matchTeam){
            self.matchTeam = {
                team_name:"待定",
                team_id:0,
            }
        }

        if(!self.matchPlace){
            self.matchPlace = {
                name:"",
                address:"",
                location:{
                    lat:0,
                    lng:0,
                }
            }
        }

        var matchBeginTime = self.editMatchComponent.matchNode.matchBeginTime;
        if(!matchBeginTime || matchBeginTime.length == 0){
            mui.toast("请填写比赛开始时间");
            return;
        }

        if(parseInt(self.editMatchComponent.matchNode.matchMaxPeople) > 999){
            mui.toast("最多允许999人参与比赛");
        }

        $("#loading").show();

        var teamObj = {
            id:self.view.viewData.id,
            title:self.editMatchComponent.matchNode.matchName,
            match_player:self.editMatchComponent.matchNode.matchType,
            target_team_id:self.matchTeam.team_id,
            target_team_name:self.matchTeam.team_name,
            match_time:self.editMatchComponent.matchNode.matchBeginTime,
            place:self.matchPlace.name,
            place_lat:self.matchPlace.location.lat,
            place_lng:self.matchPlace.location.lng,
            max_player:self.editMatchComponent.matchNode.matchMaxPeople,
            team_color:self.editMatchComponent.matchNode.matchColor,
            match_desc:self.editMatchComponent.matchNode.matchDesc,
            team_id:self.view.viewData.team_id,
        };

        if(self.editMatchComponent.matchNode.matchApplyEndTime && self.editMatchComponent.matchNode.matchApplyEndTime.length>0){
            teamObj.enroll_time = self.editMatchComponent.matchNode.matchApplyEndTime;
        }

        $("#loading").show();

        self.view.post(CONFIG.SCHEDULE_EDIT_MATCH_URL,teamObj,self.view.viewData.token,function(code,message,info) {
            $("#loading").hide();
            self.view.log(info);
            if (code != 200) {
                mui.alert(message, '', function () {

                });
                return;
            }
            console.log(info);
            mui.toast("修改比赛日程");

            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                bridge.callHandler('CloseAndRefresh', function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        });
    };


    //设置地理位置
    this.setPlace = function (name,lat,lng) {

        var placeObj = {
            name:name,
            location:{
                lat:lat,
                lng:lng,
            }
        };
        self.matchPlace = placeObj;
        self.editMatchComponent.matchNode.matchPlaceName = self.matchPlace.name;
    };

    //设置对战球队
    this.setMatchTeam = function (team_name, team_id) {
        var teamObj = {
            team_name:team_name,
            team_id:team_id,
        };
        self.matchTeam = teamObj;
        self.editMatchComponent.matchNode.matchTeamName = self.matchTeam.team_name;
    };
    
};

