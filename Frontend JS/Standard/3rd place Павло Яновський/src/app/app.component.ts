import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { AppState } from './app.service';
import 'jquery';
import 'jquery-ui-dist/jquery-ui';
import * as $ from 'jquery';
export const ROOT_SELECTOR = 'app';

@Component({
  selector: ROOT_SELECTOR,
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.scss',
    './../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css',
    './../../node_modules/devextreme/dist/css/dx.common.css',
    './../../node_modules/devextreme/dist/css/dx.light.compact.css'
  ],
  templateUrl: 'app.component.html',
  providers: []
})
export class AppComponent implements OnInit {

  // базові запитання і відповідді в масиві wordsLibrary
  public wordsLibrary: object[] = [
    {question: '1', answer: 'one'},
    {question: '2', answer: 'two'},
    {question: '3', answer: 'three'},
    {question: '4', answer: 'four'},
    {question: '5', answer: 'five'},
    {question: '6', answer: 'six'},
    {question: '7', answer: 'seven'},
    {question: '8', answer: 'eight'},
    {question: '9', answer: 'nine'},
    {question: '10', answer: 'ten'}
  ];
  public sortedLibrary: Object[] = [];

  public cwSizeX = 50;
  public cwSizeY = 50;
  public cellSize = 20;
  public wordBank = [];
  public wordsActive = [];
  public mainWordBoardLibrary = []; // board

  constructor(
    public appState: AppState
  ) {}

  public createGrid() {
      let canv = <HTMLCanvasElement> document.getElementById('my-canvas');
      let ctx = canv.getContext("2d");
      canv.width= this.cwSizeX*this.cellSize;
      canv.height = this.cwSizeY*this.cellSize;
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'black';
      for (var row = 0; row < this.cwSizeX; row++) {
          for (var column = 0; column < this.cwSizeY; column++) {
              var x = column * this.cellSize;
              var y = row * this.cellSize;
              ctx.rect(x, y, this.cellSize, this.cellSize);
              ctx.fill();
              ctx.stroke();
             }
         }
    ctx.closePath();
  }

  public prepareWordBoardLibrary(){
    this.wordBank=[];
    
    for(var i = 0; i < this.sortedLibrary.length; i++){
      this.wordBank.push({
        string: this.sortedLibrary[i]['answer'],
        char: this.sortedLibrary[i]['answer'].split(""),
        totalMatches: 0,
        effectiveMatches: 0,
        successfulMatches: [] 
      });
    }
    
    for(i = 0; i < this.wordBank.length; i++){
      for(var j = 0, wA=this.wordBank[i]; j<wA.char.length; j++){
        for(var k = 0, cA=wA.char[j]; k<this.wordBank.length; k++){
          for(var l = 0,wB=this.wordBank[k]; k!==i && l<wB.char.length; l++){
            wA.totalMatches += (cA === wB.char[l])?1:0;
          }
        }
      }
    }  
  }

