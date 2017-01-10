/**
 * Created by lan on 2017/1/3.
 */

var MatchActiveScheduleController = function () {
    this.vm_header;
    this.vm_detail;
    this.vm_score;
    this.view;
    this.tabSwitcher;

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
            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                bridge.callHandler('Title',{"title":"比赛日程详情"} , function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        }, 200);
        
        //显示分享下载按钮
        if(self.view.viewData.share && self.view.viewData.share == 1 ) {
            $("#btnOpenApp").show();
        }
        
    };

    this.initNavigationRightBtn = function () {
        
        self.view.webViewJavascriptBridge(function(bridge) {
            var buttonArray = [
                {"title":"录入战报","action":"matchScheduleDetailController.editMatchData()", type:"edit"},
                {"title":"编辑基本信息","action":"matchScheduleDetailController.editMatchInfo()",type:"edit"},
                {"title":"删除比赛","action":"matchScheduleDetailController.deleteMatch()",type:"delete"},
            ];
            bridge.callHandler("RightButtonInfo", {"buttons":buttonArray}, function responseCallback (responseData) {
                console.log(responseData);
            });
        });
    };

    this.initData = function () {

        self.reloadHttp();
    };

    this.reloadHttp = function () {

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

            //头部信息
            self.vm_header.home_team_logo = info.team_logo;
            self.vm_header.home_team_name = info.team_name;
            self.vm_header.home_team_score =  info.team_score;
            self.vm_header.home_team_point_score = info.team_point_score;


            self.vm_header.away_team_logo = info.target_team_logo;
            self.vm_header.away_team_name = info.target_team_name;
            self.vm_header.target_team_score = info.target_team_score;
            self.vm_header.target_team_point_score = info.target_team_point_score;

            //比赛信息
            self.vm_detail.matchName = info.title;
            self.vm_detail.matchType = info.player;
            self.vm_detail.matchColor = info.team_color;
            self.vm_detail.matchPlaceName = info.place;
            self.vm_detail.matchPlaceLat = info.place_lat;
            self.vm_detail.matchPlaceLng = info.place_lng;
            self.vm_detail.matchBeginTime = info.start_time;
            self.vm_detail.matchApplyEndTime =  info.enroll_time && info.enroll_time.length>0? "截止报名时间:"+info.enroll_time:"";
            self.vm_detail.matchMaxPeople = info.max_player;
            self.vm_detail.matchDesc = info.desc;


            self.vm_detail.enroll_count = info.enroll_count;
            self.vm_detail.pending_count = info.pending_count;
            self.vm_detail.off_count = info.off_count;
            self.vm_detail.max_player = info.max_player;
            self.vm_detail.owner_join = info.owner_join;
            self.vm_detail.enroll_list = info.players[1];
            self.vm_detail.off_list = info.players[2];
            self.vm_detail.pending_list = info.players[3];

            //战报信息
            self.vm_score.goal_data = info.goal_data;
            self.vm_score.assists_list = info.assists_list;
            self.vm_score.card_data = info.card_data;
            self.vm_score.lineup_list = info.lineup_list;


            //只有在分享状态下才会进行调整
            if(self.view.viewData.share && self.view.viewData.share == 1 || info.is_admin && info.is_admin == 1){
                self.setShareInfo();
            }

            if(info.is_captain && info.is_captain == 1){
                self.initNavigationRightBtn();
            }
        });

    };

    this.setShareInfo = function () {
        var content = self.vm_header.home_team_name + " VS " + self.vm_header. away_team_name + "," + self.vm_detail.matchBeginTime;
        if(self.vm_detail.matchPlaceName && self.vm_detail.matchPlaceName.length > 0){
            content  += self.vm_detail.matchPlaceName + ",";
        }
        content += "快来报名!";
        self.view.setShareInfo(content);
    };

    this.initView = function () {

        //初始化切换按钮
        self.tabSwitcher = new TabSwither();
        self.tabSwitcher.addCallBack(function (selectedIndex) {
            switch (selectedIndex) {
                case 0:
                    $("#match_detail_info").show();
                    $("#detail_score_box").hide();
                    
                    break;
                case 1:
                    $("#match_detail_info").hide();
                    $("#detail_score_box").show();
                    break;
            }
        });

        //初始化header
        self.vm_header = new Vue({
           el:"#match_header_info",
            data:{
                home_team_id:0,
                home_team_logo:'./images/team-logo-default.png',
                home_team_name:'待定',
                home_team_score:0,
                home_team_point_score:0,

                away_team_id:0,
                away_team_logo:'./images/team-logo-default.png',
                away_team_name:'待定',
                target_team_score:0,
                target_team_point_score:0,
                
            },
            methods:{
                showResult: function (home_team_score,home_team_point_score,away_team_score,away_team_point_score) {
                    var html='VS';
                    if((home_team_score && Number(home_team_score) > 0 ) ||  (away_team_score && Number(away_team_score) > 0 ) ){
                        html=home_team_score+' : '+away_team_score;

                        if( ( home_team_point_score && Number(home_team_point_score) > 0 ) ||  (away_team_point_score && Number(away_team_point_score) > 0 )  ){
                            html = home_team_score + "("+home_team_point_score+")" + " : "  + away_team_score + "(" + away_team_point_score +")";
                        }
                    }
                    return html;
                },

                openTeamPage:function (team_id) {
                    var params = {
                        team_id:team_id
                    };
                },

            },
        });

        //初始化详情
        self.vm_detail = new Vue({
            el:"#match_detail_info",
            data:{
                matchName:"",
                matchType:"",
                matchBeginTime:"",
                matchApplyEndTime:"",
                matchPlaceName:"",
                matchColor:"",
                matchMaxPeople:0,
                matchDesc:"",
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
                isShareState:self.view.viewData.share && self.view.viewData.share ===1 ? false:true,
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
                    self.vm_detail.showEnrollList = !self.vm_detail.showEnrollList;
                },
                //点击请假
                tapOffAction:function () {
                    self.vm_detail.showOffList = !self.vm_detail.showOffList;
                },
                //点击待定请假
                tapPendingAction:function () {
                    self.vm_detail.showPendingList = !self.vm_detail.showPendingList;
                },

                joinSchedule:function (owner_join, type) {
                    if(owner_join == type)return;
                    $("#loading").show();
                    self.view.post(CONFIG.SCHEDULE_TEAM_JOINEVENT,{id:self.view.viewData.id,team_id:self.view.viewData.team_id,type:type,sub_type:2},self.view.viewData.token,function (code,message,info) {
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
                    self.view.baiduNavigation("比赛位置", self.vm_detail.matchPlaceName, lat, lng);
                },
                matchColorStyle:function (colorIndex) {
                  return {
                      background: self.colorDict[colorIndex],
                      backgroundSize: "30px 16px",
                      border:"1px solid #999",
                  }
                },
            }
        });


        self.vm_score = new Vue({
            el:"#detail_score_box",
            data:{
                goal_data:[],
                assists_list:[],
                card_data:[],
                lineup_list:[],
            },
            methods:{
                openUserInfo:function(user_id) {

                },
            },
        });

    };

    //分享操作
    this.shareAction = function (type) {
        var content = self.vm_header.home_team_name + " VS " + self.vm_header. away_team_name + "," + self.vm_detail.matchBeginTime;
        if(self.vm_detail.matchPlaceName && self.vm_detail.matchPlaceName.length > 0){
            content  += self.vm_detail.matchPlaceName + ",";
        }
        content += "快来报名!";
        var url = self.view.viewData.http_url +
            "/webapps/aiqiumi/src/scheduele/match_schedule_detail.html?" +
            this.view.encodeShareData({team_id:self.view.viewData.team_id, id:self.view.viewData.id,share:1});
        self.view.shareAction(type,content,content,url,"",{schedule_id:self.view.viewData.id,schedule_type:2});
    };


    //编辑比赛信息
    this.editMatchInfo = function () {
        self.view.webViewJavascriptBridge(function(bridge) {
            var params = {
                action:"openNewHtml",
                src:"schedule/edit_schedule_match.html",
                data: {  team_id:self.view.viewData.team_id, id:self.view.viewData.id}
            };

            //触发按钮
            bridge.callHandler('Click',params, function responseCallback(responseData) {
                console.log(responseData);
            });
        });
    };

    //录入比赛战报
    this.editMatchData = function () {
        self.view.webViewJavascriptBridge(function(bridge) {
            var params = {
                action:"openNewHtml",
                src:"schedule/match_enter_score.html",
                data: {  team_id:self.view.viewData.team_id, id:self.view.viewData.id}
            };

            //触发按钮
            bridge.callHandler('Click',params, function responseCallback(responseData) {
                console.log(responseData);
            });
        });
    };

    this.deleteMatch = function () {
        var btnArray = ['是', '否'];
        mui.confirm('确认删除这个比赛？', '删除比赛', btnArray, function(e) {
            if (e.index == 0) {
                //删除操作
                $("#loading").show();
                self.view.post(CONFIG.SCHEDULE_TEAM_DELETE_MATCH, {id: self.view.viewData.id}, self.view.viewData.token, function (code, message, info) {
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
