/**
 * Created by lan on 2016/12/22.
 */



var ActiveComponent = function () {

    this.activeNode = {
        activeName: "",             //活动名称
        activeBeginTime:"",         //活动开始时间
        activeApplyEndTime:"",      //报名截止时间
        activePlaceName:"",             //活动地点
        activeMaxPeople: "",        //最大活动人数
        activeDesc: "",             //活动描述
        activeDescLength: "0",       //描述最大文字
    }

    //选择地理位置
    this.selectPlaceCallBack;

    var self = this;
    //注册组件
    Vue.component('editactive_component', {
        template:'\
    <div>\
         <span style="font-size: 0.75em;color: #808992">*为必填项</span> \
             <ul id="match_ul" class="add_schedule_ul"> \
                 <!-- 活动名称--> \
                 <li>   \
                     <div class="left"> \
                        <img class="icon" src="./images/schedule_icon_event.png" > \
                     </div> \
                     <div class="middle"> \
                        <input class="content" v-bind:value="activeName" type="text" @change="inputActiveName($event.target.value)"  placeholder="活动名称: 训练、聚餐、开会等" /> \
                     </div>  \
                    <div class="right"> </div> \
                 </li>\
                 <li> \
                <!-- 活动时间-->\
                    <div class="left">  \
                         <img class="icon" src="./images/schedule_icon_time.png" />  \
                    </div>  \
                    <div class="middle">  \
                         <input class="content" readonly="readonly" v-bind:value="activeBeginTime" @click="setActiveBeginTime" type="text" placeholder="开始时间*" /> \
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
                    <input class="content" readonly="readonly" v-bind:value="activeApplyEndTime" @click="setActiveApplyEndTime" type="text" placeholder="报名截止" /> \
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
                        <input class="content" readonly="readonly" v-bind:value="activePlaceName" @click="setActivePlace" type="text" placeholder="地点" />  \
                    </div>  \
                    <div>\
                         <div class="right"> </div>  \
                    </div>  \
                </li> \
                   <!--人数上限--> \
                    <li>  \
                        <div class="left">  \
                            <img class="icon" src="./images/schedule_icon_toplimit.png" > \
                        </div>  \
                        <div class="middle">  \
                            <input class="content"  v-bind:value="activeMaxPeople"  @keyup="updateValue($event)"  type="text" placeholder="人数上限" /> \
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
                            <textarea class="content" v-bind:value="activeDesc"  @keyup="inputActiveDesc($event.target.value)" placeholder="备注"></textarea> \
                        </div>  \
                             <div class="right"> \
                        </div> \
                        <span class="w-num" id="match_count"><em class="wordCheck"> {{ activeDescLength }} </em>/1000</span> \
                    </li>\
           </ul> \
    </div>\
    ',
        data:function() {
            return self.activeNode;
        },
        methods:{
            setActiveBeginTime:function () {
                var  datePicker = new mui.DtPicker({"type":"datetime","beginYear":1990,"endYear":2026});
                datePicker.show(function(rs){
                    self.activeNode.activeBeginTime = rs.text;
                    datePicker.dispose();
                    datePicker = null;
                });
            },
            setActiveApplyEndTime:function () {
                var  datePicker = new mui.DtPicker({"type":"datetime","beginYear":1990,"endYear":2026});
                datePicker.show(function(rs){
                    self.activeNode.activeApplyEndTime = rs.text;
                    datePicker.dispose();
                    datePicker = null;
                });
            },
            setActivePlace:function () {
                if(self.selectPlaceCallBack)self.selectPlaceCallBack();
            },
            updateValue:function (event) {
                event.target.value =  $.trim(event.target.value).match(/[0-9]*/)[0];
                self.activeNode.activeMaxPeople = event.target.value;
            },
            inputActiveName:function (value) {
                self.activeNode.activeName = $.trim(value);
            },
            inputActiveDesc:function (value) {
                if($.trim(value).length > 1000){
                    self.activeNode.activeDesc =$.trim(value).substr(0,$.trim(value).length-1);
                    self.activeNode.activeDescLength = 1000;
                }else{
                    self.activeNode.activeDesc = $.trim(value);
                    self.activeNode.activeDescLength = $.trim(value).length;
                }
            }
        }
    });
};
