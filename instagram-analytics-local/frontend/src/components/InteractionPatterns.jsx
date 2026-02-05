export default function InteractionPatterns({ patterns }) {
  if (!patterns) return null;

  const getSpeedIcon = (speed) => {
    if (speed === "Fast") return "⚡";
    if (speed === "Slow") return "🐌";
    return "⏱️";
  };

  const getPatternIcon = (pattern) => {
    if (pattern.includes("Discussion")) return "💬";
    if (pattern.includes("Moderate")) return "📈";
    return "👀";
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>How Audiences Typically Interact</h3>
      <p style={styles.subtitle}>
        Engagement patterns observed in similar posts
      </p>
      
      <div style={styles.patternsGrid}>
        <div style={styles.patternCard}>
          <div style={styles.patternHeader}>
            <span style={styles.patternIcon}>
              {getSpeedIcon(patterns.engagementSpeed)}
            </span>
            <span style={styles.patternName}>Engagement Speed</span>
          </div>
          <div style={styles.patternValue}>{patterns.engagementSpeed || "Moderate"}</div>
          <div style={styles.patternDescription}>
            {patterns.engagementSpeed === "Fast" 
              ? "Audiences typically engage quickly with similar content"
              : patterns.engagementSpeed === "Slow"
              ? "Engagement builds gradually over time"
              : "Steady engagement pattern observed"}
          </div>
        </div>
        
        <div style={styles.patternCard}>
          <div style={styles.patternHeader}>
            <span style={styles.patternIcon}>
              {getPatternIcon(patterns.commentPattern)}
            </span>
            <span style={styles.patternName}>Comment Pattern</span>
          </div>
          <div style={styles.patternValue}>{patterns.commentPattern || "Moderate engagement"}</div>
          <div style={styles.patternDescription}>
            {patterns.commentPattern?.includes("Discussion")
              ? "Similar posts often spark conversations"
              : patterns.commentPattern?.includes("Passive")
              ? "Audiences tend to like more than comment"
              : "Balanced like-to-comment ratio"}
          </div>
        </div>
        
        <div style={styles.patternCard}>
          <div style={styles.patternHeader}>
            <span style={styles.patternIcon}>📊</span>
            <span style={styles.patternName}>Avg Engagement Rate</span>
          </div>
          <div style={styles.patternValue}>
            {patterns.avgEngagementRate || "0"}%
          </div>
          <div style={styles.patternDescription}>
            Average engagement rate across similar posts
          </div>
        </div>
      </div>
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
  patternsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  patternCard: {
    padding: "20px",
    backgroundColor: "#0f1419",
    borderRadius: "8px",
    border: "1px solid #1f2937",
  },
  patternHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "12px",
  },
  patternIcon: {
    fontSize: "24px",
  },
  patternName: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#e5e7eb",
  },
  patternValue: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#38bdf8",
    marginBottom: "8px",
  },
  patternDescription: {
    fontSize: "13px",
    color: "#9ca3af",
    lineHeight: "1.5",
  },
};

