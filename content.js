// 监听URL变化
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    handleUrlChange(url);
  }
}).observe(document, {subtree: true, childList: true});

// 处理URL变化
function handleUrlChange(url) {
  const params = new URLSearchParams(new URL(url).search);
  const queryValue = params.get('query');
  if (queryValue) {
    const timestamp = new Date().toLocaleString(); 
    chrome.runtime.sendMessage({query: queryValue, time: timestamp}, function(response) {
        console.log('Message response:', response);
      });      
    console.log(queryValue)
  } else {
    console.log('No query parameter found in URL:', url);
  }
}
