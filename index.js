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
  { type: "Barge Facility", color: "#DB504A", path: "/assets/m1.png" },
  { type: "CDD Landfill", color: "#FF6F59", path: "/assets/m2.png" },
  { type: "Industrial Landfill", color: "#254441", path: "/assets/m3.png" },
  { type: "MRF", color: "#43AA8B", path: "/assets/m4.png" },
  {
    type: "Materials Recovery Facility",
    color: "#B2B09B",
    path: "/assets/m5.png",
  },
  { type: "Sanitary Landfill", color: "#2a9d8f", path: "/assets/m6.png" },
  { type: "Transfer Station", color: "#588157", path: "/assets/m7.png" },
  { type: "Waste Pile", color: "#fca311", path: "/assets/m8.png" },
];

let data = [];
async function init() {
  data = await fetch("./data.json").then((res) => res.json());
  data = data.filter((item) => item.lat && item.lng);
  data = data.filter(
    (v, i, a) =>
      a.findIndex((v2) => v2["Facility Name"] === v["Facility Name"]) === i
  );
  console.log(data);
  var mapOptions = {
    zoom: zoom,
    tilt: 45,
    center: center,
    mapTypeControl: false,
  };
  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  setMarkers(data);
}

window.onload = () => {
  init();
};

function setMarkers(items) {
  for (const key in items) {
    const latLng = new google.maps.LatLng(items[key].lat, items[key].lng);
    TYPES.forEach((TYPE) => {
      if (TYPE.type == items[key]["Unit Type"]) {
        const color = TYPE.color;
        const marker = new google.maps.Marker({
          position: latLng,
          map: map,
          clickable: true,
          icon: {
            path: 0.0,
            scale: 8,
            fillOpacity: 1,
            strokeWeight: 2,
            fillColor: color,
            strokeColor: "#ffffff",
          },
        });
        if (!markers[TYPE.type]) markers[TYPE.type] = [];
        markers[TYPE.type].push(marker);
      }
    });
  }

  TYPES.forEach((TYPE) => {
    markerClusters[TYPE.type] = new MarkerClusterer(map, markers[TYPE.type], {
      styles: [
        {
          url: TYPE.path,
          height: 53,
          width: 53,
        },
      ],
    });
  });
}
