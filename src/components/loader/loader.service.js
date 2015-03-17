"use strict";

angular.module('departementales2015')
    .factory('Loader', [function () {
        function Loader() {
            this.body = angular.element('body');
            this.body.append($('<div>').attr('class', 'progress-container').append($('<div>').attr('class', 'progress-container__spinner')));

            this.progress = angular.element('.progress-container');

            this.n = 0;

            this.increment = function() {
                ++this.n;
                this.showLoaderIfNeeded();
            };

            this.decrement = function() {
                if (this.n > 0) {
                    --this.n;
                    this.showLoaderIfNeeded();
                }
            };

            this.showLoaderIfNeeded = function() {
                this.progress.toggleClass('progress-container--active', this.n > 0);
                this.body.toggleClass('body--progress-active', this.n > 0);
            }

        }
        return new Loader();
    }]);