/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useEffect, useState} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  ArrowRight, 
  TrendingUp, 
  Zap, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  ArrowLeft,
  Copy,
  ShieldCheck,
  History,
  AlertTriangle
} from 'lucide-react';
import { Button } from './components/Button';
import { Input } from './components/Input';
import { Card } from './components/Card';
import { Navbar } from './components/Navbar';
import { cn } from './lib/utils';
import { apiUrl } from './lib/api';


type Screen = 
  | 'LOGIN' 
  | 'SIGNUP' 
  | 'USER_DASHBOARD' 
  | 'ADMIN_DASHBOARD' 
  | 'TOKENS_LIST' 
  | 'TOKEN_DETAILS' 
  | 'TOKEN_ROTATE_CONFIRM'
  | 'TOKEN_DELETE_CONFIRM'
  | 'TOKEN_CREATED_SUCCESS'
  | 'TOKEN_ROTATED_SUCCESS'
  | 'TOKEN_DELETED_SUCCESS'
  | 'USER_EDIT'
  | 'USER_DELETE_CONFIRM'
  | 'USER_EDIT_SUCCESS'
  | 'USER_DELETED_SUCCESS';

export default function App() {
  const [screen, setScreen] = useState<Screen>('LOGIN');
  const [role, setRole] = useState<string>('user');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<{
    username: string;
    email: string;
    role: string;
    daily_token_limit: number;
  } | null>(null);

  useEffect(() => {
    fetch(apiUrl('/client/user'), { credentials: 'include' })
        .then(res => {
          if (res.ok) return res.json();
        })
        .then(data => {
          setRole('admin');
          if (data?.role === 'admin') {
            setScreen('ADMIN_DASHBOARD');
          } else if (data?.role === 'user') {
            setRole('user');
            setScreen('USER_DASHBOARD');
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
  }, []);

  const navigateToDashboard = (role: string) => {
    setRole(role);
    if (role === 'admin') {
      setScreen('ADMIN_DASHBOARD');
    } else {
      setScreen('USER_DASHBOARD');
    }
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'tokens') return setScreen('TOKENS_LIST');
    if (tab === 'dashboard' || tab === 'admin') {
      return setScreen(role === 'admin' ? 'ADMIN_DASHBOARD' : 'USER_DASHBOARD');
    }
  };

  async function handleLogout() {
    await fetch(apiUrl('/client/logout'), {
      method: 'POST',
      credentials: 'include'
    });
    setScreen('LOGIN');
    setRole('user');
  }

  const renderScreen = () => {
    switch (screen) {
      case 'LOGIN': return <LoginScreen onLogin={navigateToDashboard} onSignUp={() => setScreen('SIGNUP')} />;
      case 'SIGNUP': return <SignUpScreen onSignUp={navigateToDashboard} onLogin={() => setScreen('LOGIN')} />;
      case 'USER_DASHBOARD': return <UserDashboard onTabChange={handleTabChange}  onLogout={handleLogout} />;
      case 'ADMIN_DASHBOARD': return <AdminDashboard onTabChange={handleTabChange} onEditUser={(user) => { setSelectedUser(user); setScreen('USER_EDIT'); }} onDeleteUser={(user) => { setSelectedUser(user); setScreen('USER_DELETE_CONFIRM'); }} onLogout={handleLogout} />;
      case 'TOKENS_LIST': return <TokensList onTabChange={handleTabChange} onSelectToken={() => setScreen('TOKEN_DETAILS')} onCreateToken={() => setShowModal(true)} onLogout={handleLogout} />;
      case 'TOKEN_DETAILS': return <TokenDetails onBack={() => setScreen('TOKENS_LIST')} onRotate={() => setScreen('TOKEN_ROTATE_CONFIRM')} onDelete={() => setScreen('TOKEN_DELETE_CONFIRM')}  onLogout = {handleLogout} />;
      case 'TOKEN_ROTATE_CONFIRM': return <TokenRotateConfirm onCancel={() => setScreen('TOKEN_DETAILS')} onConfirm={() => setScreen('TOKEN_ROTATED_SUCCESS')} />;
      case 'TOKEN_DELETE_CONFIRM': return <TokenDeleteConfirm onCancel={() => setScreen('TOKEN_DETAILS')} onConfirm={() => setScreen('TOKEN_DELETED_SUCCESS')} />;
      case 'TOKEN_CREATED_SUCCESS': return <TokenCreatedSuccess onDone={() => setScreen('TOKENS_LIST')} />;
      case 'TOKEN_ROTATED_SUCCESS': return <TokenRotatedSuccess onDone={() => setScreen('TOKENS_LIST')} />;
      case 'TOKEN_DELETED_SUCCESS': return <TokenDeletedSuccess onDone={() => setScreen('TOKENS_LIST')} />;
      case 'USER_EDIT': return <UserEditScreen user={selectedUser} onCancel={() => setScreen('ADMIN_DASHBOARD')} onConfirm={() => setScreen('USER_EDIT_SUCCESS')} />;
      case 'USER_DELETE_CONFIRM': return <UserDeleteConfirmScreen user={selectedUser} onCancel={() => setScreen('ADMIN_DASHBOARD')} onConfirm={() => setScreen('USER_DELETED_SUCCESS')} />;
      case 'USER_EDIT_SUCCESS': return <UserEditSuccess onDone={() => setScreen('ADMIN_DASHBOARD')} />;
      case 'USER_DELETED_SUCCESS': return <UserDeletedSuccess onDone={() => setScreen('ADMIN_DASHBOARD')} />;
      default: return <LoginScreen onLogin={navigateToDashboard} onSignUp={() => setScreen('SIGNUP')} />;
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-40">
        <div className="absolute top-1/4 -left-20 w-[40rem] h-[40rem] bg-blue-50 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 -right-20 w-[30rem] h-[30rem] bg-blue-100/30 rounded-full blur-[100px]"></div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>

      {/* Create Token Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/10 backdrop-blur-sm px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg glass-effect rounded-2xl shadow-[0_20px_40px_rgba(0,61,155,0.06)] overflow-hidden"
            >
              <div className="px-8 pt-8 pb-4 flex justify-between items-start">
                <div className="space-y-1">
                  <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight">Create New Token</h2>
                  <p className="font-sans text-sm text-on-surface-variant">Configure a new secure access key for your application environment.</p>
                </div>
              </div>
              <div className="px-8 py-6 space-y-6">
                <Input label="Token Name" placeholder="e.g. Production Read-Only" />
                <div className="bg-surface-container-low rounded-xl p-4 flex gap-4 items-start">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-on-surface">Security Policy</p>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Generated tokens are displayed only once. Ensure you copy and store the key in a secure vault before closing the next screen.</p>
                  </div>
                </div>
              </div>
              <div className="px-8 py-6 bg-surface-container-low/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                <Button variant="tertiary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button onClick={() => { setShowModal(false); setScreen('TOKEN_CREATED_SUCCESS'); }}>Generate Token</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Screens ---

function LoginScreen({ onLogin, onSignUp }: { onLogin: (role: string) => void; onSignUp: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/client/login'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        onLogin(data.role);
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Could not reach server');
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:flex flex-col space-y-8 pr-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-6">
                <LightbulbIcon className="text-primary w-8 h-8" />
                <h1 className="font-headline font-extrabold tracking-tighter text-primary text-2xl">Lumina API</h1>
              </div>
              <h2 className="font-headline font-extrabold text-5xl text-on-surface tracking-tight leading-tight">
                Illuminate your <br />
                <span className="text-primary">developer experience.</span>
              </h2>
              <p className="text-on-surface-variant text-lg leading-relaxed max-w-md">
                The world's most performant SmartBulb orchestration engine. Connect, automate, and scale your lighting infrastructure with editorial precision.
              </p>
            </div>
            <div className="bg-on-surface rounded-xl p-6 shadow-xl border-l-4 border-primary">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Authentication v2.4</span>
              </div>
              <code className="font-mono text-sm text-blue-200">
                <span className="text-blue-400">POST</span> /auth/session <br />
                {'{'} <br />
                &nbsp;&nbsp;<span className="text-blue-300">"grant_type"</span>: <span className="text-green-300">"password"</span>, <br />
                &nbsp;&nbsp;<span className="text-blue-300">"scope"</span>: <span className="text-green-300">"orchestrate:all"</span> <br />
                {'}'}
              </code>
            </div>
          </div>
          <div className="w-full flex justify-center lg:justify-end">
            <Card className="w-full max-w-md p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <div className="mb-10 text-center lg:text-left">
                  <h2 className="font-headline font-bold text-3xl text-on-surface tracking-tight">Welcome back</h2>
                  <p className="text-on-surface-variant text-sm mt-2">Sign in to manage your Lumina credentials.</p>
                </div>
                <form className="space-y-6" onSubmit={handleLogin}>
                  <Input
                      label="Email Address"
                      icon={<Mail className="w-4 h-4" />}
                      placeholder="dev@lumina.api"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                  />
                  <div className="space-y-2">
                    <div className="flex justify-between items-center px-1">
                      <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Password</label>
                      <button type="button" className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">Forgot secret?</button>
                    </div>
                    <Input
                        icon={<Lock className="w-4 h-4" />}
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center px-1">
                    <input type="checkbox" id="remember" className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary" />
                    <label htmlFor="remember" className="ml-2 text-sm text-on-surface-variant">Keep me logged in for 30 days</label>
                  </div>

                  {error && (
                      <p className="text-red-500 text-sm px-1">{error}</p>
                  )}

                  <Button className="w-full" type="submit" disabled={loading}>
                    {loading ? 'Authorizing...' : 'Authorize Session'} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
                <div className="mt-10 text-center">
                  <p className="text-on-surface-variant text-sm">
                    New to the ecosystem?
                    <button onClick={onSignUp} className="text-primary font-bold hover:underline ml-1">Create an API Account</button>
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
}


function SignUpScreen({ onSignUp, onLogin }: { onSignUp: (role: string) => void; onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/client/register'), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, confirmPassword })
      });

      if (res.ok) {
        const data = await res.json();
        onSignUp(data.role);
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Could not reach server');
    } finally {
      setLoading(false);
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md p-8 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <div className="mb-8 text-center">
              <LightbulbIcon className="text-primary w-10 h-10 mx-auto mb-4" />
              <h2 className="font-headline font-bold text-3xl text-on-surface tracking-tight">Create Account</h2>
              <p className="text-on-surface-variant text-sm mt-2">Join the Lumina developer ecosystem.</p>
            </div>
            <form className="space-y-5" onSubmit={handleSignUp}>
              <Input
                  label="Username"
                  icon={<User className="w-4 h-4" />}
                  placeholder="architect_dev"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
              />
              <Input
                  label="Email Address"
                  icon={<Mail className="w-4 h-4" />}
                  placeholder="dev@lumina.io"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
              />
              <Input
                  label="Password"
                  icon={<Lock className="w-4 h-4" />}
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
              />
              <Input
                  label="Confirm Password"
                  icon={<Lock className="w-4 h-4" />}
                  placeholder="••••••••"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
              />

              {error && (
                  <p className="text-red-500 text-sm px-1">{error}</p>
              )}

              <Button className="w-full mt-4" type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
            <div className="mt-8 text-center">
              <p className="text-on-surface-variant text-sm">
                Already have an account?
                <button onClick={onLogin} className="text-primary font-bold hover:underline ml-1">Login here</button>
              </p>
            </div>
          </div>
        </Card>
      </div>
  );
}

function UserDashboard({ onTabChange, onLogout }: { onTabChange: (tab: string) => void; onLogout: () => void }) {
  const [user, setUser] = useState<{
    username: string;
    email: string;
    role: string;
    daily_token_limit: number;
    daily_tokens_consumed: number;
  } | null>(null);

  useEffect(() => {
    fetch(apiUrl('/client/user'), { credentials: 'include' })
        .then(res => {
          if (!res.ok) throw new Error('Unauthorized');
          return res.json();
        })
        .then(data => setUser(data))
        .catch(() => setUser(null));
  }, []);

  const tokensRemaining = user ? user.daily_token_limit - user.daily_tokens_consumed : 0;
  const percentRemaining = user ? Math.round((tokensRemaining / user.daily_token_limit) * 100) : 0;

  return (
      <div className="pb-32">
        <Navbar activeTab="dashboard" onTabChange={onTabChange} onLogout={onLogout} />
        <main className="pt-24 px-6 max-w-7xl mx-auto">
          <section className="mb-12">
            <h2 className="font-headline text-3xl md:text-5xl font-bold text-on-surface mb-2 tracking-tight">
              Welcome back, {user ? user.username : '...'}.
            </h2>
          </section>
          {user && percentRemaining <= 10 && (
              <div className="mb-6 flex items-center gap-4 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-bold text-sm">You're running low on daily credits</p>
                  <p className="text-xs mt-0.5 text-red-500">You've used {user.daily_tokens_consumed.toLocaleString()} of your {user.daily_token_limit.toLocaleString()} daily credits. Your limit resets at midnight.</p>
                </div>
              </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <Card className="md:col-span-8 p-8 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-primary mb-1 block">API Usage</span>
                    <h3 className="font-headline text-2xl font-bold">Daily Credit Balance</h3>
                  </div>
                  <TrendingUp className="text-primary w-6 h-6" />
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                  <span className="text-4xl font-headline font-extrabold text-on-surface">
                    {user ? tokensRemaining.toLocaleString() : '...'}{' '}
                    <span className="text-lg font-medium text-on-surface-variant">
                      / {user ? user.daily_token_limit.toLocaleString() : '...'}
                    </span>
                  </span>
                    <span className="text-primary font-bold text-sm">
                    {user ? `${percentRemaining}% Remaining` : '...'}
                  </span>
                  </div>
                  <div className="h-3 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                        className="h-full primary-gradient rounded-full transition-all duration-500"
                        style={{ width: user ? `${percentRemaining}%` : '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="md:col-span-4 bg-primary-container rounded-2xl p-8 text-white flex flex-col justify-between overflow-hidden relative shadow-lg">
              <div className="relative z-10">
                <h3 className="font-headline text-2xl font-bold mb-4">Start Building</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-8">Explore our comprehensive guides to integrate Lumina API into your smart home ecosystem.</p>
              </div>
              <div className="space-y-3 relative z-10">
                <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-xl group text-sm font-bold">
                  <span>Quickstart Guide</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/20 transition-colors p-4 rounded-xl group text-sm font-bold">
                  <span>Endpoint Reference</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </div>

            <Card variant="lowest" className="md:col-span-12 border-2 border-dashed border-outline-variant/40 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6 text-center md:text-left">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                  <Lock className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-headline text-2xl font-bold">Manage API Tokens</h3>
                  <p className="text-on-surface-variant text-base mt-2 max-w-md">Securely view, create, and rotate your API keys on the dedicated Tokens page to keep your applications running safely.</p>
                </div>
              </div>
              <Button size="lg" onClick={() => onTabChange('tokens')}>
                Go to Tokens Page <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Card>
          </div>
        </main>
        <button className="fixed bottom-24 right-6 md:bottom-8 md:right-8 w-14 h-14 primary-gradient text-white rounded-full shadow-xl flex items-center justify-center z-40 active:scale-95 transition-transform">
          <Zap className="w-6 h-6 fill-current" />
        </button>
      </div>
  );
}

function AdminDashboard({ onTabChange, onEditUser, onDeleteUser, onLogout }: {
  onTabChange: (tab: string) => void;
  onEditUser: (user: { username: string; email: string; role: string; daily_token_limit: number }) => void;
  onDeleteUser: (user: { username: string; email: string; role: string; daily_token_limit: number }) => void;
  onLogout: () => void;
}) {
  const [users, setUsers] = useState<{
    username: string;
    email: string;
    role: string;
    daily_token_limit: number;
    daily_tokens_consumed: number;
  }[]>([]);

  useEffect(() => {
    fetch(apiUrl('/client/users'), { credentials: 'include' })
        .then(res => {
          if (!res.ok) throw new Error('Unauthorized');
          return res.json();
        })
        .then(data => setUsers(data.users))
        .catch(() => setUsers([]));
  }, []);

  return (
      <div className="pb-32">
        <Navbar activeTab="dashboard" onTabChange={onTabChange} onLogout={onLogout} />
        <main className="pt-24 px-6 max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold font-headline text-on-surface tracking-tight mb-2">User Management</h2>
            <p className="text-on-surface-variant">Monitor and manage API access across your active developer base.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Total Active Users</p>
              <p className="text-4xl font-extrabold font-headline text-primary">{users.length}</p>
              <div className="mt-4 flex items-center text-[10px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full w-fit">
                <TrendingUp className="w-3 h-3 mr-1" /> Total registered
              </div>
            </Card>
            <Card className="p-6">
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest mb-1">Credits Dispatched</p>
              <p className="text-4xl font-extrabold font-headline text-on-surface">
                {users.reduce((sum, u) => sum + u.daily_tokens_consumed, 0).toLocaleString()}
              </p>
              <div className="mt-4 flex items-center text-[10px] font-bold text-on-surface-variant bg-surface-container-high px-3 py-1 rounded-full w-fit">
                <Zap className="w-3 h-3 mr-1" /> Daily Total
              </div>
            </Card>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/10">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Username</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Email Address</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Tokens Used</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-center">Daily Limit</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right">Actions</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                {users.map((user) => (
                    <tr key={user.email} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-6 py-5">
                        <p className="font-bold text-sm text-on-surface">{user.username}</p>
                      </td>
                      <td className="px-6 py-5 text-sm text-on-surface-variant font-mono">{user.email}</td>
                      <td className="px-6 py-5 text-center">
                      <span className={cn(
                          "text-xs font-bold px-3 py-1 rounded-full",
                          user.role === 'admin' ? "text-primary bg-primary/10" : "text-on-surface-variant bg-surface-container-high"
                      )}>
                        {user.role}
                      </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                      <span className={cn(
                          "text-xs font-bold px-3 py-1 rounded-full",
                          user.daily_tokens_consumed >= user.daily_token_limit
                              ? "text-red-600 bg-red-50"
                              : "text-primary bg-primary/10"
                      )}>
                        {user.daily_tokens_consumed.toLocaleString()}
                      </span>
                      </td>
                      <td className="px-6 py-5 text-center text-sm font-medium text-on-surface">
                        {user.daily_token_limit.toLocaleString()}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => onEditUser(user)} className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-lg"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => onDeleteUser(user)} className="p-2 text-on-surface-variant hover:text-red-600 transition-colors rounded-lg"><ShieldAlert className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant/10">
              <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                Showing {users.length} user{users.length !== 1 ? 's' : ''}
              </p>
            </div>
          </Card>
        </main>
      </div>
  );
}

function TokensList({ onTabChange, onSelectToken, onCreateToken, onLogout }: { onTabChange: (tab: string) => void; onSelectToken: () => void; onCreateToken: () => void; onLogout: ()=> void; }) {
  const tokens = [
    { name: 'Production Main', key: 'lum_live_••••••••••••4f2a' },
    { name: 'Staging Environment', key: 'lum_test_••••••••••••92b1' },
    { name: 'Analytics Webhook', key: 'lum_live_••••••••••••0c4x' },
    { name: 'Old Mobile App', key: 'lum_live_••••••••••••33r9' },
  ];

  return (
    <div className="pb-32">
      <Navbar activeTab="tokens" onTabChange={onTabChange} onLogout={onLogout} />
      <main className="pt-24 px-6 max-w-3xl mx-auto">
        <section className="flex flex-col items-start gap-8 mb-12">
          <h1 className="font-headline font-extrabold text-4xl text-on-surface tracking-tight">API Tokens</h1>
          <Button size="lg" className="w-full sm:w-auto" onClick={onCreateToken}>
            <Plus className="w-5 h-5 mr-2" /> Create New Token
          </Button>
        </section>

        <div className="space-y-4">
          {tokens.map((token) => (
            <Card key={token.name} className="p-5 flex flex-col gap-3 cursor-pointer group hover:shadow-lg" onClick={onSelectToken}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg group-hover:text-primary transition-colors">{token.name}</span>
                <button className="text-on-surface-variant hover:text-primary transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
              <code className="font-mono text-primary bg-surface-container-low px-4 py-3 rounded-xl text-sm tracking-wider">
                {token.key}
              </code>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

function TokenDetails({ onBack, onRotate, onDelete, onLogout }: { onBack: () => void; onRotate: () => void; onDelete: () => void; onLogout: () => void; }) {
  return (
    <div className="pb-32">
      <Navbar activeTab="tokens" onTabChange={() => onBack()}  onLogout = {onLogout}/>
      <main className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="mb-10">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm uppercase tracking-widest">Back to Tokens</span>
          </button>
        </div>

        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">Production</span>
                <span className="text-on-surface-variant text-sm font-medium">Created Oct 12, 2023</span>
              </div>
              <h2 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight">E-commerce Live Token</h2>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={onRotate}>Rotate Token</Button>
              <Button variant="danger" onClick={onDelete}>Delete Token</Button>
            </div>
          </div>
        </div>

        <Card className="p-8 relative overflow-hidden mb-12">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Lock className="w-48 h-48" />
          </div>
          <h3 className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest mb-4">Secret Key</h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-surface-container-low p-4 rounded-xl group border border-transparent hover:border-primary/10 transition-all gap-4">
            <code className="font-mono text-base md:text-lg text-on-surface tracking-wider break-all">lum_live_••••••••••••4f2a</code>
            <button className="shrink-0 flex items-center justify-center gap-2 text-primary font-bold text-sm hover:bg-primary/10 px-4 py-2 rounded-xl transition-colors">
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
          <p className="mt-6 text-on-surface-variant text-sm leading-relaxed max-w-2xl">
            For security, this token is redacted. It provides full access to your production environment. Never share this key in client-side code.
          </p>
        </Card>
      </main>
    </div>
  );
}

function TokenCreatedSuccess({ onDone }: { onDone: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 md:p-12">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8">
          <CheckCircle2 className="text-primary w-10 h-10" />
        </div>
        <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-on-surface mb-3">Token Created Successfully</h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-sm mx-auto mb-12">Your production environment access has been provisioned and is ready for use.</p>
        
        <Card className="p-8 mb-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">Production Key</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Active Now</span>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center gap-4 group">
            <code className="text-primary font-mono text-lg font-semibold break-all">
              pk_live_51MszB2LzF3r9Xk1QpYv7T8gH9iO0pL1mN2oP3qR4sT5uV6wX7yZ8a9b0c
            </code>
            <Button variant="secondary" size="sm" className="shrink-0">
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
          </div>
          <div className="flex gap-4 p-5 rounded-xl bg-surface-container-highest border-l-4 border-primary">
            <ShieldCheck className="text-primary w-6 h-6 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-on-surface tracking-tight">Save this key securely.</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">For your security, we will only show this token once. If you lose it, you will need to rotate the key to regain access.</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4 items-center">
          <Button size="lg" className="w-full md:w-auto" onClick={onDone}>Done</Button>
          <button className="text-on-surface-variant font-bold text-xs uppercase tracking-widest hover:text-primary transition-colors py-2">
            Download as .env file
          </button>
        </div>

        <div className="mt-16 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">AES-256 Encryption Standard</span>
          </div>
          <div className="flex items-center gap-3">
            <History className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Logged at 14:02:11 UTC</span>
          </div>
        </div>
      </div>
    </main>
  );
}

function TokenRotateConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 md:p-12">
      <Card className="max-w-md w-full p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
          <Zap className="text-primary w-8 h-8" />
        </div>
        <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight mb-4">Rotate API Token?</h2>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-10">
          Rotating this token will generate a new secret key. Existing applications using the old key will continue to work for 24 hours to allow for a smooth transition.
        </p>
        <div className="flex flex-col gap-3">
          <Button size="lg" onClick={onConfirm}>Confirm Rotation</Button>
          <Button variant="tertiary" onClick={onCancel}>Cancel</Button>
        </div>
      </Card>
    </main>
  );
}

function TokenDeleteConfirm({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 md:p-12">
      <Card className="max-w-md w-full p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600"></div>
        <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-8">
          <AlertTriangle className="text-red-600 w-8 h-8" />
        </div>
        <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight mb-4 text-red-600">Delete API Token?</h2>
        <p className="text-on-surface-variant text-sm leading-relaxed mb-10">
          This action is irreversible. All applications currently using this token will immediately lose access to the Lumina API. Production environments may be severely impacted.
        </p>
        <div className="flex flex-col gap-3">
          <Button variant="danger" size="lg" onClick={onConfirm}>Delete Permanently</Button>
          <Button variant="tertiary" onClick={onCancel}>Cancel</Button>
        </div>
      </Card>
    </main>
  );
}

function TokenRotatedSuccess({ onDone }: { onDone: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 md:p-12">
      <div className="max-w-xl w-full text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8">
          <CheckCircle2 className="text-primary w-10 h-10" />
        </div>
        <h1 className="font-headline font-extrabold text-4xl tracking-tighter text-on-surface mb-3">Token Rotated Successfully</h1>
        <p className="text-on-surface-variant font-medium text-lg max-w-sm mx-auto mb-12">Your new production credentials have been generated and are ready for integration.</p>
        
        <Card className="p-8 mb-8 text-left">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant opacity-60">New Secret Key</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter">Active Now</span>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-6 mb-6 flex flex-col md:flex-row items-center gap-4 group">
            <code className="text-primary font-mono text-lg font-semibold break-all">
              lum_live_92k1QpYv7T8gH9iO0pL1mN2oP3qR4sT5uV6wX7yZ8a9b0c_ROTATED
            </code>
            <Button variant="secondary" size="sm" className="shrink-0">
              <Copy className="w-4 h-4 mr-2" /> Copy
            </Button>
          </div>
          <div className="flex gap-4 p-5 rounded-xl bg-surface-container-highest border-l-4 border-primary">
            <ShieldCheck className="text-primary w-6 h-6 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold text-sm text-on-surface tracking-tight">Copy and save this key now.</p>
              <p className="text-sm text-on-surface-variant leading-relaxed">For your security, we will only show this token once. You will not be able to view it again. If you lose it, you must rotate the key again.</p>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-4 items-center">
          <Button size="lg" className="w-full md:w-auto" onClick={onDone}>Done</Button>
        </div>
      </div>
    </main>
  );
}

function TokenDeletedSuccess({ onDone }: { onDone: () => void }) {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 md:p-12">
      <div className="max-w-md w-full text-center">
        <Card className="p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#dae2ff_0%,transparent_60%)] opacity-30 pointer-events-none"></div>
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute w-24 h-24 bg-primary/10 rounded-full animate-pulse"></div>
            <div className="relative w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="text-primary w-10 h-10" />
            </div>
          </div>
          <div className="relative z-10">
            <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-4">
              Token Deleted Successfully
            </h1>
            <p className="text-on-surface-variant text-base leading-relaxed mb-10 max-w-[280px] mx-auto">
              The security credentials have been permanently removed from your digital vault.
            </p>
            <Button size="lg" onClick={onDone}>
              Return to Tokens <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="mt-12 pt-8 border-t border-outline-variant/20 flex flex-col items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant/40">Operation Log</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-[11px] font-mono text-on-surface-variant">LOG_REF: DEL_82931_TKN</span>
            </div>
          </div>
        </Card>
        <div className="mt-12 text-center">
          <p className="text-sm text-on-surface-variant font-medium">
            Need to create a new token? 
            <button onClick={onDone} className="text-primary font-bold ml-1 hover:underline">Start Integration</button>
          </p>
        </div>
      </div>
    </main>
  );
}

function UserEditScreen({ user, onCancel, onConfirm }: { user: { username: string; email: string; role: string; daily_token_limit: number } | null; onCancel: () => void; onConfirm: () => void }) {
  const [role, setRole] = useState<'user' | 'admin'>((user?.role as 'user' | 'admin') ?? 'user');
  const [tokenLimit, setTokenLimit] = useState(user?.daily_token_limit ?? 256);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSave() {
    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/client/updateUsers'), {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedUserEmail: user?.email,
          selectedUserRole: role,
          selectedUserDailyTokenLimit: tokenLimit
        })
      });

      if (res.ok) {
        onConfirm();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update user');
      }
    } catch (err) {
      setError('Could not reach server');
    } finally {
      setLoading(false);
    }
  }

  return (
      <main className="min-h-screen flex items-center justify-center p-6 md:p-12">
        <Card className="max-w-md w-full p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
            <Edit2 className="text-primary w-8 h-8" />
          </div>
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight mb-2 text-center">Edit User Access</h2>
          <p className="text-on-surface-variant text-sm text-center mb-8">Adjust the permissions and limits for {user?.username}.</p>

          <div className="space-y-6 mb-10">
            <div>
              <label className="block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-3">User Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => setRole('user')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'user' ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-primary/30'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'user' ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    <User className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${role === 'user' ? 'text-primary' : 'text-on-surface-variant'}`}>User</span>
                </button>
                <button
                    onClick={() => setRole('admin')}
                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${role === 'admin' ? 'border-primary bg-primary/5' : 'border-outline-variant/20 hover:border-primary/30'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === 'admin' ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span className={`text-xs font-bold ${role === 'admin' ? 'text-primary' : 'text-on-surface-variant'}`}>Admin</span>
                </button>
              </div>
            </div>
            <Input
                label="Daily Token Limit"
                type="number"
                value={String(tokenLimit)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTokenLimit(Number(e.target.value))}
                placeholder="e.g. 512"
            />
          </div>

          {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <div className="flex flex-col gap-3">
            <Button size="lg" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button variant="tertiary" onClick={onCancel}>Cancel</Button>
          </div>
        </Card>
      </main>
  );
}

function UserDeleteConfirmScreen({ user, onCancel, onConfirm }: { user: { username: string; email: string; role: string; daily_token_limit: number } | null; onCancel: () => void; onConfirm: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    setError('');
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/client/deleteUser'), {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedUserEmail: user?.email
        })
      });

      if (res.ok) {
        onConfirm();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch (err) {
      setError('Could not reach server');
    } finally {
      setLoading(false);
    }
  }

  return (
      <main className="min-h-screen flex items-center justify-center p-6 md:p-12">
        <Card className="max-w-md w-full p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600" />
          <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-8">
            <ShieldAlert className="text-red-600 w-8 h-8" />
          </div>
          <h2 className="font-headline text-2xl font-bold text-on-surface tracking-tight mb-4 text-red-600">Delete User Account?</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-10">
            This will permanently delete the account for <span className="font-bold text-on-surface">{user?.username}</span>. This user will immediately lose all API access and their tokens will be revoked.
          </p>

          {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
          )}

          <div className="flex flex-col gap-3">
            <Button variant="danger" size="lg" onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete Account'}
            </Button>
            <Button variant="tertiary" onClick={onCancel}>Cancel</Button>
          </div>
        </Card>
      </main>
  );
}

function UserEditSuccess({ onDone }: { onDone: () => void }) {
  return (
      <main className="min-h-screen flex items-center justify-center p-6 md:p-12">
        <div className="max-w-md w-full text-center">
          <Card variant="lowest" className="p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
            <div className="mb-10 relative">
              <div className="w-24 h-24 rounded-full bg-primary/5 mx-auto flex items-center justify-center">
                <CheckCircle2 className="text-primary w-10 h-10" />
              </div>
            </div>
            <div className="relative z-10">
              <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-4">User Updated</h1>
              <p className="text-on-surface-variant text-base leading-relaxed mb-10 max-w-[280px] mx-auto">The daily token limit and role have been successfully updated for the user.</p>
              <Button size="lg" className="gap-2 w-full" onClick={onDone}>
                Back to Admin <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </main>
  );
}

function UserDeletedSuccess({ onDone }: { onDone: () => void }) {
  return (
      <main className="min-h-screen flex items-center justify-center p-6 md:p-12">
        <div className="max-w-md w-full text-center">
          <Card variant="lowest" className="p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600" />
            <div className="mb-10 relative">
              <div className="w-24 h-24 rounded-full bg-red-50 mx-auto flex items-center justify-center">
                <CheckCircle2 className="text-red-600 w-10 h-10" />
              </div>
            </div>
            <div className="relative z-10">
              <h1 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight mb-4">Account Deleted</h1>
              <p className="text-on-surface-variant text-base leading-relaxed mb-10 max-w-[280px] mx-auto">The user account and all associated credentials have been permanently removed.</p>
              <Button size="lg" className="gap-2 w-full" onClick={onDone}>
                Back to Admin <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>
      </main>
  );
}

function LightbulbIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1.3.5 2.6 1.5 3.5.8.8 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
    </svg>
  );
}
