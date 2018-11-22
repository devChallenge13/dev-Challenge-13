import React, { Component } from 'react'
import './index.css'

class DataRow extends Component {
  render() {
    const { item, changeItem } = this.props
    return (
      <div className={'data-row-wrapper'}>
        <input
          type="text"
          value={item.word}
          onChange={(e) => changeItem('changeWord', e.target.value)}
          placeholder="word"
        />
        <input
          type="text"
          value={item.question}
          placeholder="question"
          className="question-input"
          onChange={(e) => changeItem('changeQuestion', e.target.value)}
        />
        <button onClick={() => changeItem('delete')}>
          delete
        </button>
      </div>
    )
  }
}

export default DataRow
