import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, Calendar, Edit3, Trash2, ExternalLink,
  MapPin, Clock, Tag,
} from 'lucide-react';
import { STATUS_COLORS, PRIORITY_COLORS } from '../utils/constants';
import { formatDate } from '../utils/helpers';
import ConfirmDialog from './ConfirmDialog';

export default function ApplicationCard({ app, onEdit, onDelete, index = 0 }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const statusStyle = STATUS_COLORS[app.status] || STATUS_COLORS.Applied;
  const priorityColor = PRIORITY_COLORS[app.priority];

  return (
    <>
      <motion.div
        className="app-card glass-card"
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ delay: index * 0.04, duration: 0.35 }}
        whileHover={{ y: -3 }}
      >
        <div className="app-card-header">
          <div className="app-card-badges">
            <span className="badge app-type-badge">{app.type}</span>
            {app.location && (
              <span className="badge app-location-badge">
                <MapPin size={10} />
                {app.location}
              </span>
            )}
          </div>
          <div className="app-card-actions">
            <motion.button
              className="btn btn-ghost btn-icon"
              onClick={() => onEdit(app)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Edit"
              id={`edit-btn-${app.id}`}
            >
              <Edit3 size={15} />
            </motion.button>
            <motion.button
              className="btn btn-ghost btn-icon"
              onClick={() => setShowConfirm(true)}
              whileHover={{ scale: 1.1, color: '#ef4444' }}
              whileTap={{ scale: 0.9 }}
              title="Delete"
              id={`delete-btn-${app.id}`}
            >
              <Trash2 size={15} />
            </motion.button>
          </div>
        </div>

        <div className="app-card-body">
          <h3 className="app-card-company">
            <Building2 size={16} />
            {app.company}
          </h3>
          {app.role && <p className="app-card-role">{app.role}</p>}
        </div>

        <div className="app-card-meta">
          {app.applyDate && (
            <span className="app-card-date">
              <Calendar size={12} />
              {formatDate(app.applyDate)}
            </span>
          )}
          {app.workType && (
            <span className="app-card-work-type">
              <Clock size={12} />
              {app.workType}
            </span>
          )}
        </div>

        <div className="app-card-footer">
          <span
            className="badge app-status-badge"
            style={{
              background: statusStyle.bg,
              color: statusStyle.text,
              border: `1px solid ${statusStyle.border}`,
            }}
          >
            {app.status}
          </span>

          {app.priority && (
            <span className="app-card-priority">
              <span
                className="priority-dot"
                style={{ background: priorityColor }}
              />
              {app.priority}
            </span>
          )}

          {app.link && (
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              className="app-card-link"
              title="Open application link"
            >
              <ExternalLink size={13} />
            </a>
          )}
        </div>

        {app.tags && app.tags.length > 0 && (
          <div className="app-card-tags">
            {app.tags.slice(0, 4).map((tag, i) => (
              <span key={i} className="chip" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>
                <Tag size={9} />
                {tag}
              </span>
            ))}
            {app.tags.length > 4 && (
              <span className="chip" style={{ padding: '2px 8px', fontSize: '0.7rem', opacity: 0.6 }}>
                +{app.tags.length - 4}
              </span>
            )}
          </div>
        )}
      </motion.div>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => onDelete(app.id)}
        title="Delete Application"
        message={`Are you sure you want to delete your ${app.company} application? This action cannot be undone.`}
      />
    </>
  );
}
