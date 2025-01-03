//消息函数的处理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.query && message.time) {
    chrome.storage.local.get({ requestParams: [] }, function (result) {
      const requestParams = result.requestParams;
      requestParams.push({ time: message.time, query: message.query, ts: message.ts });
      chrome.storage.local.set({ requestParams: requestParams }, function () {
        console.log('Query parameter saved:', message.query);
        sendResponse({ status: 'success' });
        message.query.map(x => updateWordCount(x))
      });
    });
  } else {
    console.log('Invalid message received:', message);
    sendResponse({ status: 'error' });
  }
  return true; // Keep the message channel open for sendResponse
});


function updateWordCount(word) {
  if (word.trim().split(' ').length > 1) {
    console.log("Is a sentence")
    return
  }

  chrome.storage.local.get({ wordCounts: {} }, function (result) {
    let wordCounts = result.wordCounts;

    if (wordCounts[word]) {
      wordCounts[word] += 1;
    } else {
      wordCounts[word] = 1;
    }

    chrome.storage.local.set({ wordCounts: wordCounts }, function () {
      console.log('Word count updated:', wordCounts);
    });
  });
}


function testWordCount(){
  chrome.storage.local.get(["wordCounts"], function(result){
    console.log(1,result.wordCounts)
  });

  chrome.storage.local.get({wordCounts:[]}, function(result){
    console.log(2,result.wordCounts)
  });
}


