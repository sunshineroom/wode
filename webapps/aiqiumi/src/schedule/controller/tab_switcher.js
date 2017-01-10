/**
 * Created by lan on 2016/12/22.
 */


var TabSwither = function () {

    this.callBack;
    this.selectedIndex = 0;
    var self = this;

    //清除选中
    this.clearTabSelect = function () {
        $("#tab_section >div").each(function(index){
            $(this).attr('class',"tab_no_active");
        });
    };

    //设置选项
    this.setSelectTab = function (selectedIndex) {
        self.selectedIndex = selectedIndex;
        $("#tab_section >div").each(function(index){
            if(selectIndex==index){
                $(this).attr('class',"tab_active");
            }else{
                $(this).attr('class',"tab_no_active");
            }
        });
    };

    //初始化数据
    this.initTabSwitcher = function () {
        $("#tab_section >div").each(function(index){
            $(this).bind("click",function(){
                //选中
                if("tab_active" !== $(this).attr('class')){
                    self.clearTabSelect();
                    $(this).attr('class',"tab_active");
                    self.selectedIndex = index;
                    if(self.callBack) self.callBack(index);
                }
            });
        });
    };

    //添加回调
    this.addCallBack = function(callBack){
        self.callBack = callBack;
    };

    this.initTabSwitcher();
};
