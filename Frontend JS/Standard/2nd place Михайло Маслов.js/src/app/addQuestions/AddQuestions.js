import React, { Component } from 'react';


class AddQuestions extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      questions: [],
      answers: [],
      
      questionValue: 'Question...',
      answerValue: 'Answer...'
    };
    
    this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
    this.handleChangeAnswer = this.handleChangeAnswer.bind(this);
    this.addQuestionAndAnswer = this.addQuestionAndAnswer.bind(this);
    this.delQuestionAndAnswer = this.delQuestionAndAnswer.bind(this);
  }
  
  handleChangeQuestion(event) {
    this.setState({ questionValue: event.target.value });
  }
  
  handleChangeAnswer(event) {
    this.setState({ answerValue: event.target.value });
  }
  
  addQuestionAndAnswer() {
    const { questionValue, answerValue } = this.state;
    
    if (questionValue.length && answerValue.length) {
      const newQuestions = this.state.questions.slice();
      const newAnswers = this.state.answers.slice();
      
      newQuestions.push(questionValue);
      newAnswers.push(answerValue);
      
      this.setState({
        questions: newQuestions,
        answers: newAnswers,
        questionValue: 'Question...',
        answerValue: 'Answer...'
      })
    }
  }
  
  delQuestionAndAnswer(i) {
    return () => {
      const newQuestions = this.state.questions.slice();
      const newAnswers = this.state.answers.slice();
  
      newQuestions.splice(i, 1);
      newAnswers.splice(i, 1);
  
      this.setState({
        questions: newQuestions,
        answers: newAnswers,
      })
    };
  }
  
  render() {
    const {
      handleChangeQuestion, handleChangeAnswer,
      addQuestionAndAnswer, delQuestionAndAnswer
    } = this;
    const { questionValue, answerValue, questions, answers } = this.state;
    const { saveHandler } = this.props;
    
    const onSave = questions.length ? saveHandler(questions, answers) : null;
    
    const tr = questions.length ? questions.map((q, i) => {
      return (
        <tr key={i}>
          <td className="mdl-data-table__cell--non-numeric">{q}</td>
          <td className="mdl-data-table__cell--non-numeric">{answers[i]}</td>
          <td className="mdl-data-table__cell">
            <button className="mdl-button mdl-button--colored"
              onClick={delQuestionAndAnswer(i)}
            >
              <i className="material-icons">close</i>
            </button>
          </td>
        </tr>
      )
    }) : null;
    
    return(
      <div className="add-question mdl-card mdl-shadow--2dp">
        <div className="mdl-card__title">
          <h2 className="mdl-card__title-text">Add questions and answers</h2>
        </div>
        <table className="mdl-data-table">
          <thead>
          <tr>
            <th className="mdl-data-table__cell--non-numeric">Question</th>
            <th className="mdl-data-table__cell--non-numeric">Answer</th>
            <th className="mdl-data-table__cell">Delete</th>
          </tr>
          </thead>
          <tbody>{tr}</tbody>
        </table>
        <form className="mdl-card--border">
            <input className="mdl-textfield__input" type="text"
                   value={questionValue} onChange={handleChangeQuestion}
            />
            <input className="mdl-textfield__input" type="text"
                   value={answerValue} onChange={handleChangeAnswer}
            />
        </form>
        <div className="mdl-card__actions">
          <button className="mdl-button mdl-button--colored"
                  onClick={addQuestionAndAnswer}
          >
            Add
          </button>
        </div>
          <button className="save-button mdl-button mdl-button--colored"
                  onClick={onSave}
          >
            Save
          </button>
      </div>
    )
  }
}

export default AddQuestions;