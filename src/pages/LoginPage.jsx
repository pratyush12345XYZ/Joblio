import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Sparkles } from 'lucide-react';
import { STORAGE_KEYS } from '../utils/constants';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    localStorage.setItem(STORAGE_KEYS.username, name.trim());
    navigate('/dashboard');
  };

  return (
    <div className="login-page">
      {/* Animated background orbs */}
      <div className="login-orbs">
        <motion.div
          className="orb orb-1"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="orb orb-2"
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 20, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="orb orb-3"
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <motion.div
        className="login-card glass-strong"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        <motion.div
          className="login-logo"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        >
          <div className="login-logo-icon">
            <Briefcase size={28} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="login-title">
            Joblio
            <Sparkles size={20} className="login-sparkle" />
          </h1>
          <p className="login-subtitle">Track your career journey with style</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          className="login-form"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="login-input-group">
            <input
              type="text"
              className={`input login-input ${error ? 'input-error' : ''}`}
              placeholder="What's your name?"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              id="login-name-input"
            />
            {error && (
              <motion.p
                className="error-text"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.p>
            )}
          </div>

          <motion.button
            type="submit"
            className="btn btn-primary login-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            id="login-submit-btn"
          >
            Get Started
            <ArrowRight size={18} />
          </motion.button>
        </motion.form>

        <motion.p
          className="login-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Your data stays on your device. No account needed.
        </motion.p>
      </motion.div>
    </div>
  );
}
