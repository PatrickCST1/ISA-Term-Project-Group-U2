import { useState } from 'react';
import { LayoutDashboard, Key, FileText, Lightbulb, User, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { cn } from '../lib/utils';

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  isAdmin?: boolean;
}

export const Navbar = ({ activeTab, onTabChange, onLogout, isAdmin = false }: NavbarProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tokens', label: 'Tokens', icon: Key },
    { id: 'docs', label: 'Docs', icon: FileText },
  ];

  return (
      <>
        {/* Desktop Header */}
        <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,61,155,0.06)] flex justify-between items-center px-6 h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
            <Lightbulb className="text-primary w-6 h-6" />
            <h1 className="font-headline font-extrabold tracking-tighter text-primary text-xl">Lumina API</h1>
          </div>

          <nav className="hidden md:flex items-center gap-4">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        'px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300',
                        activeTab === tab.id
                            ? 'text-primary bg-surface-container-low'
                            : 'text-on-surface-variant hover:bg-surface-container-low'
                    )}
                >
                  {tab.label}
                </button>
            ))}

            {/* User icon + dropdown */}
            <div className="relative ml-4">
              <div
                  className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center border-2 border-white cursor-pointer hover:ring-4 ring-primary/10 transition-all"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <User className="w-4 h-4 text-on-surface-variant" />
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                      <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl shadow-2xl shadow-black/10 z-50 overflow-hidden p-2"
                      >
                        <button
                            onClick={() => { setIsDropdownOpen(false); onLogout(); }}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-bold">Log Out</span>
                        </button>
                      </motion.div>
                    </>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </header>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center h-20 pb-safe px-6 bg-white/70 backdrop-blur-xl z-50 rounded-t-2xl border-t border-outline-variant/20 shadow-[0_-10px_30px_rgba(0,61,155,0.04)]">
          {tabs.map((tab) => (
              <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                      'flex flex-col items-center justify-center transition-all duration-300',
                      activeTab === tab.id
                          ? 'text-primary scale-110'
                          : 'text-on-surface-variant opacity-60'
                  )}
              >
                <tab.icon className="w-6 h-6" />
                <span className="text-[10px] font-bold uppercase tracking-widest mt-1">{tab.label}</span>
              </button>
          ))}
          {/* Mobile logout button */}
          <button
              onClick={onLogout}
              className="flex flex-col items-center justify-center transition-all duration-300 text-red-500 opacity-60"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1">Logout</span>
          </button>
        </nav>
      </>
  );
};