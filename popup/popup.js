document.addEventListener('DOMContentLoaded', function () {
  const queryList = document.getElementById('queryList');
  const clearButton = document.getElementById('clearButton');
  const downloadButton = document.getElementById('downloadButton');
  const uploadButton = document.getElementById('uploadButton');
  const uploadInput = document.getElementById('uploadInput');

  // 加载并显示存储的数据
  chrome.storage.local.get({ requestParams: [] }, function (result) {
    result.requestParams.slice().reverse().forEach((item, index) => {
      const li = document.createElement('li');
      const timeSpan = document.createElement('span');
      timeSpan.className = 'time';
      timeSpan.textContent = `Time: ${item.time}`;
      const querySpan = document.createElement('span');
      querySpan.className = 'query';
      querySpan.textContent = `${item.query}`;
      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-button';
      // deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', function () {
        // 删除元素
        li.remove();
        // 删除存储的数据
        chrome.storage.local.get({ requestParams: [] }, function (result) {
          const updatedParams = result.requestParams.filter((_, i) => i !== index);
          chrome.storage.local.set({ requestParams: updatedParams }, function () {
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
    chrome.storage.local.clear(function () {
      queryList.innerHTML = '';
      console.log('Local Storage cleared');
    });

    chrome.storage.sync.clear(()=>{
      console.log('Sync Storage cleared');
    });
  });

  // 下载存储的数据
  downloadButton.addEventListener('click', function () {
    chrome.storage.local.get(null, function (items) {
      const dataStr = JSON.stringify(items);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = 'data.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    });
  });

  // 处理文件上传
  uploadButton.addEventListener('click', function () {
    uploadInput.click();
  });

  uploadInput.addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const uploadedData = JSON.parse(e.target.result);
        chrome.storage.local.get({ requestParams: [] }, function (result) {
          const mergedData = result.requestParams.concat(uploadedData.requestParams);
          chrome.storage.local.set({ requestParams: mergedData }, function () {
            console.log('Data merged');
            location.reload(); // 重新加载页面以显示合并的数据
          });
        });
      };
      reader.readAsText(file);
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const openInfoButton = document.getElementById('open-info');
  const wordleButton = document.getElementById('wordleButton');
  
  openInfoButton.addEventListener('click', function() {
    chrome.tabs.create({ url: '/play/game.html' });
  });

  wordleButton.addEventListener('click', function(){
    chrome.tabs.create({url: '/wordle/index.html'})
  })
});
