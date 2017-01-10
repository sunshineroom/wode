/**
 * Created by lan on 2017/1/4.
 */

var MatchEnterScoreController = function () {
    this.vm;
    this.view;

    var self = this;
    this.init = function () {
        self.view = new ViewController();
        self.view.init();
        self.initView();
        self.initData();
        self.initNavigation();
    };

    this.initData = function () {
        $("#loading").show();
        self.reloadHttp();
    };

    this.initNavigation = function () {

        setTimeout(function () {
            self.view.webViewJavascriptBridge(function(bridge) {
                //通知界面标题内容
                bridge.callHandler('Title', {"title":"录入战报"}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        }, 300);
        

    };

    this.initView = function () {
        self.vm = new Vue({
            el:"#score_content",
            data:{
                home_team_logo:"./images/team-logo-default.png",
                home_team_score:0,
                home_team_point_score:0,

                away_team_logo:"./images/team-logo-default.png",
                away_team_score:0,
                away_team_point_score:0,

                //进球
                goal_number:0,
                goal_detail:"暂无",

                //点球
                point_number:0,
                point_detail:"暂无",

                //乌龙球
                ownGoal_number:0,
                ownGoal_detail:"暂无",

                //助攻
                assist_number:0,
                assist_detail:"暂无",

                //红牌
                redCard_number:0,
                redCard_detail:"暂无",

                //黄牌
                yellowCard_number:0,
                yellowCard_detail:"暂无",

                //阵容
                teamScale_number:0,
                teamScare_detail:"暂无",
            },
            methods:{

                enter_home_score:function (event) {
                    event.target.value =  $.trim(event.target.value).match(/[0-9]*/)[0];
                    self.vm.home_team_score =  event.target.value;
                },

                enter_home_point_score:function (event) {
                    event.target.value =  $.trim(event.target.value).match(/[0-9]*/)[0];
                    self.vm.home_team_point_score =  event.target.value;
                },

                enter_away_score:function (event) {
                    event.target.value =  $.trim(event.target.value).match(/[0-9]*/)[0];
                    self.vm.away_team_score =  event.target.value;
                },

                enter_away_point_score:function (event) {
                    event.target.value =  $.trim(event.target.value).match(/[0-9]*/)[0];
                    self.vm.away_team_point_score =  event.target.value;
                },
                submitAction:function () {
                    self.submitAction();
                },
                //编辑数量
                editNumber:function (type) {

                    //打开页面
                    self.view.webViewJavascriptBridge(function(bridge) {
                        //触发按钮
                        var params = {
                            action:"openNewHtml",
                            src:"schedule/edit_match_score.html",
                            data: {team_id:self.view.viewData.team_id,id:self.view.viewData.id,type: type}
                        }
                        bridge.callHandler('Click',params, function responseCallback(responseData) {
                            console.log(responseData);
                        });
                    });
                },
                //球队阵容
                editTeamScale:function (type) {

                    //打开页面
                    self.view.webViewJavascriptBridge(function(bridge) {
                        //触发按钮
                        var params = {
                            action:"openNewHtml",
                            src:"schedule/select_players.html",
                            data: {team_id:self.view.viewData.team_id,id:self.view.viewData.id,type: type}
                        }
                        bridge.callHandler('Click',params, function responseCallback(responseData) {
                            console.log(responseData);
                        });
                    });
                    
                },
            }
        });
    };



    //提交新戏修改
    this.submitAction = function () {
        var data = {
            team_score:self.vm.home_team_score,
            target_team_score:self.vm.away_team_score,
            team_point_score:self.vm.home_team_point_score,
            target_team_point_score:self.vm.away_team_point_score
        };


        self.view.post(CONFIG.SCHEDULE_TEAM_SET_MATCH_RESULT, {id:self.view.viewData.id, team_id:self.view.viewData.team_id,result:{score:data}},self.view.viewData.token,function (code, message,info) {
            $("#loading").hide();
            self.view.log(info);
            if (code != 200) {
                mui.alert(message, '', function () {
                });
                return;
            };

            mui.toast("录入战报成功");

            self.view.webViewJavascriptBridge(function(bridge) {
                bridge.callHandler('CloseAndRefresh',null, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });

        });
    };

    this.reloadHttp = function () {
        self.view.post(CONFIG.SCHEDULE_TEAM_MATCH_EVENT, {id:self.view.viewData.id,team_id:self.view.viewData.team_id}, self.view.viewData.token, function (code, message,info) {
            $("#loading").hide();
            self.view.log(info);
            if (code != 200) {
                mui.alert(message, '', function () {
                });
                return;
            };

            self.vm.home_team_logo = info.team_logo;
            self.vm.home_team_score = info.team_score;
            self.vm.home_team_point_score = info.team_point_score;

            self.vm.away_team_logo = info.target_team_logo;
            self.vm.away_team_score = info.target_team_score;
            self.vm.away_team_point_score = info.target_team_point_score;

            //进球
            self.vm.goal_number = info.goal_total_count;
            //点球
            self.vm.point_number = info.point_goal_total_count;
            //乌龙球
            self.vm.ownGoal_number = info.owner_goal_total_count;
            self.vm.assist_number  = info.assists_total_count;
            self.vm.redCard_number = info.red_card_total_count;
            self.vm.yellowCard_number = info.yellow_card_total_count;
            self.vm.teamScale_number = info.lineup_total_count;

            //进球
            var tmpArray = [];
            for(var index = 0, end = info.goal_list.length; index<end; index ++){
                var userNode =  info.goal_list[index];
                tmpArray.push(userNode.nickname + "(" + userNode.num + ")");
            }
            self.vm.goal_detail = tmpArray.join(",");

            //点球
            tmpArray = [];
            for(var index = 0, end = info.point_goal_list.length; index<end; index ++){
                var userNode =  info.point_goal_list[index];
                tmpArray.push(userNode.nickname + "(" + userNode.num + ")");
            }
            self.vm.point_detail = tmpArray.join(",");

            //乌龙
            tmpArray = [];
            for(var index = 0, end = info.owner_goal_list.length; index<end; index ++){
                var userNode =  info.owner_goal_list[index];
                tmpArray.push(userNode.nickname + "(" + userNode.num + ")");
            }
            self.vm.ownGoal_detail = tmpArray.join(",");

            //助攻
            tmpArray = [];
            for(var index = 0, end = info.assists_list.length; index<end; index ++){
                var userNode =  info.assists_list[index];
                tmpArray.push(userNode.nickname + "(" + userNode.num + ")");
            }
            self.vm.assist_detail =  tmpArray.join(",");

            //红牌
            tmpArray = [];
            for(var index = 0, end = info.red_card_list.length; index<end; index ++){
                var userNode =  info.red_card_list[index];
                tmpArray.push(userNode.nickname + "(" + userNode.num + ")");
            }
            self.vm.redCard_detail = tmpArray.join(",");

            //黄牌
            tmpArray = [];
            for(var index = 0, end = info.yellow_card_list.length; index<end; index ++){
                var userNode =  info.yellow_card_list[index];
                tmpArray.push(userNode.nickname + "(" + userNode.num + ")");
            }
            self.vm.yellowCard_detail = tmpArray.join(",");


            //阵容
            tmpArray = [];
            for(var index = 0, end = info.lineup_list.length; index<end; index ++){
                var userNode =  info.lineup_list[index];
                tmpArray.push(userNode.nickname + "(" + userNode.num + ")");
            }
            self.vm.teamScare_detail = tmpArray.join(",");
        });
    };
};
