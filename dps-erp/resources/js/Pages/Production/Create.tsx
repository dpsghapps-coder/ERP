import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader } from '@/Components/ui';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function ProductionCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        order_id: '',
        priority: 'normal',
        assigned_to: '',
        due_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/production');
    };

    return (
        <AppLayout>
            <Head title="Create Production Job" />

            <div className="mb-6">
                <Link href="/production" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Production
                </Link>
            </div>

            <PageHeader title="Create Production Job" subtitle="Create a new production job" />

            <form onSubmit={handleSubmit}>
                <GlassCard>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Title *</label>
                            <input 
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className="glass-input w-full"
                                placeholder="Job title"
                            />
                            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea 
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="glass-input w-full h-24"
                                placeholder="Job description..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Linked Order</label>
                            <select 
                                value={data.order_id}
                                onChange={(e) => setData('order_id', e.target.value)}
                                className="glass-input w-full"
                            >
                                <option value="">No linked order</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Priority *</label>
                            <select 
                                value={data.priority}
                                onChange={(e) => setData('priority', e.target.value)}
                                className="glass-input w-full"
                            >
                                <option value="low">Low</option>
                                <option value="normal">Normal</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Assign To</label>
                            <select 
                                value={data.assigned_to}
                                onChange={(e) => setData('assigned_to', e.target.value)}
                                className="glass-input w-full"
                            >
                                <option value="">Unassigned</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Due Date</label>
                            <input 
                                type="date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                className="glass-input w-full"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-white/10">
                        <Link href="/production" className="glass-button">Cancel</Link>
                        <button type="submit" disabled={processing} className="glass-button">
                            {processing ? 'Creating...' : 'Create Job'}
                        </button>
                    </div>
                </GlassCard>
            </form>
        </AppLayout>
    );
}