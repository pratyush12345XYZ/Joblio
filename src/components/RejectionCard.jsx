import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, BookX, Sparkles, ChevronDown } from 'lucide-react';
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
  const [suggestions, setSuggestions] = useState(app.improvementSuggestions || []);

  const handleSaveReason = (e) => {
    const val = e.target.value;
    setReason(val);
    onUpdateApp(app.id, { rejectionReason: val });
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
        {app.rejectionDate && (
          <span className="rejection-date">
             Rejected: {formatDate(app.rejectionDate)}
          </span>
        )}
      </div>

      <div className="rejection-expand" onClick={() => setExpanded(!expanded)}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BookX size={15} /> Reflective Learning Log
        </span>
        <ChevronDown size={16} style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
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
