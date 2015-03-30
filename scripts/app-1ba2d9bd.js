"use strict";angular.module("departementales2015",["ngAnimate","ngTouch","ngSanitize","ui.router","ui.bootstrap","leaflet-directive"]).config(["$stateProvider","$urlRouterProvider",function(e,t){e.state("home",{url:"/",templateUrl:"app/main/main.html",controller:"MainCtrl"}).state("home.france",{url:"france?t",templateUrl:"app/main/france/france.html",controller:"FranceCtrl",reloadOnSearch:!0,resolve:{chartData:FranceCtrl.resolve.chartData,geojson:FranceCtrl.resolve.geojson,mapData:FranceCtrl.resolve.mapData}}).state("home.dpt",{url:"france/:dpt?t",templateUrl:"app/main/dpt/dpt.html",controller:"DptCtrl",reloadOnSearch:!0,resolve:{chartData:DptCtrl.resolve.chartData,geojson:DptCtrl.resolve.geojson,mapData:DptCtrl.resolve.mapData}}).state("home.canton",{url:"france/:dpt/:canton?t&ll",templateUrl:"app/main/canton/canton.html",controller:"CantonCtrl",reloadOnSearch:!0,resolve:{chartData:CantonCtrl.resolve.chartData,geojson:CantonCtrl.resolve.geojson,mapData:CantonCtrl.resolve.mapData}}),t.otherwise("france")}]).run(["$rootScope","$window","Loader","$state","$location",function(e,t,a,n,r){var o=1,s=function(e){null!=e.t?o=parseInt(e.t):null!=t.localStorage.getItem("t")&&(o=parseInt(t.localStorage.getItem("t"))),t.localStorage.setItem("t",o)};e.$on("$stateChangeStart",function(e,t,n){s(n),a.increment()}),e.$on("$stateChangeError",function(t,r,o){if(a.decrement(),"home.canton"===r.name){var s=o.t||e.getT();2===s&&(o.t=1,n.go("home.canton",o))}}),e.$on("$stateChangeSuccess",function(e,n,o){s(o),a.decrement(),null!=t.ga&&t.ga("send","pageview",{page:r.url()})}),e.getT=function(){return o}}]),angular.module("departementales2015").directive("france",["$timeout",function(e){return{restrict:"A",link:function(t,a){var n=function(){var e=$(window).height();e-=$(a).offset().top,e-=$(".enteryouraddress").outerHeight(),$(a).css("min-height",e)};$(window).on("resize",n),e(n,1e3),n()}}}]);var FranceCtrl=function(e,t,a,n,r){e.t=t.getT(),e.mapData=r,e.geojson=n.departements,e.geojson971=n[971],e.center971=[16.17,-61.52,7],e.geojson974=n[974],e.center974=[-21.11,55.53,7],e.geojson976=n[976],e.center976=[-12.85,45.16,8],null!=a&&(e.data=computeChartData(a),e.config={yLabel:"% de voix exprimées",ns:"chart1"},e.chartTitle="Par parti, sur la base des résultats publiés - ",e.chartTitle+=1==t.getT()?"1er tour":"2nd tour")};FranceCtrl.resolve={chartData:["$http","$rootScope",function(e,t){var a=t.getT();return 3>a?e.get("assets/json/results/T"+a+"/FE.json").then(function(e){return e.data}):void 0}],geojson:["$q","$http",function(e,t){return e.all({departements:t.get("assets/json/geo/departements.geojson").then(function(e){return e.data}),971:t.get("assets/json/geo/971_dpt.geojson").then(function(e){return e.data}),974:t.get("assets/json/geo/974_dpt.geojson").then(function(e){return e.data}),976:t.get("assets/json/geo/976_dpt.geojson").then(function(e){return e.data})})}],mapData:["$http","$rootScope",function(e,t){var a=t.getT();return e.get("assets/json/results/T"+a+"/FEMAP.json").then(function(e){return e.data})}]},angular.module("departementales2015").controller("FranceCtrl",["$scope","$rootScope","chartData","geojson","mapData",FranceCtrl]);var DptCtrl=function(e,t,a,n,r,o,s,l){var i=t.getT();e.t=i,l.increment(),e.dpt={code:a.dpt,name:getDptNameFromDptCode(a.dpt)},3>i&&(e.lastUpdate=formatLastUpdate(r.dpt.lastUpdateDateTime)),e.mapData=s,e.geojson=o,n.getMap("m_mapdpt").then(function(t){for(var a=L.polygon(o.features[0].geometry.coordinates[0]).getBounds(),n=1;n<o.features.length;++n){var r=L.polygon(o.features[n].geometry.coordinates[0]).getBounds();r._northEast.lat>a._northEast.lat&&(a._northEast.lat=r._northEast.lat),r._northEast.lng>a._northEast.lng&&(a._northEast.lng=r._northEast.lng),r._southWest.lat<a._southWest.lat&&(a._southWest.lat=r._southWest.lat),r._southWest.lng<a._southWest.lng&&(a._southWest.lng=r._southWest.lng)}var s=a.getCenter();e.center=[s.lng,s.lat,t.getBoundsZoom(a)],l.decrement()}),3>i?(e.dataDpt=computeChartData(r.dpt.results),e.configDpt={yLabel:"% de voix exprimées",ns:"chartDpt",linkedChartNs:"chartFE"},e.titleDpt="Résultats par parti - ",e.dataFE=computeChartDataAs(r.FE,e.dataDpt),e.configFE={yLabel:"% de voix exprimées",ns:"chartFE",linkedChartNs:"chartDpt"},e.titleFE="Par parti, sur la base des résultats publiés - ",1==i?(e.titleDpt+="1er tour",e.titleFE+="1er tour"):(e.titleDpt+="2nd tour",e.titleFE+="2nd tour")):(e.dataDpt=computeT3Data(r.dpt),e.configDpt={yLabel:"Nombre de sièges",ns:"chartDpt"},e.titleDpt="Nombre de sièges obtenus par parti")};DptCtrl.resolve={chartData:["$http","$stateParams","$q","$rootScope",function(e,t,a,n){var r=n.getT(),o=t.dpt.length>2?t.dpt:"0"+t.dpt;return a.all({dpt:e.get("assets/json/results/T"+r+"/"+o+".json").then(function(e){return e.data}),FE:3>r?e.get("assets/json/results/T"+r+"/FE.json").then(function(e){return e.data}):void 0})}],geojson:["$http","$stateParams",function(e,t){var a=t.dpt;return[971,974,976].indexOf(parseInt(a))>=0?e.get("assets/json/geo/"+a+".geojson").then(function(e){return e.data}):e.get("assets/json/geo/cantons.geojson").then(function(e){for(var t=[],n=0;n<e.data.features.length;++n)e.data.features[n].properties.code_dep===a&&t.push(e.data.features[n]);return e.data.features=t,e.data})}],mapData:["$http","$stateParams","$rootScope","$q",function(e,t,a,n){var r=a.getT(),o=t.dpt.length>2?t.dpt:"0"+t.dpt;return 1===r||3===r?e.get("assets/json/results/T"+r+"/"+o+"/MAP.json").then(function(e){return e.data}):n.all([e.get("assets/json/results/T2/"+o+"/MAP.json").then(function(e){return e.data}),e.get("assets/json/results/T1/"+o+"/MAP.json").then(function(e){return e.data})])}]},angular.module("departementales2015").controller("DptCtrl",["$scope","$rootScope","$stateParams","leafletData","chartData","geojson","mapData","Loader",DptCtrl]);var CantonCtrl=function(e,t,a,n,r,o,s,l){l.increment(),e.t=t.getT(),e.dpt={code:a.dpt,name:getDptNameFromDptCode(a.dpt)},e.canton={code:a.canton,name:""},e.t<3&&(e.lastUpdate=formatLastUpdate(r.dpt.lastUpdateDateTime)),e.mapData=s,e.geojson=o;for(var i=0;i<o.features.length;++i){var c=L.multiPolygon(o.features[i].geometry.coordinates);if(o.features[i].properties.num_canton===parseInt(a.canton)){n.getMap("m_mapcanton").then(function(t){var a=c.getBounds();a._northEast.lng-a._southWest.lng>.07&&(a._northEast.lng+=.7,a._southWest.lng-=.7);var n=t.getBoundsZoom(a);e.center=[a.getCenter().lng,a.getCenter().lat,n],l.decrement()}),e.canton.name=o.features[i].properties.nom,e.titleCan="Résultats par parti - ",e.titleFE="Par parti, sur la base des résultats publiés - ",1==t.getT()?(e.titleCan+="1er tour",e.titleFE+="1er tour"):(e.titleCan+="2nd tour",e.titleFE+="2nd tour");break}}e.dataCan=computeChartData(r.canton),e.dataCanH=_.remove(_.take(_.cloneDeep(e.dataCan),5),function(e){return e.value>0}),e.dataCanH=_.remove(e.dataCanH,function(e){return null!=e.nombre}),e.t<3&&(e.configCan={yLabel:"% de voix exprimées",ns:"chartDpt",linkedChartNs:"chartFE"},e.dataFE=computeChartDataAs(r.FE,e.dataCan),e.configFE={yLabel:"% de voix exprimées",ns:"chartFE",linkedChartNs:"chartDpt"}),null!=a.ll&&(e.mapMarker={lat:parseFloat(a.ll.split(";")[1]),lng:parseFloat(a.ll.split(";")[0])})};CantonCtrl.resolve={chartData:["$http","$stateParams","$q","$rootScope",function(e,t,a,n){var r=n.getT(),o=t.dpt.length>2?t.dpt:"0"+t.dpt,s=t.canton.length>1?t.canton:"0"+t.canton;if(3>r)return a.all({canton:e.get("assets/json/results/T"+r+"/"+o+"/"+s+".json").then(function(e){return e.data}),FE:e.get("assets/json/results/T"+r+"/FE.json").then(function(e){return e.data}),dpt:e.get("assets/json/results/T"+r+"/"+o+".json").then(function(e){return e.data})});var l=a.defer();return e.get("assets/json/results/T3/"+o+"/MAP.json").then(function(t){e.get("assets/json/results/T"+t.data[s][0]+"/"+o+"/"+s+".json").then(function(e){l.resolve({canton:e.data})})}),l.promise}],geojson:["$http","$stateParams",function(e,t){return[971,974,976].indexOf(parseInt(t.dpt))>=0?e.get("assets/json/geo/"+t.dpt+".geojson").then(function(e){e=e.data;for(var a=0;a<e.features.length;++a)e.features[a].properties.code_dep=t.dpt,e.features[a].properties.num_canton=parseInt(e.features[a].properties.num_canton);return e}):e.get("assets/json/geo/cantons.geojson").then(function(e){for(var a=[],n=0;n<e.data.features.length;++n){var r=e.data.features[n];r.properties.code_dep===t.dpt&&a.push(r)}return e.data.features=a,e.data})}],mapData:["$http","$stateParams","$rootScope","$q",function(e,t,a,n){var r=a.getT(),o=t.dpt.length>2?t.dpt:"0"+t.dpt;return 1===r||3===r?e.get("assets/json/results/T"+r+"/"+o+"/MAP.json").then(function(e){return e.data}):n.all([e.get("assets/json/results/T2/"+o+"/MAP.json").then(function(e){return e.data}),e.get("assets/json/results/T1/"+o+"/MAP.json").then(function(e){return e.data})])}]},angular.module("departementales2015").controller("CantonCtrl",["$scope","$rootScope","$stateParams","leafletData","chartData","geojson","mapData","Loader",CantonCtrl]),angular.module("departementales2015").controller("NavbarCtrl",["$scope","$rootScope","$state","$stateParams","$http",function(e,t,a,n,r){e.isT2=!1;var o=function(){e.isT2=!1;var t="assets/json/results/T2/";if(a.is("home.france"))t+="FE_exists.json";else if(a.is("home.dpt")){var o=n.dpt.length>2?n.dpt:"0"+n.dpt;t+=o+"_exists.json"}else if(a.is("home.canton")){var o=n.dpt.length>2?n.dpt:"0"+n.dpt,s=n.canton.length>1?n.canton:"0"+n.canton;t+=o+"/"+s+"_exists.json"}r.get(t).then(function(){e.isT2=!0},function(){e.isT2=!1})};e.getT=function(){return t.getT()},e.goToT=function(t){(2!=t||e.isT2)&&(1==t||2==t||3==t)&&(e.t=t,a.go(".",{t:t}))},e.$on("$stateChangeSuccess",function(){o()}),o()}]),angular.module("departementales2015").directive("map",["$state","$stateParams","leafletData","$rootScope",function(e,t,a,n){return{restrict:"EA",scope:{data:"=data",geo:"=geo",centerLonLat:"=centerLonLat",marker:"=marker",hasLegend:"=hasLegend"},templateUrl:"components/map/map.html",compile:function(){return{pre:function(a,r,o){var s=n.getT(),l=void 0;2===s&&a.data instanceof Array&&(l=a.data[1],a.data=a.data[0]),null!=o.id&&(a.mapid="m_"+o.id),a.getCodeFromData=function(t){if(e.is("home.france"))return t.code;var a=String(t.num_canton);return a.length<2&&(a="0"+a),a},a.center=null!=a.centerLonLat?{lat:a.centerLonLat[0],lng:a.centerLonLat[1],zoom:a.centerLonLat[2]||8}:{lat:46.5,lng:3.5,zoom:"home.france"===e.current.name?5:8},a.defaults={zoomControl:!1,keyboard:!1,dragging:!1,attributionControl:null==a.hasLegend||a.hasLegend===!0,scrollWheelZoom:!1,doubleClickZoom:!1},a.tiles={url:"http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",type:"sxyz",options:{opacity:1,detectRetina:!0,reuseTiles:!0,attribution:'&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'}},a.legend=null==a.hasLegend||a.hasLegend===!0?{position:"bottomleft",colors:[],labels:[]}:!1,a.events={map:{enable:["click","mousemove"],logic:"emit"}},a.geojson={data:a.geo,style:{weight:1,color:"#000"},onEachFeature:function(){var n=function(e,t){if(a.legend&&!_.contains(a.legend.colors,e)){var n=_.cloneDeep(a.legend);n.colors.push(e),n.labels.push(t),a.legend=n}};return function(r,o){var i="#fff";if(_.has(a.data,a.getCodeFromData(r.properties))){var c=a.data[a.getCodeFromData(r.properties)];if(null!=c)if(s>=3){if(c[0]instanceof Array)if(c.length>1){var d=r.properties.nom+"<br />Égalité : ";for(var p in c)c.hasOwnProperty(p)&&(d+=(0!=p?", ":"")+getLabelFromNuance(c[p][0]));o.bindLabel(d+" ("+c[0][1]+" sièges)")}else c=c[0],o.bindLabel(r.properties.nom+"<br />"+getLabelFromNuance(c[0])+" : "+formatValue(c[1])+" sièges"),i=getColorFromNuance(c[0]),n(i,getLabelFromNuance(c[0]));else o.bindLabel(r.properties.nom+"<br />"+getLabelFromNuance(c[1])),i=getColorFromNuance(c[1]),n(i,getLabelFromNuance(c[1]));o.on("click",a.click)}else o.bindLabel(r.properties.nom+"<br />"+getLabelFromNuance(c[0])+" : "+formatValue(c[1])+"%"),i=getColorFromNuance(c[0]),n(i,getLabelFromNuance(c[0])),o.on("click",a.click);else i="#999",n(i,"Non disponible")}else if(null!=l&&_.has(l,a.getCodeFromData(r.properties))){var c=l[a.getCodeFromData(r.properties)];c[1]>50&&o.bindLabel(r.properties.nom+"<br />"+getLabelFromNuance(c[0])+" : "+formatValue(c[1])+"%"),o.on("click",a.click),n("#fff","Parti élu au 1er tour")}o.setStyle({fillColor:i,fillOpacity:.8}),e.is("home.canton")&&parseInt(t.canton)==parseInt(a.getCodeFromData(r.properties))&&o.setStyle({weight:2,opacity:1})}}()},a.markers={},null!=a.marker&&(a.markers.address={lat:a.marker.lat,lng:a.marker.lng,draggable:!1,focus:!1,"class":"address"})},post:function(n,r,o){var s=null!=o.id?"m_"+o.id:void 0;a.getMap(s).then(function(a){if(a.boxZoom.disable(),null!=a.attributionControl&&(a.removeControl(a.attributionControl),a.addControl(L.control.attribution({position:"bottomleft"}))),!e.is("home.france")){var n=getPref(t.dpt),r=L.marker([n.coord[0],n.coord[1]],{draggable:!1,focus:!1,icon:L.icon({iconUrl:"assets/map-marker.svg",iconSize:[26,20],iconAnchor:[13,10]}),clickable:!1});r.bindLabel(n.name,{noHide:!0,className:"pref-marker",offset:[-5+n.name.length/2*-6,-30]}),r.addTo(a)}}),n.click=function(a){e.is("home.france")?e.go("home.dpt",{dpt:a.target.feature.properties.code}):e.go("home.canton",{dpt:t.dpt,canton:a.target.feature.properties.num_canton})},n.$watch("centerLonLat",function(e){null!=e&&(n.center={lat:n.centerLonLat[0],lng:n.centerLonLat[1],zoom:n.centerLonLat[2]||8})},!0)}}}}}]),angular.module("departementales2015").factory("Loader",[function(){function e(){this.body=angular.element("body"),this.body.append($("<div>").attr("class","progress-container").append($("<div>").attr("class","progress-container__spinner"))),this.progress=angular.element(".progress-container"),this.n=0,this.increment=function(){++this.n,this.showLoaderIfNeeded()},this.decrement=function(){this.n>0&&(--this.n,this.showLoaderIfNeeded())},this.showLoaderIfNeeded=function(){this.progress.toggleClass("progress-container--active",this.n>0),this.body.toggleClass("body--progress-active",this.n>0)}}return new e}]);var getUpperLimit=function(e){for(var t=parseInt(d3.max(e,function(e){return e.value}));t%10;)++t;return t};angular.module("departementales2015").directive("hbarchart",["$rootScope",function(){return{scope:{data:"=data"},link:function(e,t){var a,n,r,o,s,l={top:10,right:150,bottom:10,left:20},i=100;n=$(t).width()-(l.left+l.right),r=e.data.length*i-(l.top+l.bottom),a=d3.select(t[0]).append("svg").attr("width",n+(l.left+l.right)).attr("height",r+(l.top+l.bottom)).append("g").attr("transform","translate("+l.left+", "+l.top+")"),o=d3.scale.linear().range([0,n]),o.domain([0,getUpperLimit(e.data)]),s=d3.scale.ordinal().rangeBands([0,r],.3);for(var c=[],d=0;d<e.data.length;++d)c.push({label:"Pre "+e.data[d].label}),c.push({label:e.data[d].label});s.domain(c.map(function(e){return e.label})),a.selectAll(".bar").data(e.data).enter().append("rect").attr("x",0).attr("y",function(e){return s(e.label)}).attr("height",s.rangeBand()).attr("width",function(e){return o(e.value)}).attr("class",function(e,t){return"bar bar-"+String(t)+" "+e.color});for(var d=0;d<e.data.length;++d){var p=e.data[d],u=a.append("text");u.attr("x",0).attr("y",s("Pre "+p.label)+s.rangeBand()/2),u.append("tspan").attr("class","group").text(p.label),u.append("tspan").attr("class","candidats").text(p.nom).attr("dy",20).attr("x",0),u=a.append("text"),u.attr("x",n).attr("y",s(p.label)),u.append("tspan").attr("class","perc").text(formatValue(p.value)+"%"),null!=p.nombre&&u.append("tspan").attr("class","votes").text(p.nombre+" voix").attr("dy",20).attr("x",n)}}}}]),angular.module("departementales2015").controller("FooterCtrl",["$scope","$rootScope","$location",function(e,t,a){e.selectedT=t.getT(),e.baseUrl=a.absUrl().split("?")[0],e.getShareUrl=function(){return e.baseUrl+"?t="+e.selectedT},e.getIframeElement=function(){return'<iframe src="'+a.absUrl()+'" width="100%" height="780" frameborder="0" allowfullscreen></iframe>'},e.$watch(function(){return t.getT()},function(){e.selectedT=t.getT()},!0)}]),angular.module("departementales2015").controller("EnterYourAddressCtrl",["$scope","$http","$state","Loader",function(e,t,a,n){var r,o="http://nominatim.openstreetmap.org/search.php";e.error=void 0,e.onSubmit=function(){e.error=void 0,n.increment(),t.get(o,{params:{format:"json",q:e.address}}).then(function(s){if(n.decrement(),200===s.status&&s.data.length>0){var l=void 0,i=L.latLng(s.data[0].lon,s.data[0].lat),c=leafletPip.pointInLayer([i.lat,i.lng],L.geoJson(r),!0);c.length>0&&(l=c[0].feature),null!=l?(t.get(o,{params:{format:"json",q:s.data[0].lat+","+s.data[0].lon,addressdetails:1}}).then(function(t){if(200===t.status&&t.data.length>0){var a=t.data[0].address;a.house_number=a.house_number||"",a.town=a.town||a.city||"",a.footway=a.footway||a.road||a.pedestrian||"",a.postcode=a.postcode.split(";")[0],e.address=a.house_number+" "+a.footway+", "+a.postcode+" "+a.town+", "+a.state}}),a.go("home.canton",{dpt:l.properties.code_dep,canton:l.properties.num_canton,ll:i.lat+";"+i.lng})):e.error="Cette adresse n'est pas concernée par les élections."}else e.error="Adresse invalide."})},t.get("assets/json/geo/cantons.geojson").then(function(e){r=e.data})}]);var getUpperLimit=function(e){for(var t=parseInt(d3.max(e,function(e){return e.value}));t%10;)++t;return t};angular.module("departementales2015").directive("barchart",["$rootScope",function(e){return{scope:{config:"=config",data:"=data",title:"=title"},link:function(t,a){var n,r,o,s,l,i,c,d,p,u={top:40,right:0,bottom:90,left:50},m=t.config.ns||"chart",g=t.config.linkedChartNs;r=$(a).width()-(u.left+u.right),o=$(a).height()-(u.top+u.bottom),p=d3.select(a[0]).append("div").classed({chart__tooltip:!0,tooltip:!0}),p.append("div").attr("class","tooltip-arrow"),p.append("div").attr("class","tooltip-inner").text("test");var f=function(e,t,a){p.attr("rel",a);var n=!1;if(parseFloat(e.attr("x"))<r/2)p.classed({left:!1,right:!0}),p.style("left",u.left+parseFloat(e.attr("x"))+parseFloat(e.attr("width"))+"px");else{var n=!0;p.classed({left:!0,right:!1}),p.style("left","0px")}p.style({top:u.top+parseFloat(e.attr("y"))-$(p[0]).height()/2+"px",opacity:1}),null!=t.tooltip?p.select(".tooltip-inner").html(t.tooltip):p.select(".tooltip-inner").text(t.label+" : "+formatValue(t.value)+"%"),n&&p.style("left",u.left+parseFloat(e.attr("x"))-$(p[0]).width()-10+"px")},h=function(e){p.attr("rel")==e&&p.style("opacity",0)};n=d3.select(a[0]).append("svg").attr("width",r+(u.left+u.right)).attr("height",o+(u.top+u.bottom)).append("g").attr("transform","translate("+u.left+", "+u.top+")"),s=d3.scale.ordinal().rangeBands([0,r],.2),s.domain(t.data.map(function(e){return e.label})),l=d3.scale.linear().range([o,0]),l.domain([0,getUpperLimit(t.data)]),i=d3.svg.axis().scale(s).orient("bottom"),c=d3.svg.axis().scale(l).orient("left").ticks(getUpperLimit(t.data)/10),n.append("g").attr("class","x axis").attr("transform","translate(0, "+o+")").call(i),d=n.append("g").attr("class","y axis").call(c),null!=t.config.yLabel&&d.append("text").attr("transform","rotate(-90)").attr("y",-5).attr("dy",".71em").style("text-anchor","end").text(t.config.yLabel),n.selectAll(".bar").data(t.data).enter().append("rect").attr("x",function(e){return s(e.label)}).attr("y",function(e){return l(e.value)}).attr("height",function(e){return o-l(e.value)-1}).attr("width",s.rangeBand()).attr("class",function(e,t){return"bar bar-"+String(t)+" "+e.color}).on("mouseenter",function(t,a){f(d3.select(this),t,a),null!=g&&e.$broadcast(g+":openTt",a)}).on("mouseout",function(t,a){h(a),null!=g&&e.$broadcast(g+":closeTt",a)});for(var v=n.append("g").attr("class","rulers"),b=10;b<=getUpperLimit(t.data);b+=10)v.append("line").attr("x1",1).attr("y1",l(b)).attr("x2",r).attr("y2",l(b));null!=t.title&&t.title.length>0&&n.append("text").attr("class","title").text(t.title).attr("x",r/2).attr("text-anchor","middle").attr("y",-10),e.$on(m+":openTt",function(e,a){f(n.select(".bar-"+String(a)),t.data[a],a)}),e.$on(m+":closeTt",function(e,t){h(t)})}}}]),angular.module("departementales2015").controller("MainCtrl",["$scope","$state",function(e,t){t.is("home")&&t.go("home.france")}]);var getLabelFromNuance=function(){var e={"BC-EXG":"Extrême gauche","BC-FG":"Front de Gauche","BC-PG":"Parti de Gauche","BC-COM":"PCF","BC-SOC":"PS","BC-UG":"Union de la Gauche","BC-RDG":"Parti radical de gauche","BC-DVG":"Divers gauche","BC-VEC":"EELV","BC-DIV":"Divers","BC-MDM":"Modem","BC-UC":"Union du Centre","BC-UDI":"UDI","BC-UMP":"UMP","BC-UD":"Union de la Droite","BC-DLF":"Debout la France","BC-DVD":"Divers droite","BC-FN":"FN","BC-EXD":"Extrême droite"};return function(t){return e[t]}}(),getColorFromNuance=function(){var e={"BC-EXG":"#660000","BC-FG":"#a51c30","BC-PG":"#bb3636","BC-COM":"#cc0000","BC-SOC":"#eb649c","BC-UG":"#eda9c7","BC-RDG":"#fac8cd","BC-DVG":"#d7c0d0","BC-VEC":"#52a45b","BC-DIV":"#e2d9d9","BC-MDM":"#f1a248","BC-UC":"#99ccff","BC-UDI":"#75addd","BC-UMP":"#518dbb","BC-UD":"#3f7292","BC-DLF":"#21546e","BC-DVD":"#d0e6f1","BC-FN":"#2a353b","BC-EXD":"#000000"};return function(t){return e[t]}}(),getDptNameFromDptCode=function(){var e={"01":"Ain","02":"Aisne","03":"Allier","04":"Alpes-de-Haute-Provence","05":"Hautes-Alpes","06":"Alpes-Maritimes","07":"Ardèche","08":"Ardennes","09":"Ariège",10:"Aube",11:"Aude",12:"Aveyron",13:"Bouches-du-Rhône",14:"Calvados",15:"Cantal",16:"Charente",17:"Charente-Maritime",18:"Cher",19:"Corrèze","2A":"Corse-du-Sud","2B":"Haute-Corse",21:"Côte-d’Or",22:"Côtes-d’Armor",23:"Creuse",24:"Dordogne",25:"Doubs",26:"Drôme",27:"Eure",28:"Eure-et-Loir",29:"Finistère",30:"Gard",31:"Haute-Garonne",32:"Gers",33:"Gironde",34:"Hérault",35:"Ille-et-Vilaine",36:"Indre",37:"Indre-et-Loire",38:"Isère",39:"Jura",40:"Landes",41:"Loir-et-Cher",42:"Loire",43:"Haute-Loire",44:"Loire-Atlantique",45:"Loiret",46:"Lot",47:"Lot-et-Garonne",48:"Lozère",49:"Maine-et-Loire",50:"Manche",51:"Marne",52:"Haute-Marne",53:"Mayenne",54:"Meurthe-et-Moselle",55:"Meuse",56:"Morbihan",57:"Moselle",58:"Nièvre",59:"Nord",60:"Oise",61:"Orne",62:"Pas-de-Calais",63:"Puy-de-Dôme",64:"Pyrénées-Atlantiques",65:"Hautes-Pyrénées",66:"Pyrénées-Orientales",67:"Bas-Rhin",68:"Haut-Rhin",69:"Rhône",70:"Haute-Saône",71:"Saône-et-Loire",72:"Sarthe",73:"Savoie",74:"Haute-Savoie",75:"Paris",76:"Seine-Maritime",77:"Seine-et-Marne",78:"Yvelines",79:"Deux-Sèvres",80:"Somme",81:"Tarn",82:"Tarn-et-Garonne",83:"Var",84:"Vaucluse",85:"Vendée",86:"Vienne",87:"Haute-Vienne",88:"Vosges",89:"Yonne",90:"Territoire de Belfort",91:"Essonne",92:"Hauts-de-Seine",93:"Seine-Saint-Denis",94:"Val-de-Marne",95:"Val-d’Oise",971:"Guadeloupe",972:"Martinique",973:"Guyane",974:"La Réunion",976:"Mayotte"};return function(t){return e[String(t)]}}(),computeChartData=function(e){var t=_.omit(e,function(e,t){return 0===t.indexOf("BC")});e=_.pick(e,function(e,t){return 0===t.indexOf("BC")}),e=_.sortBy(_.map(e,function(e,t){return{color:t,value:e.rapportExprime,label:getLabelFromNuance(t),nombre:e.nombre,nom:e.nom}}),"value").reverse();var a=_.slice(_.cloneDeep(e),0,7),n=_.map(_.sortBy(_.slice(e,a.length),"value"),function(e){return e.tooltip=e.label+" : "+formatValue(e.value)+"%",e.label="Autres",e}),r=_.reduce(n,function(e,t){return e+t.value},0);return n=_.map(n,function(e){var t=e.value;return e.value=r,r-=t,e}),a=a.concat(n),a.push({value:0,label:""}),a.push({label:"ABS",value:t.nuls.rapportInscrit+t.blancs.rapportInscrit+t.abstentions.rapportInscrit,tooltip:"Blancs et nuls : "+formatValue(t.nuls.rapportInscrit+t.blancs.rapportInscrit)+"%<br />(% d'inscrits)",color:"BLANCSNULS"}),a.push({label:"ABS",value:t.abstentions.rapportInscrit,color:"ABS",tooltip:"Abstentions : "+formatValue(t.abstentions.rapportInscrit)+"%<br />(% d'inscrits)"}),a},computeChartDataAs=function(e,t){var a,n=[];for(a=0;7>a&&null!=t[a].color;++a)n.push({color:t[a].color,value:e[t[a].color].rapportExprime,label:t[a].label});for(var r=0,o=a;null!=t[a].color;)r+=e[t[a].color].rapportExprime,++a;for(a=o;null!=t[a].color;)n.push({color:t[a].color,value:r,label:t[a].label,tooltip:getLabelFromNuance(t[a].color)+" : "+formatValue(e[t[a].color].rapportExprime)+"%"}),r-=e[t[a].color].rapportExprime,++a;return n.push({value:0,label:""}),n.push({label:"ABS",value:e.nuls.rapportInscrit+e.blancs.rapportInscrit+e.abstentions.rapportInscrit,tooltip:"Blancs et nuls : "+formatValue(e.nuls.rapportInscrit+e.blancs.rapportInscrit)+"%<br />(% d'inscrits)",color:"BLANCSNULS"}),n.push({label:"ABS",value:e.abstentions.rapportInscrit,color:"ABS",tooltip:"Abstentions : "+formatValue(e.abstentions.rapportInscrit)+"%<br />(% d'inscrits)"}),n},getPref=function(){var e={"01":{name:"Bourg-en-Bresse",coord:[46.205167,5.225501]},"02":{name:"Laon",coord:[49.564133,3.61989]},"03":{name:"Moulins",coord:[46.568059,3.334417]},"04":{name:"Digne-les-Bains",coord:[44.092193,6.235976]},"05":{name:"Gap",coord:[44.559638,6.079758]},"06":{name:"Nice",coord:[43.710173,7.261953]},"07":{name:"Privas",coord:[44.735269,4.599039]},"08":{name:"Charleville-Mézières",coord:[49.762085,4.726096]},"09":{name:"Foix",coord:[42.964127,1.605232]},10:{name:"Troyes",coord:[48.297345,4.074401]},11:{name:"Carcassonne",coord:[43.212161,2.353663]},12:{name:"Rodez",coord:[44.349389,2.575986]},13:{name:"Marseille",coord:[43.296482,5.36978]},14:{name:"Caen",coord:[49.182863,-.370679]},15:{name:"Aurillac",coord:[44.930953,2.444997]},16:{name:"Angoulême",coord:[45.648377,.156237]},17:{name:"La Rochelle",coord:[46.160329,-1.151139]},18:{name:"Bourges",coord:[47.081012,2.398782]},19:{name:"Tulle",coord:[45.26565,1.771697]},21:{name:"Dijon",coord:[47.322047,5.04148]},22:{name:"Saint-Brieuc",coord:[48.51418,-2.765835]},23:{name:"Guéret",coord:[46.169599,1.871452]},24:{name:"Périgueux",coord:[45.184029,.721115]},25:{name:"Besançon",coord:[47.237829,6.024054]},26:{name:"Valence",coord:[44.933393,4.89236]},27:{name:"Évreux",coord:[49.027013,1.151361]},28:{name:"Chartres",coord:[48.443854,1.489012]},29:{name:"Quimper",coord:[47.997542,-4.097899]},30:{name:"Nîmes",coord:[43.836699,4.360054]},31:{name:"Toulouse",coord:[43.604652,1.444209]},32:{name:"Auch",coord:[43.64638,.586709]},33:{name:"Bordeaux",coord:[44.837789,-.57918]},34:{name:"Montpellier",coord:[43.610769,3.876716]},35:{name:"Rennes",coord:[48.117266,-1.677793]},36:{name:"Châteauroux",coord:[46.811434,1.686779]},37:{name:"Tours",coord:[47.394144,.68484]},38:{name:"Grenoble",coord:[45.188529,5.724524]},39:{name:"Lons-le-Saunier",coord:[46.671361,5.550796]},40:{name:"Mont-de-Marsan",coord:[43.893485,-.499782]},41:{name:"Blois",coord:[47.586092,1.335947]},42:{name:"Saint-Étienne",coord:[45.439695,4.387178]},43:{name:"Le Puy-en-Velay",coord:[45.042768,3.882936]},44:{name:"Nantes",coord:[47.218371,-1.553621]},45:{name:"Orléans",coord:[47.902964,1.909251]},46:{name:"Cahors",coord:[44.447523,1.441989]},47:{name:"Agen",coord:[44.203142,.616363]},48:{name:"Mende",coord:[44.517611,3.501873]},49:{name:"Angers",coord:[47.478419,-.563166]},50:{name:"Saint-Lô",coord:[49.115469,-1.082814]},51:{name:"Châlons-en-Champagne",coord:[48.956682,4.363073]},52:{name:"Chaumont",coord:[48.113748,5.139256]},53:{name:"Laval",coord:[48.078515,-.766991]},54:{name:"Nancy",coord:[48.692054,6.184417]},55:{name:"Bar-le-Duc",coord:[48.773605,5.158238]},56:{name:"Vannes",coord:[47.658236,-2.760847]},57:{name:"Metz",coord:[49.119309,6.175716]},58:{name:"Nevers",coord:[46.990896,3.162845]},59:{name:"Lille",coord:[50.62925,3.057256]},60:{name:"Beauvais",coord:[49.429539,2.080712]},61:{name:"Alençon",coord:[48.432856,.091266]},62:{name:"Arras",coord:[50.291002,2.777535]},63:{name:"Clermont-Ferrand",coord:[45.777222,3.087025]},64:{name:"Pau",coord:[43.2951,-.370797]},65:{name:"Tarbes",coord:[43.232951,.078082]},66:{name:"Perpignan",coord:[42.688659,2.894833]},67:{name:"Strasbourg",coord:[48.573405,7.752111]},68:{name:"Colmar",coord:[48.079359,7.358512]},69:{name:"Lyon",coord:[45.764043,4.835659]},70:{name:"Vesoul",coord:[47.619788,6.15428]},71:{name:"Mâcon",coord:[46.306884,4.828731]},72:{name:"Le Mans",coord:[48.00611,.199556]},73:{name:"Chambéry",coord:[45.564601,5.917781]},74:{name:"Annecy",coord:[45.899247,6.129384]},75:{name:"Paris",coord:[48.856614,2.352222]},76:{name:"Rouen",coord:[49.443232,1.099971]},77:{name:"Melun",coord:[48.542105,2.6554]},78:{name:"Versailles",coord:[48.801408,2.130122]},79:{name:"Niort",coord:[46.323716,-.464777]},80:{name:"Amiens",coord:[49.894067,2.295753]},81:{name:"Albi",coord:[43.925085,2.148641]},82:{name:"Montauban",coord:[44.022125,1.35296]},83:{name:"Toulon",coord:[43.124228,5.928]},84:{name:"Avignon",coord:[43.949317,4.805528]},85:{name:"La Roche-sur-Yon",coord:[46.670511,-1.426442]},86:{name:"Poitiers",coord:[46.580224,.340375]},87:{name:"Limoges",coord:[45.833619,1.261105]},88:{name:"Épinal",coord:[48.172402,6.449403]},89:{name:"Auxerre",coord:[47.798202,3.573781]},90:{name:"Belfort",coord:[47.639674,6.863849]},91:{name:"Évry",coord:[48.629828,2.441782]},92:{name:"Nanterre",coord:[48.892423,2.215331]},93:{name:"Bobigny",coord:[48.908612,2.439712]},94:{name:"Créteil",coord:[48.790367,2.455572]},95:{name:"Cergy",coord:[49.035617,2.060325]},971:{name:"Basse-Terre",coord:[16,-61.733]},972:{name:"Fort-de-France",coord:[14.616065,-61.05878]},973:{name:"Cayenne",coord:[4.9227,-52.3269]},974:{name:"Saint-Denis",coord:[-20.882057,55.450675]},976:{name:"Mamoudzou",coord:[-12.7806,45.2278]},"2A":{name:"Ajaccio",coord:[41.919229,8.738635]},"2B":{name:"Bastia",coord:[42.697283,9.450881]}};return function(t){return e[t]}}(),formatValue=function(e){return e=Math.round(10*e)/10,String(e).replace(".",",")},formatLastUpdate=function(e){return e=e.split(" "),e[0]=e[0].split("/"),e[0]=[e[0][1],e[0][0],e[0][2]].join("/"),"Dernière mise à jour le "+e[0]+" à "+e[1]},computeT3Data=function(e){var t=[];for(var a in e)e.hasOwnProperty(a)&&e[a]>0&&t.push({value:e[a],color:a,label:getLabelFromNuance(a),tooltip:getLabelFromNuance(a)+" : "+e[a]+" sièges"});return _.sortBy(t,"value").reverse()};angular.module("departementales2015").run(["$templateCache",function(e){e.put("app/main/main.html",'<div class="main"><div class="container-fluid"><div class="row"><div ng-include="\'components/navbar/navbar.html\'"></div></div><div class="row"><div ui-view=""></div></div><div class="row"><div ng-include="\'components/enteryouraddress/enteryouraddress.html\'"></div></div></div><div ng-include="\'components/footer/footer.html\'"></div></div>'),e.put("components/enteryouraddress/enteryouraddress.html",'<div class="enteryouraddress" ng-controller="EnterYourAddressCtrl"><div class="enteryouraddress__wrapper"><i class="enteryouraddress__wrapper__icon fa fa-map-marker fa-5x"></i><p>Entrez votre adresse pour connaitre les résultats dans votre canton&nbsp;<i tooltip="Pour un résultat optimal, entrez une adresse précise." class="fa fa-info-circle"></i>&nbsp;:</p><form novalidate="" ng-submit="onSubmit()"><div class="input-group"><input ng-model="address" type="text" class="form-control"> <span class="input-group-btn"><button type="submit" class="btn btn-default"><span class="sr-only">Localiser</span> <i class="fa fa-search"></i></button></span></div></form><p ng-if="error" class="enteryouraddress__wrapper__error label label-danger center-block">{{error}}</p></div></div>'),e.put("components/footer/footer.html",'<div class="footer" ng-controller="FooterCtrl"><div class="container"><div class="row"><div class="col-sm-4 col-xs-6"><h4>Partage</h4><p>Partagez les résultats du<select ng-model="selectedT"><option ng-selected="selectedT==1" value="1">1er</option><option ng-selected="selectedT==2" value="2">2nd</option></select>tour sur les réseaux sociaux.</p><div class="share-buttons"><div id="fb-root"></div><script>(function(d, s, id) {\n                var js, fjs = d.getElementsByTagName(s)[0];\n                if (d.getElementById(id)) return;\n                js = d.createElement(s); js.id = id;\n                js.src = "//connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v2.0";\n                fjs.parentNode.insertBefore(js, fjs);\n                }(document, \'script\', \'facebook-jssdk\'));\n            </script><div class="fb-share-button" data-href="{{getShareUrl()}}" data-layout="button"></div><a href="https://twitter.com/share" class="twitter-share-button" data-count="none" data-url="{{getShareUrl()}}" data-text="Entrez votre adresse pour découvrir les résultats des élections départementales 2015 dans votre canton.">Tweet</a><script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+\'://platform.twitter.com/widgets.js\';fjs.parentNode.insertBefore(js,fjs);}}(document, \'script\', \'twitter-wjs\');</script><script src="https://apis.google.com/js/platform.js" async="" defer="">\n              {lang: \'fr\'}\n            </script><div class="g-plus" data-action="share" data-annotation="none" data-href="{{getShareUrl()}}"></div></div></div><div class="col-sm-4 col-xs-6"><h4>Intégration</h4><textarea readonly="" class="form-control">{{getIframeElement()}}</textarea></div><div class="col-sm-4 col-xs-12"><h4>À propos</h4><p><a target="_blank" href="https://github.com/jplusplus/rf-departementales-2015"><> Code source</a> - Réalisé par <a target="_blank" href="http://jplusplus.org/">Journalism++</a> pour <a target="_blank" href="http://www.radiofrance.fr/">Radio France</a>. Sources : <a target="_blank" href="https://www.data.gouv.fr/fr/datasets/contours-osm-des-cantons-electoraux-departementaux-2015/">Données géographiques - Open Street Map</a> - <a target="_blank" href="http://elections.interieur.gouv.fr/departementales-2015/">Résultats électoraux - Ministère de l\'intérieur</a></p></div></div></div></div>'),e.put("components/map/map.html",'<leaflet id="{{mapid}}" center="center" markers="markers" tiles="tiles" geojson="geojson" defaults="defaults" legend="legend" events-broadcast="events"></leaflet>'),e.put("components/navbar/navbar.html",'<nav class="navbar navbar-static-top" ng-controller="NavbarCtrl"><div class="container-fluid"><div class="col-xs-4 col-sm-3 col-md-2"><a class="navbar__brand" ui-sref="home.france"><img src="assets/logo-dpt.png" alt="Départementales 2015 - 22 &amp; 29 mars 2015"></a></div><div class="col-xs-8 col-sm-9 col-md-10"><ul class="list-inline navbar__tabs"><li class="navbar__tabs__tab" ng-class="{ \'navbar__tabs__tab--active\' : getT() === 1 }"><a ng-click="goToT(1)">1<sup>er</sup> tour</a></li><li class="navbar__tabs__tab" ng-class="{ \'navbar__tabs__tab--active\' : getT() === 2 , \'navbar__tabs__tab--disabled\' : !!!isT2 }"><a ng-click="goToT(2)">2<sup>nd</sup> tour</a></li><li class="navbar__tabs__tab" ng-class="{ \'navbar__tabs__tab--active\' : getT() === 3 }"><a ng-click="goToT(3)">Résultats</a></li></ul></div></div><a class="navbar__rf" href="http://www.radiofrance.fr/" target="_blank"><img src="assets/rf-logo.svg" alt="Radio France"></a></nav>'),e.put("app/main/dpt/dpt.html",'<div class="main__dpt"><ol class="breadcrumb"><li><a ui-sref="home.france">France</a></li><li><a ui-sref="home.dpt({dpt:dpt.code})">{{dpt.name}}</a></li><span ng-if="t!==3" class="date pull-right">{{ lastUpdate }}</span></ol><div class="main__dpt__map"><map id="mapdpt" x-geo="geojson" x-center-lon-lat="center" x-data="mapData"></map></div><div class="container-fluid"><div class="row"><div class="col-sm-6"><div class="main__dpt__side-chart panel panel-default"><div class="panel-heading"><h3><span>{{dpt.name}}</span><br>{{titleDpt}}</h3></div><div barchart="" x-data="dataDpt" x-config="configDpt" class="chart"></div></div></div><div class="col-sm-6" ng-if="t !== 3"><div class="main__dpt__side-chart panel panel-default"><div class="panel-heading"><h3><span>Projection France</span><br>{{titleFE}}</h3></div><div barchart="" x-data="dataFE" x-config="configFE" class="chart"></div></div></div></div></div></div>'),e.put("app/main/canton/canton.html",'<div class="main__canton"><ol class="breadcrumb"><li><a ui-sref="home.france">France</a></li><li><a ui-sref="home.dpt({dpt:dpt.code})">{{dpt.name}}</a></li><li><a ui-sref="home.canton({dpt:dpt.code,canton:canton.code})">{{canton.name}}</a></li><span ng-if="t!==3" class="date pull-right">{{ lastUpdate }}</span></ol><div class="main__canton__map"><map id="mapcanton" x-geo="geojson" x-center-lon-lat="center" x-data="mapData" x-marker="mapMarker"></map></div><div class="container-fluid"><div class="row"><div class="col-sm-12"><div class="main__canton__map-chart panel panel-default"><div hbarchart="" x-data="dataCanH" class="chart"></div></div></div><div class="col-sm-6" ng-if="t!==3"><div class="main__canton__side-chart panel panel-default"><div class="panel-heading"><h3><span>{{canton.name}}</span><br>{{titleCan}}</h3></div><div barchart="" x-data="dataCan" x-config="configCan" class="chart"></div></div></div><div class="col-sm-6" ng-if="t!==3"><div class="main__canton__side-chart panel panel-default"><div class="panel-heading"><h3><span>Projection France</span><br>{{titleFE}}</h3></div><div barchart="" x-data="dataFE" x-config="configFE" class="chart"></div></div></div></div></div></div>'),e.put("app/main/france/france.html",'<div><ol class="breadcrumb"><li><a ui-sref="home.france">France</a></li></ol><div class="main__france" france=""><div class="main__france__map"><div class="row main__france__map__metropol"><map id="mapfrance" x-geo="geojson" x-data="mapData"></map></div><div class="row main__france__map__domtom"><div class="col-xs-4"><map id="map971" x-geo="geojson971" x-center-lon-lat="center971" x-data="mapData" x-has-legend="false"></map></div><div class="col-xs-4"><map id="map974" x-geo="geojson974" x-center-lon-lat="center974" x-data="mapData" x-has-legend="false"></map></div><div class="col-xs-4"><map id="map976" x-geo="geojson976" x-center-lon-lat="center976" x-data="mapData" x-has-legend="false"></map></div></div></div><div class="container-fluid" ng-if="t != 3"><div class="row"><div class="col-sm-6 col-sm-offset-6"><div class="main__france__side-chart panel panel-default"><div class="panel-heading"><h3><span>Projection France</span><br>{{ chartTitle }}</h3></div><div barchart="" x-data="data" x-config="config" class="chart"></div></div></div></div></div></div></div>')
}]);