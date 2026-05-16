'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home', href: '/' },
  { id: 'exam', label: 'Exam', icon: 'timer', href: '/exam' },
  { id: 'leaderboard', label: 'Leaderboard', icon: 'trophy', href: '/leaderboard' },
  { id: 'stats', label: 'Profile', icon: 'person', href: '/stats' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 40px)', maxWidth: 400, zIndex: 100,
      background: 'rgba(15, 15, 20, 0.8)',
      backdropFilter: 'blur(24px)',
      border: '1px solid var(--border-glass)',
      borderRadius: '24px',
      padding: '8px 12px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.id} href={item.href} style={{ 
            textDecoration: 'none', display: 'flex', flexDirection: 'column', 
            alignItems: 'center', gap: 4, padding: '8px 16px', borderRadius: 16,
            transition: 'all 0.3s',
            background: isActive ? 'rgba(124, 77, 255, 0.1)' : 'transparent',
            color: isActive ? 'var(--primary)' : 'var(--text-dim)'
          }}>
            <span className="material-symbols-rounded" style={{ 
              fontSize: 26, 
              variationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              filter: isActive ? 'drop-shadow(0 0 5px var(--primary-glow))' : 'none'
            }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 700 : 500, letterSpacing: 0.5 }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
