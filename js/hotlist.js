document.addEventListener("DOMContentLoaded", () => {
  fetchHotList();

  const tabBtns = document.querySelectorAll(".tab-btn");
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      fetchHotList(btn.dataset.platform);
    });
  });
});

async function fetchHotList(platform = "all") {
  const container = document.getElementById("hotlist-content");
  container.innerHTML = '<div class="loading-spinner"></div>';

  try {
    const response = await fetch("https://api.vvhan.com/api/hotlist/all");
    const data = await response.json();

    if (data.success) {
      renderHotList(data.data, platform);
    } else {
      container.innerHTML = "<p>获取热搜数据失败，请稍后再试</p>";
    }
  } catch (error) {
    container.innerHTML = "<p>网络错误，无法获取热搜数据</p>";
  }
}

function renderHotList(data, platform) {
  const container = document.getElementById("hotlist-content");
  let html = "";

  data.forEach((category) => {
    if (platform === "all" || category.name.includes(platform)) {
      html += `
        <div class="platform-card">
          <div class="platform-title">${category.name}</div>
          <div class="hot-items">`;

      category.data.slice(0, 20).forEach((item, index) => {
        const rank = index + 1;
        html += `
          <div class="hot-item">
            <div class="rank ${rank <= 3 ? "rank-" + rank : ""}">${rank}</div>
            <a href="${item.url}" 
               class="hot-item-link" 
               target="_blank" 
               title="${item.title}">
              <span class="hot-item-content">${item.title}</span>
            </a>
            <div class="heat">${item.hot}</div>
          </div>`;
      });

      html += `</div></div>`;
    }
  });

  container.innerHTML = html || '<div class="platform-card">暂无数据</div>';
}
