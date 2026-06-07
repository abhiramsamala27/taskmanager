import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ArrowRight, CheckCircle2, Inbox } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const COLUMNS = [
  {
    id: 'Pending',
    label: 'Pending',
    icon: Clock,
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B, #EF4444)',
    glowColor: 'rgba(245, 158, 11, 0.3)',
  },
  {
    id: 'In Progress',
    label: 'In Progress',
    icon: ArrowRight,
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
    glowColor: 'rgba(99, 102, 241, 0.3)',
  },
  {
    id: 'Completed',
    label: 'Completed',
    icon: CheckCircle2,
    color: '#22C55E',
    gradient: 'linear-gradient(135deg, #22C55E, #06B6D4)',
    glowColor: 'rgba(34, 197, 94, 0.3)',
  },
];

function EmptyColumn({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        <Inbox className="h-6 w-6 text-gray-600" />
      </div>
      <p className="text-sm font-medium text-gray-600">No {label} tasks</p>
      <p className="text-xs text-gray-700 mt-1">Tasks will appear here</p>
    </div>
  );
}

export default function TaskList({ tasks, searchQuery, statusFilter, priorityFilter, onTaskUpdate, onTaskDelete }) {
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  // Apply filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchQuery
      ? (task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesStatus = statusFilter && statusFilter !== 'All' ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter && priorityFilter !== 'All' ? task.priority === priorityFilter : true;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Drag handlers
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingId(taskId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(columnId);
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t._id === taskId);
    if (!task || task.status === newStatus) { setDraggingId(null); return; }

    if (onTaskUpdate) onTaskUpdate({ ...task, status: newStatus });
    setDraggingId(null);

    try {
      await axios.patch(`/tasks/${taskId}/status`, { status: newStatus });
      toast.success(`Moved to ${newStatus}`);
    } catch {
      if (onTaskUpdate) onTaskUpdate(task); // revert
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex gap-4 min-h-[520px]">
      {COLUMNS.map((col) => {
        const colTasks = filteredTasks.filter(t => t.status === col.id);
        const isDragTarget = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            className={`kanban-column transition-all duration-200 ${isDragTarget ? 'drag-over' : ''}`}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={() => setDragOverColumn(null)}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            {/* Column Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: col.gradient }}
                >
                  <col.icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white">{col.label}</span>
              </div>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: `${col.glowColor}`,
                  color: col.color,
                  border: `1px solid ${col.color}30`,
                }}
              >
                {colTasks.length}
              </span>
            </div>

            {/* Drop indicator */}
            {isDragTarget && (
              <div
                className="mx-3 mt-3 h-1 rounded-full"
                style={{ background: col.gradient, boxShadow: `0 0 12px ${col.glowColor}` }}
              />
            )}

            {/* Cards */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              <AnimatePresence>
                {colTasks.length > 0 ? (
                  colTasks.map((task, idx) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.04, duration: 0.25 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task._id)}
                      onDragEnd={handleDragEnd}
                      style={{
                        opacity: draggingId === task._id ? 0.4 : 1,
                        cursor: 'grab',
                      }}
                    >
                      <TaskCard
                        task={task}
                        onTaskUpdate={onTaskUpdate}
                        onTaskDelete={onTaskDelete}
                      />
                    </motion.div>
                  ))
                ) : (
                  <EmptyColumn label={col.label} />
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </div>
  );
}
