/**

 * 配置信息

 */

var defaultKeyLabel = "您申请的key";

// 默认演示密钥

var defaultKey = "ec85d3648154874552835438ac6a02b2";

var host = location.hostname ;

var port = 25001;

var httpurl = "http://"+ host+ ":"+port;

//var webApiUrl = httpurl + "/as/webapi/js/auth?v=1.0&t=jsmap&ak="+defaultKey;

var webApiUrl = "http://114.215.146.210:25001/as/webapi/js/auth?v=1.0&t=jsmap&ak="+defaultKey;

var ROOTPath = location.origin + location.pathname ;



var defaultCenterCfg={

	centerX :"LBS.centerX",

	centerY :"LBS.centerY",

	centerZoom :"LBS.zoom"

}

window["LBS"] ={

      centerX:116.484101,

      centerY:39.989996,

      zoom:14,
      
};

var SIGN = '9b600f65216fdeafa745912f95327c33';

var ROADCOLORS = [
	"#ff0000",
	"#2828ff",
	"#ff60af",
	"#28ff28",
	"#ff8f59",
	"#b9b973",
	"#808040",
	"#796400",
	"#7afec6",
	"#9f0050"
];

/**
 * 桥梁、隧道颜色
 */
var ROADLINKEDCOLORS = [
	"#8E388E",
	"#CD6839",
	"#ADFF2F",
	"#8B008B",
	"#8B2252"
];


/**
 * 红绿灯交叉口颜色
 */
var RELATIONCOLORS = [
	"#AEEEEE",
	"#00CD00",
	"#5CACEE",
	"#FF34B3",
	"#A3A3A3",
	"#969696"
];

/**
 * 道路等级名称
 */
var ROADNAME = [
	"高速路",
	"城市快速路",
	"国道",
	"主要道路",
	"省道",
	"次要道路",
	"普通道路",
	"县道",
	"乡公路",
	"县乡村内部道路"
	
];


var ROADDIRECTIONNAME = [
	"双向通行",
	"进口",
	"出口",
	"禁止通行"
];

var DIRANGLENAME = [
	"北",
	"东北",
	"东",
	"东南",
	"南",
	"西南",
	"西",
	"西北"
];

var ROADSTATECOLORMap = {
	0: {text:"未知",color:"#34B000"},
	1: {text:"畅通",color:"#61b250"},
	2: {text:"缓行",color:"#f2ae00"},
	3: {text:"拥堵",color:"#DF0100"},
	4: {text:"严重拥堵",color:"#8E0E0B"},
	5: {text:"无交通",color:"#34B000"}
};
var ROADSTATECOLOR =[
	"#34B000",
	"#61b250",
	"#f2ae00",
	"#DF0100",
	"#8E0E0B",
	"#34B000"
];  





var demoHash = [ "core/map", "core/control", "core/mapstate", "core/changemap", "core/mapto", "core/getmapzoom", "layer/customlayer", "layer/trafficeLayers",

                 "point/iconmarker", "point/vectormarker", "point/markers", "point/removespecifiedmarker", "point/trackplayback", 

                 "point/cluster", "point/heatmap", "point/mass","point/zhuhai", "vector/vector", "vector/visible", "vector/editable", "vector/vectorlabel", 

                 "vector/getinformation", "infowindow/infowindow", "infowindow/custominfowindow", "contextmenu/contextmenu",

                 "contextmenu/customcontextmenu", "contextmenu/overlaycontextmenu", 

                 "calculation/calculation", "mouseMap/getlnglat",

                 "mouseMap/drawoverlay", "mouseMap/zoomtool", "mouseMap/measure", "panorama/panoramaControl", "event/mapclick", "event/overlayevent", 

                 "event/removemapclick", "server/searchkey","layer/tianjin","layer/jiangxi",  "layer/ningbo22","layer/yancheng22","layer/lps22","layer/guiyang22","server/nearsearch", "server/rectsearch","server/suggest", "boundary/roadinfo", 

                 "geocode/geocode", "geocode/regeocode", "driver/driverforlnglat", "walking/walkingforlnglat", "bus/busnavi", 

                 "boundary/boundary","bus/busInfoByName","roadlevel/roadlevel" ,"roadlevel/searchreal"];

var defaultHtmlHash = "#core/map";//默认示例url hash

//主页面不加载引擎

if(window.location.pathname.lastIndexOf(".htm") != -1){

	document.write('<script src="'+webApiUrl+'"></script>');

	window.Konsole = {

			exec: function(code) {

				code = code || '';

				try {

					var result = window.eval(code);

					window.parent.setIFrameResult('result', result);

				} catch (e) {

					window.parent.setIFrameResult('error', e);

				}

			}

		}

}



//控制台日志 用于调试等

window.log = function(msg, type) {

      window.console && (console[type || (type = "log")]) && console[type](msg);

}



//替换示例demo里的场景外链  关联hsDemo.js-->runScripts()

window.replaceIFramerContentLink = function(iframeHead){

	//iframeHead = iframeHead.replace("../sourceLinks/style.css", "./apidemos/sourceLinks/style.css");

	

	return iframeHead;

}




var addRoadDirection = function(lnglatarr,direction,relation){
	var len = lnglatarr.length;
	var end,up,route; //左后2个点确认方向
	
	end = lnglatarr[len-1];
	up= lnglatarr[len-2];
	route = getAngle(up,end);
	route = 360-route +90 ;
	
	if(direction == "3"){
		route = route+180;
		end = lnglatarr[0];
		up= lnglatarr[1];
	}
	
	var opts = new IMAP.MarkerOptions();
	opts.icon = new IMAP.Icon("http://114.215.146.210:36089/MapDemo/img/user_path_arrow.png", {
		"size": new IMAP.Size(20, 20)
	});
	var lnglat=up;
	var marks = new IMAP.Marker(lnglat, opts);
	map.getOverlayLayer().addOverlay(marks, false);
	marks.rotate(route);
	var elements = marks.getElement();
	if(elements){
		var zIndex = 10;
		elements.style.zIndex = zIndex;
		elements.style.marginLeft =  -10 + "px";
		elements.style.marginTop  =  -10 + "px";
	}
	cacheSearchReal.push(marks);
}

var getAngle = function (xy1, xy2) {
	if(!xy1 || !xy2){
		return 0;
	} 
  	var x1=  Math.abs(xy1["lat"]),y1=  Math.abs(xy1["lng"]);
	var x2=  Math.abs(xy2["lat"]),y2=  Math.abs(xy2["lng"]);
    var x = Math.abs(x1-x2);
	var y = Math.abs(y1-y2);
	var z = Math.sqrt(x*x+y*y);
	z = z ==0 ? 1 : z;
	var rotat = Math.round( 180 / (Math.PI / Math.acos(y/z)));
	if (x2>= x1 && y2 >= y1) {// 第一象限
	    rotat = rotat;
	}else if (x2 >= x1 && y2 <= y1) {// 
	    rotat = 180 - rotat;
	} else if (x2 <= x1 && y2 <= y1) {// 
	    rotat = 180 + rotat;
	} else if(x2 <= x1 && y2 >= y1){// 
	    rotat = 360 - rotat;
	}
	return rotat; //真实的角度
}


