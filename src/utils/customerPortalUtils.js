// Utility functions for customer portal

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const formatDistance = (miles) => {
    if (miles < 1000) {
      return `${Math.round(miles)} mi`;
    } else {
      return `${(miles / 1000).toFixed(1)}k mi`;
    }
  };
  
  export const formatCurrency = (amount) => {
    if (typeof amount === 'string' && amount.startsWith('$')) {
      return amount;
    }
    
    const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
    
    if (numAmount >= 1000000) {
      return `$${(numAmount / 1000000).toFixed(1)}M`;
    } else if (numAmount >= 1000) {
      return `$${(numAmount / 1000).toFixed(0)}K`;
    } else {
      return `$${numAmount.toLocaleString()}`;
    }
  };
  
  export const getStatusColor = (status, onTime = true) => {
    const statusColors = {
      'In Transit': onTime ? '#00ff41' : '#ff0040',
      'Loading': '#00ffff',
      'Delivered': '#00ff41',
      'Delayed': '#ff0040',
      'Cancelled': '#666'
    };
    
    return statusColors[status] || '#999';
  };
  
  export const calculateETA = (startTime, estimatedDelivery, progress) => {
    const start = new Date(startTime);
    const estimated = new Date(estimatedDelivery);
    const now = new Date();
    
    const totalDuration = estimated.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    const remaining = totalDuration - elapsed;
    
    if (progress >= 100) {
      return 'Delivered';
    }
    
    const adjustedRemaining = remaining * ((100 - progress) / 100);
    const newETA = new Date(now.getTime() + adjustedRemaining);
    
    return newETA.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  export const isOnTime = (estimatedDelivery, progress) => {
    const estimated = new Date(estimatedDelivery);
    const now = new Date();
    
    // Calculate if we're on track based on time vs progress
    const totalTime = estimated.getTime() - new Date().setHours(0, 0, 0, 0);
    const elapsedTime = now.getTime() - new Date().setHours(0, 0, 0, 0);
    const expectedProgress = (elapsedTime / totalTime) * 100;
    
    return progress >= expectedProgress * 0.9; // 90% threshold for "on time"
  };
  
  export const generateTruckPositions = (count = 10) => {
    const positions = [];
    const regions = [
      { lat: 41.8781, lng: -87.6298, name: 'Chicago' },
      { lat: 39.7392, lng: -104.9903, name: 'Denver' },
      { lat: 29.7604, lng: -95.3698, name: 'Houston' },
      { lat: 34.0522, lng: -118.2437, name: 'Los Angeles' },
      { lat: 40.7128, lng: -74.0060, name: 'New York' },
      { lat: 33.7490, lng: -84.3880, name: 'Atlanta' },
      { lat: 47.6062, lng: -122.3321, name: 'Seattle' },
      { lat: 25.7617, lng: -80.1918, name: 'Miami' }
    ];
    
    for (let i = 0; i < count; i++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      positions.push({
        id: `truck-${i + 1}`,
        lat: region.lat + (Math.random() - 0.5) * 2,
        lng: region.lng + (Math.random() - 0.5) * 2,
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        region: region.name
      });
    }
    
    return positions;
  };
  
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  export const validateCompanyCode = (code) => {
    // Simple validation - at least 4 characters, alphanumeric
    const codeRegex = /^[A-Z0-9]{4,}$/i;
    return codeRegex.test(code);
  };
  
  export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };
  
  export const generateNotificationId = () => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  export const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInSeconds = Math.floor((now - time) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };