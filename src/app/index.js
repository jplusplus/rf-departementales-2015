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
          mapData : CantonCtrl.resolve.mapData,
          leafletMap : CantonCtrl.resolve.leafletMap
        }
      });

    $urlRouterProvider.otherwise('/france');
  }]).run(['$rootScope', '$window', 'Loader', function($rootScope, $window, Loader) {
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
      Loader.increment();
    });

    $rootScope.$on('$stateChangeError', function() {
      console.debug("ERROR", arguments);
      Loader.decrement();
    });

    $rootScope.$on('$stateChangeSuccess', function() {
      Loader.decrement();
    })

    $rootScope.getT = function() {
      return t;
    };
  }]);
