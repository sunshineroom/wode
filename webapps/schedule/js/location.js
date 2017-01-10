
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
    }

    this.getLocation=function (){
        var url="http://api.map.baidu.com/location/ip?coor=bd09ll&output=json&ak="+config.baidu_key+"&callback=geoCallback";
        console.log(url);
        jQuery.getScript(url);
    }

}


