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

let lastQuery = '';

function handleUrlChange(url) {
  const params = new URLSearchParams(new URL(url).search);
  const queryValue = params.get('query');

  const queryStr = getDifferentLines(lastQuery,queryValue)
  if (queryStr.length > 0 && queryValue[queryValue.length-1]=='\n'){
    const timestamp = new Date().toLocaleString(); 
    chrome.runtime.sendMessage({query: queryStr, time: timestamp}, function(response) {
        console.log('Message response:', response);
      });      
    console.log("Query: ",queryStr)
  } else {
    console.log('No query parameter found in URL:', url);
  }

  lastQuery = queryValue
}

function getDifferentLines(str1, str2) {
  const lines1 = str1.split('\n'); //old str
  const lines2 = str2.split('\n'); //new str
  const differentLines = [];

  const maxLength = Math.max(lines1.length, lines2.length);

  for (let i = 0; i < maxLength; i++) {
    if (lines1[i] !== lines2[i]) {
      // if (lines1[i] !== undefined) {
      //   differentLines.push(lines1[1]);
      // }
      if (lines2[i] !== undefined && lines2[i].length >0) {
        differentLines.push(lines2[i]);
      }
    }
  }
  return differentLines;
}

// 示例用法
const str1 = 'Modular\nabc\n\nedg\n';
const str2 = 'Modular\nabc\n\nedg\nccf\n';
const differentLines = getDifferentLines(str1, str2);
console.log('不同的行:', differentLines);
