import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader, StatusBadge, EmptyState } from '@/Components/ui';
import { Head, usePage, Link } from '@inertiajs/react';
import { Plus, Search, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

export default function ProcurementIndex() {
    const { purchase_orders } = usePage().props;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredPOs = (purchase_orders?.data || []).filter((po: any) => {
        const matchSearch = !search || po.po_number.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || po.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <AppLayout>
            <Head title="Procurement" />

            <PageHeader 
                title="Procurement" 
                subtitle="Manage suppliers and purchase orders"
                action={
                    <Link href="/procurement/create" className="glass-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> New PO
                    </Link>
                }
            />

            <GlassCard className="mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search POs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="glass-input w-full pl-10"
                            />
                        </div>
                    </div>
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="glass-input"
                    >
                        <option value="all">All Status</option>
                        <option value="draft">Draft</option>
                        <option value="sent">Sent</option>
                        <option value="partial">Partial</option>
                        <option value="received">Received</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </GlassCard>

            <GlassCard className="overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">PO #</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Supplier</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Expected</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Total</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPOs.length > 0 ? (
                                filteredPOs.map((po: any) => (
                                    <tr key={po.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="py-3 px-4 font-mono">{po.po_number}</td>
                                        <td className="py-3 px-4">{po.supplier?.company_name}</td>
                                        <td className="py-3 px-4"><StatusBadge status={po.status} /></td>
                                        <td className="py-3 px-4 text-slate-400">
                                            {po.expected_date ? new Date(po.expected_date).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="py-3 px-4 text-right font-medium">
                                            ${parseFloat(po.total_amount || 0).toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Link href={`/procurement/${po.id}`} className="text-blue-400 hover:underline">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8">
                                        <EmptyState 
                                            icon={ShoppingBag}
                                            title="No purchase orders"
                                            action={
                                                <Link href="/procurement/create" className="glass-button">
                                                    <Plus className="w-4 h-4 mr-2" /> Create PO
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
        </AppLayout>
    );
}