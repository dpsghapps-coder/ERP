import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader, EmptyState } from '@/Components/ui';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Plus, Search, Package, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function ProductCatalogIndex() {
    const { products, suppliers, categories, uoms } = usePage().props as any;
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        product_sku: '',
        supplier_id: '',
        item_name: '',
        item_description: '',
        item_category: '',
        uom: 'Pieces',
        unit_price: '',
        item_status: 'Active',
    });

    const filteredProducts = (products?.data || []).filter((p: any) => {
        if (!search) return true;
        return p.item_name.toLowerCase().includes(search.toLowerCase()) ||
               p.product_sku.toLowerCase().includes(search.toLowerCase());
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            put(`/inventory/products/${editingProduct.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingProduct(null);
                    reset();
                }
            });
        } else {
            post('/inventory/products', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(`/inventory/products/${id}`);
        }
    };

    const openEdit = (product: any) => {
        setEditingProduct(product);
        setData({
            product_sku: product.product_sku,
            supplier_id: product.supplier_id || '',
            item_name: product.item_name,
            item_description: product.item_description || '',
            item_category: product.item_category || '',
            uom: product.uom,
            unit_price: product.unit_price,
            item_status: product.item_status,
        });
        setShowModal(true);
    };

    const openCreate = () => {
        setEditingProduct(null);
        reset();
        setData({
            product_sku: '',
            supplier_id: '',
            item_name: '',
            item_description: '',
            item_category: '',
            uom: 'Pieces',
            unit_price: '',
            item_status: 'Active',
        });
        setShowModal(true);
    };

    return (
        <AppLayout>
            <Head title="Materials" />

            <PageHeader 
                title="Materials" 
                subtitle="Manage inventory products"
                action={
                    <button onClick={openCreate} className="glass-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                }
            />

            <GlassCard className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search products..."
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
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">SKU</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Product</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Category</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">UOM</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Price</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Qty</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">Status</th>
                                <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product: any) => (
                                    <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4 font-mono text-sm">{product.product_sku}</td>
                                        <td className="py-3 px-4">
                                            <p className="font-medium text-slate-900">{product.item_name}</p>
                                            {product.supplier && (
                                                <p className="text-xs text-slate-500">{product.supplier.company_name}</p>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-slate-600">{product.item_category || '-'}</td>
                                        <td className="py-3 px-4 text-slate-600">{product.uom}</td>
                                        <td className="py-3 px-4">GHC {parseFloat(product.unit_price).toFixed(2)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`font-medium ${product.qty_available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                {product.qty_available}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                product.item_status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {product.item_status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button onClick={() => openEdit(product)} className="text-blue-600 hover:underline mr-3">
                                                <Pencil className="w-4 h-4 inline" />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:underline">
                                                <Trash2 className="w-4 h-4 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="py-8">
                                        <EmptyState 
                                            icon={Package}
                                            title="No products found"
                                            action={
                                                <button onClick={openCreate} className="glass-button">
                                                    <Plus className="w-4 h-4 mr-2" /> Add Product
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
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingProduct ? 'Edit Product' : 'Add Product'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">SKU *</label>
                                        <input
                                            type="text"
                                            value={data.product_sku}
                                            onChange={(e) => setData('product_sku', e.target.value)}
                                            className="glass-input w-full"
                                            required
                                            disabled={editingProduct}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Supplier</label>
                                        <select
                                            value={data.supplier_id}
                                            onChange={(e) => setData('supplier_id', e.target.value)}
                                            className="glass-input w-full"
                                        >
                                            <option value="">Select supplier</option>
                                            {(suppliers || []).map((s: any) => (
                                                <option key={s.id} value={s.id}>{s.company_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Item Name *</label>
                                    <input
                                        type="text"
                                        value={data.item_name}
                                        onChange={(e) => setData('item_name', e.target.value)}
                                        className="glass-input w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        value={data.item_description}
                                        onChange={(e) => setData('item_description', e.target.value)}
                                        className="glass-input w-full h-20"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category</label>
                                        <select
                                            value={data.item_category}
                                            onChange={(e) => setData('item_category', e.target.value)}
                                            className="glass-input w-full"
                                        >
                                            <option value="">Select category</option>
                                            {(categories || []).map((c: string) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">UOM *</label>
                                        <select
                                            value={data.uom}
                                            onChange={(e) => setData('uom', e.target.value)}
                                            className="glass-input w-full"
                                            required
                                        >
                                            {(uoms || []).map((u: string) => (
                                                <option key={u} value={u}>{u}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Unit Price (GHC) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.unit_price}
                                            onChange={(e) => setData('unit_price', e.target.value)}
                                            className="glass-input w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Status</label>
                                        <select
                                            value={data.item_status}
                                            onChange={(e) => setData('item_status', e.target.value)}
                                            className="glass-input w-full"
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Disabled">Disabled</option>
                                        </select>
                                    </div>
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