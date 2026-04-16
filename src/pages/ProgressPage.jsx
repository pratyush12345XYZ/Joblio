import { motion } from 'framer-motion';
import {
  Building2, CheckCircle2, Circle, Clock, ArrowRight,
} from 'lucide-react';
import { STATUSES, STATUS_COLORS } from '../utils/constants';

const STATUS_ORDER = STATUSES;

function getStepIndex(status) {
  const idx = STATUS_ORDER.indexOf(status);
  return idx === -1 ? 0 : idx;
}

function getProgressPercent(status) {
  const map = {
    Applied: 20,
    Interview: 40,
    Rounds: 60,
    Selected: 100,
    Rejected: 100,
  };
  return map[status] || 0;
}

function ProgressTimeline({ status }) {
  const currentIdx = getStepIndex(status);
  const isRejected = status === 'Rejected';

  const stepsToShow = ['Applied', 'Interview', 'Rounds'];
  const terminalStatus = isRejected ? 'Rejected' : 'Selected';

  return (
    <div className="progress-timeline">
      {stepsToShow.map((step, idx) => {
        const stepIdx = getStepIndex(step);
        const reached = currentIdx >= stepIdx;
        const isCurrent = status === step;
        const color = STATUS_COLORS[step];

        return (
          <div key={step} className="progress-timeline-step">
            <div className={`progress-step-node ${reached ? 'reached' : ''} ${isCurrent ? 'current' : ''}`}>
              {reached ? (
                <CheckCircle2 size={18} color={color.text} />
              ) : (
                <Circle size={18} color="var(--text-muted)" />
              )}
            </div>
            <span className={`progress-step-label ${reached ? 'reached' : ''}`} style={reached ? { color: color.text } : {}}>
              {step}
            </span>
            {idx < stepsToShow.length - 1 && (
              <div className={`progress-step-connector ${currentIdx > stepIdx ? 'filled' : ''}`} />
            )}
          </div>
        );
      })}

      {/* Terminal connector */}
      <div className="progress-timeline-step">
        <div className="progress-step-connector-terminal">
          <ArrowRight size={14} color="var(--text-muted)" />
        </div>
        <div className={`progress-step-node ${(status === 'Selected' || status === 'Rejected') ? 'reached' : ''}`}>
          {(status === 'Selected' || status === 'Rejected') ? (
            <CheckCircle2 size={18} color={STATUS_COLORS[terminalStatus].text} />
          ) : (
            <Clock size={18} color="var(--text-muted)" />
          )}
        </div>
        <span
          className={`progress-step-label ${(status === 'Selected' || status === 'Rejected') ? 'reached' : ''}`}
          style={(status === 'Selected' || status === 'Rejected') ? { color: STATUS_COLORS[terminalStatus].text } : {}}
        >
          {(status === 'Selected' || status === 'Rejected') ? terminalStatus : 'Pending'}
        </span>
      </div>
    </div>
  );
}

export default function ProgressPage({ applications }) {
  return (
    <motion.div
      className="progress-page"
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="page-header-centered">
        <h2 className="page-title">Application Progress</h2>
        <p className="page-subtitle">Track your journey for each application</p>
      </div>

      {/* Progress Cards */}
      {applications.length === 0 ? (
        <div className="progress-page-empty">
          <Clock size={48} />
          <p>No applications to track</p>
          <span>Add applications to view their progress here.</span>
        </div>
      ) : (
        <div className="progress-cards-list">
          {applications.map((app, index) => {
            const percent = getProgressPercent(app.status);
            const statusColor = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;
            const isRejected = app.status === 'Rejected';
            const isSelected = app.status === 'Selected';

            return (
              <motion.div
                key={app.id}
                className="progress-card glass-card"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
              >
                {/* Card Header */}
                <div className="progress-card-header">
                  <div className="progress-card-info">
                    <div className="progress-card-company">
                      <Building2 size={16} />
                      <span>{app.company}</span>
                    </div>
                    {app.role && <p className="progress-card-role">{app.role}</p>}
                  </div>
                  <span
                    className="progress-card-status-badge"
                    style={{
                      background: statusColor.bg,
                      color: statusColor.text,
                      border: `1px solid ${statusColor.border}`,
                    }}
                  >
                    {app.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container">
                  <div className="progress-bar-track">
                    <motion.div
                      className="progress-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${percent}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.07 + 0.3 }}
                      style={{
                        background: isRejected
                          ? 'linear-gradient(90deg, #ef4444, #f87171)'
                          : isSelected
                            ? 'linear-gradient(90deg, #10b981, #34d399)'
                            : 'var(--gradient-primary)',
                      }}
                    />
                  </div>
                  <span className="progress-bar-percent" style={{ color: statusColor.text }}>
                    {percent}%
                  </span>
                </div>

                {/* Timeline */}
                <ProgressTimeline status={app.status} />

                {/* Result Message */}
                {isSelected && (
                  <motion.div
                    className="progress-result-message selected"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.5 }}
                  >
                    🎉 Congratulations! You've been selected!
                  </motion.div>
                )}
                {isRejected && (
                  <motion.div
                    className="progress-result-message rejected"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ delay: 0.5 }}
                  >
                    Keep going — the right opportunity is ahead! 💪
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
