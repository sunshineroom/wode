/**
 * Created by lan on 2016/12/29.
 */

var TeamScheduleController = function () {

    this.vm;    //初始化内容
    this.view;  //视图
    this.tabSwitcher; //初始化切换键

    this.dropload;


    this.historyPage = 1;
    this.nowPage = 1;

    var self = this;

    this.init = function () {
        self.view = new ViewController();
        self.view.init();

        self.initNavigation();
        self.initView();
        self.initRefresh();
        self.initData();

    };

    this.initNavigation = function () {
        setTimeout(function () {
            //触发内容
            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                bridge.callHandler('Title',{"title":"球队日程"} , function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        }, 300);
    };


    this.initNavigationRightBtn = function () {

        //触发内容
        self.view.webViewJavascriptBridge(function(bridge) {
            var buttonArray = [{"title":"添加","action":"teamScheduleController.addSchedule()",type:"add"}];
            bridge.callHandler("RightButtonInfo", {"buttons":buttonArray}, function responseCallback (responseData) {
                console.log(responseData);
            })
        });
    };


    this.initData = function () {

        $("#loading").show();
        self.getCurrentScheduleList(self.nowPage,self.view.viewData.team_id);

        self.view.post(CONFIG.IS_CAPTAIN_ADMIN, {team_id:self.view.viewData.team_id}, self.view.viewData.token, function (code,message,info) {
            if(code != 200) return;
            if(info.is_captain && info.is_captain ==1 || info.is_admin && info.is_admin == 1){
                self.initNavigationRightBtn();
            };
        });


    };

    this.initRefresh=function(){
        mui.init({
            pullRefresh: {
                container: '#list_div',
                down: {
                    callback: self.pulldownRefresh
                },
                up: {
                    contentrefresh: '正在加载...',
                    callback: self.pullupRefresh
                }
            }
        });
    };

    this.pulldownRefresh = function () {
        mui('#list_div').pullRefresh().scrollTo(0,0,0);
        switch (self.tabSwitcher.selectedIndex){
            case 0:
                self.nowPage = 1;
                self.getCurrentScheduleList(self.nowPage,self.view.viewData.team_id);
                break;
            case 1:
                self.historyPage = 1;
                self.getHishtoryScheduleList(self.historyPage,self.view.viewData.team_id);
                break;
        }
    };

    this.pullupRefresh = function () {

        switch (self.tabSwitcher.selectedIndex){
            case 0:
                self.nowPage ++ ;
                self.getCurrentScheduleList(self.nowPage,self.view.viewData.team_id);
                break;
            case 1:
                self.historyPage ++;
                self.getHishtoryScheduleList(self.historyPage,self.view.viewData.team_id);
                break;
        }
    };

    this.reloadHttp = function () {
        
        self.pulldownRefresh();

    };

    this.getCurrentScheduleList = function (page, team_id) {
        self.view.post(CONFIG.SCHEDULE_TEAM_SCHEDULE_NOW, {page:page, team_id:team_id},self.view.viewData.token, function (code,message,info) {
            $("#loading").hide();
            self.view.log(info);
            mui('#list_div').pullRefresh().endPullupToRefresh(true);
            if(code != 200){
                mui.alert(message, '', function() {

                });
            };

            if(self.nowPage == 1){
                self.vm.scheduleList = info.list;
                mui('#list_div').pullRefresh().endPulldownToRefresh();
            }else {
                for (var i = 0; i < info.list.length; i++) {
                    self.vm.ScheduleList.push(info.list[i]);
                }
            }

            if(info.list.length < 20){
                mui('#list_div').pullRefresh().disablePullupToRefresh();
            }else{
                mui('#list_div').pullRefresh().enablePullupToRefresh();  //打开下拉
            }
        });
    };

    this.getHishtoryScheduleList= function (page, team_id) {
        self.view.post(CONFIG.SCHEDULE_TEAM_SCHEDULE_HISTORY, {page:page, team_id:team_id},self.view.viewData.token, function (code,message,info) {
            $("#loading").hide();
            self.view.log(info);
            mui('#list_div').pullRefresh().endPullupToRefresh(true);
            if(code != 200){
                mui.alert(message, '', function() {

                });
            };
            if(self.historyPage == 1){
                self.vm.scheduleList = info.list;
                mui('#list_div').pullRefresh().endPulldownToRefresh();
            }else{
                for (var i = 0; i<info.list.length; i++){
                    self.vm.scheduleList.push(info.list[i]);
                }
            }
            if(info.list.length < 20){
                mui('#list_div').pullRefresh().disablePullupToRefresh();
            }else{
                mui('#list_div').pullRefresh().enablePullupToRefresh();
            }
        });
    };

    this.initView = function () {
        
        self.tabSwitcher = new TabSwither();
        self.tabSwitcher.addCallBack(function (selectedIndex) {
            switch (selectedIndex) {
                case 0:
                    self.vm.showCurrentSchedule = true;
                    self.vm.showHistorySchedule = false;
                    self.pulldownRefresh();

                    break;
                case 1:
                    self.vm.showCurrentSchedule = false;
                    self.vm.showHistorySchedule = true;
                    self.pulldownRefresh();
                    break;
            }
        });

        this.vm = new Vue({
            el:"#team_schedules",
            data:{
                scheduleList:[],
            },
            methods:{
                sssssss:function () {
                    console.log("ssssssss");
                },
            }
        });

        this.addSchedule = function () {

            //打开页面
            self.view.webViewJavascriptBridge(function(bridge) {
                //触发按钮
                var params = {
                    action:"openNewHtml",
                    src:"schedule/addSchedule.html",
                    data: {team_id:self.view.viewData.team_id}
                };
                bridge.callHandler('Click',params, function responseCallback(responseData) {
                    console.log(responseData);
                });
            });
        };
    };
    
    
    //注册全局Vue组件内容
    Vue.component('schedulecomponent', {
        props: ['schedule_list'],
        template: '#team-schedule-template',
        methods:{
            showMatchResult:function(time , team_score, team_point_score, target_team_score, target_team_point_score){

                var show_day=new Array('周日','周一','周二','周三','周四','周五','周六');
                var date=new Date(time.replace(/-/g, '/'));

                var day=date.getDay();

                var hour=date.getHours()+"";
                var minutes=date.getMinutes()+"";

                if(hour.length==1) hour="0"+hour+"";

                if(minutes.length==1) minutes="0"+minutes+"";

                var html=show_day[day]+" "+hour+":"+minutes;


                if(!team_score) return html;
                if(!target_team_score) return html;

                if(team_point_score!=0 || target_team_point_score!=0){
                    return team_score+"("+team_point_score+") : "+target_team_score+"("+target_team_point_score+")";
                }else{
                    return team_score+" : "+target_team_score;
                }
            },
            joinSchedule:function (schedule, type, subtype, index) {
                console.log(schedule);
                self.view.post(CONFIG.SCHEDULE_TEAM_JOINEVENT,{id:schedule.id,team_id:self.view.viewData.team_id,type:type,sub_type:subtype},self.view.viewData.token,function (code,message,info) {
                    if(code!=200){
                        mui.alert(message, '', function() {

                        });
                        return;
                    };

                    self.vm.scheduleList[index].off_count = info['off_count'];
                    self.vm.scheduleList[index].enroll_count = info['enroll_count'];
                    self.vm.scheduleList[index].pending_count = info['pending_count'];
                });
            },

            showScheduleTime: function(time,type){
                if(!time) return "时间待定";
                var show_day=new Array('周日','周一','周二','周三','周四','周五','周六');
                var date=new Date(time.replace(/-/g, '/'));
                var day=date.getDay();
                var hour=date.getHours()+"";
                var minutes=date.getMinutes()+"";
                if(hour.length==1) hour="0"+hour+"";
                if(minutes.length==1) minutes="0"+minutes+"";
                var html;
                switch (Number(type)) {
                    case 1:
                        html = time.split(" ")[0];
                        break;
                    case 2:
                        html = time.split(" ")[0] + " " + show_day[day]+" "+hour+":"+minutes;
                        break;
                    case 3:
                        html = time.split(" ")[0] + " "+hour+":"+minutes;
                        break;
                }
                return html;
            },
            showTeamClothesColor:function (colorIndex) {

                var colors_dict = {
                    "0": "url(./images/no_cloth.png) no-repeat",
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
                    return{
                        background:colors_dict[colorIndex],
                        backgroundSize: "15px 12px",
                    };
            },

            team_clothes:function (color_index) {
                if(color_index == 9){
                    return'./images/no_cloth.png';
                }else{
                    return"./images/cloth.png"
                }
            },

            showVsResult:function (result) {
                var html = "VS";

                if(!result) return html;
                if(result.length==0) return html;

                if(result.length==1){
                    var obj=result[0];
                    html=obj.home_team_goal+':'+obj.away_team_goal;
                }

                if(result.length==2){
                    var obj=result[0];
                    var obj1=result[1];
                    html=obj.home_team_goal+'('+obj1.home_team_goal+'):('+obj1.away_team_goal+')'+obj.away_team_goal;
                }
                return html;
            },
            openActiveDetail:function (id) {
                
                self.view.webViewJavascriptBridge(function (bridge) {
                    //触发按钮
                    var params = {
                        action:"openNewHtml",
                        src:"schedule/active_schedule_detail.html",
                        data: {team_id:self.view.viewData.team_id,id:id }
                    };
                    bridge.callHandler('Click',params, function responseCallback(responseData) {
                        console.log(responseData);
                    });
                });
            },
            openLeagueDetail:function (url) {

                self.view.webViewJavascriptBridge(function (bridge) {
                    //触发按钮
                    var params = {
                        action:"openOldWebViewHtml",
                        data: {url:url},
                    };
                    bridge.callHandler('Click',params, function responseCallback(responseData) {
                        console.log(responseData);
                    });
                });


            },
            openMatchDetail:function (id) {

                self.view.webViewJavascriptBridge(function (bridge) {
                    //触发按钮
                    var params = {
                        action:"openNewHtml",
                        src:"schedule/match_schedule_detail.html",
                        data: {team_id:self.view.viewData.team_id,id:id }
                    };
                    bridge.callHandler('Click',params, function responseCallback(responseData) {
                        console.log(responseData);
                    });
                });
            },
        }
    });
};
