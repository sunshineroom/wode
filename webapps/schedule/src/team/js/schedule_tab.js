
function clearTabSelect(){
    $("#tab_section >div").each(function(index){
        $(this).attr('class',"tab_no_active");
    });
}

function setSelectTab(selectIndex){
    $("#tab_section >div").each(function(index){
        if(selectIndex==index){
            $(this).attr('class',"tab_active");
        }else{
            $(this).attr('class',"tab_no_active");
        }
    });

    tabClick(selectIndex);
}

//绑定tab 点击事件
function initTabEvent(){
    $("#tab_section >div").each(function(index){
        $(this).bind("click",function(){
            //选中
            if("tab_active"!==$(this).attr('class')){
                clearTabSelect();
                $(this).attr('class',"tab_active");

                tabClick(index);
            }
        });
    });
}