# Complaint ChainLK  

A Unified Platform for Public Complaint Management in Sri Lanka  

## Introduction  

Complaint ChainLK is a centralized web platform designed to simplify how Sri Lankan citizens report issues in public services—ranging from water leaks and power outages to damaged roads and poor waste management. The platform bridges the gap between the public and government authorities by ensuring accountability, faster resolution, and transparent communication.  

## Prototype Access  

[Explore UI/UX Prototype on Figma](https://www.figma.com/design/CpJX5fU4TYha0R9fdfkGC4/Project_Final?node-id=0-1&p=f&t=0BNefSOuIbMrptJp-0)  

<p align="center">
  <img src="https://github.com/user-attachments/assets/7870455b-0352-446c-a6bd-4713bd4a75c7" alt="image1" height="400px" />
  <img src="https://github.com/user-attachments/assets/f2b0ab5b-1f46-48d3-9c75-c2f11bdd7a05" alt="image2" height="400px" />
</p>


## Challenges Today  

- No single digital platform for lodging complaints.  
- Slow, manual, and untrackable resolution processes.  
- Citizens struggle to identify responsible departments.  
- Lack of inclusivity for rural and underserved communities.  

## Proposed Solution  

Complaint ChainLK introduces:  

- Location-enabled complaint submissions.  
- AI-powered tagging and prioritization.  
- Real-time progress tracking and notifications.  
- Two-way communication between citizens and officials.  
- Transparent reporting with performance metrics.  

## Market Potential  

- Strong government push for **e-governance and transparency**.  
- National campaigns (e.g., *Clean Sri Lanka*) can integrate with the platform.  
- Over **15 million internet users** with increasing smartphone adoption.  
- Growing demand for **digital-first citizen services**.  

## Platform Features  

### Citizen Features  

- Simple web form with **geolocation support**.  
- Upload photos/videos of issues.  
- AI-driven complaint classification.  
- Complaint history dashboard with real-time updates.  
- Privacy controls for public or private complaint visibility.  

### Authority Features  

- Centralized **complaint management dashboard**.  
- Auto-routing to relevant departments.  
- Escalation mechanism for unresolved issues.  
- Performance analytics and reporting tools.  
- Legally compliant transparency on complaint progress.  

## Technology Overview  

### Frontend  
- React.js, Tailwind CSS  
- Leaflet.js + OpenStreetMap  
- File upload (React Dropzone / FileReader API)  

### Backend  
- Node.js, Express.js  
- Firebase (Firestore, Auth, Storage, Cloud Functions)  
- Secure auth with JWT & middleware  

### AI / ML  
- Hugging Face Transformers  
- Teachable Machine, OpenAI Whisper  
- Hybrid: AI + Rule-based complaint routing  

### Geolocation & Mapping  
- Leaflet.js + OpenStreetMap  
- Nominatim for reverse geocoding  

### Notifications  
- Firebase Cloud Messaging  
- EmailJS integration  

### Analytics & Reports  
- Metabase, Google Looker Studio  
- Exportable reports with jsPDF  

### Chatbot Integration  
- Rasa (NLP-powered self-hosted bot)  

### Deployment & Security  
- Hosting: Netlify, Vercel, Firebase Hosting  
- CI/CD with GitHub Actions  
- Error monitoring: Sentry  
- Authentication: JWT-based  

## Licensing  

Academic project by **Group 31 – NIBM**  
© All Rights Reserved  

