angular.module('starter.services', [])
    .factory('apiService', ['$http', '$q', '$timeout', ApiService]);