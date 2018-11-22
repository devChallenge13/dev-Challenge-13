import controller from './controller';

export default {
  controller,
  name: 'questions',
  template: `
    <div class="center">
      <div class="line" ng-repeat="item in $ctrl.items">
        <span>{{$index + 1}}</span>
        <input class="word" type="text" ng-model="item.answer"/>
        <input class="clue" ng-model="item.question"/>
      </div>
		</div>
  `
};
