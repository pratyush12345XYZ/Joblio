import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Send, MessageSquare, Layers, Trophy, XCircle, BarChart3,
} from 'lucide-react';

const statConfig = [
  { key: 'total', label: 'Total', icon: BarChart3, color: '#6366f1' },
  { key: 'applied', label: 'Applied', icon: Send, color: '#3b82f6' },
  { key: 'interview', label: 'Interview', icon: MessageSquare, color: '#f59e0b' },
  { key: 'rounds', label: 'Rounds', icon: Layers, color: '#8b5cf6' },
  { key: 'selected', label: 'Selected', icon: Trophy, color: '#10b981' },
  { key: 'rejected', label: 'Rejected', icon: XCircle, color: '#ef4444' },
];

function AnimatedNumber({ value }) {
  const ref = useRef(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const duration = 600;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      if (ref.current) {
        ref.current.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
    prevValue.current = value;
  }, [value]);

  return <span ref={ref}>0</span>;
}

export default function StatsBar({ stats }) {
  return (
    <div className="stats-bar">
      {statConfig.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.key}
            className="stat-card glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            style={{ '--stat-color': stat.color }}
            whileHover={{ scale: 1.03 }}
          >
            <div className="stat-icon" style={{ color: stat.color, background: `${stat.color}15` }}>
              <Icon size={18} />
            </div>
            <div className="stat-info">
              <span className="stat-value">
                <AnimatedNumber value={stats[stat.key] || 0} />
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
