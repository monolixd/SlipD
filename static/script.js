const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("upload-btn");
const dropArea = document.getElementById("drop-area");
const resultSection = document.getElementById("result-section");
const resultImage = document.getElementById("result-image");
const resultLabel = document.getElementById("result-label");
const confidenceBar = document.getElementById("confidence-bar");
const resetBtn = document.getElementById("reset-btn");
const toggleDark = document.getElementById("toggle-dark");

// 🟢 Drag & Drop
dropArea.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropArea.classList.add("highlight");
});

dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("highlight");
});

dropArea.addEventListener("drop", (e) => {
  e.preventDefault();
  dropArea.classList.remove("highlight");
  fileInput.files = e.dataTransfer.files;
});

// 🟢 ปุ่มอัปโหลด
uploadBtn.addEventListener("click", async () => {
  const file = fileInput.files[0];
  if (!file) return alert("กรุณาเลือกรูปภาพก่อน!");

  const formData = new FormData();
  formData.append("file", file);

  // แสดงข้อความกำลังประมวลผล
  resultLabel.innerText = "⏳ กำลังประมวลผล...";
  resultSection.style.display = "block";

  const res = await fetch("/predict", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  // แสดงภาพและผลลัพธ์
  resultImage.src = `data:image/jpeg;base64,${data.image}`;
  resultLabel.innerText = data.label;

  // สร้างแถบความมั่นใจ
  confidenceBar.style.width = `${data.confidence}%`;
  confidenceBar.innerText = `${data.confidence}%`;
});

// 🟢 ปุ่ม Reset
resetBtn.addEventListener("click", () => {
  fileInput.value = "";
  resultSection.style.display = "none";
  resultImage.src = "";
  resultLabel.innerText = "";
  confidenceBar.style.width = "0%";
  confidenceBar.innerText = "";
});

// 🟢 ปุ่ม Dark Mode
toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
