import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader } from '@/Components/ui';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Save, Plus, Trash2, Package, Tag } from 'lucide-react';
import { useState } from 'react';

export default function Settings() {
    const { uoms, categories } = usePage().props as any;
    const [activeTab, setActiveTab] = useState<'general' | 'uom' | 'categories'>('general');
    const [newUom, setNewUom] = useState('');
    const [newCategory, setNewCategory] = useState('');

    const { data, setData, post, processing } = useForm({
        company_name: 'DPS-ERP',
        company_email: 'info@dps-erp.com',
        company_phone: '',
        company_address: '',
        timezone: 'UTC',
        date_format: 'Y-m-d',
        currency: 'USD',
        fiscal_year_start: '01-01',
    });

    const handleAddUom = (e: React.FormEvent) => {
        e.preventDefault();
        if (newUom.trim()) {
            post('/admin/settings/uom', { onSuccess: () => setNewUom('') });
        }
    };

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCategory.trim()) {
            post('/admin/settings/category', { onSuccess: () => setNewCategory('') });
        }
    };

    return (
        <AppLayout>
            <Head title="Settings" />

            <div className="mb-6">
                <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Admin
                </Link>
            </div>

            <PageHeader 
                title="Settings" 
                subtitle="System configuration"
            />

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-slate-700 pb-2">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'general' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    General
                </button>
                <button
                    onClick={() => setActiveTab('uom')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'uom' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    <Package className="w-4 h-4 inline mr-2" />UOM Options
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'categories' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    <Tag className="w-4 h-4 inline mr-2" />Categories
                </button>
            </div>

            {activeTab === 'general' && (
                <div className="max-w-3xl">
                    <GlassCard className="mb-6">
                        <h2 className="text-lg font-semibold mb-4">Company Information</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Company Name</label>
                                <input type="text" value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} className="glass-input w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input type="email" value={data.company_email} onChange={(e) => setData('company_email', e.target.value)} className="glass-input w-full" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Currency</label>
                                <select value={data.currency} onChange={(e) => setData('currency', e.target.value)} className="glass-input w-full">
                                    <option value="USD">USD - US Dollar</option>
                                    <option value="GHS">GHS - Ghana Cedis</option>
                                    <option value="EUR">EUR - Euro</option>
                                </select>
                            </div>
                        </div>
                    </GlassCard>

                    <div className="flex gap-3">
                        <button className="glass-button flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save Settings
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'uom' && (
                <div className="max-w-3xl">
                    <GlassCard>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5" /> Units of Measure (UOM)
                        </h2>
                        <p className="text-sm text-slate-400 mb-4">Manage inventory UOMs.</p>
                        
                        <form onSubmit={handleAddUom} className="flex gap-2 mb-6">
                            <input type="text" value={newUom} onChange={(e) => setNewUom(e.target.value)} placeholder="New UOM" className="glass-input flex-1" />
                            <button type="submit" className="glass-button flex items-center gap-2"><Plus className="w-4 h-4" /> Add</button>
                        </form>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {(uoms || []).map((uom: any) => (
                                <div key={uom.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <span>{uom.value}</span>
                                    <Link href={`/admin/settings/uom/${uom.id}`} method="delete" as="button" className="text-red-400 hover:text-red-300">
                                        <Trash2 className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            )}

            {activeTab === 'categories' && (
                <div className="max-w-3xl">
                    <GlassCard>
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Tag className="w-5 h-5" /> Product Categories
                        </h2>
                        <p className="text-sm text-slate-400 mb-4">Manage product categories.</p>
                        
                        <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                            <input type="text" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Category" className="glass-input flex-1" />
                            <button type="submit" className="glass-button flex items-center gap-2"><Plus className="w-4 h-4" /> Add</button>
                        </form>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {(categories || []).map((cat: any) => (
                                <div key={cat.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                    <span>{cat.value}</span>
                                    <Link href={`/admin/settings/category/${cat.id}`} method="delete" as="button" className="text-red-400 hover:text-red-300">
                                        <Trash2 className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            )}
        </AppLayout>
    );
}