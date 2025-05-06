function initMap() {
    var location = { lat: -22.64975677694833, lng: -50.437603360476636 };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}

window.initMap = initMap;
