// 获取主页天气数据
async function fetchWeather() {
    try {
      const response = await fetch("https://api.vvhan.com/api/weather");
      const data = await response.json();
  
      if (data.success) {
        document.getElementById("weatherCity").textContent = data.city;
        document.getElementById("weatherType").textContent = data.data.type;
        document.getElementById(
          "weatherTemp"
        ).textContent = `${data.data.low} ~ ${data.data.high}`;
        document.getElementById(
          "weatherWind"
        ).textContent = `${data.data.fengxiang} ${data.data.fengli}`;
        // 新增夜间天气信息
        document.getElementById("weatherNightType").textContent = `${data.data.night.type}`;
        document.getElementById("weatherNightWind").textContent = `${data.data.night.fengxiang} ${data.data.night.fengli}`;
        document.getElementById(
          "weatherAqi"
        ).textContent = `空气质量: ${data.air.aqi_name}`;
      }
    } catch (error) {
      console.error("获取天气数据失败:", error);
      document.getElementById("weatherCity").textContent = "获取天气失败";
    }
  }
  
  // 初始加载时获取天气
  fetchWeather();
  // 每小时更新一次天气
  setInterval(fetchWeather, 3600000);
  