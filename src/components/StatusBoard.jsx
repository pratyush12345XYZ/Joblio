import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Calendar, ArrowRight } from 'lucide-react';
import { STATUSES, STATUS_COLORS } from '../utils/constants';
import { formatDate } from '../utils/helpers';

export default function StatusBoard({ isOpen, onClose, applications, onUpdateStatus }) {
  if (!isOpen) return null;

  const columns = STATUSES.map(status => ({
    status,
    color: STATUS_COLORS[status],
    apps: applications.filter(app => app.status === status),
  }));

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal status-board-modal"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header" style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-modal)', paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
              <h2 className="modal-title">Application Pipeline</h2>
              <motion.button
                className="btn btn-ghost btn-icon"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                id="status-board-close-btn"
              >
                <X size={20} />
              </motion.button>
            </div>

            <div className="pipeline-scroll">
              {columns.map((col, colIndex) => (
                <motion.div
                  key={col.status}
                  className="pipeline-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: colIndex * 0.05 }}
                >
                  {/* Section Header */}
                  <div
                    className="pipeline-section-header"
                    style={{ borderLeftColor: col.color.text }}
                  >
                    <span
                      className="status-column-dot"
                      style={{ background: col.color.text }}
                    />
                    <span className="pipeline-section-title">{col.status}</span>
                    <span
                      className="status-column-count"
                      style={{ background: col.color.bg, color: col.color.text }}
                    >
                      {col.apps.length}
                    </span>
                  </div>

                  {/* Cards */}
                  {col.apps.length === 0 ? (
                    <div className="pipeline-empty">
                      No applications in this stage
                    </div>
                  ) : (
                    <div className="pipeline-cards">
                      <AnimatePresence>
                        {col.apps.map((app) => (
                          <motion.div
                            key={app.id}
                            className="pipeline-card glass-card"
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                          >
                            <div className="pipeline-card-top">
                              <div className="pipeline-card-info">
                                <div className="status-card-company">
                                  <Building2 size={14} />
                                  {app.company}
                                </div>
                                {app.role && (
                                  <p className="status-card-role">{app.role}</p>
                                )}
                                {app.applyDate && (
                                  <span className="status-card-date">
                                    <Calendar size={11} />
                                    {formatDate(app.applyDate)}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="pipeline-card-actions">
                              <span className="pipeline-move-label">Move to:</span>
                              <div className="status-chips">
                                {STATUSES.filter(s => s !== col.status).map(s => (
                                  <motion.button
                                    key={s}
                                    className="status-chip"
                                    style={{
                                      background: STATUS_COLORS[s].bg,
                                      color: STATUS_COLORS[s].text,
                                      border: `1px solid ${STATUS_COLORS[s].border}`,
                                    }}
                                    onClick={() => onUpdateStatus(app.id, s)}
                                    whileHover={{ scale: 1.08 }}
                                    whileTap={{ scale: 0.92 }}
                                    title={`Move to ${s}`}
                                  >
                                    {s}
                                    <ArrowRight size={10} />
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Divider between sections (not after last) */}
                  {colIndex < columns.length - 1 && (
                    <div className="pipeline-divider" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
