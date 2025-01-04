document.addEventListener('DOMContentLoaded', function () {
  const queryList = document.getElementById('queryList');
  const clearButton = document.getElementById('clearButton');
  const downloadButton = document.getElementById('downloadButton');

  // 加载并显示存储的数据
  chrome.storage.sync.get({ requestParams: [] }, function (result) {
    result.requestParams.forEach((item, index) => {
      const li = document.createElement('li');
      const timeSpan = document.createElement('span');
      timeSpan.className = 'time';
      timeSpan.textContent = `Time: ${item.time}`;
      const querySpan = document.createElement('span');
      querySpan.className = 'query';
      querySpan.textContent = `${item.query}`;
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function () {
        // 删除元素
        li.remove();
        // 删除存储的数据
        chrome.storage.sync.get({ requestParams: [] }, function (result) {
          const updatedParams = result.requestParams.filter((_, i) => i !== index);
          chrome.storage.sync.set({ requestParams: updatedParams }, function () {
            console.log('Item deleted');
          });
        });
      });
      li.appendChild(timeSpan);
      li.appendChild(querySpan);
      li.appendChild(deleteButton);
      queryList.appendChild(li);
    });
  });

  // 清空存储和列表
  clearButton.addEventListener('click', function () {
    chrome.storage.sync.clear(function () {
      queryList.innerHTML = '';
      console.log('Storage cleared');
    });
  });

  // 下载存储的数据
  downloadButton.addEventListener('click', function () {
    chrome.storage.sync.get(null, function (items) {
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

document.addEventListener('DOMContentLoaded', function() {
  const openInfoButton = document.getElementById('open-info');

  openInfoButton.addEventListener('click', function() {
    chrome.tabs.create({ url: '/play/game.html' });
  });
});
