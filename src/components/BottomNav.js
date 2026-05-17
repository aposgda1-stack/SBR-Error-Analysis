'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: 'grid_view', href: '/dashboard' },
  { id: 'confusing', label: 'Confusing', icon: 'compare_arrows', href: '/arena/confusing' },
  { id: 'exam', label: 'Exam', icon: 'timer', href: '/exam' },
  { id: 'leaderboard', label: 'Leaders', icon: 'emoji_events', href: '/leaderboard' },
  { id: 'stats', label: 'Profile', icon: 'person', href: '/stats' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav style={{
      position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)',
      width: 'calc(100% - 24px)', maxWidth: 430, zIndex: 200,
      background: 'rgba(8, 4, 20, 0.88)',
      backdropFilter: 'blur(40px) saturate(200%)',
      WebkitBackdropFilter: 'blur(40px) saturate(200%)',
      border: '1px solid rgba(167, 139, 250, 0.15)',
      borderRadius: '28px',
      padding: '8px 6px',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(167,139,250,0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
    }}>
      {/* Top aurora line */}
      <div style={{
        position: 'absolute', top: 0, left: '20%', right: '20%', height: 1.5,
        background: 'linear-gradient(90deg, transparent, var(--primary), var(--secondary), transparent)',
        borderRadius: 2, opacity: 0.5
      }} />

      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        return (
          <Link key={item.id} href={item.href} style={{
            textDecoration: 'none',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3,
            minWidth: 60, padding: '8px 6px',
            borderRadius: 20,
            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
            background: isActive ? 'rgba(167, 139, 250, 0.12)' : 'transparent',
            border: isActive ? '1px solid rgba(167,139,250,0.2)' : '1px solid transparent',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            position: 'relative'
          }}>
            {/* Glow dot for active */}
            {isActive && (
              <div style={{
                position: 'absolute', top: 6, width: 4, height: 4,
                borderRadius: '50%', background: 'var(--primary)',
                boxShadow: '0 0 8px var(--primary-glow)',
                animation: 'pulse-glow 2s ease-in-out infinite'
              }} />
            )}
            <span className="mi" style={{
              fontSize: 24,
              filter: isActive ? 'drop-shadow(0 0 8px var(--primary-glow))' : 'none',
              transform: isActive ? 'scale(1.15)' : 'scale(1)',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              marginTop: isActive ? 4 : 0
            }}>{item.icon}</span>
            <span style={{
              fontSize: 9, fontWeight: isActive ? 800 : 500,
              letterSpacing: 0.5, textTransform: 'uppercase',
              opacity: isActive ? 1 : 0.6
            }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
