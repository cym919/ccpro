// 日历核心逻辑
let currentDate = new Date();
let holidayData = [];

// 加载节假日数据
fetch('/data/calendar/2025.min.json')
  .then(response => response.json())
  .then(data => holidayData = data.dates)
  .catch(error => console.error('节假日数据加载失败:', error));

function generateCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';
    
    // 生成星期标题
    ['日', '一', '二', '三', '四', '五', '六'].forEach(weekday => {
        const weekdayElement = document.createElement('div');
        weekdayElement.className = 'calendar-day';
        weekdayElement.textContent = weekday;
        calendarGrid.appendChild(weekdayElement);
    });

    // 添加月份显示逻辑
    const monthYear = document.getElementById('monthYear');
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月','七月', '八月', '九月', '十月', '十一月', '十二月'];
    monthYear.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    // 生成日期逻辑
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    // 填充上个月末尾
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = 0; i < startingDay; i++) {
        const dayElement = createDayElement(prevMonthLastDay - startingDay + i + 1, true);
        calendarGrid.appendChild(dayElement);
    }

    // 生成本月日期
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayElement = createDayElement(day, false, date);
        calendarGrid.appendChild(dayElement);
    }

    // 填充下个月开头
    const totalCells = startingDay + daysInMonth;
    const remainingCells = 42 - totalCells; // 保持6行布局
    for (let i = 1; i <= remainingCells; i++) {
        const dayElement = createDayElement(i, true);
        calendarGrid.appendChild(dayElement);
    }
}

function createDayElement(dayNumber, isGrayed, date = null) {
    const dayElement = document.createElement('div');
    dayElement.className = `calendar-day${isGrayed ? ' empty' : ''}`;
    dayElement.textContent = dayNumber;
    
    // 添加点击事件
    dayElement.onclick = () => handleDateClick(dayElement, date);

    if (date) {
        // 节假日判断
        const dateStr = date.toISOString().split('T')[0];
        const holiday = holidayData.find(d => d.date === dateStr);
        
        // 今天高亮
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }

        if (holiday) {
            dayElement.classList.add(holiday.type === 'public_holiday' ? 'holiday' : 'workday');
            dayElement.title = holiday.name_cn;
        }
    }
    
    return dayElement;
}

function handleDateClick(element, date) {
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    element.classList.add('selected');
}

// 月份切换
function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    generateCalendar();
}

// 初始化
document.addEventListener('DOMContentLoaded', generateCalendar);