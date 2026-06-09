export const getLog = (dateStr) => {
  const data = localStorage.getItem(`dm_log_${dateStr}`);
  return data ? JSON.parse(data) : [];
};

export const saveLog = (dateStr, entries) => {
  localStorage.setItem(`dm_log_${dateStr}`, JSON.stringify(entries));
};

export const getWater = (dateStr) => {
  const data = localStorage.getItem(`dm_water_${dateStr}`);
  return data ? parseInt(data, 10) : 0;
};

export const saveWater = (dateStr, count) => {
  localStorage.setItem(`dm_water_${dateStr}`, count.toString());
};

export const getProfile = () => {
  const data = localStorage.getItem('dm_profile');
  return data ? JSON.parse(data) : null;
};

export const saveProfile = (data) => {
  localStorage.setItem('dm_profile', JSON.stringify(data));
};

export const getSettings = () => {
  const data = localStorage.getItem('dm_settings');
  return data ? JSON.parse(data) : {};
};

export const saveSettings = (data) => {
  localStorage.setItem('dm_settings', JSON.stringify(data));
};

export const getApiKey = () => {
  return localStorage.getItem('dm_apikey');
};

export const saveApiKey = (key) => {
  if (key) {
    localStorage.setItem('dm_apikey', key);
  } else {
    localStorage.removeItem('dm_apikey');
  }
};

export const clearAllData = () => {
  const keys = Object.keys(localStorage);
  for (const key of keys) {
    if (key.startsWith('dm_')) {
      localStorage.removeItem(key);
    }
  }
};
