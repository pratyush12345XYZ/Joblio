import { motion } from 'framer-motion';
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

      <div className="filter-row">
        <div className="filter-row-left">
          <SlidersHorizontal size={15} className="filter-icon" />

          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            id="filter-type"
          >
            <option value="All">All Types</option>
            {APP_TYPES.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            id="filter-status"
          >
            <option value="All">All Status</option>
            {STATUSES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            id="filter-priority"
          >
            <option value="All">All Priority</option>
            {PRIORITIES.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            className="filter-select"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            id="filter-location"
          >
            <option value="All">All Locations</option>
            {LOCATIONS.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <motion.button
              className="btn-clear-filters"
              onClick={clearFilters}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear
            </motion.button>
          )}
        </div>

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
    </motion.div>
  );
}
