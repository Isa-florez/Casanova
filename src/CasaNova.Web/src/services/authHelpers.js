const STORAGE_KEY = 'casanova_auth';

export function getAuthToken() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored).token;
  } catch {
    return null;
  }
}
