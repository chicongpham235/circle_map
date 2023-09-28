var map;
var geocoder = new google.maps.Geocoder();
var infoWindow = new google.maps.InfoWindow({
  disableAutoPan: true,
});
var center = new google.maps.LatLng(38.78436574258653, -77.0150403423293);
var bounds;
var zoom = 6;
var markers = [];
var markerClusters = [];

const TYPES = [
  { type: "Barge Facility", color: "#DB504A", path: "./assets/icon1/m" },
  { type: "CDD Landfill", color: "#FF6F59", path: "./assets/icon2/m" },
  { type: "Industrial Landfill", color: "#254441", path: "./assets/icon3/m" },
  { type: "MRF", color: "#43AA8B", path: "./assets/icon4/m" },
  {
    type: "Materials Recovery Facility",
    color: "#B2B09B",
    path: "./assets/icon5/m",
  },
  { type: "Sanitary Landfill", color: "#2a9d8f", path: "./assets/icon6/m" },
  { type: "Transfer Station", color: "#588157", path: "./assets/icon7/m" },
  { type: "Waste Pile", color: "#fca311", path: "./assets/icon8/m" },
];

let data = [];
async function init() {
  data = await fetch("./data.json").then((res) => res.json());
  data = data.filter((item) => item.lat && item.lng);
  // data = data.filter(
  //   (v, i, a) =>
  //     a.findIndex((v2) => v2["Facility Name"] === v["Facility Name"]) === i
  // );
  var mapOptions = {
    zoom: zoom,
    maxZoom: 22,
    minZoom: 4,
    tilt: 45,
    center: center,
    mapTypeControl: false,
    clickableIcons: false,
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  setMarkers(data);
}

window.onload = () => {
  init();
};

function setMarkers(items) {
  bounds = new google.maps.LatLngBounds();
  for (const key in items) {
    const latLng = new google.maps.LatLng(items[key].lat, items[key].lng);
    const value = items[key]["Process Rate/Daily Disposal Limit"];
    const scale = parseInt(value / 1000) != 0 ? parseInt(value / 1000) + 5 : 5;
    TYPES.forEach((TYPE) => {
      if (TYPE.type == items[key]["Unit Type"]) {
        const color = TYPE.color;
        const marker = new google.maps.Marker({
          position: latLng,
          map: map,
          clickable: true,
          icon: {
            path: 0.0,
            scale: scale,
            fillOpacity: 1,
            strokeWeight: 2,
            fillColor: color,
            strokeColor: "#ffffff",
          },
        });
        if (!markers[TYPE.type]) markers[TYPE.type] = [];
        markers[TYPE.type].push(marker);
      }
      bounds.extend(latLng);
    });
  }
  map.fitBounds(bounds);

  TYPES.forEach((TYPE) => {
    markerClusters[TYPE.type] = new MarkerClusterer(map, markers[TYPE.type], {
      imagePath: TYPE.path,
      minimumClusterSize: 2,
      maxZoom: 8,
    });
  });
}