  public addWordsToMainWordBoardLibrary(){
    // let i, len, curIndex, curWord, curChar, curMatch, testWord, testChar, 
    //     minMatchDiff = 9999, curMatchDiff;  
    let curIndex, curWord, curChar, curMatch, testWord, testChar, 
    minMatchDiff = 9999, curMatchDiff;  
  
    if (this.wordsActive.length < 1){
      curIndex = 0;
      for(let i = 0; i < this.wordBank.length; i++){
        if (this.wordBank[i].totalMatches < this.wordBank[curIndex].totalMatches){
          curIndex = i;
        }
      }
      console.log('test current wordBank item', this.wordBank[curIndex]);
      this.wordBank[curIndex]['successfulMatches'] = [];
      this.wordBank[curIndex]['successfulMatches'].push({'x':12,'y':20,'dir':0});
    }
    else { 
      console.log('test addWordsToMainWordBoardLibrary');
      curIndex = -1;
      
      for(let i = 0; i < this.wordBank.length; i++) {
        curWord = this.wordBank[i];
        curWord.effectiveMatches = 0;
        curWord.successfulMatches = [];
        for(let j = 0; j < curWord.char.length; j++){
          curChar = curWord.char[j];
          for (let k = 0; k < this.wordsActive.length; k++){
            testWord = this.wordsActive[k];
            for (let l = 0; l < testWord.char.length; l++){
              testChar = testWord.char[l];            
              if (curChar === testChar){
                curWord.effectiveMatches++;
                
                var curCross = {x:testWord.x,y:testWord.y,dir:0};              
                if(testWord.dir === 0){                
                  curCross.dir = 1;
                  curCross.x += l;
                  curCross.y -= j;
                } 
                else{
                  curCross.dir = 0;
                  curCross.y += l;
                  curCross.x -= j;
                }
                
                var isMatch = true;
                
                for(var m = -1; m < curWord.char.length + 1; m++){
                  var crossVal = [];
                  if (m !== j){
                    if (curCross.dir === 0){
                      var xIndex = curCross.x + m;
                      
                      if (xIndex < 0 || xIndex > this.mainWordBoardLibrary.length){
                        isMatch = false;
                        break;
                      }
                      
                      crossVal.push(this.mainWordBoardLibrary[xIndex][curCross.y]);
                      crossVal.push(this.mainWordBoardLibrary[xIndex][curCross.y + 1]);
                      crossVal.push(this.mainWordBoardLibrary[xIndex][curCross.y - 1]);
                    }
                    else{
                      var yIndex = curCross.y + m;
                      
                      if (yIndex < 0 || yIndex > this.mainWordBoardLibrary[curCross.x].length){
                        isMatch = false;
                        break;
                      }
                      
                      crossVal.push(this.mainWordBoardLibrary[curCross.x][yIndex]);
                      crossVal.push(this.mainWordBoardLibrary[curCross.x + 1][yIndex]);
                      crossVal.push(this.mainWordBoardLibrary[curCross.x - 1][yIndex]);
                    }
  
                    if(m > -1 && m < curWord.char.length-1){
                      if (crossVal[0] !== curWord.char[m]){
                        if (crossVal[0] !== null){
                          isMatch = false;                  
                          break;
                        }
                        else if (crossVal[1] !== null){
                          isMatch = false;
                          break;
                        }
                        else if (crossVal[2] !== null){
                          isMatch = false;                  
                          break;
                        }
                      }
                    }
                    else if (crossVal[0] !== null){
                      isMatch = false;                  
                      break;
                    }
                  }
                }
                
                if (isMatch === true){                
                  curWord.successfulMatches.push(curCross);
                }
              }
            }
          }
        }
        
        curMatchDiff = curWord.totalMatches - curWord.effectiveMatches;
        
        if (curMatchDiff<minMatchDiff && curWord.successfulMatches.length>0){
          curMatchDiff = minMatchDiff;
          curIndex = i;
        }
        else if (curMatchDiff <= 0){
          return false;
        }
      }
    }
    
    if (curIndex === -1){
      return false;
    }
      
    var spliced = this.wordBank.splice(curIndex, 1);
    this.wordsActive.push(spliced[0]);
    console.log('test wordsActive', this.wordsActive);
    
    var pushIndex = this.wordsActive.length - 1,
        rand = Math.random(),
        matchArr = this.wordsActive[pushIndex].successfulMatches,
        matchIndex = Math.floor(rand * matchArr.length),  
        matchData = matchArr[matchIndex];
    
    this.wordsActive[pushIndex].x = matchData.x;
    this.wordsActive[pushIndex].y = matchData.y;
    this.wordsActive[pushIndex].dir = matchData.dir;
    
    for(let i = 0; i < this.wordsActive[pushIndex].char.length; i++){
      var xIndex = matchData.x,
          yIndex = matchData.y;
      
      if (matchData.dir === 0){
        xIndex += i;    
        this.mainWordBoardLibrary[xIndex][yIndex] = this.wordsActive[pushIndex].char[i];
      }
      else{
        yIndex += i;  
        this.mainWordBoardLibrary[xIndex][yIndex] = this.wordsActive[pushIndex].char[i];
      }
      
      // Bounds.Update(xIndex,yIndex);
    }
      
    return true;
  }

