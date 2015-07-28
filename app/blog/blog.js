'use strict';

angular.module('myApp.blog', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/blog', {
            templateUrl: 'blog/blog.html',
            controller: 'blogViewController'
        });
    }])

    .controller('blogViewController', [function() {

    }]);