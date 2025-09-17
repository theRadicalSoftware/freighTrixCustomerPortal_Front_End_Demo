import React, { useState, useEffect } from 'react';
import semiIcon from '../imgs/freighTrixMapSemiIcon.png';
import truckIcon from '../imgs/freighTrixTruckIcon.png';

const ShipmentDetailsModal = ({ shipment, onClose, onViewDocument }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showPulse, setShowPulse] = useState(true);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);

    return () => clearInterval(pulseInterval);
  }, []);

  if (!shipment) return null;

  const renderOverview = () => (
    <div style={styles.tabContent}>
      <div style={styles.statusSection}>
        <div style={styles.statusIndicator}>
          <div style={{
            ...styles.statusLight,
            backgroundColor: shipment.onTime ? '#00ff41' : '#ff0040'
          }}></div>
          <span style={styles.statusText}>
            {shipment.status} • {shipment.onTime ? 'On Schedule' : 'Delayed'}
          </span>
        </div>
        
        <div style={styles.progressSection}>
          <div style={styles.progressInfo}>
            <span style={styles.progressLabel}>Delivery Progress</span>
            <span style={styles.progressValue}>{shipment.progress}%</span>
          </div>
          <div style={styles.progressBar}>
            <div 
              style={{
                ...styles.progressFill,
                width: `${shipment.progress}%`,
                backgroundColor: shipment.onTime ? '#00ff41' : '#ff0040'
              }}
            ></div>
          </div>
        </div>
      </div>

      <div style={styles.infoGrid}>
        <div style={styles.infoCard}>
          <h4 style={styles.infoTitle}>Route Information</h4>
          <div style={styles.routeDisplay}>
            <div style={styles.locationInfo}>
              <div style={styles.locationLabel}>ORIGIN</div>
              <div style={styles.locationValue}>{shipment.origin}</div>
            </div>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={styles.routeArrow}>
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#00ffff" strokeWidth="2"/>
            </svg>
            <div style={styles.locationInfo}>
              <div style={styles.locationLabel}>DESTINATION</div>
              <div style={styles.locationValue}>{shipment.destination}</div>
            </div>
          </div>
        </div>

        <div style={styles.infoCard}>
          <h4 style={styles.infoTitle}>Current Status</h4>
          <div style={styles.statusDetails}>
            <div style={styles.statusItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#00ff41" strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" stroke="#00ff41" strokeWidth="2"/>
              </svg>
              <span>{shipment.currentLocation}</span>
            </div>
            <div style={styles.statusItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#00ffff" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="#00ffff" strokeWidth="2"/>
              </svg>
              <span>ETA: {shipment.eta}</span>
            </div>
            <div style={styles.statusItem}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="#ff00ff" strokeWidth="2"/>
              </svg>
              <span>Temp: {shipment.temperature}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.cargoSection}>
        <h4 style={styles.cargoTitle}>Cargo Details</h4>
        <div style={styles.cargoGrid}>
          <div style={styles.cargoItem}>
            <span style={styles.cargoLabel}>Type:</span>
            <span style={styles.cargoValue}>{shipment.cargo}</span>
          </div>
          <div style={styles.cargoItem}>
            <span style={styles.cargoLabel}>Value:</span>
            <span style={styles.cargoValue}>{shipment.value}</span>
          </div>
          <div style={styles.cargoItem}>
            <span style={styles.cargoLabel}>Driver:</span>
            <span style={styles.cargoValue}>{shipment.driver}</span>
          </div>
          <div style={styles.cargoItem}>
            <span style={styles.cargoLabel}>Vehicle:</span>
            <span style={styles.cargoValue}>{shipment.truck}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTracking = () => (
    <div style={styles.tabContent}>
      <div style={styles.trackingMap}>
        <div style={styles.mapHeader}>
          <h4 style={styles.mapTitle}>Live GPS Tracking</h4>
          <div style={styles.trackingStatus}>
            <div style={{
              ...styles.trackingIndicator,
              backgroundColor: '#00ff41'
            }}></div>
            <span style={styles.trackingText}>Live Tracking Active</span>
          </div>
        </div>
        
        <div style={styles.mapContainer}>
          <svg width="100%" height="250" viewBox="0 0 500 250" style={styles.mapSvg}>
            {/* Geofenced route corridor */}
            <path 
              d="M 25 125 Q 125 75 250 125 T 475 125" 
              stroke="rgba(0, 255, 65, 0.2)" 
              strokeWidth="20" 
              fill="none"
            />
            {/* Main route line */}
            <path 
              d="M 25 125 Q 125 75 250 125 T 475 125" 
              stroke="#00ff41" 
              strokeWidth="4" 
              fill="none"
            />
            
            {/* Origin */}
            <circle cx="25" cy="125" r="8" fill="#00ffff"/>
            <text x="25" y="145" textAnchor="middle" fill="#00ffff" fontSize="10" fontWeight="600">
              {shipment.origin.split(',')[0]}
            </text>
            
            {/* Destination */}
            <circle cx="475" cy="125" r="8" fill="#ff00ff"/>
            <text x="475" y="145" textAnchor="middle" fill="#ff00ff" fontSize="10" fontWeight="600">
              {shipment.destination.split(',')[0]}
            </text>
            
            {/* Current position with real truck icon */}
            <g transform={`translate(${25 + (shipment.progress * 4.5)}, 125)`}>
              <circle cx="0" cy="0" r="12" fill="rgba(0, 255, 65, 0.3)">
                <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite"/>
              </circle>
              <image 
                href={shipment.cargo === 'Pharmaceuticals' ? semiIcon : truckIcon}
                x="-14" y="-14" width="28" height="28"
              />
              <text x="0" y="26" textAnchor="middle" fill="#00ff41" fontSize="9" fontWeight="700">
                {shipment.truck}
              </text>
              <text x="0" y="38" textAnchor="middle" fill="#e0e0e0" fontSize="8">
                {shipment.currentLocation.split(',')[0]}
              </text>
            </g>
            
            {/* Enhanced waypoints */}
            <circle cx="150" cy="100" r="4" fill="#00ffff" opacity="0.8"/>
            <text x="150" y="90" textAnchor="middle" fill="#00ffff" fontSize="8" fontWeight="500">Checkpoint 1</text>
            <text x="150" y="115" textAnchor="middle" fill="#999" fontSize="7">Rest/Fuel</text>
            
            <circle cx="300" cy="150" r="4" fill="#00ffff" opacity="0.8"/>
            <text x="300" y="165" textAnchor="middle" fill="#00ffff" fontSize="8" fontWeight="500">Checkpoint 2</text>
            <text x="300" y="180" textAnchor="middle" fill="#999" fontSize="7">Inspection</text>
            
            <circle cx="400" cy="110" r="4" fill="#00ffff" opacity="0.8"/>
            <text x="400" y="100" textAnchor="middle" fill="#00ffff" fontSize="8" fontWeight="500">Checkpoint 3</text>
            <text x="400" y="125" textAnchor="middle" fill="#999" fontSize="7">Final Mile</text>
          </svg>
        </div>
        
        <div style={styles.trackingMetrics}>
          <div style={styles.trackingMetric}>
            <span style={styles.metricLabel}>Speed:</span>
            <span style={styles.metricValue}>67 mph</span>
          </div>
          <div style={styles.trackingMetric}>
            <span style={styles.metricLabel}>Distance Remaining:</span>
            <span style={styles.metricValue}>{Math.round((100 - shipment.progress) * 10)} miles</span>
          </div>
          <div style={styles.trackingMetric}>
            <span style={styles.metricLabel}>Next Checkpoint:</span>
            <span style={styles.metricValue}>47 miles</span>
          </div>
        </div>
      </div>

      <div style={styles.geofenceSection}>
        <h4 style={styles.geofenceTitle}>Geofence & Security</h4>
        <div style={styles.geofenceInfo}>
          <div style={styles.geofenceItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#00ff41" strokeWidth="2"/>
              <path d="M2 17l10 5 10-5" stroke="#00ff41" strokeWidth="2"/>
              <path d="M2 12l10 5 10-5" stroke="#00ff41" strokeWidth="2"/>
            </svg>
            <div style={styles.geofenceDetails}>
              <div style={styles.geofenceLabel}>Route Compliance</div>
              <div style={styles.geofenceStatus}>Within approved corridor</div>
            </div>
          </div>
          
          <div style={styles.geofenceItem}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#00ff41" strokeWidth="2"/>
              <circle cx="12" cy="16" r="1" fill="#00ff41"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#00ff41" strokeWidth="2"/>
            </svg>
            <div style={styles.geofenceDetails}>
              <div style={styles.geofenceLabel}>Security Status</div>
              <div style={styles.geofenceStatus}>All systems secure</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div style={styles.tabContent}>
      <div style={styles.documentsGrid}>
        <div style={styles.documentCard}>
          <div style={styles.documentHeader}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ff41" strokeWidth="2"/>
              <polyline points="14,2 14,8 20,8" stroke="#00ff41" strokeWidth="2"/>
            </svg>
            <div style={styles.documentInfo}>
              <div style={styles.documentName}>Bill of Lading</div>
              <div style={styles.documentStatus}>Signed & Verified</div>
            </div>
          </div>
          <div style={styles.documentDetails}>
            <div style={styles.documentMeta}>
              <span>Signed by: {shipment.driver}</span>
              <span>Timestamp: Dec 13, 2024 8:15 AM</span>
            </div>
            <button 
              style={styles.documentButton}
              onClick={() => onViewDocument && onViewDocument('bol', shipment)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              View Document
            </button>
          </div>
        </div>

        <div style={styles.documentCard}>
          <div style={styles.documentHeader}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke="#00ffff" strokeWidth="2"/>
              <polyline points="17,2 12,7 7,2" stroke="#00ffff" strokeWidth="2"/>
            </svg>
            <div style={styles.documentInfo}>
              <div style={styles.documentName}>Cargo Photos</div>
              <div style={styles.documentStatus}>4 Images Available</div>
            </div>
          </div>
          <div style={styles.documentDetails}>
            <div style={styles.documentMeta}>
              <span>Loading: 2 photos</span>
              <span>Seal verification: 2 photos</span>
            </div>
            <button 
              style={styles.documentButton}
              onClick={() => onViewDocument && onViewDocument('photos', shipment)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <polyline points="17,2 12,7 7,2" stroke="currentColor" strokeWidth="2"/>
              </svg>
              View Gallery
            </button>
          </div>
        </div>

        <div style={styles.documentCard}>
          <div style={styles.documentHeader}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="#ff00ff" strokeWidth="2"/>
            </svg>
            <div style={styles.documentInfo}>
              <div style={styles.documentName}>Temperature Log</div>
              <div style={styles.documentStatus}>Real-time Monitoring</div>
            </div>
          </div>
          <div style={styles.documentDetails}>
            <div style={styles.documentMeta}>
              <span>Current: {shipment.temperature}</span>
              <span>Range: 2-8°C maintained</span>
            </div>
            <button 
              style={styles.documentButton}
              onClick={() => onViewDocument && onViewDocument('temperature', shipment)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2"/>
                <path d="M18.7 8l-12 12" stroke="currentColor" strokeWidth="2"/>
              </svg>
              View Chart
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <div style={styles.modalTitle}>
            <h3 style={styles.shipmentTitle}>Shipment {shipment.id}</h3>
            <div style={styles.modalSubtitle}>
              {shipment.origin} → {shipment.destination}
            </div>
          </div>
          <button style={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
              <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>

        <div style={styles.modalTabs}>
          {[
            { id: 'overview', label: 'Overview', icon: '📋' },
            { id: 'tracking', label: 'Live Tracking', icon: '🗺️' },
            { id: 'documents', label: 'Documents', icon: '📄' }
          ].map((tab) => (
            <button
              key={tab.id}
              style={{
                ...styles.tab,
                ...(activeTab === tab.id ? styles.tabActive : {})
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={styles.tabIcon}>{tab.icon}</span>
              <span style={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div style={styles.modalContent}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'tracking' && renderTracking()}
          {activeTab === 'documents' && renderDocuments()}
        </div>
      </div>
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
    maxWidth: '900px',
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
    flex: 1,
  },
  shipmentTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 0.25rem 0',
  },
  modalSubtitle: {
    color: '#999',
    fontSize: '0.9rem',
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
  modalTabs: {
    display: 'flex',
    borderBottom: '1px solid rgba(0, 255, 65, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#999',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    borderBottom: '2px solid transparent',
  },
  tabActive: {
    color: '#00ff41',
    borderBottomColor: '#00ff41',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  tabIcon: {
    fontSize: '1.2rem',
  },
  tabLabel: {
    fontWeight: 500,
  },
  modalContent: {
    flex: 1,
    overflow: 'auto',
    padding: '1.5rem',
  },
  tabContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  statusSection: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  statusIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  statusLight: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    boxShadow: '0 0 10px currentColor',
    animation: 'pulse 2s ease-in-out infinite',
  },
  statusText: {
    fontFamily: 'Orbitron, sans-serif',
    fontWeight: 600,
    color: '#00ff41',
  },
  progressSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  progressInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  progressLabel: {
    fontSize: '0.9rem',
    color: '#999',
  },
  progressValue: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#00ff41',
  },
  progressBar: {
    flex: 1,
    height: '8px',
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.3s ease',
    boxShadow: '0 0 10px currentColor',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
  },
  infoCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 255, 65, 0.1)',
    borderRadius: '8px',
    padding: '1rem',
  },
  infoTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  routeDisplay: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  locationInfo: {
    flex: 1,
    textAlign: 'center',
  },
  locationLabel: {
    fontSize: '0.7rem',
    color: '#999',
    fontWeight: 600,
    marginBottom: '0.25rem',
  },
  locationValue: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    fontWeight: 500,
  },
  routeArrow: {
    color: '#00ffff',
  },
  statusDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  statusItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    color: '#e0e0e0',
  },
  cargoSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 255, 65, 0.1)',
    borderRadius: '8px',
    padding: '1rem',
  },
  cargoTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  cargoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '0.75rem',
  },
  cargoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cargoLabel: {
    color: '#999',
    fontSize: '0.9rem',
  },
  cargoValue: {
    color: '#e0e0e0',
    fontWeight: 500,
  },
  trackingMap: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  mapHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  mapTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  trackingStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  trackingIndicator: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    animation: 'pulse 2s ease-in-out infinite',
  },
  trackingText: {
    fontSize: '0.8rem',
    color: '#00ff41',
    fontWeight: 500,
  },
  mapContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    marginBottom: '1rem',
  },
  mapSvg: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  trackingMetrics: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '1rem',
  },
  trackingMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  metricLabel: {
    fontSize: '0.8rem',
    color: '#999',
  },
  metricValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
  },
  geofenceSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 255, 65, 0.1)',
    borderRadius: '8px',
    padding: '1rem',
  },
  geofenceTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  geofenceInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  geofenceItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  geofenceDetails: {
    flex: 1,
  },
  geofenceLabel: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  geofenceStatus: {
    fontSize: '0.8rem',
    color: '#00ff41',
  },
  documentsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  documentCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 255, 65, 0.1)',
    borderRadius: '8px',
    padding: '1rem',
  },
  documentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  documentStatus: {
    fontSize: '0.8rem',
    color: '#00ff41',
  },
  documentDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  documentMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    fontSize: '0.8rem',
    color: '#999',
  },
  documentButton: {
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
  },
};

export default ShipmentDetailsModal;