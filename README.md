# 🧍‍♂️ Bad Posture Detection App

A full-stack web application that detects bad posture (e.g., slouching, knee over toe, hunched back) using **MediaPipe**, **OpenCV**, and rule-based logic.

---

## 📌 Features

-  Real-time posture analysis via webcam
-  Upload video files for posture evaluation
-  Pose detection using **MediaPipe**
-  Rule-based feedback (for squats or desk posture)
-  Frontend: React + Webcam streaming
-  Backend: Flask + OpenCV

---

## 🔧 Tech Stack

| Layer     | Tech Used            |
|-----------|----------------------|
| Frontend  | React, Axios, React-Webcam |
| Backend   | Flask, Flask-CORS, OpenCV, MediaPipe |
| Pose Logic | Rule-based Python module |
| Deployment | Render (Frontend + Backend) |

---


---

## 🎥 Demo Video

📺 [Watch Demo on YouTube / Google Drive](https://your-demo-video-link.com)

---

## 🧪 Rule-Based Logic

### Squat Detection:
- ❌ Bad if:
  - Knee goes beyond toe
  - Back angle < 150°

### Desk Sitting Detection:
- ❌ Bad if:
  - Neck bends > 30°
  - Back not straight (angle > threshold)

---

## 🛠️ Setup Instructions

### 1. Clone Repository
```bash
git clone https://github.com/ChaitanyaPimpare/bad-posture-app.git
cd bad-posture-app

2. Backend Setup (Flask)
cd backend
python -m venv venv
venv\Scripts\activate     # On Windows
# source venv/bin/activate  # On macOS/Linux

pip install -r requirements.txt
To run the Flask server locally:

python app.py
This will start the backend server at http://localhost:5000.

3. Frontend Setup (React)
cd ../frontend
npm install
npm start
This will launch the React development server at http://localhost:3000.
