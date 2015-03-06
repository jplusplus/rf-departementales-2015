'use strict';

angular.module('departementales2015', ['ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'leaflet-directive'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('home.france', {
        url: 'france/',
        templateUrl: 'app/main/france/france.html',
        controller: 'FranceCtrl',
        resolve: {
          chartData : FranceCtrl.resolve.chartData,
          geojson : FranceCtrl.resolve.geojson
        }
      });

    $urlRouterProvider.otherwise('/france/');
  });
