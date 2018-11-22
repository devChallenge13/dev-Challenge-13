import React, { Component } from 'react';
import { HELLO_MENU } from './constans/AppStatus';
import Switch from './Switch';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appStatus: HELLO_MENU,
      crosswords: [{
        verticalQuestions: [
          'Спортивная игра в мяч, при которой используется ракетка.',
          'Спортивная игра в мяч, который бросают через сетку.',
          'Спортивная командная игра на льду.',
          'Спортивная игра в мяч ногами.'
        ],
        horizontalQuestions: [
          'Спортивная игра с мячом овальной формы.',
          'Спортивная игра в мяч, который бросают в специальное приспособление на столбе.'
        ],
        wordStarts: [[10, 0], [7, 1], [3, 5], [5, 5], [6, 4], [0, 7]],
        matrix: [
          [null, null, null, null, null, null, null, null, null, null, 'т'],
          [null, null, null, null, null, null, null, 'в', null, null, 'е'],
          [null, null, null, null, null, null, null, 'о', null, null, 'н'],
          [null, null, null, null, null, null, null, 'л', null, null, 'н'],
          [null, null, null, null, null, null, 'р', 'е', 'г', 'б', 'и'],
          [null, null, null, 'х', null, 'ф', null, 'й', null, null, 'с'],
          [null, null, null, 'о', null, 'у', null, 'б', null, null, null],
          ['б', 'а', 'с', 'к', 'е', 'т', 'б', 'о', 'л', null, null],
          [null, null, null, 'к', null, 'б', null, 'л', null, null, null],
          [null, null, null, 'е', null, 'о', null, null, null, null, null],
          [null, null, null, 'й', null, 'л', null, null, null, null, null]
        ]
      }]
    };
    
    this.changeStatus = this.changeStatus.bind(this);
    this.addCrossword = this.addCrossword.bind(this);
  }
  
  addCrossword(questions, answers) {
    // const newCrosswords = this.state.crosswords.splice();
    // newCrosswords.push({ questions, answers: answers.map(a => a.toLowerCase())});
    //
    // this.setState({
    //   crosswords: newCrosswords
    // });
  }
  
  changeStatus(newStatus) {
    this.setState({
      appStatus: newStatus
    });
  }
  
  render() {
    const { changeStatus, addCrossword, state } = this;
    const { appStatus, crosswords } = state;
    
    return (
      <Switch appStatus={appStatus}
              changeStatus={changeStatus}
              addCrossword={addCrossword}
              crossword={crosswords[0]}
      />
    );
  }
}

export default App;
