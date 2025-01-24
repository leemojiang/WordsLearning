import { WORDS,words5,words6 } from "./words.js";
import { dic } from "./dictionary.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextLetter = 0;
// let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
let rightGuessString;
let wordLength;
let wordList=[];
let wordsDic = {}

// 替换初始化随机单词的逻辑
function initGame(selectedLength = null) {
  chrome.storage.sync.get(['requestParams'], function (result) {
    const requestParams = result.requestParams || [];


    function updateWordCount(word) {
      if (word.trim().split(' ').length > 1) {
        console.log("Is a sentence");
        return;
      }

      word = word.toLowerCase();

      if (wordsDic[word]) {
        wordsDic[word] += 1;
      } else {
        wordsDic[word] = 1;
      }

      return;
    }
    // 从所有查询的单词中随机选择一个
    requestParams.map(q => q.query.map(x => updateWordCount(x)));

    // 获取所有可用的单词长度
    const availableLengths = [...new Set([3, 4, 5, 6, 7, 8, ...Object.keys(wordsDic).map(word => word.length)])].sort((a, b) => a - b);

    

    // 如果没有指定长度，使用第一个可用长度
    if (!selectedLength || !availableLengths.includes(selectedLength)) {
      selectedLength = availableLengths[0];
    }
    wordLength = selectedLength;
    updateLengthButtons(availableLengths)

    // 过滤指定长度的单词
    const filteredWords = Object.keys(wordsDic).filter(word => word.length === selectedLength);
    
    if (filteredWords.length === 0) {
      toastr.error(`No ${selectedLength}-letter words found!`);
      toastr.info(`Use random word from Dictionary.`)
      initGameWithRandomWord();
      return;
    }
    
    // 选择随机单词
    rightGuessString = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    

    // // 从词典中获取所有单词
    // const allWords = Object.keys(wordsDic);

    // rightGuessString = allWords[Math.floor(Math.random() * allWords.length)];
    // wordLength = rightGuessString.length;

    // 重置游戏状态
    guessesRemaining = NUMBER_OF_GUESSES;
    currentGuess = [];
    nextLetter = 0;
    wordList = filteredWords;

    // 初始化游戏板
    initBoard();
    console.log('Selected word:', rightGuessString); // 用于调试
  });
}

function updateLengthButtons(availableLengths) {
  const container = document.getElementById('length-buttons');
  container.innerHTML = ''; // 清空现有按钮

  availableLengths.forEach(length => {
    const button = document.createElement("button");
    button.textContent = length;
    button.className = "length-button";
    if (length === wordLength) {
      button.classList.add("active");
    }
    button.addEventListener("click", () => initGame(length));
    container.appendChild(button);
  });
}

// 修改 initBoard 函数以适应不同长度的单词
function initBoard() {
  let board = document.getElementById("game-board");
  board.innerHTML = ''; // 清空现有板子

  for (let i = 0; i < NUMBER_OF_GUESSES + 1; i++) {
    let row = document.createElement("div");
    row.className = "letter-row";
    if (i == NUMBER_OF_GUESSES) {
      // Hint line
      row.style.visibility = "hidden";
    }
    for (let j = 0; j < wordLength; j++) {
      let box = document.createElement("div");
      box.className = "letter-box";
      row.appendChild(box);
    }

    board.appendChild(row);
  }
}

// 添加提示功能
function giveHint() {
  let rows = document.getElementsByClassName("letter-row");
  //插入 Hint 行
  let row = rows[NUMBER_OF_GUESSES];
  row.style.visibility = "visible"

  // 随机选择一个位置显示提示
  const position = Math.floor(Math.random() * wordLength);
  const hintLetter = rightGuessString[position];

  // 在对应位置显示提示字母
  let box = row.children[position];
  animateCSS(box, "pulse");
  box.textContent = hintLetter;
  box.classList.add("filled-box");

}

// 添加从 dic 中随机选词的函数
function initGameWithRandomWord() {
    // 从 dic 中筛选指定长度的单词
    let filteredDicWords
    if (wordLength){
      filteredDicWords = dic.filter(word => word.length === wordLength);
    }else{
      filteredDicWords = dic;
    }
    
    
    if (filteredDicWords.length === 0) {
      toastr.error(`No ${wordLength}-letter words found in dictionary!`);
      return;
    }
    
    // 选择随机单词
    rightGuessString = filteredDicWords[Math.floor(Math.random() * filteredDicWords.length)];
    
    // 重置游戏状态
    guessesRemaining = NUMBER_OF_GUESSES;
    currentGuess = [];
    nextLetter = 0;
    
    // 重新初始化游戏板
    initBoard();
    console.log('Selected random word from dictionary:', rightGuessString);
}

