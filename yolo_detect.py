from ultralytics import YOLO
import sys, json
import warnings
import os

# Suppress all warnings and logs
os.environ['YOLO_VERBOSE'] = 'False'
warnings.filterwarnings("ignore")

# Get image path from arguments
image_path = sys.argv[1]

# Load your classification model
model = YOLO("runs\\classify\\demo_classifier\\weights\\best.pt")  # Update path if needed

# Run inference
results = model(image_path, verbose=False)

detected_objects = []

for result in results:
    if hasattr(result, "probs") and result.probs is not None:
        try:
            probs_tensor = result.probs.data

            # Handle 1D or 2D tensor
            if probs_tensor.ndim == 1:
                class_probs = {model.names[i]: float(p) for i, p in enumerate(probs_tensor)}
            else:
                class_probs = {model.names[i]: float(p) for i, p in enumerate(probs_tensor[0])}

            # Remove 'all' class
            class_probs.pop("all", None)

            if class_probs:
                # Pick top class
                top_class = max(class_probs, key=class_probs.get)
                detected_objects.append(top_class)

        except Exception as e:
            print("Error processing result:", e, file=sys.stderr)
            continue

# Output JSON for Node.js
print(json.dumps({"objects": detected_objects}))
