import angular from 'angular';
import template from './template.html';

export default angular
  .module('app.common.components.crossword', [])
  .directive('crossword', ['crosswordService',function(crosswordService) {
    return {
      restrict: 'E',
      link: function(scope) {
        scope.state = {
          isActive: true
        };

        scope.create = function() {
          crosswordService.create();
          scope.state.isActive = true;
        };

        scope.play = function() {
          crosswordService.play();
          scope.state.isActive = false;
        };
      },
      template
    };
  }]);
