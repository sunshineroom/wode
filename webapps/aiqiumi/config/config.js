var CONFIG={
	AES_PASSWORD:"wo_qu_ni_da_ye",




	//http url
	GET_TEAM_PLAYER_URL:"/api/v2/teamplayer/getTeamPlayer",
	KICK_PLAYER_URL:"/api/v2/teamplayer/kickPlayer",
	SET_ADMIN_URL:"/api/v2/teamplayer/setAdmin",
	CANCEL_ADMIN_URL:"/api/v2/teamplayer/cancelAdmin",
	CHANGE_CAPTAIN_URL:"/api/v2/teamplayer/changeCaptain",

	GET_TEAM_INFO_URL:"/api/v2/team/getInfo",
	SET_TEAM_INFO_URL:"/api/v2/team/setInfo",
	GET_TEAM_LEVEL_URL:"/api/v2/team/getTeamLevel",

	GET_TEAM_QUESTION_URL:"/api/v2/question/getQuestion",
	SET_TEAM_QUESTION_URL:"/api/v2/question/submitAnswer",

	LEAVE_TEAM_URL:"/api/v1/team/leave",

	SET_TEAM_COLOR_URL:"/api/v2/team/setColorInfo",
	GET_TEAM_COLOR_URL:"/api/v2/team/getColorInfo",

	SET_PLAYER_NUMBER_URL:"/api/v2/teamplayer/setPlayerNumber",
	GET_PLAYER_NUMBER_URL:"/api/v2/teamplayer/getPlayerNumber",

	//发送动态
	SEND_BLOG_URL:"/api/v2/feeds/addOne",
	GET_BLOG_URL:"/api/v2/Feeds/getDetail",
	GET_BLOG_COMMENTS_URL:"/api/v2/feeds/getCommentList",
	BLOG_ZAN_URL :"/api/v1/zan/feeds",
	BLOG_COMMENTS:"/api/v2/feeds/feedsCommentSubmit",
	//删除动态
	BLOG_DELETE:"/api/v2/feeds/deletefeedsComment",

	//荣誉
	GET_HONOR_LOGO_URL:"/api/v2/teamhonor/getHonorLogo",
	GET_HONOR_URL:"/api/v2/teamhonor/getHonor",
	SET_HONOR_URL:"/api/v2/teamhonor/setHonor",

	//个人荣誉
	GET_HONOR_SINGLE_LOGO_URL:"/api/v2/teamhonor/getSingleHonorLogo",
	GET_HONOR_SINGLE_URL:"/api/v2/teamhonor/getSingleHonor",
	SET_HONOR_SINGLE_URL:"/api/v2/teamhonor/setSingleHonor",

	DEL_HONOR:"/api/v2/teamhonor/deleteHonor",
	
	//百度搜索
	SET_BAIDU_LOCATION_SEARCH_URL:"http://api.map.baidu.com/place/v2/search",
	SET_BAIDU_LOCATION_SEARCH_KEY:"BQ7cin9hfrke1U7Dmaebc3pmP2PRap9v",

	SEARCH_TEAM_INFO_URL:"/api/v1/team/searchTeam",


	//日程
	SCHEDULE_ADD_MATCH_URL:"/api/v1/teamevent/addMatch",
	SCHEDULE_ADD_ACTIVE_URL:"/api/v1/teamevent/addActive",

	SCHEDULE_EDIT_MATCH_URL:"/api/v1/teamevent/editMatch",
	SCHEDULE_EDIT_ACTIVE_URL:"/api/v1/teamevent/editActive",
	
	SCHEDULE_SCHEDULE_DETAIL:"/api/v1/teamevent/getEventByID",

	//日程列表
	SCHEDULE_TEAM_SCHEDULE_NOW:		"/api/v1/teamevent/getEventByNow",
	SCHEDULE_TEAM_SCHEDULE_HISTORY: "/api/v1/teamevent/getEventByHistory",

	SCHEDULE_TEAM_JOINEVENT:"/api/v1/teamevent/joinEvent",

	SCHEDULE_TEAM_MATCH_EVENT:"/api/v1/teamevent/getMatchEventByID",
	SCHEDULE_TEAM_SET_MATCH_RESULT:"/api/v1/teamevent/addMatchResult",

	SCHEDULE_TEAM_EVENT_PLAYER:"/api/v1/teamevent/getTeamEventPlayer",

	SCHEDULE_TEAM_ADD_MATCH_EVENT:"/api/v1/teamevent/addMatchEvent",

	SCHEDULE_TEAM_DELETE_MATCH:"/api/v1/teamevent/deleteMatch",

	SCHEDULE_TEAM_DELETE_ACTIVE:"/api/v1/teamevent/deleteActive",

	
	GET_WX_SHARE:"/api/v1/system/getWxShare",

	IS_CAPTAIN_ADMIN:"/api/v2/system/isAdminCaptain"

};
