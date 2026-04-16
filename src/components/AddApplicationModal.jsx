import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Loader2 } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  APP_TYPES, PRIORITIES, LOCATIONS, WORK_TYPES,
} from '../utils/constants';
import { validateApplication } from '../utils/helpers';

const emptyForm = {
  type: '',
  company: '',
  role: '',
  link: '',
  applyDate: null,
  resultDate: null,
  priority: 'Medium',
  location: '',
  workType: '',
  duration: '',
  salary: '',
  notes: '',
  tags: [],
};

export default function AddApplicationModal({ isOpen, onClose, onSubmit, editData }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isEdit = !!editData;

  useEffect(() => {
    if (editData) {
      setForm({
        ...emptyForm,
        ...editData,
        applyDate: editData.applyDate ? new Date(editData.applyDate) : null,
        resultDate: editData.resultDate ? new Date(editData.resultDate) : null,
        tags: editData.tags || [],
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setSuccess(false);
  }, [editData, isOpen]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleTagKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().replace(/,/g, '');
      if (tag && !form.tags.includes(tag)) {
        handleChange('tags', [...form.tags, tag]);
      }
      setTagInput('');
    } else if (e.key === 'Backspace' && !tagInput && form.tags.length > 0) {
      handleChange('tags', form.tags.slice(0, -1));
    }
  };

  const removeTag = (index) => {
    handleChange('tags', form.tags.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToValidate = {
      ...form,
      applyDate: form.applyDate ? form.applyDate.toISOString() : null,
    };

    const { valid, errors: validationErrors } = validateApplication(dataToValidate);
    if (!valid) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    // Simulate brief delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 400));

    const submitData = {
      ...form,
      applyDate: form.applyDate ? form.applyDate.toISOString() : new Date().toISOString(),
      resultDate: form.resultDate ? form.resultDate.toISOString() : null,
    };

    onSubmit(submitData);
    setSubmitting(false);
    setSuccess(true);

    setTimeout(() => {
      setSuccess(false);
      onClose();
      setForm(emptyForm);
    }, 800);
  };

  const showExtraFields = form.type === 'Internship' || form.type === 'Others';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  className="modal-success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <motion.div
                    className="success-check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 200 }}
                  >
                    <Check size={40} />
                  </motion.div>
                  <p>{isEdit ? 'Updated!' : 'Application Added!'}</p>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <div className="modal-header">
                    <h2 className="modal-title">
                      {isEdit ? 'Edit Application' : 'New Application'}
                    </h2>
                    <motion.button
                      className="btn btn-ghost btn-icon"
                      onClick={onClose}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      id="modal-close-btn"
                    >
                      <X size={20} />
                    </motion.button>
                  </div>

                  <form onSubmit={handleSubmit} className="modal-form">
                    {/* Type */}
                    <div className="form-group">
                      <label className="label">Type *</label>
                      <select
                        className={`input ${errors.type ? 'input-error' : ''}`}
                        value={form.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                        id="form-type"
                      >
                        <option value="">Select type</option>
                        {APP_TYPES.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      {errors.type && <p className="error-text">{errors.type}</p>}
                    </div>

                    {/* Conditional: Work Type & Duration */}
                    <AnimatePresence>
                      {showExtraFields && (
                        <motion.div
                          className="form-row"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{ overflow: 'hidden' }}
                        >
                          <div className="form-group">
                            <label className="label">Work Type</label>
                            <select
                              className="input"
                              value={form.workType}
                              onChange={(e) => handleChange('workType', e.target.value)}
                              id="form-work-type"
                            >
                              <option value="">Select</option>
                              {WORK_TYPES.map(w => (
                                <option key={w} value={w}>{w}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label className="label">Duration</label>
                            <input
                              type="text"
                              className="input"
                              placeholder="e.g., 3 months"
                              value={form.duration}
                              onChange={(e) => handleChange('duration', e.target.value)}
                              id="form-duration"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Company */}
                    <div className="form-group">
                      <label className="label">Company *</label>
                      <input
                        type="text"
                        className={`input ${errors.company ? 'input-error' : ''}`}
                        placeholder="Company name"
                        value={form.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        id="form-company"
                      />
                      {errors.company && <p className="error-text">{errors.company}</p>}
                    </div>

                    {/* Role */}
                    <div className="form-group">
                      <label className="label">Role / Position</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., Frontend Developer"
                        value={form.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                        id="form-role"
                      />
                    </div>

                    {/* Link */}
                    <div className="form-group">
                      <label className="label">Application Link</label>
                      <input
                        type="url"
                        className="input"
                        placeholder="https://..."
                        value={form.link}
                        onChange={(e) => handleChange('link', e.target.value)}
                        id="form-link"
                      />
                    </div>

                    {/* Dates */}
                    <div className="form-row">
                      <div className="form-group">
                        <label className="label">Apply Date {errors.applyDate ? '' : ''}</label>
                        <DatePicker
                          selected={form.applyDate}
                          onChange={(date) => handleChange('applyDate', date)}
                          maxDate={new Date()}
                          placeholderText="Select date"
                          dateFormat="MMM d, yyyy"
                          id="form-apply-date"
                        />
                        {errors.applyDate && <p className="error-text">{errors.applyDate}</p>}
                      </div>
                      <div className="form-group">
                        <label className="label">Result Date</label>
                        <DatePicker
                          selected={form.resultDate}
                          onChange={(date) => handleChange('resultDate', date)}
                          placeholderText="Select date"
                          dateFormat="MMM d, yyyy"
                          id="form-result-date"
                        />
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="form-group">
                      <label className="label">Priority</label>
                      <div className="pill-group">
                        {PRIORITIES.map(p => (
                          <button
                            key={p}
                            type="button"
                            className={`pill ${form.priority === p ? 'active' : ''}`}
                            onClick={() => handleChange('priority', p)}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Location */}
                    <div className="form-group">
                      <label className="label">Location</label>
                      <div className="pill-group">
                        {LOCATIONS.map(l => (
                          <button
                            key={l}
                            type="button"
                            className={`pill ${form.location === l ? 'active' : ''}`}
                            onClick={() => handleChange('location', l)}
                          >
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Salary */}
                    <div className="form-group">
                      <label className="label">Salary / Stipend</label>
                      <input
                        type="text"
                        className="input"
                        placeholder="e.g., ₹25,000/month"
                        value={form.salary}
                        onChange={(e) => handleChange('salary', e.target.value)}
                        id="form-salary"
                      />
                    </div>

                    {/* Tags */}
                    <div className="form-group">
                      <label className="label">Tags</label>
                      <div className="chips-container" onClick={() => document.getElementById('tag-input')?.focus()}>
                        {form.tags.map((tag, i) => (
                          <span key={i} className="chip">
                            {tag}
                            <span className="chip-remove" onClick={() => removeTag(i)}>
                              <X size={12} />
                            </span>
                          </span>
                        ))}
                        <input
                          id="tag-input"
                          type="text"
                          className="chip-input"
                          placeholder={form.tags.length === 0 ? 'Type and press Enter' : ''}
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                        />
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="form-group">
                      <label className="label">Notes</label>
                      <textarea
                        className="input"
                        placeholder="Any additional notes..."
                        value={form.notes}
                        onChange={(e) => handleChange('notes', e.target.value)}
                        rows={3}
                        id="form-notes"
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      className={`btn btn-primary modal-submit ${submitting ? 'btn-loading' : ''}`}
                      whileHover={!submitting ? { scale: 1.02 } : {}}
                      whileTap={!submitting ? { scale: 0.98 } : {}}
                      disabled={submitting}
                      id="form-submit-btn"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={18} className="spinner" />
                          {isEdit ? 'Updating...' : 'Saving...'}
                        </>
                      ) : (
                        isEdit ? 'Update Application' : 'Add Application'
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
