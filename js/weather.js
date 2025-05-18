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

// 天气预警API端点
const WEATHER_ALERT_API = "https://apiserver.alcex.cn/daily-hot/weatheralarm";

// 图标映射
const alertIcons = {
  暴雨: "fa-cloud-showers-heavy",
  台风: "fa-wind",
  高温: "fa-temperature-high",
  雷电: "fa-bolt",
  大风: "fa-wind",
  冰雹: "fa-cloud-meatball",
  大雾: "fa-smog",
  霜冻: "fa-temperature-low",
  干旱: "fa-sun",
  沙尘暴: "fa-smog",
  default: "fa-exclamation-triangle",
};

// 获取天气预警数据
async function fetchWeatherAlerts() {
  try {
    const response = await fetch(WEATHER_ALERT_API);
    if (!response.ok) throw new Error("网络响应不正常");

    const result = await response.json();
    // 确保数据结构正确
    if (result.code === 200 && Array.isArray(result.data)) {
      return result.data; // 直接返回data数组
    }
    return [];
  } catch (error) {
    console.error("获取天气预警数据失败:", error);
    return [];
  }
}

function renderAlerts(alertsData) {
  const container = document.getElementById("alertContainer");

  if (!alertsData || alertsData.length === 0) {
    container.innerHTML = '<p class="card-text">当前没有天气预警信息</p>';
    return;
  }

  container.innerHTML = "";

  alertsData.forEach((alert) => {
    const [type, level] = extractAlertInfo(alert.title);
    const time = extractTime(alert.desc);
    const agency = extractAgency(alert.title); // 改为从title提取

    const alertCard = document.createElement("a");
    alertCard.className = `alert-link`;
    alertCard.href = alert.url;
    alertCard.target = "_blank";

    const cardContent = document.createElement("div");
    cardContent.className = `alert-card ${getAlertLevelClass(level)}`;

    cardContent.innerHTML = `
  <div class="alert-icon-container">
    <img src="${alert.cover}" class="alert-icon" alt="预警图标">
  </div>
  <div class="alert-content-wrapper">
    <div class="alert-header">
      <div class="alert-title">
        <span>${type}${level}预警</span>
        <span class="alert-time">${time}</span>
      </div>
      <div class="alert-area">发布机构：${agency}</div>
    </div>
    <div class="alert-details">
      <div class="alert-item">
        <strong>预警说明：</strong>${alert.desc.split(" ").slice(2).join(" ")}
      </div>
      <div class="alert-item">
        <strong>防御指南：</strong>${getDefenseGuide(type)}
      </div>
    </div>
  </div>
`;

    alertCard.appendChild(cardContent);
    container.appendChild(alertCard);
  });
}

// 新增辅助函数
function extractAlertInfo(title) {
  const match = title.match(/发布(.*?)(蓝色|黄色|橙色|红色)/);
  return match ? [match[1].trim(), match[2]] : ["未知", "未知"];
}

// 修改后的初始化函数
async function initWeatherAlerts() {
  try {
    const rawData = await fetchWeatherAlerts();
    renderAlerts(rawData);

    setInterval(async () => {
      const newData = await fetchWeatherAlerts();
      renderAlerts(newData);
    }, 3600000);
  } catch (error) {
    console.error("初始化天气预警失败:", error);
    document.getElementById("alertContainer").innerHTML =
      '<p class="card-text">暂时无法获取预警信息</p>';
  }
}

// 获取预警级别对应的CSS类
function getAlertLevelClass(level) {
  if (level.includes("红")) return "red-alert";
  if (level.includes("橙")) return "orange-alert";
  if (level.includes("黄")) return "yellow-alert";
  if (level.includes("蓝")) return "blue-alert";
  return "";
}

// 获取预警类型对应的图标
function getAlertIcon(type) {
  return alertIcons[type] || alertIcons.default;
}

function extractTime(desc) {
  const parts = desc.split(" ");
  return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : "未知时间";
}

function extractAgency(title) {
  try {
    const match = title.match(/(.+?气象台)发布/);
    if (!match) return "未知气象台";

    // 二次过滤无效字符
    return match[1].replace(/[【】]/g, "").trim();
  } catch {
    return "未知";
  }
}

// 获取防御指南
function getDefenseGuide(type) {
  const guides = {
    暴雨: "1. 停止户外作业 2. 做好排涝措施 3. 避免涉水通行",
    台风: "1. 加固户外设施 2. 船舶回港避风 3. 避免外出",
    高温: "1. 避免高温作业 2. 加强防暑措施 3. 保障电力供应",
    雷电: "1. 关闭电器设备 2. 避免户外活动 3. 不要站在高处",
    大风: "1. 加固临时建筑 2. 停止高空作业 3. 注意高空坠物",
    default: "请根据当地政府指引采取防御措施",
  };
  return guides[type] || guides.default;
}

// 初始化加载天气预警
async function initWeatherAlerts() {
  const alerts = await fetchWeatherAlerts();
  renderAlerts(alerts);

  // 每小时更新一次数据
  setInterval(async () => {
    const newAlerts = await fetchWeatherAlerts();
    renderAlerts(newAlerts);
  }, 3600000);
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", initWeatherAlerts);
