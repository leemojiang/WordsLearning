document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get({requestParams: []}, function(result) {
      const queryList = document.getElementById('queryList');
      result.requestParams.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `Time: ${item.time}, Query: ${item.query}`;
        queryList.appendChild(li);
      });
    });
  });
  