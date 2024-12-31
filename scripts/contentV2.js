document.addEventListener('keydown',function(event){
    if (event.key== 'Enter') {
        handleContentChange();
    }
})

function getWordsFromSpans() {
    const spans = document.querySelectorAll('div[role="textbox"] span[data-slate-string="true"]');
    const words = Array.from(spans).map(span => span.textContent);
    return words;
  }

let lastWords =[]

function handleContentChange() {
    const currentWords = getWordsFromSpans();
    console.log('Current words:', currentWords);
    
    //对比逻辑，例如与之前的内容进行比较
    const differentLines = [];
    const maxLength = Math.max(currentWords.length, lastWords.length);

    for (let i = 0; i < maxLength; i++) {
        if (lastWords[i] !== currentWords[i]) {
          if (currentWords[i] !== undefined && currentWords[i].length >1) {
            const trimmed = currentWords[i].trim()
            if (trimmed.length > 1) {
                differentLines.push(trimmed);
            }
          }
        }
    }
    lastWords = currentWords

    if (differentLines.length > 0){
        const timestamp = new Date(); 
        chrome.runtime.sendMessage({query: differentLines, time: timestamp.toLocaleString() , ts:timestamp}, function(response) {
            console.log('Message response:', response);
          });      
        console.log("Query: ",differentLines)
      } else {
        console.log('No update found');
    }
    
}

