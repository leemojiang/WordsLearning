
let words = [];
let currentIndex = 0;

let wordsDic ={};
let unknownWords={};

const wordContainer = document.getElementById('word-container');
const knownButton = document.getElementById('known');
const unknownButton = document.getElementById('unknown');
const wordCanvas = document.getElementById('wordCanvas');
const unKnownCanvas = document.getElementById('unKnownCanvas');


function wordDic2WordCloud(wordDict_,container){
  let wordCloudData = []; 
  for (let word in wordDict_) { 
    if (wordDict_.hasOwnProperty(word)) { 
      wordCloudData.push([word, wordDict_[word]]); 
    } 
  } 
  // WordCloud(canvas, { list: wordCloudData });
  // 使用WordCloud.js生成词云图 
  WordCloud(container, {
    list: wordCloudData,
    gridSize: Math.round(16 * container.offsetWidth / 1024),
    weightFactor: function (size) {
      return size * 15
      return Math.pow(size, 2.3) * container.offsetWidth / 1024;
    },
    fontFamily: 'Times, serif',
    color: 'random-dark',
    rotateRatio: 0.5,
    rotationSteps: 2,
    backgroundColor: '#f0f0f0',
    drawOutOfBound: false
  });
}



document.addEventListener('DOMContentLoaded', function () {
  // 从本地存储获取单词列表
  chrome.storage.sync.get(['wordCounts', 'unknowCounts'], function (result) {
    wordsDic = result.wordCounts || {};
    unknownWords = result.unknowCounts || {}; //unknown word list

    let wl = Object.keys(wordsDic).sort((a, b) => wordsDic[b] - wordsDic[a]) //decending sorted word list
    let uwl = Object.keys(unknownWords).sort((a, b) => unknownWords[b] - unknownWords[a])
    words = uwl.concat(wl)

    wordDic2WordCloud(wordsDic,wordCanvas);
    wordDic2WordCloud(unknownWords,unKnownCanvas);

    showWord();
  });

  // 处理按键操作
  knownButton.addEventListener('click', function () {
    updateFrequency(true);
  });

  unknownButton.addEventListener('click', function () {
    updateFrequency(false);
  });
});

document.addEventListener('keydown', function (event) {
  if (event.code === 'Space') { updateFrequency(true); }
  else if (event.code === 'KeyU') { updateFrequency(false); }
});


// 显示当前单词
function showWord() {
  if (words.length > 0) {
    wordContainer.textContent = words[currentIndex];
    console.log("Show",words[currentIndex]);
  } else {
    wordContainer.textContent = 'No words available';
  }
}

// 更新单词频率
function updateFrequency(isKnown) {
  // 保存更新后的单词列表
  chrome.storage.sync.get({ unknowCounts: {} }, function (result) {
    let unknowCounts = result.unknowCounts;
    let word = words[currentIndex];

    console.log("Known word ",word,isKnown)

    if (isKnown) {
      if (unknowCounts[word]) {
        unknowCounts[word] -= 1;
        if (unknowCounts[word] <= 0) {
          delete unknowCounts[word];
        }

      }
    } else {
      if (unknowCounts[word]) {
        unknowCounts[word] += 1;
      } else {
        unknowCounts[word] = 1;
      }
    }

    wordDic2WordCloud(unknowCounts,unKnownCanvas);

    chrome.storage.sync.set({ unknowCounts: unknowCounts }, function () {
      console.log('Unknown count updated:', unknowCounts);
    });

    // 显示下一个单词
    currentIndex = (currentIndex + 1) % words.length;
    showWord();
  });


}

