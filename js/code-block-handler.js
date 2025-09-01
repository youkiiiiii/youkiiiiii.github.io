// 处理代码块的函数
function initCodeBlocks() {
    console.log('Initializing code blocks');
    const CODE_MAX_HEIGHT = 320;
    // 调整选择器以匹配 Hexo 的 highlight.js 输出
    const codeBlocks = document.querySelectorAll('.highlight:not([data-processed])');
    console.log('Found code blocks:', codeBlocks.length);
    
    codeBlocks.forEach((block, index) => {
        // 标记为已处理，避免重复处理
        block.setAttribute('data-processed', 'true');

        const wrapper = document.createElement('div');
        wrapper.className = 'highlight-container';
        block.parentNode.insertBefore(wrapper, block);
        wrapper.appendChild(block);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';
        wrapper.appendChild(buttonContainer);

        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.textContent = '复制';
        buttonContainer.appendChild(copyButton);

        // 调整代码内容选择器，确保兼容 Hexo 的结构
        const codeElement = block.querySelector('pre code') || block.querySelector('code');
        const codeText = codeElement ? codeElement.innerText : '';
        console.log(`Code block ${index + 1} content length:`, codeText.length);

        copyButton.addEventListener('click', () => {
            console.log(`Copy button clicked for code block ${index + 1}`);
            if (navigator.clipboard) {
                navigator.clipboard.writeText(codeText).then(() => {
                    copyButton.textContent = '已复制';
                    setTimeout(() => copyButton.textContent = '复制', 2000);
                }).catch(err => console.error('复制失败:', err));
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = codeText;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
                copyButton.textContent = '已复制';
                setTimeout(() => copyButton.textContent = '复制', 2000);
            }
        });

        // 移除行号相关的逻辑，因为你的 CSS 已禁用 .gutter
        const height = block.scrollHeight;
        if (height > CODE_MAX_HEIGHT) {
            const toggleButton = document.createElement('button');
            toggleButton.className = 'toggle-button';
            toggleButton.textContent = '展开';
            buttonContainer.appendChild(toggleButton);

            block.classList.add('collapsed');
            block.style.maxHeight = CODE_MAX_HEIGHT + 'px';
            block.style.overflowY = 'hidden';

            let isToggling = false;
            toggleButton.addEventListener('click', () => {
                if (isToggling) return;
                isToggling = true;
                console.log(`Toggle button clicked for code block ${index + 1}, collapsed: ${block.classList.contains('collapsed')}`);

                if (block.classList.contains('collapsed')) {
                    block.classList.remove('collapsed');
                    block.classList.add('expanded');
                    toggleButton.textContent = '收起';
                    block.style.maxHeight = block.scrollHeight + 'px';
                    block.style.overflowY = 'auto';
                } else {
                    block.classList.remove('expanded');
                    block.classList.add('collapsed');
                    toggleButton.textContent = '展开';
                    block.style.maxHeight = CODE_MAX_HEIGHT + 'px';
                    block.style.overflowY = 'hidden';
                    window.scrollTo({
                        top: block.getBoundingClientRect().top + window.scrollY - CODE_MAX_HEIGHT,
                        behavior: 'smooth'
                    });
                }

                setTimeout(() => {
                    isToggling = false;
                }, 400);
            });
        } else {
            block.classList.add('expanded');
            block.style.maxHeight = 'none';
            block.style.overflowY = 'auto';
        }
    });
    console.log('Code blocks initialization completed');
}

// 页面初次加载时执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - Initializing code blocks');
    initCodeBlocks();
});

// PJAX 加载完成后重新执行
document.addEventListener('pjax:complete', function() {
    console.log('pjax:complete - Reinitializing code blocks');
    initCodeBlocks();
});

// 延迟初始化以确保 DOM 加载完成
$(document).ready(function() {
    console.log('jQuery ready - Initializing code blocks');
    setTimeout(initCodeBlocks, 100);
});