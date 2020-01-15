$(document).ready(function(){
    
    //위도, 경도 검색(타이밍 문제)
    var lat;
    var lon;

    $.ajax({
        url: "https://ipinfo.io/geo",
        dataType: "json",
        success: function(result){
            var loc = result.loc;
            loc = loc.split(",");
            lat = loc[0];
            lon = loc[1];
        }
    });
    
    // 헤더바, 섹션 높이 설정해주기
    function secset(){
        var vh = $(window).outerHeight();
        var vw = $(window).outerWidth();
        var hh = $("#hdbar").outerHeight();
        var mh = $("#mid").outerHeight();
        var bh = $("#bot").outerHeight();
        $("section").height(vh-hh);
        $("#top").height(vh-hh-mh-bh);
        if(vh < vw){
            $("#midbot").css("margin-top",vh-hh-220+"px");
        }else{
            $("#midbot").css("margin-top","0px");
        }
    }
    
    secset();
    
    $(window).resize(function(){
        secset();
    });
    
    //city글자수에 따라 글자크기 지정하기
    function citytxtlen(){
        var len = $("#city").text().length;
        if(len >= 14){
            $("#city").addClass("stxt");
        }else{
            $("#city").removeClass("stxt");
        }
    }
    
    citytxtlen();
    
//    http://api.openweathermap.org/data/2.5/forecast?q=London&mode=json&units=metric&appid=201428e5141dbf69529603692f9614db
    
//    http://api.openweathermap.org/data/2.5/forecast
    //    q=London // 변하는 값
    //    mode=json
    //    units=metric
    //    appid=201428e5141dbf69529603692f9614db
    
    var link = "http://api.openweathermap.org/data/2.5/forecast";
    var myid = "201428e5141dbf69529603692f9614db";
    
    function id2icon(id){
        var icon = "";
        if(id>=200 && id<300){
            icon = "fas fa-bolt";
        }else if(id>=300 && id<400){
            icon = "fas fa-cloud-rain";
        }else if(id>=400 && id<600){
            icon = "fas fa-cloud-showers-heavy";
        }else if(id>=600 && id<700){
            icon = "far fa-snowflake";
        }else if(id>=700 && id<800){
            icon = "fas fa-smog";
        }else if(id==800){
            icon = "fas fa-sun";
        }else if(id==801 || id==802){
            icon = "fas fa-cloud-sun";
        }else if(id==803 || id==804){
            icon = "fas fa-cloud";
        }
        return icon;
    }
    
    // 9----(0)----12----(1)----15----(2)----18----(3)----21----(4)----24(0)----(5)----3----(6)----6----(7)----9
    
    function settime(tz){
        var now = new Date();
        var result;
        now = now.getUTCHours() + tz;
        
        if(now >= 0 && now < 3){
            result = 5;
        }else if(now >= 3 && now < 6){
            result = 6;
        }else if(now >= 6 && now < 9){
            result = 7;
        }else if(now >= 9 && now < 12){
            result = 0;
        }else if(now >= 12 && now < 15){
            result = 1;
        }else if(now >= 15 && now < 18){
            result = 2;
        }else if(now >= 18 && now < 21){
            result = 3;
        }else if(now >= 21 && now < 24){
            result = 4;
        }
        return result;
    }
    
    function suc(result){
        var timezone = result.city.timezone / 3600;
        var listIndex = settime(timezone);
        
//        console.log(result); //완성하고 지워야 함(개발 중일때만 사용)
        
        $("#city").text(result.city.name);
        var wicontxt = id2icon(result.list[listIndex].weather[0].id);
        $("#wicon").removeClass().addClass(wicontxt);
        $("#info").text(result.list[listIndex].weather[0].description);
        var temp = result.list[listIndex].main.temp;
        temp = temp.toFixed(1); //소수점 자르는 함수
        $(".temp").text(temp);
        var deg = result.list[listIndex].wind.deg;
        $("#dir").css("transform", "rotate("+deg+"deg)");
        var speed = result.list[listIndex].wind.speed;
        speed = speed.toFixed(1);
        $("#speed").text(speed);
        $("#hum").text(result.list[listIndex].main.humidity);
        var max = result.list[listIndex].main.temp_max;
        var min = result.list[listIndex].main.temp_min;
        max = max.toFixed(1);
        min = min.toFixed(1);
        $("#max").text(max);
        $("#min").text(min);
        citytxtlen();
        for(i=0; i<5; i++){
            var ftime = new Date(result.list[i*8+2].dt*1000); //초 단위를 밀리초 단위로 바꾸기 위해 1000을 곱한다.
            var fmonth = ftime.getMonth() + 1;
            var fdate = ftime.getDate();
            $(".fdate").eq(i).text(fmonth+"/"+fdate);
            var code = result.list[i*8+2].weather[0].id;
            var icon = id2icon(code);
            $(".forecast").eq(i).children("svg").removeClass().addClass(icon);
            var ftemp = result.list[i*8+2].main.temp;
            ftemp = ftemp.toFixed(1);
            $(".forecast").eq(i).children(".ftemp").text(ftemp);
        }
        var sunset = result.city.sunset * 1000; //초 단위를 밀리초 단위로 바꾸기 위해 1000을 곱한다.
        sunset = new Date(sunset);
        var now = new Date();
        if(now < sunset){
            var nowclass = $("#wicon").attr("class");
            nowclass = nowclass.split(" ");
            nowclass = nowclass[1];
            if(nowclass == "fa-cloud-rain"){
                $("section").css("background-image","url(images/day_rain.jpg)");
            }else if(nowclass == "fa-cloud-showers-heavy"){
                $("section").css("background-image","url(images/day_rain.jpg)");
            }else if(nowclass == "fa-cloud-sun"){
                $("section").css("background-image","url(images/day_cloud.jpg)");
            }else if(nowclass == "fa-cloud"){
                $("section").css("background-image","url(images/day_cloud.jpg)");
            }else if(nowclass == "fa-bolt"){
                $("section").css("background-image","url(images/thunder.jpg)");
            }else if(nowclass == "fa-snowflake"){
                $("section").css("background-image","url(images/snow.jpg)");
            }else if(nowclass == "smog"){
                $("section").css("background-image","url(images/smog.jpg)");
            }else{
                $("section").css("background-image","url(images/day_clear.jpg)");
            }
        }else{
            $("section").css("background-image","url(images/night_clear.jpg)");
        }
    }
    
    function upd(subject){
        var city = $(subject).attr("data");
        if(city != "custom"){
            // 도시명 검색
            $.ajax({
                url: link,
                method: "GET",
                data: {
                    "q": city,
                    "mode": "json",
                    "units": "metric",
                    "appid": myid
                },
                dataType: "json",
                success: suc
            });
        }else{
            // 위도,경도 검색
            
//            var lat;
//            var lon;
//            
//            if(navigator.geolocation){
//                navigator.geolocation.getCurrentPosition(function(position){
//                    lat = position.coords.latitude;
//                    lon = position.coords.longitude;
//                })
//            }
//            https를 사용할 수 있을 때 쓰는 방법
            
            $.ajax({
                url: link,
                method: "GET",
                data: {
                    "lat": lat,
                    "lon": lon,
                    "mode": "json",
                    "units": "metric",
                    "appid": myid
                },
                dataType: "json",
                success: suc
            });
        }
    }
    
    upd($(".citybtn:nth-of-type(2)"));
    
    $(".citybtn").click(function(){
        upd(this);
    });
    
});