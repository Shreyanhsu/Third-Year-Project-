export default function TimePerformance({ timePerformance }) {
  if (!timePerformance) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>When Similar Posts Gain Traction</h3>
      <p style={styles.subtitle}>
        Time-based performance patterns from historical data
      </p>
      
      <div style={styles.content}>
        <div style={styles.insightBox}>
          <div style={styles.insightIcon}>⏰</div>
          <div style={styles.insightText}>
            <strong>{timePerformance.peakPercentage || "68%"} of engagement</strong> typically occurs within the{" "}
            <strong>{timePerformance.peakTime || "first 24 hours"}</strong>
          </div>
        </div>
        
        <div style={styles.graphPlaceholder}>
          <div style={styles.graphLabel}>Engagement Timeline</div>
          <div style={styles.graphBars}>
            <div style={styles.barContainer}>
              <div style={styles.barLabel}>0-6h</div>
              <div style={styles.barWrapper}>
                <div style={{...styles.bar, width: "45%", backgroundColor: "#38bdf8"}}></div>
              </div>
            </div>
            <div style={styles.barContainer}>
              <div style={styles.barLabel}>6-12h</div>
              <div style={styles.barWrapper}>
                <div style={{...styles.bar, width: "30%", backgroundColor: "#0ea5e9"}}></div>
              </div>
            </div>
            <div style={styles.barContainer}>
              <div style={styles.barLabel}>12-24h</div>
              <div style={styles.barWrapper}>
                <div style={{...styles.bar, width: "20%", backgroundColor: "#0284c7"}}></div>
              </div>
            </div>
            <div style={styles.barContainer}>
              <div style={styles.barLabel}>24h+</div>
              <div style={styles.barWrapper}>
                <div style={{...styles.bar, width: "5%", backgroundColor: "#0369a1"}}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div style={styles.insight}>
          <p style={styles.insightText}>
            {timePerformance.insight || 
             "Most similar posts gain the majority of their engagement within the first 24 hours"}
          </p>
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
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  insightBox: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#0f1419",
    borderRadius: "8px",
    border: "1px solid #1f2937",
  },
  insightIcon: {
    fontSize: "32px",
  },
  insightText: {
    fontSize: "15px",
    color: "#e5e7eb",
    lineHeight: "1.6",
  },
  graphPlaceholder: {
    padding: "20px",
    backgroundColor: "#0f1419",
    borderRadius: "8px",
    border: "1px solid #1f2937",
  },
  graphLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#9ca3af",
    marginBottom: "16px",
    textAlign: "center",
  },
  graphBars: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  barContainer: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  barLabel: {
    fontSize: "12px",
    color: "#9ca3af",
    width: "60px",
    textAlign: "right",
  },
  barWrapper: {
    flex: 1,
    height: "24px",
    backgroundColor: "#1f2937",
    borderRadius: "4px",
    overflow: "hidden",
    position: "relative",
  },
  bar: {
    height: "100%",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  insight: {
    padding: "16px",
    backgroundColor: "rgba(56, 189, 248, 0.1)",
    borderRadius: "8px",
    border: "1px solid rgba(56, 189, 248, 0.2)",
  },
};

