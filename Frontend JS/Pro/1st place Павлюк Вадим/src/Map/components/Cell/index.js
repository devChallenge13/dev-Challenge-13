import React, { Component } from 'react'
import './index.css'

class Cell extends Component {
  render() {
    const { value, showMode, playMode, rightAnswer } = this.props
    let className = value ? "cell active-cell" : "cell"
    if (rightAnswer) {
      className += ' rigth-cell'
    }
    
    const content = !playMode || !value
      ? (
        <div>
          {showMode === 'filled' && value}    
        </div>
      )
      : (
        <input
          type="text"
          className={className}
          onChange={(e) => this.props.onChange(e.target.value)}
        />
      )

    return (
      <div className={className}>
        {content}
      </div>
    )
  }
}

export default Cell
