## ✅ 1. เตรียม Python ให้พร้อมบนเครื่องใหม่

### ตรวจสอบว่าติดตั้ง Python แล้ว:
```bash
python --version
```

ถ้ายัง → ติดตั้งจาก [python.org](https://www.python.org/downloads/)  
แนะนำเวอร์ชัน 3.9 ขึ้นไป ✅

---

## ✅ 2. Clone Repo จาก GitHub

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

---

## ✅ 3. สร้าง Virtual Environment

```bash
python -m venv venv
```

แล้ว activate:

- ✅ **Windows:**
  ```bash
  venv\Scripts\activate
  ```

- ✅ **Mac/Linux:**
  ```bash
  source venv/bin/activate
  ```

> ❗ ตอนนี้คุณควรเห็น `(venv)` ขึ้นนำหน้าบรรทัดใน Terminal

---

## ✅ 4. ติดตั้งไลบรารีทั้งหมดจาก `requirements.txt`

```bash
pip install -r requirements.txt
```

> ถ้าเจอปัญหา `torch` หรือ `ultralytics` แนะนำใช้ pip แบบระบุเวอร์ชันชัดเจน  
> หรือแจ้งผมให้ช่วย lock version ให้ใน `requirements.txt` ก็ได้ครับ

---

## ✅ 5. ตรวจสอบว่าไฟล์ `best.pt` อยู่แล้ว

หากยังไม่อยู่ → ให้อัปโหลดเข้าโปรเจกต์ (วางไว้ใน root เช่นเดียวกับเครื่องเดิม)

---

## ✅ 6. รันเว็บแอป

```bash
uvicorn main:app --reload
```

เปิดเบราว์เซอร์แล้วไปที่:
```
http://127.0.0.1:8000/
```

---

## 🔐 Optional: เปิดใช้งาน live reload แบบอัตโนมัติ

หากต้องการติดตั้ง `uvicorn` แบบ global:

```bash
pip install uvicorn[standard]
```

---

## ✅ โฟลเดอร์ที่คุณควรมีหลัง clone

```
📁 your-repo-name/
├── static/
│   ├── favicon.png
│   ├── style.css
│   └── script.js
├── templates/
│   ├── index.html
│   └── loading.html
├── best.pt
├── main.py
├── utils.py
├── requirements.txt
└── .gitignore
```

---

## 🎁 สรุปคำสั่งทั้งหมด (Copy ใช้ได้เลย)

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

python -m venv venv
venv\Scripts\activate  # หรือ source venv/bin/activate บน Mac/Linux

pip install -r requirements.txt

uvicorn main:app --reload
```

---