import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { runMockAnalysis } from "../mock/mockResults";

export default function Analyzing() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = location.state?.sessionId;
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { text: "Finding similar posts in our dataset...", icon: "🔍" },
    { text: "Applying similarity thresholds...", icon: "📊" },
    { text: "Aggregating historical performance data...", icon: "📈" },
    { text: "Analyzing patterns and generating insights...", icon: "💡" },
  ];

  useEffect(() => {
    const input = JSON.parse(localStorage.getItem("analysis_input") || "{}");

    // Simulate step progression
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    // Run analysis after a delay
    const analysisTimeout = setTimeout(() => {
      clearInterval(stepInterval);
      const result = runMockAnalysis(input);

      localStorage.setItem(
        "analysis_result",
        JSON.stringify(result)
      );

      navigate(`/results/${sessionId}`);
    }, 2500);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(analysisTimeout);
    };
  }, [navigate, sessionId]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.spinnerContainer}>
          <div style={styles.spinner}></div>
        </div>
        
        <h2 style={styles.title}>Analyzing Your Content</h2>
        <p style={styles.subtitle}>
          We're comparing your post against our historical dataset
        </p>

        <div style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div
              key={index}
              style={{
                ...styles.step,
                ...(index <= currentStep ? styles.stepActive : {}),
              }}
            >
              <span style={styles.stepIcon}>{step.icon}</span>
              <span style={styles.stepText}>{step.text}</span>
              {index <= currentStep && (
                <span style={styles.checkmark}>✓</span>
              )}
            </div>
          ))}
        </div>

        <div style={styles.note}>
          <p>This process typically takes 2-3 seconds</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },

  content: {
    textAlign: "center",
    maxWidth: "600px",
    width: "100%",
  },

  spinnerContainer: {
    marginBottom: "32px",
  },

  spinner: {
    width: "64px",
    height: "64px",
    border: "4px solid rgba(56, 189, 248, 0.2)",
    borderTopColor: "#38bdf8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "0 auto",
  },

  title: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#e5e7eb",
    marginBottom: "12px",
  },

  subtitle: {
    fontSize: "16px",
    color: "#9ca3af",
    marginBottom: "40px",
  },

  stepsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "32px",
    textAlign: "left",
  },

  step: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 20px",
    backgroundColor: "#111827",
    borderRadius: "8px",
    border: "1px solid #1f2937",
    opacity: 0.5,
    transition: "all 0.3s ease",
  },

  stepActive: {
    opacity: 1,
    borderColor: "#273449",
    backgroundColor: "#0f1419",
  },

  stepIcon: {
    fontSize: "20px",
    flexShrink: 0,
  },

  stepText: {
    flex: 1,
    fontSize: "15px",
    color: "#d1d5db",
  },

  checkmark: {
    color: "#10b981",
    fontSize: "18px",
    fontWeight: "bold",
    flexShrink: 0,
  },

  note: {
    marginTop: "24px",
    fontSize: "13px",
    color: "#6b7280",
    fontStyle: "italic",
  },
};

// Add CSS for spinner animation
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(styleSheet);
