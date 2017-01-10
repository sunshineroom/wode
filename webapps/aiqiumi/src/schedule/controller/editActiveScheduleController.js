/**
 * Created by lan on 2016/12/28.
 */
var EditActiveScheduleController = function () {

    this.vm;                //Vue组件名称
    this.view;              //接口, 解析url类

    this.activePlace        //活动地点

    this.editActiveComponent; //初始化编辑活动界面

    var self = this;
    this.init = function () {
        self.view = new ViewController();
        self.view.init();
        self.initView();
        self.initData();
    };

    //初始化数据
    this.initData = function () {
        self.editActiveComponent.selectPlaceCallBack = function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                bridge.callHandler('Click', {"action":"openNewHtml","src":"schedule/select_place.html"}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        };

        self.getActiveSchedule();
    };

    this.initView = function () {
        self.editActiveComponent = new ActiveComponent(); //初始化 活动组件内容
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

                var buttonArray = [{"title":"确定","action":"editActiveScheduleController.done()"}];
                bridge.callHandler('RightButtonInfo', {"buttons":buttonArray}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        }, 300);
    };

    this.getActiveSchedule = function () {
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

            self.editActiveComponent.activeNode.activeName = info.title;
            self.editActiveComponent.activeNode.activeBeginTime = info.start_time;
            self.editActiveComponent.activeNode.activeApplyEndTime = info.enroll_time;
            self.editActiveComponent.activeNode.activePlaceName = info.place;
            self.editActiveComponent.activeNode.activeMaxPeople = info.max_player;
            self.editActiveComponent.activeNode.activeDesc = info.desc;
            self.editActiveComponent.activeNode.activeDescLength = info.desc? info.desc.length:0;

            self.activePlace = {
                name:info.place,
                location:{
                    lat:info.place_lat,
                    lng:info.place_lng,
                }
            }
        });
    };

    this.done = function () {
        self.saveActivechedule();
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
            id:self.view.viewData.id,
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

        self.view.post(CONFIG.SCHEDULE_EDIT_ACTIVE_URL,activeObj,self.view.viewData.token,function(code,message,info) {
            $("#loading").hide();
            self.view.log(info);
            if (code != 200) {
                mui.alert(message, '', function () {

                });
                return;
            }
            mui.toast("修改活动日程成功");

            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                bridge.callHandler('CloseAndRefresh', function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        });
    };


    //设置地理位置
    this.setPlace = function (name, lat, lng) {

        var placeObj ={
            name:name,
            location:{
                lat:lat,
                lng:lng,
            }
        };

        self.activePlace = placeObj ;
        self.editActiveComponent.activeNode.activePlaceName =  self.activePlace.name;
    };
};

