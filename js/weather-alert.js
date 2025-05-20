// 天气预警API端点
const WEATHER_ALERT_API = 'https://apiserver.alcex.cn/daily-hot/weatheralarm';

// 辅助函数：提取预警类型和级别
function extractAlertInfo(title) {
  const match = title.match(/发布(.*?)(蓝色|黄色|橙色|红色)/);
  return match ? [match[1].trim(), match[2]] : ['未知', '未知'];
}

// 辅助函数：提取发布时间
function extractTime(desc) {
  const parts = desc.split(' ');
  return parts.length >= 2 ? `${parts[0]} ${parts[1]}` : '未知时间';
}

// 辅助函数：提取发布机构（精确版）
function extractAgency(title) {
  try {
    const match = title.match(/(.+?气象台)发布/);
    if (!match) return '未知气象台';
    return match[1].replace(/[【】]/g, '').trim();
  } catch {
    return '未知气象台';
  }
}

// 辅助函数：获取预警级别样式类
function getAlertLevelClass(level) {
  const levelMap = {
    '红': 'red-alert',
    '橙': 'orange-alert',
    '黄': 'yellow-alert',
    '蓝': 'blue-alert'
  };
  return levelMap[level.charAt(0)] || '';
}

// 辅助函数：格式化时间戳
function formatTime(timestamp) {
  try {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '时间格式错误';
  }
}

// 辅助函数：获取防御指南
function getDefenseGuide(type) {
  const guides = {
    '暴雨': '1. 停止户外作业 2. 做好排涝措施 3. 避免涉水通行',
    '台风': '1. 加固户外设施 2. 船舶回港避风 3. 避免外出',
    '高温': '1. 避免高温作业 2. 加强防暑措施 3. 保障电力供应',
    '雷电': '1. 关闭电器设备 2. 避免户外活动 3. 不要站在高处',
    '大风': '1. 加固临时建筑 2. 停止高空作业 3. 注意高空坠物',
    'default': '请根据当地政府指引采取防御措施'
  };
  return guides[type] || guides.default;
}

// 获取天气预警数据
async function fetchWeatherAlerts() {
  try {
    const response = await fetch(WEATHER_ALERT_API);
    if (!response.ok) throw new Error(`HTTP错误! 状态码: ${response.status}`);
    
    const result = await response.json();
    if (result.code === 200 && Array.isArray(result.data)) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error('获取天气预警数据失败:', error);
    return [];
  }
}

// 渲染预警卡片
function renderAlerts(alertsData) {
  const container = document.getElementById('alertContainer');
  container.innerHTML = '';

  if (!alertsData || alertsData.length === 0) {
    container.innerHTML = '<p class="card-text">当前没有天气预警信息</p>';
    return;
  }

  alertsData.forEach(alert => {
    const [type, level] = extractAlertInfo(alert.title);
    const time = extractTime(alert.desc);
    const agency = extractAgency(alert.title);

    // 创建卡片容器
    const alertLink = document.createElement('a');
    alertLink.className = 'alert-link';
    alertLink.href = alert.url;
    alertLink.target = '_blank';
    alertLink.rel = 'noopener noreferrer';

    // 卡片内容
    const alertCard = document.createElement('div');
    alertCard.className = `alert-card ${getAlertLevelClass(level)}`;
    alertCard.innerHTML = `
      <div class="alert-icon-container">
        <img src="${alert.cover}" 
             class="alert-icon" 
             alt="${type}预警图标"
             loading="lazy">
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
            <strong>预警说明：</strong>
            ${alert.desc.split(' ').slice(2).join(' ')}
          </div>
          <div class="alert-item">
            <strong>防御指南：</strong>
            ${getDefenseGuide(type)}
          </div>
        </div>
      </div>
    `;

    alertLink.appendChild(alertCard);
    container.appendChild(alertLink);
  });
}

// 初始化天气预警
async function initWeatherAlerts() {
  try {
    const container = document.getElementById('alertContainer');
    container.innerHTML = '<div class="loading-spinner"></div>';

    const alertsData = await fetchWeatherAlerts();
    renderAlerts(alertsData);

    // 每小时更新数据
    const updateInterval = setInterval(async () => {
      const newData = await fetchWeatherAlerts();
      renderAlerts(newData);
    }, 3600000);

    // 清理定时器
    window.addEventListener('beforeunload', () => {
      clearInterval(updateInterval);
    });

  } catch (error) {
    console.error('天气预警初始化失败:', error);
    document.getElementById('alertContainer').innerHTML = 
      '<p class="card-text">暂时无法获取预警信息</p>';
  }
}

// 页面加载初始化
document.addEventListener('DOMContentLoaded', initWeatherAlerts);