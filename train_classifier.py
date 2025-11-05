from ultralytics import YOLO
import os

# -----------------------------
# Step 1: Dataset Path
# -----------------------------
dataset_path = r"C:\\Users\\amjad\\OneDrive\\Documents\\Custom Office Templates\\OneDrive\\Desktop\\dataset"

if not os.path.exists(dataset_path):
    raise FileNotFoundError(f"Dataset folder not found at {dataset_path}")

# -----------------------------
# Step 2: Train Classifier Model
# -----------------------------
model = YOLO("yolov8s-cls.pt")  # classification model

model.train(
    data=dataset_path,  # dataset folder (no yaml needed!)
    epochs=50,
    imgsz=224,          # Recommended for classification
    name="demo_classifier"
)

print("✅ Training completed! Model saved inside: runs/classify/demo_classifier/")

# -----------------------------
# Step 3: Test the Model
# -----------------------------
test_image = r"C:\\Users\\amjad\\OneDrive\\Documents\\Custom Office Templates\\OneDrive\\Desktop\\dataset\\pothole\\pathole 2.jpg"

if not os.path.exists(test_image):
    print(f"⚠️ Test image not found at {test_image}")
else:
    results = model.predict(test_image)
    class_index = results[0].probs.top1
    class_name = results[0].names[class_index]
    print(f"🎯 Predicted class: {class_name}")
