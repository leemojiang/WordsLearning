document.addEventListener('DOMContentLoaded', function() {
  const queryList = document.getElementById('queryList');
  const clearButton = document.getElementById('clearButton');
  const downloadButton = document.getElementById('downloadButton');

  // 加载并显示存储的数据
  chrome.storage.local.get({requestParams: []}, function(result) {
    result.requestParams.forEach(item => {
      const li = document.createElement('li');
      const timeSpan = document.createElement('span');
      timeSpan.className = 'time';
      timeSpan.textContent = `Time: ${item.time}`;
      const querySpan = document.createElement('span');
      querySpan.className = 'query';
      querySpan.textContent = `${item.query}`;
      li.appendChild(timeSpan);
      li.appendChild(querySpan);
      queryList.appendChild(li);
    });
  });

  // 清空存储和列表
  clearButton.addEventListener('click', function() {
    chrome.storage.local.clear(function() {
      queryList.innerHTML = '';
      console.log('Storage cleared');
    });
  });

  // 下载存储的数据
  downloadButton.addEventListener('click', function() {
    chrome.storage.local.get(null, function(items) {
      const dataStr = JSON.stringify(items);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = 'data.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    });
  });
});
