import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader, StatusBadge, EmptyState } from '@/Components/ui';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Plus, Search, ClipboardList } from 'lucide-react';
import { useState } from 'react';

export default function RequisitionIndex() {
    const { requisitions, products } = usePage().props as any;
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        product_id: '',
        qty_requested: '',
        requested_by: '',
        notes: '',
        status: 'pending',
    });

    const filteredRequisitions = (requisitions?.data || []).filter((r: any) => {
        if (!search) return true;
        return r.product?.item_name?.toLowerCase().includes(search.toLowerCase()) ||
               r.product?.product_sku?.toLowerCase().includes(search.toLowerCase());
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/inventory/requisitions', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            }
        });
    };

    const updateStatus = (id: string, status: string) => {
        put(`/inventory/requisitions/${id}`, {
            data: { status },
            onSuccess: () => {}
        });
    };

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        approved: 'bg-green-100 text-green-700',
        rejected: 'bg-red-100 text-red-700',
    };

    return (
        <AppLayout>
            <Head title="Requisition" />

            <PageHeader 
                title="Requisition" 
                subtitle="Track inventory requests"
                action={
                    <button onClick={() => setShowModal(true)} className="glass-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New Request
                    </button>
                }
            />

            <GlassCard className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search requisitions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="glass-input w-full pl-10"
                    />
                </div>
            </GlassCard>

            <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Date</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Product</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">SKU</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Qty</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Requested By</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequisitions.length > 0 ? (
                                filteredRequisitions.map((req: any) => (
                                    <tr key={req.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-slate-600">
                                            {req.date_requested ? new Date(req.date_requested).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-slate-900">{req.product?.item_name}</p>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-sm text-slate-500">{req.product?.product_sku}</td>
                                        <td className="py-3 px-4 font-medium">{req.qty_requested}</td>
                                        <td className="py-3 px-4 text-slate-600">{req.requested_by || '-'}</td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${statusColors[req.status]}`}>
                                                {req.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {req.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <button 
                                                        onClick={() => updateStatus(req.id, 'approved')}
                                                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => updateStatus(req.id, 'rejected')}
                                                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-8">
                                        <EmptyState 
                                            icon={ClipboardList}
                                            title="No requisitions"
                                            action={
                                                <button onClick={() => setShowModal(true)} className="glass-button">
                                                    <Plus className="w-4 h-4 mr-2" /> New Request
                                                </button>
                                            }
                                        />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">New Requisition</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Product *</label>
                                    <select
                                        value={data.product_id}
                                        onChange={(e) => setData('product_id', e.target.value)}
                                        className="glass-input w-full"
                                        required
                                    >
                                        <option value="">Select product</option>
                                        {(products || []).map((p: any) => (
                                            <option key={p.id} value={p.id}>
                                                {p.item_name} ({p.product_sku}) - Available: {p.qty_available}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Quantity *</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={data.qty_requested}
                                            onChange={(e) => setData('qty_requested', e.target.value)}
                                            className="glass-input w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Requested By</label>
                                        <input
                                            type="text"
                                            value={data.requested_by}
                                            onChange={(e) => setData('requested_by', e.target.value)}
                                            className="glass-input w-full"
                                            placeholder="Your name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Notes</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        className="glass-input w-full h-20"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 glass-button-secondary">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="flex-1 glass-button">
                                    {processing ? 'Saving...' : 'Submit'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}