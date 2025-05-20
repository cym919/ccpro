document.addEventListener("DOMContentLoaded", () => {
    fetchDailyPicture();
    fetchDailyQuote();
  });
  
  async function fetchDailyPicture() {
    const pictureContainer = document.getElementById("daily-picture");
  
    try {
      const response = await fetch("https://api.vvhan.com/api/wallpaper/views");
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      // 新增代码：设置CSS变量
      document.documentElement.style.setProperty('--bg-image', `url(${imageUrl})`);
      pictureContainer.style.backgroundImage = `url(${imageUrl})`;
    } catch (error) {
      // 错误处理中也需要设置默认背景
      document.documentElement.style.setProperty('--bg-image', 'url(/img/bg-dark.jpg)');
      pictureContainer.style.backgroundImage = "url(/img/bg-dark.jpg)";
    }
  }
  
  async function fetchDailyQuote() {
    const quoteZh = document.getElementById("daily-quote-zh");
    const quoteEn = document.getElementById("daily-quote-en");
  
    try {
      const response = await fetch(
        "https://api.vvhan.com/api/dailyEnglish?type=sj"
      );
      const data = await response.json();
  
      if (data.success) {
        quoteZh.textContent = data.data.zh;
        quoteEn.textContent = data.data.en;
      } else {
        quoteZh.textContent = "获取每日一言失败";
        quoteEn.textContent = "Failed to load daily quote";
      }
    } catch (error) {
      quoteZh.textContent = "网络错误，无法获取每日一言";
      quoteEn.textContent = "Network error";
    }
  }
  