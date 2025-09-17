import React, { useState, useEffect } from 'react';
import logoImage from '../imgs/FreightTrixHeader_Graphic.png';

const CustomerLogin = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyCode: ''
  });
  const [isLogging, setIsLogging] = useState(false);
  const [showPulse, setShowPulse] = useState(true);
  const [loginProgress, setLoginProgress] = useState(0);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = () => {
    setIsLogging(true);
    setShowPulse(false);
    
    const loginInterval = setInterval(() => {
      setLoginProgress(prev => {
        if (prev >= 100) {
          clearInterval(loginInterval);
          setTimeout(() => {
            if (onLoginSuccess) {
              onLoginSuccess({
                email: formData.email,
                company: 'DemoCorp Logistics',
                role: 'Fleet Manager'
              });
            }
          }, 500);
          return 100;
        }
        return prev + 3;
      });
    }, 60);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@democorp.com',
      password: 'demo123',
      companyCode: 'DEMO2024'
    });
    setTimeout(() => handleLogin(), 300);
  };

  return (
    <div style={styles.container}>
      {/* Matrix Background */}
      <div style={styles.matrixBackground}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.matrixColumn,
              left: `${i * 5}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            {[...Array(10)].map((_, j) => (
              <span key={j} style={styles.matrixChar}>
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={styles.header}>
        <img 
          src={logoImage} 
          alt="FreighTrix Logo" 
          style={styles.logoImage}
        />
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Customer Portal</h1>
          <p style={styles.subtitle}>Advanced Logistics Intelligence Platform</p>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.loginCard}>
          <div style={styles.loginHeader}>
            <h2 style={styles.loginTitle}>Secure Access Portal</h2>
            <p style={styles.loginDescription}>
              Real-time shipment tracking and fleet management
            </p>
          </div>

          <div style={styles.formContainer}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Company Code</label>
              <input
                type="text"
                name="companyCode"
                value={formData.companyCode}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter company code"
                disabled={isLogging}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter email address"
                disabled={isLogging}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Enter password"
                disabled={isLogging}
              />
            </div>

            {/* Security Features */}
            <div style={styles.securityFeatures}>
              <div style={styles.securityItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#00ff41" strokeWidth="2"/>
                  <circle cx="12" cy="16" r="1" fill="#00ff41"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#00ff41" strokeWidth="2"/>
                </svg>
                <span style={styles.securityText}>256-bit SSL Encryption</span>
              </div>
              <div style={styles.securityItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="#00ff41" strokeWidth="2"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#00ff41" strokeWidth="2"/>
                  <line x1="12" y1="19" x2="12" y2="23" stroke="#00ff41" strokeWidth="2"/>
                  <line x1="8" y1="23" x2="16" y2="23" stroke="#00ff41" strokeWidth="2"/>
                </svg>
                <span style={styles.securityText}>Two-Factor Authentication</span>
              </div>
            </div>

            {/* Login Progress */}
            {isLogging && (
              <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${loginProgress}%`,
                    }}
                  ></div>
                </div>
                <span style={styles.progressText}>
                  {loginProgress < 30 ? 'Authenticating...' :
                   loginProgress < 60 ? 'Verifying credentials...' :
                   loginProgress < 90 ? 'Loading dashboard...' : 'Welcome!'}
                </span>
              </div>
            )}

            {/* Login Buttons */}
            <div style={styles.buttonContainer}>
              <button 
                onClick={handleLogin}
                style={{
                  ...styles.loginButton,
                  transform: `scale(${showPulse && !isLogging ? 1.02 : 1})`,
                }}
                disabled={isLogging}
              >
                {isLogging ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Access Portal
                  </>
                )}
              </button>

              <button 
                onClick={handleDemoLogin}
                style={styles.demoButton}
                disabled={isLogging}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{marginRight: '0.5rem'}}>
                  <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Demo Login
              </button>
            </div>
          </div>

          {/* Additional Info */}
          <div style={styles.additionalInfo}>
            <div style={styles.infoSection}>
              <h4 style={styles.infoTitle}>Platform Features</h4>
              <div style={styles.featureGrid}>
                <div style={styles.featureItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.featureIcon}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#00ff41" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                  <span style={styles.featureText}>Real-time GPS tracking</span>
                </div>
                <div style={styles.featureItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.featureIcon}>
                    <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#00ff41" strokeWidth="2"/>
                    <path d="M2 17l10 5 10-5" stroke="#00ff41" strokeWidth="2"/>
                    <path d="M2 12l10 5 10-5" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                  <span style={styles.featureText}>AI route optimization</span>
                </div>
                <div style={styles.featureItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.featureIcon}>
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                  <span style={styles.featureText}>Temperature monitoring</span>
                </div>
                <div style={styles.featureItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.featureIcon}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ff41" strokeWidth="2"/>
                    <polyline points="14,2 14,8 20,8" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                  <span style={styles.featureText}>Digital documentation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={styles.footerText}>
          Powered by FreighTrix AI • Enterprise Logistics Platform
        </p>
        <div style={styles.footerLinks}>
          <span style={styles.footerLink}>Support</span>
          <span style={styles.footerDivider}>•</span>
          <span style={styles.footerLink}>Privacy</span>
          <span style={styles.footerDivider}>•</span>
          <span style={styles.footerLink}>Terms</span>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
          
          @keyframes matrixFall {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }
          
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 65, 0.3); }
            50% { box-shadow: 0 0 40px rgba(0, 255, 65, 0.6); }
          }

          @keyframes slideIn {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0d0208',
    color: '#e0e0e0',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  matrixBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    opacity: 0.1,
    zIndex: 0,
  },
  matrixColumn: {
    position: 'absolute',
    top: 0,
    fontSize: '14px',
    color: '#00ff41',
    animation: 'matrixFall 15s linear infinite',
    display: 'flex',
    flexDirection: 'column',
  },
  matrixChar: {
    display: 'block',
    marginBottom: '10px',
    fontFamily: 'monospace',
  },
  header: {
    zIndex: 1,
    padding: '2rem 1rem 1rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  logoImage: {
    height: 'clamp(60px, 12vw, 100px)',
    width: 'auto',
    objectFit: 'contain',
    filter: 'drop-shadow(0 0 10px rgba(0, 255, 65, 0.3))',
    marginBottom: '1rem',
  },
  headerContent: {
    textAlign: 'center',
  },
  title: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: 'clamp(1.5rem, 5vw, 2.2rem)',
    fontWeight: 700,
    margin: '0 0 0.5rem 0',
    background: 'linear-gradient(90deg, #00ffff 0%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
  subtitle: {
    fontFamily: 'Inter, sans-serif',
    fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
    color: '#999',
    margin: 0,
    fontWeight: 400,
  },
  content: {
    flex: 1,
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
  },
  loginCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '16px',
    padding: '2rem',
    backdropFilter: 'blur(20px)',
    maxWidth: '400px',
    width: '100%',
    animation: 'slideIn 0.6s ease-out',
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  loginTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 0.5rem 0',
  },
  loginDescription: {
    color: '#999',
    fontSize: '0.9rem',
    margin: 0,
    lineHeight: '1.4',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 500,
    color: '#e0e0e0',
    fontFamily: 'Inter, sans-serif',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#e0e0e0',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    fontFamily: 'Inter, sans-serif',
  },
  securityFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  securityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  securityText: {
    fontSize: '0.8rem',
    color: '#00ff41',
    fontWeight: 500,
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  progressBar: {
    width: '100%',
    height: '4px',
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00ff41',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
    boxShadow: '0 0 10px #00ff41',
  },
  progressText: {
    fontSize: '0.9rem',
    color: '#00ff41',
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 500,
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  loginButton: {
    backgroundColor: '#00ff41',
    color: '#0d0208',
    border: 'none',
    borderRadius: '8px',
    padding: '1rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Orbitron, sans-serif',
  },
  demoButton: {
    backgroundColor: 'transparent',
    color: '#00ffff',
    border: '2px solid #00ffff',
    borderRadius: '8px',
    padding: '0.75rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
  },
  additionalInfo: {
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid rgba(0, 255, 65, 0.1)',
  },
  infoSection: {
    textAlign: 'center',
  },
  infoTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  featureGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  featureItem: {
    fontSize: '0.8rem',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  featureIcon: {
    flexShrink: 0,
  },
  featureText: {
    flex: 1,
    textAlign: 'left',
  },
  footer: {
    zIndex: 1,
    padding: '1rem',
    textAlign: 'center',
    borderTop: '1px solid rgba(0, 255, 65, 0.1)',
    backgroundColor: 'rgba(13, 2, 8, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  footerText: {
    fontSize: '0.8rem',
    color: '#666',
    margin: '0 0 0.5rem 0',
    fontFamily: 'Inter, sans-serif',
  },
  footerLinks: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  footerLink: {
    fontSize: '0.7rem',
    color: '#00ff41',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  footerDivider: {
    color: '#666',
    fontSize: '0.7rem',
  },
};

export default CustomerLogin;