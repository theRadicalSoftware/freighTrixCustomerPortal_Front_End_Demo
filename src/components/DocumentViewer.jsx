import React, { useState } from 'react';
import trackersImg from '../imgs/trackersImg.jpeg';

const DocumentViewer = ({ document, type, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isViewingDocument, setIsViewingDocument] = useState(false);
  const [documentLoadError, setDocumentLoadError] = useState(false);
  const [documentLoaded, setDocumentLoaded] = useState(false);

  if (!document) return null;

  const renderBOL = () => {
    if (isViewingDocument) {
      return (
        <div style={styles.documentContent}>
          <div style={styles.documentHeader}>
            <button 
              style={styles.backToPreviewButton}
              onClick={() => {
                setIsViewingDocument(false);
                setDocumentLoaded(false);
                setDocumentLoadError(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Back to Preview
            </button>
            <h3 style={styles.documentTitle}>Bill of Lading - {document.url?.split('/').pop()}</h3>
          </div>
          
          <div style={styles.embeddedDocumentContainer}>
            {!documentLoaded && !documentLoadError && (
              <div style={styles.documentLoader}>
                <div style={styles.loaderSpinner}></div>
                <p style={styles.loaderText}>Loading Document...</p>
              </div>
            )}
            {documentLoadError ? (
              <div style={styles.errorContainer}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" style={styles.errorIcon}>
                  <circle cx="12" cy="12" r="10" stroke="#ff0040" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="#ff0040" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="#ff0040" strokeWidth="2"/>
                </svg>
                <p style={styles.errorText}>Document preview not available</p>
                <p style={styles.errorSubtext}>Click "Download Original" to view the document</p>
              </div>
            ) : (
              <iframe
                src={document.url}
                style={styles.documentIframe}
                title="Bill of Lading Document"
                onLoad={() => {
                  console.log('Document loaded successfully');
                  setDocumentLoaded(true);
                  setDocumentLoadError(false);
                }}
                onError={() => {
                  console.log('Failed to load document in iframe');
                  setDocumentLoadError(true);
                  setDocumentLoaded(false);
                }}
              />
            )}
          </div>
          
          <div style={styles.documentActions}>
            <button 
              style={styles.actionButton}
              onClick={() => {
                const link = document.createElement('a');
                link.href = document.url;
                link.download = document.url.split('/').pop();
                link.click();
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Download Original
            </button>
            <button 
              style={styles.actionButton}
              onClick={() => window.open(document.url, '_blank')}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Open in New Tab
            </button>
            <button 
              style={styles.actionButton}
              onClick={() => window.print()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <polyline points="6,9 6,2 18,2 18,9" stroke="currentColor" strokeWidth="2"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" stroke="currentColor" strokeWidth="2"/>
                <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Print
            </button>
          </div>
        </div>
      );
    }

    const getDocumentType = () => {
      if (document.url?.includes('.pdf')) return 'PDF Document';
      if (document.url?.includes('.docx')) return 'Microsoft Word Document';
      return 'Document';
    };

    return (
      <div style={styles.documentContent}>
        <div style={styles.documentHeader}>
          <h3 style={styles.documentTitle}>Bill of Lading</h3>
          <div style={styles.documentMeta}>
            <span>Signed: {new Date(document.timestamp).toLocaleString()}</span>
            <span>Driver: {document.signedBy}</span>
          </div>
        </div>
        <div style={styles.bolPreview}>
          <div style={styles.bolPlaceholder}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ff41" strokeWidth="2"/>
              <polyline points="14,2 14,8 20,8" stroke="#00ff41" strokeWidth="2"/>
            </svg>
            <p style={styles.placeholderText}>FreighTrix Bill of Lading</p>
            <p style={styles.placeholderSubtext}>
              Digitally signed and verified document
            </p>
            <p style={styles.placeholderSubtext}>
              Document ID: {document.url?.split('/').pop()}
            </p>
            <div style={styles.documentPreviewDetails}>
              <div style={styles.previewDetail}>
                <span style={styles.previewLabel}>Status:</span>
                <span style={styles.previewValue}>Signed & Verified</span>
              </div>
              <div style={styles.previewDetail}>
                <span style={styles.previewLabel}>Size:</span>
                <span style={styles.previewValue}>~45 KB</span>
              </div>
              <div style={styles.previewDetail}>
                <span style={styles.previewLabel}>Type:</span>
                <span style={styles.previewValue}>{getDocumentType()}</span>
              </div>
            </div>
          </div>
          <div style={styles.buttonGroup}>
            <button
              style={styles.primaryViewButton}
              onClick={() => {
                setIsViewingDocument(true);
                setDocumentLoaded(false);
                setDocumentLoadError(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              View Document
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                const link = document.createElement('a');
                link.href = document.url;
                link.download = document.url.split('/').pop();
                link.click();
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderPhotos = () => (
    <div style={styles.documentContent}>
      <div style={styles.documentHeader}>
        <h3 style={styles.documentTitle}>Shipment Documentation Photos</h3>
        <div style={styles.photoCounter}>
          {currentImageIndex + 1} of {document.length}
        </div>
      </div>
      <div style={styles.photoViewer}>
        <div style={styles.photoContainer}>
          {document[currentImageIndex]?.url?.includes('.pdf') ? (
            <div style={styles.documentPreviewContainer}>
              <div style={styles.documentPreviewHeader}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ff41" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="#00ff41" strokeWidth="2"/>
                </svg>
                <div style={styles.documentPreviewInfo}>
                  <h4 style={styles.documentPreviewTitle}>PDF Documentation</h4>
                  <p style={styles.documentPreviewDescription}>
                    {document[currentImageIndex]?.description}
                  </p>
                </div>
              </div>
              <div style={styles.embeddedDocumentContainer}>
                <iframe
                  src={document[currentImageIndex]?.url}
                  style={styles.photoDocumentIframe}
                  title="PDF Document"
                  onLoad={() => console.log('PDF loaded in photo viewer')}
                />
              </div>
              <button
                style={styles.viewFullDocumentButton}
                onClick={() => window.open(document[currentImageIndex]?.url, '_blank')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Open Full Document
              </button>
            </div>
          ) : document[currentImageIndex]?.url?.includes('.docx') ? (
            <div style={styles.documentPreviewContainer}>
              <div style={styles.documentPreviewHeader}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ff41" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="#00ff41" strokeWidth="2"/>
                </svg>
                <div style={styles.documentPreviewInfo}>
                  <h4 style={styles.documentPreviewTitle}>Word Documentation</h4>
                  <p style={styles.documentPreviewDescription}>
                    {document[currentImageIndex]?.description}
                  </p>
                </div>
              </div>
              <div style={styles.documentPreviewPlaceholder}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ff41" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="#00ff41" strokeWidth="2"/>
                </svg>
                <p style={styles.placeholderText}>Word Document Preview</p>
                <p style={styles.placeholderSubtext}>
                  Preview not available - click below to open document
                </p>
              </div>
              <button
                style={styles.viewFullDocumentButton}
                onClick={() => window.open(document[currentImageIndex]?.url, '_blank')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Open Full Document
              </button>
            </div>
          ) : document[currentImageIndex]?.url === '/imgs/trackersImg.jpeg' ? (
            <div style={styles.realPhotoContainer}>
              <img 
                src={trackersImg} 
                alt={document[currentImageIndex]?.description || 'Shipment photo'}
                style={styles.realPhoto}
              />
              <div style={styles.photoOverlay}>
                <h4 style={styles.photoTitle}>Temperature Monitoring Equipment</h4>
                <p style={styles.photoDescription}>
                  {document[currentImageIndex]?.description}
                </p>
                <div style={styles.photoMeta}>
                  <span>📅 {new Date(document[currentImageIndex]?.timestamp).toLocaleString()}</span>
                  <span>📍 Chicago, IL Loading Dock</span>
                </div>
              </div>
            </div>
          ) : (
            <div style={styles.photoPlaceholder}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke="#00ff41" strokeWidth="2"/>
                <polyline points="17,2 12,7 7,2" stroke="#00ff41" strokeWidth="2"/>
                <circle cx="9" cy="13" r="2" stroke="#00ff41" strokeWidth="2"/>
              </svg>
              <p style={styles.placeholderText}>
                {document[currentImageIndex]?.type.toUpperCase()} Documentation
              </p>
              <p style={styles.placeholderSubtext}>
                {document[currentImageIndex]?.description}
              </p>
              <p style={styles.placeholderSubtext}>
                Taken: {new Date(document[currentImageIndex]?.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </div>
        <div style={styles.photoControls}>
          <button 
            style={styles.photoNavButton}
            onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
            disabled={currentImageIndex === 0}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="15,18 9,12 15,6" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Previous
          </button>
          <button 
            style={styles.photoNavButton}
            onClick={() => setCurrentImageIndex(Math.min(document.length - 1, currentImageIndex + 1))}
            disabled={currentImageIndex === document.length - 1}
          >
            Next
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polyline points="9,18 15,12 9,6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>
      <div style={styles.photoThumbnails}>
        {document.map((photo, index) => (
          <button
            key={index}
            style={{
              ...styles.thumbnail,
              ...(index === currentImageIndex ? styles.thumbnailActive : {})
            }}
            onClick={() => setCurrentImageIndex(index)}
          >
            <div style={styles.thumbnailIcon}>
              {photo.url === '/imgs/trackersImg.jpeg' ? (
                <img src={trackersImg} alt="" style={styles.thumbnailImage} />
              ) : photo.url?.includes('.pdf') ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="6">PDF</text>
                </svg>
              ) : photo.url?.includes('.docx') ? (
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                   <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                   <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                   <text x="12" y="16" textAnchor="middle" fill="currentColor" fontSize="5">DOC</text>
                 </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="17,2 12,7 7,2" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
            </div>
            <span style={styles.thumbnailLabel}>{photo.type}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderTemperature = () => (
    <div style={styles.documentContent}>
      <div style={styles.documentHeader}>
        <h3 style={styles.documentTitle}>Temperature Monitoring Log</h3>
        <div style={styles.tempStatus}>
          <div style={styles.tempIndicator}></div>
          <span>Real-time Monitoring Active</span>
        </div>
      </div>
      <div style={styles.tempChart}>
        <svg width="100%" height="200" viewBox="0 0 400 200" style={styles.chartSvg}>
          {/* Chart background */}
          <rect width="400" height="200" fill="rgba(0, 0, 0, 0.2)" rx="8"/>
          
          {/* Target line */}
          <line x1="40" y1="100" x2="360" y2="100" stroke="#00ffff" strokeWidth="2" strokeDasharray="5,5"/>
          <text x="365" y="105" fill="#00ffff" fontSize="10">Target: 4.0°C</text>
          
          {/* Temperature line */}
          <polyline
            points="40,95 80,110 120,85 160,105 200,100 240,115 280,95 320,105"
            fill="none"
            stroke="#00ff41"
            strokeWidth="3"
          />
          
          {/* Data points */}
          {document.map((point, index) => (
            <circle
              key={index}
              cx={40 + (index * 40)}
              cy={200 - (point.temp * 25)}
              r="4"
              fill="#00ff41"
            />
          ))}
          
          {/* Y-axis labels */}
          <text x="25" y="50" fill="#999" fontSize="10">6°C</text>
          <text x="25" y="100" fill="#999" fontSize="10">4°C</text>
          <text x="25" y="150" fill="#999" fontSize="10">2°C</text>
          
          {/* X-axis labels */}
          {document.map((point, index) => (
            <text
              key={index}
              x={40 + (index * 40)}
              y="190"
              fill="#999"
              fontSize="8"
              textAnchor="middle"
            >
              {point.time}
            </text>
          ))}
        </svg>
      </div>
      <div style={styles.tempSummary}>
        <div style={styles.tempStat}>
          <span style={styles.tempStatLabel}>Current:</span>
          <span style={styles.tempStatValue}>4.2°C</span>
        </div>
        <div style={styles.tempStat}>
          <span style={styles.tempStatLabel}>Average:</span>
          <span style={styles.tempStatValue}>4.1°C</span>
        </div>
        <div style={styles.tempStat}>
          <span style={styles.tempStatLabel}>Range:</span>
          <span style={styles.tempStatValue}>3.9-4.4°C</span>
        </div>
        <div style={styles.tempStat}>
          <span style={styles.tempStatLabel}>Compliance:</span>
          <span style={{...styles.tempStatValue, color: '#00ff41'}}>98.7%</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={styles.modalTitle}>Document Viewer</h2>
          <button style={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
        
        <div style={styles.modalContent}>
          {type === 'bol' && renderBOL()}
          {type === 'photos' && renderPhotos()}
          {type === 'temperature' && renderTemperature()}
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '2rem',
  },
  modal: {
    backgroundColor: 'rgba(13, 2, 8, 0.95)',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
  },
  modalTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  closeButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 0, 64, 0.3)',
    borderRadius: '8px',
    padding: '0.5rem',
    color: '#ff0040',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  modalContent: {
    flex: 1,
    overflow: 'auto',
    padding: '1.5rem',
  },
  documentContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  documentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  documentTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  documentMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.25rem',
    fontSize: '0.8rem',
    color: '#999',
  },
  photoCounter: {
    fontSize: '0.9rem',
    color: '#00ffff',
    fontWeight: 500,
  },
  tempStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#00ff41',
  },
  tempIndicator: {
    width: '8px',
    height: '8px',
    backgroundColor: '#00ff41',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  },
  bolPreview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.5rem',
    padding: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  bolPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: '1.1rem',
    color: '#e0e0e0',
    margin: 0,
  },
  placeholderSubtext: {
    fontSize: '0.9rem',
    color: '#999',
    margin: 0,
  },
  downloadButton: {
    backgroundColor: '#00ff41',
    color: '#0d0208',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    color: '#00ff41',
  },
  backToPreviewButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    color: '#00ff41',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  embeddedDocumentContainer: {
    position: 'relative',
    width: '100%',
    height: '500px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    overflow: 'hidden',
  },
  documentLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    zIndex: 2,
  },
  loaderSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(0, 255, 65, 0.2)',
    borderTop: '3px solid #00ff41',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loaderText: {
    color: '#00ff41',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  errorContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
    zIndex: 2,
  },
  errorIcon: {
    color: '#ff0040',
  },
  errorText: {
    color: '#ff0040',
    fontSize: '1rem',
    fontWeight: 600,
    margin: 0,
  },
  errorSubtext: {
    color: '#999',
    fontSize: '0.9rem',
    margin: 0,
  },
  documentIframe: {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  photoDocumentIframe: {
    width: '100%',
    height: '200px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#fff',
  },
  documentActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    padding: '1rem',
    borderTop: '1px solid rgba(0, 255, 65, 0.1)',
    flexWrap: 'wrap',
  },
  actionButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.75rem 1rem',
    color: '#00ff41',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  primaryViewButton: {
    backgroundColor: '#00ff41',
    color: '#0d0208',
    border: 'none',
    borderRadius: '8px',
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 255, 65, 0.3)',
  },
  documentPreviewDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.2)',
  },
  previewDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: '0.8rem',
    color: '#999',
    fontWeight: 500,
  },
  previewValue: {
    fontSize: '0.8rem',
    color: '#00ff41',
    fontWeight: 600,
  },
  documentPreviewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    height: '100%',
  },
  documentPreviewHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.2)',
  },
  documentPreviewInfo: {
    flex: 1,
  },
  documentPreviewTitle: {
    color: '#00ff41',
    fontSize: '1rem',
    fontWeight: 600,
    margin: '0 0 0.5rem 0',
  },
  documentPreviewDescription: {
    color: '#e0e0e0',
    fontSize: '0.9rem',
    margin: 0,
  },
  documentPreviewPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    height: '200px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
    textAlign: 'center',
  },
  viewFullDocumentButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    color: '#00ff41',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    alignSelf: 'flex-start',
  },
  photoViewer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  photoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  photoPlaceholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    textAlign: 'center',
  },
  photoControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  photoNavButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#00ff41',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
  photoThumbnails: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  thumbnail: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 255, 65, 0.1)',
    borderRadius: '6px',
    padding: '0.5rem',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    transition: 'all 0.3s ease',
    minWidth: '60px',
  },
  thumbnailActive: {
    borderColor: '#00ff41',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  thumbnailIcon: {
    color: '#00ff41',
  },
  thumbnailLabel: {
    fontSize: '0.7rem',
    color: '#999',
    textTransform: 'capitalize',
  },
  tempChart: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  chartSvg: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
  tempSummary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  tempStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  tempStatLabel: {
    fontSize: '0.8rem',
    color: '#999',
  },
  tempStatValue: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
  },
  realPhotoContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  realPhoto: {
    maxWidth: '100%',
    maxHeight: '100%',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 255, 65, 0.3)',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: '10px',
    left: '10px',
    right: '10px',
    background: 'rgba(0, 0, 0, 0.8)',
    borderRadius: '8px',
    padding: '1rem',
    backdropFilter: 'blur(10px)',
  },
  photoTitle: {
    color: '#00ff41',
    fontSize: '1rem',
    fontWeight: '600',
    margin: '0 0 0.5rem 0',
  },
  photoDescription: {
    color: '#e0e0e0',
    fontSize: '0.9rem',
    margin: '0 0 0.5rem 0',
  },
  photoMeta: {
    display: 'flex',
    gap: '1rem',
    fontSize: '0.8rem',
    color: '#999',
  },
  thumbnailImage: {
    width: '16px',
    height: '16px',
    borderRadius: '2px',
    objectFit: 'cover',
  },
};

export default DocumentViewer;