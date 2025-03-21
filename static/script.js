 // Create animated background bubbles
    function createBubbles() {
      const bubbles = document.querySelector('.bubbles');
      const count = 15;
      
      for (let i = 0; i < count; i++) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
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
    const resultImage = document.getElementById("result-image");
    const resultLabel = document.getElementById("result-label");
    const confidenceBar = document.getElementById("confidence-bar");
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
      
      // Show file name if selected
      if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        document.querySelector('.file-upload-btn').textContent = fileName.length > 20 
          ? fileName.substring(0, 17) + '...' 
          : fileName;
      }
    });
    
    // Show filename when selected
    fileInput.addEventListener("change", () => {
      if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        document.querySelector('.file-upload-btn').textContent = fileName.length > 20 
          ? fileName.substring(0, 17) + '...' 
          : fileName;
      }
    });

    // Upload functionality - ปรับปรุงการแจ้งเตือนด้วย SweetAlert2
    uploadBtn.addEventListener("click", async () => {
      const file = fileInput.files[0];
      if (!file) {
        // ใช้ SweetAlert2 แทน alert ปกติ
        Swal.fire({
          title: 'โปรดเลือกรูปภาพ!',
          text: 'กรุณาเลือกรูปภาพที่ต้องการตรวจสอบก่อน',
          icon: 'warning',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: document.body.classList.contains('dark') ? '#86efac' : '#4ade80'
        });
        
        // ยังคงใช้ animation เดิม
        dropArea.classList.add("highlight");
        setTimeout(() => dropArea.classList.remove("highlight"), 800);
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      resultLabel.innerHTML = "<i class='fas fa-spinner fa-spin'></i> กำลังประมวลผล...";
      resultSection.style.display = "block";
      
      try {
        // ส่งข้อมูลไปยัง '/predict' ตามฟังก์ชันเดิม
        const res = await fetch("/predict", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        
        // แสดงผลลัพธ์
        resultImage.src = `data:image/jpeg;base64,${data.image}`;
        resultLabel.innerText = data.label;
        
        // Animate confidence bar
        confidenceBar.style.width = "0%";
        confidenceBar.innerText = "";
        
        setTimeout(() => {
          confidenceBar.style.width = `${data.confidence}%`;
          confidenceBar.innerText = `${data.confidence}%`;
        }, 300);
        
      } catch (error) {
        // ใช้ SweetAlert2 สำหรับการแสดงข้อผิดพลาด
        Swal.fire({
          title: 'เกิดข้อผิดพลาด!',
          text: 'ไม่สามารถประมวลผลรูปภาพได้ กรุณาลองใหม่อีกครั้ง',
          icon: 'error',
          confirmButtonText: 'ตกลง',
          confirmButtonColor: document.body.classList.contains('dark') ? '#86efac' : '#4ade80'
        });
        
        resultLabel.innerHTML = "<i class='fas fa-exclamation-triangle'></i> มีข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
        console.error("Error:", error);
      }
    });

    // Reset functionality
    resetBtn.addEventListener("click", () => {
      fileInput.value = "";
      document.querySelector('.file-upload-btn').textContent = "เลือกรูปภาพ";
      resultSection.style.display = "none";
      resultImage.src = "";
      resultLabel.innerText = "";
      confidenceBar.style.width = "0%";
      confidenceBar.innerText = "";
    });

    // Dark Mode toggle - ปรับปรุงให้ปรับธีม SweetAlert2 ด้วย
    toggleDark.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      const icon = toggleDark.querySelector('i');
      
      if (document.body.classList.contains('dark')) {
        icon.className = 'fas fa-sun';
      } else {
        icon.className = 'fas fa-moon';
      }
    });