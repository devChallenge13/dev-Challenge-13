import React, { Component } from 'react';


class Game extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      matrix: this.props.crossword.matrix.map(y => y.map(x => x ? '' : 0)),
      focusedCell: null,
    };
    
    this.onFocusCell = this.onFocusCell.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }
  
  onFocusCell(e) {
    let id;
    
    if (e.target.tagName.toLowerCase() === 'span') {
      id = e.target.parentNode.attributes.id.value;
    } else {
      id = e.target.attributes.id.value;
    }
    
    this.setState({
      focusedCell: id,
    });
  }
  
  onKeyPress(e) {
    function getChar(event) {
      if (event.which == null) {
        if (event.keyCode < 32) return null;
        return String.fromCharCode(event.keyCode)
      }
    
      if (event.which !== 0 && event.charCode !== 0) {
        if (event.which < 32) return null;
        return String.fromCharCode(event.which);
      }
    
      return null;
    }
    
    const { focusedCell, matrix } = this.state;
    const newMatrix = matrix.map(l => l.slice());
    
    let xy = focusedCell.split('-');
    newMatrix[xy[0]][xy[1]] = getChar(e);
    
    this.setState({
      matrix: newMatrix
    })
  }
  
  componentDidMount() {
    document.onkeypress = this.onKeyPress;
  }
  
  componentWillUnmount() {
    document.onkeypress = null;
  }
  
  render() {
    const { onFocusCell } = this;
    const { goHome, crossword } = this.props;
    const { matrix, focusedCell } = this.state;
    
    const isWordStart = (i, j) => {
      return crossword.wordStarts.findIndex(
        arr => arr[1] === i && arr[0] === j
      );
    };
    
    const table = matrix.map((line, i) => {
      return (
        <tr key={i}>
          {line.map((letter, j) => {
            let id = i+'-'+j;
            let wordNumber = isWordStart(i, j) + 1;
            
            return (
              <td key={id} id={id}
                  className={letter === 0 ? 'empty' :
                   id === focusedCell ? 'with-letter focused' : 'with-letter'}
                  onClick={letter !== 0 ? onFocusCell : null}
              >
                {letter === 0 ? '' :
                  (<span className={letter === crossword.matrix[i][j] ? 'correct' : 'incorrect'}>
                    {letter}</span>)
                }
                {wordNumber ? <span className={'word-number'}>{wordNumber}</span> : null}
              </td>
            )
          })}
        </tr>
      )
    });
    
    const verticalQuestions = crossword.verticalQuestions.map((q, i) => {
      return (
        <li key={i}>{(i+1)+'.'+q}</li>
      )
    });
  
    const horizontalQuestions = crossword.horizontalQuestions.map((q, i) => {
      return (
        <li key={i}>{(i+verticalQuestions.length+1)+'.'+q}</li>
      )
    });
    
    return(
      <div className="mdl-card mdl-shadow--2dp">
        <table className={'crossword-table'}>
          <tbody>
            {table}
          </tbody>
        </table>
        <div className="mdl-card__actions mdl-card--border">
          <button className="mdl-button mdl-button--colored"
                  onClick={goHome}
          >
            Go home
          </button>
        </div>
        <div className={'question'}>
          <div className="question-card mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title">
              <h2 className="mdl-card__title-text">Vertical</h2>
            </div>
            <div className="mdl-card__supporting-text">
              <ul>{verticalQuestions}</ul>
            </div>
          </div>
          <div className="question-card mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title">
              <h2 className="mdl-card__title-text">Horizontal</h2>
            </div>
            <div className="mdl-card__supporting-text">
              <ul>{horizontalQuestions}</ul>
            </div>
          </div>
        </div>
        <div className={'info'}>
          Click to choose cell
          (<span className={'correct'}>correct</span>|
          <span className={'incorrect'}>incorrect</span> letter)
        </div>
      </div>
    )
  }
}

export default Game;