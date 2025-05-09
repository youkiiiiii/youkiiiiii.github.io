document.addEventListener('DOMContentLoaded', function() {
  // 给浏览器足够时间完成所有图片加载尝试
  setTimeout(function() {
    // 处理所有图片元素
    const allImages = document.querySelectorAll('main img');
    
    allImages.forEach(img => {
      // 跳过已处理的图片
      if (img.hasAttribute('data-broken-handled')) return;
      
      // 标记为已处理
      img.setAttribute('data-broken-handled', 'true');
      
      // 处理当前已经确认加载失败的图片
      if ((img.complete && img.naturalWidth === 0) || img.naturalHeight === 0) {
        handleBrokenImage(img);
      } else {
        // 设置错误处理，如果之后加载失败也能捕获
        img.onerror = function() {
          if (!this.hasAttribute('data-broken-replaced')) {
            handleBrokenImage(this);
          }
        };
      }
    });
  }, 1000); // 等待1秒确保图片有足够时间加载
  
  function handleBrokenImage(img) {
    // 防止重复替换
    if (img.hasAttribute('data-broken-replaced')) return;
    img.setAttribute('data-broken-replaced', 'true');
    
    const altText = img.alt ? img.alt : '';
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
      const figcaption = parent.querySelector('figcaption');
      // 保留原始的 figure 标签，只替换里面的 img
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