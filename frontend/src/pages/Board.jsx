import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  Plus, Search, Filter, Download, X,
} from 'lucide-react';

export default function Board() {
  const [tasks, setTasks]               = useState([]);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [showFilters, setShowFilters]   = useState(false);
  const { user } = useAuth();
  const socket = useSocket();
  const filterRef = useRef(null);

  /* Fetch */
  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchTasks(); }, []);

  /* Mobile FAB */
  useEffect(() => {
    const h = () => setIsModalOpen(true);
    window.addEventListener('openNewTaskModal', h);
    return () => window.removeEventListener('openNewTaskModal', h);
  }, []);

  /* Click-outside filter panel */
  useEffect(() => {
    const h = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setShowFilters(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* Socket */
  useEffect(() => {
    if (!socket) return;
    socket.on('taskCreated', t => setTasks(p => [t, ...p]));
    socket.on('taskUpdated', t => setTasks(p => p.map(x => x._id === t._id ? t : x)));
    socket.on('taskDeleted', id => setTasks(p => p.filter(x => x._id !== id)));
    return () => { socket.off('taskCreated'); socket.off('taskUpdated'); socket.off('taskDeleted'); };
  }, [socket]);

  const handleOptimisticUpdate = (t) =>
    setTasks(p => p.some(x => x._id === t._id) ? p.map(x => x._id === t._id ? { ...x, ...t } : x) : [t, ...p]);

  const handleOptimisticDelete = (id) =>
    setTasks(p => p.filter(x => x._id !== id));

  /* Export */
  const exportTasks = () => {
    const csv = ['Title,Status,Priority,Due Date',
      ...tasks.map(t => `"${t.title}","${t.status}","${t.priority}","${t.dueDate ? format(new Date(t.dueDate), 'yyyy-MM-dd') : ''}"`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'tasks.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const hasActiveFilters = statusFilter !== 'All' || priorityFilter !== 'All';

  return (
    <div className="space-y-5 pb-8">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Board</h1>
          <p className="text-sm text-gray-500 mt-0.5">{tasks.length} tasks total</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="board-export-btn"
            onClick={exportTasks}
            className="btn-secondary flex items-center gap-1.5 text-sm"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            id="board-new-task-btn"
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-1.5 text-sm"
          >
            <Plus className="h-4 w-4" />
            New Task
          </button>
        </div>
      </motion.div>

      {/* ── Search + Filter Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="flex gap-2 items-center"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="glass-input pl-9 pr-8 text-sm w-full"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="relative" ref={filterRef}>
          <button
            id="board-filter-btn"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn-secondary flex items-center gap-1.5 text-sm ${hasActiveFilters ? 'border-indigo-500/50 text-indigo-400' : ''}`}
          >
            <Filter className="h-4 w-4" />
            Filter
            {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 top-full mt-2 w-60 rounded-xl z-30 p-4 space-y-4"
                style={{
                  background: 'rgba(15, 18, 30, 0.98)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Status</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Pending', 'In Progress', 'Completed'].map(s => (
                      <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                          statusFilter === s ? 'bg-indigo-500 text-white' : 'text-gray-400 hover:text-white bg-white/[0.05]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">Priority</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['All', 'Low', 'Medium', 'High'].map(p => (
                      <button
                        key={p}
                        onClick={() => setPriorityFilter(p)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                          priorityFilter === p ? 'bg-violet-500 text-white' : 'text-gray-400 hover:text-white bg-white/[0.05]'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={() => { setStatusFilter('All'); setPriorityFilter('All'); }}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Kanban Board ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.35 }}
      >
        <TaskList
          tasks={tasks}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          priorityFilter={priorityFilter}
          onTaskUpdate={handleOptimisticUpdate}
          onTaskDelete={handleOptimisticDelete}
        />
      </motion.div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskUpdate={handleOptimisticUpdate}
      />
    </div>
  );
}
