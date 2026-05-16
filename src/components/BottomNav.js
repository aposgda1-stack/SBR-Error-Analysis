'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'home', href: '/' },
  { id: 'exam', label: 'Exam', icon: 'timer', href: '/exam' },
  { id: 'leaderboard', label: 'Leaders', icon: 'emoji_events', href: '/leaderboard' },
  { id: 'stats', label: 'Profile', icon: 'person', href: '/stats' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 32px)', maxWidth: 420, zIndex: 100,
      background: 'rgba(15, 15, 20, 0.85)',
      backdropFilter: 'blur(24px)',
      border: '1px solid var(--border-glass)',
      borderRadius: '24px',
      padding: '10px 8px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
    }}>
      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.id} href={item.href} style={{ 
            textDecoration: 'none', display: 'flex', flexDirection: 'column', 
            alignItems: 'center', gap: 4, minWidth: 70, padding: '8px 0',
            transition: 'all 0.3s',
            color: isActive ? 'var(--primary)' : 'var(--text-dim)'
          }}>
            <span className="mi" style={{ 
              fontSize: 26,
              textShadow: isActive ? '0 0 15px var(--primary-glow)' : 'none'
            }}>{item.icon}</span>
            <span style={{ fontSize: 10, fontWeight: isActive ? 800 : 500, letterSpacing: 0.2 }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
