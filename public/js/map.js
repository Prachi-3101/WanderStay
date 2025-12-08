// map.js
mapboxgl.accessToken = 'pk.eyJ1IjoicHJhY2hpLXNvbmkyMiIsImEiOiJjbWl2Z3RpdngwdTkyM2VyMTR6YWkwd2g2In0.DiOm-wmdcBx0p-SaXkC3cA';

console.log("listing coordinates (from server):", coordinates);

if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
  document.getElementById('map').innerHTML = '<div class="p-4 text-muted">Location not available.</div>';
} else {
  const lngLat = coordinates; // [lng, lat]

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12', // important
    center: coordinates,
    zoom: 10
  });

  // optional controls
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  // marker
  new mapboxgl.Marker({ color: "#FF385C" })
  .setLngLat(lngLat)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="font-size:14px;">
        <strong>${listingTitle}</strong><br>
        ✨ Explore your stay
      </div>
    `)
  )
  .addTo(map);
}