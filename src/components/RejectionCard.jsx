import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, BookX, Sparkles, ChevronDown, Calendar, Clock, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const SKILL_KEYWORDS = {
  'dsa': 'Data Structures & Algorithms',
  'system design': 'System Design Fundamentals',
  'react': 'Advanced React Concepts',
  'api': 'API Design & Integration',
  'database': 'Database Optimization & SQL',
  'communication': 'Soft Skills & Interview Communication',
  'css': 'CSS Architecture & Layouts',
  'javascript': 'Vanilla JavaScript & Event Loop',
  'speed': 'Coding Speed & Time Management',
  'confidence': 'Interview Confidence & Body Language'
};

export default function RejectionCard({ app, onUpdateApp }) {
  const [expanded, setExpanded] = useState(false);
  const [reason, setReason] = useState(app.rejectionReason || '');
  const [round, setRound] = useState(app.rejectionRound || '');
  const [suggestions, setSuggestions] = useState(app.improvementSuggestions || []);

  const handleSaveReason = (e) => {
    const val = e.target.value;
    setReason(val);
    onUpdateApp(app.id, { rejectionReason: val });
  };

  const handleSaveRound = (e) => {
    const val = e.target.value;
    setRound(val);
    onUpdateApp(app.id, { rejectionRound: val });
  };

  const identifyGaps = () => {
    const lowerReason = reason.toLowerCase();
    let foundSkills = [];
    Object.entries(SKILL_KEYWORDS).forEach(([key, skill]) => {
      if (lowerReason.includes(key)) {
        foundSkills.push(skill);
      }
    });

    if (foundSkills.length === 0) {
      if (reason.trim() !== '') {
         foundSkills = ['Review general interview fundamentals', 'Work on behavioral answers'];
      } else {
         foundSkills = ['Please write some details first to get tailored suggestions.'];
      }
    }

    setSuggestions(foundSkills);
    if (onUpdateApp && app) {
      onUpdateApp(app.id, { improvementSuggestions: foundSkills });
    }
  };

  return (
    <motion.div
      className="rejection-card glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <div className="rejection-header">
        <div className="rejection-title">
          <Building2 size={18} />
          <h3>{app.company}</h3>
          <span className="badge app-type-badge">{app.type}</span>
        </div>
        
        <button 
          className={`rejection-date-btn ${expanded ? 'active' : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          {app.rejectionDate ? `Rejected: ${formatDate(app.rejectionDate)}` : 'Rejected'}
          <ChevronDown size={14} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="reflective-log-content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="reflective-log-inner">
                {/* Rejection Details */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '20px', padding: '12px', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} /> Applied On
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {app.applyDate ? formatDate(app.applyDate) : 'N/A'}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Rejected On
                    </span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {app.rejectionDate ? formatDate(app.rejectionDate) : 'N/A'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={12} /> Rejected Round
                    </span>
                    <select 
                      className="input" 
                      value={round} 
                      onChange={handleSaveRound}
                      style={{ padding: '6px 12px', fontSize: '0.85rem', height: '34px', background: 'var(--bg-input)' }}
                    >
                      <option value="">Select round...</option>
                      <option value="Resume Screening">Resume Screening</option>
                      <option value="Online Assessment">Online Assessment</option>
                      <option value="HR / Phone Screen">HR / Phone Screen</option>
                      <option value="Technical Round 1">Technical Round 1</option>
                      <option value="Technical Round 2">Technical Round 2</option>
                      <option value="Managerial Round">Managerial Round</option>
                      <option value="Final / Culture Fit">Final / Culture Fit</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <BookX size={15} /> Reflective Learning Log
                </div>

                <textarea
                  className="rejection-textarea"
                  placeholder="Why do you think you were rejected? (e.g. lacked DSA skills, weak system design)"
                  value={reason}
                  onChange={handleSaveReason}
                  rows={3}
                />
                
                <button 
                  className="btn btn-secondary identify-gaps-btn" 
                  onClick={identifyGaps}
                >
                  <Sparkles size={16} />
                  Identify Skill Gaps
                </button>

                {suggestions.length > 0 && (
                  <div className="skill-suggestions">
                    <h4>Suggested Focus Areas:</h4>
                    <ul>
                      {suggestions.map((skill, idx) => (
                        <li key={idx}>• {skill}</li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
