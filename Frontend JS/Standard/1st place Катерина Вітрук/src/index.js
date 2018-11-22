import './styles.scss';
import 'bootstrap';

import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import common from 'common';

angular.module('app', [uiRouter, common.name]).config(($locationProvider) => {
  'ngInject';

  $locationProvider.html5Mode(true);
});
