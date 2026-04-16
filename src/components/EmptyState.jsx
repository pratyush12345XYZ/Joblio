import { motion } from 'framer-motion';
import { Briefcase, Rocket, Plus } from 'lucide-react';

export default function EmptyState({ onAdd }) {
  return (
    <motion.div
      className="empty-state"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="empty-state-illustration"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="empty-state-icon-ring">
          <Briefcase size={40} strokeWidth={1.5} />
        </div>
        <motion.div
          className="empty-state-rocket"
          animate={{ y: [0, -12, 0], x: [0, 4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <Rocket size={24} strokeWidth={1.5} />
        </motion.div>
      </motion.div>

      <h3 className="empty-state-title">No applications yet</h3>
      <p className="empty-state-text">
        Start tracking your career journey. Add your first job or internship application!
      </p>

      <motion.button
        className="btn btn-primary"
        onClick={onAdd}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        id="empty-state-add-btn"
      >
        <Plus size={18} />
        Add Your First Application
      </motion.button>
    </motion.div>
  );
}
