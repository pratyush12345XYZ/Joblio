import { useState, useCallback, useMemo } from 'react';
import { STORAGE_KEYS } from '../utils/constants';
import { safeJSONParse } from '../utils/helpers';

function saveToStorage(apps) {
  try {
    localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(apps));
  } catch {
    console.warn('Failed to save to localStorage');
  }
}

export function useApplications() {
  const [applications, setApplications] = useState(() =>
    safeJSONParse(STORAGE_KEYS.applications, [])
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterLocation, setFilterLocation] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  const addApplication = useCallback((data) => {
    const newApp = {
      ...data,
      id: crypto.randomUUID(),
      status: 'Applied',
      createdAt: new Date().toISOString(),
      tags: data.tags || [],
    };
    setApplications(prev => {
      const updated = [newApp, ...prev];
      saveToStorage(updated);
      return updated;
    });
    return newApp;
  }, []);

  const updateApplication = useCallback((id, data) => {
    setApplications(prev => {
      const updated = prev.map(app => (app.id === id ? { ...app, ...data } : app));
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const deleteApplication = useCallback((id) => {
    setApplications(prev => {
      const updated = prev.filter(app => app.id !== id);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const updateStatus = useCallback((id, status) => {
    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === id) {
          const updates = { status };
          if (status === 'Rejected' && !app.rejectionDate) {
            updates.rejectionDate = new Date().toISOString();
          }
          return { ...app, ...updates };
        }
        return app;
      });
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const filteredApplications = useMemo(() => {
    let result = [...applications];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        app =>
          (app.company || '').toLowerCase().includes(q) ||
          (app.role || '').toLowerCase().includes(q) ||
          (app.tags || []).some(tag => tag.toLowerCase().includes(q))
      );
    }

    // Filters
    if (filterType !== 'All') {
      result = result.filter(app => app.type === filterType);
    }
    if (filterStatus !== 'All') {
      result = result.filter(app => app.status === filterStatus);
    }
    if (filterPriority !== 'All') {
      result = result.filter(app => app.priority === filterPriority);
    }
    if (filterLocation !== 'All') {
      result = result.filter(app => app.location === filterLocation);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.applyDate || a.createdAt) - new Date(b.applyDate || b.createdAt);
        case 'date-desc':
          return new Date(b.applyDate || b.createdAt) - new Date(a.applyDate || a.createdAt);
        case 'priority-high': {
          const order = { High: 0, Medium: 1, Low: 2 };
          return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
        }
        case 'priority-low': {
          const order = { High: 0, Medium: 1, Low: 2 };
          return (order[b.priority] ?? 3) - (order[a.priority] ?? 3);
        }
        default:
          return 0;
      }
    });

    return result;
  }, [applications, searchQuery, filterType, filterStatus, filterPriority, filterLocation, sortBy]);

  const stats = useMemo(() => ({
    total: applications.length,
    applied: applications.filter(a => a.status === 'Applied').length,
    interview: applications.filter(a => a.status === 'Interview').length,
    rounds: applications.filter(a => a.status === 'Rounds').length,
    selected: applications.filter(a => a.status === 'Selected').length,
    rejected: applications.filter(a => a.status === 'Rejected').length,
  }), [applications]);

  return {
    applications,
    filteredApplications,
    stats,
    addApplication,
    updateApplication,
    deleteApplication,
    updateStatus,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    filterLocation,
    setFilterLocation,
    sortBy,
    setSortBy,
  };
}
