import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const TOUR_STORAGE_KEY = "insta_tour_dismissed";

export default function Analyze() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    caption: "",
    hashtags: "",
    category: "",
    format: "reel",
    postingTime: "",
    accountSize: "",
  });

  // UI state
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState({});

  // Onboarding tour
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem(TOUR_STORAGE_KEY);
    if (!dismissed) {
      setShowTour(true);
    }
  }, []);

  // Handle file upload
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/quicktime"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "Please upload an image (JPEG, PNG, WebP) or video (MP4, MOV)",
      }));
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        file: "File size must be less than 50MB",
      }));
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setUploadedFile(file);
    setErrors((prev) => ({ ...prev, file: null }));

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }

  // Validate form
  function validateForm() {
    const newErrors = {};

    if (!formData.caption.trim()) {
      newErrors.caption = "Caption is required";
    } else if (formData.caption.length < 10) {
      newErrors.caption = "Caption should be at least 10 characters";
    }

    if (!formData.category) {
      newErrors.category = "Please select a content category";
    }

    if (!uploadedFile) {
      newErrors.file = "Please upload your post content";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Handle form submission
  function handleAnalyze(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Prepare data for analysis
    const analysisInput = {
      caption: formData.caption.trim(),
      hashtags: formData.hashtags
        .split(",")
        .map((tag) => tag.trim().replace("#", ""))
        .filter((tag) => tag.length > 0),
      category: formData.category,
      format: formData.format,
      postingTime: formData.postingTime || null,
      accountSize: formData.accountSize || null,
      fileName: uploadedFile?.name,
      fileType: uploadedFile?.type,
      fileSize: uploadedFile?.size,
    };

    // Store in localStorage (in real app, this would be sent to backend)
    const sessionId = Date.now();
    localStorage.setItem("analysis_input", JSON.stringify(analysisInput));

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/analyzing", { state: { sessionId } });
    }, 500);
  }

  const tourSteps = [
    {
      title: "Upload your post",
      text: "Start by uploading the image or video you plan to publish.",
    },
    {
      title: "Describe the caption",
      text: "Add the caption so we can find similar content patterns.",
    },
    {
      title: "Pick the category",
      text: "Choose the closest category for better matching.",
    },
    {
      title: "Run the analysis",
      text: "Submit to see historical ranges and insights.",
    },
  ];

  const currentTour = tourSteps[tourStep];

  function handleTourDismiss(persist = false) {
    setShowTour(false);
    if (persist) {
      localStorage.setItem(TOUR_STORAGE_KEY, "true");
    }
  }

  // Calculate hashtag count
  const hashtagCount = formData.hashtags
    .split(",")
    .filter((tag) => tag.trim().length > 0).length;

  // Calculate caption stats
  const captionLength = formData.caption.length;
  const captionWordCount = formData.caption.trim().split(/\s+/).filter((w) => w).length;

  return (
    <>
      <style>{analyzeCSS}</style>
      <div style={styles.container}>
        {showTour && currentTour && (
          <div className="tour-card" style={styles.tourCard} role="region" aria-live="polite">
            <div>
              <p style={styles.tourEyebrow}>
                Onboarding {tourStep + 1} of {tourSteps.length}
              </p>
              <h3 style={styles.tourTitle}>{currentTour.title}</h3>
              <p style={styles.tourText}>{currentTour.text}</p>
            </div>
            <div style={styles.tourActions}>
              <button
                type="button"
                style={styles.tourSecondaryBtn}
                onClick={() => handleTourDismiss(true)}
              >
                Do not show again
              </button>
              <div style={styles.tourNav}>
                <button
                  type="button"
                  style={styles.tourGhostBtn}
                  onClick={() => setTourStep((prev) => Math.max(0, prev - 1))}
                  disabled={tourStep === 0}
                >
                  Back
                </button>
                {tourStep < tourSteps.length - 1 ? (
                  <button
                    type="button"
                    style={styles.tourPrimaryBtn}
                    onClick={() => setTourStep((prev) => Math.min(tourSteps.length - 1, prev + 1))}
                  >
                    Next
                  </button>
                ) : (
                  <button type="button" style={styles.tourPrimaryBtn} onClick={() => handleTourDismiss(true)}>
                    Got it
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        <div style={styles.header}>
          <h1 style={styles.title}>Analyze Your Post</h1>
          <p style={styles.subtitle}>
            Upload your content and details to see how similar posts have performed
          </p>
        </div>

        <form onSubmit={handleAnalyze} style={styles.form}>
          {/* File Upload Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label}>
                Post Content <span style={styles.required}>*</span>
              </label>
              <Tooltip
                text="Upload the image or video you plan to post. This helps us understand your content better."
                show={showTooltip.file}
                onToggle={() => setShowTooltip((prev) => ({ ...prev, file: !prev.file }))}
                onClose={() => setShowTooltip((prev) => ({ ...prev, file: false }))}
              />
            </div>

            {previewUrl ? (
              <div style={styles.previewContainer}>
                <div style={styles.previewWrapper}>
                  {uploadedFile?.type?.startsWith("video/") ? (
                    <video
                      src={previewUrl}
                      className="preview"
                      style={styles.preview}
                      controls
                      muted
                    />
                  ) : (
                    <img src={previewUrl} alt="Post preview" className="preview" style={styles.preview} />
                  )}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => {
                      setUploadedFile(null);
                      setPreviewUrl(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    style={styles.removeBtn}
                    aria-label="Remove uploaded file"
                  >
                    x
                  </button>
                </div>
                <p style={styles.fileInfo}>
                  {uploadedFile?.name} ({(uploadedFile?.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>
            ) : (
              <div
                className="upload-area"
                style={styles.uploadArea}
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = "var(--accent)";
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = "var(--border-soft)";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = "var(--border-soft)";
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    const event = { target: { files: [file] } };
                    handleFileChange(event);
                  }
                }}
                aria-label="Upload post content"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  style={styles.fileInput}
                />
                <div style={styles.uploadContent}>
                  <svg style={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p style={styles.uploadText}>Click to upload or drag and drop</p>
                  <p style={styles.uploadHint}>
                    Image (JPEG, PNG, WebP) or Video (MP4, MOV) up to 50MB
                  </p>
                </div>
              </div>
            )}
            {errors.file && <p style={styles.error}>{errors.file}</p>}
          </div>

          {/* Caption Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label} htmlFor="caption">
                Caption <span style={styles.required}>*</span>
              </label>
              <Tooltip
                text="The text that will accompany your post. This is analyzed for topic, intent, and structure."
                show={showTooltip.caption}
                onToggle={() => setShowTooltip((prev) => ({ ...prev, caption: !prev.caption }))}
                onClose={() => setShowTooltip((prev) => ({ ...prev, caption: false }))}
              />
            </div>
            <textarea
              id="caption"
              name="caption"
              value={formData.caption}
              onChange={handleChange}
              placeholder="Write your caption here... What is your post about?"
              rows={6}
              style={{
                ...styles.textarea,
                ...(errors.caption ? styles.inputError : {}),
              }}
              maxLength={2200}
            />
            <div style={styles.captionStats}>
              <span style={styles.stat}>{captionLength} / 2,200 characters</span>
              <span style={styles.stat}>{captionWordCount} words</span>
            </div>
            {errors.caption && <p style={styles.error}>{errors.caption}</p>}
          </div>

          {/* Hashtags Section */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <label style={styles.label} htmlFor="hashtags">
                Hashtags <span style={styles.optional}>(optional but recommended)</span>
              </label>
              <Tooltip
                text="Separate hashtags with commas. We analyze hashtag themes and their impact on performance."
                show={showTooltip.hashtags}
                onToggle={() => setShowTooltip((prev) => ({ ...prev, hashtags: !prev.hashtags }))}
                onClose={() => setShowTooltip((prev) => ({ ...prev, hashtags: false }))}
              />
            </div>
            <input
              id="hashtags"
              name="hashtags"
              type="text"
              value={formData.hashtags}
              onChange={handleChange}
              placeholder="fashion, style, outfit, instagram"
              style={styles.input}
            />
            <p style={styles.hint}>
              {hashtagCount > 0 ? (
                <>
                  <span style={styles.hashtagCount}>{hashtagCount}</span> hashtag
                  {hashtagCount !== 1 ? "s" : ""} detected
                </>
              ) : (
                "Tip: Hashtags help us find more similar content"
              )}
            </p>
          </div>

          {/* Category and Format */}
          <div className="form-row" style={styles.row}>
            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <label style={styles.label} htmlFor="category">
                  Content Category <span style={styles.required}>*</span>
                </label>
                <Tooltip
                  text="Select the primary category that best describes your content niche."
                  show={showTooltip.category}
                  onToggle={() => setShowTooltip((prev) => ({ ...prev, category: !prev.category }))}
                  onClose={() => setShowTooltip((prev) => ({ ...prev, category: false }))}
                />
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  ...styles.select,
                  ...(errors.category ? styles.inputError : {}),
                }}
              >
                <option value="">Select category</option>
                <option value="beauty">Beauty & Makeup</option>
                <option value="fashion">Fashion & Style</option>
                <option value="fitness">Fitness & Health</option>
                <option value="food">Food & Cooking</option>
                <option value="travel">Travel</option>
                <option value="education">Education & Learning</option>
                <option value="entertainment">Entertainment</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="tech">Technology</option>
                <option value="business">Business & Entrepreneurship</option>
                <option value="other">Other</option>
              </select>
              {errors.category && <p style={styles.error}>{errors.category}</p>}
            </div>

            <div style={styles.section}>
              <div style={styles.sectionHeader}>
                <label style={styles.label} htmlFor="format">
                  Content Format
                </label>
                <Tooltip
                  text="The type of content you are posting. Currently we focus on Reels."
                  show={showTooltip.format}
                  onToggle={() => setShowTooltip((prev) => ({ ...prev, format: !prev.format }))}
                  onClose={() => setShowTooltip((prev) => ({ ...prev, format: false }))}
                />
              </div>
              <select
                id="format"
                name="format"
                value={formData.format}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="reel">Reel</option>
                <option value="post" disabled>
                  Post (coming soon)
                </option>
                <option value="story" disabled>
                  Story (coming soon)
                </option>
              </select>
            </div>
          </div>

          {/* Optional Fields */}
          <div style={styles.optionalSection}>
            <button
              type="button"
              className="optional-toggle"
              onClick={() => setShowTooltip((prev) => ({ ...prev, optional: !prev.optional }))}
              style={styles.optionalToggle}
              aria-expanded={showTooltip.optional}
            >
              {showTooltip.optional ? "-" : "+"} Optional Details
            </button>

            {showTooltip.optional && (
              <div style={styles.optionalFields}>
                <div style={styles.section}>
                  <label style={styles.label} htmlFor="postingTime">
                    Planned Posting Time
                  </label>
                  <input
                    id="postingTime"
                    name="postingTime"
                    type="datetime-local"
                    value={formData.postingTime}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <p style={styles.hint}>
                    We will show you when similar content typically performs best
                  </p>
                </div>

                <div style={styles.section}>
                  <label style={styles.label} htmlFor="accountSize">
                    Account Size (Optional)
                  </label>
                  <select
                    id="accountSize"
                    name="accountSize"
                    value={formData.accountSize}
                    onChange={handleChange}
                    style={styles.select}
                  >
                    <option value="">Prefer not to say</option>
                    <option value="0-1k">0 - 1,000 followers</option>
                    <option value="1k-10k">1,000 - 10,000 followers</option>
                    <option value="10k-50k">10,000 - 50,000 followers</option>
                    <option value="50k-100k">50,000 - 100,000 followers</option>
                    <option value="100k+">100,000+ followers</option>
                  </select>
                  <p style={styles.hint}>Helps us normalize performance comparisons</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div style={styles.submitSection}>
            <button
              type="submit"
              className="submit-btn"
              disabled={isSubmitting}
              style={{
                ...styles.submitBtn,
                ...(isSubmitting ? styles.submitBtnDisabled : {}),
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={styles.spinner} aria-hidden="true"></span>
                  Analyzing...
                </>
              ) : (
                "Analyze Post"
              )}
            </button>
            <p style={styles.disclaimer}>
              <strong>Note:</strong> This tool provides performance ranges based on similar historical content, not exact
              predictions. Results are for guidance only.
            </p>
          </div>
        </form>
      </div>
    </>
  );
}

// Tooltip Component
function Tooltip({ text, show, onToggle, onClose }) {
  return (
    <div style={styles.tooltipContainer}>
      <button
        type="button"
        className="tooltip-btn"
        onClick={onToggle}
        onBlur={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose?.();
          }
        }}
        style={styles.tooltipBtn}
        aria-label="Show help information"
        aria-expanded={show}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      </button>
      {show && (
        <div className="tooltip" style={styles.tooltip} role="tooltip">
          {text}
        </div>
      )}
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "0 20px 60px",
  },

  tourCard: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-strong)",
    borderRadius: "16px",
    padding: "20px 24px",
    marginBottom: "32px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    alignItems: "center",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  },

  tourEyebrow: {
    textTransform: "uppercase",
    fontSize: "12px",
    letterSpacing: "0.2em",
    color: "var(--text-muted)",
    margin: 0,
  },

  tourTitle: {
    fontSize: "20px",
    margin: "6px 0",
  },

  tourText: {
    margin: 0,
    color: "var(--text-muted)",
  },

  tourActions: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "flex-end",
  },

  tourNav: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  tourPrimaryBtn: {
    background: "var(--accent)",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 16px",
    fontWeight: 600,
    cursor: "pointer",
  },

  tourSecondaryBtn: {
    background: "transparent",
    color: "var(--text-muted)",
    border: "none",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: "13px",
  },

  tourGhostBtn: {
    background: "transparent",
    color: "var(--text-main)",
    border: "1px solid var(--border-soft)",
    borderRadius: "8px",
    padding: "10px 14px",
    cursor: "pointer",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  title: {
    fontSize: "36px",
    fontWeight: 700,
    marginBottom: "12px",
    color: "var(--text-main)",
    letterSpacing: "-0.01em",
  },

  subtitle: {
    fontSize: "16px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },

  label: {
    fontSize: "15px",
    fontWeight: 600,
    color: "var(--text-main)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  required: {
    color: "var(--danger)",
  },

  optional: {
    fontSize: "13px",
    fontWeight: 400,
    color: "var(--text-muted)",
    fontStyle: "italic",
  },

  input: {
    backgroundColor: "var(--bg-soft)",
    color: "var(--text-main)",
    border: "1px solid var(--border-soft)",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "15px",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
  },

  textarea: {
    backgroundColor: "var(--bg-soft)",
    color: "var(--text-main)",
    border: "1px solid var(--border-soft)",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "15px",
    fontFamily: "inherit",
    resize: "vertical",
    minHeight: "120px",
    transition: "all 0.2s ease",
  },

  select: {
    backgroundColor: "var(--bg-soft)",
    color: "var(--text-main)",
    border: "1px solid var(--border-soft)",
    borderRadius: "8px",
    padding: "12px 16px",
    fontSize: "15px",
    fontFamily: "inherit",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  inputError: {
    borderColor: "var(--danger)",
    boxShadow: "0 0 0 3px rgba(220, 38, 38, 0.1)",
  },

  error: {
    color: "var(--danger)",
    fontSize: "13px",
    marginTop: "4px",
  },

  hint: {
    color: "var(--text-muted)",
    fontSize: "13px",
    marginTop: "4px",
  },

  captionStats: {
    display: "flex",
    gap: "16px",
    fontSize: "13px",
    color: "var(--text-muted)",
  },

  stat: {
    display: "inline-block",
  },

  hashtagCount: {
    color: "var(--accent)",
    fontWeight: 600,
  },

  uploadArea: {
    border: "2px dashed var(--border-soft)",
    borderRadius: "12px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    backgroundColor: "var(--bg-card)",
  },

  fileInput: {
    display: "none",
  },

  uploadContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },

  uploadIcon: {
    width: "48px",
    height: "48px",
    color: "var(--accent)",
  },

  uploadText: {
    fontSize: "16px",
    fontWeight: 500,
    color: "var(--text-main)",
    margin: 0,
  },

  uploadHint: {
    fontSize: "13px",
    color: "var(--text-muted)",
    margin: 0,
  },

  previewContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  previewWrapper: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid var(--border-soft)",
    backgroundColor: "var(--bg-soft)",
  },

  preview: {
    width: "100%",
    maxHeight: "400px",
    objectFit: "contain",
    display: "block",
  },

  removeBtn: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "rgba(15, 23, 42, 0.7)",
    color: "#ffffff",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    lineHeight: 1,
    transition: "all 0.2s ease",
  },

  fileInfo: {
    fontSize: "13px",
    color: "var(--text-muted)",
    margin: 0,
  },

  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },

  optionalSection: {
    backgroundColor: "var(--bg-card)",
    border: "1px solid var(--border-soft)",
    borderRadius: "12px",
    padding: "20px",
  },

  optionalToggle: {
    background: "transparent",
    border: "none",
    color: "var(--accent)",
    fontSize: "15px",
    fontWeight: 600,
    cursor: "pointer",
    padding: "8px 0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "color 0.2s ease",
  },

  optionalFields: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },

  submitSection: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "8px",
  },

  submitBtn: {
    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "16px 32px",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },

  submitBtnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255, 255, 255, 0.5)",
    borderTopColor: "#ffffff",
    borderRadius: "50%",
    animation: "spin 0.6s linear infinite",
  },

  disclaimer: {
    fontSize: "13px",
    color: "var(--text-muted)",
    lineHeight: "1.6",
    textAlign: "center",
    margin: 0,
  },

  tooltipContainer: {
    position: "relative",
  },

  tooltipBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text-muted)",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.2s ease",
    width: "24px",
    height: "24px",
  },

  tooltip: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "8px",
    backgroundColor: "var(--bg-card)",
    color: "var(--text-main)",
    padding: "12px 16px",
    borderRadius: "8px",
    fontSize: "13px",
    lineHeight: "1.5",
    maxWidth: "280px",
    zIndex: 100,
    border: "1px solid var(--border-soft)",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.1)",
  },
};

// CSS for animations and responsive design
const analyzeCSS = `
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  .upload-area:hover {
    border-color: var(--border-strong);
    background-color: var(--bg-soft);
  }

  .remove-btn:hover {
    background-color: rgba(220, 38, 38, 0.9);
    transform: scale(1.1);
  }

  .tooltip-btn:hover {
    color: var(--accent);
    background-color: rgba(37, 99, 235, 0.08);
  }

  .optional-toggle:hover {
    color: var(--accent-soft);
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
  }

  .submit-btn:active:not(:disabled) {
    transform: translateY(0);
  }

  @media (max-width: 900px) {
    .tour-card {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr !important;
    }

    .upload-area {
      padding: 30px 16px !important;
    }

    .preview {
      max-height: 300px !important;
    }
  }

  @media (max-width: 480px) {
    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }

    .tooltip {
      right: auto !important;
      left: 0 !important;
      max-width: calc(100vw - 32px) !important;
    }
  }
`;
