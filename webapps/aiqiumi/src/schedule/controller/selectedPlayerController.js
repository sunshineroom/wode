/**
 * Created by lan on 2017/1/4.
 */

var SelectedPlayerController = function () {

    this.vm;
    this.view;

    var self = this;
    this.init = function () {
        self.view = new ViewController();
        self.view.init();
        self.initNavigaiton();
        self.initView();
        self.initData();

    };

    this.initNavigaiton = function () {

        setTimeout(function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //通知界面标题内容
                bridge.callHandler('Title', {"title":"阵容"}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        }, 300);
    };

    this.initData = function () {
        $("#loading").show();
        this.view.post(CONFIG.SCHEDULE_TEAM_EVENT_PLAYER, {id:self.view.viewData.id,type:self.view.viewData.type,team_id:self.view.viewData.team_id}, self.view.viewData.token, function (code,message,info) {
            $("#loading").hide();
            self.view.log(info);
            if (code != 200) {
                mui.alert(message, '', function () {
                });
                return;
            };
            self.vm.player_list = info;
        });
    };

    this.submitAction = function () {
        var tmpArray = [];
        for (var index = 0, end = self.vm.player_list.length; index < end; index++){
            var player = self.vm.player_list[index];
            if(player.num > 0){
                tmpArray.push({uid:player.uid, num:1})
            }
        }

        $("#loading").show();
        self.view.post(CONFIG.SCHEDULE_TEAM_ADD_MATCH_EVENT, {id:self.view.viewData.id, type:self.view.viewData.type, team_id:self.view.viewData.team_id,list:tmpArray},self.view.viewData.token,function (code, message,info) {
            $("#loading").hide();
            self.view.log(info);
            if (code != 200) {
                mui.alert(message, '', function () {
                });
                return;
            };

            mui.toast("修改成功");

            self.view.webViewJavascriptBridge(function(bridge) {
                bridge.callHandler('CloseAndRefresh',null, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        });
    };

    this.initView = function () {
        self.vm = new Vue({
            el:"#select_player",
            data:{
                player_list:[],
            },
            methods:{
                selectPlayer:function(player){
                    player.num = player.num == 0? 1:0;
                },
                submitTeamScale:function () {
                    self.submitAction();
                }
            }
        })
    };
};





