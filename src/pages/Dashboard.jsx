import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, LogOut, Settings, Info, Moon, Sun } from 'lucide-react';
import { STORAGE_KEYS } from '../utils/constants';
import { exportToCSV } from '../utils/helpers';
import { useApplications } from '../hooks/useApplications';
import { useTheme } from '../hooks/useTheme';
import StatsBar from '../components/StatsBar';
import SearchFilter from '../components/SearchFilter';
import ApplicationCard from '../components/ApplicationCard';
import AddApplicationModal from '../components/AddApplicationModal';
import EmptyState from '../components/EmptyState';
import SkeletonCard from '../components/SkeletonCard';
import BottomNav from '../components/BottomNav';
import StatusPage from './StatusPage';
import ProgressPage from './ProgressPage';

export default function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [editingApp, setEditingApp] = useState(null);
  const { theme, toggleTheme } = useTheme();

  const {
    applications,
    filteredApplications,
    stats,
    addApplication,
    updateApplication,
    deleteApplication,
    updateStatus,
    searchQuery, setSearchQuery,
    filterType, setFilterType,
    filterStatus, setFilterStatus,
    filterPriority, setFilterPriority,
    filterLocation, setFilterLocation,
    sortBy, setSortBy,
  } = useApplications();

  useEffect(() => {
    const name = localStorage.getItem(STORAGE_KEYS.username);
    if (!name) {
      navigate('/');
      return;
    }
    setUsername(name);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [navigate]);

  const handleSubmit = (formData) => {
    if (editingApp) {
      updateApplication(editingApp.id, formData);
    } else {
      addApplication(formData);
    }
    setEditingApp(null);
  };

  const handleEdit = (app) => {
    setEditingApp(app);
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.username);
    navigate('/');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const renderPage = () => {
    switch (activePage) {
      case 'status':
        return (
          <StatusPage
            key="status"
            applications={applications}
            stats={stats}
            onUpdateStatus={updateStatus}
            onUpdateApp={updateApplication}
          />
        );
      case 'progress':
        return (
          <ProgressPage
            key="progress"
            applications={applications}
          />
        );
      default:
        return (
          <motion.div
            key="dashboard"
            className="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <motion.header
              className="dashboard-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="dashboard-header-left">
                <h1 className="dashboard-greeting">
                  {getGreeting()}, <span className="gradient-text">{username}</span> 👋
                </h1>
                <p className="dashboard-subtitle">
                  {applications.length === 0
                    ? 'Ready to start tracking your applications?'
                    : `You have ${applications.length} application${applications.length !== 1 ? 's' : ''} tracked`
                  }
                </p>
              </div>

              <div className="dashboard-header-right">
                {applications.length > 0 && (
                  <motion.button
                    className="btn btn-secondary btn-sm"
                    onClick={() => exportToCSV(applications)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    title="Export CSV"
                    id="export-csv-btn"
                  >
                    <Download size={15} />
                    <span className="btn-text-desktop">Export</span>
                  </motion.button>
                )}
                
                <div style={{ position: 'relative' }}>
                  <motion.button
                    className="btn btn-ghost btn-icon"
                    onClick={() => setShowSettings(!showSettings)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Settings"
                  >
                    <Settings size={18} />
                  </motion.button>

                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        className="status-dropdown-menu glass-card"
                        style={{ right: 0, left: 'auto', width: '200px', padding: '8px', zIndex: 100 }}
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                      >
                        <button 
                          className="status-dropdown-item" 
                          onClick={() => { toggleTheme(); setShowSettings(false); }}
                        >
                          {theme === 'dark' ? <Sun size={14} style={{ marginRight: '8px' }}/> : <Moon size={14} style={{ marginRight: '8px' }}/>}
                          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
                        <button 
                          className="status-dropdown-item" 
                          onClick={() => { setShowAbout(true); setShowSettings(false); }}
                        >
                          <Info size={14} style={{ marginRight: '8px' }} />
                          <span>About Us</span>
                        </button>
                        <button 
                          className="status-dropdown-item" 
                          onClick={handleLogout}
                          style={{ color: '#ef4444' }}
                        >
                          <LogOut size={14} style={{ marginRight: '8px' }} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.header>

            {/* Stats */}
            {applications.length > 0 && <StatsBar stats={stats} />}

            {/* Content */}
            {loading ? (
              <div className="cards-grid">
                {[...Array(6)].map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : applications.length === 0 ? (
              <EmptyState onAdd={() => setShowModal(true)} />
            ) : (
              <>
                <SearchFilter
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  filterType={filterType}
                  setFilterType={setFilterType}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  filterPriority={filterPriority}
                  setFilterPriority={setFilterPriority}
                  filterLocation={filterLocation}
                  setFilterLocation={setFilterLocation}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                />

                {filteredApplications.length === 0 ? (
                  <motion.div
                    className="no-results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p>No applications match your filters</p>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSearchQuery('');
                        setFilterType('All');
                        setFilterStatus('All');
                        setFilterPriority('All');
                        setFilterLocation('All');
                      }}
                    >
                      Clear Filters
                    </button>
                  </motion.div>
                ) : (
                  <motion.div className="cards-grid" layout>
                    <AnimatePresence mode="popLayout">
                      {filteredApplications.map((app, index) => (
                        <ApplicationCard
                          key={app.id}
                          app={app}
                          index={index}
                          onEdit={handleEdit}
                          onDelete={deleteApplication}
                        />
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </>
            )}

            {/* Add FAB - only on dashboard */}
            <div className="fab-container-single">
              <motion.button
                className="fab fab-primary"
                onClick={() => {
                  setEditingApp(null);
                  setShowModal(true);
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                title="Add Application"
                id="fab-add-btn"
              >
                <Plus size={24} />
              </motion.button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>

      {/* Shared Bottom Navigation */}
      <BottomNav activePage={activePage} onNavigate={setActivePage} />

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingApp(null);
        }}
        onSubmit={handleSubmit}
        editData={editingApp}
      />

      <AnimatePresence>
        {showAbout && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAbout(false)}
            style={{ zIndex: 999 }}
          >
            <motion.div
              className="modal glass-card"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ textAlign: 'center', maxWidth: '340px', padding: '32px 24px' }}
            >
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginTop: '10px' }}>
                This app is completely developed indie by me,<br />
                <strong style={{ color: 'var(--text-primary)', fontSize: '1.5rem', display: 'block', marginTop: '12px' }}>Pratyush</strong>
              </p>

              <button 
                className="btn btn-primary" 
                style={{ marginTop: '32px', marginBottom: '28px', width: '100%' }}
                onClick={() => setShowAbout(false)}
              >
                Close
              </button>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.6 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '2px' }}>29.04</span>
                <span style={{ fontSize: '0.9rem', marginTop: '4px' }}>❤️</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
