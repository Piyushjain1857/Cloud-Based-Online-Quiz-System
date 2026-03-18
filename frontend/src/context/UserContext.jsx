import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();

// Set up global axios interceptor
axios.interceptors.request.use(config => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser?.id) {
    config.headers['X-User-ID'] = storedUser.id;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.id;

    if (!userId) {
      setLoading(false);
      return;
    }

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
