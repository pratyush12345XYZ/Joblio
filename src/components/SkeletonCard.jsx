import { motion } from 'framer-motion';

export default function SkeletonCard() {
  return (
    <motion.div
      className="skeleton-card-wrapper glass-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ padding: '20px', cursor: 'default' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div className="skeleton skeleton-line" style={{ width: '35%', height: 12 }} />
        <div className="skeleton skeleton-line" style={{ width: '20%', height: 12 }} />
      </div>
      <div className="skeleton skeleton-line" style={{ width: '70%', height: 18, marginBottom: 12 }} />
      <div className="skeleton skeleton-line" style={{ width: '50%', height: 14, marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 8 }}>
        <div className="skeleton" style={{ width: 70, height: 26, borderRadius: 9999 }} />
        <div className="skeleton" style={{ width: 60, height: 26, borderRadius: 9999 }} />
        <div className="skeleton" style={{ width: 50, height: 26, borderRadius: 9999 }} />
      </div>
    </motion.div>
  );
}
