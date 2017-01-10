/**
 * Created by lan on 2016/12/23.
 */

var ColorPicker = function () {

    this.html = '\
            <div class="bg-color"  style="display: none">  \
                <div class="color-header">选择球衣颜色</div>  \
                <ul class="color-list">  \
                <li class="color color1" style="border:1px solid #999999" data-value="9"></li> \
                <li class="color color2" data-value="10"></li>   \
                <li class="color color3" data-value="12"></li>   \
                <li class="color color4" data-value="11"></li>   \
                <li class="color color5" data-value="3"></li>    \
                <li class="color color6" data-value="2"></li>    \
                <li class="color color7" data-value="1"></li>    \
                <li class="color color8" data-value="8"></li>    \
                <li class="color color9" data-value="7"></li>    \
                <li class="color color10" data-value="6"></li>   \
                <li class="color color11" data-value="5"></li>   \
                <li class="color color12" data-value="4"></li>   \
                <li class="color color-mr" data-value="0"></li>  \
                </ul>  \
            </div>  \
            <div class="color-back" style="display: none"></div> \
        ';

    var self = this;
    this.init = function () {
        $("body").append(this.html);
    };

    this.destroy = function () {
        $(".bg-color, .color-back").remove();
    };

    this.show = function(callback){
        $(".bg-color, .color-back").show();
        //绑定事件
        $(".color-list li").on("click",function(){
            var index = Number($(this).data("value"));
            if(callback) callback(index);
            self.destroy();
        });
    };
};
