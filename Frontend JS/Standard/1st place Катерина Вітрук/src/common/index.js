import angular from 'angular';

import commonServices from './services';
import commonComponents from './components';

export default angular.module('app.common', [commonServices.name, commonComponents.name]);
