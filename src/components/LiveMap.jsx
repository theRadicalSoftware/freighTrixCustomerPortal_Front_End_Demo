import React, { useEffect, useRef, useState } from 'react';
import { RouteUtils } from '../utils/routeUtils';

const LiveMap = ({ shipment, height = 300, showRoute = true, isFleetView = false }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [mapKey, setMapKey] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  const API_KEY = "E3D28D4387DBD94E9DE9FA6C43841A62";

  useEffect(() => {
    // Load Trimble Maps CSS and JS if not already loaded
    if (!window.TrimbleMaps) {
      // Load CSS first
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://maps-sdk.trimblemaps.com/v4/trimblemaps-4.2.5.css';
      document.head.appendChild(cssLink);

      // Load JavaScript
      const script = document.createElement('script');
      script.src = 'https://maps-sdk.trimblemaps.com/v4/trimblemaps-4.2.5.js';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        // Set API key after script loads
        if (window.TrimbleMaps) {
          window.TrimbleMaps.setAPIKey(API_KEY);
          setIsLoaded(true);
        }
      };
      script.onerror = () => {
        console.error('Failed to load Trimble Maps');
        setIsLoaded(false);
      };
      document.head.appendChild(script);
    } else {
      // Already loaded, just set API key
      window.TrimbleMaps.setAPIKey(API_KEY);
      setIsLoaded(true);
    }
  }, []);

  // FIXED: Use PC*MILER REST API directly (like your working ETACalculator)
  const getOptimizedRoute = async (origin, destination) => {
    setIsLoadingRoute(true);
    
    try {
      console.log('🛣️ Getting road-following route using PC*MILER REST API...');
      console.log('Origin:', origin);
      console.log('Destination:', destination);

      // Use PC*MILER Route Path API (same as your working backend)
      const routePathUrl = 'https://pcmiler.alk.com/apis/rest/v1.0/Service.svc/route/routePath';
      
      const pathParams = new URLSearchParams({
        authToken: API_KEY,
        stops: `${origin.lng},${origin.lat};${destination.lng},${destination.lat}`,
        vehType: '0',          // 0 = Truck (critical for truck routing)
        routeType: '0',        // 0 = Practical (road-following, not straight line)
        vehDimUnits: '0',      // English units
        vehHeight: '162',      // 13.5 feet in inches
        vehLength: '636',      // 53 feet in inches  
        vehWidth: '102',       // 8.5 feet in inches
        vehWeight: '80000',    // 80,000 lbs
        axles: '5',            // 5 axles
        distUnits: '0',        // Miles
        region: '4'            // North America
      });

      console.log('PC*MILER Request URL:', `${routePathUrl}?${pathParams}`);

      const pathResponse = await fetch(`${routePathUrl}?${pathParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('PC*MILER Response Status:', pathResponse.status);

      if (!pathResponse.ok) {
        throw new Error(`PC*MILER routePath failed: ${pathResponse.status} ${pathResponse.statusText}`);
      }

      const pathData = await pathResponse.json();
      console.log('PC*MILER routePath Response:', pathData);

      // Extract geometry coordinates
      let coordinates = [];
      if (pathData && pathData.Geometry) {
        if (pathData.Geometry.type === 'LineString') {
          coordinates = pathData.Geometry.coordinates;
        } else if (pathData.Geometry.type === 'MultiLineString') {
          // Flatten MultiLineString to single coordinate array
          coordinates = pathData.Geometry.coordinates.reduce((acc, lineString) => {
            acc.push(...lineString);
            return acc;
          }, []);
        }
      }

      if (!coordinates.length) {
        throw new Error('No route coordinates returned from PC*MILER');
      }

      console.log(`✅ PC*MILER returned route with ${coordinates.length} coordinate points`);

      // Also get route reports for distance/time info
      let distance = null;
      let time = null;

      try {
        const reportsUrl = 'https://pcmiler.alk.com/apis/rest/v1.0/Service.svc/route/routeReports';
        
        const reportsPayload = {
          ReportRoutes: [{
            ReportTypes: [{ __type: "MileageReportType:http://pcmiler.alk.com/APIs/v1.0" }],
            Stops: [
              { Coords: { Lat: origin.lat, Lon: origin.lng }, Region: 4 },
              { Coords: { Lat: destination.lat, Lon: destination.lng }, Region: 4 }
            ],
            Options: {
              DistanceUnits: 0,  // Miles
              RoutingType: 0,    // Practical
              VehicleType: 0,    // Truck
              TruckCfg: {
                Height: 13.5,    // feet
                Weight: 40,      // tons (80k lbs)
                FuelEconomy: 6.5
              }
            }
          }]
        };

        const reportsResponse = await fetch(`${reportsUrl}?authToken=${API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(reportsPayload)
        });

        if (reportsResponse.ok) {
          const reportsData = await reportsResponse.json();
          console.log('PC*MILER Reports Response:', reportsData);
          
          if (reportsData && reportsData.length > 0) {
            const mileageData = reportsData[0].ReportLines?.[reportsData[0].ReportLines.length - 1];
            if (mileageData) {
              distance = parseFloat(mileageData.TMiles) || null;
              time = parseFloat(mileageData.THours) || null;
              console.log(`Route stats: ${distance} miles, ${time} hours`);
            }
          }
        }
      } catch (reportsError) {
        console.warn('Route reports failed (non-critical):', reportsError);
      }

      setIsLoadingRoute(false);

      return {
        geometry: {
          type: 'LineString',
          coordinates: coordinates
        },
        coordinates: coordinates,
        distance: distance,
        time: time
      };

    } catch (error) {
      console.error('❌ PC*MILER routing failed:', error);
      setIsLoadingRoute(false);
      
      // Return null to trigger fallback
      return null;
    }
  };

  // Function to calculate current position along route using RouteUtils
  const getCurrentPositionOnRoute = (routeCoordinates, progress) => {
    if (!routeCoordinates || routeCoordinates.length === 0) return null;
    
    try {
      // Use RouteUtils for improved position calculation
      const position = RouteUtils.getCurrentPositionOnRoute(routeCoordinates, progress, true);
      if (position && position.lng && position.lat) {
        return new window.TrimbleMaps.LngLat(position.lng, position.lat);
      }
    } catch (error) {
      console.warn('RouteUtils position calculation failed, using fallback:', error);
    }

    // Fallback to original implementation
    const progressDecimal = progress / 100;
    const targetIndex = Math.floor(progressDecimal * (routeCoordinates.length - 1));
    const nextIndex = Math.min(targetIndex + 1, routeCoordinates.length - 1);
    
    if (targetIndex === nextIndex) {
      return new window.TrimbleMaps.LngLat(
        routeCoordinates[targetIndex][0], 
        routeCoordinates[targetIndex][1]
      );
    }
    
    // Interpolate between points for smoother positioning
    const segmentProgress = (progressDecimal * (routeCoordinates.length - 1)) - targetIndex;
    const currentCoord = routeCoordinates[targetIndex];
    const nextCoord = routeCoordinates[nextIndex];
    
    const lng = currentCoord[0] + (nextCoord[0] - currentCoord[0]) * segmentProgress;
    const lat = currentCoord[1] + (nextCoord[1] - currentCoord[1]) * segmentProgress;
    
    return new window.TrimbleMaps.LngLat(lng, lat);
  };

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !shipment || !window.TrimbleMaps) return;

    // Clean up existing map
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Add dark mode class to the container
    mapRef.current.className = 'trimblemaps-dark';

    const initializeMap = async () => {
      // Route-specific coordinates based on shipment
      let originCoords, destCoords;
      
      if (shipment.origin.includes('Chicago') && shipment.destination.includes('Denver')) {
        originCoords = new window.TrimbleMaps.LngLat(-87.6298, 41.8781); // Chicago
        destCoords = new window.TrimbleMaps.LngLat(-104.9903, 39.7392); // Denver
      } else if (shipment.origin.includes('Houston') && shipment.destination.includes('Miami')) {
        originCoords = new window.TrimbleMaps.LngLat(-95.3698, 29.7604); // Houston
        destCoords = new window.TrimbleMaps.LngLat(-80.1918, 25.7617); // Miami
      } else if (shipment.origin.includes('Los Angeles') && shipment.destination.includes('Seattle')) {
        originCoords = new window.TrimbleMaps.LngLat(-118.2437, 34.0522); // Los Angeles
        destCoords = new window.TrimbleMaps.LngLat(-122.3321, 47.6062); // Seattle
      } else if (shipment.origin.includes('Atlanta') && shipment.destination.includes('Charlotte')) {
        originCoords = new window.TrimbleMaps.LngLat(-84.3880, 33.7490); // Atlanta
        destCoords = new window.TrimbleMaps.LngLat(-80.8431, 35.2271); // Charlotte
      } else {
        // Default coordinates
        originCoords = new window.TrimbleMaps.LngLat(-87.6298, 41.8781);
        destCoords = new window.TrimbleMaps.LngLat(-104.9903, 39.7392);
      }

      console.log('🗺️ Getting route from', originCoords, 'to', destCoords);

      // Get optimized route with road-following
      let currentRoute = null;
      if (showRoute) {
        currentRoute = await getOptimizedRoute(originCoords, destCoords);
        setRouteData(currentRoute);
        
        if (currentRoute) {
          console.log('✅ Successfully got road-following route with', currentRoute.coordinates?.length, 'points');
        } else {
          console.warn('⚠️ Failed to get road-following route, will show fallback straight line');
        }
      }

      // Calculate current position
      let currentPosition;
      if (currentRoute && currentRoute.coordinates) {
        currentPosition = getCurrentPositionOnRoute(currentRoute.coordinates, shipment.progress);
      } else {
        // Fallback to simple interpolation
        const progress = shipment.progress / 100;
        const lng = originCoords.lng + (destCoords.lng - originCoords.lng) * progress;
        const lat = originCoords.lat + (destCoords.lat - originCoords.lat) * progress;
        currentPosition = new window.TrimbleMaps.LngLat(lng, lat);
      }

      // Calculate estimated arrival using RouteUtils
      let estimatedArrival = null;
      if (currentRoute && currentRoute.distance) {
        try {
          estimatedArrival = RouteUtils.getEstimatedArrival(currentRoute, shipment.progress, 67);
        } catch (error) {
          console.warn('Error calculating estimated arrival:', error);
        }
      }

      try {
        // Initialize Trimble Maps with appropriate center for fleet view
        let mapCenter, mapZoom;
          
        if (isFleetView) {
          // Center on US for fleet overview
          mapCenter = new window.TrimbleMaps.LngLat(-98.5795, 39.8283);
          mapZoom = 4;
        } else {
          mapCenter = currentPosition;
          mapZoom = 6;
        }
        const map = new window.TrimbleMaps.Map({
          container: mapRef.current,
          style: window.TrimbleMaps.Common.Style.BASIC,
          center: mapCenter,
          zoom: mapZoom
        });

        // Store map reference for zoom controls (add this line)
        if (isFleetView) {
          window.currentFleetMap = map;
        }

        // Apply dark theme styling
        map.on('load', () => {
          const mapCanvas = map.getCanvas();
          if (mapCanvas) {
            mapCanvas.style.filter = 'brightness(0.7) contrast(1.2) saturate(0.8)';
          }

          // Only add route and markers if not in fleet view
          if (!isFleetView) {
            // Add route if we have route data
            if (showRoute && currentRoute && currentRoute.coordinates) {
              try {
                console.log('📍 Adding road-following route to map with', currentRoute.coordinates.length, 'coordinates');
                
                // Add the complete route
                map.addSource('optimized-route', {
                  type: 'geojson',
                  data: {
                    type: 'Feature',
                    properties: {},
                    geometry: currentRoute.geometry
                  }
                });

                // Route outline for better visibility
                map.addLayer({
                  id: 'route-outline',
                  type: 'line',
                  source: 'optimized-route',
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': '#000000',
                    'line-width': 8,
                    'line-opacity': 0.4
                  }
                });

                // Main route line
                map.addLayer({
                  id: 'route-main',
                  type: 'line',
                  source: 'optimized-route',
                  layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                  },
                  paint: {
                    'line-color': shipment.onTime ? '#00ff41' : '#ff0040',
                    'line-width': 6,
                    'line-opacity': 0.8
                  }
                });

                // Completed portion of route (if in transit)
                if (shipment.progress > 0 && shipment.progress < 100) {
                  const completedCoordinates = currentRoute.coordinates.slice(
                    0, 
                    Math.floor((shipment.progress / 100) * currentRoute.coordinates.length)
                  );
                  
                  if (completedCoordinates.length > 1) {
                    map.addSource('completed-route', {
                      type: 'geojson',
                      data: {
                        type: 'Feature',
                        properties: {},
                        geometry: {
                          type: 'LineString',
                          coordinates: completedCoordinates
                        }
                      }
                    });

                    map.addLayer({
                      id: 'completed-route',
                      type: 'line',
                      source: 'completed-route',
                      layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                      },
                      paint: {
                        'line-color': '#00ffff',
                        'line-width': 4,
                        'line-opacity': 0.9
                      }
                    });
                  }
                }

              } catch (error) {
                console.warn('Error adding optimized route to map:', error);
              }
            } else if (showRoute) {
              console.log('🔄 No route data, showing fallback straight line');
              // Fallback to simple line if routing failed
              map.addSource('fallback-route', {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'LineString',
                    coordinates: [
                      [originCoords.lng, originCoords.lat],
                      [currentPosition.lng, currentPosition.lat],
                      [destCoords.lng, destCoords.lat]
                    ]
                  }
                }
              });

              map.addLayer({
                id: 'fallback-route',
                type: 'line',
                source: 'fallback-route',
                layout: {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                paint: {
                  'line-color': shipment.onTime ? '#00ff41' : '#ff0040',
                  'line-width': 4,
                  'line-opacity': 0.8,
                  'line-dasharray': [5, 5]
                }
              });
            }

            // Add markers
            try {
              // Origin marker
              const originMarker = new window.TrimbleMaps.Marker({
                color: '#00ffff',
                scale: 0.8
              })
              .setLngLat(originCoords)
              .setPopup(new window.TrimbleMaps.Popup({ 
                offset: 25,
                className: 'dark-popup'
              }).setHTML(`
                <div style="background: rgba(13, 2, 8, 0.95); color: #e0e0e0; padding: 10px; border-radius: 8px; border: 1px solid #00ffff;">
                  <strong style="color: #00ffff;">Origin</strong><br/>
                  ${shipment.origin}<br/>
                  <small>Departure: Dec 13, 8:00 AM</small>
                  ${currentRoute ? `<br/><small>Route Distance: ${currentRoute.distance ? Math.round(currentRoute.distance) + ' miles' : 'N/A'}</small>` : ''}
                  ${currentRoute ? `<br/><small>Route Points: ${currentRoute.coordinates ? currentRoute.coordinates.length : 'N/A'}</small>` : ''}
                  ${currentRoute ? '<br/><small style="color: #00ff41;">✅ Road-Following Route</small>' : '<br/><small style="color: #ff6b6b;">⚠️ Straight-Line Fallback</small>'}
                </div>
              `))
              .addTo(map);

              // Current position marker (truck)
              const currentMarker = new window.TrimbleMaps.Marker({
                color: shipment.onTime ? '#00ff41' : '#ff0040',
                scale: 1.2
              })
              .setLngLat(currentPosition)
              .setPopup(new window.TrimbleMaps.Popup({ 
                offset: 25,
                className: 'dark-popup'
              }).setHTML(`
                <div style="background: rgba(13, 2, 8, 0.95); color: #e0e0e0; padding: 10px; border-radius: 8px; border: 1px solid ${shipment.onTime ? '#00ff41' : '#ff0040'};">
                  <strong style="color: ${shipment.onTime ? '#00ff41' : '#ff0040'};">${shipment.truck}</strong><br/>
                  Driver: ${shipment.driver}<br/>
                  Location: ${shipment.currentLocation}<br/>
                  Speed: 67 mph<br/>
                  Temperature: ${shipment.temperature}<br/>
                  Progress: ${shipment.progress}%<br/>
                  Status: <span style="color: ${shipment.onTime ? '#00ff41' : '#ff0040'};">${shipment.onTime ? 'On Schedule' : 'Delayed'}</span>
                  ${estimatedArrival ? `<br/><small>Remaining: ${estimatedArrival.remainingDistance} miles, ${estimatedArrival.remainingTime} min</small>` : ''}
                </div>
              `))
              .addTo(map);

              // Destination marker
              const destMarker = new window.TrimbleMaps.Marker({
                color: '#ff00ff',
                scale: 0.8
              })
              .setLngLat(destCoords)
              .setPopup(new window.TrimbleMaps.Popup({ 
                offset: 25,
                className: 'dark-popup'
              }).setHTML(`
                <div style="background: rgba(13, 2, 8, 0.95); color: #e0e0e0; padding: 10px; border-radius: 8px; border: 1px solid #ff00ff;">
                  <strong style="color: #ff00ff;">Destination</strong><br/>
                  ${shipment.destination}<br/>
                  <small>ETA: ${shipment.eta}</small>
                  ${currentRoute ? `<br/><small>Est. Drive Time: ${currentRoute.time ? Math.round(currentRoute.time / 60) + ' hours' : 'N/A'}</small>` : ''}
                  ${estimatedArrival ? `<br/><small>Updated ETA: ${estimatedArrival.eta}</small>` : ''}
                </div>
              `))
              .addTo(map);

            } catch (error) {
              console.warn('Error adding markers:', error);
            }
          } else {
            // For fleet view, trigger truck positioning
            window.positionFleetTrucks = () => {
              setTimeout(() => {
                const trucks = document.querySelectorAll('[data-shipment-id]');
                trucks.forEach(truck => {
                  const lat = parseFloat(truck.getAttribute('data-lat'));
                  const lng = parseFloat(truck.getAttribute('data-lng'));
                            
                  if (lat && lng) {
                    try {
                      const point = map.project([lng, lat]);
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
              }, 100);
            };
        
            // Position trucks initially
            window.positionFleetTrucks();
        
            // Reposition on map move/zoom
            map.on('move', window.positionFleetTrucks);
            map.on('zoom', window.positionFleetTrucks);
          }
        });

        // Handle map errors
        map.on('error', (e) => {
          console.warn('Trimble Maps error:', e);
        });

        mapInstanceRef.current = map;

      } catch (error) {
        console.error('Error initializing Trimble Maps:', error);
      }
    };

    initializeMap();

    return () => {
      if (mapInstanceRef.current) {
        try {
          // Clean up map event listeners for fleet view
          if (isFleetView && window.positionFleetTrucks) {
            mapInstanceRef.current.off('move', window.positionFleetTrucks);
            mapInstanceRef.current.off('zoom', window.positionFleetTrucks);
            delete window.positionFleetTrucks;
          }
    
          // Clean up map reference
          if (isFleetView && window.currentFleetMap) {
            delete window.currentFleetMap;
          }
    
          mapInstanceRef.current.remove();
        } catch (error) {
          console.warn('Error removing map:', error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, [isLoaded, shipment?.id, mapKey, showRoute, isFleetView]);

  useEffect(() => {
    if (shipment) {
      setMapKey(prev => prev + 1);
    }
  }, [shipment?.id]);

  // Add custom CSS for dark theme popups
  useEffect(() => {
    let style = document.getElementById('trimble-dark-theme');
    if (!style) {
      style = document.createElement('style');
      style.id = 'trimble-dark-theme';
      document.head.appendChild(style);
    }
    
    style.textContent = `
      .trimblemaps-dark { background: #1a1a1a !important; }
      .dark-popup .trimblemaps-popup-content {
        background: rgba(13, 2, 8, 0.95) !important;
        color: #e0e0e0 !important;
        border: 1px solid rgba(0, 255, 65, 0.3) !important;
        border-radius: 8px !important;
      }
      .dark-popup .trimblemaps-popup-tip { border-top-color: rgba(13, 2, 8, 0.95) !important; }
      .trimblemaps-ctrl-group {
        background: rgba(13, 2, 8, 0.9) !important;
        border: 1px solid rgba(0, 255, 65, 0.3) !important;
      }
      .trimblemaps-ctrl button {
        background: rgba(13, 2, 8, 0.9) !important;
        color: #00ff41 !important;
      }
      .trimblemaps-ctrl button:hover { background: rgba(0, 255, 65, 0.1) !important; }
      .route-loading {
        position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.8);
        color: #00ff41; padding: 8px 12px; border-radius: 4px; font-size: 12px; z-index: 1000;
      }
    `;
  }, []);

  if (!shipment) {
    return (
      <div style={{ 
        height, 
        background: 'rgba(0,0,0,0.3)', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999'
      }}>
        No shipment data available
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ 
        height, 
        background: 'rgba(0,0,0,0.3)', 
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999'
      }}>
        Loading Trimble Maps...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      {isLoadingRoute && !isFleetView && (
        <div className="route-loading">
          🛣️ Getting road-following route via PC*MILER...
        </div>
      )}
      <div 
        ref={mapRef} 
        style={{ 
          height, 
          borderRadius: '8px', 
          overflow: 'hidden', 
          border: '1px solid rgba(0, 255, 65, 0.2)'
        }}
      />
    </div>
  );
};

export default LiveMap;