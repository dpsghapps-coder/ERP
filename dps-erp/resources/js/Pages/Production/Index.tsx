import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader, StatusBadge, EmptyState } from '@/Components/ui';
import { Head, Link, usePage } from '@inertiajs/react';
import { Plus, List, LayoutGrid, Search, ArrowRight, Calendar, User } from 'lucide-react';
import { useState } from 'react';

const statusColumns = [
    { key: 'queued', label: 'Queued', color: 'border-slate-500' },
    { key: 'in_progress', label: 'In Progress', color: 'border-amber-500' },
    { key: 'paused', label: 'Paused', color: 'border-orange-500' },
    { key: 'completed', label: 'Completed', color: 'border-green-500' },
];

const priorityColors: Record<string, string> = {
    low: 'priority-low',
    normal: 'priority-normal',
    high: 'priority-high',
    urgent: 'priority-urgent',
};

export default function ProductionIndex() {
    const { jobs } = usePage().props;
    const [view, setView] = useState<'kanban' | 'list'>('kanban');
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');

    const filteredJobs = (jobs?.data || []).filter((j: any) => {
        const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.job_number.toLowerCase().includes(search.toLowerCase());
        const matchPriority = priorityFilter === 'all' || j.priority === priorityFilter;
        return matchSearch && matchPriority;
    });

    const jobsByStatus = statusColumns.reduce((acc, col) => {
        acc[col.key] = filteredJobs.filter((j: any) => j.status === col.key);
        return acc;
    }, {} as Record<string, any[]>);

    return (
        <AppLayout>
            <Head title="Production" />

            <PageHeader 
                title="Production" 
                subtitle="Manage production jobs and tasks"
                action={
                    <Link href="/production/create" className="glass-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Job
                    </Link>
                }
            />

            {/* Filters */}
            <GlassCard className="mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="relative flex-1 max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search jobs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="glass-input w-full pl-10"
                            />
                        </div>
                        <select 
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                            className="glass-input"
                        >
                            <option value="all">All Priorities</option>
                            <option value="low">Low</option>
                            <option value="normal">Normal</option>
                            <option value="high">High</option>
                            <option value="urgent">Urgent</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setView('kanban')}
                            className={`p-2 rounded-lg transition-colors ${view === 'kanban' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <LayoutGrid className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => setView('list')}
                            className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-white/20' : 'hover:bg-white/10'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </GlassCard>

            {view === 'kanban' ? (
                /* Kanban Board */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statusColumns.map((col) => (
                        <div key={col.key} className="flex flex-col">
                            <div className={`border-t-2 ${col.color} px-3 py-2 mb-3`}>
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">{col.label}</h3>
                                    <span className="text-sm text-slate-400">{jobsByStatus[col.key]?.length || 0}</span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-3 min-h-[200px]">
                                {(jobsByStatus[col.key] || []).map((job: any) => (
                                    <Link key={job.id} href={`/production/${job.id}`}>
                                        <GlassCard variant="interactive" className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <span className="text-xs font-mono text-slate-400">{job.job_number}</span>
                                                <span className={`status-badge ${priorityColors[job.priority]}`}>{job.priority}</span>
                                            </div>
                                            <h4 className="font-medium mb-2">{job.title}</h4>
                                            {job.order && (
                                                <p className="text-xs text-slate-400 mb-2">Order: {job.order.order_number}</p>
                                            )}
                                            <div className="flex items-center justify-between text-sm text-slate-400">
                                                {job.due_date && (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{new Date(job.due_date).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                                {job.assigned_to && (
                                                    <div className="flex items-center gap-1">
                                                        <User className="w-3 h-3" />
                                                        <span>{job.assigned_to.name?.charAt(0)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </GlassCard>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* List View */
                <GlassCard className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Job #</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Title</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Order</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Priority</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Due Date</th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.length > 0 ? (
                                    filteredJobs.map((job: any) => (
                                        <tr key={job.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="py-3 px-4 font-mono text-sm">{job.job_number}</td>
                                            <td className="py-3 px-4">{job.title}</td>
                                            <td className="py-3 px-4 text-slate-400">{job.order?.order_number || '-'}</td>
                                            <td className="py-3 px-4"><StatusBadge status={job.status} /></td>
                                            <td className="py-3 px-4"><span className={`status-badge ${priorityColors[job.priority]}`}>{job.priority}</span></td>
                                            <td className="py-3 px-4 text-slate-400">
                                                {job.due_date ? new Date(job.due_date).toLocaleDateString() : '-'}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <Link href={`/production/${job.id}`} className="text-blue-400 hover:underline">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="py-8">
                                            <EmptyState 
                                                icon={ArrowRight}
                                                title="No jobs found"
                                                action={
                                                    <Link href="/production/create" className="glass-button">
                                                        <Plus className="w-4 h-4 mr-2" /> Create Job
                                                    </Link>
                                                }
                                            />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            )}
        </AppLayout>
    );
}