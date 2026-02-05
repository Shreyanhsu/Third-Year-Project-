import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../utils/auth";
import useReducedMotion from "../utils/useReducedMotion";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [instagramId, setInstagramId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const reducedMotion = useReducedMotion();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await signupUser({ fullName, instagramId, email, password });
      if (response.error) {
        throw new Error(response.error);
      }
      navigate("/analyze");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <>
      <style>{signupCSS}</style>
      <div className="auth-container" style={styles.container}>
        <div
          className={`auth-card ${reducedMotion ? "" : "fade-in"}`}
          style={styles.card}
        >
          <div style={styles.header}>
            <h2 style={styles.title}>Create your account</h2>
            <p style={styles.subtitle}>Start analyzing your Instagram content performance</p>
          </div>

          {error && (
            <div role="alert" aria-live="assertive" style={styles.errorBox} className="error-shake">
              <span style={styles.errorIcon} aria-hidden="true">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            <div style={styles.inputGroup}>
              <label htmlFor="fullName" style={styles.label}>
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setError("");
                }}
                required
                autoComplete="name"
                aria-required="true"
                aria-invalid={error && fullName ? "true" : "false"}
                style={styles.input}
                className="auth-input"
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="instagramId" style={styles.label}>
                Instagram Username
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputPrefix} aria-hidden="true">@</span>
                <input
                  id="instagramId"
                  type="text"
                  placeholder="username"
                  value={instagramId}
                  onChange={(e) => {
                    setInstagramId(e.target.value.replace("@", ""));
                    setError("");
                  }}
                  required
                  autoComplete="username"
                  aria-required="true"
                  aria-invalid={error && instagramId ? "true" : "false"}
                  style={{ ...styles.input, ...styles.inputWithPrefix }}
                  className="auth-input"
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
                autoComplete="email"
                aria-required="true"
                aria-invalid={error && email ? "true" : "false"}
                style={styles.input}
                className="auth-input"
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
                autoComplete="new-password"
                aria-required="true"
                aria-invalid={error && password ? "true" : "false"}
                aria-describedby="password-hint"
                style={styles.input}
                className="auth-input"
              />
              <p id="password-hint" style={styles.hint}>
                Use at least 8 characters with a mix of letters and numbers
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.submitBtn,
                ...(isLoading ? styles.submitBtnLoading : {}),
              }}
              className="auth-submit-btn"
              aria-label={isLoading ? "Creating account..." : "Create your account"}
            >
              {isLoading ? (
                <>
                  <span style={styles.spinner} aria-hidden="true"></span>
                  <span>Creating account...</span>
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div style={styles.divider}>
            <span style={styles.dividerText}>Already have an account?</span>
          </div>

          <p style={styles.footer}>
            <Link to="/login" style={styles.link} className="auth-link" aria-label="Sign in to your existing account">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

const signupCSS = `
  @media (max-width: 768px) {
    .auth-container {
      padding: 20px !important;
    }

    .auth-card {
      margin: 40px auto !important;
      padding: 24px !important;
    }

    .auth-title {
      font-size: 28px !important;
    }

    .auth-subtitle {
      font-size: 14px !important;
    }
  }

  @media (max-width: 480px) {
    .auth-card {
      margin: 20px auto !important;
      padding: 20px !important;
      border-radius: 12px !important;
    }

    .auth-title {
      font-size: 24px !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .fade-in,
    .error-shake {
      animation: none !important;
    }
  }

  .fade-in {
    animation: fadeInUp 0.6s ease-out;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .error-shake {
    animation: shake 0.4s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
    20%, 40%, 60%, 80% { transform: translateX(4px); }
  }

  .auth-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
    outline: none;
  }

  .auth-input:hover:not(:focus) {
    border-color: var(--border-strong);
  }

  .auth-submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  }

  .auth-submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .auth-submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .auth-link:hover {
    text-decoration: underline;
    color: var(--accent);
  }

  .auth-link:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const styles = {
  container: {
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    maxWidth: "480px",
    margin: "80px auto",
    backgroundColor: "var(--bg-card)",
    padding: "40px",
    borderRadius: "16px",
    border: "1px solid var(--border-soft)",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.08)",
  },

  header: {
    textAlign: "center",
    marginBottom: "32px",
  },

  title: {
    fontSize: "32px",
    fontWeight: 700,
    marginBottom: "8px",
    color: "var(--text-main)",
    letterSpacing: "-0.01em",
  },

  subtitle: {
    fontSize: "15px",
    color: "var(--text-muted)",
    margin: 0,
  },

  errorBox: {
    backgroundColor: "rgba(220, 38, 38, 0.08)",
    border: "1px solid rgba(220, 38, 38, 0.2)",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#b91c1c",
    fontSize: "14px",
  },

  errorIcon: {
    fontSize: "18px",
    flexShrink: 0,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  label: {
    fontSize: "14px",
    fontWeight: 500,
    color: "var(--text-main)",
    marginBottom: "4px",
  },

  input: {
    backgroundColor: "var(--bg-soft)",
    color: "var(--text-main)",
    border: "1px solid var(--border-soft)",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "15px",
    transition: "all 0.2s ease",
    width: "100%",
    boxSizing: "border-box",
  },

  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },

  inputPrefix: {
    position: "absolute",
    left: "16px",
    color: "var(--text-muted)",
    fontSize: "15px",
    fontWeight: 500,
    zIndex: 1,
    pointerEvents: "none",
  },

  inputWithPrefix: {
    paddingLeft: "32px",
  },

  hint: {
    fontSize: "12px",
    color: "var(--text-muted)",
    margin: 0,
    marginTop: "4px",
  },

  submitBtn: {
    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
    marginTop: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  submitBtnLoading: {
    opacity: 0.8,
  },

  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
    display: "inline-block",
  },

  divider: {
    margin: "24px 0",
    textAlign: "center",
    position: "relative",
  },

  dividerText: {
    color: "var(--text-muted)",
    fontSize: "14px",
    position: "relative",
    padding: "0 12px",
    backgroundColor: "var(--bg-card)",
  },

  footer: {
    marginTop: "20px",
    textAlign: "center",
    color: "var(--text-muted)",
    fontSize: "14px",
  },

  link: {
    color: "var(--accent)",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.2s ease",
  },
};
