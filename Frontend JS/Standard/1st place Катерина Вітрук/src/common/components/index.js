import angular from 'angular';

import QuestionModule from './questions';
import CrosswordModule from './crossword';

export default angular.module('app.common.components', [QuestionModule.name, CrosswordModule.name]);