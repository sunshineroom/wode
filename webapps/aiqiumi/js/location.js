var FLocation =function(){
    var longitude;
    var latitudel;

    var city;
    var city_code;

    this.setInfo=function(longitude,latitudel,city,city_code){
         this.longitude=longitude;
         this.latitudel=latitudel;
         this.city=city;
         this.city_code=city_code;
    };
    var self = this;
    this.getLocation=function (cb){
        var url="http://api.map.baidu.com/location/ip?coor=bd09ll&output=json&ak="+CONFIG.SET_BAIDU_LOCATION_SEARCH_KEY;
        $.getJSON(url+"&callback=?",function(info) {
            info=info.content;
            console.log(info);
            self.setInfo(info.point.x,info.point.y,info.address_detail.city,info.address_detail.city_code);
            cb(self);
        });
    }

    this.searchPlace = function(placeName, callBack){
        var url="http://api.map.baidu.com/place/v2/search?q="+placeName+"&region="+this.city+"&output=json&ak="+CONFIG.SET_BAIDU_LOCATION_SEARCH_KEY;
        $.getJSON(url+"&callback=?",function(info) {
            console.log(info);
            callBack(info.status, info.message, info.results);
        });
    }
};




