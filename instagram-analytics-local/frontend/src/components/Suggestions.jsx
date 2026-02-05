export default function Suggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Based on Similar Posts, You Could Consider...</h3>
      <p style={styles.subtitle}>
        Actionable suggestions grounded in observed data
      </p>
      
      <div style={styles.suggestionsList}>
        {suggestions.map((suggestion, index) => (
          <div key={index} style={styles.suggestionCard}>
            <div style={styles.suggestionNumber}>{index + 1}</div>
            <div style={styles.suggestionContent}>
              <div style={styles.suggestionObservation}>
                <strong>Observation:</strong> {suggestion.observation || suggestion}
              </div>
              {suggestion.stat && (
                <div style={styles.suggestionStat}>
                  <strong>Supporting data:</strong> {suggestion.stat}
                </div>
              )}
              {suggestion.action && (
                <div style={styles.suggestionAction}>
                  <strong>Action:</strong> {suggestion.action}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div style={styles.disclaimer}>
        <strong>Remember:</strong> These suggestions are based on patterns in similar historical content. 
        Your results may vary, and these are not guarantees of performance.
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
  suggestionsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginBottom: "20px",
  },
  suggestionCard: {
    display: "flex",
    gap: "16px",
    padding: "20px",
    backgroundColor: "#0f1419",
    borderRadius: "8px",
    border: "1px solid #1f2937",
    transition: "all 0.2s ease",
  },
  suggestionNumber: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#38bdf8",
    color: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "16px",
    flexShrink: 0,
  },
  suggestionContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  suggestionObservation: {
    fontSize: "14px",
    color: "#e5e7eb",
    lineHeight: "1.6",
  },
  suggestionStat: {
    fontSize: "13px",
    color: "#9ca3af",
    fontStyle: "italic",
  },
  suggestionAction: {
    fontSize: "14px",
    color: "#38bdf8",
    fontWeight: 500,
  },
  disclaimer: {
    fontSize: "12px",
    color: "#6b7280",
    fontStyle: "italic",
    padding: "12px",
    backgroundColor: "rgba(156, 163, 175, 0.1)",
    borderRadius: "6px",
    lineHeight: "1.6",
  },
};

