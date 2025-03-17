document.addEventListener('DOMContentLoaded', function () {
    // 获取所有代码块
    const codeBlocks = document.querySelectorAll('main .post-content .highlight');

    codeBlocks.forEach((block) => {
        // 创建复制按钮
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.innerText = '复制';

        // 将按钮添加到代码块
        block.appendChild(copyButton);

        // 添加点击事件
        copyButton.addEventListener('click', function () {
            // 获取代码内容（仅复制 .code 部分的内容）
            const code = block.querySelector('.code').innerText;

            // 使用 Clipboard API 复制内容
            navigator.clipboard.writeText(code).then(() => {
                // 复制成功后更改按钮文本和样式
                copyButton.innerText = '已复制';
                copyButton.classList.add('copied');

                // 2 秒后恢复按钮状态
                setTimeout(() => {
                    copyButton.innerText = '复制';
                    copyButton.classList.remove('copied');
                }, 2000);
            }).catch((err) => {
                console.error('复制失败:', err);
                copyButton.innerText = '失败';
            });
        });
    });
});