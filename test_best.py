from ultralytics import YOLO

# Load model
model = YOLO("runs\\classify\\demo_classifier\\weights\\best.pt")

# Run on single image
results = model("pathole 3.jpg")  # Replace with your image path

top_class = None

for result in results:
    if result.probs is not None:
        probs_tensor = result.probs.data  # the raw tensor

        # If scalar (0-d tensor), skip or handle
        if probs_tensor.ndim == 0:
            print("Only one class probability returned, skipping...")
            continue

        # If 1D tensor (single image, multiple classes)
        if probs_tensor.ndim == 1:
            class_probs = {model.names[i]: float(p) for i, p in enumerate(probs_tensor)}
        else:  # 2D tensor (batch x classes)
            class_probs = {model.names[i]: float(p) for i, p in enumerate(probs_tensor[0])}

        # Remove 'all' class
        class_probs.pop("all", None)

        if class_probs:
            # pick top class
            top_class = max(class_probs, key=class_probs.get)

print("Top detected object (ignoring 'all'):", top_class)
