'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', icon: 'home', label: 'Home' },
  { href: '/leaderboard', icon: 'social_leaderboard', label: 'Rankings' },
  { href: '/exam', icon: 'assignment', label: 'Exam' },
  { href: '/stats', icon: 'query_stats', label: 'Stats' },
];

export default function BottomNav() {
  const path = usePathname();
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
      background: 'var(--surface-container)',
      borderTop: '1px solid var(--outline-variant)',
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '8px 16px 12px',
    }}>
      {NAV.map(n => {
        const active = path === n.href || (n.href !== '/' && path.startsWith(n.href));
        return (
          <Link key={n.href} href={n.href} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '2px',
              padding: active ? '6px 16px' : '6px 12px',
              borderRadius: '20px',
              background: active ? 'var(--primary-container)' : 'transparent',
              color: active ? 'var(--on-primary-container)' : 'var(--on-surface-variant)',
              transition: 'all 0.2s ease',
              minWidth: 56,
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>{n.icon}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 500, letterSpacing: '0.05em' }}>{n.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
