import React, { Component } from 'react'
import DataRow from './components/DataRow'

class ControlPanel extends Component {
  generate = () => {
    const { items, generate } = this.props
    if (!items.length) {
      alert('You should add questions :)')
    } else {
      generate()
    }
  }

  getDataRows = () => {
    const { items } = this.props
    return items.map((item) => (
      <div key={item.id}>
        <DataRow
          item={item}
          changeItem={(...args) => this.props.changeItem(item.id, ...args)}
        />
      </div>
    ))
  }

  render() {
    const { items, playMode, score1, score2 } = this.props
    const { showMode } = this.props
    const dataRows = this.getDataRows()

    const guestions = items.map(({id, question}, i) => (
      <div key={id}>
        {`${i + 1}. ${question}`}
      </div>
    ))

    const content = playMode
      ? (
        <div>
          <div className='guestions'>
            {guestions}
          </div>
          <div className='players'>
            <div>
              player 1: {score1}
            </div>
            <div>
              player 2: {score2}
            </div>
          </div>
          <button onClick={this.props.changePlayer}>change player</button>
        </div>
      )
      : (
        <div>
          <div className="datarow-wrapper">
            {dataRows}
          </div>
          <div className="buttons">
            <button onClick={this.props.createItem}>Add question</button>
            {
              !!items.length &&
              <button onClick={this.props.clearItems}>Clear</button>
            }
            <button onClick={this.props.generate}>Generate</button>
            <button onClick={this.props.toggleShowMode}>
              {showMode === 'filled' ? 'Show Unfilled' : 'Show Filled'}
            </button>
            <button onClick={this.props.startGame}>Play</button>
          </div>
        </div>
      )

    return (
      <div className="control-panel">
        {content}
      </div>
    )
  }
}

export default ControlPanel