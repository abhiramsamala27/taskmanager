import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Zap, Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, Check } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const passwordMatch = password && confirmPassword && password === confirmPassword;
  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['', '#EF4444', '#F59E0B', '#22C55E'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    setIsLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created! Welcome aboard 🎉');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  const perks = [
    'Unlimited tasks & projects',
    'Real-time collaboration',
    'Kanban board & calendar',
    'Analytics & insights',
  ];

  return (
    <div
      className="min-h-screen flex items-stretch relative overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/4 -right-1/4 w-[60%] h-[60%] rounded-full opacity-20 blur-[120px] animate-orb-1"
          style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-1/4 -left-1/4 w-[50%] h-[50%] rounded-full opacity-15 blur-[100px] animate-orb-2"
          style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 right-1/3 w-[30%] h-[30%] rounded-full opacity-10 blur-[80px]"
          style={{ background: 'radial-gradient(circle, #06B6D4 0%, transparent 70%)' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,1) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="flex w-full items-center justify-center p-6 relative z-10">
        {/* Register form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
            <div
              className="p-8 rounded-3xl"
              style={{
                background: 'rgba(13, 17, 28, 0.9)',
                border: '1px solid rgba(139,92,246,0.2)',
                boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.02)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Top bar */}
              <div className="h-0.5 w-1/2 mx-auto mb-8 rounded-full"
                style={{ background: 'linear-gradient(90deg, #8B5CF6, #06B6D4)' }} />

              {/* Logo */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}>
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="font-bold gradient-text">TaskMaster</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-1">Create account</h2>
              <p className="text-sm text-gray-500 mb-7">Join thousands of professionals today.</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    <input
                      id="register-name"
                      type="text"
                      required
                      placeholder="John Doe"
                      className="glass-input pl-10 text-sm"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    <input
                      id="register-email"
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
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    <input
                      id="register-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Min. 6 characters"
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
                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex gap-1 flex-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{
                              background: passwordStrength >= level
                                ? strengthColors[passwordStrength]
                                : 'rgba(255,255,255,0.06)',
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-semibold" style={{ color: strengthColors[passwordStrength] }}>
                        {strengthLabels[passwordStrength]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600 pointer-events-none" />
                    <input
                      id="register-confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      className="glass-input pl-10 pr-10 text-sm"
                      style={{
                        borderColor: confirmPassword
                          ? passwordMatch
                            ? 'rgba(34,197,94,0.4)'
                            : 'rgba(239,68,68,0.4)'
                          : undefined,
                      }}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                    >
                      {confirmPassword && passwordMatch
                        ? <Check className="h-4 w-4 text-green-400" />
                        : showConfirm
                          ? <EyeOff className="h-4 w-4" />
                          : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  id="register-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #8B5CF6, #06B6D4)' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-violet-400 font-semibold hover:text-violet-300 transition-colors"
                  >
                    Sign in →
                  </Link>
                </p>
              </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
}
