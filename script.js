'use strict';
// prettier-ignore
const update_location_time = 15;
let interval;

function getCurrentPosition(marker){
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        //console.log(latitude, longitude);
        console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);
        marker.setLatLng([latitude,longitude]).addTo(map).bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false }))
        .setPopupContent("A Marker : You are at "+marker.getLatLng().toString())//A Marker : You are within " + radius + " meters from this point
        .openPopup();
        init([latitude, longitude]);
        //return [latitude, longitude];
    },
    (error) => {
        alert(error);
    })
}
}

    let setTimer = () => {
        interval = setInterval(() => {
            clearInterval(interval);
            getCurrentPosition(marker);
            //callbackfn({latlng:new L.latLng(getCurrentPosition())});
            // navigator.geolocation.getCurrentPosition((pos)=>{
            // callbackfn({latlng:[pos.coords.latitude,pos.coords.longitude]});
            // })
        }, update_location_time);
    }

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

    function onLocationFound(e) {
        let radius = e.accuracy;
        marker.setLatLng(e.latlng).update().bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false }))
        .setPopupContent("A Marker : You are at "+marker.getLatLng().toString())//A Marker : You are within " + radius + " meters from this point
        .openPopup();
        map.locate({setView: true, watch:true, maxZoom: 13});
        //map.setView(marker.getLatLng(),13); 
        //alert('Marker has been set to position :'+marker.getLatLng().toString());
        // L.marker(e.latlng).addTo(map)
        //     .bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false }))
        //     .setPopupContent("A Marker : You are within " + radius + " meters from this point")//"A Marker : You are at " + "[ " + latitude + ", " + longitude + " ]"
        //     .openPopup();
        if(e.accuracy){
        L.circle(e.latlng, radius).addTo(map);
        }
    }

    function onLocationError(e) {
        alert(e.message);
    }

        const init = function(coords){
        console.log(coords);
        //map.locate({ setView: true, maxZoom: 16 });//13
      
        map.on('locationfound', onLocationFound);
       
        map.on('locationerror', onLocationError);

        computeDestination(coords[0], coords[1], map);
    
        setTimer();
        };

       
        //const map = L.map('map').setView(coords, 16);//13
        const map = L.map('map').fitWorld();//,{center: coords, zoom: 16}
         //https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png
       
        //map.locate({setView: true, maxZoom: 13});
        const marker = L.marker(map.getCenter(),{draggable:true,zIndexOffset:1000});

        getCurrentPosition(marker);
        const id = 'mapbox/streets-v11';
        const accessToken = 'pk.eyJ1IjoibmltaXNoYTEyMSIsImEiOiJja3hnMTI1b3UzbDBuMndvNXRldnl6M3ZkIn0.a4DDmXkE1ps7BPwwswAxpg'
        L.tileLayer(`https://api.mapbox.com/styles/v1/${id}/tiles/{z}/{x}/{y}?access_token=${accessToken}`, {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 18,
            tileSize: 512,
            zoomOffset: -1,
        }).addTo(map);

        //init(coords);
        
        // map.on('click', function (mapEvent) {
        //     console.log(mapEvent);
        //     const { lat, lng } = mapEvent.latlng;
        //     L.marker([lat, lng]).addTo(map)
        //         .bindPopup(L.popup({ maxWidth: 250, minWidth: 100, autoClose: false, closeOnClick: false }))
        //         .setPopupContent("You clicked the map at " + mapEvent.latlng.toString())
        //         .openPopup();
        // });



