import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/profile');
      setUser(response.data.profile);
      setSettings(response.data.settings);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const updateGlobalProfile = (newProfile) => {
    setUser(prev => ({ ...prev, ...newProfile }));
  };

  const updateGlobalSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      settings, 
      loading, 
      refreshProfile: fetchUserProfile,
      updateGlobalProfile,
      updateGlobalSettings
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
