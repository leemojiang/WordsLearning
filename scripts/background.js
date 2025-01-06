//消息函数的处理
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.query && message.time) {
    chrome.storage.sync.get({ requestParams: [] }, function (result) {
      const requestParams = result.requestParams;
      requestParams.push({ time: message.time, query: message.query, ts: message.ts });
      chrome.storage.sync.set({ requestParams: requestParams }, function () {
        console.log('Query parameter saved:', message.query);
        sendResponse({ status: 'success' });
        // message.query.map(x => updateWordCount(x))
      });
    });
  } else {
    console.log('Invalid message received:', message);
    sendResponse({ status: 'error' });
  }
  return true; // Keep the message channel open for sendResponse
});


// function updateWordCount(word) {
//   if (word.trim().split(' ').length > 1) {
//     console.log("Is a sentence")
//     return
//   }

//   chrome.storage.sync.get({ wordCounts: {} }, function (result) {
//     let wordCounts = result.wordCounts;

//     if (wordCounts[word]) {
//       wordCounts[word] += 1;
//     } else {
//       wordCounts[word] = 1;
//     }

//     chrome.storage.sync.set({ wordCounts: wordCounts }, function () {
//       console.log('Word count updated:', wordCounts);
//     });
//   });
// }


function testWordCount(){
  chrome.storage.sync.get(["wordCounts"], function(result){
    console.log(1,result.wordCounts)
  });

  chrome.storage.sync.get({wordCounts:[]}, function(result){
    console.log(2,result.wordCounts)
  });
}

// // 从chrome.storage.local获取数据
// function getLocalStorageData(callback) {
//   chrome.storage.local.get({requestParams:[]}, function(localData) {
//     callback(localData);
//   });
// }

// // 合并数据并存储到chrome.storage.sync
// function mergeAndSyncData() {
//   // 获取chrome.storage.local中的数据
//   getLocalStorageData(function(localData) {
//     // 获取chrome.storage.sync中的数据
//     chrome.storage.sync.get({requestParams:[]}, function(syncData) {
//       // 合并数据
//       list1 = syncData.requestParams;
//       list2 = localData.requestParams;

//       list2.forEach(item => { if (!list1.includes(item)) { list1.push(item); }})
      
//       console.log(list2)
//       console.log(list1)
      
//       // 存储合并后的数据到chrome.storage.sync
//       chrome.storage.sync.set({requestParams:list1}, function() {
//         if (chrome.runtime.lastError) {
//           console.error('Error syncing data:', chrome.runtime.lastError);
//         } else {
//           console.log('Data is successfully merged and synced.');
//         }
//       });
//     });
//   });
// }

// // 调用函数进行数据合并和同步
// mergeAndSyncData();

