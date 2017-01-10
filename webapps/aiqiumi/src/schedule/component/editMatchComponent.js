/**
 * Created by lan on 2016/12/22.
 */


var MatchComponent = function () {

    this.matchNode = {
        matchName: "",
        matchType: 0,
        matchTeamName: "",
        matchBeginTime:"",
        matchApplyEndTime:"",
        matchPlaceName:"",
        matchColor: "0",
        matchMaxPeople: "",
        matchDesc: "",
        matchDescLength: "0",
    };

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


    //选择地理位置
    this.selectPlaceCallBack;

    //选择球队
    this.selectMatchTeamCallBack;

    
    var self = this;
    //注册组件
    Vue.component('editmatch_component', {
        template:'\
    <div>\
         <span style="font-size: 0.75em;color: #808992">*为必填项</span> \
             <ul id="match_ul" class="add_schedule_ul"> \
                 <!-- 比赛名称--> \
                 <li>   \
                     <div class="left"> \
                        <img class="icon" src="./images/schedule_icon_match.png" > \
                     </div> \
                     <div class="middle"> \
                        <input class="content" v-bind:value="matchName" id="match_title"  @change="inputMatchName($event.target.value)" type="text" placeholder="比赛名称" /> \
                     </div>  \
                    <div class="right"> </div> \
                 </li>\
                 <li> \
                 <!-- 比赛类型-->\
                    <div class="left"> \
                         <img class="icon" src="./images/schedule_icon_type.png" > \
                    </div> \
                    <div class="middle"> \
                        <input class="content" readonly="readonly" v-bind:value="matchType"  @click="selectMatchType" type="text" placeholder="比赛类型" /> \
                    </div> \
                        <div class="right"> \
                         <div />  \
                    </div> \
                 </li>\
                 <li> \
                 <!-- 比赛对手-->\
                    <div class="left"> \
                         <img class="icon" src="./images/schedule_icon_people.png" > \
                    </div>  \
                    <div class="middle"> \
                        <input class="content" readonly="readonly" v-bind:value="matchTeamName" @click="addSelectTeam" type="text" placeholder="对手" /> \
                    </div>  \
                    <div>\
                         <div class="right"> </div>     \
                    </div>      \
                 </li>\
                <li>\
                <!-- 比赛时间-->\
                    <div class="left">  \
                         <img class="icon" src="./images/schedule_icon_time.png" />  \
                    </div>  \
                    <div class="middle">  \
                         <input class="content" readonly="readonly" v-bind:value="matchBeginTime"  @click="setMatchBeginTime" type="text" placeholder="开始时间*" /> \
                    </div> \
                    <div>\
                         <div class="right"></div> \
                    </div>  \
                </li>\
                <li> \
                 <!-- 报名截止时间-->\
                    <div class="left"> \
                    <img class="icon" src="./images/schedule_icon_end.png" >  \
                    </div> \
                    <div class="middle"> \
                    <input class="content" readonly="readonly"  v-bind:value="matchApplyEndTime" @click="setMatchApplyEndTime" type="text" placeholder="报名截止" /> \
                    </div> \
                    <div> \
                         <div class="right">  </div> \
                     </div> \
                </li>\
                <li> \
                   <!-- 地点-->\
                    <div class="left"> \
                         <img class="icon" src="images/schedule_icon_place.png" > \
                    </div> \
                    <div class="middle"> \
                        <input class="content" readonly="readonly" v-bind:value="matchPlaceName"  @click="setMatchPlace" type="text" placeholder="地点" />  \
                    </div>  \
                    <div>\
                         <div class="right"> </div>  \
                    </div>  \
                </li> \
                <li> \
                 <!-- 球队颜色-->\
                    <div class="left"> \
                        <img class="icon" src="images/schedule_icon_clothes.png" > \
                    </div> \
                    <div class="middle">  \
                        <span class="color-btn" id="btnTeamColor"  @click="setMatchColor" v-bind:style = "matchColor"></span> \
                        <input type="hidden" value="12"/> \
                    </div> \
                    <div class="right"> \
                    </div> \
                 </li>\
                   <!--人数上限--> \
                    <li>  \
                        <div class="left">  \
                            <img class="icon" src="./images/schedule_icon_toplimit.png" > \
                        </div>  \
                        <div class="middle">  \
                            <input class="content"  v-bind:value="matchMaxPeople" @keyup="inputMatchMaxPeople($event)" type="text" placeholder="人数上限" /> \
                        </div> \
                        <div class="right"> \
                            <span>人</span> \
                        </div>  \
                    </li>  \
                    <li> \
                        <!-- 备注 --> \
                        <div class="left"> \
                            <img class="icon" src="images/schedule_icon_text.png" > \
                        </div> \
                        <div class="middle"> \
                            <textarea class="content" v-bind:value="matchDesc" id="match_desc" @keyup="inputMatchDesc($event.target.value)" placeholder="备注"></textarea> \
                        </div>  \
                             <div class="right"> \
                        </div> \
                        <span class="w-num" id="match_count"><em class="wordCheck"> {{ matchDescLength }} </em>/1000</span> \
                    </li>\
           </ul> \
    </div>\
    ',
        data:function() {
            return self.matchNode;
        },
        computed:{
            matchType:{
                get:function () {
                    return self.matchNode.matchType == 0? "":self.matchNode.matchType + "人制";
                }
            },
            matchColor:{
                get:function () {
                    return  {
                        background: self.colorDict[self.matchNode.matchColor],
                        backgroundSize: "30px 16px",
                        border:"1px solid #999",
                    };
                }
            }
        },
        methods:{
            selectMatchType:function () {
                var typePicker = new mui.PopPicker();
                typePicker.setData([{ value: '5',  text: '5人制'},
                    { value: '6',  text: '6人制'},
                    { value: '7',  text: '7人制'},
                    { value: '8',  text: '8人制'},
                    { value: '9',  text: '9人制'},
                    { value: '10', text: '10人制'},
                    { value: '11', text: '11人制'}]);

                typePicker.show(function(items){
                    self.matchNode.matchType = items[0].value;
                    typePicker.dispose();
                    typePicker = null;
                });
            },
            addSelectTeam:function () {
                if(self.selectMatchTeamCallBack) self.selectMatchTeamCallBack();
            },
            setMatchBeginTime:function () {

                var  datePicker = new mui.DtPicker({"type":"datetime","beginYear":1990,"endYear":2026});
                datePicker.show(function(rs){
                    self.matchNode.matchBeginTime = rs.text;
                    datePicker.dispose();
                    datePicker = null;
                });
            },
            setMatchApplyEndTime:function () {

                var  datePicker = new mui.DtPicker({"type":"datetime","beginYear":1990,"endYear":2026});
                datePicker.show(function(rs){
                    self.matchNode.matchApplyEndTime = rs.text;
                    datePicker.dispose();
                    datePicker = null;
                });

            },
            inputMatchMaxPeople:function (event) {
                event.target.value =  $.trim(event.target.value).match(/[0-9]*/)[0];
                self.matchNode.matchMaxPeople =  event.target.value;
            },
            setMatchPlace:function () {
                if(self.selectPlaceCallBack) self.selectPlaceCallBack();
            },
            setMatchColor:function () {
                var colorPicker = new ColorPicker();
                colorPicker.init();
                colorPicker.show(function (index) {
                    self.matchNode.matchColor = index;
                    colorPicker = null;
                });
            },

            inputMatchName:function (value) {
                self.matchNode.matchName = $.trim(value);
            },

            inputMatchDesc:function (value) {
                    if($.trim(value).length > 1000){
                        self.matchNode.matchDesc =$.trim(value).substr(0,$.trim(value).length-1);
                        self.matchNode.matchDescLength = 1000;
                    }else{
                        self.matchNode.matchDesc = $.trim(value);
                        self.matchNode.matchDescLength = $.trim(value).length;
                    }
            },


        }
    });
};

