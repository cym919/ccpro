const urlParams = new URLSearchParams(window.location.search);
const authCode = urlParams.get("code");
const clientId = urlParams.get("client_id");

if (!clientId) {
  alert("未传入client_id参数");
  document.getElementById("authCode").textContent = "未传入client_id参数";
} else if (!authCode) {
  alert("未传入code参数");
  document.getElementById("authCode").textContent = "未传入code参数";
} else if (clientId !== "156914b8c1ad4734b778050380060553") {
  alert("client_id错误");
  document.getElementById("authCode").textContent = "client_id错误";
} else {
  document.getElementById("authCode").textContent = authCode;
}

// 复制功能
document.getElementById("copyBtn").addEventListener("click", () => {
  navigator.clipboard
    .writeText(authCode)
    .then(() => {
      alert("授权码已复制到剪贴板");
    })
    .catch((err) => {
      console.error("复制失败:", err);
      alert("复制失败，请手动复制");
    });
});
