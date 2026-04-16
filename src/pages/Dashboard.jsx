import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Download, LogOut } from 'lucide-react';
import { STORAGE_KEYS } from '../utils/constants';
import { exportToCSV } from '../utils/helpers';
import { useApplications } from '../hooks/useApplications';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from '../components/ThemeToggle';
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
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                <motion.button
                  className="btn btn-ghost btn-icon"
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Logout"
                  id="logout-btn"
                >
                  <LogOut size={18} />
                </motion.button>
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
    </>
  );
}
