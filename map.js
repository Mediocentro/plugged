function initMap() {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 14,
          center: {lat: 29.9695, lng: 76.8383}
        });

        setMarkers(map);
      }

      // Data for the markers consisting of a name, a LatLng and a zIndex for the
      // order in which these markers should display on top of each other.
      var meters = [
        ['NIT Kurukshetra', 29.948685, 76.817305, 1],
        ['Kurukshetra University', 29.959282, 76.817133, 2],
        ['Panorama', 29.966012, 76.833913, 3],
        ['Kessel Mall', 29.970387, 76.836437, 4],
        ['Kalpana Chawal Planetarium', 29.961971, 76.790150, 5]
      ];

      function setMarkers(map) {
        // Adds markers to the map.

        // Marker sizes are expressed as a Size of X,Y where the origin of the image
        // (0,0) is located in the top left of the image.

        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        var image = {
          url: 'electricmeter.jpg',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(20, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };
        for (var i = 0; i < beaches.length; i++) {
          var meter = meters[i];
          var marker = new google.maps.Marker({
            position: {lat: meter[1], lng: meter[2]},
            map: map,
            icon: image,
            shape: shape,
            title: meter[0],
            zIndex: meter[3]
          });
        }
      }
