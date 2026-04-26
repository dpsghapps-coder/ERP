import { PropsWithChildren } from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'slate';
}

export function Loading({ 
  size = 'md', 
  color = 'primary',
  children 
}: PropsWithChildren<LoadingProps>) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    primary: 'border-indigo-200 border-t-indigo-600',
    white: 'border-white/30 border-t-white',
    slate: 'border-slate-300 border-t-slate-600',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full animate-spin`}
      />
      {children && (
        <span className="ml-3 text-sm text-slate-500">{children}</span>
      )}
    </div>
  );
}

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <Loading size="lg" />
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Loading size="lg" />
      <p className="mt-4 text-slate-500">Loading...</p>
    </div>
  );
}

export function TableLoading({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3" style={{ animation: 'pulseSubtle 2s ease-in-out infinite' }}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="skeleton h-10 flex-1" />
          <div className="skeleton h-10 w-24" />
          <div className="skeleton h-10 w-24" />
          <div className="skeleton h-10 w-32" />
        </div>
      ))}
    </div>
  );
}

export function CardLoading() {
  return (
    <div className="glass-card">
      <div className="flex items-center gap-4 mb-4">
        <div className="skeleton w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <div className="skeleton h-4 w-32 mb-2" />
          <div className="skeleton h-3 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="skeleton h-16 rounded-lg" />
        <div className="skeleton h-16 rounded-lg" />
        <div className="skeleton h-16 rounded-lg" />
      </div>
    </div>
  );
}

export function FormLoading() {
  return (
    <div className="glass-card space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="skeleton h-4 w-20 mb-2" />
          <div className="skeleton h-10 w-full" />
        </div>
        <div>
          <div className="skeleton h-4 w-20 mb-2" />
          <div className="skeleton h-10 w-full" />
        </div>
      </div>
      <div>
        <div className="skeleton h-4 w-20 mb-2" />
        <div className="skeleton h-24 w-full" />
      </div>
      <div className="flex justify-end gap-4">
        <div className="skeleton h-10 w-24" />
        <div className="skeleton h-10 w-32" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card">
      <div className="flex items-center gap-3">
        <div className="skeleton w-12 h-12 rounded-xl" />
        <div className="flex-1">
          <div className="skeleton h-3 w-16 mb-2" />
          <div className="skeleton h-6 w-24" />
        </div>
      </div>
    </div>
  );
}