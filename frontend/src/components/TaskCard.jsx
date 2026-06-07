import React, { useState } from 'react';
import { Calendar, Clock, Edit2, Trash2, MoreVertical, CheckCircle, ArrowRightCircle, AlertTriangle, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import axios from 'axios';
import toast from 'react-hot-toast';
import TaskModal from './TaskModal';

export default function TaskCard({ task, onTaskUpdate, onTaskDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsMenuOpen(false);
    if (window.confirm('Are you sure you want to delete this task?')) {
      if (onTaskDelete) onTaskDelete(task._id);
      try {
        await axios.delete(`/tasks/${task._id}`);
        toast.success('Task deleted');
      } catch {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (newStatus) => {
    setIsMenuOpen(false);
    setIsLoading(true);
    if (onTaskUpdate) onTaskUpdate({ ...task, status: newStatus });
    try {
      await axios.patch(`/tasks/${task._id}/status`, { status: newStatus });
      toast.success(newStatus === 'Completed' ? '✓ Task completed!' : `Moved to ${newStatus}`);
    } catch {
      if (onTaskUpdate) onTaskUpdate(task);
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Completed';

  const priorityConfig = {
    Low:    { label: 'Low',    color: '#22C55E', bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.25)',  dot: '#22C55E' },
    Medium: { label: 'Medium', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)', dot: '#F59E0B' },
    High:   { label: 'High',   color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.25)',  dot: '#EF4444' },
  };
  const pCfg = priorityConfig[task.priority] || priorityConfig.Medium;

  const leftBorderColor =
    task.status === 'Completed' ? '#22C55E' :
    task.priority === 'High' ? '#EF4444' :
    task.priority === 'Medium' ? '#F59E0B' : '#22C55E';

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: isLoading ? 0.5 : 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.2 }}
        className="relative rounded-xl overflow-hidden group"
        style={{
          background: isOverdue
            ? 'rgba(239, 68, 68, 0.05)'
            : task.status === 'Completed'
              ? 'rgba(34, 197, 94, 0.04)'
              : 'rgba(17, 24, 39, 0.7)',
          border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.06)'}`,
          borderLeft: `3px solid ${leftBorderColor}`,
          backdropFilter: 'blur(12px)',
          boxShadow: isOverdue
            ? '0 2px 16px rgba(239,68,68,0.1)'
            : '0 2px 12px rgba(0,0,0,0.25)',
          pointerEvents: isLoading ? 'none' : 'auto',
          transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
        whileHover={{
          y: -2,
          boxShadow: isOverdue
            ? '0 8px 30px rgba(239,68,68,0.2)'
            : `0 8px 30px rgba(0,0,0,0.35), 0 0 0 1px rgba(99,102,241,0.2)`,
        }}
      >
        {/* Completed overlay strikethrough top bar */}
        {task.status === 'Completed' && (
          <div className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: 'linear-gradient(90deg, #22C55E, #06B6D4)' }} />
        )}

        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <h3
              className={`text-sm font-semibold leading-snug flex-1 ${
                task.status === 'Completed' ? 'line-through text-gray-500' : 'text-white'
              }`}
            >
              {task.title}
            </h3>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {task.status !== 'Completed' && (
                <button
                  onClick={() => handleStatusChange('Completed')}
                  title="Mark complete"
                  className="p-1 rounded-lg hover:bg-green-500/20 text-gray-500 hover:text-green-400 transition-all"
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="p-1 rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition-all"
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 top-full mt-1 w-48 rounded-xl overflow-hidden z-20 py-1.5"
                        style={{
                          background: 'rgba(15, 20, 35, 0.98)',
                          border: '1px solid rgba(99,102,241,0.2)',
                          boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
                          backdropFilter: 'blur(20px)',
                        }}
                      >
                        <button
                          onClick={() => { setIsEditing(true); setIsMenuOpen(false); }}
                          className="w-full text-left px-3.5 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-white flex items-center gap-2.5 transition-all"
                        >
                          <Edit2 className="h-3.5 w-3.5 text-indigo-400" /> Edit Task
                        </button>

                        {task.status !== 'Completed' && (
                          <button
                            onClick={() => handleStatusChange('Completed')}
                            className="w-full text-left px-3.5 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-green-400 flex items-center gap-2.5 transition-all"
                          >
                            <CheckCircle className="h-3.5 w-3.5 text-green-400" /> Mark Complete
                          </button>
                        )}

                        {task.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange('In Progress')}
                            className="w-full text-left px-3.5 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-indigo-400 flex items-center gap-2.5 transition-all"
                          >
                            <ArrowRightCircle className="h-3.5 w-3.5 text-indigo-400" /> Start Progress
                          </button>
                        )}

                        {task.status === 'Completed' && (
                          <button
                            onClick={() => handleStatusChange('Pending')}
                            className="w-full text-left px-3.5 py-2 text-xs text-gray-300 hover:bg-white/10 hover:text-yellow-400 flex items-center gap-2.5 transition-all"
                          >
                            <ArrowRightCircle className="h-3.5 w-3.5 text-yellow-400" /> Reopen
                          </button>
                        )}

                        <div className="my-1 mx-3 border-t border-white/5" />

                        <button
                          onClick={handleDelete}
                          className="w-full text-left px-3.5 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete Task
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Description */}
          {task.description && (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between gap-2 mt-3">
            {/* Priority badge */}
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ background: pCfg.bg, color: pCfg.color, border: `1px solid ${pCfg.border}` }}
            >
              <Flag className="h-2.5 w-2.5" />
              {task.priority}
            </span>

            {/* Due date */}
            {task.dueDate && (
              <div
                className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={isOverdue
                  ? { background: 'rgba(239,68,68,0.12)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#6B7280', border: '1px solid rgba(255,255,255,0.06)' }
                }
              >
                {isOverdue ? <AlertTriangle className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                {format(new Date(task.dueDate), 'MMM d')}
              </div>
            )}
          </div>
        </div>

        {/* Overdue bottom strip */}
        {isOverdue && (
          <div className="px-4 py-1.5 flex items-center gap-1.5"
            style={{ background: 'rgba(239,68,68,0.08)', borderTop: '1px solid rgba(239,68,68,0.15)' }}>
            <AlertTriangle className="h-2.5 w-2.5 text-red-400" />
            <span className="text-[10px] font-semibold text-red-400">Overdue</span>
          </div>
        )}
      </motion.div>

      <TaskModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        taskToEdit={task}
        onTaskUpdate={onTaskUpdate}
      />
    </>
  );
}
