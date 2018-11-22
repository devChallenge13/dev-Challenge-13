import React, { Component } from 'react'
import shortid from 'shortid'
import randomWords from "random-words";
import Map from '../Map'
import ControlPanel from '../ControlPanel'
import Timer from '../Timer'

import './index.css';

const words = [
  "handsome",
  "language",
  "customs",
  "languag",
  "donkey",
  "breeze",
  "later",
  "doubt",
  "tiny",
  "crew",
  "gift",
]

const generateRandomWords = (number) => {
  return randomWords(number)
}

class Index extends Component {
  generateInitialItems = () => {
    return words.map((word) => {
      return {
        word,
        question: generateRandomWords(5).join(' ') + '?',
        id: shortid.generate()
      }
    })
  }

  state = {
    items: this.generateInitialItems(),
    words: null,
    showMode: 'filled',
    player: 1,
    score1: 0,
    score2: 0,
  }

  createItem = () => {
    const { items } = this.state
    const newItems = [...items, {
      id: shortid.generate(),
    }]
    this.setState({
      items: newItems
    })
  }

  changeItem = (id, type, value) => {
    const { items } = this.state
    const newItems = [...items]
    const elem = newItems.find((item) => (item.id === id))
    const index = newItems.indexOf(elem)

    if (type === 'changeWord') {
      elem.word = value
    } else if (type === 'changeQuestion') {
      elem.question = value
    } else if (type === 'delete') {
      newItems.splice(index, 1)
    }

    this.setState({items: newItems})
    console.log(id, value)
  }

  clearItems = () => {
    this.setState({
      items: [],
    })
  }

  generateCrosswordMap = () => {
    const { items } = this.state
    const words = items
      .filter((item) => item.word)
      .map((item) => item.word)

    this.setState({words})
  }

  toggleShowMode = () => {
    this.setState((prevState) => {
      return {
        showMode: prevState.showMode === 'filled' ? 'unfilled': 'filled'
      }
    })
  }

  changeScore = () => {
    const { player } = this.state
    if (player === 1) {
      this.setState((prevState) => {
        return {
          score1: prevState.score1 + 1
        }
      })
    } else {
      this.setState((prevState) => {
        return {
          score2: prevState.score2 + 1
        }
      })
    }
  }

  changePlayer = () => {
    this.setState((prevState) => {
      return {
        player: prevState.player === 1 ? 2 : 1
      }
    })
  }

  startGame = () => {
    this.setState({
      showMode: 'unfilled',
      playMode: true,
    })
  }

  render() {
    const {
      items,
      words,
      showMode,
      playMode,
      score1,
      score2,
    } = this.state

    return (
      <div className="app">
        <div className="app-wrapper">
          <div className="control-wrapper">
            <ControlPanel
              items={items}
              showMode={showMode}
              playMode={playMode}
              createItem={this.createItem}
              changeItem={this.changeItem}
              clearItems={this.clearItems}
              generate={this.generateCrosswordMap}
              toggleShowMode={this.toggleShowMode}
              startGame={this.startGame}
              score1={score1}
              score2={score2}
              changePlayer={this.changePlayer}
            />
          </div>
          <div className="timmer-wrapper">
            {!!playMode && <Timer />}
          </div>
          <div className="map-wrapper">
            <Map
              words={words}
              showMode={showMode}
              playMode={playMode}
              changeScore={this.changeScore}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Index;
