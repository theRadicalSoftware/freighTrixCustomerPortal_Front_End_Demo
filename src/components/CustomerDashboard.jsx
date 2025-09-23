import React, { useState, useEffect } from 'react';
import DocumentViewer from './DocumentViewer';
import LiveMap from './LiveMap'; // This import is now used in the new map section
import logoImage from '../imgs/FreightTrixHeader_Graphic.png';
import truckIcon from '../imgs/freighTrixTruckIcon.png';
import semiIcon from '../imgs/freighTrixMapSemiIcon.png';
import trackersImg from '../imgs/trackersImg.jpeg';

const CustomerDashboard = ({ userData, onLogout }) => {
  const [activeView, setActiveView] = useState('fleet');
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showPulse, setShowPulse] = useState(true);
  const [liveData, setLiveData] = useState({
    totalShipments: 3,
    inTransit: 3,
    delivered: 0,
    carbonSavings: 38, // % Carbon Reduction using TCV Sprinter
  });
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [currentDocument, setCurrentDocument] = useState(null);
  const [documentType, setDocumentType] = useState('');

  // Add this state for tooltip management
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Add this state at the top of CustomerDashboard component:
  const [mapControlsReady, setMapControlsReady] = useState(false);

  // Add state for route selection:
  const [selectedRouteShipment, setSelectedRouteShipment] = useState(null);

  // Optional: Add state for fuel stop filtering
  const [showFuelStops, setShowFuelStops] = useState(true);

  // Mock shipment data
  // Replace the mockShipments array with this reduced version
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
      value: '$2.3M',
      // Added fuel stop data for this shipment
      fuelStops: {
        planned: 3,
        next: { distance: 247, time: 4.2 }
      }
    },
    {
      id: 'FT-2024-1248',
      status: 'In Transit',
      origin: 'Houston, TX',
      destination: 'Miami, FL',
      driver: 'Sarah Johnson',
      truck: 'FT-TR-892',
      currentLocation: 'Tallahassee, FL',
      temperature: '2.1°C',
      eta: 'Dec 16, 10:00 AM',
      onTime: true,
      progress: 75,
      lat: 30.4383,
      lng: -84.2807,
      cargo: 'Medical Supplies',
      value: '$1.8M',
      fuelStops: {
        planned: 2,
        next: { distance: 110, time: 2.1 }
      }
    },
    {
      id: 'FT-2024-1249',
      status: 'In Transit',
      origin: 'Los Angeles, CA',
      destination: 'Seattle, WA',
      driver: 'Mike Chen',
      truck: 'FT-TR-123',
      currentLocation: 'Grants Pass, OR',
      temperature: 'Ambient',
      eta: 'Dec 15, 6:00 PM',
      onTime: false,
      progress: 70,
      lat: 42.4390,
      lng: -123.3298,
      cargo: 'Electronics',
      value: '$875K',
      fuelStops: {
        planned: 4,
        next: { distance: 85, time: 1.5 }
      }
    }
  ];

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setShowPulse(prev => !prev);
    }, 2000);
    return () => clearInterval(pulseInterval);
  }, []);

  // Add this useEffect after your existing useEffects
  useEffect(() => {
    // Position trucks when map is ready
    const positionTrucks = () => {
      if (window.positionFleetTrucks) {
        window.positionFleetTrucks();
      }
    };

    // Try positioning trucks every second until successful
    const positionInterval = setInterval(() => {
      if (window.positionFleetTrucks) {
        window.positionFleetTrucks();
        clearInterval(positionInterval);
      }
    }, 1000);

    return () => clearInterval(positionInterval);
  }, [mockShipments]);

  // Add this useEffect to handle closing tooltips on map interaction
  useEffect(() => {
    const handleMapInteraction = () => {
      if (activeTooltip) {
        setActiveTooltip(null);
      }
    };
    // Listen for map interactions
    const mapContainer = document.querySelector('[style*="position: relative"]');
    if (mapContainer) {
      mapContainer.addEventListener('click', handleMapInteraction);
      return () => mapContainer.removeEventListener('click', handleMapInteraction);
    }
  }, [activeTooltip]);

  // Add this useEffect to check for map readiness:
  useEffect(() => {
    const checkMapControls = () => {
      if (window.currentFleetMap) {
        setMapControlsReady(true);
      } else {
        setMapControlsReady(false);
      }
    };
    // Check immediately and then periodically
    checkMapControls();
    const interval = setInterval(checkMapControls, 1000);
    return () => clearInterval(interval);
  }, [activeView]);

  const handleShipmentSelect = (shipment) => {
    setSelectedShipment(shipment);
    setActiveView('shipment');
  };

  const handleViewDocument = (type, shipment) => {
    const mockDocuments = {
      'FT-2024-1247': {
        bol: {
          signed: true,
          timestamp: '2024-12-13T08:15:00Z',
          signedBy: 'Marcus Rodriguez',
          url: '/docs/FTRXExampleBOL.pdf', // Changed to PDF
          type: 'application/pdf'
        },
        photos: [
          {
            type: 'loading',
            timestamp: '2024-12-13T08:20:00Z',
            url: '/imgs/trackersImg.jpeg',
            description: 'Temperature sensor verification before loading'
          },
          {
            type: 'loading',
            timestamp: '2024-12-13T08:22:00Z',
            url: '/docs/LinkedInPhotosOfShipment.pdf', // Changed to PDF
            description: 'Complete shipment photo documentation'
          },
          {
            type: 'seal',
            timestamp: '2024-12-13T08:25:00Z',
            url: '/imgs/trackersImg.jpeg',
            description: 'Trailer door seals verification'
          },
          {
            type: 'temperature',
            timestamp: '2024-12-13T08:26:00Z',
            url: '/imgs/trackersImg.jpeg',
            description: 'Temperature monitoring equipment setup'
          }
        ],
        temperature: [
          { time: '08:00', temp: 4.1, target: 4.0 },
          { time: '09:00', temp: 4.3, target: 4.0 },
          { time: '10:00', temp: 3.9, target: 4.0 },
          { time: '11:00', temp: 4.2, target: 4.0 },
          { time: '12:00', temp: 4.0, target: 4.0 },
          { time: '13:00', temp: 4.4, target: 4.0 },
          { time: '14:00', temp: 4.1, target: 4.0 },
          { time: '15:00', temp: 4.2, target: 4.0 },
        ]
      }
    };
    const shipmentDocs = mockDocuments[shipment.id];
    if (!shipmentDocs) return;
    setCurrentDocument(shipmentDocs[type]);
    setDocumentType(type);
    setShowDocumentViewer(true);
  };

  const handleCloseDocumentViewer = () => {
    setShowDocumentViewer(false);
    setCurrentDocument(null);
    setDocumentType('');
  };

  // Replace the existing handleTruckClick function:
  const handleTruckClick = (shipment, event) => {
    event.stopPropagation(); // Prevent any parent click handlers

    if (activeTooltip === shipment.id) {
      // If clicking the same truck, close tooltip and clear route
      setActiveTooltip(null);
      setSelectedRouteShipment(null);
    } else {
      // Get click position relative to the map container
      const mapContainer = event.currentTarget.closest('[style*="position: relative"]');
      const rect = mapContainer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setTooltipPosition({ x, y });
      setActiveTooltip(shipment.id);

      // Show this shipment's route on the fleet map
      setSelectedRouteShipment(shipment);
    }
  };

  // Add function to close tooltip when clicking elsewhere
  const handleMapClick = () => {
    setActiveTooltip(null);
  };

  // Add these helper functions before renderFleetOverview()
  const getRealisticMapPosition = (location) => {
    // Map real locations to approximate pixel positions on a 1200x400 US map
    const locationMap = {
      'Des Moines, IA': { x: 520, y: 180 },     // Chicago to Denver route
      'Tallahassee, FL': { x: 700, y: 350 },     // Houston to Miami route
      'Grants Pass, OR': { x: 100, y: 140 },     // Los Angeles to Seattle route
      'Chicago, IL': { x: 560, y: 160 },
      'Denver, CO': { x: 360, y: 220 },
      'Houston, TX': { x: 420, y: 320 },
      'Miami, FL': { x: 780, y: 380 },
      'Los Angeles, CA': { x: 60, y: 280 },
      'Seattle, WA': { x: 120, y: 80 }
    };
    return locationMap[location] || { x: 500, y: 200 }; // Default to center US
  };

  const getRealisticFleetPositions = () => { // Return empty array - we only want to show the actual shipment trucks
    return [];
  };

  // Add this function after getRealisticFleetPositions
  const positionTrucksOnMap = (mapInstance) => {
    // Wait a bit for map to fully render
    setTimeout(() => {
      const trucks = document.querySelectorAll('[data-shipment-id]');
      trucks.forEach(truck => {
        const lat = parseFloat(truck.getAttribute('data-lat'));
        const lng = parseFloat(truck.getAttribute('data-lng'));

        if (lat && lng && mapInstance) {
          try {
            // Convert lat/lng to pixel coordinates using Trimble Maps
            const point = mapInstance.project([lng, lat]);

            // Position the truck overlay at the correct pixel location
            truck.style.left = `${point.x}px`;
            truck.style.top = `${point.y}px`;
            truck.style.position = 'absolute';
            truck.style.transform = 'translate(-50%, -50%)';
            truck.style.pointerEvents = 'auto';
          } catch (error) {
            console.warn('Error positioning truck:', error);
          }
        }
      });
    }, 500);
  };

  // Update button style to show disabled state:
  const getMapControlStyle = () => ({
    ...styles.mapControl,
    opacity: mapControlsReady ? 1 : 0.5,
    cursor: mapControlsReady ? 'pointer' : 'not-allowed',
  });

  const renderFleetOverview = () => (
    <div style={styles.viewContainer}>
      {/* Fleet Statistics */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="1" y="3" width="15" height="13" stroke="#00ff41" strokeWidth="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="#00ff41" strokeWidth="2" />
              <circle cx="5.5" cy="18.5" r="2.5" stroke="#00ff41" strokeWidth="2" />
              <circle cx="18.5" cy="18.5" r="2.5" stroke="#00ff41" strokeWidth="2" />
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
              <polygon points="3 6 9 9 15 15 21 12 21 18 15 21 9 15 3 12" stroke="#00ffff" strokeWidth="2" />
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
              <polyline points="20,6 9,17 4,12" stroke="#ff00ff" strokeWidth="2" />
            </svg>
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{liveData.delivered}</div>
            <div style={styles.statLabel}>Delivered Today</div>
          </div>
        </div>

        {/* AFTER (Carbon Footprint Savings) */}
        <div style={styles.statCard}>
          <div style={styles.statIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#00ff41" strokeWidth="2" />
              <path d="M12 6v6l4 2" stroke="#00ff41" strokeWidth="2" />
            </svg>
          </div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{liveData.carbonSavings}%</div>
            <div style={styles.statLabel}>Carbon Footprint Savings</div>
            <div style={styles.statSubLabel}>Using TCV Sprinter</div>
          </div>
        </div>
      </div>

      {/* Interactive Fleet Map */}
      <div style={styles.mapCard}>
        <div style={styles.mapHeader}>
          <h3 style={styles.mapTitle}>Live Fleet Tracking</h3>
          <div style={styles.mapControls}>
            <button
              style={getMapControlStyle()}
              onClick={() => {
                try {
                  if (window.currentFleetMap && typeof window.currentFleetMap.zoomIn === 'function') {
                    window.currentFleetMap.zoomIn();
                  } else if (window.currentFleetMap) {
                    // Fallback using setZoom
                    const currentZoom = window.currentFleetMap.getZoom();
                    window.currentFleetMap.setZoom(currentZoom + 1);
                  } else {
                    console.warn('Fleet map not available for zoom control');
                  }
                } catch (error) {
                  console.error('Error zooming in:', error);
                }
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
              </svg>
              Zoom In
            </button>
            <button
              style={getMapControlStyle()}
              onClick={() => {
                try {
                  if (window.currentFleetMap && typeof window.currentFleetMap.zoomOut === 'function') {
                    window.currentFleetMap.zoomOut();
                  } else if (window.currentFleetMap) {
                    // Fallback using setZoom
                    const currentZoom = window.currentFleetMap.getZoom();
                    window.currentFleetMap.setZoom(Math.max(currentZoom - 1, 1)); // Prevent zoom too far out
                  } else {
                    console.warn('Fleet map not available for zoom control');
                  }
                } catch (error) {
                  console.error('Error zooming out:', error);
                }
              }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
              </svg>
              Zoom Out
            </button>
            <button
              style={{
                ...styles.mapControl,
                backgroundColor: selectedRouteShipment ? 'rgba(0, 255, 65, 0.2)' : 'rgba(0, 255, 65, 0.1)',
                borderColor: selectedRouteShipment ? '#00ff41' : 'rgba(0, 255, 65, 0.3)',
              }}
              onClick={() => {
                // Clear selected route
                setSelectedRouteShipment(null);
                setActiveTooltip(null);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="currentColor" strokeWidth="2" />
              </svg>
              {selectedRouteShipment ? 'Clear Route' : 'Show Route'}
            </button>
            <button style={styles.mapControl}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <polyline points="23 4 23 10 17 10" stroke="currentColor" strokeWidth="2" />
                <polyline points="1 20 1 14 7 14" stroke="currentColor" strokeWidth="2" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" stroke="currentColor" strokeWidth="2" />
              </svg>
              Refresh
            </button>
            <button style={styles.mapControl}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2" />
                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" />
              </svg>
              Full Screen
            </button>
          </div>
        </div>
        <div style={styles.mapContainer}>
          {/* Trimble Map with Fleet Overlay */}
          {/* ⬇️ Wrap the map + overlay in a clipped viewport */}
          <div style={styles.mapViewport}>
            <LiveMap
              key="fleet-overview-map"
              shipment={mockShipments[0]} // Primary shipment for map centering
              height={400}
              showRoute={false} // Don't show default route
              isFleetView={true}
              selectedRouteShipment={selectedRouteShipment} // Pass selected route shipment
              onMapLoad={positionTrucksOnMap}
            />
            {/* Fleet Overlay Container */}
            <div style={styles.fleetOverlayInteractive}>
              {/* Main active shipments with truck icons - ONLY these three */}
              {mockShipments.map((shipment, index) => {
                // Skip if this is not an in-transit shipment (for cleaner display)
                if (shipment.status !== 'In Transit') return null;

                return (
                  <div
                    key={shipment.id}
                    style={{
                      ...styles.truckMarkerGeo,
                      // We'll position these via JavaScript after map loads
                    }}
                    data-lat={shipment.lat}
                    data-lng={shipment.lng}
                    data-shipment-id={shipment.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Close tooltip if clicking elsewhere
                      if (activeTooltip && !e.target.closest('[data-shipment-id]')) {
                        setActiveTooltip(null);
                      }
                    }}
                  >
                    {/* Truck icon */}
                    <img
                      src={shipment.cargo === 'Pharmaceuticals' || shipment.cargo === 'Medical Supplies' ? semiIcon : truckIcon}
                      alt={shipment.truck}
                      style={{
                        ...styles.truckIcon,
                        filter: shipment.onTime ? 'none' : 'hue-rotate(180deg)',
                        cursor: 'pointer',
                        // Add visual feedback when tooltip is active
                        transform: activeTooltip === shipment.id ? 'scale(1.1)' : 'scale(1)',
                        boxShadow: activeTooltip === shipment.id ? '0 0 15px rgba(0, 255, 65, 0.6)' : 'none',
                        borderRadius: '50%'
                      }}
                      onClick={(e) => handleTruckClick(shipment, e)}
                    />
                    {/* Rest of truck marker content remains the same */}
                    {index === 0 && (
                      <div style={styles.steadyGlow} />
                    )}
                    <div style={{
                      ...styles.truckLabel,
                      color: shipment.onTime ? '#00ff41' : '#ff0040'
                    }}>
                      {shipment.truck}
                    </div>
                  </div>
                );
              })}
              {/* Dynamic Tooltip */}
              {activeTooltip && (
                <div
                  style={{
                    ...styles.dynamicTooltip,
                    left: `${tooltipPosition.x}px`,
                    top: `${tooltipPosition.y}px`,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {(() => {
                    const shipment = mockShipments.find(s => s.id === activeTooltip);
                    if (!shipment) return null;

                    return (
                      <div style={styles.tooltipContent}>
                        <div style={styles.tooltipHeader}>
                          <div style={styles.tooltipTitle}>{shipment.id}</div>
                          <button
                            style={styles.tooltipClose}
                            onClick={() => setActiveTooltip(null)}
                          >
                            ×
                          </button>
                        </div>

                        <div style={styles.tooltipBody}>
                          <div style={styles.tooltipRow}>
                            <span style={styles.tooltipIcon}>📍</span>
                            <span style={styles.tooltipText}>{shipment.currentLocation}</span>
                          </div>

                          <div style={styles.tooltipRow}>
                            <span style={styles.tooltipIcon}>👤</span>
                            <span style={styles.tooltipText}>{shipment.driver}</span>
                          </div>

                          <div style={styles.tooltipRow}>
                            <span style={styles.tooltipIcon}>🚛</span>
                            <span style={styles.tooltipText}>{shipment.truck}</span>
                          </div>

                          <div style={styles.tooltipRow}>
                            <span style={styles.tooltipIcon}>⏰</span>
                            <span style={styles.tooltipText}>
                              {shipment.onTime ? 'On Time' : 'Delayed'} • ETA: {shipment.eta.split(' ')[2]}
                            </span>
                          </div>

                          <div style={styles.tooltipRow}>
                            <span style={styles.tooltipIcon}>🌡️</span>
                            <span style={styles.tooltipText}>Temp: {shipment.temperature}</span>
                          </div>

                          <div style={styles.tooltipRow}>
                            <span style={styles.tooltipIcon}>📦</span>
                            <span style={styles.tooltipText}>{shipment.cargo}</span>
                          </div>

                          <div style={styles.tooltipProgress}>
                            <span style={styles.tooltipProgressLabel}>Progress: {shipment.progress}%</span>
                            <div style={styles.tooltipProgressBar}>
                              <div
                                style={{
                                  ...styles.tooltipProgressFill,
                                  width: `${shipment.progress}%`,
                                  backgroundColor: shipment.onTime ? '#00ff41' : '#ff0040'
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div style={styles.tooltipFooter}>
                          <button
                            style={styles.tooltipViewButton}
                            onClick={() => {
                              setActiveTooltip(null);
                              handleShipmentSelect(shipment);
                            }}
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Legend Overlay - same as before */}
              <div style={styles.mapLegend}>
                <div style={styles.legendTitle}>Fleet Status</div>
                <div style={styles.legendItem}>
                  <img src={semiIcon} style={styles.legendIcon} alt="Semi" />
                  <span style={styles.legendText}>Semi Trucks (Active)</span>
                </div>
                <div style={styles.legendItem}>
                  <img src={truckIcon} style={styles.legendIcon} alt="Box truck" />
                  <span style={styles.legendText}>Box Trucks (Active)</span>
                </div>
                <div style={styles.legendItem}>
                  <div style={styles.legendPulse} />
                  <span style={styles.legendText}>Live Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={styles.mapStats}>
          <div style={styles.mapStat}>
            <span style={styles.mapStatLabel}>Active Trucks:</span>
            <span style={styles.mapStatValue}>3/3</span>
          </div>
          <div style={styles.mapStat}>
            <span style={styles.mapStatLabel}>On Time:</span>
            <span style={styles.mapStatValue}>67%</span>
          </div>
          <div style={styles.mapStat}>
            <span style={styles.mapStatLabel}>Routes Active:</span>
            <span style={styles.mapStatValue}>3</span>
          </div>
          <div style={styles.mapStat}>
            <span style={styles.mapStatLabel}>Carbon Footprint Savings:</span>
            <span style={styles.mapStatValue}>{liveData.carbonSavings}%</span>
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
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" stroke="currentColor" strokeWidth="2" />
              </svg>
              Filter
            </button>
            <button style={styles.sortButton}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M7 12h10m-7 6h4" stroke="currentColor" strokeWidth="2" />
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
                  <rect x="1" y="3" width="15" height="13" stroke={shipment.onTime ? '#00ff41' : '#ff0040'} strokeWidth="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke={shipment.onTime ? '#00ff41' : '#ff0040'} strokeWidth="2" />
                  <circle cx="5.5" cy="18.5" r="2.5" stroke={shipment.onTime ? '#00ff41' : '#ff0040'} strokeWidth="2" />
                  <circle cx="18.5" cy="18.5" r="2.5" stroke={shipment.onTime ? '#00ff41' : '#ff0040'} strokeWidth="2" />
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
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="#00ffff" strokeWidth="2" />
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
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" />
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

          {/* Enhanced Route Map */}
          <div style={styles.routeMapCard}>
            <div style={styles.routeMapHeader}>
              <h3 style={styles.routeMapTitle}>Live Route Tracking</h3>
              <div style={styles.routeMapControls}>
                <button
                  style={styles.routeControl}
                  onClick={() => {
                    try {
                      const mapInstance = window[`shipmentMap_${selectedShipment?.id}`];
                      if (mapInstance && typeof mapInstance.zoomIn === 'function') {
                        mapInstance.zoomIn();
                      } else if (mapInstance) {
                        const currentZoom = mapInstance.getZoom();
                        mapInstance.setZoom(currentZoom + 1);
                      } else {
                        console.warn('Shipment map not available for zoom control');
                      }
                    } catch (error) {
                      console.error('Error zooming in:', error);
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <line x1="12" y1="8" x2="12" y2="16" stroke="currentColor" strokeWidth="2" />
                    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Zoom In
                </button>

                <button
                  style={styles.routeControl}
                  onClick={() => {
                    try {
                      const mapInstance = window[`shipmentMap_${selectedShipment?.id}`];
                      if (mapInstance && typeof mapInstance.zoomOut === 'function') {
                        mapInstance.zoomOut();
                      } else if (mapInstance) {
                        const currentZoom = mapInstance.getZoom();
                        mapInstance.setZoom(Math.max(currentZoom - 1, 1));
                      } else {
                        console.warn('Shipment map not available for zoom control');
                      }
                    } catch (error) {
                      console.error('Error zooming out:', error);
                    }
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Zoom Out
                </button>

                <button style={styles.routeControl}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Live
                </button>
                <button style={styles.routeControl}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Route
                </button>
              </div>
            </div>
            <LiveMap
              key={`dashboard-map-${selectedShipment?.id}`}
              shipment={selectedShipment}
              height={400}
              showRoute={true}
            />
            {/* Enhanced Route Metrics */}
            <div style={styles.enhancedRouteMetrics}>
              <div style={styles.enhancedRouteMetric}>
                <div style={styles.routeMetricIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#00ff41" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.routeMetricInfo}>
                  <span style={styles.metricLabel}>Speed:</span>
                  <span style={styles.metricValue}>67 mph</span>
                </div>
              </div>
              <div style={styles.enhancedRouteMetric}>
                <div style={styles.routeMetricIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 11H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h4m6-6h4a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-4m-6 0V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" stroke="#00ffff" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.routeMetricInfo}>
                  <span style={styles.metricLabel}>Distance Remaining:</span>
                  <span style={styles.metricValue}>{Math.round((100 - selectedShipment.progress) * 10)} miles</span>
                </div>
              </div>
              <div style={styles.enhancedRouteMetric}>
                <div style={styles.routeMetricIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#ff00ff" strokeWidth="2" />
                    <path d="M12 6v6l4 2" stroke="#ff00ff" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.routeMetricInfo}>
                  <span style={styles.metricLabel}>Next Checkpoint:</span>
                  <span style={styles.metricValue}>47 miles</span>
                </div>
              </div>
              <div style={styles.enhancedRouteMetric}>
                <div style={styles.routeMetricIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="#00ff41" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.routeMetricInfo}>
                  <span style={styles.metricLabel}>Temperature:</span>
                  <span style={styles.metricValue}>{selectedShipment.temperature}</span>
                </div>
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

            {/* NEW: Trip Information Section */}
            <div style={styles.detailCard}>
              <h4 style={styles.detailTitle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="#00ff41" strokeWidth="2" />
                  <circle cx="12" cy="10" r="3" stroke="#00ff41" strokeWidth="2" />
                </svg>
                Trip Information
              </h4>
              <div style={styles.detailContent}>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Route Distance:</span>
                  <span style={styles.detailValue}>1,004 miles</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Est. Drive Time:</span>
                  <span style={styles.detailValue}>18.5 hours</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Fuel Efficiency:</span>
                  <span style={styles.detailValue}>6.2 MPG</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Route Type:</span>
                  <span style={styles.detailValue}>PC*MILER Practical</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Toll Costs:</span>
                  <span style={styles.detailValue}>$89.50</span>
                </div>
                {/* Add fuel stops to the trip information sections */}
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Fuel Stops:</span>
                  <span style={styles.detailValue}>3 Planned</span>
                </div>
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>HOS Compliance:</span>
                  <span style={{ ...styles.detailValue, color: '#00ff41' }}>On Track</span>
                </div>
              </div>
            </div>
          </div>

          {/* NEW: Advanced Trip Analytics Section */}
          <div style={styles.tripAnalyticsCard}>
            <h4 style={styles.tripAnalyticsTitle}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
                <path d="M3 3v18h18" stroke="#00ffff" strokeWidth="2" />
                <path d="M8 17l4-4 4 4" stroke="#00ffff" strokeWidth="2" />
              </svg>
              Advanced Trip Analytics
            </h4>
            <div style={styles.tripAnalyticsGrid}>
              <div style={styles.tripAnalyticItem}>
                <div style={styles.analyticIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#00ff41" strokeWidth="2" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#00ff41" strokeWidth="2" />
                    <path d="M12 17h.01" stroke="#00ff41" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.analyticDetails}>
                  <div style={styles.analyticLabel}>Route Optimization</div>
                  <div style={styles.analyticValue}>97% Efficient</div>
                  <div style={styles.analyticSubtext}>Saved 47 miles vs. standard route</div>
                </div>
              </div>
              <div style={styles.tripAnalyticItem}>
                <div style={styles.analyticIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#00ffff" strokeWidth="2" />
                    <circle cx="8.5" cy="7" r="4" stroke="#00ffff" strokeWidth="2" />
                    <path d="M20 8v6M23 11l-3 3-3-3" stroke="#00ffff" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.analyticDetails}>
                  <div style={styles.analyticLabel}>Traffic Conditions</div>
                  <div style={styles.analyticValue}>Moderate</div>
                  <div style={styles.analyticSubtext}>15 min delay expected in Denver</div>
                </div>
              </div>
              <div style={styles.tripAnalyticItem}>
                <div style={styles.analyticIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 14.76V3.5a2.5 2.5 0  0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="#ff00ff" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.analyticDetails}>
                  <div style={styles.analyticLabel}>Weather Alert</div>
                  <div style={styles.analyticValue}>Clear</div>
                  <div style={styles.analyticSubtext}>No weather delays expected</div>
                </div>
              </div>
              <div style={styles.tripAnalyticItem}>
                <div style={styles.analyticIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="#00ff41" strokeWidth="2" />
                    <line x1="8" y1="21" x2="16" y2="21" stroke="#00ff41" strokeWidth="2" />
                    <line x1="12" y1="17" x2="12" y2="21" stroke="#00ff41" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.analyticDetails}>
                  <div style={styles.analyticLabel}>Trimble Integration</div>
                  <div style={styles.analyticValue}>Active</div>
                  <div style={styles.analyticSubtext}>Real-time GPS & route guidance</div>
                </div>
              </div>
              <div style={styles.tripAnalyticItem}>
                <div style={styles.analyticIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="3" stroke="#ff00ff" strokeWidth="2" />
                    <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" stroke="#ff00ff" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.analyticDetails}>
                  <div style={styles.analyticLabel}>Alt Routes</div>
                  <div style={styles.analyticValue}>2 Available</div>
                  <div style={styles.analyticSubtext}>+12 min, +31 min options</div>
                </div>
              </div>
              {/* Update the Advanced Trip Analytics section */}
              <div style={styles.tripAnalyticItem}>
                <div style={styles.analyticIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="21" r="1" stroke="#00ffff" strokeWidth="2" />
                    <circle cx="20" cy="21" r="1" stroke="#00ffff" strokeWidth="2" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" stroke="#00ffff" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.analyticDetails}>
                  <div style={styles.analyticLabel}>Fuel Stops</div>
                  <div style={styles.analyticValue}>3 Planned</div>
                  <div style={styles.analyticSubtext}>Next: 247 miles (4.2 hrs)</div>
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
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#00ff41" strokeWidth="2" />
                    <polyline points="14,2 14,8 20,8" stroke="#00ff41" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.documentInfo}>
                  <div style={styles.documentName}>Bill of Lading</div>
                  <div style={styles.documentStatus}>Signed & Verified</div>
                </div>
                <button
                  style={styles.documentAction}
                  onClick={() => handleViewDocument('bol', selectedShipment)}>
                  View
                </button>
              </div>

              <div style={styles.documentItem}>
                <div style={styles.documentIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="7" width="20" height="15" rx="2" ry="2" stroke="#00ffff" strokeWidth="2" />
                    <polyline points="17,2 12,7 7,2" stroke="#00ffff" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.documentInfo}>
                  <div style={styles.documentName}>Cargo Photos</div>
                  <div style={styles.documentStatus}>Loading & Seal Images</div>
                </div>
                <button
                  style={styles.documentAction}
                  onClick={() => handleViewDocument('photos', selectedShipment)}>
                  View
                </button>
              </div>

              <div style={styles.documentItem}>
                <div style={styles.documentIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M14 14.76V3.5a2.5 2.5 0  0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="#ff00ff" strokeWidth="2" />
                  </svg>
                </div>
                <div style={styles.documentInfo}>
                  <div style={styles.documentName}>Temperature Log</div>
                  <div style={styles.documentStatus}>Continuous Monitoring</div>
                </div>
                <button
                  style={styles.documentAction}
                  onClick={() => handleViewDocument('temperature', selectedShipment)}>
                  View
                </button>
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
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" />
            </svg>
          </button>
          <button style={styles.headerButton} onClick={onLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" />
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
            <polygon points="3 6 9 9 15 15 21 12 21 18 15 21 9 15 3 12" stroke="currentColor" strokeWidth="2" />
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
              <rect x="1" y="3" width="15" height="13" stroke="currentColor" strokeWidth="2" />
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" stroke="currentColor" strokeWidth="2" />
              <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
              <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
            </svg>
            Shipment Details
          </button>
        )}
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {activeView === 'fleet' ? renderFleetOverview() : renderShipmentDetails()}
      </div>

      {showDocumentViewer && (
        <DocumentViewer
          document={currentDocument}
          type={documentType}
          onClose={handleCloseDocumentViewer}
        />
      )}

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap');
          @keyframes matrixFall {
            0% { transform: translateY(-100%); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(100vh); opacity: 0; }
          }
          @keyframes slideIn {
            from { transform: translate(-50%, -120%) scale(0.8); opacity: 0; }
            to { transform: translate(-50%, -120%) scale(1); opacity: 1; }
          }
          @keyframes glow {
            0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 65, 0.3); }
            50% { box-shadow: 0 0 25px rgba(0, 255, 65, 0.6); }
          }
          /* Steady glow instead of pulse */
          .steady-glow {
            animation: glow 4s ease-in-out infinite;
          }
          /* Tooltip hover effects */
          button:hover {
            opacity: 0.8;
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
  statSubLabel: {
    fontSize: '0.75rem',
    color: '#7aa', // subtle, readable on dark background
    marginTop: '2px',
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
  // Update the mapControl style in CustomerDashboard.js:
  mapControl: {
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
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
    minWidth: '80px', // Add minimum width
    justifyContent: 'center', // Center content
    ':hover': {
      backgroundColor: 'rgba(0, 255, 65, 0.2)',
      borderColor: '#00ff41',
    },
  },
  mapContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    marginBottom: '1rem',
    position: 'relative', // Added for positioning context
    overflow: 'hidden',          // ⛔️ prevents any child overlays from spilling out
    isolation: 'isolate',        // makes this a new stacking context
  },
  // New viewport to clip map + overlays
  mapViewport: {
    position: 'relative',
    overflow: 'hidden',          // ⛔️ hard-clip markers, tooltips, legend to the map area
    borderRadius: '8px',         // keep clipping consistent with the map’s rounded corners
    isolation: 'isolate',        // ensure children can't stack over siblings outside
    contain: 'layout paint',     // perf + guarantees paint stays inside
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
  enhancedRouteMetrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginTop: '1rem',
  },
  enhancedRouteMetric: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
    border: '1px solid rgba(0, 255, 65, 0.2)',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
  },
  routeMetricIcon: {
    width: '40px',
    height: '40px',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  routeMetricInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
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
  // Update the existing fleetOverlay style
  fleetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none', // Allow map interaction by default
    zIndex: 10,
  },
  // Add new style for interactive overlay
  fleetOverlayInteractive: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none', // Allow map interaction
    zIndex: 1,                   // stays above the canvas but below anything outside the viewport
  },
  truckMarker: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'auto',
    transform: 'translate(-50%, -50%)',
  },
  // Update truck marker to be interactive
  truckMarkerGeo: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    pointerEvents: 'auto', // Enable truck interaction
    zIndex: 2,                   // still above the map tiles/route, but clipped by the viewport
  },
  truckIcon: {
    width: '40px',
    height: '40px',
    transition: 'all 0.3s ease',
  },
  smallTruckIcon: {
    width: '28px',
    height: '28px',
    transition: 'all 0.3s ease',
  },
  truckLabel: {
    fontSize: '8px',
    fontWeight: 600,
    textAlign: 'center',
    marginTop: '2px',
    textShadow: '0 0 2px rgba(0,0,0,0.8)',
  },
  pulseRing: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50px',
    height: '50px',
    border: '2px solid #00ff41',
    borderRadius: '50%',
    opacity: 0.6,
    pointerEvents: 'none',
  },
  steadyGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60px',
    height: '60px',
    border: '2px solid #00ff41',
    borderRadius: '50%',
    opacity: 0.6,
    pointerEvents: 'none',
    boxShadow: '0 0 15px rgba(0, 255, 65, 0.5)',
  },
  shipmentInfoBubble: {
    position: 'absolute',
    top: '-50px',
    left: '30px',
    width: '200px',
    zIndex: 20,
    pointerEvents: 'auto',
  },
  infoBubbleContent: {
    background: 'rgba(0, 255, 65, 0.15)',
    border: '2px solid #00ff41',
    borderRadius: '12px',
    padding: '10px',
    backdropFilter: 'blur(10px)',
  },
  bubbleTitle: {
    color: '#00ff41',
    fontSize: '11px',
    fontWeight: 700,
    marginBottom: '4px',
  },
  bubbleLocation: {
    color: '#e0e0e0',
    fontSize: '9px',
    marginBottom: '2px',
  },
  bubbleStatus: {
    color: '#00ffff',
    fontSize: '9px',
    marginBottom: '2px',
  },
  bubbleTemp: {
    color: '#ff00ff',
    fontSize: '9px',
    marginBottom: '8px',
  },
  bubbleButton: {
    width: '100%',
    padding: '6px',
    backgroundColor: '#00ff41',
    color: '#0d0208',
    border: 'none',
    borderRadius: '9px',
    fontSize: '9px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  // Update legend to be interactive
  mapLegend: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    width: '170px',
    background: 'rgba(0, 0, 0, 0.7)',
    border: '1px solid #00ff41',
    borderRadius: '8px',
    padding: '10px',
    pointerEvents: 'auto', // Keep legend interactive
  },
  legendTitle: {
    color: '#00ff41',
    fontSize: '12px',
    fontWeight: 700,
    marginBottom: '8px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px',
  },
  legendIcon: {
    width: '24px',
    height: '24px',
  },
  legendText: {
    color: '#e0e0e0',
    fontSize: '9px',
  },
  legendTextInactive: {
    color: '#666',
    fontSize: '9px',
  },
  legendPulse: {
    width: '20px',
    height: '20px',
    border: '2px solid #00ff41',
    borderRadius: '50%',
    position: 'relative',
  },
  // Update tooltip to be interactive
  dynamicTooltip: {
    position: 'absolute',
    zIndex: 1000,
    pointerEvents: 'auto', // Keep tooltip interactive
    transform: 'translate(-50%, -120%)',
    minWidth: '280px',
    maxWidth: '320px',
    animation: 'slideIn 0.3s ease-out',
  },
  tooltipContent: {
    background: 'rgba(13, 2, 8, 0.95)',
    border: '2px solid #00ff41',
    borderRadius: '12px',
    backdropFilter: 'blur(15px)',
    boxShadow: '0 8px 32px rgba(0, 255, 65, 0.3)',
    overflow: 'hidden',
  },
  tooltipHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(0, 255, 65, 0.2)',
    background: 'rgba(0, 255, 65, 0.1)',
  },
  tooltipTitle: {
    color: '#00ff41',
    fontSize: '14px',
    fontWeight: 700,
    fontFamily: 'Orbitron, sans-serif',
  },
  tooltipClose: {
    background: 'none',
    border: 'none',
    color: '#00ff41',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: '0',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
  },
  tooltipBody: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  tooltipRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  tooltipIcon: {
    fontSize: '14px',
    width: '18px',
    flexShrink: 0,
  },
  tooltipText: {
    color: '#e0e0e0',
    fontSize: '12px',
    lineHeight: '1.4',
  },
  tooltipProgress: {
    marginTop: '8px',
  },
  tooltipProgressLabel: {
    color: '#00ffff',
    fontSize: '11px',
    fontWeight: 600,
    marginBottom: '4px',
    display: 'block',
  },
  tooltipProgressBar: {
    width: '100%',
    height: '6px',
    backgroundColor: 'rgba(0, 255, 65, 0.2)',
    borderRadius: '3px',
    overflow: 'hidden',
  },
  tooltipProgressFill: {
    height: '100%',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
  },
  tooltipFooter: {
    padding: '12px 16px',
    borderTop: '1px solid rgba(0, 255, 65, 0.2)',
    background: 'rgba(0, 255, 65, 0.05)',
  },
  tooltipViewButton: {
    width: '100%',
    padding: '8px 16px',
    backgroundColor: '#00ff41',
    color: '#0d0208',
    border: 'none',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tripAnalyticsCard: {
    backgroundColor: 'rgba(0, 255, 65, 0.03)',
    border: '1px solid rgba(0, 255, 65, 0.15)',
    borderRadius: '12px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
  },
  tripAnalyticsTitle: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#00ffff',
    margin: '0 0 1rem 0',
    display: 'flex',
    alignItems: 'center',
  },
  tripAnalyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
  },
  tripAnalyticItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(0, 255, 65, 0.1)',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
  },
  analyticIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  analyticDetails: {
    flex: 1,
  },
  analyticLabel: {
    fontSize: '0.9rem',
    color: '#e0e0e0',
    fontWeight: 500,
    marginBottom: '0.25rem',
  },
  analyticValue: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#00ff41',
    marginBottom: '0.25rem',
  },
  analyticSubtext: {
    fontSize: '0.7rem',
    color: '#666',
  },
};

export default CustomerDashboard;
