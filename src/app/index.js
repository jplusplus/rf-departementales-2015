'use strict';

angular.module('departementales2015', ['ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'leaflet-directive'])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .state('home.france', {
        url: 'france?t',
        templateUrl: 'app/main/france/france.html',
        controller: 'FranceCtrl',
        reloadOnSearch: true,
        resolve: {
          chartData : FranceCtrl.resolve.chartData,
          geojson : FranceCtrl.resolve.geojson,
          mapData : FranceCtrl.resolve.mapData
        }
      })
      .state('home.dpt', {
        url: 'france/:dpt?t',
        templateUrl: 'app/main/dpt/dpt.html',
        controller: 'DptCtrl',
        reloadOnSearch: true,
        resolve: {
          chartData : DptCtrl.resolve.chartData,
          geojson : DptCtrl.resolve.geojson,
          dptGeoJson : DptCtrl.resolve.dptGeoJson,
          mapData : DptCtrl.resolve.mapData
        }
      })
      .state('home.canton', {
        url: 'france/:dpt/:canton?t&ll',
        templateUrl: 'app/main/canton/canton.html',
        controller: 'CantonCtrl',
        reloadOnSearch: true,
        resolve: {
          chartData : CantonCtrl.resolve.chartData,
          geojson : CantonCtrl.resolve.geojson,
          mapData : CantonCtrl.resolve.mapData
        }
      });

    $urlRouterProvider.otherwise('/france');
  }]).run(['$rootScope', '$window', function($rootScope, $window) {
    var t = 1;

    var computeT = function(toParams) {
      if (toParams.t != null) {
        t = parseInt(toParams.t);
      } else if ($window.localStorage.getItem('t') != null) {
        t = parseInt($window.localStorage.getItem('t'));
      }
      $window.localStorage.setItem('t', t);
    }

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
      computeT(toParams);
    });

    $rootScope.$on('$stateChangeError', function() {
      console.debug("ERROR", arguments);
    });

    $rootScope.getT = function() {
      return t;
    }
  }]);
