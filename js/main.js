const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// 检查本地存储中的主题设置
const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    html.setAttribute('data-theme', 'light');
    themeIcon.querySelector("path").setAttribute('d', "M13.44 2.13a1 1 0 0 0-1.055 1.465 5 5 0 0 1-6.79 6.79A1 1 0 0 0 4.13 11.44a7.95 7.95 0 0 0 .641 1.989 1 1 0 0 0 1.896-.556 7 7 0 0 0 8.22-8.134 6 6 0 0 1 2.537 7.832 1 1 0 1 0 1.807.858 8.002 8.002 0 0 0-5.79-11.3ZM3 16a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m3 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1");
}

// 切换主题
themeToggle.addEventListener('click', () => {
    if (html.getAttribute('data-theme') === 'light') { //浅色模式
        html.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
        themeIcon.querySelector("path").setAttribute('d', "M3.936 8H3a1 1 0 0 0 0 2h.223a9 9 0 0 0 16.841 6H21a1 1 0 1 0 0-2h-.223A9 9 0 0 0 3.936 8m2.319 0a7 7 0 0 1 12.455 6H9.5a.5.5 0 0 1 0-1h2a2.5 2.5 0 0 0 0-5zm11.49 8A7 7 0 0 1 5.29 10h6.21a.5.5 0 0 1 0 1h-2a2.5 2.5 0 0 0 0 5z"); //改变主题图标path中的d属性值
    } else { //深色模式
        html.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeIcon.querySelector("path").setAttribute('d', "M13.44 2.13a1 1 0 0 0-1.055 1.465 5 5 0 0 1-6.79 6.79A1 1 0 0 0 4.13 11.44a7.95 7.95 0 0 0 .641 1.989 1 1 0 0 0 1.896-.556 7 7 0 0 0 8.22-8.134 6 6 0 0 1 2.537 7.832 1 1 0 1 0 1.807.858 8.002 8.002 0 0 0-5.79-11.3ZM3 16a1 1 0 0 1 1-1h16a1 1 0 1 1 0 2H4a1 1 0 0 1-1-1m3 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1");
    }
});