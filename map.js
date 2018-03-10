function initMap() {
        var myLatLng = {lat: 29.9695, lng: 76.8783};
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 4,
          center: myLatLng
        });
        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          title: 'You are here!'
        });
}
