import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader } from '@/Components/ui';
import { Head, usePage, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function ProductCreate() {
    const { categories } = usePage().props;
    const { data, setData, post, processing, errors } = useForm({
        sku: '',
        name: '',
        description: '',
        type: 'physical',
        category_id: '',
        unit: 'pcs',
        is_active: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products');
    };

    return (
        <AppLayout>
            <Head title="Add Product" />

            <div className="mb-6">
                <Link href="/products" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Products
                </Link>
            </div>

            <PageHeader title="Add Product" subtitle="Create a new product or service" />

            <form onSubmit={handleSubmit}>
                <GlassCard>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">SKU *</label>
                            <input 
                                type="text"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="glass-input w-full"
                                placeholder="e.g., PROD-001"
                            />
                            {errors.sku && <p className="text-red-400 text-sm mt-1">{errors.sku}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Name *</label>
                            <input 
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="glass-input w-full"
                                placeholder="Product name"
                            />
                            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Description</label>
                            <textarea 
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="glass-input w-full h-24"
                                placeholder="Product description..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Type *</label>
                            <select 
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="glass-input w-full"
                            >
                                <option value="physical">Physical Product</option>
                                <option value="service">Service</option>
                                <option value="digital">Digital Product</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select 
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                className="glass-input w-full"
                            >
                                <option value="">Select Category</option>
                                {(categories || []).map((c: any) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Unit *</label>
                            <input 
                                type="text"
                                value={data.unit}
                                onChange={(e) => setData('unit', e.target.value)}
                                className="glass-input w-full"
                                placeholder="pcs, kg, hr, sqm"
                            />
                            {errors.unit && <p className="text-red-400 text-sm mt-1">{errors.unit}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Status</label>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="w-5 h-5 rounded bg-white/10 border-white/20"
                                />
                                <span>Active</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-white/10">
                        <Link href="/products" className="glass-button">Cancel</Link>
                        <button type="submit" disabled={processing} className="glass-button bg-white/20">
                            {processing ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </GlassCard>
            </form>
        </AppLayout>
    );
}