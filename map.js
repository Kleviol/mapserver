document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([51.505, -0.09], 13);  // Default center and zoom

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var marker = L.marker([51.505, -0.09]).addTo(map);  // Default marker position
    marker.bindPopup('A pretty CSS3 popup.<br> Easily customizable.').openPopup();

    function updateLocation() {
        fetch('http://localhost:3000/coordinates')
    .then(response => response.json())
    .then(data => {
        console.log(data);  // Check what's being received
        if(data.location) {
            var newLat = data.location.lat;
            var newLng = data.location.lng;
            map.setView([newLat, newLng], 13);  // Update the map center
            marker.setLatLng([newLat, newLng]);  // Update the marker position
            marker.bindPopup('Updated Location: Lat ' + newLat + ', Lng ' + newLng).openPopup();
        }
    })
    .catch(err => console.error('Error fetching location:', err));

    }

    // Fetch new location every 10 seconds
    setInterval(updateLocation, 10000);
});
