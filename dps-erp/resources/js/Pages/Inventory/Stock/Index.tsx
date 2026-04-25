import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader, EmptyState } from '@/Components/ui';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Plus, Search, Package, Calendar, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function StockIndex() {
    const { stocks, products } = usePage().props as any;
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingStock, setEditingStock] = useState<any>(null);
    
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        product_id: '',
        qty_purchased: '',
        date_purchased: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const filteredStocks = (stocks?.data || []).filter((s: any) => {
        if (!search) return true;
        return s.product?.item_name?.toLowerCase().includes(search.toLowerCase()) ||
               s.product?.product_sku?.toLowerCase().includes(search.toLowerCase());
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingStock) {
            put(`/inventory/stock/${editingStock.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingStock(null);
                    reset();
                }
            });
        } else {
            post('/inventory/stock', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this stock record? This will reduce the product quantity.')) {
            destroy(`/inventory/stock/${id}`);
        }
    };

    const openEdit = (stock: any) => {
        setEditingStock(stock);
        setData({
            product_id: stock.product_id,
            qty_purchased: stock.qty_purchased,
            date_purchased: stock.date_purchased ? stock.date_purchased.split('T')[0] : new Date().toISOString().split('T')[0],
            notes: stock.notes || '',
        });
        setShowModal(true);
    };

    const openCreate = () => {
        setEditingStock(null);
        reset();
        setData({
            product_id: '',
            qty_purchased: '',
            date_purchased: new Date().toISOString().split('T')[0],
            notes: '',
        });
        setShowModal(true);
    };

    return (
        <AppLayout>
            <Head title="Stock" />

            <PageHeader 
                title="Stock" 
                subtitle="Track inventory purchases"
                action={
                    <button onClick={openCreate} className="glass-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Stock
                    </button>
                }
            />

            <GlassCard className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search stock..."
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
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Notes</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStocks.length > 0 ? (
                                filteredStocks.map((stock: any) => (
                                    <tr key={stock.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Calendar className="w-4 h-4" />
                                                {stock.date_purchased ? new Date(stock.date_purchased).toLocaleDateString() : '-'}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-slate-900">{stock.product?.item_name}</p>
                                        </td>
                                        <td className="py-3 px-4 font-mono text-sm text-slate-500">{stock.product?.product_sku}</td>
                                        <td className="py-3 px-4">
                                            <span className="font-medium text-green-600">+{stock.qty_purchased}</span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-500">{stock.notes || '-'}</td>
                                        <td className="py-3 px-4 text-right">
                                            <button onClick={() => openEdit(stock)} className="text-blue-600 hover:underline mr-3">
                                                <Pencil className="w-4 h-4 inline" />
                                            </button>
                                            <button onClick={() => handleDelete(stock.id)} className="text-red-600 hover:underline">
                                                <Trash2 className="w-4 h-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-8">
                                        <EmptyState 
                                            icon={Package}
                                            title="No stock records"
                                            action={
                                                <button onClick={openCreate} className="glass-button">
                                                    <Plus className="w-4 h-4 mr-2" /> Add Stock
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

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingStock ? 'Edit Stock' : 'Add Stock'}
                        </h2>
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
                                            value={data.qty_purchased}
                                            onChange={(e) => setData('qty_purchased', e.target.value)}
                                            className="glass-input w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Date *</label>
                                        <input
                                            type="date"
                                            value={data.date_purchased}
                                            onChange={(e) => setData('date_purchased', e.target.value)}
                                            className="glass-input w-full"
                                            required
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
                                    {processing ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}