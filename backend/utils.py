import numpy as np

def calculate_angle(a, b, c):
    a, b, c = np.array(a), np.array(b), np.array(c)
    ba = a - b
    bc = c - b
    cosine = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc))
    angle = np.degrees(np.arccos(np.clip(cosine, -1.0, 1.0)))
    return angle

def analyze_posture(landmarks):
    lm = landmarks.landmark
    # Coordinates
    shoulder = [lm[11].x, lm[11].y]
    hip = [lm[23].x, lm[23].y]
    knee = [lm[25].x, lm[25].y]
    ankle = [lm[27].x, lm[27].y]
    nose = [lm[0].x, lm[0].y]

    feedback = []

    # Back angle
    back_angle = calculate_angle(shoulder, hip, knee)
    if back_angle < 150:
        feedback.append("Hunched Back")

    # Knee over toe
    if knee[0] > ankle[0] + 0.02:  # small buffer
        feedback.append("Knee over toe")

    # Neck angle
    neck_angle = calculate_angle(nose, shoulder, hip)
    if neck_angle > 30:
        feedback.append("Neck bending")

    return feedback
