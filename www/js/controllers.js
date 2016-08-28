angular.module('starter.controllers', [])

.controller('AppCtrl',['$scope', '$ionicModal', '$timeout', AppCtrl])
.controller('HomeCtrl',['$scope', '$ionicModal', '$timeout','$ionicPlatform' ,'$cordovaGeolocation','$q', HomeCtrl])
.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
