function updateTime() {
  const now = new Date();

  // 格式化时间
  const time = now.toLocaleTimeString("zh-CN", { hour12: false });

  // 格式化日期
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };
  const date = now.toLocaleDateString("zh-CN", options);

  // 更新DOM元素
  document.getElementById("time").textContent = time;
  document.getElementById("date").textContent = date;
}

// 初始加载时立即更新时间
updateTime();
// 每秒更新一次时间
setInterval(updateTime, 1000);
