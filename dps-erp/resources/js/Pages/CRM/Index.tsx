import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader, StatusBadge, EmptyState } from '@/Components/ui';
import { Head, usePage, Link } from '@inertiajs/react';
import { Plus, Search, Pencil, Trash2, Phone, Mail, MapPin, Users } from 'lucide-react';
import { useState } from 'react';

export default function CrmIndex() {
    const { clients } = usePage().props;
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredClients = (clients?.data || []).filter((c: any) => {
        const matchSearch = !search || c.company_name.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchSearch && matchStatus;
    });

    return (
        <AppLayout>
            <Head title="Client Management" />

            <PageHeader 
                title="Client Management" 
                subtitle="Manage your client relationships"
                action={
                    <Link href="/crm/create" className="glass-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Client
                    </Link>
                }
            />

            {/* Filters */}
            <GlassCard className="mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text"
                                placeholder="Search clients..."
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
                        <option value="lead">Lead</option>
                        <option value="prospect">Prospect</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </GlassCard>

            {/* Clients Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredClients.length > 0 ? (
                    filteredClients.map((client: any) => (
                        <Link key={client.id} href={`/crm/${client.id}`}>
                            <GlassCard variant="interactive" className="h-full">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <StatusBadge status={client.status} />
                                </div>
                                <h3 className="font-semibold mb-1">{client.company_name}</h3>
                                {client.industry && (
                                    <p className="text-sm text-slate-400 mb-3">{client.industry}</p>
                                )}
                                <div className="space-y-2 text-sm">
                                    {client.email && (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Mail className="w-4 h-4" />
                                            <span className="truncate">{client.email}</span>
                                        </div>
                                    )}
                                    {client.phone && (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Phone className="w-4 h-4" />
                                            <span>{client.phone}</span>
                                        </div>
                                    )}
                                    {(client.city || client.country) && (
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <MapPin className="w-4 h-4" />
                                            <span>{[client.city, client.country].filter(Boolean).join(', ')}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-white/10">
                                    <Link href={`/crm/${client.id}/edit`} className="p-2 hover:bg-white/10 rounded transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                </div>
                            </GlassCard>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full">
                        <GlassCard>
                            <EmptyState 
                                icon={Users}
                                title="No clients found"
                                description="Start by adding your first client"
                                action={
                                    <Link href="/crm/create" className="glass-button">
                                        <Plus className="w-4 h-4 mr-2" /> Add Client
                                    </Link>
                                }
                            />
                        </GlassCard>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}