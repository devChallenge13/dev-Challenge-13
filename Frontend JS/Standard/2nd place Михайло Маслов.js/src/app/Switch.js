import React from 'react';
import * as status from './constans/AppStatus';
import Game from './game/Game';
import HelloMenu from './helloMenu/HelloMenu';
import CreateCrossword from './createCrossword/CreateCrossword';
import AddQuestions from './addQuestions/AddQuestions';


const Switch = props => {
  const { appStatus, changeStatus, addCrossword, crossword } = props;
  
  const changeStatusOn = newStatus => () => {
    changeStatus(newStatus);
  };
  
  switch (appStatus) {
    case status.ADD_QUESTIONS: {
      const saveHandler = (questions, answers) => () => {
        addCrossword(questions, answers);
        changeStatusOn(status.CREATE_CROSSWORD)();
      };
      
      return (
        <AddQuestions saveHandler={saveHandler}/>
      )
    }
    case status.CREATE_CROSSWORD: {
      return (
        <CreateCrossword goHome={changeStatusOn(status.HELLO_MENU)}/>
      )
    }
    case status.GAME: {
      return (
        <Game
          crossword={crossword}
          goHome={changeStatusOn(status.HELLO_MENU)}
        />
      )
    }
    default : {
      return (
        <HelloMenu
          createCrossword={changeStatusOn(status.ADD_QUESTIONS)}
          gameCrossword={changeStatusOn(status.GAME)}
        />
      )
    }
  }
};

export default Switch;