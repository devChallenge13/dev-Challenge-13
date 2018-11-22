import DataService from './data';
import CrosswordService from './crossword';

export default angular
  .module('app.common.services', [])
  .factory('dataService', DataService)
  .factory('crosswordService', CrosswordService);
