// Import stylesheets
import './style.css';
import * as geoJson from './samplegeojson.json';

// Write Javascript code!
var LAT_VAL = 41.3850639;
var LNG_VAL = 2.1734035;

var map;
var infoWindow;

window.initMap = function() {
  var myLatLng = {lat: LAT_VAL, lng: LNG_VAL};

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 5,
    center: myLatLng,
    styles: [
      {
          featureType: "poi",
          stylers: [
              { visibility: "off" }
          ]
      }
    ]
  });

  google.maps.event.addListener(map, 'bounds_changed', () => console.log('Bounds changed'));
  google.maps.event.addListener(map, 'zoom_changed', () => console.log('Zoom changed'));
  google.maps.event.addListener(map, 'idle', () => console.log('Idle'));

  var oms = new OverlappingMarkerSpiderfier(map, {
    markersWontMove: true,
    markersWontHide: true,
    basicFormatEvents: true,
    ignoreMapClick: true,
    keepSpiderfied: true
  });

  google.maps.event.addListenerOnce(map, 'tilesloaded', () => {
    SuperClusterAdapterLoader.getClusterer().then(Clusterer => {
      if (Clusterer) {
        const clusterer = new Clusterer.Builder(map)
          .withRadius(80)
          .withMaxZoom(19)
          .withMinZoom(0)
          .withCustomMarkerIcon(customMarkerIcon)
          .withMarkerClick(onMarkerClick)
          .withFeatureClick(onFeatureClick)
          .withFeatureStyle(featureStyle)
          .withOverlapMarkerSpiderfier(oms)
          .build();

          clusterer.load(geoJson);
      }
    });
  });

  infoWindow = new google.maps.InfoWindow({
    map: map
  });
}

function onMarkerClick(marker, event) {
  infoWindow.close();
  var id = marker.get("id");
  var title = marker.getTitle();
  var content = `<h2>${title}</h2><div>${id}</div>`;
  infoWindow.setContent(content);
  infoWindow.open(map, marker);
}

function onFeatureClick(event) {
  infoWindow.close();
  if (event.feature) {
    var id = event.feature.getId();
    var title = event.feature.getProperty("name");
    var content = `<h2>${title}</h2><div>${id}</div>`;
    infoWindow.setOptions({
      content: content,
      position: event.latLng,
      map: map
    });
    infoWindow.open(map);
  }
}

function featureStyle(feature) {
  var options = {
    fillColor: feature.getProperty("color"),
    fillOpacity: 0.5,
    strokeColor: feature.getProperty("color"),
    strokeOpacity: 1,
    strokeWeight: 2
  };
  return options;
}

function customMarkerIcon(feature) {
  return "https://maps-tools-242a6.web.app/assets/idle.svg";
}

var s1 = document.createElement("script");
s1.type = "text/javascript";
s1.src = "https://cdnjs.cloudflare.com/ajax/libs/OverlappingMarkerSpiderfier/1.0.3/oms.min.js"; 
document.body.appendChild(s1); 

var c = document.createElement("script");
c.type = "text/javascript";
c.src = "https://maps-tools-242a6.firebaseapp.com/clusterer/supercluster/index.js"; 
document.body.appendChild(c);


var s = document.createElement("script");
s.type = "text/javascript";
s.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBNdSV-JlDBbTDfxql2NVf5gzudxv9FC_8&callback=initMap"; 
document.body.appendChild(s);