function shadeKeyBoard(letter, color) {
  for (const elem of document.getElementsByClassName("keyboard-button")) {
    if (elem.textContent === letter) {
      let oldColor = elem.style.backgroundColor;
      if (oldColor === "green") {
        return;
      }

      if (oldColor === "yellow" && color !== "green") {
        return;
      }

      elem.style.backgroundColor = color;
      break;
    }
  }
}

function deleteLetter() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter - 1];
  box.textContent = "";
  box.classList.remove("filled-box");
  currentGuess.pop();
  nextLetter -= 1;
}

function checkGuess() {
  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let guessString = currentGuess.join('');
  let rightGuess = Array.from(rightGuessString);

  if (guessString.length != wordLength) {
    toastr.error("Not enough letters!");
    return;
  }

  if (guessString.length == 5 & !wordList.includes(guessString) & !words5.includes(guessString) ) {
    toastr.error("Word not in list!");
    return;
  }

  if (guessString.length == 6 & !wordList.includes(guessString) & !words6.includes(guessString) ) {
    toastr.error("Word not in list!");
    return;
  }

  if ( !wordList.includes(guessString) & !dic.includes(guessString) ){
    toastr.error("Word not in list!");
    return;
  }

  var letterColor = new Array(wordLength).fill("gray");

  //check green
  for (let i = 0; i < wordLength; i++) {
    if (rightGuess[i] == currentGuess[i]) {
      letterColor[i] = "green";
      rightGuess[i] = "#";
    }
  }

  //check yellow
  //checking guess letters
  for (let i = 0; i < wordLength; i++) {
    if (letterColor[i] == "green") continue;

    //checking right letters
    for (let j = 0; j < 5; j++) {
      if (rightGuess[j] == currentGuess[i]) {
        letterColor[i] = "yellow";
        rightGuess[j] = "#";
      }
    }
  }

  for (let i = 0; i < wordLength; i++) {
    let box = row.children[i];
    let delay = 250 * i;
    setTimeout(() => {
      //flip box
      animateCSS(box, "flipInX");
      //shade box
      box.style.backgroundColor = letterColor[i];
      shadeKeyBoard(guessString.charAt(i) + "", letterColor[i]);
    }, delay);
  }

  if (guessString === rightGuessString) {
    toastr.success("You guessed right! Game over!");
    guessesRemaining = 0;
    return;
  } else {
    guessesRemaining -= 1;
    currentGuess = [];
    nextLetter = 0;

    if (guessesRemaining === 0) {
      toastr.error("You've run out of guesses! Game over!");
      toastr.info(`The right word was: "${rightGuessString}"`);
    }
  }
}

function insertLetter(pressedKey) {
  if (nextLetter === wordLength) {
    return;
  }
  pressedKey = pressedKey.toLowerCase();

  let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining];
  let box = row.children[nextLetter];
  animateCSS(box, "pulse");
  box.textContent = pressedKey;
  box.classList.add("filled-box");
  currentGuess.push(pressedKey);
  nextLetter += 1;
}

const animateCSS = (element, animation, prefix = "animate__") =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element;
    node.style.setProperty("--animate-duration", "0.3s");

    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve("Animation ended");
    }

    node.addEventListener("animationend", handleAnimationEnd, { once: true });
  });

document.addEventListener("keyup", (e) => {
  if (guessesRemaining === 0) {
    return;
  }

  let pressedKey = String(e.key);
  if (pressedKey === "Backspace" && nextLetter !== 0) {
    deleteLetter();
    return;
  }

  if (pressedKey === "Enter") {
    checkGuess();
    return;
  }

  let found = pressedKey.match(/[a-z]/gi);
  if (!found || found.length > 1) {
    return;
  } else {
    insertLetter(pressedKey);
  }
});

document.getElementById("keyboard-cont").addEventListener("click", (e) => {
  const target = e.target;

  if (!target.classList.contains("keyboard-button")) {
    return;
  }
  let key = target.textContent;

  if (key === "Del") {
    key = "Backspace";
  }

  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});

// 初始化游戏
document.addEventListener('DOMContentLoaded', function () {
  initGame();

  // 添加揭秘按钮事件
  document.querySelector('.reveal-button').addEventListener('click', () => {
    toastr.info(`Right Answer: "${rightGuessString}"`);
  });

  // 添加提示按钮事件
  document.querySelector('.hint-button').addEventListener('click', giveHint);

  // 添加随机词典单词按钮事件
  document.querySelector('.random-dic-button').addEventListener('click', () => {
    initGameWithRandomWord();
    toastr.info('New random word selected from dictionary!');
  });
});
