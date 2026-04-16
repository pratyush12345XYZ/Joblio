export const APP_TYPES = ['Job', 'Internship', 'Others'];

export const STATUSES = ['Applied', 'Interview', 'Rounds', 'Selected', 'Rejected'];

export const PRIORITIES = ['High', 'Medium', 'Low'];

export const LOCATIONS = ['Remote', 'Onsite', 'Hybrid', 'Unknown'];

export const WORK_TYPES = ['Full-time', 'Part-time'];

export const DEVICES = ['mobile', 'tablet', 'laptop'];

export const STATUS_COLORS = {
  Applied: { bg: 'rgba(59, 130, 246, 0.15)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
  Interview: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
  Rounds: { bg: 'rgba(139, 92, 246, 0.15)', text: '#8b5cf6', border: 'rgba(139, 92, 246, 0.3)' },
  Selected: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
  Rejected: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
};

export const PRIORITY_COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
};

export const STORAGE_KEYS = {
  applications: 'joblio_applications',
  username: 'joblio_username',
  theme: 'joblio_theme',
  device: 'joblio_device',
};
