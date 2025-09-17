import React, { useState } from 'react';
import CustomerLogin from './components/CustomerLogin';
import CustomerDashboard from './components/CustomerDashboard';
import './CustomerApp.css';

function CustomerApp() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [userData, setUserData] = useState(null);

  const handleLoginSuccess = (user) => {
    setUserData(user);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setUserData(null);
    setCurrentScreen('login');
  };

  const renderCurrentScreen = () => {
    switch(currentScreen) {
      case 'login':
        return <CustomerLogin onLoginSuccess={handleLoginSuccess} />;
      case 'dashboard':
        return (
          <CustomerDashboard 
            userData={userData}
            onLogout={handleLogout}
          />
        );
      default:
        return <CustomerLogin onLoginSuccess={handleLoginSuccess} />;
    }
  };

  return (
    <div className="CustomerApp">
      {renderCurrentScreen()}
    </div>
  );
}

export default CustomerApp;