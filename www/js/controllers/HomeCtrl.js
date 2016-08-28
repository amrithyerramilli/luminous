function HomeCtrl($scope, $ionicModal, $timeout,$ionicPlatform,$cordovaGeolocation,$q){
 $scope.geolocation = {};

 $scope.$on('$ionicView.enter', function(e) {

     var positionPromise = getCurrentPosition()
            .then(function(geo) {
                $scope.geolocation = geo;
            })
            .then(function() {
                var latLng = new google.maps.LatLng($scope.geolocation.latitude, $scope.geolocation.longitude);
                var mapOptions = {
                    center: latLng,
                    zoom: 11,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
                $scope.map.setCenter(latLng);
                var infowindow = new google.maps.InfoWindow();
                var currentMarker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng
                });
                google.maps.event.addListener(currentMarker, 'click', (function(map, marker) {
                    return function() {
                        infowindow.setContent("You are here :)");
                        infowindow.open(map, marker);
                    }
                })($scope.map, currentMarker));
            });
 });
//  $ionicPlatform.ready(function() {
//       var posOptions = {timeout: 10000, enableHighAccuracy: true}
//      $cordovaGeolocation.getCurrentPosition(posOptions)
//      .then(function (position) {
//       var lat  = position.coords.latitude
//       var long = position.coords.longitude
//       $scope.currentLocation = {latitude : lat, longitude : long};
//     }, function(err) {
//       // error
//     });

//     var watchOptions = {
//     timeout : 3000,
//     enableHighAccuracy: false // may cause errors if true
//   };

//   var watch = $cordovaGeolocation.watchPosition(watchOptions);
//   watch.then(
//     null,
//     function(err) {
//       // error
//     },
//     function(position) {
//       var lat  = position.coords.latitude
//       var long = position.coords.longitude
//       $scope.currentLocation = {latitude : lat, longitude : long};
//   });


// //   watch.clearWatch();
//   // OR
// //   $cordovaGeolocation.clearWatch(watch)
// //     .then(function(result) {
// //       // success
// //       }, function (error) {
// //       // error
// //     });
//  });  

function getCurrentPosition() {
        var positionDeferred = $q.defer();
        $ionicPlatform.ready(function() {
            $timeout(function() {
                // var posOptions = {timeout: 10000, enableHighAccuracy: true}
                // $cordovaGeolocation.getCurrentPosition(posOptions)
                navigator.geolocation.getCurrentPosition(function(position) {
                    var geo = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    positionDeferred.resolve(geo);
                }, function(response) {
                    alert('geolocation error');
                    console.log(response);
                })
            }, 100);
        });

        return positionDeferred.promise;
    }
 
}