// Mock data for customer portal demo
export const mockShipments = [
    {
      id: 'FT-2024-1247',
      status: 'In Transit',
      origin: 'Chicago, IL',
      destination: 'Denver, CO',
      driver: 'Marcus Rodriguez',
      driverPhone: '(312) 555-0147',
      truck: 'FT-TR-456',
      currentLocation: 'Des Moines, IA',
      temperature: '4.2°C',
      eta: 'Dec 15, 2024 2:30 PM',
      onTime: true,
      progress: 45,
      lat: 41.5868,
      lng: -93.6250,
      cargo: 'Pharmaceuticals',
      value: '$2.3M',
      weight: '42,500 lbs',
      miles: 1003,
      startTime: '2024-12-13T08:00:00Z',
      estimatedDelivery: '2024-12-15T14:30:00Z',
      specialInstructions: 'TAPA Certified Required, Temperature Critical',
      customerRef: 'PO-2024-8829',
      carrier: 'FreighTrix Premium',
      trailerType: '53ft Refrigerated',
      seal: 'TMP-847592'
    },
    {
      id: 'FT-2024-1248',
      status: 'Loading',
      origin: 'Houston, TX',
      destination: 'Miami, FL',
      driver: 'Sarah Johnson',
      driverPhone: '(713) 555-0892',
      truck: 'FT-TR-892',
      currentLocation: 'Houston, TX',
      temperature: '2.1°C',
      eta: 'Dec 16, 2024 10:00 AM',
      onTime: true,
      progress: 5,
      lat: 29.7604,
      lng: -95.3698,
      cargo: 'Medical Supplies',
      value: '$1.8M',
      weight: '38,200 lbs',
      miles: 1190,
      startTime: '2024-12-14T06:00:00Z',
      estimatedDelivery: '2024-12-16T10:00:00Z',
      specialInstructions: 'GDP Certified, Chain of Custody Required',
      customerRef: 'PO-2024-8834',
      carrier: 'FreighTrix Medical',
      trailerType: '53ft Refrigerated',
      seal: 'TMP-847593'
    },
    {
      id: 'FT-2024-1249',
      status: 'In Transit',
      origin: 'Los Angeles, CA',
      destination: 'Seattle, WA',
      driver: 'Mike Chen',
      driverPhone: '(323) 555-0123',
      truck: 'FT-TR-123',
      currentLocation: 'Sacramento, CA',
      temperature: 'Ambient',
      eta: 'Dec 15, 2024 6:00 PM',
      onTime: false,
      progress: 70,
      lat: 38.5816,
      lng: -121.4944,
      cargo: 'Electronics',
      value: '$875K',
      weight: '45,000 lbs',
      miles: 1135,
      startTime: '2024-12-13T14:00:00Z',
      estimatedDelivery: '2024-12-15T18:00:00Z',
      specialInstructions: 'Fragile - Handle with Care',
      customerRef: 'PO-2024-8801',
      carrier: 'FreighTrix Standard',
      trailerType: '53ft Dry Van',
      seal: 'TMP-847594'
    },
    {
      id: 'FT-2024-1250',
      status: 'Delivered',
      origin: 'Atlanta, GA',
      destination: 'Charlotte, NC',
      driver: 'Lisa Anderson',
      driverPhone: '(404) 555-0567',
      truck: 'FT-TR-789',
      currentLocation: 'Charlotte, NC',
      temperature: 'Ambient',
      eta: 'Dec 14, 2024 3:00 PM',
      onTime: true,
      progress: 100,
      lat: 35.2271,
      lng: -80.8431,
      cargo: 'Automotive Parts',
      value: '$456K',
      weight: '41,200 lbs',
      miles: 245,
      startTime: '2024-12-14T09:00:00Z',
      estimatedDelivery: '2024-12-14T15:00:00Z',
      specialInstructions: 'Standard Delivery',
      customerRef: 'PO-2024-8765',
      carrier: 'FreighTrix Standard',
      trailerType: '53ft Dry Van',
      seal: 'TMP-847595'
    }
  ];
  
  export const mockFleetData = {
    totalTrucks: 15,
    activeTrucks: 13,
    availableTrucks: 2,
    inMaintenance: 1,
    totalDrivers: 18,
    activeDrivers: 13,
    onTimePerformance: 89.2,
    avgSpeed: 58.4,
    fuelEfficiency: 6.8,
    safetyRating: 4.7
  };
  
  export const mockTemperatureData = [
    { time: '08:00', temp: 4.1, target: 4.0 },
    { time: '09:00', temp: 4.3, target: 4.0 },
    { time: '10:00', temp: 3.9, target: 4.0 },
    { time: '11:00', temp: 4.2, target: 4.0 },
    { time: '12:00', temp: 4.0, target: 4.0 },
    { time: '13:00', temp: 4.4, target: 4.0 },
    { time: '14:00', temp: 4.1, target: 4.0 },
    { time: '15:00', temp: 4.2, target: 4.0 },
  ];
  
  export const mockDocuments = {
    'FT-2024-1247': {
      bol: {
        signed: true,
        timestamp: '2024-12-13T08:15:00Z',
        signedBy: 'Marcus Rodriguez',
        url: '/docs/FTRXExampleBOL.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
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
           url: '/docs/LinkedInPhotosOfShipment.docx',
           description: 'Complete shipment photo documentation'
        },
        { 
           type: 'seal', 
           timestamp: '2024-12-13T08:25:00Z', 
           url: '/imgs/trackersImg.jpeg',
           description: 'RAP door seals intact verification'
        },
        { 
           type: 'temperature', 
           timestamp: '2024-12-13T08:26:00Z', 
           url: '/imgs/trackersImg.jpeg',
           description: 'Trailer temperature verification'
        }
      ],
      temperature: mockTemperatureData
    }
  };
  
  export const mockCustomers = [
    {
      id: 'CUST-001',
      name: 'DemoCorp Logistics',
      email: 'demo@democorp.com',
      phone: '(555) 123-4567',
      address: '123 Business Ave, Chicago, IL 60601',
      accountManager: 'Jennifer Walsh',
      contractType: 'Premium',
      activeShipments: 4,
      totalShipments: 127,
      onTimeRate: 94.2
    }
  ];
  
  export const getShipmentById = (id) => {
    return mockShipments.find(shipment => shipment.id === id);
  };
  
  export const getActiveShipments = () => {
    return mockShipments.filter(shipment => 
      shipment.status === 'In Transit' || shipment.status === 'Loading'
    );
  };
  
  export const getShipmentDocuments = (id) => {
    return mockDocuments[id] || null;
  };