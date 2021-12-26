'use strict';
// prettier-ignore

if (navigator.geolocation) {
    function createPolyLine(sourcePoint, destinationPoint, map) {
        // let latLngBounds = L.latLng(sourcePoint).toBounds(10);
        // L.rectangle(latLngBounds, { color: 'red' }).addTo(map);
        // map.fitBounds(latLngBounds);
        console.log(L.latLng(sourcePoint).distanceTo(destinationPoint));
        L.marker(destinationPoint).addTo(map)
            .bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false }))
            .setPopupContent("B Marker : You are at " + L.latLng(destinationPoint).toString() + " which is 5 km away from A Marker")
            .openPopup();
        let polyline = L.polyline([sourcePoint, destinationPoint], { color: 'red' }).addTo(map);
        map.fitBounds(polyline.getBounds());
    }

    const degrees_to_radians = deg => (deg * Math.PI) / 180.0;
    const radians_to_degrees = rad => (rad * 180.0) / Math.PI;

    function getDestinationPoint(source, brng, dist) {
        dist = dist / 6371;
        brng = degrees_to_radians(brng);

        const lat1 = degrees_to_radians(source[0]);//latitude
        const lon1 = degrees_to_radians(source[1]);//longitude
        const lat2 = Math.asin(Math.sin(lat1) * Math.cos(dist) +
            Math.cos(lat1) * Math.sin(dist) * Math.cos(brng));
        const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(dist) *
            Math.cos(lat1),
            Math.cos(dist) - Math.sin(lat1) *
            Math.sin(lat2));

        if (isNaN(lat2) || isNaN(lon2)) {
            return null;
        }

        return [radians_to_degrees(lat2), radians_to_degrees(lon2)];
    }

    function computeDestination(lat, lng, map) {
        const sourcePoint = [lat, lng]
        const radiusInKM = 5.0;
        const bearing = 90;
        const destinationPoint = getDestinationPoint(sourcePoint, bearing, radiusInKM);
        //destinationPoint = getDestinationPoint(new LatLng(37.4038194,-122.081267), SphericalUtil.computeHeading(new LatLng(37.7577,-122.4376), new LatLng(37.4038194,-122.081267)), radiusInKM);
        createPolyLine(sourcePoint, destinationPoint, map);
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);
        const coords = [latitude, longitude];
        const map = L.map('map').setView(coords, 16);//13
        //const map = L.map('map').fitWorld();
        map.locate({ setView: true, maxZoom: 16 });//13
        function onLocationFound(e) {
            var radius = e.accuracy;

            L.marker(e.latlng).addTo(map)
                .bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false }))
                .setPopupContent("A Marker : You are within " + radius + " meters from this point")//"A Marker : You are at " + "[ " + latitude + ", " + longitude + " ]"
                .openPopup();

            L.circle(e.latlng, radius).addTo(map);
        }

        map.on('locationfound', onLocationFound);

        function onLocationError(e) {
            alert(e.message);
        }

        map.on('locationerror', onLocationError);

        computeDestination(latitude, longitude, map);
        //https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png
        const id = 'mapbox/streets-v11';
        const accessToken = 'pk.eyJ1IjoibmltaXNoYTEyMSIsImEiOiJja3hnMTI1b3UzbDBuMndvNXRldnl6M3ZkIn0.a4DDmXkE1ps7BPwwswAxpg'
        L.tileLayer(`https://api.mapbox.com/styles/v1/${id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);

        map.on('click', function (mapEvent) {
            console.log(mapEvent);
            const { lat, lng } = mapEvent.latlng;
            L.marker([lat, lng]).addTo(map)
                .bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false }))
                .setPopupContent("You clicked the map at " + mapEvent.latlng.toString())
                .openPopup();
        });
    },
        function () {
            alert("Could not get your position");
        })

}

