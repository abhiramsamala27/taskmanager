import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Flag, Activity, Calendar, Loader2, Plus, Edit3 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function TaskModal({ isOpen, onClose, taskToEdit = null, onTaskUpdate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  });

  useEffect(() => {
    if (taskToEdit) {
      setFormData({
        title: taskToEdit.title,
        description: taskToEdit.description || '',
        priority: taskToEdit.priority,
        status: taskToEdit.status,
        dueDate: taskToEdit.dueDate
          ? new Date(taskToEdit.dueDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({ title: '', description: '', priority: 'Medium', status: 'Pending', dueDate: '' });
    }
  }, [taskToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (taskToEdit) {
        const res = await axios.put(`/tasks/${taskToEdit._id}`, formData);
        if (onTaskUpdate) onTaskUpdate(res.data);
        toast.success('Task updated successfully');
      } else {
        const res = await axios.post('/tasks', formData);
        if (onTaskUpdate) onTaskUpdate(res.data);
        toast.success('Task created successfully');
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'Low',    color: '#22C55E', bg: 'rgba(34,197,94,0.12)',   label: 'Low' },
    { value: 'Medium', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  label: 'Medium' },
    { value: 'High',   color: '#EF4444', bg: 'rgba(239,68,68,0.12)',   label: 'High' },
  ];

  const statusOptions = [
    { value: 'Pending',     color: '#F59E0B', label: 'Pending' },
    { value: 'In Progress', color: '#6366F1', label: 'In Progress' },
    { value: 'Completed',   color: '#22C55E', label: 'Completed' },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-lg overflow-hidden"
          style={{
            background: 'rgba(13, 17, 30, 0.98)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            borderRadius: '20px',
            boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          {/* Top accent bar */}
          <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #06B6D4)' }} />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
              >
                {taskToEdit ? <Edit3 className="h-4 w-4 text-white" /> : <Plus className="h-4 w-4 text-white" />}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">
                  {taskToEdit ? 'Edit Task' : 'Create New Task'}
                </h2>
                <p className="text-[11px] text-gray-500">
                  {taskToEdit ? 'Update task details' : 'Add a new task to your board'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-white/10 text-gray-500 hover:text-white transition-all"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">

            {/* Title */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <FileText className="h-3 w-3 text-indigo-400" />
                Title <span className="text-red-400 normal-case font-normal">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={100}
                placeholder="What needs to be done?"
                className="glass-input text-sm font-medium"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <FileText className="h-3 w-3 text-indigo-400" />
                Description
              </label>
              <textarea
                maxLength={500}
                rows={3}
                placeholder="Add more details..."
                className="glass-input text-sm resize-none leading-relaxed"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Priority + Status grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Priority */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <Flag className="h-3 w-3 text-indigo-400" />
                  Priority
                </label>
                <div className="flex flex-col gap-1.5">
                  {priorityOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, priority: opt.value })}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left"
                      style={{
                        background: formData.priority === opt.value ? opt.bg : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${formData.priority === opt.value ? `${opt.color}40` : 'rgba(255,255,255,0.06)'}`,
                        color: formData.priority === opt.value ? opt.color : '#6B7280',
                        boxShadow: formData.priority === opt.value ? `0 0 12px ${opt.color}20` : 'none',
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: opt.color, boxShadow: formData.priority === opt.value ? `0 0 6px ${opt.color}` : 'none' }}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  <Activity className="h-3 w-3 text-indigo-400" />
                  Status
                </label>
                <div className="flex flex-col gap-1.5">
                  {statusOptions.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, status: opt.value })}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left"
                      style={{
                        background: formData.status === opt.value ? `${opt.color}15` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${formData.status === opt.value ? `${opt.color}40` : 'rgba(255,255,255,0.06)'}`,
                        color: formData.status === opt.value ? opt.color : '#6B7280',
                        boxShadow: formData.status === opt.value ? `0 0 12px ${opt.color}15` : 'none',
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: opt.color, boxShadow: formData.status === opt.value ? `0 0 6px ${opt.color}` : 'none' }}
                      />
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                <Calendar className="h-3 w-3 text-indigo-400" />
                Due Date
              </label>
              <input
                type="date"
                className="glass-input text-sm"
                value={formData.dueDate}
                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1 text-sm font-medium py-2.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary flex-1 text-sm font-semibold py-2.5 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {taskToEdit ? <Edit3 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    {taskToEdit ? 'Save Changes' : 'Create Task'}
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
