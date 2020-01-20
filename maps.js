function map_recenter(map, latlng,offsetx,offsety) {
    var point1 = map.getProjection().fromLatLngToPoint(
        (latlng instanceof google.maps.LatLng) ? latlng : map.getCenter()
    );
    var point2 = new google.maps.Point(
        ( (typeof(offsetx) == 'number' ? offsetx : 0) / Math.pow(2, map.getZoom()) ) || 0,
        ( (typeof(offsety) == 'number' ? offsety : 0) / Math.pow(2, map.getZoom()) ) || 0
    );  
    map.setCenter(map.getProjection().fromPointToLatLng(new google.maps.Point(
        point1.x - point2.x,
        point1.y + point2.y
    )));
}

function initializeMap() {
    var mapOptions = {
      center: new google.maps.LatLng(21.1283054,105.0320186),
      zoom: 4,
      mapType: 'terrain',
      panControl: false,
      panControlOptions: {
	  	position: google.maps.ControlPosition.TOP_RIGHT
	  },
	  zoomControl: false,
	  draggable:true,
	  scrollwheel: true,
	  mapTypeControl: false,
	  scaleControl: false,
	  streetViewControl: false,
	  overviewMapControl: false,
	  fullscreenControl:false,
	  styles:window['mapstyles']
    };
    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    //add actual data from GeoJSON callback
    daisdata=map.data.addGeoJson(dais);
    saisdata=map.data.addGeoJson(sais);

    map.data.setStyle(function(feature) {
    	myrotation=feature.getProperty('heading');
    	if(feature.h.type == 'sais') return { icon:{ rotation:feature.getProperty('heading'), url: "data:image/svg+xml,%3Csvg viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg' height='6' width='6'%3E%3Cpolygon style='opacity:.3;transform-box:fill-box;transform-origin: center;transform: rotate("+myrotation+"deg);' fill='%2312677b' class='st0' points='1.3,6 3,0 4.7,6 '/%3E%3C/svg%3E", size:new google.maps.Size(6,6) }  };
    	return { /*visible:0,*/ icon:{ rotation:feature.getProperty('heading'), url: "data:image/svg+xml,%3Csvg viewBox='0 0 6 6' xmlns='http://www.w3.org/2000/svg' height='6' width='6'%3E%3Cpolygon style='opacity:.3;transform-box:fill-box;transform-origin: center;transform: rotate("+myrotation+"deg);' fill='%23e31a19' class='st0' points='1.3,6 3,0 4.7,6 '/%3E%3C/svg%3E", size:new google.maps.Size(6,6) }  };
    });

    map.data.addListener('click', function(event) {
	   //console.log(event.feature.h);
	    map.data.overrideStyle(event.feature, {'visible': 0});
	});
	$('.toggles>a').click(function(e){
		e.preventDefault();
		$(this).toggleClass('active');
		targetType=$(this).data('type');
	 	window[targetType+'active']=!window[targetType+'active'];
	 	window[targetType+'active']=+window[targetType+'active'];

	    for(i in window[targetType+'data']){
	    	map.data.overrideStyle(window[targetType+'data'][i], {'visible': window[targetType+'active']});
	    }
	});
	gsap.from('.toggles>a', 1, {delay:1, y:-100, opacity:0, ease:'back.out(.5)', stagger:.5});
}
var map;
var sais=false;
var dais=false;
var daisactive=1;
var saisactive=1;
var daisdata;
var saisdata;

function maybeInitialize(){
	if( sais!==false && dais !== false ){
		initializeMap();
	}
}

$(document).ready(function(){

	if($("#map").length){
		var files=['sais', 'dais'];
		for(i in files){
			$.ajax({
				url:files[i]+'.geojson',
				dataType:'json',
				myid:files[i],
				success:function(response){
					for(i in response.features){
						response.features[i].properties.type=this.myid;
					}
					window[this.myid]=response;
					maybeInitialize();
				}
			});
		}
	}
});