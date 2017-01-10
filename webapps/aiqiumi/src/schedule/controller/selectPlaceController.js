/**
 * Created by lan on 2016/12/20.
 */

var SelectPlaceController = function () {


    this.vm;                    //Vue 绑定界面
    this.location;
    this.view;
    
    
    var self = this;

    //初始化
    this.init = function () {
        self.initView();
        self.initData();
    };


    //初始化
    this.initData = function () {
        self.location = new FLocation();
        self.location.getLocation(function (info) {
            $(".mui-content").show();
        });
        self.view = new ViewController();
        self.view.init();

        setTimeout(function () {
            self.view.webViewJavascriptBridge(function (bridge) {
                bridge.callHandler('Title', {"title":"选择地点"}, function responseCallback(responseData) {
                    console.log(responseData);
                });
            })
        }, 300);
    };

    this.setPlace = function (obj) {
        this.view.webViewJavascriptBridge(function(bridge) {
            //通知界面标题内容
            bridge.callHandler("reloadData", "setPlace( ' " + obj.name + "'," + obj.location.lat +  ","+ obj.location.lng+")", function responseCallback(responseData) {
                console.log(responseData);
            });
        });

    };

    var self = this;

    this.initView = function () {
        this.vm = new Vue({
            el:"#selectPlaceDiv",
            data:{
                searchResultList:[],
                textChange:"",
                inputText:"添加地点："+"",
                isShowInput:false
            },
            methods:{
                clickValue:function(text){
                    var content =  text.split(":")[1];
                    var placCopy = {
                        name:content,
                        address:"",
                        location:{
                            lat: 0 ,
                            lng: 0 ,
                        }
                    };
                    console.log(placCopy);
                   self.setPlace(placCopy);


                },
                selectPlace:function (place) {
                    var placCopy = {
                        name:place.name,
                        address:place.address,
                        location:{
                            lat:place.location? place.location.lat: 0 ,
                            lng:place.location? place.location.lng: 0 ,
                        }
                    };
                    console.log(placCopy);
                    self.setPlace(placCopy);
                }
            },
            watch:{
                textChange:function(text){
                    var trimString = $.trim(text);
                    this.isShowInput = (trimString.length>0)? true:false;
                    this.inputText = "添加地点:"+ trimString;
                    if(trimString.length == 0){
                        this.searchResultList = [];
                        return;
                    }
                    self.location.searchPlace(trimString, function (status,message,results) {
                        self.vm.searchResultList = results;
                    });
                }
            }
        });
    };
};
