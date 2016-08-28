function HomeCtrl($scope, $ionicModal, $timeout, $ionicPlatform, $cordovaGeolocation, $q, apiService) {
    $scope.geolocation = {};
    $scope.user = { id: 1, name: "AY", availableResources: 10500 };
    var apiParams = { userId: $scope.user.id, lat : $scope.geolocation.lat, lng : $scope.geolocation.lng };
    function errorHandler(response) {
        console.error(response);
        alert("Oops, an error occurred.");
    }
    $scope.$on('$ionicView.enter', onViewEnter);
    $scope.markHomeTerritory = markHomeTerritory;
    $scope.buildArmy = buildArmy;

    function markHomeTerritory() {
        console.log("Marking home territory for current location");
        apiService.markHomeT(apiParams).then(function succ(resp) {
            console.log("Home territory is marked.. lefTop is")
            console.log(resp);
            var corners = getCorners(resp.lat, resp.lng);
            drawBoundingRect(corners, $scope);
            // /isMine - userId, geolocation : responds true/false - indicates that the T belongs to the user
            // if false, call desc_square : returns the "cost, resource, etc" for the place.
            // if enough resources, buy
            // /buy

        }, errorHandler)
            .then(function () {
                apiService.isMine(apiParams).then(function succ(resp) {
                    if (!resp) {
                        return apiService.descSquare(apiParams);
                    }

                }, errorHandler)
            })
            .then(function () {
                // popup with resource info
                alert("Click to buy");
            }, errorHandler);
    }

    function buildArmy(){
        // WikitudeFactory.callARView(ind);
    }




    function onViewEnter(e) {
        var positionPromise = getCurrentPosition()
            .then(function (geo) {
                $scope.geolocation = geo;
            })
            .then(function () {
                var latLng = new google.maps.LatLng($scope.geolocation.latitude, $scope.geolocation.longitude);
                var mapOptions = {
                    center: latLng,
                    zoom: 14,
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
                google.maps.event.addListener(currentMarker, 'click', (function (map, marker, scop) {
                    return function () {
                        var markHomeT = "<span class='ion-ios-home'></span>";
                        infowindow.setContent(markHomeT);
                        infowindow.open(map, marker);
                    }
                })($scope.map, currentMarker, $scope));
            });
    }
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
        $ionicPlatform.ready(function () {
            $timeout(function () {
                // var posOptions = {timeout: 10000, enableHighAccuracy: true}
                // $cordovaGeolocation.getCurrentPosition(posOptions)
                navigator.geolocation.getCurrentPosition(function (position) {
                    var geo = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    positionDeferred.resolve(geo);
                }, function (response) {
                    alert('geolocation error');
                    console.log(response);
                })
            }, 100);
        });

        return positionDeferred.promise;
    }

    function getCorners(lat, long) {
        var corners = [];
        lat = Math.round(lat * 100);
        long = Math.round(long * 100);
        var offset = 1;
        corners.push([lat / 100, long / 100]);
        corners.push([lat / 100, (long + offset) / 100]);
        corners.push([(lat + offset) / 100, long / 100]);
        corners.push([(lat + offset) / 100, (long + offset) / 100]);
        return corners;
    };

    function drawBoundingRect(corners, $scope) {
        var currentRectangle = new google.maps.Rectangle();
        currentRectangle.setOptions({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: $scope.map,
            bounds: {
                north: corners[0][0],
                south: corners[2][0],
                east: corners[1][1],
                west: corners[0][1]
            }
        });
    }

}