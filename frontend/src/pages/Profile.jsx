import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar as CalendarIcon, Save, Loader2, Shield, Star, Clock } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800)); // simulate save
    toast.success('Profile updated successfully');
    setIsEditing(false);
    setIsSaving(false);
  };

  if (!user) return null;

  const stats = [
    { icon: CalendarIcon, label: 'Member Since', value: user.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'Unknown', color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
    { icon: Shield, label: 'Account Status', value: 'Active', color: '#22C55E', bg: 'rgba(34,197,94,0.1)' },
    { icon: Star, label: 'Member Tier', value: 'Pro', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { icon: Clock, label: 'Last Active', value: 'Today', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your personal information and preferences.</p>
      </motion.div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-panel overflow-hidden"
      >
        {/* Gradient Banner */}
        <div
          className="h-36 relative"
          style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)' }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-30 blur-2xl"
            style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }} />
          <div className="absolute bottom-0 left-20 w-24 h-24 rounded-full opacity-20 blur-2xl"
            style={{ background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />

          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Edit button */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: isEditing ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.12)',
                border: isEditing ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(255,255,255,0.2)',
                color: isEditing ? '#EF4444' : 'white',
                backdropFilter: 'blur(8px)',
              }}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        {/* Avatar overlap */}
        <div className="relative px-8 pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-6">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 relative"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                border: '3px solid rgba(13,17,28,1)',
                boxShadow: '0 8px 30px rgba(99,102,241,0.4)',
              }}
            >
              {user.name.charAt(0).toUpperCase()}
              {/* Online dot */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2"
                style={{ borderColor: 'rgba(13,17,28,1)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto"
              style={{ background: 'rgba(245,158,11,0.12)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
              <Star className="h-3 w-3" /> Pro Member
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-xl flex flex-col gap-2"
                style={{ background: stat.bg, border: `1px solid ${stat.color}25` }}
              >
                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                <div>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                  <p className="text-sm font-bold text-white mt-0.5">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Form */}
          {isEditing && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4 pt-6"
              style={{ borderTop: '1px solid rgba(99,102,241,0.12)' }}
            >
              <h3 className="text-sm font-semibold text-white">Edit Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    <input
                      type="text"
                      className="glass-input pl-10 text-sm"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    <input
                      type="email"
                      className="glass-input pl-10 text-sm"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary flex items-center gap-2 text-sm px-6 py-2.5 disabled:opacity-60"
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </motion.form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
