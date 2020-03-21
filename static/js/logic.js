//define two map layers
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.satellite",
      accessToken: API_KEY
    });
  
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    });
  
    // Define a baseMaps object to hold our base layers
var baseMaps = {
      "Satellite Map": satellite,
      "Street Map": streetmap
    };

//define earthquake layer    
var earthquakes = new L.LayerGroup();   

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

//function that would create circle markers with radius and color depending on magnitude
d3.json(queryUrl, function(data){

  function styleInfo(feature) {
    return {
      fillOpacity: 0.75,
      fillColor: circleColor(feature.properties.mag),
      color: "none",
      radius: circleRadius(feature.properties.mag)
    };
  }

function circleColor(mag){
  if (mag<2){
    return "#85d8fa"
  }
  else if (mag<4){
    return "#0aef1a"
  }
  else if (mag<6){
    return "#fbed05"
  }
  else if (mag<8){
      return "#fb7905"
  }
  else {
    return "#b00000"
  }
};  
  
function circleRadius(mag){
if (mag===1){
  return 1
}
else return (mag-1)*3
};

L.geoJson(data, {
pointToLayer: function(feature, latlng) {
  return L.circleMarker(latlng);
},
style: styleInfo,
onEachFeature: function(feature, layer) {
  layer.bindPopup("<strong>Magnitude: </strong>"+ feature.properties.mag + "<br><strong>Location: </strong>" + feature.properties.place);
}
}).addTo(earthquakes)
});

//tectonic plates
var platesURL = "../data/PB2002_boundaries.json"
var plates = new L.LayerGroup(); 

d3.json(platesURL, function(data){
  L.geoJSON(data, {
    style: {
      "color": "red",
      "weight": 3,
      "opasity": 1
    }
  }).addTo(plates);
});

//create overlay taht would hold earthqueke markers  
var overlayMaps = {
  "Earthquakes": earthquakes,
  "Tectonic": plates
  };
      
// Create map
var myMap = L.map("map", {
  center: [39.840984, -39.867545],
  zoom: 3,
  layers: [satellite, earthquakes, plates]
});    
    
// Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
  }).addTo(myMap);