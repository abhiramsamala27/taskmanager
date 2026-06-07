import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 👋');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: '⚡', text: 'Real-time task sync' },
    { icon: '📊', text: 'Analytics dashboard' },
    { icon: '🗓️', text: 'Calendar integration' },
    { icon: '🎯', text: 'Priority management' },
  ];

  return (
    <div
      className="min-h-screen flex items-stretch relative overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/4 -left-1/4 w-[60%] h-[60%] rounded-full opacity-20 blur-[120px] animate-orb-1"
          style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 w-[50%] h-[50%] rounded-full opacity-15 blur-[100px] animate-orb-2"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="flex w-full items-center justify-center p-6 relative z-10">
        {/* Login form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-md mx-auto"
        >
            {/* Card */}
            <div
              className="p-8 rounded-3xl"
              style={{
                background: 'rgba(13, 17, 28, 0.9)',
                border: '1px solid rgba(99,102,241,0.2)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Top bar */}
              <div className="h-0.5 w-1/2 mx-auto mb-8 rounded-full"
                style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6)' }} />

              {/* Logo (mobile) */}
              <div className="lg:hidden flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold gradient-text">TaskMaster</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
              <p className="text-sm text-gray-500 mb-8">Welcome back! Enter your credentials below.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    <input
                      id="login-email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      className="glass-input pl-10 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="glass-input pl-10 pr-10 text-sm"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                  >
                    Create one free →
                  </Link>
                </p>
              </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
