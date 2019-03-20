# pwa

- 安全域： localhost 或者 https
- 如果直接没成功起来，试着注册一下

```html
<script>
  if ('serviceWorker' in navigator) {
      // 为了保证首屏渲染性能，可以在页面 load 完之后注册 Service Worker
      window.onload = function () {
          navigator.serviceWorker.register('/sw.js');
      };
  }
</script>
```