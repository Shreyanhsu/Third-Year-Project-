import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import useReducedMotion from "../utils/useReducedMotion";

export default function Landing() {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const reducedMotion = useReducedMotion();
  const [visibleSections, setVisibleSections] = useState(new Set());
  const sectionRefs = useRef({});

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (reducedMotion) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [reducedMotion]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-link" style={styles.skipLink}>
        Skip to main content
      </a>

      {/* Responsive CSS */}
      <style>{responsiveCSS}</style>

      <div style={styles.page} id="main-content">
        {/* HERO */}
        <section
          style={styles.hero}
          className={`landing-hero ${reducedMotion ? "" : "fade-in"}`}
        >
          <Badge text="Pre-Post Content Analysis" />

          <h1 style={styles.title} className="landing-title">
            Evidence-Based <Highlight>Instagram</Highlight> Content Insights
          </h1>

          <p style={styles.subtitle} className="landing-subtitle">
            Understand how <Highlight>similar content</Highlight> has performed
            historically -- <span className="subtitle-break">before you post.</span>
          </p>

          <p style={styles.muted}>
            No predictions. No hype. <Highlight soft>Just clarity.</Highlight>
          </p>

          <div style={styles.heroActions} className="hero-actions">
            <button
              onClick={() => navigate("/login")}
              style={styles.primaryBtn}
              className="primary-btn"
              aria-label="Get started with Instagram content analysis"
            >
              Get Started
            </button>
            <button
              style={styles.secondaryBtn}
              className="secondary-btn"
              onClick={() => scrollToSection("how-it-works")}
              aria-label="Learn how the tool works"
            >
              How it works <span aria-hidden="true">v</span>
            </button>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          style={styles.section}
          className={`landing-section ${
            reducedMotion || visibleSections.has("how-it-works")
              ? "section-visible"
              : "section-hidden"
          }`}
          ref={(el) => (sectionRefs.current["how-it-works"] = el)}
        >
          <SectionTitle
            title="How This Tool Works"
            subtitle="A transparent, evidence-first pipeline"
          />

          <div style={styles.flowGrid} className="flow-grid">
            <FlowCard
              step="01"
              title="You enter your draft"
              index={0}
              visible={reducedMotion || visibleSections.has("how-it-works")}
            >
              Caption, hashtags, and category -- nothing more.
            </FlowCard>

            <FlowCard
              step="02"
              title="Similar content is matched"
              index={1}
              visible={reducedMotion || visibleSections.has("how-it-works")}
            >
              Your input is compared against a curated dataset of real posts.
            </FlowCard>

            <FlowCard
              step="03"
              title="Historical data is analyzed"
              index={2}
              visible={reducedMotion || visibleSections.has("how-it-works")}
            >
              We look at top, average, and poor-performing posts.
            </FlowCard>

            <FlowCard
              step="04"
              title="Insights are shown"
              index={3}
              visible={reducedMotion || visibleSections.has("how-it-works")}
            >
              Ranges, patterns, and improvement guidance -- not predictions.
            </FlowCard>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section
          id="what-you-get"
          style={styles.sectionAlt}
          className={`landing-section ${
            reducedMotion || visibleSections.has("what-you-get")
              ? "section-visible"
              : "section-hidden"
          }`}
          ref={(el) => (sectionRefs.current["what-you-get"] = el)}
        >
          <SectionTitle
            title="What You Actually Get"
            subtitle="Designed for clarity, not false confidence"
          />

          <div style={styles.featureGrid} className="feature-grid">
            <Feature
              text="Performance ranges, not exact numbers"
              visible={reducedMotion || visibleSections.has("what-you-get")}
            />
            <Feature
              text="Top vs bottom content comparison"
              visible={reducedMotion || visibleSections.has("what-you-get")}
            />
            <Feature
              text="Time-based engagement patterns"
              visible={reducedMotion || visibleSections.has("what-you-get")}
            />
            <Feature
              text="Actionable improvement suggestions"
              visible={reducedMotion || visibleSections.has("what-you-get")}
            />
          </div>
        </section>

        {/* TRUST / PHILOSOPHY */}
        <section
          id="trust"
          style={styles.section}
          className={`landing-section ${
            reducedMotion || visibleSections.has("trust")
              ? "section-visible"
              : "section-hidden"
          }`}
          ref={(el) => (sectionRefs.current["trust"] = el)}
        >
          <SectionTitle
            title="Why You Can Trust This"
            subtitle="Honest analytics by design"
          />

          <p style={styles.text}>
            Most tools require your posting history.
            <br />
            This system works even if you are a <Highlight>new creator</Highlight>.
          </p>

          <button
            style={styles.linkBtn}
            className="link-btn"
            onClick={() => setShowMore(!showMore)}
            aria-expanded={showMore}
            aria-label={
              showMore
                ? "Hide details about predictions"
                : "Show details about why we avoid predictions"
            }
          >
            {showMore ? (
              <>
                Hide details <span aria-hidden="true">^</span>
              </>
            ) : (
              <>
                Why we avoid predictions <span aria-hidden="true">-&gt;</span>
              </>
            )}
          </button>

          <div
            style={{
              ...styles.expandBox,
              ...(showMore ? styles.expandBoxVisible : styles.expandBoxHidden),
            }}
            role="region"
            aria-live="polite"
            aria-hidden={!showMore}
          >
            {showMore && (
              <>
                <p>
                  We intentionally avoid predicting virality or exact views.
                  <br />
                  Instead, we show what has <b>typically happened</b> in similar
                  cases, across multiple creators and time windows.
                </p>

                <p style={styles.muted}>
                  Trust is a feature -- not an afterthought.
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

/* ---------- Small UI Helpers ---------- */

function Highlight({ children, soft }) {
  return (
    <span
      style={{
        color: soft ? "var(--accent-soft)" : "var(--accent)",
        fontWeight: 600,
      }}
      className="highlight-text"
    >
      {children}
    </span>
  );
}

function Badge({ text }) {
  return (
    <div style={styles.badge} className="badge-pulse">
      {text}
    </div>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <>
      <h2 style={styles.sectionTitle} className="section-title">
        {title}
      </h2>
      <p style={styles.sectionSubtitle} className="section-subtitle">
        {subtitle}
      </p>
    </>
  );
}

function FlowCard({ step, title, children, index = 0, visible = true }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.flowCard,
        ...(isHovered ? styles.flowCardHover : {}),
        transitionDelay: `${index * 100}ms`,
      }}
      className={`flow-card ${visible ? "card-visible" : "card-hidden"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.stepBadge}>{step}</div>
      <h3 style={styles.flowCardTitle}>{title}</h3>
      <p style={styles.flowCardText}>{children}</p>
    </div>
  );
}

function Feature({ text, visible = true }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.feature,
        ...(isHovered ? styles.featureHover : {}),
      }}
      className={visible ? "feature-visible" : "feature-hidden"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span style={styles.checkmark} aria-hidden="true">
        check
      </span>
      <span>{text}</span>
    </div>
  );
}

/* ---------- Responsive CSS ---------- */

const responsiveCSS = `
  .skip-link {
    position: absolute;
    top: 10px;
    left: 16px;
    transform: translateY(-200%);
    transition: transform 0.2s ease;
  }

  .skip-link:focus {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .landing-hero {
      padding: 60px 20px 50px !important;
    }

    .landing-title {
      font-size: 32px !important;
      line-height: 1.3 !important;
    }

    .landing-subtitle {
      font-size: 16px !important;
    }

    .landing-section {
      margin: 50px auto !important;
    }

    .subtitle-break {
      display: block;
    }

    .flow-grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }

    .feature-grid {
      grid-template-columns: 1fr !important;
    }

    .hero-actions {
      flex-direction: column;
      width: 100%;
    }

    .hero-actions button {
      width: 100%;
    }
  }

  @media (max-width: 480px) {
    .landing-title {
      font-size: 28px !important;
    }

    .landing-hero {
      padding: 40px 16px 40px !important;
    }

    .section-title {
      font-size: 24px !important;
    }
  }

  @media (min-width: 1400px) {
    .landing-hero {
      max-width: 1000px !important;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    .fade-in,
    .section-hidden,
    .card-hidden,
    .feature-hidden {
      opacity: 1 !important;
      transform: none !important;
    }
  }

  .fade-in {
    animation: fadeIn 0.8s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .section-hidden {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .section-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  .card-hidden {
    opacity: 0;
    transform: translateY(20px);
  }

  .card-visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.5s ease-out, transform 0.5s ease-out;
  }

  .feature-hidden {
    opacity: 0;
    transform: translateX(-10px);
  }

  .feature-visible {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  }

  .badge-pulse {
    animation: subtlePulse 3s ease-in-out infinite;
  }

  @keyframes subtlePulse {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
    }
    50% {
      box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
    }
  }

  .highlight-text {
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle-break {
    display: inline;
  }

  button:focus-visible,
  a:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .link-btn:hover {
    text-decoration: underline;
  }

  .link-btn:hover span {
    display: inline-block;
    transition: transform 0.2s ease;
  }

  .link-btn:hover span[aria-hidden="true"] {
    transition: transform 0.2s ease;
  }

  .primary-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.3);
  }

  .primary-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  .secondary-btn:hover {
    border-color: var(--accent);
    background-color: rgba(37, 99, 235, 0.06);
    transform: translateY(-2px);
  }

  .secondary-btn:active {
    transform: translateY(0);
  }

  .link-btn:hover {
    text-decoration: underline;
  }
`;

/* ---------- Styles ---------- */

const styles = {
  skipLink: {
    position: "absolute",
    top: "10px",
    left: "16px",
    background: "var(--accent)",
    color: "#ffffff",
    padding: "8px 16px",
    borderRadius: "4px",
    textDecoration: "none",
    fontWeight: 600,
    zIndex: 1000,
  },

  page: {
    paddingBottom: "100px",
    position: "relative",
  },

  hero: {
    textAlign: "center",
    padding: "120px 20px 90px",
    maxWidth: "900px",
    margin: "0 auto",
  },

  title: {
    fontSize: "52px",
    lineHeight: "1.2",
    marginBottom: "20px",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },

  subtitle: {
    fontSize: "18px",
    lineHeight: "1.7",
    marginBottom: "12px",
    color: "var(--text-muted)",
  },

  muted: {
    color: "var(--text-muted)",
    fontSize: "15px",
    marginTop: "8px",
  },

  heroActions: {
    marginTop: "40px",
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
  },

  secondaryBtn: {
    background: "transparent",
    color: "var(--accent)",
    border: "2px solid var(--border-soft)",
    borderRadius: "8px",
    padding: "14px 28px",
    fontSize: "16px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  badge: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "999px",
    fontSize: "13px",
    backgroundColor: "var(--bg-soft)",
    border: "1px solid var(--border-soft)",
    marginBottom: "24px",
    color: "var(--accent)",
    fontWeight: 500,
    letterSpacing: "0.5px",
  },

  section: {
    maxWidth: "1100px",
    margin: "100px auto",
    padding: "0 20px",
  },

  sectionAlt: {
    maxWidth: "1100px",
    margin: "100px auto",
    padding: "60px 20px",
    backgroundColor: "var(--bg-soft)",
    borderRadius: "16px",
    border: "1px solid var(--border-soft)",
  },

  sectionTitle: {
    fontSize: "36px",
    marginBottom: "8px",
    fontWeight: 700,
    letterSpacing: "-0.01em",
  },

  sectionSubtitle: {
    color: "var(--text-muted)",
    marginBottom: "40px",
    fontSize: "16px",
  },

  flowGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "24px",
  },

  flowCard: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-soft)",
    borderRadius: "14px",
    padding: "28px",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "default",
    position: "relative",
    overflow: "hidden",
  },

  flowCardHover: {
    transform: "translateY(-6px)",
    borderColor: "var(--border-strong)",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.12)",
  },

  stepBadge: {
    color: "var(--accent)",
    fontWeight: 700,
    fontSize: "14px",
    marginBottom: "12px",
    letterSpacing: "1px",
    display: "inline-block",
    padding: "4px 10px",
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    borderRadius: "6px",
  },

  flowCardTitle: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "12px",
    color: "var(--text-main)",
    lineHeight: "1.4",
  },

  flowCardText: {
    color: "var(--text-muted)",
    lineHeight: "1.6",
    fontSize: "15px",
    margin: 0,
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "18px",
  },

  feature: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-soft)",
    borderRadius: "12px",
    padding: "20px",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  featureHover: {
    borderColor: "var(--border-strong)",
    backgroundColor: "var(--bg-soft)",
    transform: "translateX(4px)",
  },

  checkmark: {
    color: "var(--accent)",
    fontSize: "12px",
    fontWeight: 700,
    flexShrink: 0,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "24px",
    height: "24px",
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    borderRadius: "50%",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  text: {
    lineHeight: "1.8",
    maxWidth: "700px",
    fontSize: "16px",
    color: "var(--text-muted)",
  },

  linkBtn: {
    marginTop: "24px",
    background: "transparent",
    border: "none",
    color: "var(--accent)",
    padding: "8px 0",
    fontSize: "15px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    textAlign: "left",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },

  expandBox: {
    marginTop: "20px",
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-soft)",
    borderRadius: "12px",
    padding: "24px",
    maxWidth: "700px",
    overflow: "hidden",
  },

  expandBoxVisible: {
    opacity: 1,
    maxHeight: "500px",
    marginTop: "20px",
    padding: "24px",
    transition:
      "opacity 0.4s ease, max-height 0.4s ease, margin-top 0.4s ease, padding 0.4s ease",
  },

  expandBoxHidden: {
    opacity: 0,
    maxHeight: 0,
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 0,
    overflow: "hidden",
    transition:
      "opacity 0.3s ease, max-height 0.3s ease, margin-top 0.3s ease, padding 0.3s ease",
  },
};
