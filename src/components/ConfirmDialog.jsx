import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ zIndex: 300 }}
        >
          <motion.div
            className="confirm-dialog glass-strong"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-dialog-icon">
              <AlertTriangle size={28} />
            </div>

            <h3 className="confirm-dialog-title">
              {title || 'Are you sure?'}
            </h3>

            <p className="confirm-dialog-message">
              {message || 'This action cannot be undone.'}
            </p>

            <div className="confirm-dialog-actions">
              <motion.button
                className="btn btn-secondary"
                onClick={onClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="confirm-cancel-btn"
              >
                Cancel
              </motion.button>
              <motion.button
                className="btn btn-danger"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                id="confirm-delete-btn"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
