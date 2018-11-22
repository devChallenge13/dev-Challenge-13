import React, { Component } from 'react'
import { researchWords, makeMatrix } from '../CrosswordGenerator'
import Cell from './components/Cell'

import './index.css'

class Map extends Component {
  state = {
    isLoaded: false,
    matrix: null,
    rightAnswers: null,
  }

  componentDidMount() {
    const analysedWords = researchWords()
    const matrix = makeMatrix(analysedWords)
    const rightAnswers = []
    matrix.forEach((row, i) => {
      rightAnswers[i] = []
      row.forEach((cell, j) => {
        rightAnswers[i][j] = false
      })
    })

    this.setState({
      isLoaded: true,
      matrix,
      rightAnswers,
    })
  }

  componentWillReceiveProps(newProps) {
    if (newProps.words && newProps.words !== this.props.words) {
      const analysedWords = researchWords(newProps.words)
      const matrix = makeMatrix(analysedWords)

      this.setState({
        isLoaded: true,
        matrix
      })
    }
  }

  onChangeCellValue = (i, j, value) => {
    const { matrix, rightAnswers } = this.state

    const newRightAnswers = [...rightAnswers]

    if (matrix[i][j] === value) {
      newRightAnswers[i][j] = true
      this.props.changeScore()
    }

    this.setState({rightAnswers: newRightAnswers})
    console.log(i, j, value)

  }

  render () {
    const { isLoaded, matrix, rightAnswers } = this.state
    const { showMode, playMode } = this.props

    if (!isLoaded) return null

    const rows = matrix.map((row, i) => {
      const cells = row.map((cell, j) => {
        return (
          <div key={`${i}-${j}`}>
            <Cell
              value={matrix[i][j] || ''}
              showMode={showMode}
              playMode={playMode}
              rightAnswer={rightAnswers[i][j]}
              onChange={(value) => this.onChangeCellValue(i, j, value)}
            />
          </div>
        )
      })
      return (
        <div key={i} className="row">
          {cells}
        </div>
      )
    })

    return (
      <div>
        {rows}
      </div>
    )
  }
}

export default Map