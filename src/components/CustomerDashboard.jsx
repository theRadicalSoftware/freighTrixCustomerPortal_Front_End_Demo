import React, { useState, useEffect } from 'react';
import logoImage from '../imgs/FreightTrixHeader_Graphic.png';
import truckIcon from '../imgs/freighTrixTruckIcon.png';
import semiIcon from '../imgs/freighTrixMapSemiIcon.png';
import trackersImg from '../imgs/trackersImg.jpeg';

const CustomerDashboard = ({ userData, onLogout }) => {
  const [activeView, setActiveView] = useState('fleet');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showPulse, setShowPulse] = useState(true);
  const [liveData, setLiveData] = useState({
    totalShipments: 12,
    inTransit: 8,
    delivered: 4,
    fleetUtilization: 87
  });

  // Mock shipment data
  const mockShipments = [
    {
      id: 'FT-2024-1247',
      status: 'In Transit',
      origin: 'Chicago, IL',
      destination: 'Denver, CO',
      driver: 'Marcus Rodriguez',
      truck: 'FT-TR-456',
      currentLocation: 'Des Moines, IA',
      temperature: '4.2°C',
      eta: 'Dec 15, 2:30 PM',
      onTime: true,
      progress: 45,
      lat: 41.5868,
      lng: -93.6250,
      cargo: 'Pharmaceuticals',
      value: '$2.3M'
    },
    {
      id: 'FT-2024-1248',
      status: 'Loading',
      origin: 'Houston, TX',
      destination: 'Miami, FL',
      driver: 'Sarah Johnson',
      truck: 'FT-TR-892',
      currentLocation: 'Houston, TX',
      temperature: '2.1°C',
      eta: 'Dec 16, 10:00 AM',
      onTime: true,
      progress: 5,
      lat: 29.7604,
      lng: -95.3698,
      cargo: 'Medical Supplies',
      value: '$1.8M'
    },
    {
      id: 'FT-2024-1249',
      status: 'In Transit',
      origin: 'Los Angeles, CA',
      destination: 'Seattle, WA',
      driver: 'Mike Chen',
      truck: 'FT-TR-123',
      currentLocation: 'Sacramento, CA',
      temperature: 'Ambient',
      eta: 'Dec 15, 6:00 PM',
      onTime: false,
      progress: 70,
      lat: 38.5816,
      lng: -121.4944,
      cargo: 'Electronics',
      value: '$875K'
    }
  ];

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);

    // Simulate live data updates
    const dataInterval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        fleetUtilization: 85 + Math.floor(Math.random() * 10)
      }));
    }, 5000);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const handleShipmentSelect = (shipment) => {
    setSelectedShipment(shipment);
    setActiveView('shipment');
  };

  const renderFleetOverview = () => (
    <div style={styles.viewContainer}>
      {/* Fleet Statistics */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="3" width="15" height="13" stroke="#00ff41" strokeWidth="2"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="#00ff41" strokeWidth="2"/>
              <circle cx="5.5" cy="18.5" r="2.5" stroke="#00ff41" strokeWidth="2"/>
              <circle cx="18.5" cy="18.5" r="2.5" stroke="#00ff41" strokeWidth="2"/>
            </svg>
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{liveData.totalShipments}</div>
            <div style={styles.statLabel}>Total Shipments</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polygon points="3 6 9 9 15 15 21 12 21 18 15 21 9 15 3 12" stroke="#00ffff" strokeWidth="2"/>
            </svg>
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{liveData.inTransit}</div>
            <div style={styles.statLabel}>In Transit</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <polyline points="20,6 9,17 4,12" stroke="#ff00ff" strokeWidth="2"/>
            </svg>
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{liveData.delivered}</div>
            <div style={styles.statLabel}>Delivered Today</div>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#00ff41" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="#00ff41" strokeWidth="2"/>
            </svg>
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{liveData.fleetUtilization}%</div>
            <div style={styles.statLabel}>Fleet Utilization</div>
          </div>
        </div>
      </div>

      {/* Interactive Fleet Map */}
      <div style={styles.mapCard}>
        <div style={styles.mapHeader}>
          <h3 style={styles.mapTitle}>Live Fleet Tracking</h3>
          <div style={styles.mapControls}>
            <button style={styles.mapControl}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2"/>
                <polyline points="1 20 1 14 7 14" stroke="currentColor" strokeWidth="2"/>
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Refresh
            </button>
            <button style={styles.mapControl}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Full Screen
            </button>
          </div>
        </div>
        <div style={styles.mapContainer}>
          <svg width="100%" height="400" viewBox="0 0 800 400" style={styles.mapSvg}>
            {/* Map background */}
            <rect width="800" height="400" fill="rgba(0, 0, 0, 0.3)" rx="8"/>
            
            {/* Interstate routes */}
            <path d="M 50 200 Q 200 150 400 200 T 750 200" stroke="rgba(0, 255, 65, 0.2)" strokeWidth="8" fill="none"/>
            <path d="M 400 50 Q 400 150 400 200 Q 400 250 400 350" stroke="rgba(0, 255, 65, 0.2)" strokeWidth="6" fill="none"/>
            
            {/* Main active shipments with real truck icons */}
            {mockShipments.map((shipment, index) => {
              const x = 100 + (index * 200) + (shipment.progress * 2);
              const y = 180 + (Math.sin(index) * 40);
              const isSemi = shipment.cargo === 'Pharmaceuticals' || shipment.cargo === 'Medical Supplies';
              
              return (
                <g key={shipment.id} transform={`translate(${x}, ${y})`}>
                  {/* Truck icon using actual images */}
                  <image 
                    href={isSemi ? semiIcon : truckIcon}
                    x="-12" y="-12" width="24" height="24"
                    style={{cursor: 'pointer', filter: shipment.onTime ? 'none' : 'hue-rotate(180deg)'}}
                    onClick={() => handleShipmentSelect(shipment)}
                  />
                  
                  {/* Pulse animation for active shipment */}
                  {index === 0 && (
                    <circle 
                      cx="0" cy="0" r="20" 
                      fill="none" 
                      stroke="#00ff41" 
                      strokeWidth="2" 
                      opacity="0.6"
                    >
                      <animate attributeName="r" values="20;30;20" dur="2s" repeatCount="indefinite"/>
                      <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite"/>
                    </circle>
                  )}
                  
                  {/* Enhanced info bubble for featured shipment */}
                  {index === 0 && (
                    <g transform="translate(30, -50)">
                      <rect 
                        x="0" y="0" width="200" height="90" 
                        fill="rgba(0, 255, 65, 0.15)" 
                        stroke="#00ff41" 
                        strokeWidth="2" 
                        rx="12"
                      />
                      <text x="10" y="18" fill="#00ff41" fontSize="11" fontWeight="700">
                        {shipment.id}
                      </text>
                      <text x="10" y="32" fill="#e0e0e0" fontSize="9">
                        📍 {shipment.currentLocation}
                      </text>
                      <text x="10" y="45" fill="#00ffff" fontSize="9">
                        ⏰ {shipment.onTime ? 'On Time' : 'Delayed'} • ETA: {shipment.eta.split(' ')[2]}
                      </text>
                      <text x="10" y="58" fill="#ff00ff" fontSize="9">
                        🌡️ Temp: {shipment.temperature}
                      </text>
                      <rect 
                        x="10" y="65" width="110" height="18" 
                        fill="#00ff41" 
                        rx="9"
                        style={{cursor: 'pointer'}}
                        onClick={() => handleShipmentSelect(shipment)}
                      />
                      <text x="65" y="76" fill="#0d0208" fontSize="9" textAnchor="middle" fontWeight="700">
                        Go to Dashboard
                      </text>
                    </g>
                  )}
                  
                  {/* Truck label */}
                  <text 
                    x="0" y="25" 
                    fill={shipment.onTime ? '#00ff41' : '#ff0040'} 
                    fontSize="8" 
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {shipment.truck}
                  </text>
                </g>
              );
            })}
            
            {/* Additional fleet trucks (10-15 total) */}
            {[...Array(12)].map((_, i) => {
              const x = 80 + (i * 55) + (Math.random() * 40);
              const y = 100 + (Math.random() * 200);
              const status = Math.random() > 0.25;
              const isSemi = Math.random() > 0.4;
              
              return (
                <g key={`fleet-truck-${i}`} transform={`translate(${x}, ${y})`}>
                  <image 
                    href={isSemi ? semiIcon : truckIcon}
                    x="-8" y="-8" width="16" height="16"
                    style={{
                      opacity: status ? 1 : 0.4,
                      filter: status ? 'none' : 'grayscale(1)'
                    }}
                  />
                  <text 
                    x="0" y="18" 
                    fill={status ? '#00ff41' : '#666'} 
                    fontSize="7" 
                    textAnchor="middle"
                    fontWeight="500"
                  >
                    FT-{(i + 100).toString().padStart(3, '0')}
                  </text>
                </g>
              );
            })}
            
            {/* Legend */}
            <g transform="translate(620, 20)">
              <rect x="0" y="0" width="170" height="120" fill="rgba(0, 0, 0, 0.7)" stroke="#00ff41" strokeWidth="1" rx="8"/>
              <text x="10" y="18" fill="#00ff41" fontSize="12" fontWeight="700">Fleet Status</text>
              
              <image href={semiIcon} x="10" y="28" width="16" height="16"/>
              <text x="32" y="40" fill="#e0e0e0" fontSize="9">Semi Trucks (Active)</text>
              
              <image href={truckIcon} x="10" y="48" width="16" height="16"/>
              <text x="32" y="60" fill="#e0e0e0" fontSize="9">Box Trucks (Active)</text>
              
              <image href={truckIcon} x="10" y="68" width="16" height="16" style={{opacity: 0.4, filter: 'grayscale(1)'}}/>
              <text x="32" y="80" fill="#666" fontSize="9">Inactive/Maintenance</text>
              
              <circle cx="16" cy="95" r="10" fill="none" stroke="#00ff41" strokeWidth="2"/>
              <text x="32" y="100" fill="#e0e0e0" fontSize="9">Live Tracking</text>
            </g>
          </svg>
        </div>
        <div style={styles.mapStats}>
          <div style={styles.mapStat}>
            <span style={styles.mapStatLabel}>Active Trucks:</span>
            <span style={styles.mapStatValue}>15/18</span>
          </div>
          <div style={styles.mapStat}>
            <span style={styles.mapStatLabel}>On Time:</span>
            <span style={styles.mapStatValue}>89%</span>
          </div>
          <div style={styles.mapStat}>
            <span style={styles.mapStatLabel}>Avg Speed:</span>
            <span style={styles.mapStatValue}>62 mph</span>
          </div>
          <div style={styles.mapStat}>
            <span style={styles.mapStatLabel}>Fleet Utilization:</span>
            <span style={styles.mapStatValue}>87%</span>
          </div>
        </div>
      </div>

      {/* Active Shipments List */}
      <div style={styles.shipmentsCard}>
        <div style={styles.shipmentsHeader}>
          <h3 style={styles.shipmentsTitle}>Active Shipments</h3>
          <div style={styles.shipmentsControls}>
            <button style={styles.filterButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Filter
            </button>
            <button style={styles.sortButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Sort
            </button>
          </div>
        </div>

        <div style={styles.shipmentsList}>
          {mockShipments.map((shipment) => (
            <div 
              key={shipment.id} 
              style={styles.shipmentItem}
              onClick={() => handleShipmentSelect(shipment)}
            >
              <div style={styles.shipmentIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="3" width="15" height="13" stroke={shipment.onTime ? '#00ff41' : '#ff0040'} strokeWidth="2"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke={shipment.onTime ? '#00ff41' : '#ff0040'} strokeWidth="2"/>
                  <circle cx="5.5" cy="18.5" r="2.5" stroke={shipment.onTime ? '#00ff41' : '#ff0040'} strokeWidth="2"/>
                  <circle cx="18.5" cy="18.5" r="2.5" stroke={shipment.onTime ? '#00ff41' : '#ff0040'} strokeWidth="2"/>
                </svg>
              </div>
              
              <div style={styles.shipmentInfo}>
                <div style={styles.shipmentHeader}>
                  <span style={styles.shipmentId}>{shipment.id}</span>
                  <span style={{
                    ...styles.shipmentStatus,
                    color: shipment.onTime ? '#00ff41' : '#ff0040'
                  }}>
                    {shipment.status}
                  </span>
                </div>
                
                <div style={styles.shipmentRoute}>
                  <span style={styles.routeOrigin}>{shipment.origin}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={styles.routeArrow}>
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="#00ffff" strokeWidth="2"/>
                  </svg>
                  <span style={styles.routeDestination}>{shipment.destination}</span>
                </div>
                
                <div style={styles.shipmentDetails}>
                  <span style={styles.shipmentDetail}>
                    <strong>Driver:</strong> {shipment.driver}
                  </span>
                  <span style={styles.shipmentDetail}>
                    <strong>Current:</strong> {shipment.currentLocation}
                  </span>
                  <span style={styles.shipmentDetail}>
                    <strong>ETA:</strong> {shipment.eta}
                  </span>
                </div>
              </div>
              
              <div style={styles.shipmentProgress}>
                <div style={styles.progressLabel}>{shipment.progress}%</div>
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
          ))}
        </div>
      </div>
    </div>
  );

  const renderShipmentDetails = () => (
    <div style={styles.viewContainer}>
      <div style={styles.shipmentDetailsHeader}>
        <button 
          style={styles.backButton}
          onClick={() => setActiveView('fleet')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back to Fleet
        </button>
        <h2 style={styles.shipmentDetailsTitle}>
          Shipment {selectedShipment?.id}
        </h2>
      </div>

      {selectedShipment && (
        <>
          {/* Status Overview */}
          <div style={styles.statusOverview}>
            <div style={styles.statusCard}>
              <div style={styles.statusIndicator}>
                <div style={{
                  ...styles.statusLight,
                  backgroundColor: selectedShipment.onTime ? '#00ff41' : '#ff0040'
                }}></div>
                <span style={styles.statusText}>
                  {selectedShipment.status} • {selectedShipment.onTime ? 'On Time' : 'Delayed'}
                </span>
              </div>
              <div style={styles.etaInfo}>
                <div style={styles.etaLabel}>Estimated Delivery</div>
                <div style={styles.etaTime}>{selectedShipment.eta}</div>
                <div style={styles.currentLocation}>
                  Currently in: {selectedShipment.currentLocation}
                </div>
              </div>
            </div>
          </div>

          {/* Route Map */}
          <div style={styles.routeMapCard}>
            <div style={styles.routeMapHeader}>
              <h3 style={styles.routeMapTitle}>Live Route Tracking</h3>
              <div style={styles.routeMapControls}>
                <button style={styles.routeControl}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Live
                </button>
                <button style={styles.routeControl}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Route
                </button>
              </div>
            </div>
            
            <div style={styles.routeMapContainer}>
              <svg width="100%" height="300" viewBox="0 0 600 300" style={styles.routeSvg}>
                {/* Geofenced route */}
                <path 
                  d="M 30 150 Q 150 100 300 150 T 570 150" 
                  stroke="rgba(0, 255, 65, 0.3)" 
                  strokeWidth="20" 
                  fill="none"
                />
                <path 
                  d="M 30 150 Q 150 100 300 150 T 570 150" 
                  stroke="#00ff41" 
                  strokeWidth="4" 
                  fill="none"
                />
                
                {/* Origin */}
                <circle cx="30" cy="150" r="8" fill="#00ffff"/>
                <text x="30" y="175" textAnchor="middle" fill="#00ffff" fontSize="10">
                  {selectedShipment.origin}
                </text>
                
                {/* Destination */}
                <circle cx="570" cy="150" r="8" fill="#ff00ff"/>
                <text x="570" y="175" textAnchor="middle" fill="#ff00ff" fontSize="10">
                  {selectedShipment.destination}
                </text>
                
                {/* Current position */}
                <g transform={`translate(${30 + (selectedShipment.progress * 5.4)}, 150)`}>
                  <circle cx="0" cy="0" r="10" fill="#00ff41">
                    <animate attributeName="r" values="10;15;10" dur="2s" repeatCount="indefinite"/>
                  </circle>
                  <rect x="-6" y="-4" width="12" height="8" fill="#00ff41" rx="2"/>
                  <text x="0" y="25" textAnchor="middle" fill="#00ff41" fontSize="10" fontWeight="600">
                    {selectedShipment.truck}
                  </text>
                </g>
                
                {/* Progress markers */}
                <circle cx="150" cy="125" r="4" fill="#00ffff" opacity="0.7"/>
                <text x="150" y="115" textAnchor="middle" fill="#00ffff" fontSize="8">Checkpoint 1</text>
                
                <circle cx="300" cy="150" r="4" fill="#00ffff" opacity="0.7"/>
                <text x="300" y="140" textAnchor="middle" fill="#00ffff" fontSize="8">Checkpoint 2</text>
                
                <circle cx="450" cy="175" r="4" fill="#00ffff" opacity="0.7"/>
                <text x="450" y="195" textAnchor="middle" fill="#00ffff" fontSize="8">Checkpoint 3</text>
              </svg>
            </div>
            
            <div style={styles.routeMetrics}>
              <div style={styles.routeMetric}>
                <span style={styles.metricLabel}>Progress:</span>
                <span style={styles.metricValue}>{selectedShipment.progress}%</span>
              </div>
              <div style={styles.routeMetric}>
                <span style={styles.metricLabel}>Temperature:</span>
                <span style={styles.metricValue}>{selectedShipment.temperature}</span>
              </div>
              <div style={styles.routeMetric}>
                <span style={styles.metricLabel}>Speed:</span>
                <span style={styles.metricValue}>67 mph</span>
              </div>
            </div>
          </div>

          {/* Shipment Details */}
          <div style={styles.detailsGrid}>
            <div style={styles.detailCard}>
              <h4 style={styles.detailTitle}>Cargo Information</h4>
              <div style={styles.detailContent}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Type:</span>
                  <span style={styles.detailValue}>{selectedShipment.cargo}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Value:</span>
                  <span style={styles.detailValue}>{selectedShipment.value}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Temperature:</span>
                  <span style={styles.detailValue}>{selectedShipment.temperature}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Special Handling:</span>
                  <span style={styles.detailValue}>TAPA Certified Required</span>
                </div>
              </div>
            </div>

            <div style={styles.detailCard}>
              <h4 style={styles.detailTitle}>Driver & Vehicle</h4>
              <div style={styles.detailContent}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Driver:</span>
                  <span style={styles.detailValue}>{selectedShipment.driver}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Truck ID:</span>
                  <span style={styles.detailValue}>{selectedShipment.truck}</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Contact:</span>
                  <span style={styles.detailValue}>(312) 555-0147</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Last Update:</span>
                  <span style={styles.detailValue}>2 min ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Documentation */}
          <div style={styles.documentsCard}>
            <h4 style={styles.documentsTitle}>Documentation & Photos</h4>
            <div style={styles.documentsGrid}>
              <div style={styles.documentItem}>
                <div style={styles.documentIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ff41" strokeWidth="2"/>
                    <polyline points="14,2 14,8 20,8" stroke="#00ff41" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.documentInfo}>
                  <div style={styles.documentName}>Bill of Lading</div>
                  <div style={styles.documentStatus}>Signed & Verified</div>
                </div>
                <button style={styles.documentAction}>View</button>
              </div>

              <div style={styles.documentItem}>
                <div style={styles.documentIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke="#00ffff" strokeWidth="2"/>
                    <polyline points="17,2 12,7 7,2" stroke="#00ffff" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.documentInfo}>
                  <div style={styles.documentName}>Cargo Photos</div>
                  <div style={styles.documentStatus}>Loading & Seal Images</div>
                </div>
                <button style={styles.documentAction}>View</button>
              </div>

              <div style={styles.documentItem}>
                <div style={styles.documentIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="#ff00ff" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.documentInfo}>
                  <div style={styles.documentName}>Temperature Log</div>
                  <div style={styles.documentStatus}>Continuous Monitoring</div>
                </div>
                <button style={styles.documentAction}>View</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Matrix Background */}
      <div style={styles.matrixBackground}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.matrixColumn,
              left: `${i * 6.67}%`,
              animationDelay: `${i * 0.2}s`,
            }}
          >
            {[...Array(8)].map((_, j) => (
              <span key={j} style={styles.matrixChar}>
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <img 
            src={logoImage} 
            alt="FreighTrix Logo" 
            style={styles.logoImage}
          />
          <div style={styles.headerInfo}>
            <h1 style={styles.welcomeText}>
              Welcome, {userData?.company || 'DemoCorp Logistics'}
            </h1>
            <p style={styles.userRole}>{userData?.role || 'Fleet Manager'}</p>
          </div>
        </div>
        
        <div style={styles.headerControls}>
          <button style={styles.headerButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
          <button style={styles.headerButton} onClick={onLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div style={styles.navigation}>
        <button 
          style={{
            ...styles.navButton,
            ...(activeView === 'fleet' ? styles.navButtonActive : {})
          }}
          onClick={() => setActiveView('fleet')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <polygon points="3 6 9 9 15 15 21 12 21 18 15 21 9 15 3 12" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Fleet Overview
        </button>
        
        {selectedShipment && (
          <button 
            style={{
              ...styles.navButton,
              ...(activeView === 'shipment' ? styles.navButtonActive : {})
            }}
            onClick={() => setActiveView('shipment')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="3" width="15" height="13" stroke="currentColor" strokeWidth="2"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="currentColor" strokeWidth="2"/>
              <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
              <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Shipment Details
          </button>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {activeView === 'fleet' ? renderFleetOverview() : renderShipmentDetails()}
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
          
          @keyframes matrixFall {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          
          @keyframes slideIn {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.05); opacity: 0.8; }
          }

          @keyframes glow {
            0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 65, 0.3); }
            50% { box-shadow: 0 0 25px rgba(0, 255, 65, 0.6); }
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
    opacity: 0.06,
    zIndex: 0,
  },
  matrixColumn: {
    position: 'absolute',
    top: 0,
    fontSize: '10px',
    color: '#00ff41',
    animation: 'matrixFall 25s linear infinite',
    display: 'flex',
    flexDirection: 'column',
  },
  matrixChar: {
    display: 'block',
    marginBottom: '6px',
    fontFamily: 'monospace',
  },
  header: {
    zIndex: 1,
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(13, 2, 8, 0.9)',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  logoImage: {
    height: '40px',
    width: 'auto',
    filter: 'drop-shadow(0 0 8px rgba(0, 255, 65, 0.3))',
  },
  headerInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  welcomeText: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 600,
    margin: 0,
    background: 'linear-gradient(90deg, #00ffff 0%, #ff00ff 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
  },
  userRole: {
    color: '#999',
    fontSize: '0.9rem',
    margin: 0,
  },
  headerControls: {
    display: 'flex',
    gap: '0.5rem',
  },
  headerButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '8px',
    padding: '0.5rem',
    color: '#00ff41',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  navigation: {
    zIndex: 1,
    display: 'flex',
    gap: '1rem',
    padding: '1rem',
    borderBottom: '1px solid rgba(0, 255, 65, 0.1)',
    backgroundColor: 'rgba(13, 2, 8, 0.8)',
    backdropFilter: 'blur(10px)',
  },
  navButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem 1rem',
    color: '#e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
  navButtonActive: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderColor: '#00ff41',
    color: '#00ff41',
  },
  mainContent: {
    flex: 1,
    zIndex: 1,
    padding: '1rem',
    overflow: 'auto',
    animation: 'slideIn 0.5s ease-out',
  },
  viewContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  statCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  statIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.8rem',
    fontWeight: 700,
    color: '#00ff41',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#999',
  },
  mapCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  mapHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  mapTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.3rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  mapControls: {
    display: 'flex',
    gap: '0.5rem',
  },
  mapControl: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: '#00ff41',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    transition: 'all 0.3s ease',
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
  mapStats: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '1rem',
  },
  mapStat: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
  },
  mapStatLabel: {
    fontSize: '0.8rem',
    color: '#999',
  },
  mapStatValue: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
  },
  shipmentsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  shipmentsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  shipmentsTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  shipmentsControls: {
    display: 'flex',
    gap: '0.5rem',
  },
  filterButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 255, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: '#00ffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    transition: 'all 0.3s ease',
  },
  sortButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(255, 0, 255, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: '#ff00ff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    transition: 'all 0.3s ease',
  },
  shipmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  shipmentItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 255, 65, 0.1)',
    borderRadius: '8px',
    padding: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  shipmentIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  shipmentInfo: {
    flex: 1,
  },
  shipmentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  shipmentId: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ffff',
  },
  shipmentStatus: {
    fontSize: '0.8rem',
    fontWeight: 500,
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
  },
  shipmentRoute: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  },
  routeOrigin: {
    color: '#e0e0e0',
    fontWeight: 500,
  },
  routeArrow: {
    color: '#00ffff',
  },
  routeDestination: {
    color: '#e0e0e0',
    fontWeight: 500,
  },
  shipmentDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  shipmentDetail: {
    fontSize: '0.8rem',
    color: '#999',
  },
  shipmentProgress: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    minWidth: '80px',
  },
  progressLabel: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
  },
  progressBar: {
    width: '60px',
    height: '4px',
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    borderRadius: '2px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '2px',
    transition: 'width 0.3s ease',
  },
  shipmentDetailsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  backButton: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '8px',
    padding: '0.75rem',
    color: '#00ff41',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  shipmentDetailsTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  statusOverview: {
    marginBottom: '1.5rem',
  },
  statusCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '12px',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
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
  etaInfo: {
    textAlign: 'center',
  },
  etaLabel: {
    fontSize: '0.9rem',
    color: '#999',
    marginBottom: '0.25rem',
  },
  etaTime: {
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#00ffff',
    marginBottom: '0.25rem',
  },
  currentLocation: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
  },
  routeMapCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  routeMapHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  routeMapTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.2rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: 0,
  },
  routeMapControls: {
    display: 'flex',
    gap: '0.5rem',
  },
  routeControl: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: '#00ff41',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    transition: 'all 0.3s ease',
  },
  routeMapContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    marginBottom: '1rem',
  },
  routeSvg: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  routeMetrics: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '1rem',
  },
  routeMetric: {
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
  detailsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  detailCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  detailTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  detailContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#999',
    fontSize: '0.9rem',
  },
  detailValue: {
    color: '#e0e0e0',
    fontWeight: 500,
  },
  documentsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  documentsTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ff41',
    margin: '0 0 1rem 0',
  },
  documentsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  documentItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    border: '1px solid rgba(0, 255, 65, 0.1)',
  },
  documentIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontWeight: 600,
    color: '#e0e0e0',
    marginBottom: '0.25rem',
  },
  documentStatus: {
    fontSize: '0.8rem',
    color: '#999',
  },
  documentAction: {
    backgroundColor: 'transparent',
    border: '1px solid rgba(0, 255, 65, 0.3)',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    color: '#00ff41',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: 500,
    transition: 'all 0.3s ease',
  },
};

export default CustomerDashboard;