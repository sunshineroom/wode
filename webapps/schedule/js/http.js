
var Http=function(){
    var userStore=new UserStore();
    var token=userStore.token();
    this.sendRequest=function (url,params,cb) {
        var url=config.http_url+url;
        
        $.ajax({
            //请求类型，这里为POST
            type: 'POST',
            //你要请求的api的URL
            url: url ,
            //是否使用缓存
            cache:false,
            //数据类型，这里我用的是json
            dataType: "json", 
            //必要的时候需要用JSON.stringify() 将JSON对象转换成字符串
            data: params, //data: {key:value}, 
            headers : {'platform':'web','token':token},
            //请求成功的回调函数
            success: function(data){
              var str=data.data; 
              cb(eval('(' + str + ')'));
            },
            //测试
            error: function (jqXHR, textStatus, errThrown) {
                cb({code:500,message:"接口异常",info:""});
            }
        });
    };



    this.getLocalFile=function (path,cb) {
        $.get(path).success(function(content){ 
            console.log(content);
        }); 
    };

    this.uploadFile=function(obj,cb){  
        var url=config.file_url;

        var formData = new FormData(obj);  
        $.ajax({  
          url: url ,  
          type: 'POST',  
          data: formData,  
          dataType: "json", 
          async: false,  
          cache: false,  
          contentType: false,  
          processData: false,  
          success: function (data) {  
              cb(data.path,data.url);  
          },  
           
        }); 
    };
};

