let hoverIcon;

console.log("Copy js executed");

document.addEventListener('selectionchange', function() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        // 如果已经存在悬浮图标，先移除它
        if (hoverIcon) {
            document.body.removeChild(hoverIcon);
        }

        // 创建新的悬浮图标
        hoverIcon = document.createElement('div');
        hoverIcon.textContent = '📋';
        hoverIcon.style.position = 'absolute';
        const range = window.getSelection().getRangeAt(0).getBoundingClientRect();
        hoverIcon.style.left = `${range.right + window.scrollX}px`;
        hoverIcon.style.top = `${range.top + window.scrollY}px`;
        hoverIcon.style.cursor = 'pointer';
        document.body.appendChild(hoverIcon);

        // console.log(1, selectedText);

        // 添加点击事件
        hoverIcon.addEventListener('click', function() {
            // console.log(selectedText);
            const timestamp = new Date();
            chrome.runtime.sendMessage({ query: selectedText.split("\n"), time: timestamp.toLocaleString(), ts: timestamp,from:"page copy" }, function (response) {
                console.log('Message response:', response);
            });
            // 复制选中的单词到剪贴板
            // navigator.clipboard.writeText(selectedText).then(() => {
            //     console.log('单词已复制到剪贴板');
            // });

            // 保存选中的单词（这里以本地存储为例）
            // const savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
            // savedWords.push(selectedText);
            // localStorage.setItem('savedWords', JSON.stringify(savedWords));
            // console.log('单词已保存');

            // 移除悬浮图标
            document.body.removeChild(hoverIcon);
            hoverIcon = null;
        });
    } else {
        // 如果取消了选择，延迟移除悬浮图标
        setTimeout(() => {
            if (hoverIcon) {
                document.body.removeChild(hoverIcon);
                hoverIcon = null;
            }
        }, 100); // 延迟100毫秒
    }
});
