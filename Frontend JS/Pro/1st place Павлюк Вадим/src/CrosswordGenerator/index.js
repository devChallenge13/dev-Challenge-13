import { findWordsIntersections } from './helpers'
const randomWords = require('random-words')

export const generateRandomWords = (number) => {
  return randomWords(number)
}

const matrixSize = 30
const analysedWords = []

const filledCells = new Array(matrixSize)
for (let i = 0; i < filledCells.length; i++) {
  filledCells[i] = new Array(matrixSize).fill(0)
}

const updateFilledCells = (newWord) => {
  const { word, x, y, type } = newWord

  const centerX = Math.floor(filledCells.length / 2)
  const centerY = Math.floor(filledCells.length / 2)

  let i = centerY - y, j = centerX + x
  word.split('').forEach((l) => {
    filledCells[i][j] = l
    i = type === 'v' ? i + 1 : i
    j = type === 'h' ? j + 1 : j
  })

  console.log('updateFilledCells', JSON.stringify(filledCells))
}

const tryUpdateFilledCells = (newWord) => {
  const { word, x, y, type } = newWord

  const centerX = Math.floor(filledCells.length / 2)
  const centerY = Math.floor(filledCells.length / 2)

  let i = centerY - y, j = centerX + x

  i = type === 'v' ? i - 1 : i
  j = type === 'h' ? j - 1 : j

  return word.split('').every((l) => {
    i = type === 'v' ? i + 1 : i
    j = type === 'h' ? j + 1 : j

    console.log('compare', filledCells[i][j], l)

    // check if cell is empty or has the same value
    return (
      filledCells[i][j] === 0 ||
      filledCells[i][j] === l
    )
  })
}

class Word {
  constructor(word, type, x, y, commonLetter) {
    this.word = word
    this.type = type
    this.x = x
    this.y = y
    this.commonLetter = commonLetter

    console.log('newWord', this)
  }
}

export const researchWords = (words) => {
  analysedWords.length = 0
  if (!words) {
    words = ["handsome", "language", "customs", "languag", "donkey", "breeze", "later", "doubt", "tiny", "crew", "gift"]
  }
  // const words = ["handsome", "languagp", 'lafssd']
  const sordedWords = words.sort((a, b) => b.length - a.length)

  sordedWords.forEach((word) => {
    wordAnalyse(word)
  })

  console.log(analysedWords)
  return analysedWords
}



// take a next word and find intersections with a placed words
const wordAnalyse = (word) => {
  console.log('current word', word)
  if (!analysedWords.length) {
    const newAnalysedWord = new Word(word,'h', 0, 0)
    analysedWords.push(newAnalysedWord)
    updateFilledCells(newAnalysedWord)
    return
  }

  analysedWords.some((analysedWord) => {
    console.log('check with:', analysedWord.word)
    // find intersection
    const commonLetterIndexes = findWordsIntersections(analysedWord.word, word)
    const hasIntersections = commonLetterIndexes.length

    // getinfo
    if (hasIntersections) {
      return commonLetterIndexes.some((commonLetterIndexObj) => {

        console.log('commonLetterIndexObj', commonLetterIndexObj)
        const indexOfLetterByWord = Object.values(commonLetterIndexObj)[0]
        const indexOfLetterByAnalysedWord = Object.keys(commonLetterIndexObj)[0]

        const letter = word[indexOfLetterByWord]

        const type = analysedWord.type === 'h' ? 'v' : 'h'

        console.log('analysedWord.type', analysedWord.type)
        console.log('indexOfLetterByAnalysedWord', indexOfLetterByAnalysedWord)
        console.log('indexOfLetterByWord', indexOfLetterByWord)

        const relx = analysedWord.type === 'h'
          ? analysedWord.x + +indexOfLetterByAnalysedWord
          : analysedWord.x - indexOfLetterByWord

        const rely = analysedWord.type === 'h'
          ? analysedWord.y + +indexOfLetterByWord
          : analysedWord.y - indexOfLetterByAnalysedWord

        console.log('relx', relx)
        console.log('rely', rely)

        const newAnalysedWord = new Word(word, type, relx, rely, letter)
        const canBePlaced = tryUpdateFilledCells(newAnalysedWord)

        console.log('canBePlaced:', canBePlaced)

        if (canBePlaced) {
          analysedWords.push(newAnalysedWord)
          updateFilledCells(newAnalysedWord)
          return true
        }
      })
    }
  })
}



export const makeMatrix = (analysedWords) => {
  const martix = new Array(matrixSize)
  for (let i = 0; i < martix.length; i++) {
    martix[i] = new Array(matrixSize).fill(0)
  }

  const centerX = Math.floor(martix.length / 2)
  const centerY = Math.floor(martix.length / 2)

  analysedWords.forEach((analysedWord) => {
    const { word, x, y, type } = analysedWord
    let i = centerY - y, j = centerX + x
    word.split('').forEach((l) => {
      martix[i][j] = l
      i = type === 'v' ? i + 1 : i
      j = type === 'h' ? j + 1 : j
    })
  })

  console.log(martix)

  return martix
}

// researchWords()
// console.log(analysedWords)