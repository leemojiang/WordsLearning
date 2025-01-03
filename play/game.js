
let words = [];
let currentIndex = 0;

const wordContainer = document.getElementById('word-container');
const knownButton = document.getElementById('known');
const unknownButton = document.getElementById('unknown');


document.addEventListener('DOMContentLoaded', function () {
  // 从本地存储获取单词列表
  chrome.storage.local.get(['wordCounts'], function (result) {
    let dic = result.wordCounts || {};
    words = Object.keys(dic)
    console.log(words)
    showWord();
  });

  // 显示当前单词
  function showWord() {
    if (words.length > 0) {
      wordContainer.textContent = words[currentIndex];
      console.log(words[currentIndex])
    } else {
      wordContainer.textContent = 'No words available';
    }
  }

  // 处理按键操作
  knownButton.addEventListener('click', function () {
    updateFrequency(true);
  });

  unknownButton.addEventListener('click', function () {
    updateFrequency(false);
  });

  // 更新单词频率
  function updateFrequency(isKnown) {
    if (words.length > 0) {
      if (isKnown) {
        words[currentIndex].frequency--;
      } else {
        words[currentIndex].frequency++;
      }

      // 保存更新后的单词列表
      chrome.storage.local.set({ words: words }, function () {
        // 显示下一个单词
        currentIndex = (currentIndex + 1) % words.length;
        showWord();
        console.log("Storage update")
      });
    }
  }

  function updateWords(){
    // 显示下一个单词
    currentIndex = (currentIndex + 1) % words.length;
    showWord();
  }
});
