let hoverIcon;
let isEnabled = true; // 添加启用状态标志

// 添加防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 处理选择文本的主函数
function handleSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    // 如果功能被禁用，直接返回
    if (!isEnabled) {
        if (hoverIcon) {
            document.body.removeChild(hoverIcon);
            hoverIcon = null;
        }
        return;
    }

    // 检查选择的文本长度，避免处理过短的选择
    if (selectedText && selectedText.length > 1) {
        if (hoverIcon) {
            document.body.removeChild(hoverIcon);
        }

        const range = selection.getRangeAt(0).getBoundingClientRect();
        
        // 创建新的悬浮图标，并优化定位
        hoverIcon = document.createElement('div');
        hoverIcon.textContent = '📋';
        hoverIcon.style.position = 'fixed'; // 改用 fixed 定位
        hoverIcon.style.left = `${range.right + 5}px`; // 添加少许偏移
        hoverIcon.style.top = `${range.top}px`;
        hoverIcon.style.cursor = 'pointer';
        hoverIcon.style.zIndex = '10000'; // 确保图标总是可见
        document.body.appendChild(hoverIcon);

        hoverIcon.addEventListener('click', function() {
            const timestamp = new Date();
            chrome.runtime.sendMessage({
                query: selectedText.split("\n"),
                time: timestamp.toLocaleString(),
                ts: timestamp,
                from: "page copy"
            }, function(response) {
                console.log('Message response:', response);
            });
            
            document.body.removeChild(hoverIcon);
            hoverIcon = null;
        });
    } else if (!selectedText && hoverIcon) {
        document.body.removeChild(hoverIcon);
        hoverIcon = null;
    }
}

// 使用防抖处理选择变化事件
document.addEventListener('selectionchange', debounce(handleSelection, 200));

// 监听来自 background 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleEnabled') {
        isEnabled = request.enabled;
        if (!isEnabled && hoverIcon) {
            document.body.removeChild(hoverIcon);
            hoverIcon = null;
        }
        sendResponse({ success: true });
    }
});