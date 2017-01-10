<?php

//定义应用配置
define("APP_PATH", dirname(__DIR__));
define("APP_PORT", 7305);
define("APP_CHAT_SALT", "aiqiumi_chat2016");
define("APP_CHAT_PWD", "aiqiumi_server_RYBSjft003c3");
define("APP_CHAT_EXPIRE", 900); //过期时间 & 10分钟

require_once APP_PATH . '/lib/Security.class.php';

//创建WebSocket服务器
$server = new swoole_websocket_server("0.0.0.0", APP_PORT);
//配置服务器
$server->set(array(
	'worker_num' => 4,  //worker process num
	'backlog' => 128,   //listen backlog
	'max_request' => 5000,
	'dispatch_mode'=> 1,
	'daemonize' => 1
));

//处理接收事件
//1. 连接到服务器
$server->on('Open', function ($serv, $request) {
	//全局服务器
	global $server;
	//连接服务器，返回当前的连接id
	$chat_id = $request->fd;
	//返回登录信息
	$data_login = time() . "_" . encode_chat_id($chat_id);
	$data = array(
		"type" => "sign",
		"code" => 200,
		"message" => "连接登录服务器成功",
		"data" => $data_login
	);
	//发送给客户端
	@$server->push($chat_id, json_encode($data));
	echo "分配 -- " . $chat_id . "-- \n";
});

//2. 接收到信息
$server->on('Message', function ($serv, $frame) {
	//全局服务器
});

//3. 关闭数据
$server->on('Close', function ($serv, $fd) {
	
});


//4. 接收HTTP协议 & 发送给所在客户端（来自服务器端）
//login_token,login_time,user_token
$server->on('Request', function ($request, $respone){
	global $server;
	//处理结果
	$result = false;
	//检测信息安全性 & 完整性
	$info = $request->server;
	$get_info = $request->post;
	//检测ip && 密码
	// && ("127.0.0.1" == $info["remote_addr"])
	if(isset($info["remote_addr"]) 
			&& isset($get_info["server_pwd"]) && (APP_CHAT_PWD == $get_info["server_pwd"])
			&& isset($get_info["login_token"]) && isset($get_info["login_time"]) && isset($get_info["user_token"])){
		$chat_id = intval(decode_chat_id(trim($get_info["login_token"])));
		$chat_time = intval($get_info["login_time"]);
		$user_token = trim($get_info["user_token"]);
		$user_info = $get_info["user"];
		
		//发送通知
		echo "发送 -- " . $chat_id . "-- \n";
		
		//发送内容
		$data = array("type" => "refresh");
		//如果超时，提示用户重新刷新页面获取
		if(time()-$chat_time > APP_CHAT_EXPIRE){
			$data["code"] = 501;
			$data["message"] = "登录超时，请重新刷新页面扫码!";
			@$server->push($chat_id, json_encode($data));
		}else{
			$data["code"] = 200;
			$data["message"] = "登录成功!";
			$data["data"] = array("token" => $user_token, "user" => $user_info);
			$result = @$server->push($chat_id, json_encode($data));
		}
	}
	
	//发送命令到当前链接
	$result = $result ? "ok" : "no";
	$respone->end($result);
});

//启动服务
$server->start();

//加密头部id
function encode_chat_id($chat_id){
	return Security::encrypt(base64_encode($chat_id), APP_CHAT_SALT);
}

//解密头部id
function decode_chat_id($chat_id_str){
	return base64_decode(Security::decrypt($chat_id_str, APP_CHAT_SALT));
}