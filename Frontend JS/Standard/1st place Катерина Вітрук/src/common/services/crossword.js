import angular from 'angular';

export default function CrosswordService() {
  'ngInject';

  const Bounds = {
    top: 0, right: 0, bottom: 0, left: 0,

    update(x,y) {
      this.top = Math.min(y,this.top);
      this.right = Math.max(x,this.right);
      this.bottom = Math.max(y,this.bottom);
      this.left = Math.min(x,this.left);
    },

    clean() {
      this.top = 999;
      this.right = 0;
      this.bottom = 0;
      this.left = 999;
    }
  };
  let board, wordArr, wordBank, wordsActive, mode;

  function Play() {
    cleanCells();
    mode = 0;
    toggleInputBoxes(false);
  }

  function Create() {
    if (mode === 0) {
      toggleInputBoxes(true);
      document.getElementById('crossword').innerHTML = boardToHtml(' ');
      mode = 1;
    } else {
      getWordsFromInput();

      for(var i = 0, isSuccess = false; i < 10 && !isSuccess; i++) {
        cleanVars();
        isSuccess = populateBoard();
      }

      document.getElementById('crossword').innerHTML = (isSuccess) ? boardToHtml(' ') : 'Failed to find crossword.' ;
    }
  }

  function cleanCells() {
    const letterArr = angular.element(document).find('.letter');

    angular.forEach(letterArr, (letter) => {
      letter.innerHTML = `<input class='char' type='text' maxlength='1'></input>`;
    });
  }

  // crossword manipulation
  function toggleInputBoxes(active) {
    const answers = angular.element(document).find('.word'),
          questions = angular.element(document).find('.clue');

    angular.forEach(answers, (answer) => {
      angular.forEach(questions, (question) => {
        if (active) {
          removeClass(answer, 'hide');
          removeClass(question, 'clueReadOnly');
          question.disabled = '';
        } else {
          addClass(answer, 'hide');
          addClass(question, 'clueReadOnly');
          question.disabled = 'readonly';
        }
      });
    });
  }

  function getWordsFromInput() {
    wordArr = [];
    for(let i = 0,val,w = angular.element(document).find('.word');i < w.length;i++) {
      val = w[i].value.toUpperCase();
      if (val !== null && val.length > 1) {wordArr.push(val);}
    }
  }

  function cleanVars() {
    Bounds.clean();
    wordBank = [];
    wordsActive = [];
    board = [];

    for(let i = 0; i < 32; i++) {
      board.push([]);
      for(let j = 0; j < 32; j++) {
        board[i].push(null);
      }
    }
  }

  function populateBoard() {
    prepareBoard();

    for(var i = 0, isOk = true, len = wordBank.length; i < len && isOk; i++) {
      isOk = addWordToBoard();
    }
    return isOk;
  }

  function prepareBoard() {
    wordBank = [];

    for(var i = 0, len = wordArr.length; i < len; i++) {
      wordBank.push(new WordObj(wordArr[i]));
    }

    for(i = 0; i < wordBank.length; i++) {
      for(let j = 0, wA = wordBank[i]; j < wA.char.length; j++) {
        for(let k = 0, cA = wA.char[j]; k < wordBank.length; k++) {
          for(let l = 0,wB = wordBank[k]; k !== i && l < wB.char.length; l++) {
            wA.totalMatches += (cA === wB.char[l]) ? 1 : 0;
          }
        }
      }
    }
  }

  function addWordToBoard() {
    var i, len, curIndex, curWord, curChar, curMatch, testWord, testChar,
        minMatchDiff = 9999, curMatchDiff;

    if(wordsActive.length < 1) {
      curIndex = 0;
      for(i = 0, len = wordBank.length; i < len; i++) {
        if (wordBank[i].totalMatches < wordBank[curIndex].totalMatches) {
          curIndex = i;
        }
      }
      wordBank[curIndex].successfulMatches = [{x: 12,y: 12,dir: 0}];
    } else{
      curIndex = -1;

      for(i = 0, len = wordBank.length; i < len; i++) {
        curWord = wordBank[i];
        curWord.effectiveMatches = 0;
        curWord.successfulMatches = [];
        for(var j = 0, lenJ = curWord.char.length; j < lenJ; j++) {
          curChar = curWord.char[j];
          for (var k = 0, lenK = wordsActive.length; k < lenK; k++) {
            testWord = wordsActive[k];
            for (var l = 0, lenL = testWord.char.length; l < lenL; l++) {
              testChar = testWord.char[l];
              if (curChar === testChar) {
                curWord.effectiveMatches++;

                var curCross = {x: testWord.x,y: testWord.y,dir: 0};
                if(testWord.dir === 0) {
                  curCross.dir = 1;
                  curCross.x += l;
                  curCross.y -= j;
                } else{
                  curCross.dir = 0;
                  curCross.y += l;
                  curCross.x -= j;
                }

                var isMatch = true;

                for(var m = -1, lenM = curWord.char.length + 1; m < lenM; m++) {
                  var crossVal = [];
                  if (m !== j) {
                    if (curCross.dir === 0) {
                      var xIndex = curCross.x + m;

                      if (xIndex < 0 || xIndex > board.length) {
                        isMatch = false;
                        break;
                      }

                      crossVal.push(board[xIndex][curCross.y]);
                      crossVal.push(board[xIndex][curCross.y + 1]);
                      crossVal.push(board[xIndex][curCross.y - 1]);
                    } else{
                      var yIndex = curCross.y + m;

                      if (yIndex < 0 || yIndex > board[curCross.x].length) {
                        isMatch = false;
                        break;
                      }

                      crossVal.push(board[curCross.x][yIndex]);
                      crossVal.push(board[curCross.x + 1][yIndex]);
                      crossVal.push(board[curCross.x - 1][yIndex]);
                    }

                    if(m > -1 && m < lenM - 1) {
                      if (crossVal[0] !== curWord.char[m]) {
                        if (crossVal[0] !== null) {
                          isMatch = false;
                          break;
                        } else if (crossVal[1] !== null) {
                          isMatch = false;
                          break;
                        } else if (crossVal[2] !== null) {
                          isMatch = false;
                          break;
                        }
                      }
                    } else if (crossVal[0] !== null) {
                      isMatch = false;
                      break;
                    }
                  }
                }

                if (isMatch === true) {
                  curWord.successfulMatches.push(curCross);
                }
              }
            }
          }
        }

        curMatchDiff = curWord.totalMatches - curWord.effectiveMatches;

        if (curMatchDiff < minMatchDiff && curWord.successfulMatches.length > 0) {
          curMatchDiff = minMatchDiff;
          curIndex = i;
        } else if (curMatchDiff <= 0) {
          return false;
        }
      }
    }

    if (curIndex === -1) {
      return false;
    }

    var spliced = wordBank.splice(curIndex, 1);
    wordsActive.push(spliced[0]);

    var pushIndex = wordsActive.length - 1,
        rand = Math.random(),
        matchArr = wordsActive[pushIndex].successfulMatches,
        matchIndex = Math.floor(rand * matchArr.length),
        matchData = matchArr[matchIndex];

    wordsActive[pushIndex].x = matchData.x;
    wordsActive[pushIndex].y = matchData.y;
    wordsActive[pushIndex].dir = matchData.dir;

    for(i = 0, len = wordsActive[pushIndex].char.length; i < len; i++) {
      var xIndex = matchData.x,
          yIndex = matchData.y;

      if (matchData.dir === 0) {
        xIndex += i;
        board[xIndex][yIndex] = wordsActive[pushIndex].char[i];
      } else{
        yIndex += i;
        board[xIndex][yIndex] = wordsActive[pushIndex].char[i];
      }

      Bounds.update(xIndex,yIndex);
    }

    return true;
  }

  function boardToHtml() {
    for (var i = Bounds.top - 1, str = ''; i < Bounds.bottom + 2; i++) {
      str += '<div class=\'row\'>';
      for (var j = Bounds.left - 1; j < Bounds.right + 2; j++) {
        str += BoardCharToElement(board[j][i]);
      }
      str += '</div>';
    }
    return str;
  }

  function BoardCharToElement(c) {
    const arr = (c) ? ['square','letter'] : ['square'];
    return eleStr('div',[{a: 'class',v: arr}],c);
  }

  function WordObj(stringValue) {
    this.string = stringValue;
    this.char = stringValue.split('');
    this.totalMatches = 0;
    this.effectiveMatches = 0;
    this.successfulMatches = [];
  }

  // helping functions
  function eleStr(e,c,h) {
    h = (h) ? h : '';
    for(var i = 0,s = '<' + e + ' '; i < c.length; i++) {
      s += c[i].a + '=\'' + arrayToString(c[i].v,' ') + '\' ';
    }
    return (s + '>' + h + '</' + e + '>');
  }

  function arrayToString(a,s) {
    if (a === null || a.length < 1) {return '';}
    if (s === null) {s = ',';}
    for(var r = a[0],i = 1;i < a.length;i++) {r += s + a[i];}
    return r;
  }

  function addClass(ele, classStr) {
    ele.className = ele.className.replaceAll(' ' + classStr,'') + ' ' + classStr;
  }

  function removeClass(ele,classStr) {
    ele.className = ele.className.replaceAll(' ' + classStr,'');
  }

  String.prototype.replaceAll = function(replaceThis, withThis) {
    var re = new RegExp(replaceThis,'g');
    return this.replace(re, withThis);
  };

  return {
    create: Create,
    play: Play
  };
}
