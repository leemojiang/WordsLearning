
let words = [];
let currentIndex = 0;

const wordContainer = document.getElementById('word-container');
const knownButton = document.getElementById('known');
const unknownButton = document.getElementById('unknown');


document.addEventListener('DOMContentLoaded', function () {
  // 从本地存储获取单词列表
  chrome.storage.local.get(['wordCounts', 'unknowCounts'], function (result) {
    let wc = result.wordCounts || {};
    let uwc = result.unknowCounts || {}; //unknown word list

    console.log(uwc)
    console.log(wc)

    let wl = Object.keys(wc).sort((a, b) => wc[b] - wc[a]) //decending sorted word list
    let uwl = Object.keys(uwc).sort((a, b) => uwc[b] - uwc[a])
    words = uwl.concat(wl)
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
  chrome.storage.local.get({ unknowCounts: {} }, function (result) {
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

    chrome.storage.local.set({ unknowCounts: unknowCounts }, function () {
      console.log('Unknown count updated:', unknowCounts);
    });

    // 显示下一个单词
    currentIndex = (currentIndex + 1) % words.length;
    showWord();
  });


}

