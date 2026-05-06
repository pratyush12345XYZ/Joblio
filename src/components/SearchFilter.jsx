import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { APP_TYPES, STATUSES, PRIORITIES, LOCATIONS } from '../utils/constants';

export default function SearchFilter({
  searchQuery, setSearchQuery,
  filterType, setFilterType,
  filterStatus, setFilterStatus,
  filterPriority, setFilterPriority,
  filterLocation, setFilterLocation,
  sortBy, setSortBy,
}) {
  const [showFilters, setShowFilters] = useState(false);
  
  const hasActiveFilters =
    filterType !== 'All' ||
    filterStatus !== 'All' ||
    filterPriority !== 'All' ||
    filterLocation !== 'All';

  const clearFilters = () => {
    setFilterType('All');
    setFilterStatus('All');
    setFilterPriority('All');
    setFilterLocation('All');
    setSearchQuery('');
  };

  return (
    <motion.div
      className="search-filter"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search companies, roles, tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="search-input"
        />
      </div>

      <div className="filter-toolbar">
        <button
          className={`btn-filter-toggle ${showFilters || hasActiveFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal size={14} />
          <span>Filter</span>
          {hasActiveFilters && <span className="active-dot"></span>}
        </button>

        <div className="sort-group">
          <ArrowUpDown size={14} />
          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="sort-select"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="priority-high">Priority: High → Low</option>
            <option value="priority-low">Priority: Low → High</option>
          </select>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="filter-panel glass">
              <div className="filter-panel-content">
                <div className="filter-item">
                  <label className="filter-label">Type</label>
                  <select
                    className="filter-select full-width"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    id="filter-type"
                  >
                    <option value="All">All Types</option>
                    {APP_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-item">
                  <label className="filter-label">Status</label>
                  <select
                    className="filter-select full-width"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    id="filter-status"
                  >
                    <option value="All">All Status</option>
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-item">
                  <label className="filter-label">Priority</label>
                  <select
                    className="filter-select full-width"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    id="filter-priority"
                  >
                    <option value="All">All Priority</option>
                    {PRIORITIES.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="filter-item">
                  <label className="filter-label">Location</label>
                  <select
                    className="filter-select full-width"
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    id="filter-location"
                  >
                    <option value="All">All Locations</option>
                    {LOCATIONS.map(l => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {hasActiveFilters && (
                  <div className="filter-item filter-action">
                    <motion.button
                      className="btn-clear-filters full-width"
                      onClick={clearFilters}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Clear Filters
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
