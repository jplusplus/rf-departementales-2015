'use strict';

angular.module('departementales2015')
  .controller('MainCtrl', ['$scope', '$state', function ($scope, $state) {
    if ($state.is('home')) {
        $state.go('home.france')
    }
  }]);
