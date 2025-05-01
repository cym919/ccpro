const urlParams = new URLSearchParams(window.location.search);
const authCode = urlParams.get("code");
document.getElementById("authCode").textContent = authCode;

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
