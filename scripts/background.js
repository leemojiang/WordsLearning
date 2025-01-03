//消息函数的处理
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

