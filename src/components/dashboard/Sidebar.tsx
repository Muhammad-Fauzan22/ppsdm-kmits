'use client';

import { memo, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  personalDevelopmentNav, 
  analysisNav, 
  bottomNav,
  dashboardNavigation,
  NavItem,
  NavSection 
} from '@/lib/navigation';

interface SidebarProps {
  user?: {
    name: string;
    avatar?: string;
    level: number;
    title: string;
  };
  isOpen?: boolean;
  onClose?: () => void;
}

const defaultUser = {
  name: 'Student Portal',
  level: 4,
  title: 'Level 4 Scholar',
};

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-[#003366]/20 text-white border-l-2 border-[#003366]'
          : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent'
      }`}
    >
      <span className={`material-symbols-outlined transition-colors ${
        isActive ? 'text-[#1A4D80]' : 'group-hover:text-[#FFD700]'
      }`}>
        {item.icon}
      </span>
      <span className="text-sm font-medium">{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-[#FFD700] text-[#0f1923] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

function NavSectionComponent({ section, pathname }: { section: NavSection; pathname: string }) {
  return (
    <nav className="flex flex-col gap-1">
      <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
        {section.title}
      </div>
      {section.items.map((item) => (
        <NavLink 
          key={item.id} 
          item={item} 
          isActive={pathname === item.href || pathname.startsWith(`${item.href}/`)} 
        />
      ))}
    </nav>
  );
}

const NavSectionComponentMemo = memo(NavSectionComponent);

export default memo(function Sidebar({ user = defaultUser, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  
  const sidebarContent = (
    <>
      {/* Profile Summary Card */}
      <div className="p-4">
        <div className="bg-[#1e293b]/60 backdrop-blur-sm border border-white/[0.08] p-4 rounded-xl flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full bg-cover bg-center border border-white/[0.08]"
            style={{ 
              backgroundImage: user.avatar 
                ? `url(${user.avatar})` 
                : 'linear-gradient(135deg, #003366 0%, #1A4D80 100%)' 
            }}
          >
            {!user.avatar && (
              <div className="w-full h-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate text-white">{user.name}</span>
            <span className="text-xs text-[#FFD700] truncate">{user.title}</span>
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
        {useMemo(() => dashboardNavigation.map((section) => (
          <NavSectionComponentMemo key={section.id} section={section} pathname={pathname} />
        )), [pathname])}
      </div>

      {/* Bottom Links */}
      <div className="p-4 border-t border-white/[0.08]">
        {bottomNav.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
              item.id === 'logout'
                ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] bg-[#101418] border-r border-white/[0.08] flex-col shrink-0 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={onClose}
            />
            
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-[280px] bg-[#101418] border-r border-white/[0.08] flex flex-col z-50 overflow-hidden"
            >
              {/* Mobile header with close button */}
              <div className="h-16 flex items-center justify-between px-4 border-b border-white/[0.08]">
                <Link href="/dashboard" className="flex items-center gap-3 text-white" onClick={onClose}>
                  <div className="w-8 h-8 bg-[#003366] rounded flex items-center justify-center text-white font-bold text-lg">
                    K
                  </div>
                  <h2 className="text-white text-lg font-bold tracking-tight">PPSDM KMITS</h2>
                </Link>
                <button 
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
                  aria-label="Close menu"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              {/* Scrollable content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
})

// Export individual components for flexibility
export { NavLink, NavSectionComponent };
