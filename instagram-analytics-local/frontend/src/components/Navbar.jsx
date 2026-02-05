import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { isLoggedIn, logoutUser, getCurrentUser } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isLoggedIn();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Get user info if logged in
  useEffect(() => {
    if (loggedIn) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
  }, [loggedIn]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logoutUser();
    setUser(null);
    navigate("/login");
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{navbarCSS}</style>
      <nav 
        style={{
          ...styles.nav,
          ...(loggedIn ? styles.navAuthenticated : styles.navUnauthenticated),
        }}
        className={`navbar ${loggedIn ? "navbar-authenticated" : "navbar-unauthenticated"}`}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div style={styles.logoContainer}>
          <Link to="/" style={styles.logoLink} className="logo-clickable" aria-label="Go to home page">
            InstaInsight
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div style={styles.desktopNav} className="desktop-nav">
          {!loggedIn ? (
            <>
              <Link 
                to="/" 
                style={{
                  ...styles.navLink,
                  ...(isActive("/") ? styles.navLinkActive : {}),
                }}
                className="nav-link"
              >
                Home
              </Link>
              <Link 
                to="/login" 
                style={{
                  ...styles.navLink,
                  ...(isActive("/login") ? styles.navLinkActive : {}),
                }}
                className="nav-link"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                style={{
                  ...styles.primaryNavLink,
                  ...(isActive("/signup") ? styles.primaryNavLinkActive : {}),
                }}
                className="nav-link-primary"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/analyze" 
                style={{
                  ...styles.navLink,
                  ...(isActive("/analyze") ? styles.navLinkActive : {}),
                }}
                className="nav-link"
              >
                Analyze
              </Link>
              <Link
                to="/saved"
                style={{
                  ...styles.navLink,
                  ...(isActive("/saved") ? styles.navLinkActive : {}),
                }}
                className="nav-link"
              >
                Saved
              </Link>
              {user && (
                <div style={styles.userInfo} className="user-info">
                  <span style={styles.userName} aria-label={`Logged in as ${user.fullName || user.email}`}>
                    {user.fullName || user.email?.split("@")[0] || "User"}
                  </span>
                </div>
              )}
              <button 
                onClick={handleLogout} 
                style={styles.logoutBtn}
                className="logout-btn"
                aria-label="Log out of your account"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          style={styles.mobileMenuBtn}
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
        >
          <span 
            className={`hamburger ${isMenuOpen ? "hamburger-open" : ""}`}
            style={styles.hamburger}
            aria-hidden="true"
          >
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        {/* Mobile Navigation */}
        <div
          id="mobile-menu"
          style={{
            ...styles.mobileNav,
            ...(isMenuOpen ? styles.mobileNavOpen : {}),
          }}
          className={`mobile-nav ${isMenuOpen ? "mobile-nav-open" : ""}`}
        >
          {!loggedIn ? (
            <>
              <Link 
                to="/" 
                style={styles.mobileNavLink}
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/login" 
                style={styles.mobileNavLink}
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                style={styles.mobileNavLinkPrimary}
                className="mobile-nav-link-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {user && (
                <div style={styles.mobileUserInfo}>
                  <span style={styles.mobileUserName}>
                    {user.fullName || user.email?.split("@")[0] || "User"}
                  </span>
                  <span style={styles.mobileUserEmail}>
                    {user.email}
                  </span>
                </div>
              )}
              <Link 
                to="/analyze" 
                style={styles.mobileNavLink}
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Analyze
              </Link>
              <Link
                to="/saved"
                style={styles.mobileNavLink}
                className="mobile-nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Saved
              </Link>
              <button 
                onClick={handleLogout} 
                style={styles.mobileLogoutBtn}
                className="mobile-logout-btn"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
}

const navbarCSS = `
  @media (max-width: 768px) {
    .desktop-nav {
      display: none !important;
    }
    
    .mobile-menu-btn {
      display: flex !important;
    }
    
    .navbar {
      padding: 12px 20px !important;
    }
  }
  
  @media (min-width: 769px) {
    .mobile-menu-btn,
    .mobile-nav {
      display: none !important;
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .nav-link,
    .logo-clickable,
    .logout-btn,
    .mobile-nav {
      transition: none !important;
    }
    
    .mobile-nav {
      animation: none !important;
    }
  }
  
  .logo-clickable {
    transition: all 0.2s ease;
  }
  
  .logo-clickable:hover {
    color: var(--accent);
    transform: scale(1.05);
  }
  
  .logo-clickable:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 4px;
    border-radius: 4px;
  }
  
  .nav-link {
    transition: all 0.2s ease;
    position: relative;
  }
  
  .nav-link:hover {
    color: var(--accent);
  }
  
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--accent);
    transition: width 0.3s ease;
  }
  
  .nav-link:hover::after,
  .nav-link-active::after {
    width: 100%;
  }
  
  .nav-link-primary {
    transition: all 0.3s ease;
  }
  
  .nav-link-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }
  
  .logout-btn {
    transition: all 0.2s ease;
  }
  
  .logout-btn:hover {
    background-color: rgba(220, 38, 38, 0.08);
    border-color: rgba(220, 38, 38, 0.3);
    color: #dc2626;
  }
  
  .logout-btn:active {
    transform: scale(0.98);
  }
  
  .user-info {
    transition: all 0.2s ease;
  }
  
  .mobile-nav {
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .mobile-nav-link,
  .mobile-nav-link-primary {
    transition: background-color 0.2s ease;
  }
  
  .mobile-nav-link:hover,
  .mobile-nav-link-primary:hover {
    background-color: rgba(37, 99, 235, 0.08);
  }
  
  .mobile-logout-btn:hover {
    background-color: rgba(220, 38, 38, 0.08);
    color: #dc2626;
  }
  
  .hamburger {
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 20px;
  }
  
  .hamburger span {
    display: block;
    width: 100%;
    height: 2px;
    background-color: var(--accent);
    border-radius: 2px;
    transition: all 0.3s ease;
  }
  
  .hamburger-open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }
  
  .hamburger-open span:nth-child(2) {
    opacity: 0;
  }
  
  .hamburger-open span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
`;

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 32px",
    backgroundColor: "var(--bg-card)",
    borderBottom: "1px solid var(--border-soft)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxShadow: "0 2px 10px rgba(15, 23, 42, 0.06)",
  },

  navAuthenticated: {
    backgroundColor: "var(--bg-card)",
    borderBottomColor: "var(--border-soft)",
  },

  navUnauthenticated: {
    backgroundColor: "var(--bg-card)",
  },

  logoContainer: {
    display: "flex",
    alignItems: "center",
  },

  logoLink: {
    margin: 0,
    color: "var(--accent)",
    fontWeight: 700,
    fontSize: "20px",
    cursor: "pointer",
    letterSpacing: "-0.01em",
    userSelect: "none",
    textDecoration: "none",
  },

  desktopNav: {
    display: "flex",
    gap: "24px",
    alignItems: "center",
  },

  navLink: {
    color: "var(--text-main)",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500,
    padding: "6px 0",
    position: "relative",
  },

  navLinkActive: {
    color: "var(--accent)",
  },

  primaryNavLink: {
    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 600,
    padding: "8px 20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
  },

  primaryNavLinkActive: {
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "6px 16px",
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    borderRadius: "8px",
    border: "1px solid rgba(37, 99, 235, 0.2)",
  },

  userName: {
    color: "var(--accent)",
    fontSize: "14px",
    fontWeight: 500,
  },

  logoutBtn: {
    background: "transparent",
    color: "var(--text-main)",
    border: "1px solid var(--border-soft)",
    padding: "8px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 500,
    transition: "all 0.2s ease",
  },

  mobileMenuBtn: {
    display: "none",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "32px",
    height: "32px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: 0,
    gap: "4px",
  },

  hamburger: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "20px",
  },

  mobileNav: {
    display: "none",
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "var(--bg-card)",
    borderBottom: "1px solid var(--border-soft)",
    flexDirection: "column",
    padding: "16px 20px",
    gap: "12px",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.1)",
  },

  mobileNavOpen: {
    display: "flex",
  },

  mobileNavLink: {
    color: "var(--text-main)",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 500,
    padding: "12px 16px",
    borderRadius: "8px",
    transition: "background-color 0.2s ease",
  },

  mobileNavLinkPrimary: {
    background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%)",
    color: "#ffffff",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 600,
    padding: "12px 16px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.2)",
  },

  mobileUserInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    padding: "12px 16px",
    backgroundColor: "rgba(37, 99, 235, 0.08)",
    borderRadius: "8px",
    border: "1px solid rgba(37, 99, 235, 0.2)",
    marginBottom: "8px",
  },

  mobileUserName: {
    color: "var(--accent)",
    fontSize: "15px",
    fontWeight: 600,
  },

  mobileUserEmail: {
    color: "var(--text-muted)",
    fontSize: "13px",
  },

  mobileLogoutBtn: {
    background: "transparent",
    color: "var(--text-main)",
    border: "1px solid var(--border-soft)",
    padding: "12px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 500,
    textAlign: "left",
    width: "100%",
    transition: "all 0.2s ease",
  },
};
