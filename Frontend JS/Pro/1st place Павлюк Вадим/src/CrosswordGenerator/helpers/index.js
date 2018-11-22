export const findWordsIntersections = (word1, word2) => {
  const intersections = []
  word1.split('').forEach((l1, i) => {
    let index = word2.indexOf(l1)
    while(index >= 0) {
      intersections.push({[i]: index})
      index = word2.indexOf(l1, index + 1)
    }
  })
  return intersections
}