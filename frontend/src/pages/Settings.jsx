import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Cropper from 'react-easy-crop';
import { User, Shield, Bell, Save, Moon, Globe, Camera, Mail, Lock, CheckCircle, Info, X } from 'lucide-react';
import { useUser } from '../context/UserContext';
import '../styles/settings.css';

// Utility function to crop image using Canvas
const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
};

const translations = {
  English: {
    profile: 'Profile',
    security: 'Security',
    notifications: 'Notifications',
    userName: 'Full Name',
    email: 'Email Address',
    appPref: 'App Preferences',
    darkMode: 'Dark Mode',
    darkModeDesc: 'Switch to dark theme for a focused experience.',
    language: 'Display Language',
    langDesc: 'Set your interface language.',
    save: 'Save All Changes',
    saving: 'Saving...',
    success: 'Settings updated successfully!',
    error: 'Failed to update settings.'
  },
  Hindi: {
    profile: 'प्रोफ़ाइल',
    security: 'सुरक्षा',
    notifications: 'सूचनाएं',
    userName: 'पूरा नाम',
    email: 'ईमेल पता',
    appPref: 'ऐप प्राथमिकताएं',
    darkMode: 'डार्क मोड',
    darkModeDesc: 'एक केंद्रित अनुभव के लिए डार्क थीम पर स्विच करें।',
    language: 'भाषा दिखाएं',
    langDesc: 'अपनी इंटरफ़ेस भाषा सेट करें।',
    save: 'सभी परिवर्तन सहेजें',
    saving: 'सहेज रहा है...',
    success: 'सेटिंग्स सफलतापूर्वक अपडेट की गईं!',
    error: 'सेटिंग्स अपडेट करने में विफल।'
  },
  Spanish: {
    profile: 'Perfil',
    security: 'Seguridad',
    notifications: 'Notificaciones',
    userName: 'Nombre completo',
    email: 'Correo electrónico',
    appPref: 'Preferencias de la aplicación',
    darkMode: 'Modo oscuro',
    darkModeDesc: 'Cambia al tema oscuro para una experiencia enfocada.',
    language: 'Idioma de pantalla',
    langDesc: 'Establece el idioma de tu interfaz.',
    save: 'Guardar todos los cambios',
    saving: 'Guardando...',
    success: '¡Ajustes actualizados con éxito!',
    error: 'Error al actualizar los ajustes.'
  }
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, settings: globalSettings, refreshProfile, updateGlobalProfile, loading } = useUser();
  const [localProfile, setLocalProfile] = useState({ name: '', email: '', profileImage: '' });
  const [localSettings, setLocalSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Cropping State
  const [imageToCrop, setImageToCrop] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    if (user) setLocalProfile(user);
    if (globalSettings) setLocalSettings(globalSettings);
  }, [user, globalSettings]);

  const t = translations[localSettings?.preferences?.language || 'English'] || translations.English;

  useEffect(() => {
    if (localSettings?.preferences?.theme) {
      document.documentElement.setAttribute('data-theme', localSettings.preferences.theme);
    }
  }, [localSettings?.preferences?.theme]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await axios.put('http://localhost:3000/api/user/profile', { profile: localProfile, settings: localSettings });
      await refreshProfile();
      setMessage({ type: 'success', text: t.success });
      setTimeout(() => setMessage(null), 4000);
    } catch (err) {
      setMessage({ type: 'error', text: t.error });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
      setLocalProfile(prev => ({ ...prev, profileImage: croppedImage }));
      setIsCropping(false);
      setImageToCrop(null);
      // Proactively update global profile for immediate sync in sidebar
      updateGlobalProfile({ profileImage: croppedImage });
    } catch (e) {
      console.error(e);
    }
  };

  const toggleSetting = (category, key) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: !prev[category][key]
      }
    }));
  };

  if (loading || !localSettings) {
    return (
      <div className="settings-page" style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
    <div className="settings-page">
      <div className="settings-container">
        <aside className="settings-sidebar">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={18} />
            <span>{t.profile}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <Shield size={18} />
            <span>{t.security}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={18} />
            <span>{t.notifications}</span>
          </button>
        </aside>

        <main className="settings-main">
          {message && (
            <div className={`status-message ${message.type}`}>
              {message.type === 'success' ? <CheckCircle size={20} /> : <Info size={20} />}
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>{t.profile}</h2>

              <div className="section-card">
                <div className="profile-upload">
                  <div className="avatar-container">
                    <div className="avatar-placeholder" style={{ background: localProfile.profileImage ? 'none' : '#e2e8f0' }}>
                      {localProfile.profileImage ? (
                        <img src={localProfile.profileImage} alt="Profile" />
                      ) : (
                        <User size={48} />
                      )}
                    </div>
                    <button className="edit-overlay" onClick={() => fileInputRef.current.click()}>
                      <Camera size={16} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
                  <div className="upload-info">
                    <h3>{localProfile.name || 'Your Photo'}</h3>
                    <p>Change your profile picture. PNG or JPG, max 5MB.</p>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label>{t.userName}</label>
                    <div className="input-with-icon">
                      <input
                        type="text"
                        value={localProfile.name}
                        onChange={e => setLocalProfile({ ...localProfile, name: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>{t.email}</label>
                    <div className="input-with-icon">
                      <input
                        type="email"
                        value={localProfile.email}
                        onChange={e => setLocalProfile({ ...localProfile, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <h3>{t.appPref}</h3>
              <div className="preference-group">
                <div className="preference-item">
                  <div className="pref-info">
                    <div className="pref-icon"><Moon size={20} /></div>
                    <div>
                      <p className="pref-label">{t.darkMode}</p>
                      <p className="pref-desc">{t.darkModeDesc}</p>
                    </div>
                  </div>
                  <div
                    className={`toggle-switch ${localSettings.preferences.theme === 'dark' ? 'on' : ''}`}
                    onClick={() => setLocalSettings({ ...localSettings, preferences: { ...localSettings.preferences, theme: localSettings.preferences.theme === 'dark' ? 'light' : 'dark' } })}
                  >
                    <div className="toggle-knob"></div>
                  </div>
                </div>

                <div className="preference-item">
                  <div className="pref-info">
                    <div className="pref-icon"><Globe size={20} /></div>
                    <div>
                      <p className="pref-label">{t.language}</p>
                      <p className="pref-desc">{t.langDesc}</p>
                    </div>
                  </div>
                  <select
                    value={localSettings.preferences.language}
                    onChange={e => setLocalSettings({ ...localSettings, preferences: { ...localSettings.preferences, language: e.target.value } })}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="Spanish">Español (Spanish)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="settings-section">
              <h2>{t.security}</h2>
              <div className="section-card">
                <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                  <div className="form-group">
                    <label>Current Password</label>
                    <input type="password" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label>New Password</label>
                    <input type="password" placeholder="Minimum 8 characters" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>{t.notifications}</h2>
              <div className="preference-group">
                <div className="preference-item">
                  <div className="pref-info">
                    <div className="pref-icon"><Mail size={20} /></div>
                    <div>
                      <p className="pref-label">Email Digests</p>
                      <p className="pref-desc">Weekly summary of performance.</p>
                    </div>
                  </div>
                  <div
                    className={`toggle-switch ${localSettings.notifications.email ? 'on' : ''}`}
                    onClick={() => toggleSetting('notifications', 'email')}
                  >
                    <div className="toggle-knob"></div>
                  </div>
                </div>

                <div className="preference-item">
                  <div className="pref-info">
                    <div className="pref-icon"><Bell size={20} /></div>
                    <div>
                      <p className="pref-label">Push Alerts</p>
                      <p className="pref-desc">Instant quiz notifications.</p>
                    </div>
                  </div>
                  <div
                    className={`toggle-switch ${localSettings.notifications.push ? 'on' : ''}`}
                    onClick={() => toggleSetting('notifications', 'push')}
                  >
                    <div className="toggle-knob"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="settings-actions">
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={saving}
            >
              <Save size={18} />
              {saving ? t.saving : t.save}
            </button>
          </div>
        </main>
      </div>

      {isCropping && (
        <div className="crop-modal-overlay">
          <div className="crop-modal">
            <div className="crop-header">
              <h3>Crop Your Profile Photo</h3>
              <button className="close-btn" onClick={() => setIsCropping(false)}><X size={20} /></button>
            </div>
            <div className="crop-container">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="crop-controls">
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                onChange={(e) => setZoom(e.target.value)}
                className="zoom-range"
              />
              <div className="crop-actions">
                <button className="btn btn-secondary" onClick={() => setIsCropping(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleCropSave}>Apply Crop</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
