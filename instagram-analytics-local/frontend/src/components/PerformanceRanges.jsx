export default function PerformanceRanges({ performance }) {
  if (!performance) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Observed Performance Ranges</h3>
      <p style={styles.subtitle}>
        In similar posts, historically (25th–75th percentile)
      </p>
      
      <div style={styles.metricsGrid}>
        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>👁️</div>
          <div style={styles.metricLabel}>Views</div>
          <div style={styles.metricValue}>{performance.views || "N/A"}</div>
          <div style={styles.metricNote}>Typical range</div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>❤️</div>
          <div style={styles.metricLabel}>Likes</div>
          <div style={styles.metricValue}>{performance.likes || "N/A"}</div>
          <div style={styles.metricNote}>Typical range</div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>💬</div>
          <div style={styles.metricLabel}>Comments</div>
          <div style={styles.metricValue}>{performance.comments || "N/A"}</div>
          <div style={styles.metricNote}>Typical range</div>
        </div>
        
        <div style={styles.metricCard}>
          <div style={styles.metricIcon}>📊</div>
          <div style={styles.metricLabel}>Engagement Rate</div>
          <div style={styles.metricValue}>{performance.engagement || "N/A"}</div>
          <div style={styles.metricNote}>Typical range</div>
        </div>
      </div>
      
      <div style={styles.warningBox}>
        <strong>⚠️ Important:</strong> These are observed ranges from similar historical content, not predictions. 
        Your actual performance may vary based on many factors including timing, audience, and algorithm changes.
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
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  metricCard: {
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#0f1419",
    borderRadius: "8px",
    border: "1px solid #1f2937",
  },
  metricIcon: {
    fontSize: "32px",
    marginBottom: "12px",
  },
  metricLabel: {
    fontSize: "13px",
    color: "#9ca3af",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  metricValue: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#38bdf8",
    marginBottom: "4px",
  },
  metricNote: {
    fontSize: "11px",
    color: "#6b7280",
    fontStyle: "italic",
  },
  warningBox: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    border: "1px solid rgba(245, 158, 11, 0.3)",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "13px",
    color: "#fbbf24",
    lineHeight: "1.6",
  },
};

