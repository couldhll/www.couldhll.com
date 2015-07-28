'use strict';

angular.module('myApp.about', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: 'about/about.html',
            controller: 'aboutViewController'
        });
    }])

    .controller('aboutViewController', [function() {

    }]);