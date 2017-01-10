var View =function(){
	this.device;
	this.data;
	this.title="";
	this.init=function(){
		var com= new Com();
		this.data=com.getParams();
		this.device=this.data["device"];

		if(this.data["title"]){
			this.title=this.data["title"];
			$("#title").html(this.data["title"]);
		}

		if(this.device) {
			$(".mui-bar").remove();
		}
	};

	//读取header文件
	this.header=function(){
		var http=new Http();
		http.getLocalFile("header.html",function(body){

		});
	};

	this.getTitle=function(){
		return this.title;
	};
};


