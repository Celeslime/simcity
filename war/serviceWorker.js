/* 指定要缓存的内容，地址为相对于跟域名的访问路径 */
const cacheName = "v2";
const contentToCache = [
    // './',
    // './index.html',

    // './styles/images/check.svg',
    // './styles/images/copy.svg',
    // './styles/images/fresh.svg',
    // './styles/images/set.svg',
    // './styles/index.css',
    // './styles/settings.css',

    // './js/index.js',
    // './js/lp-simplex.js',
    // './js/raw_data.js',

    // './settings/',
    // './settings/settings.js',

    // './manifest.webmanifest'
];
// 将请求的响应存储到缓存中
const putInCache = async (request, response) => {
    const cache = await caches.open("v2");
    await cache.put(request, response);
};
const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
};
/* 监听安装事件，install 事件一般是被用来设置你的浏览器的离线缓存逻辑 */
self.addEventListener("install", (e) => {
    /* 通过这个方法可以防止缓存未完成，就关闭serviceWorker */
	e.waitUntil(
		(async () => {
			const cache = await caches.open(cacheName);
			await cache.addAll(contentToCache).catch(err => console.log(err));
		})()
	);
});
/* 注册fetch事件，拦截全站的请求 */
// self.addEventListener("fetch", function (event) {
// 	event.respondWith(cacheFirst(event.request));
// });