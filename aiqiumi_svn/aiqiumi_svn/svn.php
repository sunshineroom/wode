<?php

function nl2br2($string) { 
  $string = str_replace(array("\r\n", "\r", "\n"), "<br />", $string); 
  return $string; 
} 

$opt = isset($_POST["opt"]) ? $_POST["opt"] : "";
if($opt == "update"){
    $command = "sh /home/shell/r_test_host.sh";
    $command_result = array();
    exec($command, $command_result, $command_status);
    echo implode("<br/>", $command_result);
    //var_dump($command_status);
    exit();
}
?>
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
    <meta name="format-detection" content="telephone=no" />
    <title>SVN_更新程序_20160815</title>
    <link rel="stylesheet" type="text/css" href="./public/css/pintuer.css"  />
    <script src="./public/js/jquery.js"></script>
    <script src="./public/js/pintuer.js"></script>
</head>
<body>
<div class="container">
	<div class="panel" style="margin-top:50px;">
	    <div class="panel-head"><strong>测试服务器代码更新</strong></div>
	    <div class="panel-body" id="svn_box">暂无更新...</div>
	    <div class="panel-foot"><button class="button bg-sub" id="svn_update">更新代码</button></div>
	</div>
</div>
<script>
var svn_box = null;
$(document).ready(function(){
    $("#svn_update").on("click", function(){
    	svn_box = (svn_box == null) ? $("#svn_box") : svn_box;
    	svn_box.html("开始更新代码...");
    	$.post("", {opt:"update"}, function(data){
    		svn_box.html(data);
    	}, "text");
    });
});
</script>
</body>
</html>