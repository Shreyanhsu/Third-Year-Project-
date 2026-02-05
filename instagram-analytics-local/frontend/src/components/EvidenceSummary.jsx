export default function EvidenceSummary({ evidence }) {
  if (!evidence) return null;

  const getConfidenceColor = (confidence) => {
    const conf = confidence?.toLowerCase() || "";
    if (conf === "high") return "#10b981"; // green
    if (conf === "medium") return "#f59e0b"; // amber
    return "#ef4444"; // red
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Similar Content Evidence</h3>
      <p style={styles.subtitle}>
        Based on historically similar posts from our dataset
      </p>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{evidence.similarPosts || 0}</div>
          <div style={styles.statLabel}>Similar Posts</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statValue}>{evidence.creators || 0}</div>
          <div style={styles.statLabel}>Creators Represented</div>
        </div>
        
        <div style={styles.statCard}>
          <div style={styles.statValue}>{evidence.timeWindow || "N/A"}</div>
          <div style={styles.statLabel}>Time Window</div>
        </div>
        
        <div style={styles.statCard}>
          <div 
            style={{
              ...styles.confidenceBadge,
              backgroundColor: getConfidenceColor(evidence.confidence)
            }}
          >
            {evidence.confidence || "Medium"}
          </div>
          <div style={styles.statLabel}>Confidence Level</div>
        </div>
      </div>
      
      <p style={styles.disclaimer}>
        * Analysis based on posts with similar content characteristics, not exact predictions
      </p>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#111827",
    padding: "28px",
    borderRadius: "12px",
    border: "1px solid #1f2937",
    marginBottom: "24px",
  },
  title: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#e5e7eb",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#9ca3af",
    marginBottom: "24px",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  statCard: {
    textAlign: "center",
    padding: "16px",
    backgroundColor: "#0f1419",
    borderRadius: "8px",
    border: "1px solid #1f2937",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: 700,
    color: "#38bdf8",
    marginBottom: "8px",
  },
  statLabel: {
    fontSize: "13px",
    color: "#9ca3af",
  },
  confidenceBadge: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#fff",
    marginBottom: "8px",
  },
  disclaimer: {
    fontSize: "12px",
    color: "#6b7280",
    fontStyle: "italic",
    marginTop: "16px",
    margin: 0,
  },
};

