/* 主题切换：点击导航按钮在深浅模式间切换，并持久化到 localStorage
   注：页面初始深浅色由 index.html <head> 中的防闪烁脚本提前设置 */
(function () {
	"use strict";

	var btn = document.getElementById("theme-toggle");
	if (!btn) return;

	btn.addEventListener("click", function () {
		var root = document.documentElement;
		var dark = root.classList.toggle("dark");
		/* 显式存 light/dark：用户手动选择后不再跟随系统偏好 */
		try {
			localStorage.setItem("theme", dark ? "dark" : "light");
		} catch (e) {}
	});
})();
