import { saveCircle, getCircles } from './idb.js';

// register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

// notification permission
Notification.requestPermission();

// setup map
const map = L.map('map').setView([0, 0], 2);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// drawing
const drawnItems = new L.FeatureGroup().addTo(map);
new L.Control.Draw({
  draw: {
    circle: true,
    polyline: false,
    polygon: false,
    rectangle: false,
    marker: false
  },
  edit: { featureGroup: drawnItems }
}).addTo(map);

map.on(L.Draw.Event.CREATED, async (event) => {
  const layer = event.layer;
  drawnItems.addLayer(layer);

  if (layer instanceof L.Circle) {
    await saveCircle({
      lat: layer.getLatLng().lat,
      lng: layer.getLatLng().lng,
      radius: layer.getRadius()
    });
  }
});

// load saved
(async () => {
  const circles = await getCircles();
  circles.forEach(c => {
    L.circle([c.lat, c.lng], { radius: c.radius }).addTo(drawnItems);
  });
})();

// export
document.getElementById("export").onclick = async () => {
  const data = await getCircles();
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = "circles.json"; a.click();
};

// import
document.getElementById("import").onclick = async () => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = async () => {
    const file = input.files[0];
    const text = await file.text();
    const imported = JSON.parse(text);

    imported.forEach(async (c) => {
      await saveCircle(c);
      L.circle([c.lat, c.lng], { radius: c.radius }).addTo(drawnItems);
    });
  };
  input.click();
};

// fallback timer notification
setInterval(() => {
  if (Notification.permission === "granted") {
    new Notification("⏰ Reminder", {
      body: "Five minutes passed!",
      icon: "icons/icon-192.png"
    });
  }
}, 300000);
