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

  const queryStr = getDifferentPart(lastQuery,queryValue)
  if (queryStr && queryValue[queryValue.length-1]=='\n'){
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

function getDifferentPartIndex(str1, str2) {
  const minLength = Math.min(str1.length, str2.length);

  let clIndex = 0; //change line index
  let index = 0;

  for (let i = 0; i < minLength; i++) {
    index = i
    if ( str1[i] == str2[i]) {
      if( str1[i] == '\n'){
        clIndex = i
      }
    }else{
      break
    }
  }

  return clIndex;
}

function getDifferentPart(oldStr, newStr) {
  const index = getDifferentPartIndex(oldStr, newStr);
  console.log(index,oldStr)
  console.log(index,newStr)
  return newStr.substring(index).trim().toLowerCase();
}
