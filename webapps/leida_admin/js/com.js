
var Com =function(){
    this.getParams=function(){
        var thisURL = document.URL; 
        if(thisURL.charAt(thisURL.length - 1)=="#"){
            thisURL=thisURL.substr(0,thisURL.length-1);
        }
           
        var getval =thisURL.split('?')[1];  
        var data={};
        if(getval){
            var vv=getval.split('&');
        
            for(var i=0;i<vv.length;i++){
                var v=vv[i];
                var s=v.split('=');
                data[s[0]]=decodeURI(s[1]);
            }
        }
        
        return data;
    }
    
};
