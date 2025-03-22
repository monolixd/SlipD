// Create animated background bubbles
function createBubbles() {
  const bubbles = document.querySelector(".bubbles");
  const count = 15;

  for (let i = 0; i < count; i++) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";

    const size = Math.random() * 100 + 50;
    const x = Math.random() * 100;

    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${x}%`;
    bubble.style.animationDelay = `${Math.random() * 10}s`;
    bubble.style.animationDuration = `${Math.random() * 10 + 10}s`;

    bubbles.appendChild(bubble);
  }
}

// DOM elements
const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("upload-btn");
const dropArea = document.getElementById("drop-area");
const resultSection = document.getElementById("result-section");
const resultsWrapper = document.getElementById("results-wrapper");
const resetBtn = document.getElementById("reset-btn");
const toggleDark = document.getElementById("toggle-dark");

// Create background animation
createBubbles();

// Drag & Drop functionality
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

  if (fileInput.files.length > 0) {
    document.querySelector(
      ".file-upload-btn"
    ).textContent = `${fileInput.files.length} ไฟล์ที่เลือกไว้`;
  }
});

// Show filename when selected
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    document.querySelector(
      ".file-upload-btn"
    ).textContent = `${fileInput.files.length} ไฟล์ที่เลือกไว้`;
  }
});

// Upload multiple images
uploadBtn.addEventListener("click", async () => {
  const files = fileInput.files;

  if (!files.length) {
    Swal.fire({
      title: "โปรดเลือกรูปภาพ!",
      text: "กรุณาเลือกรูปภาพอย่างน้อย 1 ไฟล์",
      icon: "warning",
      confirmButtonText: "ตกลง",
      confirmButtonColor: document.body.classList.contains("dark")
        ? "#86efac"
        : "#4ade80",
    });
    dropArea.classList.add("highlight");
    setTimeout(() => dropArea.classList.remove("highlight"), 800);
    return;
  }

  resultsWrapper.innerHTML = ""; // ล้างผลลัพธ์เดิม
  resultSection.style.display = "block";

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    const formData = new FormData();
    formData.append("file", file);

    // กรอบผลลัพธ์สำหรับแต่ละภาพ
    const resultCard = document.createElement("div");
    resultCard.className = "result-card";
    resultCard.innerHTML = `
      <p><i class='fas fa-spinner fa-spin'></i> กำลังประมวลผล...</p>
    `;
    resultsWrapper.appendChild(resultCard);

    try {
      const res = await fetch("/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      resultCard.innerHTML = `
        <img src="data:image/jpeg;base64,${data.image}" class="result-image" />
        <p class="result-label">${data.label}</p>
        <div class="confidence-bar-container">
          <div class="confidence-bar" style="width: ${data.confidence}%;">${data.confidence}%</div>
        </div>
      `;
    } catch (error) {
      resultCard.innerHTML = `
        <p class="result-label error"><i class='fas fa-exclamation-triangle'></i> ประมวลผลไม่สำเร็จ</p>
      `;
      console.error("Error:", error);
    }
  }
});

// Reset functionality
resetBtn.addEventListener("click", () => {
  fileInput.value = "";
  document.querySelector(".file-upload-btn").textContent = "เลือกรูปภาพ";
  resultsWrapper.innerHTML = "";
  resultSection.style.display = "none";
});

// Dark Mode toggle
toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = toggleDark.querySelector("i");
  icon.className = document.body.classList.contains("dark")
    ? "fas fa-sun"
    : "fas fa-moon";
});
