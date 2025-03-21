import cv2

def draw_boxes_and_label(image, results):
    names = results[0].names             # รายชื่อ label ทั้งหมด (เช่น "real", "fake")
    boxes = results[0].boxes             # Bounding boxes ที่ตรวจพบ

    label_text = "ไม่พบวัตถุ"
    confidence = 0

    for box in boxes:
        xyxy = box.xyxy[0].cpu().numpy().astype(int)  # ตำแหน่งกรอบ (x1, y1, x2, y2)
        conf = float(box.conf[0])                     # ค่าความมั่นใจ
        cls_id = int(box.cls[0])                      # หมายเลข class เช่น 0, 1
        label = names[cls_id]                         # ชื่อ label เช่น "real", "fake"

        # กำหนดสี: เขียว = real, แดง = fake
        color = (0, 255, 0) if "real" in label.lower() else (0, 0, 255)

        # วาดกรอบ
        cv2.rectangle(image, tuple(xyxy[:2]), tuple(xyxy[2:]), color, 2)

        # ใส่ข้อความ
        text = f"{label.upper()} ({conf:.2f})"
        cv2.putText(image, text, (xyxy[0], xyxy[1] - 10),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

        # บันทึกข้อความที่ใช้แสดงบนหน้าเว็บ
        label_text = "✅ สลิปของจริง" if "real" in label.lower() else "❌ สลิปปลอม"
        confidence = conf

    return image, label_text, confidence
