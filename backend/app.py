from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
import mediapipe as mp
from utils import calculate_angle, analyze_posture

app = Flask(__name__)
CORS(app)

# Initialize pose detector once
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, model_complexity=1)

@app.route('/analyze', methods=['POST'])
def analyze_video():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400

    file = request.files['video']
    video_path = "temp_video.mp4"
    file.save(video_path)

    cap = cv2.VideoCapture(video_path)
    results = []
    frame_id = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_id += 1
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = pose.process(image)

        if result.pose_landmarks:
            feedback = analyze_posture(result.pose_landmarks)
            results.append({'frame': frame_id, 'feedback': feedback})

    cap.release()
    return jsonify(results)

@app.route('/live', methods=['POST'])
def live_posture_analysis():
    if 'frame' not in request.files:
        return jsonify({'error': 'No frame sent'}), 400

    file = request.files['frame']
    file_bytes = np.frombuffer(file.read(), np.uint8)
    frame = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if frame is None:
        return jsonify({'error': 'Invalid frame received'}), 400

    image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = pose.process(image_rgb)

    feedback = []
    if result.pose_landmarks:
        feedback = analyze_posture(result.pose_landmarks)

    return jsonify({'feedback': feedback})


if __name__ == "__main__":
    print("🚀 Flask backend running at http://127.0.0.1:5000")
    app.run(debug=True)
