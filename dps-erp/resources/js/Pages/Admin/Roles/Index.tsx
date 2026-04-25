import AppLayout from '@/Layouts/AppLayout';
import { GlassCard, PageHeader, StatusBadge } from '@/Components/ui';
import { Head, usePage, Link } from '@inertiajs/react';
import { ArrowLeft, Shield, Key, Plus } from 'lucide-react';
import { useState } from 'react';

export default function RolesIndex() {
    const { roles, permissions } = usePage().props;
    const [expandedRole, setExpandedRole] = useState<number | null>(null);

    return (
        <AppLayout>
            <Head title="Roles & Permissions" />

            <div className="mb-6">
                <Link href="/admin" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back to Admin
                </Link>
            </div>

            <PageHeader 
                title="Roles & Permissions" 
                subtitle="Manage roles and their permissions"
                action={
                    <button className="glass-button flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Add Role
                    </button>
                }
            />

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Permissions Reference */}
                <GlassCard>
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5" /> Available Permissions
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {(permissions || []).map((perm: any) => (
                            <span key={perm.id} className="text-xs px-2 py-1 bg-white/10 rounded">
                                {perm.name}
                            </span>
                        ))}
                    </div>
                    {(permissions || []).length === 0 && (
                        <p className="text-slate-400">No permissions defined</p>
                    )}
                </GlassCard>

                {/* Roles */}
                {roles.map((role: any) => (
                    <GlassCard key={role.id}>
                        <div 
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">{role.name}</h3>
                                    <p className="text-sm text-slate-400">
                                        {role.permissions?.length || 0} permissions
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400">
                                {expandedRole === role.id ? '▲' : '▼'}
                            </span>
                        </div>

                        {expandedRole === role.id && (
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <h4 className="text-sm font-medium text-slate-400 mb-2">Permissions</h4>
                                {role.permissions?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {role.permissions.map((perm: any) => (
                                            <span key={perm.id} className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                                                {perm.name}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-slate-500 text-sm">No permissions assigned</p>
                                )}
                                <div className="mt-4 flex gap-2">
                                    <button className="glass-button text-sm">Edit Role</button>
                                </div>
                            </div>
                        )}
                    </GlassCard>
                ))}
            </div>
        </AppLayout>
    );
}