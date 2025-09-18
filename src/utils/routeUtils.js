// /utils/routeUtils.js

// PC*MILER + Trimble Maps helpers for front-end demos (no Lambda)
const PCM_BASE = 'https://pcmiler.alk.com/apis/rest/v1.0/Service.svc';

function toStopsParam(originLngLat, destLngLat) {
  // PC*MILER expects "lon,lat;lon,lat"
  return `${originLngLat.lng},${originLngLat.lat};${destLngLat.lng},${destLngLat.lat}`;
}

// Flatten MultiLineString to a single LineString coordinate array for drawing
function flattenGeometry(geometry) {
  if (!geometry) return null;
  if (geometry.type === 'LineString') return geometry.coordinates;
  if (geometry.type === 'MultiLineString') {
    // stitch the segments end-to-end
    return geometry.coordinates.reduce((acc, seg) => (acc.push(...seg), acc), []);
  }
  return null;
}

async function fetchPCMRoutePath({ origin, dest, apiKey, opts = {} }) {
  const params = new URLSearchParams({
    authToken: apiKey,
    stops: toStopsParam(origin, dest),
    vehType: '0',          // Truck
    vehDimUnits: '0',      // English (inches)
    vehHeight: '162',      // 13.5 ft
    vehLength: '636',      // 53 ft
    vehWidth: '102',       // 102 in
    vehWeight: '80000',    // lbs (string expected)
    axles: '5',
    routeType: (opts.routeType ?? '0'), // 0=Practical, 2=Fastest
    useTraffic: (opts.useTraffic ?? true).toString(),
    distUnits: '0'         // miles
  });

  const url = `${PCM_BASE}/route/routePath?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`routePath failed: ${res.status}`);
  const data = await res.json();
  const coordinates = flattenGeometry(data?.Geometry);
  if (!coordinates) throw new Error('routePath: no geometry returned');
  return {
    geometry: data.Geometry,
    coordinates
  };
}

// Optional: mileage/time
async function fetchPCMMileage({ origin, dest, apiKey, opts = {} }) {
  const params = new URLSearchParams({
    authToken: apiKey,
    stops: toStopsParam(origin, dest),
    reports: 'Mileage',    // only need miles/time
    vehType: '0',
    vehDimUnits: '0',
    vehHeight: '162',
    vehLength: '636',
    vehWidth: '102',
    vehWeight: '80000',
    axles: '5',
    routeType: (opts.routeType ?? '0'),
    useTraffic: (opts.useTraffic ?? true).toString(),
    distUnits: '0'
  });

  const url = `${PCM_BASE}/route/routeReports?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`routeReports failed: ${res.status}`);
  const data = await res.json();

  // The GET routeReports response returns a list of reports; find Mileage
  const mileageReport =
    (data?.Reports && data.Reports.find(r => (r.Report || r.Type) === 'Mileage')) ||
    (data?.ReportRoutes?.[0]?.Reports && data.ReportRoutes[0].Reports.find(r => (r.Report || r.Type) === 'Mileage'));

  return {
    distanceMiles: mileageReport?.TMiles ?? mileageReport?.TotalMiles ?? null,
    timeMinutes: mileageReport?.TTime ?? mileageReport?.TotalTime ?? null
  };
}

export const RouteUtils = {
  TRUCK_SPECS: {
    vehicleType: 'truck',
    axles: 5,
    weightKgs: 36000,
    lengthMeters: 16.15,
    widthMeters: 2.59,
    heightMeters: 4.11,
    maxSpeed: 105
  },

  // New: use PC*MILER REST for an actual truck-legal route path
  async getRouteViaPCM(originLngLat, destLngLat, apiKey, options = {}) {
    const path = await fetchPCMRoutePath({
      origin: originLngLat,
      dest: destLngLat,
      apiKey,
      opts: options
    });

    // Optionally enrich with miles/time
    let miles = null, mins = null;
    try {
      const m = await fetchPCMMileage({ origin: originLngLat, dest: destLngLat, apiKey, opts: options });
      miles = m.distanceMiles;
      mins = m.timeMinutes;
    } catch {
      // non-fatal in demo
    }

    return {
      geometry: path.geometry,
      coordinates: path.coordinates,
      distance: miles,
      time: mins
    };
  },

  // ------- keep your existing helpers below (bearing, ETA, etc.) -------
  getCurrentPositionOnRoute(routeCoordinates, progress, smoothing = true) {
    if (!routeCoordinates || routeCoordinates.length === 0) return null;
    const progressDecimal = Math.max(0, Math.min(1, progress / 100));

    if (progressDecimal === 0) {
      return { lng: routeCoordinates[0][0], lat: routeCoordinates[0][1] };
    }
    if (progressDecimal === 1) {
      const lastIndex = routeCoordinates.length - 1;
      return { lng: routeCoordinates[lastIndex][0], lat: routeCoordinates[lastIndex][1] };
    }

    // distance-weighted interpolation
    const distances = this.calculateSegmentDistances(routeCoordinates);
    const total = distances.reduce((s, d) => s + d, 0);
    const target = total * progressDecimal;
    let acc = 0;
    for (let i = 0; i < distances.length; i++) {
      if (acc + distances[i] >= target) {
        const segP = (target - acc) / distances[i];
        const a = routeCoordinates[i];
        const b = routeCoordinates[i + 1];
        return { lng: a[0] + (b[0] - a[0]) * segP, lat: a[1] + (b[1] - a[1]) * segP };
      }
      acc += distances[i];
    }
    const lastIndex = routeCoordinates.length - 1;
    return { lng: routeCoordinates[lastIndex][0], lat: routeCoordinates[lastIndex][1] };
  },

  // Calculate distances between route segments
  calculateSegmentDistances(coordinates) {
    const distances = [];
    for (let i = 0; i < coordinates.length - 1; i++) {
      const distance = this.calculateDistance(
        coordinates[i][1], coordinates[i][0],
        coordinates[i + 1][1], coordinates[i + 1][0]
      );
      distances.push(distance);
    }
    return distances;
  },

  // Calculate distance between two points (Haversine formula)
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // Calculate bearing between two points
  calculateBearing(start, end) {
    const startLat = this.toRadians(start[1]);
    const startLng = this.toRadians(start[0]);
    const endLat = this.toRadians(end[1]);
    const endLng = this.toRadians(end[0]);
    
    const dLng = endLng - startLng;
    
    const y = Math.sin(dLng) * Math.cos(endLat);
    const x = Math.cos(startLat) * Math.sin(endLat) -
              Math.sin(startLat) * Math.cos(endLat) * Math.cos(dLng);
    
    const bearing = Math.atan2(y, x);
    return (this.toDegrees(bearing) + 360) % 360;
  },

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  },

  toDegrees(radians) {
    return radians * (180 / Math.PI);
  },

  // Get estimated arrival time based on route and current progress
  getEstimatedArrival(route, currentProgress, currentSpeed = 65) {
    if (!route) return null;
    const miles = route.distance ?? 0;
    const remainingDistance = miles * (1 - currentProgress / 100);
    const remainingTimeHours = remainingDistance / currentSpeed;
    const eta = new Date(Date.now() + remainingTimeHours * 3600 * 1000);
    return {
      eta: eta.toLocaleString(),
      remainingDistance: Math.round(remainingDistance),
      remainingTime: Math.round(remainingTimeHours * 60),
      estimatedSpeed: currentSpeed
    };
  }
};