/**
 * Created by lan on 2017/1/4.
 */

var EditMatchScoreController = function () {
    this.vm;
    this.view;

    var self = this;
    this.init = function () {
        self.view = new ViewController();
        self.view.init();
        self.initNavigation();
        self.initView();
        self.initData();
        
    };
    
    this.initData = function () {
        $("#loading").show();
        self.reloadHttp();
    };

    this.initNavigation = function () {

        //录入战报类型
        var matchReport = {
            "1":"进球",               //进球
            "2":"点球",
            "3":"乌龙球",
            "4":"助攻",
            "5":"黄牌",
            "6":"红牌",
        };

        setTimeout(function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //通知界面标题内容
                bridge.callHandler('Title', {"title":matchReport[self.view.viewData.type]}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        }, 300);
    };

    this.reloadHttp = function () {
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

    this.submitTeamData = function () {

        var listArray = new Array();
        for (var index = 0, end = self.vm.player_list.length; index<end; index++){
            var userNode = self.vm.player_list[index];
            if(userNode["num"]>0){
                listArray.push({uid:userNode.uid,num:userNode["num"]});
            }
        }

        $("#loading").show();
        self.view.post(CONFIG.SCHEDULE_TEAM_ADD_MATCH_EVENT, {id:self.view.viewData.id, type:self.view.viewData.type, team_id:self.view.viewData.team_id,list:listArray},self.view.viewData.token,function (code, message,info) {
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
            el:"#playersDiv",
            data:{
                player_list:[]
            },
            methods:{
                score_subtract:function (player) {
                    if(player.num == 0)return;
                    player.num--;
                },
                score_add:function (player) {
                    player.num++;
                },
                submitTeamScale:function () {
                    self.submitTeamData();
                },
            },
        });
    };
};
