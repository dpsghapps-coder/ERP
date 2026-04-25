import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader, EmptyState } from '@/Components/ui';
import { Head, usePage, useForm } from '@inertiajs/react';
import { Plus, Search, Pencil, Trash2, Phone, Mail, MapPin, User } from 'lucide-react';
import { useState } from 'react';

export default function SuppliersIndex() {
    const { suppliers } = usePage().props as any;
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<any>(null);
    
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        address: '',
        is_active: true,
    });

    const filteredSuppliers = (suppliers?.data || []).filter((s: any) => {
        if (!search) return true;
        return s.company_name?.toLowerCase().includes(search.toLowerCase()) ||
               s.email?.toLowerCase().includes(search.toLowerCase());
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingSupplier) {
            put(`/inventory/suppliers/${editingSupplier.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingSupplier(null);
                    reset();
                }
            });
        } else {
            post('/inventory/suppliers', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                }
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this supplier?')) {
            destroy(`/inventory/suppliers/${id}`);
        }
    };

    const openEdit = (supplier: any) => {
        setEditingSupplier(supplier);
        setData({
            company_name: supplier.company_name,
            contact_name: supplier.contact_name || '',
            email: supplier.email || '',
            phone: supplier.phone || '',
            address: supplier.address || '',
            is_active: supplier.is_active,
        });
        setShowModal(true);
    };

    const openCreate = () => {
        setEditingSupplier(null);
        reset();
        setData({
            company_name: '',
            contact_name: '',
            email: '',
            phone: '',
            address: '',
            is_active: true,
        });
        setShowModal(true);
    };

    return (
        <AppLayout>
            <Head title="Suppliers" />

            <PageHeader 
                title="Suppliers" 
                subtitle="Manage your suppliers and vendors"
                action={
                    <button onClick={openCreate} className="glass-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Supplier
                    </button>
                }
            />

            <GlassCard className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text"
                        placeholder="Search suppliers..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="glass-input w-full pl-10"
                    />
                </div>
            </GlassCard>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map((supplier: any) => (
                        <GlassCard key={supplier.id} variant="interactive">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    supplier.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                    {supplier.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <h3 className="font-semibold text-slate-900">{supplier.company_name}</h3>
                            {supplier.contact_name && (
                                <p className="text-sm text-slate-500">{supplier.contact_name}</p>
                            )}
                            <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                                {supplier.email && (
                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> {supplier.email}
                                    </p>
                                )}
                                {supplier.phone && (
                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                        <Phone className="w-4 h-4" /> {supplier.phone}
                                    </p>
                                )}
                                {supplier.city && (
                                    <p className="text-sm text-slate-500 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" /> {supplier.city}
                                    </p>
                                )}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <button onClick={() => openEdit(supplier)} className="flex-1 glass-button-secondary text-sm py-2">
                                    <Pencil className="w-4 h-4 mr-1" /> Edit
                                </button>
                                <button onClick={() => handleDelete(supplier.id)} className="px-3 glass-button-secondary text-sm py-2 text-red-600 hover:bg-red-50">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </GlassCard>
                    ))
                ) : (
                    <div className="col-span-full">
                        <GlassCard>
                            <EmptyState 
                                icon={User}
                                title="No suppliers found"
                                action={
                                    <button onClick={openCreate} className="glass-button">
                                        <Plus className="w-4 h-4 mr-2" /> Add Supplier
                                    </button>
                                }
                            />
                        </GlassCard>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                        <h2 className="text-lg font-semibold mb-4">
                            {editingSupplier ? 'Edit Supplier' : 'Add Supplier'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Company Name *</label>
                                    <input
                                        type="text"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        className="glass-input w-full"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact Person</label>
                                    <input
                                        type="text"
                                        value={data.contact_name}
                                        onChange={(e) => setData('contact_name', e.target.value)}
                                        className="glass-input w-full"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="glass-input w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Phone</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="glass-input w-full"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Address</label>
                                    <textarea
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="glass-input w-full h-20"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={data.is_active}
                                            onChange={(e) => setData('is_active', e.target.checked)}
                                            className="w-4 h-4 rounded border-slate-300"
                                        />
                                        <span className="text-sm font-medium">Active Supplier</span>
                                    </label>
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