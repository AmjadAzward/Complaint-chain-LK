# Complaint ChainLK
Centralized Public Complaint Platform

---

## Prototype Access
[View UI/UX Prototype on Figma](https://www.figma.com/design/CpJX5fU4TYha0R9fdfkGC4/Project_Final?node-id=0-1&p=f&t=0BNefSOuIbMrptJp-0)

<p align="center">
  <img src="https://github.com/user-attachments/assets/7870455b-0352-446c-a6bd-4713bd4a75c7" alt="image1" height="400px" />
  <img src="https://github.com/user-attachments/assets/f2b0ab5b-1f46-48d3-9c75-c2f11bdd7a05" alt="image2" height="400px" />
</p>

---

## Technology Stack

**Frontend:** React.js, Tailwind CSS, Leaflet.js (OpenStreetMap), React Dropzone / FileReader API  
**Backend:** Node.js + Express.js, Firebase (Firestore, Auth, Storage), JWT + Middleware, Firebase Cloud Functions  
**AI/ML/CV:** Hugging Face Transformers, Teachable Machine, OpenAI Whisper, Custom Rule-Based Routing  
**Geolocation:** Leaflet.js + OpenStreetMap, Nominatim Reverse Geocoding  
**Notifications:** Firebase Cloud Messaging, EmailJS  
**Chatbot:** Rasa (Self-hosted)  
**Analytics:** Metabase (Self-hosted), Google Looker Studio  
**Reports:** jsPDF  
**Hosting & Deployment:** Netlify, Vercel, Firebase Hosting  
**DevOps & Security:** GitHub, GitHub Actions, Sentry, JWT Authentication  

---

## Market Opportunity

### Problem
- There is no unified platform for reporting public service-related issues such as road damage, waste disposal, or water leakage.  
- Complaints are often delayed due to manual workflows and communication barriers.  
- Citizens lack visibility into complaint handling and cannot easily follow up with authorities.  

### Demand
- The Sri Lankan government is moving toward digitized citizen services and public accountability.  
- Initiatives like *Clean Sri Lanka* can benefit from centralized reporting platforms.  
- Over 15 million active internet users in Sri Lanka indicate strong adoption potential.  

---

## Solution – Complaint ChainLK

Complaint ChainLK is a web-based platform designed to streamline complaint submission, management, and resolution between citizens and authorities.

### Core Objectives
- Enable quick, accurate complaint submissions with images and location data.  
- Leverage AI for complaint categorization and prioritization.  
- Facilitate transparent, two-way communication and tracking.  
- Provide authorities with dashboards and analytical tools for better performance management.  

---

## Why Complaint ChainLK?

### Without Complaint ChainLK
- Complaints are lost, delayed, or ignored.  
- No transparency between citizens and government bodies.  
- Lack of data-driven insights for issue prioritization.  

### With Complaint ChainLK
- Faster submission, tracking, and resolution of public issues.  
- Real-time visibility for citizens and authorities.  
- AI-driven routing to assign complaints efficiently.  
- Promotes accountability and citizen participation.  

---

## User Features

### For Citizens
- Submit complaints with detailed descriptions, photos, and pinned locations.  
- Image classification automatically detects the nature of the problem.  
- Track complaint status with live updates.  
- Make complaints public for collaborative discussion.  
- Receive notifications and progress updates through email and push messages.  

### For Authorities
- Access a categorized dashboard filtered by location, severity, and type.  
- Automatically assigned complaints using AI routing.  
- Update and close complaints with visibility controls.  
- Escalate pending complaints to higher authorities.  
- Analyze trends and generate periodic reports.  

---

## AI Image Classification Integration

A custom machine learning model can classify uploaded complaint images into categories such as "Garbage", "Road Damage", and "Water Leakage".

### Implementation Workflow

1. **Define the Problem**  
   Identify the types of public issues to classify.  

2. **Data Collection and Preparation**  
   Gather labeled images for each category and apply data augmentation to increase dataset diversity.  

3. **Model Selection**  
   Use transfer learning with models like MobileNet, ResNet, or VGG for improved performance.  

4. **Model Training Example (Keras)**  
   ```python
   from tensorflow.keras.applications import MobileNetV2
   from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
   from tensorflow.keras.models import Model

   base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224,224,3))
   x = GlobalAveragePooling2D()(base_model.output)
   x = Dense(128, activation='relu')(x)
   predictions = Dense(num_classes, activation='softmax')(x)
   model = Model(inputs=base_model.input, outputs=predictions)

   for layer in base_model.layers:
       layer.trainable = False

   model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
   ```

5. **Evaluation and Optimization**  
   Measure accuracy, precision, recall, and F1-score; fine-tune as necessary.  

6. **Deployment**  
   Export the trained model as `image_classifier.h5` and deploy via Flask, Django, or cloud hosting.  

---

## Setup Guide

### Step 1: Clone the Repository
```bash
git clone https://github.com/Ilmaa2003/Final-Project-Complaint-Chain-Manager.git
cd Final-Project-Complaint-Chain-Manager
```

### Step 2: Install Dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd backend
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file inside the backend directory:
```
PORT=5000
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
JWT_SECRET=your_jwt_secret
```

### Step 4: Run the Application

#### Backend
```bash
cd backend
npm start
```
Access the backend at `http://localhost:5000`.

#### Frontend
```bash
cd frontend
npm start
```
Access the frontend at `http://localhost:3000`.

### Step 5: Test AI Image Classification (Optional)
- Place your trained model under `backend/models/` (e.g., `image_classifier.h5`).  
- Install TensorFlow:  
```bash
pip install tensorflow
```
- Use `/api/classify-image` endpoint for testing.

### Step 6: Build for Production
#### Frontend
```bash
cd frontend
npm run build
```

#### Backend
Deploy with Firebase Hosting, Vercel, or Heroku. PM2 can be used for production process management.

### Step 7: Notes
- Ensure Firebase is configured with Firestore, Auth, and Storage.  
- AI-based classification is optional but improves complaint categorization.  
- Recommended to use modern browsers for full feature compatibility.  

---

## Contact
For additional information, reach out to:  
- Cohndse242f-041@student.nibm.lk  
- Cohndse242f-042@student.nibm.lk
