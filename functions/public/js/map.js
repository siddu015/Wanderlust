mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
    zoom: 9,
    center: listing.geometry.coordinates,
});


const marker = new mapboxgl.Marker()
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h4>${listing.location}</h4><p>Exact location provided after booking</p>`
            )
    )
    .addTo(map);
