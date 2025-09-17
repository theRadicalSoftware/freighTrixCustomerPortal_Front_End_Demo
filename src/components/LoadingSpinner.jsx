import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = '#00ff41', text = 'Loading...' }) => {
  const sizeMap = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const spinnerSize = sizeMap[size] || sizeMap.medium;

  return (
    <div style={{
      ...styles.container,
      ...(size === 'large' ? styles.containerLarge : {})
    }}>
      <div style={{
        ...styles.spinner,
        width: spinnerSize,
        height: spinnerSize,
        borderColor: `${color}33`,
        borderTopColor: color
      }}>
        <div style={{
          ...styles.innerSpinner,
          borderColor: `${color}66`,
          borderTopColor: color
        }}></div>
      </div>
      {text && (
        <div style={{
          ...styles.text,
          color: color
        }}>
          {text}
        </div>
      )}
      
      <style>
        {`
          @keyframes spinner-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes inner-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(-360deg); }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem',
    padding: '1rem',
  },
  containerLarge: {
    minHeight: '200px',
  },
  spinner: {
    border: '3px solid',
    borderRadius: '50%',
    animation: 'spinner-rotate 1s linear infinite',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerSpinner: {
    width: '60%',
    height: '60%',
    border: '2px solid',
    borderRadius: '50%',
    animation: 'inner-rotate 0.8s linear infinite',
  },
  text: {
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.9rem',
    fontWeight: 500,
  },
};

export default LoadingSpinner;