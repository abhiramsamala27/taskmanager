import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import TaskModal from '../components/TaskModal';
import TaskCard from '../components/TaskCard';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  CheckCircle2, Clock, AlertTriangle, Layers, Plus, Inbox,
} from 'lucide-react';

/* ─── Animated counter ──────────────────────────────── */
function Counter({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    let v = 0;
    const step = target / 30;
    const t = setInterval(() => {
      v += step;
      if (v >= target) { setVal(target); clearInterval(t); }
      else setVal(Math.floor(v));
    }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <>{val}</>;
}

/* ─── Stat card ─────────────────────────────────────── */
function StatCard({ label, value, icon: Icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="rounded-2xl p-5 flex items-center gap-4"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white leading-none">
          <Counter target={value} />
        </p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    </motion.div>
  );
}

/* ─── Section panel ─────────────────────────────────── */
function Section({ title, icon: Icon, iconColor, tasks, emptyMsg, delay, onTaskUpdate, onTaskDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2.5 px-5 py-4 border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}
        >
          <Icon className="h-3.5 w-3.5" style={{ color: iconColor }} />
        </div>
        <span className="text-sm font-semibold text-white">{title}</span>
        <span
          className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
          style={{ background: `${iconColor}15`, color: iconColor }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 440 }}>
        <AnimatePresence>
          {tasks.length > 0 ? (
            tasks.map((task, i) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.04, duration: 0.22 }}
              >
                <TaskCard
                  task={task}
                  onTaskUpdate={onTaskUpdate}
                  onTaskDelete={onTaskDelete}
                />
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Inbox className="h-9 w-9 text-gray-700 mb-3" />
              <p className="text-sm text-gray-600 font-medium">{emptyMsg}</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Dashboard ─────────────────────────────────────── */
export default function Dashboard() {
  const [tasks, setTasks]             = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user }  = useAuth();
  const socket    = useSocket();

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

  /* Socket */
  useEffect(() => {
    if (!socket) return;
    socket.on('taskCreated', t  => setTasks(p => [t, ...p]));
    socket.on('taskUpdated', t  => setTasks(p => p.map(x => x._id === t._id ? t : x)));
    socket.on('taskDeleted', id => setTasks(p => p.filter(x => x._id !== id)));
    return () => {
      socket.off('taskCreated');
      socket.off('taskUpdated');
      socket.off('taskDeleted');
    };
  }, [socket]);

  const handleOptimisticUpdate = (t) =>
    setTasks(p => p.some(x => x._id === t._id) ? p.map(x => x._id === t._id ? { ...x, ...t } : x) : [t, ...p]);

  const handleOptimisticDelete = (id) =>
    setTasks(p => p.filter(x => x._id !== id));

  /* Split tasks */
  const activeTasks    = tasks.filter(t => t.status !== 'Completed');
  const completedTasks = tasks.filter(t => t.status === 'Completed');
  const overdueTasks   = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed').length;

  /* Greeting */
  const now   = new Date();
  const hour  = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name?.split(' ')[0] || 'there';

  const stats = [
    { label: 'Total Tasks', value: tasks.length,       icon: Layers,       color: '#6366F1', delay: 0.05 },
    { label: 'Active',      value: activeTasks.length, icon: Clock,        color: '#06B6D4', delay: 0.10 },
    { label: 'Completed',   value: completedTasks.length, icon: CheckCircle2, color: '#22C55E', delay: 0.15 },
    { label: 'Overdue',     value: overdueTasks,        icon: AlertTriangle, color: '#EF4444', delay: 0.20 },
  ];

  return (
    <div className="space-y-6 pb-8">

      {/* ── Greeting ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm text-indigo-400 font-medium mb-1">{greeting} ✦</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Welcome back, <span className="gradient-text">{firstName}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {format(now, 'EEEE, MMMM d')} · {activeTasks.length} active, {overdueTasks} overdue
          </p>
        </div>

        <button
          id="dashboard-new-task-btn"
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2 text-sm whitespace-nowrap flex-shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Task
        </button>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* ── Tasks & Completed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Section
          title="Tasks"
          icon={Clock}
          iconColor="#6366F1"
          tasks={activeTasks}
          emptyMsg="No active tasks"
          delay={0.28}
          onTaskUpdate={handleOptimisticUpdate}
          onTaskDelete={handleOptimisticDelete}
        />
        <Section
          title="Completed"
          icon={CheckCircle2}
          iconColor="#22C55E"
          tasks={completedTasks}
          emptyMsg="No completed tasks yet"
          delay={0.34}
          onTaskUpdate={handleOptimisticUpdate}
          onTaskDelete={handleOptimisticDelete}
        />
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTaskUpdate={handleOptimisticUpdate}
      />
    </div>
  );
}
