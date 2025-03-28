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
const loadingAnimation = document.getElementById("loading-animation");

// Summary elements
const realCount = document.getElementById("real-count");
const fakeCount = document.getElementById("fake-count");
const totalCount = document.getElementById("total-count");

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

// Reset counters
function resetCounters() {
  realCount.textContent = "0";
  fakeCount.textContent = "0";
  totalCount.textContent = "0";
}

// Update counters
function updateCounters(label) {
  totalCount.textContent = parseInt(totalCount.textContent) + 1;

  if (label.includes("จริง")) {
    realCount.textContent = parseInt(realCount.textContent) + 1;
  } else if (label.includes("ปลอม")) {
    fakeCount.textContent = parseInt(fakeCount.textContent) + 1;
  }
}

// Function to show full image
function showFullImage(imageSrc, label) {
  const labelClass = label.includes("จริง") ? "จริง" : "ปลอม";
  const titleText = label.includes("จริง")
    ? "สลิปการโอนเงินจริง"
    : "สลิปการโอนเงินปลอม";
  const iconColor = label.includes("จริง") ? "#10b981" : "#ef4444";

  Swal.fire({
    title: titleText,
    imageUrl: imageSrc,
    imageAlt: label,
    imageWidth: "100%",
    imageHeight: "auto",
    width: "80%",
    padding: "20px",
    confirmButtonText: "ปิด",
    confirmButtonColor: document.body.classList.contains("dark")
      ? "#86efac"
      : "#4ade80",
    background: document.body.classList.contains("dark") ? "#121826" : "#fff",
    color: document.body.classList.contains("dark") ? "#e2e8f0" : "#334155",
    customClass: {
      image: "swal-image-large",
    },
  });
}

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

  // แสดงแอนิเมชันรอและซ่อนส่วนผลลัพธ์
  loadingAnimation.style.display = "block";
  resultSection.style.display = "none";

  // ล้างผลลัพธ์เดิมและรีเซ็ตตัวนับ
  resultsWrapper.innerHTML = "";
  resetCounters();

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/predict", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageDataUrl = `data:image/jpeg;base64,${data.image}`;

      const resultCard = document.createElement("div");
      resultCard.className = "result-card";
      resultCard.innerHTML = `
        <img src="${imageDataUrl}" class="result-image" />
        <p class="result-label ${data.label}">${data.label}</p>
        <div class="confidence-bar-container">
          <div class="confidence-bar ${data.label}" style="width: ${data.confidence}%;">${data.confidence}%</div>
        </div>
        <button class="view-full-btn"><i class="fas fa-search-plus"></i> ดูรูปเต็ม</button>
      `;

      const viewFullBtn = resultCard.querySelector(".view-full-btn");
      viewFullBtn.addEventListener("click", () => {
        showFullImage(imageDataUrl, data.label);
      });

      resultsWrapper.appendChild(resultCard);
      updateCounters(data.label);
    }
  } catch (error) {
    console.error("Error:", error);
    Swal.fire({
      title: "เกิดข้อผิดพลาด!",
      text: "ไม่สามารถประมวลผลรูปภาพได้",
      icon: "error",
      confirmButtonText: "ตกลง",
      confirmButtonColor: document.body.classList.contains("dark")
        ? "#86efac"
        : "#4ade80",
    });
  } finally {
    // ซ่อนแอนิเมชันรอและแสดงส่วนผลลัพธ์
    loadingAnimation.style.display = "none";
    resultSection.style.display = "block";
  }
});

// Reset functionality
resetBtn.addEventListener("click", () => {
  fileInput.value = "";
  document.querySelector(".file-upload-btn").textContent = "เลือกรูปภาพ";
  resultsWrapper.innerHTML = "";
  resultSection.style.display = "none";
  resetCounters();
});

// Dark Mode toggle
toggleDark.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const icon = toggleDark.querySelector("i");
  icon.className = document.body.classList.contains("dark")
    ? "fas fa-sun"
    : "fas fa-moon";
});

