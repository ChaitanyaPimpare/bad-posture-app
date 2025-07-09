import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import "./App.css";

const videoConstraints = {
  width: 640,
  height: 480,
  facingMode: "user",
};

function App() {
  const webcamRef = useRef(null);
  const [mode, setMode] = useState("live"); // "live" or "upload"
  const [feedback, setFeedback] = useState("Choose mode to begin...");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 🔁 Real-time webcam analysis
  useEffect(() => {
    let intervalId;

    if (isAnalyzing && mode === "live") {
      intervalId = setInterval(async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video.readyState === 4
        ) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (!imageSrc) {
            console.warn("Empty screenshot, skipping frame...");
            return;
          }

          const blob = await fetch(imageSrc).then((res) => res.blob());
          const file = new File([blob], "frame.jpg", { type: "image/jpeg" });

          const formData = new FormData();
          formData.append("frame", file);

          try {
            const res = await axios.post("http://127.0.0.1:5000/live", formData);
            setFeedback(res.data.feedback.join(", ") || "✅ Good Posture");
          } catch (err) {
            console.error("Live error:", err);
            setFeedback("❌ Error processing frame");
          }
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isAnalyzing, mode]);

  // 📤 Video upload + auto-analysis
  const handleUploadAnalyze = async (file) => {
    if (!file) {
      alert("Please upload a video.");
      return;
    }

    setIsLoading(true);
    setFeedback("⏳ Analyzing video... Please wait");

    const formData = new FormData();
    formData.append("video", file);

    try {
      const res = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const allFeedback = res.data.map(
        (f) => `Frame ${f.frame}: ${f.feedback.join(", ") || "Good"}`
      );
      setFeedback(allFeedback.join("\n"));
    } catch (err) {
      console.error("Upload error:", err);
      setFeedback("❌ Error uploading video");
    }

    setIsLoading(false);
  };

  // 🔄 Switch mode + reset states
  const switchMode = (selectedMode) => {
    setMode(selectedMode);
    setIsAnalyzing(false);
    setFeedback(selectedMode === "live" ? "Webcam ready." : "Please upload a video.");
  };

  return (
    <div className="App">
      <h1>🎯 Bad Posture Detection App</h1>

      <div>
        <button onClick={() => switchMode("live")}>Use Webcam</button>
        <button onClick={() => switchMode("upload")}>Upload Video</button>
      </div>

      {mode === "live" && (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            className="webcam"
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={() => setIsAnalyzing(!isAnalyzing)}>
              {isAnalyzing ? "🛑 Stop Live Analysis" : "▶️ Start Live Analysis"}
            </button>
          </div>
        </div>
      )}

      {mode === "upload" && (
        <div style={{ marginTop: "20px" }}>
          <input
            type="file"
            accept="video/*"
            id="fileInput"
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files[0]) {
                handleUploadAnalyze(e.target.files[0]);
              }
            }}
          />
          <button onClick={() => document.getElementById("fileInput").click()}>
            📤 Upload & Analyze Video
          </button>
        </div>
      )}

      {isLoading && (
        <div className="loading">⏳ Analyzing... Please wait</div>
      )}

      <div className="feedback">
        <strong>Feedback:</strong>
        <br />
        {feedback}
      </div>
    </div>
  );
}

export default App;