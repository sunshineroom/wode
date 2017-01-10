var UserStore =function(){
	this.save=function(data){
		var localStorage=window.localStorage;
		var buf=JSON.stringify(data);
		localStorage.setItem("user",buf);
	};

	this.load=function(){
		var localStorage=window.localStorage;
		var json=JSON.parse(localStorage.getItem("user"));
		return json;
	};

	this.token=function(){
		var localStorage=window.localStorage;
		var json=JSON.parse(localStorage.getItem("user"));
		if(json)
			return json.token;
		else
			return '';
	};
	
	this.clear = function () {
		var localStorage=window.localStorage;
		localStorage.removeItem("user");
	};
}