/**
 * Created by lan on 2016/12/22.
 */

 var AddScheduleController = function () {
    this.vm;                //Vue组件名称
    this.view;              //接口, 解析url类

    this.matchTeam;         //比赛球队
    this.matchPlace         //比赛地点
    this.activePlace        //活动地点
    
    this.tabSwitcher;       //切换键

    this.editMatchComponent; //初始化编辑比赛组件
    this.editActiveComponent; //初始化编辑活动界面

    var self = this;
    this.init = function () {
        self.view = new ViewController();
        self.view.init();
        self.tabSwitcher = new TabSwither();
        self.initView();
        self.initData();
        self.initNavigation();
    };

    this.initNavigation = function () {

        setTimeout(function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //通知界面标题内容
                bridge.callHandler('Title', {"title":"新建日程"}, function responseCallback(responseData) {
                    console.log(responseData);
                });

                var buttonArray = [{"title":"发布","action":"addScheduleController.done()"}];
                bridge.callHandler('RightButtonInfo', {"buttons":buttonArray}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        }, 300);
    };

    //初始化数据
    this.initData = function () {
        self.tabSwitcher.addCallBack(function(selectIndex) {
            if(selectIndex == 0){
                self.vm.showMatch = true;
                self.vm.showActive = false;
            }else{
                self.vm.showMatch = false;
                self.vm.showActive = true;
            }
        });

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

        self.editActiveComponent.selectPlaceCallBack = function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                bridge.callHandler('Click', {"action":"openNewHtml","src":"schedule/select_place.html"}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        };

    };

    this.initView = function () {
        self.editMatchComponent = new MatchComponent();  //初始化组件组件内容
        self.editActiveComponent = new ActiveComponent(); //初始化 活动组件内容
        self.vm = new Vue({
           el:"#schedule_content",
            data:{
                showMatch:true,
                showActive:false,
            }
        });
    };

    this.done = function () {
        switch (self.tabSwitcher.selectedIndex){
            case 0:
                self.saveMatchSchedule();
                break;
            case 1:
                self.saveActivechedule();
                break;
        }
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
            match_title:self.editMatchComponent.matchNode.matchName,
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

        self.view.post(CONFIG.SCHEDULE_ADD_MATCH_URL,teamObj,self.view.viewData.token,function(code,message,info) {
            $("#loading").hide();
            self.view.log(info);
            if (code != 200) {
                mui.alert(message, '', function () {

                });
                return;
            }
            console.log(info);
            mui.toast("创建比赛日程成功");

            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                var params = {
                    action:"openAndReplace",
                    src:"schedule/create_schedule_match_success.html",
                    data: {team_id:self.view.viewData.team_id,id:info.id }
                }
                bridge.callHandler('Click',params, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
            
        });
    };

    //提交活动日程接口
    this.saveActivechedule = function () {

        if(!self.activePlace){
            self.activePlace = {
                name: "",
                address: "",
                location: {
                    lat: 0,
                    lng: 0,
                }
            }
        }

        var activeBeginTime = self.editActiveComponent.activeNode.activeBeginTime;
        if(!activeBeginTime || activeBeginTime.length == 0){
            mui.toast("请填写活动开始时间");
            return;
        }

        if(parseInt(self.editActiveComponent.activeNode.activeMaxPeople) > 999){
            mui.toast("最多允许999人参与比赛");
            return;
        }

        var activeObj = {
            title:self.editActiveComponent.activeNode.activeName,
            start_time:self.editActiveComponent.activeNode.activeBeginTime,
            place:self.activePlace.name,
            place_lat:self.activePlace.location.lat,
            place_lng:self.activePlace.location.lng,
            desc:self.editActiveComponent.activeNode.activeDesc,
            team_id:self.view.viewData.team_id,
            max_player:self.editActiveComponent.activeNode.activeMaxPeople
        }

        if(self.editActiveComponent.activeNode.activeApplyEndTime && self.editActiveComponent.activeNode.activeApplyEndTime.length>0){
            activeObj.enroll_time = self.editActiveComponent.activeNode.activeApplyEndTime;
        }

        $("#loading").show();

        self.view.post(CONFIG.SCHEDULE_ADD_ACTIVE_URL,activeObj,self.view.viewData.token,function(code,message,info) {
            $("#loading").hide();
            self.view.log(info);
            if (code != 200) {
                mui.alert(message, '', function () {

                });
                return;
            }
            mui.toast("创建活动日程成功");

            //打开页面
            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                var params = {
                    action:"openAndReplace",
                    src:"schedule/create_schedule_active_success.html",
                    data: {  team_id:self.view.viewData.team_id,id:info.id }
                }
                bridge.callHandler('Click',params, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        });
    };


    //设置地理位置
    this.setPlace = function ( name, lat, lng ) {
        var placeObj ={
            name:name,
            location:{
                lat:lat,
                lng:lng,
            }
        };
        switch (self.tabSwitcher.selectedIndex){
            case 0:
                self.matchPlace = placeObj;
                self.editMatchComponent.matchNode.matchPlaceName = self.matchPlace.name;
                break;
            case 1:
                self.activePlace = placeObj;
                self.editActiveComponent.activeNode.activePlaceName =  self.activePlace.name;
                break;
        }
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
