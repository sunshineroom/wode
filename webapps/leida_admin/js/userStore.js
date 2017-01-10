var UserStore =function(){
	this.save=function(data){
		console.log(data);
		var localStorage=window.localStorage;
		var buf=JSON.stringify(data);
		localStorage.setItem("user",buf);
	}

	this.load=function(){
		var localStorage=window.localStorage;
		var json=JSON.parse(localStorage.getItem("user"));
		return json;
	}

	this.token=function(){
		var localStorage=window.localStorage;
		var json=JSON.parse(localStorage.getItem("user"));
		if(json && json.token)
			return json.token;
		else
			return "";
	}

}