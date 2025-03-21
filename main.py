from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

from ultralytics import YOLO
import cv2
import base64
import numpy as np
from utils import draw_boxes_and_label

app = FastAPI()

# 🔧 ตั้งค่าพาธสำหรับ static files และ template
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# 🚀 โหลดโมเดล YOLOv8
try:
    model = YOLO("best.pt")
except Exception as e:
    raise RuntimeError(f"❌ โหลดโมเดลไม่สำเร็จ: {e}")

# ✅ หน้า Loading
@app.get("/", response_class=HTMLResponse)
async def loading_page(request: Request):
    return templates.TemplateResponse("loading.html", {"request": request})

# ✅ หน้าเว็บหลัก
@app.get("/home", response_class=HTMLResponse)
async def home_page(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# 🔄 รับภาพจากผู้ใช้ -> ตรวจจับ -> ส่งผลลัพธ์กลับ
@app.post("/predict")
async def predict_image(file: UploadFile = File(...)):
    try:
        # ✅ อ่านไฟล์จากหน่วยความจำ (RAM) → ไม่บันทึกลง root
        image_bytes = await file.read()
        image_array = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

        if image is None:
            raise HTTPException(status_code=400, detail="❌ ไม่สามารถอ่านภาพได้ กรุณาอัปโหลดไฟล์รูปภาพ")

        # ✅ รัน YOLOv8 ตรวจจับวัตถุ
        results = model.predict(image, conf=0.5)

        # ✅ วาด bounding box และดึงข้อมูล label + confidence
        annotated_image, label_text, confidence = draw_boxes_and_label(image, results)

        # ✅ แปลงภาพให้สามารถแสดงบนเว็บ (base64)
        _, im_arr = cv2.imencode(".jpg", annotated_image)
        im_bytes = im_arr.tobytes()
        im_base64 = base64.b64encode(im_bytes).decode("utf-8")

        # ✅ ส่งข้อมูลกลับไปที่หน้าเว็บ
        return JSONResponse({
            "image": im_base64,
            "label": label_text,
            "confidence": round(confidence * 100, 2)
        })

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์: {str(e)}")
