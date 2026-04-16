import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Calendar, Clock, Target } from 'lucide-react';

export default function ActiveEngagementCard({ app, onUpdateApp }) {
  const [joiningDate, setJoiningDate] = useState(app.joiningDate || '');
  const [duration, setDuration] = useState(app.durationMonths || '');
  const [endDate, setEndDate] = useState('');

  // Calculate end date automatically
  useEffect(() => {
    if (joiningDate && duration) {
      const date = new Date(joiningDate);
      date.setMonth(date.getMonth() + parseInt(duration, 10));
      setEndDate(date.toISOString().split('T')[0]);
    } else {
      setEndDate('');
    }
  }, [joiningDate, duration]);

  // Save changes automatically via debounce
  useEffect(() => {
    if (joiningDate !== app.joiningDate || duration !== app.durationMonths) {
      const timeoutId = setTimeout(() => {
        onUpdateApp(app.id, { joiningDate, durationMonths: duration });
      }, 500); 
      return () => clearTimeout(timeoutId);
    }
  }, [joiningDate, duration, app.id, app.joiningDate, app.durationMonths, onUpdateApp]);

  return (
    <motion.div
      className="engagement-card glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="engagement-header">
        <div className="engagement-title">
          <Building2 size={18} />
          <h3>{app.company}</h3>
          {app.role && <span className="engagement-role">- {app.role}</span>}
        </div>
        <span className="badge app-type-badge">{app.type}</span>
      </div>

      <div className="engagement-body">
        <div className="engagement-input-group">
          <label><Calendar size={14} /> Joining Date</label>
          <input 
            type="date" 
            value={joiningDate} 
            onChange={(e) => setJoiningDate(e.target.value)}
            className="engagement-input-field"
          />
        </div>
        <div className="engagement-input-group">
          <label><Clock size={14} /> Duration (Months)</label>
          <input 
            type="number" 
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="engagement-input-field"
            placeholder="e.g. 6"
          />
        </div>
        {endDate && (
          <div className="engagement-end-date">
            <Target size={14} />
            <span>Estimated End: <strong>{new Date(endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric'})}</strong></span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