  public generateCrossWord() {
    console.log('test wordsLibray', this.wordsLibrary);
    // let sortedLibrary = Object.assign({}, this.wordsLibrary);
    // sortedLibrary.sort(this.compare);
    // let sortedLibrary = [...this.wordsLibrary];
    this.sortedLibrary = JSON.parse(JSON.stringify(this.wordsLibrary))
    this.sortedLibrary.sort((a,b) => (a['answer'] > b['answer']) ? 1 : ((b['answer'] > a['answer']) ? -1 : 0)); 
    console.log('test sortedLibrary', this.sortedLibrary);
  }

  public rebuildHelper() {
    for(let i=0; i < this.wordBank.length; i++){
      this.addWordsToMainWordBoardLibrary();
    }
  }

  public rebuildCW() {
    console.log('test rebuild');

    this.mainWordBoardLibrary = [];
    // this.wordBank = [];
    this.wordsActive = [];
    for(let i = 0; i < this.cwSizeX; i++){
      this.mainWordBoardLibrary.push([]);
      for(var j = 0; j < this.cwSizeX; j++){
        this.mainWordBoardLibrary[i].push(null);
      }
    }

    this.generateCrossWord();
    this.prepareWordBoardLibrary();
    console.log('test wordBank', this.wordBank);
    // for(let i=0; i < this.wordBank.length; i++){
    //   this.addWordsToMainWordBoardLibrary();
    // }
    this.rebuildHelper();
    console.log('test mainWordBoardLibrary', this.mainWordBoardLibrary);

     // Оптимізуємо масив - видаляємо зайві комірки)
    for (let i = 0; i < this.mainWordBoardLibrary.length; i++) {
      let deleteRow = true;
      for (let j = 0; j < this.mainWordBoardLibrary[i].length; j++) {
        if (this.mainWordBoardLibrary[i][j] !== null) {
          deleteRow = false;
        }
      }
      if (deleteRow) {
        this.mainWordBoardLibrary.splice(i, 1);
        i--;
      }
    }
    //
    // 

    this.cwSizeX = this.mainWordBoardLibrary.length;
    this.cwSizeY = this.mainWordBoardLibrary[0].length;
    this.createGrid();
    let canv = <HTMLCanvasElement> document.getElementById('my-canvas');
    let ctx = canv.getContext("2d");

    // Відображаємо сгенерований кроссворд на дошці
    for (let i = 0; i < this.mainWordBoardLibrary.length; i++) {
      for (let j = 0; j < this.mainWordBoardLibrary[i].length; j++) {
        if (this.mainWordBoardLibrary[i][j] !== null) {
          ctx.beginPath();
          ctx.fillStyle = "white";
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'black';
          ctx.rect(Math.floor(i)*this.cellSize,
                    Math.floor(j)*this.cellSize,
                    this.cellSize, this.cellSize);
                  ctx.fill();
                  ctx.stroke();
          ctx.closePath();
          // 

          ctx.font="12px Verdana";
          ctx.fillStyle = "black";
          ctx.fillText(this.mainWordBoardLibrary[i][j], (Math.floor(i)*this.cellSize)+7,
                    (Math.floor(j)*this.cellSize) + 14,this.cellSize);

        } else {
          ctx.fillStyle = "black";

          ctx.fillRect(Math.floor(i)*this.cellSize,
               Math.floor(j)*this.cellSize,
               this.cellSize, this.cellSize);
        }
      }
    }
  }

  public ngOnInit() {
    this.rebuildCW();
  }
}
