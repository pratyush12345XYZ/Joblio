/**
 * Format an ISO date string to a human-readable format
 */
export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Validate application data
 * Returns { valid: boolean, errors: { field: message } }
 */
export function validateApplication(data) {
  const errors = {};

  if (!data.type || data.type.trim() === '') {
    errors.type = 'Application type is required';
  }

  if (!data.company || data.company.trim() === '') {
    errors.company = 'Company name is required';
  }

  if (data.applyDate) {
    const applyDate = new Date(data.applyDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (applyDate > today) {
      errors.applyDate = 'Apply date cannot be in the future';
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Export applications array to CSV and trigger download
 */
export function exportToCSV(applications) {
  if (!applications || applications.length === 0) return;

  const headers = [
    'Type', 'Company', 'Role', 'Status', 'Priority', 'Location',
    'Work Type', 'Duration', 'Apply Date', 'Result Date',
    'Salary/Stipend', 'Tags', 'Notes', 'Link',
  ];

  const rows = applications.map(app => [
    app.type || '',
    app.company || '',
    app.role || '',
    app.status || '',
    app.priority || '',
    app.location || '',
    app.workType || '',
    app.duration || '',
    app.applyDate ? formatDate(app.applyDate) : '',
    app.resultDate ? formatDate(app.resultDate) : '',
    app.salary || '',
    (app.tags || []).join('; '),
    (app.notes || '').replace(/"/g, '""'),
    app.link || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `joblio_export_${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Safely parse JSON from localStorage with fallback
 */
export function safeJSONParse(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    if (!data) return fallback;
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    console.warn(`Corrupted data in localStorage key "${key}", resetting to fallback.`);
    localStorage.removeItem(key);
    return fallback;
  }
}
