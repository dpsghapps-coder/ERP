import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader, StatusBadge } from '@/Components/ui';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Plus, CheckCircle, Circle, Clock } from 'lucide-react';
import { useState } from 'react';

const priorityColors: Record<string, string> = {
    low: 'priority-low',
    normal: 'priority-normal',
    high: 'priority-high',
    urgent: 'priority-urgent',
};

const statusTabs = ['overview', 'tasks', 'materials'];

export default function ProductionShow() {
    const { job } = usePage().props as any;
    const [activeTab, setActiveTab] = useState('overview');

    const completedTasks = job?.tasks?.filter((t: any) => t.status === 'done').length || 0;
    const totalTasks = job?.tasks?.length || 0;

    return (
        <AppLayout>
            <Head title={`Job ${job?.job_number}`} />

            <div className="mb-6">
                <Link href="/production" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Production
                </Link>
            </div>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-slate-400">{job?.job_number}</span>
                        <StatusBadge status={job?.status} />
                        <span className={`status-badge ${priorityColors[job?.priority]}`}>{job?.priority}</span>
                    </div>
                    <h1 className="text-2xl font-semibold">{job?.title}</h1>
                    {job?.order && (
                        <p className="text-slate-400 mt-1">
                            Linked to Order: <Link href={`/orders/${job.order.id}`} className="text-blue-400 hover:underline">{job.order.order_number}</Link>
                        </p>
                    )}
                </div>
                <div className="flex gap-2">
                    {job?.status === 'queued' && (
                        <button className="glass-button bg-green-500/20 text-green-400">Start Job</button>
                    )}
                    {job?.status === 'in_progress' && (
                        <button className="glass-button bg-yellow-500/20 text-yellow-400">Pause Job</button>
                    )}
                    {job?.status === 'paused' && (
                        <button className="glass-button bg-green-500/20 text-green-400">Resume Job</button>
                    )}
                    {(job?.status === 'in_progress' || job?.status === 'paused') && (
                        <button className="glass-button bg-blue-500/20 text-blue-400">Complete Job</button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-white/10">
                {statusTabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 capitalize transition-colors ${
                            activeTab === tab 
                                ? 'border-b-2 border-white text-white' 
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        {tab}
                        {tab === 'tasks' && totalTasks > 0 && (
                            <span className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded">
                                {completedTasks}/{totalTasks}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <GlassCard>
                            <h3 className="text-lg font-semibold mb-4">Description</h3>
                            <p className="text-slate-300">{job?.description || 'No description provided'}</p>
                        </GlassCard>

                        <GlassCard>
                            <h3 className="text-lg font-semibold mb-4">Progress</h3>
                            <div className="flex items-center gap-4">
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-green-500 transition-all"
                                        style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
                                    />
                                </div>
                                <span className="text-sm text-slate-400">
                                    {completedTasks} / {totalTasks} tasks
                                </span>
                            </div>
                        </GlassCard>
                    </div>

                    <div className="space-y-6">
                        <GlassCard>
                            <h3 className="text-sm font-medium text-slate-400 mb-3">Details</h3>
                            <div className="space-y-3">
                                {job?.assigned_to && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Assigned To</span>
                                        <span>{job.assigned_to.name}</span>
                                    </div>
                                )}
                                {job?.due_date && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Due Date</span>
                                        <span>{new Date(job.due_date).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {job?.started_at && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Started</span>
                                        <span>{new Date(job.started_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {job?.completed_at && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Completed</span>
                                        <span>{new Date(job.completed_at).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    </div>
                </div>
            )}

            {activeTab === 'tasks' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button className="glass-button flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Task
                        </button>
                    </div>
                    {(job?.tasks?.length || 0) > 0 ? (
                        <div className="space-y-2">
                            {job.tasks.map((task: any) => (
                                <GlassCard key={task.id} className="flex items-center gap-4">
                                    <button className="text-slate-400 hover:text-green-400 transition-colors">
                                        {task.status === 'done' ? (
                                            <CheckCircle className="w-5 h-5 text-green-400" />
                                        ) : task.status === 'in_progress' ? (
                                            <Clock className="w-5 h-5 text-amber-400" />
                                        ) : (
                                            <Circle className="w-5 h-5" />
                                        )}
                                    </button>
                                    <div className="flex-1">
                                        <p className={`font-medium ${task.status === 'done' ? 'line-through text-slate-400' : ''}`}>
                                            {task.title}
                                        </p>
                                        {task.description && (
                                            <p className="text-sm text-slate-400">{task.description}</p>
                                        )}
                                    </div>
                                    {task.due_date && (
                                        <span className="text-sm text-slate-400">
                                            {new Date(task.due_date).toLocaleDateString()}
                                        </span>
                                    )}
                                </GlassCard>
                            ))}
                        </div>
                    ) : (
                        <GlassCard>
                            <p className="text-slate-400 text-center py-8">No tasks yet. Add a task to get started.</p>
                        </GlassCard>
                    )}
                </div>
            )}

            {activeTab === 'materials' && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button className="glass-button flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Add Material
                        </button>
                    </div>
                    {(job?.materials?.length || 0) > 0 ? (
                        <GlassCard className="overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Product</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Required</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Consumed</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Remaining</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {job.materials.map((material: any) => (
                                        <tr key={material.id} className="border-b border-white/5">
                                            <td className="py-3 px-4">{material.product?.name}</td>
                                            <td className="py-3 px-4 text-right">{material.required_qty}</td>
                                            <td className="py-3 px-4 text-right">{material.consumed_qty}</td>
                                            <td className="py-3 px-4 text-right">{material.required_qty - material.consumed_qty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </GlassCard>
                    ) : (
                        <GlassCard>
                            <p className="text-slate-400 text-center py-8">No materials tracked for this job.</p>
                        </GlassCard>
                    )}
                </div>
            )}
        </AppLayout>
    );
}