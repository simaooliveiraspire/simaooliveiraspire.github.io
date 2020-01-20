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
      zoom: 5,
      mapType: 'terrain',
      panControl: false,
      panControlOptions: {
	  	position: google.maps.ControlPosition.TOP_RIGHT
	  },
	  zoomControl: false,
	  /*zoomControlOptions: {
	  	position: google.maps.ControlPosition.TOP_LEFT
	  },*/
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
    var daisdata=map.data.addGeoJson(uspoints);
    //var saisdata=map.data.addGeoJson(sais);

    map.data.setStyle(function(feature) {
    	if(feature.h.type == 'uspoints') return { icon:{ rotation:135, url: 'arrow_blue.svg', size:new google.maps.Size(12,12) }  };
    });

    map.data.addListener('click', function(event) {
	   console.log(event.feature.h);
	    map.data.overrideStyle(event.feature, {'visible': 0});
	});

}
var map;
var uspoints=false;
//var markers=[];
//var themarker;
//var latlngs=[];




$(document).ready(function(){
	if($("#map").length){
			$.ajax({
				url:'uspoints.geojson',
				dataType:'json',
				myid:'uspoints',
				success:function(response){
					for(i in response.features){
						response.features[i].properties.type=this.myid;
					}
					window[this.myid]=response;
					initializeMap();
				}
			});
	}
});