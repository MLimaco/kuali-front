const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  LEADS: `${API_URL}/api/leads`,
  LOGS: `${API_URL}/api/logs`,
  COMPANIES: `${API_URL}/api/companies`,
  USERS: `${API_URL}/api/users`,
  LOGS_HISTORY: `${API_URL}/api/logsHistory`,
};