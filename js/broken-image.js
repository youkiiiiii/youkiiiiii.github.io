document.addEventListener('DOMContentLoaded', function() {
    // 检查图片是否真正加载失败的函数
    function isImageBroken(img) {
      // 如果图片还在加载中，不判断为失败
      if (!img.complete) return false;
      
      // 图片加载完成但没有尺寸，说明加载失败
      return img.naturalWidth === 0 || img.naturalHeight === 0;
    }
  
    // 处理单个图片的函数
    function processImage(img) {
      // 跳过已处理的图片
      if (img.hasAttribute('data-broken-handled')) return;
      
      // 标记为已处理
      img.setAttribute('data-broken-handled', 'true');
      
      // 如果图片已经确认加载失败，立即处理
      if (isImageBroken(img)) {
        handleBrokenImage(img);
        return;
      }
      
      // 设置加载失败的回调
      img.onerror = function() {
        if (!this.hasAttribute('data-broken-replaced')) {
          handleBrokenImage(this);
        }
      };
      
      // 设置加载成功的回调（可选，用于调试）
      img.onload = function() {
        // 图片成功加载，确保不会被误判
        this.setAttribute('data-loaded-success', 'true');
      };
    }
  
    // 初始处理所有图片
    function processAllImages() {
      const allImages = document.querySelectorAll('main img');
      allImages.forEach(processImage);
    }
  
    // 使用 MutationObserver 监听新添加的图片
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        mutation.addedNodes.forEach(function(node) {
          if (node.nodeType === 1) { // 元素节点
            // 如果新添加的节点是图片
            if (node.tagName === 'IMG' && node.closest('main')) {
              processImage(node);
            }
            // 如果新添加的节点包含图片
            const images = node.querySelectorAll && node.querySelectorAll('main img');
            if (images) {
              images.forEach(processImage);
            }
          }
        });
      });
    });
  
    // 开始观察
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  
    // 初始处理 - 使用多次检查确保捕获所有情况
    processAllImages();
    
    // 短延迟后再次检查，处理可能遗漏的图片
    setTimeout(processAllImages, 100);
    
    // 页面完全加载后最后一次检查
    if (document.readyState === 'loading') {
      window.addEventListener('load', function() {
        setTimeout(processAllImages, 100);
      });
    } else {
      setTimeout(processAllImages, 100);
    }
  
    function handleBrokenImage(img) {
      // 防止重复替换
      if (img.hasAttribute('data-broken-replaced')) return;
      
      // 最后一次确认图片确实加载失败
      if (!isImageBroken(img)) {
        // 如果图片实际上是好的，不进行替换
        return;
      }
      
      img.setAttribute('data-broken-replaced', 'true');
      
      const altText = img.alt || '';
      const replacement = document.createElement('div');
      replacement.className = 'broken-image';
      replacement.style.cssText = `
        display: block;
        max-width: 100%;
        margin: 0.5em auto;
        border: none;
        min-height: 250px;
        background: transparent;
        text-align: center;
        position: relative;
      `;
      
      replacement.innerHTML = `
        <div style="
          width: 200px;
          height: 200px;
          background-image: url('/images/broken.gif');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          margin: 0 auto;
        "></div>
        <span style="
          display: block;
          color: #FFB6C1;
          font-family: 'Nunito', monospace;
          font-size: 14px;
          text-align: center;
          margin-top: 15px;
        ">图片加载失败${altText ? '：' + altText : ''}</span>
      `;
      
      // 检查父元素的类型并相应处理
      const parent = img.parentNode;
      
      // 针对 figure 标签特殊处理
      if (parent.tagName.toLowerCase() === 'figure') {
        parent.insertBefore(replacement, img);
        parent.removeChild(img);
      }
      // 针对 markdown 生成的 p > img 结构
      else if (parent.tagName.toLowerCase() === 'p' && parent.childNodes.length === 1) {
        parent.parentNode.insertBefore(replacement, parent);
        parent.parentNode.removeChild(parent);
      }
      // 其他情况直接替换图片
      else {
        parent.insertBefore(replacement, img);
        parent.removeChild(img);
      }
    }
  });