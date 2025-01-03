// chrome.webRequest.onBeforeRequest.addListener(
//     function(details) {
//       const url = new URL(details.url);
//       const params = new URLSearchParams(url.search);
//       const queryStr= params.get("query")
//       if(queryStr){
//         console.log(queryStr)
//       }

//     },
//     {urls: ["https://fanyi.baidu.com/*"]},
//   );

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.query && message.time) {
    chrome.storage.local.get({ requestParams: [] }, function (result) {
      const requestParams = result.requestParams;
      requestParams.push({ time: message.time, query: message.query, ts: message.ts });
      chrome.storage.local.set({ requestParams: requestParams }, function () {
        console.log('Query parameter saved:', message.query);
        sendResponse({ status: 'success' });
      });
    });
  } else {
    console.log('Invalid message received:', message);
    sendResponse({ status: 'error' });
  }
  return true; // Keep the message channel open for sendResponse
});

