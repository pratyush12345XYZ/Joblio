import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Building2, Briefcase, PartyPopper, HeartHandshake } from 'lucide-react';
import { STATUSES, STATUS_COLORS } from '../utils/constants';
import StatsBar from '../components/StatsBar';
import ActiveEngagementCard from '../components/ActiveEngagementCard';
import RejectionCard from '../components/RejectionCard';

function StatusPopup({ type, company, role, onClose }) {
  const isSelected = type === 'Selected';

  return (
    <motion.div
      className="overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="status-popup glass-card"
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.7, y: 40 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="status-popup-icon-ring" style={{
          background: isSelected
            ? 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(52,211,153,0.25))'
            : 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(251,146,60,0.15))',
        }}>
          {isSelected ? (
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <PartyPopper size={40} color="#10b981" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <HeartHandshake size={40} color="#f59e0b" />
            </motion.div>
          )}
        </div>

        {isSelected ? (
          <>
            <motion.h3
              className="status-popup-title"
              style={{ color: '#10b981' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              🎉 Congratulations!
            </motion.h3>
            <motion.p
              className="status-popup-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              You've been selected at <strong>{company}</strong>
              {role ? <> for the <strong>{role}</strong> position</> : ''}!
              Your hard work and dedication have truly paid off. Wishing you an amazing journey ahead! 🚀
            </motion.p>
          </>
        ) : (
          <>
            <motion.h3
              className="status-popup-title"
              style={{ color: '#f59e0b' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Keep Going, Champ! 💪
            </motion.h3>
            <motion.p
              className="status-popup-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Don't let this setback define your journey.
              {company ? <> <strong>{company}</strong> wasn't the right fit, and that's okay.</> : ''}
              {' '}Every rejection brings you one step closer to the opportunity that's truly meant for you. Keep applying, keep growing — your breakthrough is just around the corner! ✨
            </motion.p>
          </>
        )}

        <motion.button
          className="btn btn-primary status-popup-ok"
          onClick={onClose}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          id="status-popup-ok-btn"
        >
          OK
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function StatusDropdown({ app, onUpdateStatus }) {
  const [open, setOpen] = useState(false);

  const currentColor = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;

  return (
    <div className="status-dropdown-wrapper">
      <motion.button
        className="status-dropdown-trigger"
        style={{
          background: currentColor.bg,
          color: currentColor.text,
          border: `1px solid ${currentColor.border}`,
        }}
        onClick={() => setOpen(!open)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <span>{app.status}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="status-dropdown-menu glass-card"
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            {STATUSES.map((status) => {
              const color = STATUS_COLORS[status];
              const isActive = status === app.status;
              return (
                <motion.button
                  key={status}
                  className={`status-dropdown-item ${isActive ? 'active' : ''}`}
                  style={{
                    '--item-color': color.text,
                    '--item-bg': color.bg,
                  }}
                  onClick={() => {
                    if (!isActive) {
                      onUpdateStatus(app.id, status);
                    }
                    setOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                >
                  <span className="status-dropdown-dot" style={{ background: color.text }} />
                  <span>{status}</span>
                  {isActive && <span className="status-dropdown-check">✓</span>}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function StatusPage({ applications, stats, onUpdateStatus, onUpdateApp }) {
  const [popup, setPopup] = useState(null);
  const [isRejectionArchiveOpen, setIsRejectionArchiveOpen] = useState(false);

  const selectedApps = applications.filter(a => a.status === 'Selected');
  const rejectedApps = applications.filter(a => a.status === 'Rejected');
  const mainApps = applications.filter(a => a.status !== 'Selected' && a.status !== 'Rejected');

  const handleStatusChange = (id, newStatus) => {
    const app = applications.find(a => a.id === id);
    onUpdateStatus(id, newStatus);

    if (newStatus === 'Selected' || newStatus === 'Rejected') {
      setPopup({
        type: newStatus,
        company: app?.company || '',
        role: app?.role || '',
      });
    }
  };

  return (
    <motion.div
      className="status-page"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -60 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="page-header-centered">
        <h2 className="page-title">Application Status</h2>
        <p className="page-subtitle">{applications.length} application{applications.length !== 1 ? 's' : ''} tracked</p>
      </div>

      {/* Stats Summary */}
      {applications.length > 0 && <StatsBar stats={stats} />}

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="status-page-empty">
          <Briefcase size={48} />
          <p>No applications yet</p>
          <span>Add your first application to see it here!</span>
        </div>
      ) : (
        <div className="status-sections-container">
          {mainApps.length > 0 && (
            <div className="status-section">
              <h3 className="status-section-title">Main Application List</h3>
              <div className="status-list">
                {mainApps.map((app, index) => (
                  <motion.div
                    key={app.id}
                    className="status-list-item glass-card"
                    style={{ zIndex: mainApps.length - index, position: 'relative' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="status-list-left">
                      <div className="status-list-company">
                        <Building2 size={16} />
                        <span className="status-list-company-name">{app.company}</span>
                      </div>
                      {app.role && <p className="status-list-role">{app.role}</p>}
                      {app.type && (
                        <span className="status-list-type-badge">{app.type}</span>
                      )}
                    </div>

                    <div className="status-list-right">
                      <StatusDropdown
                        app={app}
                        onUpdateStatus={handleStatusChange}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {selectedApps.length > 0 && (
            <div className="status-section">
              <h3 className="status-section-title">Active Engagement Pipeline</h3>
              <div className="engagement-list">
                {selectedApps.map(app => (
                  <ActiveEngagementCard
                    key={app.id}
                    app={app}
                    onUpdateApp={onUpdateApp}
                  />
                ))}
              </div>
            </div>
          )}

          {rejectedApps.length > 0 && (
            <div className="status-section">
              <div 
                className="status-section-header" 
                onClick={() => setIsRejectionArchiveOpen(!isRejectionArchiveOpen)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  cursor: 'pointer',
                  padding: '12px 16px',
                  background: 'var(--bg-glass)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: isRejectionArchiveOpen ? '16px' : '0'
                }}
              >
                <h3 className="status-section-title" style={{ marginBottom: 0 }}>Rejection Archive</h3>
                <ChevronDown size={18} style={{ transform: isRejectionArchiveOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
              </div>
              
              <AnimatePresence>
                {isRejectionArchiveOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="rejection-list">
                      {rejectedApps.map(app => (
                        <RejectionCard
                          key={app.id}
                          app={app}
                          onUpdateApp={onUpdateApp}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Status Change Popup */}
      <AnimatePresence>
        {popup && (
          <StatusPopup
            type={popup.type}
            company={popup.company}
            role={popup.role}
            onClose={() => setPopup(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
