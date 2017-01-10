/**
 * Created by lan on 2016/12/20.
 */

var SelectTeamController = function () {

    this.vm;                    //Vue 绑定界面
    this.view;
    this.page;
    this.searchText;

    var self = this;
    this.init = function () {
        self.initView();
        self.iniData();
    };

    this.iniData = function () {
        self.page=1;
        self.view = new ViewController();
        self.view.init();

        setTimeout(function () {
            self.view.webViewJavascriptBridge(function (bridge) {
                bridge.callHandler('Title', {"title":"选择球队"}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            })

        }, 300);
    };

    this.setTeam = function (obj) {
        self.view.webViewJavascriptBridge(function(bridge) {
            //通知界面标题内容
            bridge.callHandler("reloadData", "setTeam('"  +obj.team_name + "'," + obj.team_id + ")", function responseCallback(responseData) {
                console.log(responseData);
            });
        });
    };

    var self = this;

    this.initView = function () {
        self.vm = new Vue({
            el:"#searchTeamDiv",
            data:{
                searchResultList:[],
                textChange:"",
                inputText:"添加地点："+"",
                isShowInput:false
            },
            methods:{
                clickValue:function(text){
                    var content =  text.split(":")[1];
                    console.log(content);

                    var teamObj = {
                        team_name:content,
                        team_id:""
                    };
                    self.setTeam(teamObj);

                },
                selectTeam:function (team) {
                    var teamObj = {
                        team_name: team.team_name,
                        team_id: team.team_id,
                    };
                    console.log(teamObj);
                    self.setTeam(teamObj);
                }
            },
            watch:{
                textChange:function(text){
                    console.log(text);
                    var trimString = $.trim(text);
                    this.isShowInput = (trimString.length>0)? true:false;
                    this.inputText = "添加对手:"+ trimString;
                    if(trimString.length == 0){
                        this.searchResultList = [];
                        return;
                    }
                    self.searchText = trimString;
                    self.page = 1;
                    self.searchTeam();
                }
            }
        });
    };

    this.searchTeam = function () {
        self.view.post(CONFIG.SEARCH_TEAM_INFO_URL, {team_name:self.searchText,page:self.page},"",function (code, message, result) {
            if(code !=200) return;
            console.log(message);
            self.vm.searchResultList = result.list;
            console.log(result);
        });
    };
};