document.addEventListener('DOMContentLoaded', function() {
    const wordContainer = document.getElementById('word-container');
    const knownButton = document.getElementById('known');
    const unknownButton = document.getElementById('unknown');
  
    let words = [];
    let currentIndex = 0;
  
    // 从本地存储获取单词列表
    chrome.storage.local.get(['words'], function(result) {
      words = result.words || [];
      showWord();
    });
  
    // 显示当前单词
    function showWord() {
      if (words.length > 0) {
        wordContainer.textContent = words[currentIndex].word;
      } else {
        wordContainer.textContent = 'No words available';
      }
    }
  
    // 处理按键操作
    knownButton.addEventListener('click', function() {
      updateFrequency(true);
    });
  
    unknownButton.addEventListener('click', function() {
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
        chrome.storage.local.set({ words: words }, function() {
          // 显示下一个单词
          currentIndex = (currentIndex + 1) % words.length;
          showWord();
        });
      }
    }
  });
  