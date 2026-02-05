import { useParams } from "react-router-dom";
import EvidenceSummary from "../components/EvidenceSummary";
import PerformanceRanges from "../components/PerformanceRanges";
import InteractionPatterns from "../components/InteractionPatterns";
import TimePerformance from "../components/TimePerformance";
import Comparison from "../components/Comparison";
import Suggestions from "../components/Suggestions";

export default function Results() {
  const { sessionId } = useParams();
  const resultStr = localStorage.getItem("analysis_result");
  
  if (!resultStr) {
    return (
      <div style={styles.container}>
        <h2>No Results Found</h2>
        <p>Please start a new analysis.</p>
      </div>
    );
  }

  const result = JSON.parse(resultStr);

  if (result.status === "INSUFFICIENT_DATA") {
    return (
      <div style={styles.container}>
        <div style={styles.errorCard}>
          <h2 style={styles.errorTitle}>Insufficient Data</h2>
          <p style={styles.errorText}>{result.reason}</p>
          <p style={styles.errorHint}>
            Try adjusting your category selection or adding more specific hashtags to find similar content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Analysis Results</h1>
        <p style={styles.subtitle}>
          Based on historically similar content · Session {sessionId}
        </p>
      </div>

      {/* Evidence Summary */}
      <EvidenceSummary evidence={result.evidence} />

      {/* Performance Ranges */}
      <PerformanceRanges performance={result.performance} />

      {/* Interaction Patterns */}
      <InteractionPatterns patterns={result.interactionPatterns} />

      {/* Time-Based Performance */}
      <TimePerformance timePerformance={result.timePerformance} />

      {/* What Worked vs What Didn't */}
      <Comparison patterns={result.patterns} />

      {/* Improvement Suggestions */}
      <Suggestions suggestions={result.suggestions} />

      {/* Footer Note */}
      <div style={styles.footerNote}>
        <p>
          <strong>Important:</strong> These insights are based on observed patterns in similar historical content, 
          not exact predictions. Your actual performance may vary based on timing, audience, algorithm changes, 
          and many other factors. Use these insights as guidance, not guarantees.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px 60px",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "32px",
    fontWeight: 700,
    color: "#e5e7eb",
    marginBottom: "12px",
    letterSpacing: "-0.01em",
  },

  subtitle: {
    fontSize: "16px",
    color: "#9ca3af",
  },

  errorCard: {
    backgroundColor: "#111827",
    padding: "40px",
    borderRadius: "12px",
    border: "1px solid #1f2937",
    textAlign: "center",
    maxWidth: "600px",
    margin: "80px auto",
  },

  errorTitle: {
    fontSize: "24px",
    fontWeight: 600,
    color: "#ef4444",
    marginBottom: "16px",
  },

  errorText: {
    fontSize: "16px",
    color: "#d1d5db",
    marginBottom: "20px",
    lineHeight: "1.6",
  },

  errorHint: {
    fontSize: "14px",
    color: "#9ca3af",
    fontStyle: "italic",
  },

  footerNote: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "32px",
  },

  footerNoteText: {
    fontSize: "13px",
    color: "#fbbf24",
    lineHeight: "1.7",
    margin: 0,
  },
};
