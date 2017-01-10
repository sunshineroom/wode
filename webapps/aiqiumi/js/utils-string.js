
var utilsStirng =function(){
	//检测字符串是否为空
	this.emtry = function(string) {
		if (string == null || string == undefined || string == '' || string.length==0) { 
			return true;
		} else{
			return false;
		}
	};

	//检测字符串是否合法,true不合法
	this.valid=function(str){
		if(this.emtry(str)==true) return true;
		var items = new Array("~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "{", "}", "[", "]", "(", ")");
	    items.push(":", ";", "'", "|", "\\\\", "<", ">", "?", "/", "<<", ">>", "||", "//");
	    str = str.toLowerCase();
	    for (var i = 0; i < items.length; i++) {
	        if (str.indexOf(items[i]) >= 0) {
	            return true;
	        }
	    }
	    return false;
	}
}
