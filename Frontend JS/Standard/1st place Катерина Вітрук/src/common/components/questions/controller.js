export default class QuestionsCtrl {
  constructor(dataService) {
    'ngInject';

    this.dataService = dataService;
  }

  $onInit() {
    this.items = this.dataService.getCrosswordData();
  }
}
