import { motion } from 'framer-motion';
import { TrendingUp, Home, BarChart3 } from 'lucide-react';

const tabs = [
  { id: 'progress', label: 'Progress', icon: TrendingUp },
  { id: 'dashboard', label: 'Home', icon: Home },
  { id: 'status', label: 'Status', icon: BarChart3 },
];

export default function BottomNav({ activePage, onNavigate }) {
  return (
    <div className="bottom-nav-container">
      <motion.nav
        className="bottom-nav glass-strong"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4, ease: 'easeOut' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activePage === tab.id;
          return (
            <motion.button
              key={tab.id}
              className={`bottom-nav-tab ${isActive ? 'active' : ''}`}
              onClick={() => onNavigate(tab.id)}
              whileTap={{ scale: 0.9 }}
              id={`nav-${tab.id}-btn`}
            >
              <motion.div
                className="bottom-nav-icon-wrap"
                animate={isActive ? { y: -2 } : { y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon size={20} />
              </motion.div>
              <span className="bottom-nav-label">{tab.label}</span>
              {isActive && (
                <motion.div
                  className="bottom-nav-indicator"
                  layoutId="nav-indicator"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
}
