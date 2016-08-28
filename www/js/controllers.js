angular.module('starter.controllers', [])

  .controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', AppCtrl])
  .controller('HomeCtrl', ['$scope', '$ionicModal', '$timeout', '$ionicPlatform', '$cordovaGeolocation', '$q', 'apiService', HomeCtrl]);
