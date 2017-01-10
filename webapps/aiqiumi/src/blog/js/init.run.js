//调取富文本对象
$(function() {
	//--- 设置字体大小 ----
	var cw = document.documentElement.clientWidth;
	var dp = window.devicePixelRatio;
	var percent = cw/750 * 100;
	var fs = 100 * percent / 100;
	document.documentElement.style.fontSize = fs + "px";
	
	//--- 初始化动态编辑器 ----
	var editor = $("#rice_content").aqmeditor();
	
	
	//--- 以下为debug信息开始 ---
	//点击插入图片效果
	var pic = 'http://img06.tooopen.com/images/20161204/tooopen_sy_188713354445.jpg';
	document.getElementById("rice_insert").addEventListener("click", function(){
		editor.insertImage(pic);
	});
	
	//点击模拟提交
	document.getElementById("rice_submit").addEventListener("click", function(){
		var txt = editor.getContent();
		var title = $.trim($("#rice_title").val());
		
		var debug_txt = "提交的数据如下：\n";
			debug_txt+= "标题：\n";
			debug_txt+= title;
			debug_txt+= "正文内容：\n";
			debug_txt+= txt;
			
		alert(debug_txt);
	});
	
	//点击获取内容(格式化)
	document.getElementById("rice_get_format").addEventListener("click", function(){
		var txt = editor.getHtml();
		alert(txt);
	});
	
	//点击获取内容(一般)
	document.getElementById("rice_get_html").addEventListener("click", function(){
		var txt = editor.getContent();
		alert(txt);
	});
});