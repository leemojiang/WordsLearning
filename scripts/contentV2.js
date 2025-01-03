document.addEventListener('keydown', function (event) {
  if (event.key == 'Enter') {
    handleContentChange();
  }
})

function getWordsFromSpans() {
  const spans = document.querySelectorAll('div[role="textbox"] span[data-slate-string="true"]');
  const words = Array.from(spans).map(span => span.textContent).map(item => item.trim()).filter(item => item.length > 1);
  return words;
}

let lastWords = []

function handleContentChange() {
  const currentWords = getWordsFromSpans();
  console.log('Current words:', currentWords);

  //对比逻辑，例如与之前的内容进行比较
  const differentLines = findDifferences(currentWords, lastWords);
  lastWords = currentWords

  if (differentLines.length > 0) {
    const timestamp = new Date();
    chrome.runtime.sendMessage({ query: differentLines, time: timestamp.toLocaleString(), ts: timestamp }, function (response) {
      console.log('Message response:', response);
    });
    console.log("Query: ", differentLines)
  } else {
    console.log('No update found');
  }

}

function findDifferences(currentList, lastList) {
  // let currentList1 = currentList.map(item => item.trim()).filter(item => item.length > 1 ); 
  // let lastList1 = lastList.map(item => item.trim()).filter(item => item.length > 1 ); 

  let setPrev = new Set(lastList)
  let setCur = new Set(currentList)

  let differences = [...setCur].filter(x => !setPrev.has(x))
  return differences
}

