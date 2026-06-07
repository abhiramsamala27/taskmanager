import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Calendar, User, LogOut, ChevronLeft, ChevronRight, Zap, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onMobileClose }) {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', description: 'Overview & stats' },
    { name: 'Calendar', icon: Calendar, path: '/calendar', description: 'Due dates' },
    { name: 'Profile', icon: User, path: '/profile', description: 'Your account' },
  ];

  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 ${collapsed && !isMobile ? 'justify-center' : ''}`}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 relative"
          style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
        >
          <Zap className="h-5 w-5 text-white" />
          <div className="absolute inset-0 rounded-xl animate-glow-pulse" />
        </div>
        <AnimatePresence>
          {(!collapsed || isMobile) && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="font-bold text-lg gradient-text whitespace-nowrap">TaskMaster</span>
              <p className="text-[10px] text-gray-500 whitespace-nowrap">Pro Dashboard</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={onMobileClose}
            className="ml-auto p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent mb-2" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        {!collapsed || isMobile ? (
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider px-3 mb-3">
            Navigation
          </p>
        ) : null}

        {navItems.map((item, index) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={isMobile ? onMobileClose : undefined}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''} ${collapsed && !isMobile ? 'justify-center px-0' : ''}`
            }
            title={collapsed && !isMobile ? item.name : undefined}
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-gray-500'
                  }`}
                />
                <AnimatePresence>
                  {(!collapsed || isMobile) && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden flex-1 min-w-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium whitespace-nowrap">{item.name}</span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-gray-600 whitespace-nowrap">{item.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />

      {/* User Profile Card */}
      <div className={`p-3 ${collapsed && !isMobile ? 'flex flex-col items-center gap-2' : ''}`}>
        {(!collapsed || isMobile) && (
          <div
            className="flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer"
            style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.15)' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
            </div>
            <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" title="Online" />
          </div>
        )}

        {/* Logout button */}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
            collapsed && !isMobile ? 'justify-center' : ''
          }`}
          style={{
            background: 'rgba(239, 68, 68, 0.05)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
          }}
          title={collapsed && !isMobile ? 'Logout' : undefined}
        >
          <LogOut className="h-4 w-4 text-red-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
          <AnimatePresence>
            {(!collapsed || isMobile) && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium text-red-400 whitespace-nowrap overflow-hidden"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex fixed top-0 left-0 h-full z-50 flex-col overflow-hidden"
        style={{
          background: 'rgba(10, 10, 15, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(99, 102, 241, 0.12)',
          boxShadow: '4px 0 30px rgba(0, 0, 0, 0.4)',
        }}
      >
        <SidebarContent />

        {/* Collapse Toggle */}
        <button
          onClick={onToggleCollapse}
          className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full flex items-center justify-center text-white z-10 shadow-lg transition-all hover:scale-110"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </motion.aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden fixed top-0 left-0 h-full z-50 w-[280px] flex flex-col"
              style={{
                background: 'rgba(10, 10, 15, 0.98)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(99, 102, 241, 0.15)',
                boxShadow: '4px 0 40px rgba(0, 0, 0, 0.6)',
              }}
            >
              <SidebarContent isMobile={true} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
