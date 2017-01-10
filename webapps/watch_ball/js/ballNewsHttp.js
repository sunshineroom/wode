var BallNewsHttp =function(){
    this.getNewsDetail=function (id,cb){
        var http=new Http();
        http.sendRequest("/footballnews/newsdetail",{id:id},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    this.addZan=function (id,cb){
        var http=new Http();
        http.sendRequest("/footballnews/addzan",{id:id},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    this.cancelZan=function (id,cb){
        var http=new Http();
        http.sendRequest("/footballnews/cancelzan",{id:id},function(data){
            cb(data.code,data.message,data.info);
        });
    };

    this.postComment = function (id, content, target_comment_id, cb) {
        var http  = new Http();
        http.sendRequest("/comment/mNewsSubmit",{m_news_id:id, content:content, comment_id:target_comment_id}, function (data) {
           cb(data.code, data.message, data.info);
        });
    };

    this.getCommentList = function (id,page,cb) {
        var http  = new Http();
        http.sendRequest("/comment/mNewsList ",{m_news_id:id,page:page }, function (data) {
            cb(data.code, data.message, data.info);
        });
    };
    
    this.deleteComment = function (id, cb) {
        var http  = new Http();
        http.sendRequest("/comment/deleteMNews",{m_news_id:id}, function (data) {
            cb(data.code, data.message, data.info);
        });
    }
};
