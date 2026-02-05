export default function Comparison({ patterns }) {
  if (!patterns) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Patterns Observed</h3>
      <p style={styles.subtitle}>
        What worked vs. what didn't in similar posts
      </p>
      
      <div style={styles.comparisonGrid}>
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <span style={styles.successIcon}>✅</span>
            <span style={styles.columnTitle}>Top Quartile Patterns</span>
          </div>
          <div style={styles.patternList}>
            {patterns.top && patterns.top.length > 0 ? (
              patterns.top.map((pattern, index) => (
                <div key={index} style={styles.patternItem}>
                  <span style={styles.bullet}>•</span>
                  <span style={styles.patternText}>{pattern}</span>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>No clear patterns identified</div>
            )}
          </div>
        </div>
        
        <div style={styles.column}>
          <div style={styles.columnHeader}>
            <span style={styles.warningIcon}>❌</span>
            <span style={styles.columnTitle}>Bottom Quartile Patterns</span>
          </div>
          <div style={styles.patternList}>
            {patterns.bottom && patterns.bottom.length > 0 ? (
              patterns.bottom.map((pattern, index) => (
                <div key={index} style={styles.patternItem}>
                  <span style={styles.bullet}>•</span>
                  <span style={styles.patternText}>{pattern}</span>
                </div>
              ))
            ) : (
              <div style={styles.emptyState}>No clear patterns identified</div>
            )}
          </div>
        </div>
      </div>
      
      <div style={styles.note}>
        <strong>Note:</strong> These patterns are based on comparative analysis of similar posts. 
        They indicate correlations, not causation.
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
  comparisonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginBottom: "20px",
  },
  column: {
    padding: "20px",
    backgroundColor: "#0f1419",
    borderRadius: "8px",
    border: "1px solid #1f2937",
  },
  columnHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
    paddingBottom: "12px",
    borderBottom: "1px solid #1f2937",
  },
  successIcon: {
    fontSize: "20px",
  },
  warningIcon: {
    fontSize: "20px",
  },
  columnTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#e5e7eb",
  },
  patternList: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  patternItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "8px",
    fontSize: "14px",
    color: "#d1d5db",
    lineHeight: "1.6",
  },
  bullet: {
    color: "#38bdf8",
    fontWeight: "bold",
    flexShrink: 0,
  },
  patternText: {
    flex: 1,
  },
  emptyState: {
    fontSize: "13px",
    color: "#6b7280",
    fontStyle: "italic",
  },
  note: {
    fontSize: "12px",
    color: "#6b7280",
    fontStyle: "italic",
    padding: "12px",
    backgroundColor: "rgba(156, 163, 175, 0.1)",
    borderRadius: "6px",
  },
};

