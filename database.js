

var firebaseCoords = firebase.database().ref("/meters");
var i = 0;

var meters = [];
firebaseCoords.on('value', function(snapshot){
	var j = 0;
	
	snapshot.forEach(function(data){
		meters[j] = new Array(4);
		meters[j][3] = j+1;
		meters[j][0] = data.child("meterID").val();
		meters[j][1] = data.child("GPS_lat").val();
		meters[j][2] = data.child("GPS_lon").val();
		j++;
	});
console.log(meters);
	// for (i = 0; i<meters.length; i++){
	// 	$("#test").append("<tr><td>" + meters[i][0] + "</td><td>" + meters[i][1] + "</td><td>" 
	//  	+ meters[i][2] +	"</td></tr>");
	// }
	// console.log(meters[1][3]);

	// $("#test").append("<tr><td>" + meterID + "</td><td>" + GPS_lat + "</td><td>" 
	// 	+ GPS_lon +	"</td></tr>");
});

