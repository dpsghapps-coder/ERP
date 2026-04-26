import { PropsWithChildren } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const cardVariants = cva('glass-card', {
  variants: {
    variant: {
      default: '',
      bordered: 'border border-slate-200 bg-transparent shadow-none',
      interactive: 'cursor-pointer hover:shadow-md transition-all hover:border-slate-300',
    },
    size: {
      default: 'p-6',
      sm: 'p-4',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export function GlassCard({ 
  className, 
  variant, 
  size, 
  children 
}: PropsWithChildren<{
  className?: string;
  variant?: VariantProps<typeof cardVariants>['variant'];
  size?: VariantProps<typeof cardVariants>['size'];
}>) {
  return (
    <div className={cn(cardVariants({ variant, size }), className)}>
      {children}
    </div>
  );
}

export function PageHeader({ 
  title, 
  subtitle,
  action 
}: { 
  title: string; 
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function StatusBadge({ 
  status, 
  className 
}: { 
  status: string;
  className?: string;
}) {
  const statusClasses: Record<string, string> = {
    lead: 'status-lead',
    prospect: 'status-prospect',
    active: 'status-active',
    inactive: 'status-inactive',
    draft: 'status-draft',
    confirmed: 'status-confirmed',
    in_production: 'status-in_production',
    ready: 'status-ready',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled',
    queued: 'status-queued',
    in_progress: 'status-in_progress',
    paused: 'status-paused',
    completed: 'status-completed',
    tentative: 'status-tentative',
    pending: 'status-pending',
    approved: 'statusapproved',
    rejected: 'status-rejected',
    sent: 'status-confirmed',
    partial: 'payment-partial',
    paid: 'payment-paid',
    unpaid: 'payment-unpaid',
    received: 'status-delivered',
  };

  return (
    <span className={`status-badge ${statusClasses[status] || 'bg-white/10'} ${className || ''}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

export function EmptyState({ 
  icon: Icon,
  title,
  description,
  action 
}: { 
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon className="w-12 h-12 text-slate-500 dark:text-slate-400 mb-4" />}
      <h3 className="text-lg font-medium mb-1 text-slate-900 dark:text-white">{title}</h3>
      {description && <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{description}</p>}
      {action}
    </div>
  );
}

// Theme Toggle Component
export function ThemeToggle({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label="Toggle theme"
    >
      <span
        className="inline-block h-6 w-6 rounded-full bg-white shadow-lg transform transition-transform duration-300 flex items-center justify-center"
      >
        {/* Sun icon - shown in dark mode */}
        <svg className="w-3.5 h-3.5 text-amber-500 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 10a1 1 0 10-2 0v1a1 1 0 102 0v-1zm-7.071.929a1 1 0 00-1.414 0l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 0zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" clipRule="evenodd" />
        </svg>
        {/* Moon icon - shown in light mode */}
        <svg className="w-3.5 h-3.5 text-indigo-600 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </span>
    </button>
  );
}

// Stat Card Component
export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  color = 'indigo'
}: {
  title: string;
  value: string | number;
  icon?: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down';
  trendValue?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'slate';
}) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400',
    rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400',
    slate: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };

  return (
    <div className="glass-card-interactive">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        {trend && (
          <span className={`text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{title}</p>
      </div>
    </div>
  );
}