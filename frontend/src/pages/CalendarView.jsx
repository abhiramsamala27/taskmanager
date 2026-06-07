import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CalendarView() {
  const [tasks, setTasks] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/tasks');
        setTasks(res.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

  const priorityColors = {
    High: '#EF4444',
    Medium: '#F59E0B',
    Low: '#22C55E',
  };

  const tasksByDay = (day) =>
    tasks.filter(
      (t) => t.dueDate && isSameDay(new Date(t.dueDate), day)
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Calendar</h1>
        <p className="text-sm text-gray-500 mt-1">View and manage tasks by due date.</p>
      </motion.div>

      {/* Calendar Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel overflow-hidden"
      >
        {/* Calendar Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid rgba(99,102,241,0.1)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            >
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <p className="text-xs text-gray-500">Week view</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all"
              style={{
                background: 'rgba(99,102,241,0.12)',
                border: '1px solid rgba(99,102,241,0.2)',
                color: '#818CF8',
              }}
            >
              Today
            </button>
            <button
              onClick={() => setCurrentDate(addDays(currentDate, -7))}
              className="p-2 rounded-xl hover:bg-white/10 text-gray-500 hover:text-white transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentDate(addDays(currentDate, 7))}
              className="p-2 rounded-xl hover:bg-white/10 text-gray-500 hover:text-white transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day columns */}
        <div className="p-4">
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((day, idx) => {
              const dayTasks = tasksByDay(day);
              const isToday = isSameDay(day, new Date());
              const isWeekend = idx === 5 || idx === 6;

              return (
                <motion.div
                  key={day.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col min-h-[180px] rounded-2xl overflow-hidden"
                  style={{
                    background: isToday
                      ? 'rgba(99,102,241,0.08)'
                      : isWeekend
                        ? 'rgba(255,255,255,0.015)'
                        : 'rgba(255,255,255,0.025)',
                    border: isToday
                      ? '1px solid rgba(99,102,241,0.35)'
                      : '1px solid rgba(255,255,255,0.05)',
                    boxShadow: isToday ? '0 0 20px rgba(99,102,241,0.12)' : 'none',
                  }}
                >
                  {/* Day header */}
                  <div
                    className="px-3 py-2.5 text-center"
                    style={{ borderBottom: `1px solid ${isToday ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)'}` }}
                  >
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isToday ? 'text-indigo-400' : 'text-gray-600'}`}>
                      {format(day, 'EEE')}
                    </p>
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center mx-auto text-sm font-bold transition-all ${
                        isToday ? 'text-white' : 'text-gray-400'
                      }`}
                      style={isToday
                        ? { background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }
                        : {}
                      }
                    >
                      {format(day, 'd')}
                    </div>
                  </div>

                  {/* Tasks */}
                  <div className="flex-1 p-2 space-y-1.5 overflow-y-auto">
                    {dayTasks.length > 0 ? (
                      dayTasks.map((task) => {
                        const isOverdue = task.status !== 'Completed' && new Date(task.dueDate) < new Date();
                        const pColor = priorityColors[task.priority] || '#6366F1';
                        return (
                          <motion.div
                            key={task._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-lg px-2 py-1.5 cursor-default"
                            style={{
                              background: isOverdue
                                ? 'rgba(239,68,68,0.1)'
                                : `${pColor}10`,
                              border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.2)' : `${pColor}25`}`,
                            }}
                            title={task.title}
                          >
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                style={{ background: isOverdue ? '#EF4444' : pColor }}
                              />
                              <p className="text-[10px] font-medium truncate"
                                style={{ color: isOverdue ? '#EF4444' : pColor }}>
                                {task.title}
                              </p>
                            </div>
                            {task.status === 'Completed' && (
                              <p className="text-[9px] text-green-500 mt-0.5">✓ Done</p>
                            )}
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="flex items-center justify-center h-full py-4">
                        <Circle className="h-4 w-4 text-gray-800" />
                      </div>
                    )}
                  </div>

                  {/* Task count badge */}
                  {dayTasks.length > 0 && (
                    <div
                      className="text-center py-1.5 text-[10px] font-semibold"
                      style={{
                        borderTop: `1px solid ${isToday ? 'rgba(99,102,241,0.15)' : 'rgba(255,255,255,0.04)'}`,
                        color: isToday ? '#818CF8' : '#4B5563',
                      }}
                    >
                      {dayTasks.length} task{dayTasks.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div
          className="px-6 py-3 flex items-center gap-6"
          style={{ borderTop: '1px solid rgba(99,102,241,0.08)' }}
        >
          <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider">Priority:</p>
          {[['High', '#EF4444'], ['Medium', '#F59E0B'], ['Low', '#22C55E']].map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[11px] text-gray-500">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
