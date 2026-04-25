import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    Users, 
    Package, 
    ShoppingCart, 
    Factory, 
    ShoppingBag, 
    UserCog, 
    Camera, 
    Settings,
    Search,
    Bell,
    Menu,
    X,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
    LogOut,
    BarChart3,
    UserPlus,
    Boxes,
    Truck,
    ClipboardList
} from 'lucide-react';

interface NavItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface CrmSubItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const enterpriseNav: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
    { name: 'Production', href: '/production', icon: Factory },
    { name: 'Procurement', href: '/procurement', icon: ShoppingBag },
    { name: 'HRM', href: '/hrm', icon: UserCog },
    { name: 'Studio', href: '/studio', icon: Camera },
];

const crmSubItems: CrmSubItem[] = [
    { name: 'Client Management', href: '/crm', icon: Users },
    { name: 'Lead Management', href: '/crm/leads', icon: UserPlus },
    { name: 'Reports', href: '/crm/reports', icon: BarChart3 },
];

const inventorySubItems: CrmSubItem[] = [
    { name: 'Suppliers', href: '/inventory/suppliers', icon: Truck },
    { name: 'Materials', href: '/inventory/products', icon: Package },
    { name: 'Stock', href: '/inventory/stock', icon: Boxes },
    { name: 'Requisition', href: '/inventory/requisitions', icon: ClipboardList },
];

const rightNavItems: NavItem[] = [
    { name: 'Admin', href: '/admin', icon: Settings },
];

const systemNav: NavItem[] = [
    { name: 'Admin', href: '/admin', icon: Settings },
];

export default function AppLayout({ children }: PropsWithChildren) {
    const user = usePage().props.auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
    const [crmDropdownOpen, setCrmDropdownOpen] = useState(false);
    const [crmSlideUpOpen, setCrmSlideUpOpen] = useState(false);
    const [inventoryDropdownOpen, setInventoryDropdownOpen] = useState(false);
    const [inventorySlideUpOpen, setInventorySlideUpOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const searchTimeoutRef = useRef<NodeJS.Timeout>();

    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const isCrmPage = currentPath.startsWith('/crm');
    const isInventoryPage = currentPath.startsWith('/inventory') || currentPath.startsWith('/products');

    // Auto-expand CRM dropdown on CRM pages
    useEffect(() => {
        if (isCrmPage) {
            setCrmDropdownOpen(true);
        }
        if (isInventoryPage) {
            setInventoryDropdownOpen(true);
        }
    }, [isCrmPage, isInventoryPage]);

    // Search handler
    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (query.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearching(true);
            try {
                const response = await fetch(`/search?q=${encodeURIComponent(query)}`);
                const data = await response.json();
                setSearchResults(data.results || []);
                setShowResults(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    // Keyboard shortcut (Ctrl+K or Cmd+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.querySelector('#global-search') as HTMLInputElement;
                searchInput?.focus();
            }
            if (e.key === 'Escape') {
                setShowResults(false);
                setSearchQuery('');
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Mobile Header */}
            <header className="lg:hidden bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-4 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <Menu className="w-5 h-5 text-slate-700" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">DP</span>
                        </div>
                        <span className="font-semibold text-lg text-slate-900">DPS-ERP</span>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button 
                        onClick={() => setRightDrawerOpen(true)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        <LayoutDashboard className="w-5 h-5 text-slate-600" />
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors relative">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center ml-1">
                        <span className="text-sm font-medium text-white">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                    </div>
                </div>
            </header>

            {/* Mobile Right Drawer */}
            {rightDrawerOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setRightDrawerOpen(false)}>
                    <div 
                        className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl p-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-white text-lg">DPS-ERP</h3>
                                    <p className="text-white/70 text-sm">Enterprise Management</p>
                                </div>
                                <button onClick={() => setRightDrawerOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-white" />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <nav className="space-y-1">
                                <Link
                                    href="/procurement"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        currentPath === '/procurement'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                    onClick={() => setRightDrawerOpen(false)}
                                >
                                    <ShoppingBag className="w-5 h-5" />
                                    <span className="font-medium">Procurement</span>
                                </Link>
                                <Link
                                    href="/hrm"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        currentPath === '/hrm'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                    onClick={() => setRightDrawerOpen(false)}
                                >
                                    <UserCog className="w-5 h-5" />
                                    <span className="font-medium">HRM</span>
                                </Link>
                                <Link
                                    href="/studio"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        currentPath === '/studio'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                    onClick={() => setRightDrawerOpen(false)}
                                >
                                    <Camera className="w-5 h-5" />
                                    <span className="font-medium">Studio</span>
                                </Link>
                                <Link
                                    href="/admin"
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        currentPath === '/admin'
                                            ? 'bg-indigo-50 text-indigo-600'
                                            : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                                    onClick={() => setRightDrawerOpen(false)}
                                >
                                    <Settings className="w-5 h-5" />
                                    <span className="font-medium">Admin</span>
                                </Link>
                            </nav>
                            
                            <div className="mt-6">
                                <p className="text-xs font-medium text-slate-400 uppercase px-4 mb-3">Quick Actions</p>
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        href="/crm/create"
                                        className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                                        onClick={() => setRightDrawerOpen(false)}
                                    >
                                        <Users className="w-5 h-5" />
                                        <span className="text-xs font-medium">Add Client</span>
                                    </Link>
                                    <Link
                                        href="/products/create"
                                        className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                                        onClick={() => setRightDrawerOpen(false)}
                                    >
                                        <Package className="w-5 h-5" />
                                        <span className="text-xs font-medium">Add Product</span>
                                    </Link>
                                    <Link
                                        href="/hrm/create"
                                        className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                                        onClick={() => setRightDrawerOpen(false)}
                                    >
                                        <UserCog className="w-5 h-5" />
                                        <span className="text-xs font-medium">Add Employee</span>
                                    </Link>
                                    <Link
                                        href="/production/create"
                                        className="flex flex-col items-center gap-2 px-3 py-3 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors"
                                        onClick={() => setRightDrawerOpen(false)}
                                    >
                                        <Factory className="w-5 h-5" />
                                        <span className="text-xs font-medium">New Job</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Slide-in Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
                    <div 
                        className="absolute left-0 top-0 bottom-0 w-64 bg-white border-r border-slate-200 p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <span className="font-semibold text-lg text-slate-900">DPS-ERP</span>
                            <button onClick={() => setMobileMenuOpen(false)}>
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <nav className="space-y-1">
                            {/* CRM Dropdown */}
                            <div className="mb-2">
                                <button
                                    onClick={() => setCrmDropdownOpen(!crmDropdownOpen)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                        isCrmPage
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Users className="w-5 h-5" />
                                        CRM
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${crmDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {crmDropdownOpen && (
                                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-3">
                                        {crmSubItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    currentPath === item.href
                                                        ? 'bg-slate-100 text-slate-900 font-medium'
                                                        : 'text-slate-500 hover:bg-slate-50'
                                                }`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <item.icon className="w-4 h-4" />
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {/* Inventory Dropdown */}
                            <div className="mb-2">
                                <button
                                    onClick={() => setInventoryDropdownOpen(!inventoryDropdownOpen)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                        isInventoryPage
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5" />
                                        Inventory
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${inventoryDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {inventoryDropdownOpen && (
                                    <div className="ml-4 mt-1 space-y-1 border-l border-slate-200 pl-3">
                                        {inventorySubItems.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                    currentPath === item.href
                                                        ? 'bg-slate-100 text-slate-900 font-medium'
                                                        : 'text-slate-500 hover:bg-slate-50'
                                                }`}
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                <item.icon className="w-4 h-4" />
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {enterpriseNav.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                        currentPath === item.href
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            ))}
                            <div className="border-t border-slate-200 my-4 pt-4">
                                <span className="text-xs text-slate-400 uppercase px-3">System</span>
                            </div>
                            {systemNav.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                        currentPath === item.href
                                            ? 'bg-slate-900 text-white'
                                            : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className={`hidden lg:flex flex-col fixed left-0 top-0 bottom-0 bg-white border-r border-slate-200 transition-all duration-200 ${
                sidebarOpen ? 'w-60' : 'w-16'
            }`}>
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">DP</span>
                        </div>
                        {sidebarOpen && <span className="font-semibold text-slate-900">DPS-ERP</span>}
                    </Link>
                    <button 
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                        <ChevronLeft className={`w-4 h-4 text-slate-500 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto scrollbar-thin py-4">
                    <div className="px-3 mb-2">
                        {sidebarOpen && <span className="text-xs text-slate-400 uppercase font-medium">Enterprise</span>}
                    </div>
                    {/* CRM Dropdown */}
                    <div className="px-3 mb-1">
                        {sidebarOpen ? (
                            <button
                                onClick={() => setCrmDropdownOpen(!crmDropdownOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                    isCrmPage
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5" />
                                    <span>CRM</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${crmDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                        ) : (
                            <Link
                                href="/crm"
                                className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                                    isCrmPage
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Users className="w-5 h-5" />
                            </Link>
                        )}
                        {crmDropdownOpen && sidebarOpen && (
                            <div className="mt-1 space-y-1">
                                {crmSubItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                            currentPath === item.href
                                                ? 'bg-slate-100 text-slate-900 font-medium'
                                                : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Inventory Dropdown */}
                    <div className="px-3 mb-1">
                        {sidebarOpen ? (
                            <button
                                onClick={() => setInventoryDropdownOpen(!inventoryDropdownOpen)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                                    isInventoryPage
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Package className="w-5 h-5" />
                                    <span>Inventory</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform ${inventoryDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                        ) : (
                            <Link
                                href="/inventory/products"
                                className={`flex items-center justify-center px-3 py-2 rounded-lg transition-colors ${
                                    isInventoryPage
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Package className="w-5 h-5" />
                            </Link>
                        )}
                        {inventoryDropdownOpen && sidebarOpen && (
                            <div className="mt-1 space-y-1">
                                {inventorySubItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                            currentPath === item.href
                                                ? 'bg-slate-100 text-slate-900 font-medium'
                                                : 'text-slate-500 hover:bg-slate-50'
                                        }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="space-y-1 px-3">
                        {enterpriseNav.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                    currentPath === item.href
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </div>
                    <div className="px-3 mt-6 mb-2">
                        {sidebarOpen && <span className="text-xs text-slate-400 uppercase font-medium">System</span>}
                    </div>
                    <div className="space-y-1 px-3">
                        {systemNav.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                    currentPath === item.href
                                        ? 'bg-slate-900 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && <span>{item.name}</span>}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* User Section */}
                <div className="p-3 border-t border-slate-200">
                    <div className={`flex items-center gap-3 ${!sidebarOpen ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-medium text-white">
                                {user?.name?.charAt(0).toUpperCase() || 'A'}
                            </span>
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{user?.name || 'Admin'}</p>
                                <p className="text-xs text-slate-500 truncate">{user?.email || 'admin@dps-erp.com'}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Desktop Header */}
            <header className="hidden lg:flex h-16 items-center justify-between px-6 bg-white border-b border-slate-200">
                <div className="flex-1"></div>
                <div className="flex-1 max-w-md mx-auto relative" ref={searchRef}>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            id="global-search"
                            type="text"
                            placeholder="Search... (Ctrl+K)"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                            className="glass-input w-full pl-10"
                        />
                    </div>
                    {/* Search Results Dropdown */}
                    {showResults && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
                            {isSearching ? (
                                <div className="p-4 text-center text-slate-400">Searching...</div>
                            ) : searchResults.length > 0 ? (
                                <div className="py-2">
                                    {searchResults.map((result, i) => (
                                        <Link
                                            key={i}
                                            href={result.href}
                                            onClick={() => {
                                                setShowResults(false);
                                                setSearchQuery('');
                                            }}
                                            className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
                                        >
                                            <div className="w-8 h-8 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-600">
                                                {result.type.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-slate-900 truncate">{result.title}</p>
                                                <p className="text-xs text-slate-400 truncate">{result.subtitle}</p>
                                            </div>
                                            <span className="text-xs text-slate-400">{result.type}</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-slate-400">No results found</div>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex-1 flex items-center justify-end gap-4">
                    <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
                        <Bell className="w-5 h-5 text-slate-600" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                    <Link 
                        href={route('logout')} 
                        method="post"
                        as="button"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 text-slate-600" />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className={`pt-16 lg:pt-0 ${sidebarOpen ? 'lg:pl-60' : 'lg:pl-16'} min-h-screen transition-all duration-200 bg-slate-100`}>
                <div className="p-4 lg:p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={usePage().url}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200/50 h-16 flex items-center justify-around px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <Link
                    href="/dashboard"
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        currentPath === '/dashboard' 
                            ? 'text-indigo-600 bg-indigo-50' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Dashboard</span>
                </Link>
                <button
                    onClick={() => setCrmSlideUpOpen(true)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        isCrmPage 
                            ? 'text-indigo-600 bg-indigo-50' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Users className="w-5 h-5" />
                    <span className="text-[10px] font-medium">CRM</span>
                </button>
                <button
                    onClick={() => setInventorySlideUpOpen(true)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        isInventoryPage 
                            ? 'text-indigo-600 bg-indigo-50' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Package className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Inventory</span>
                </button>
                <Link
                    href="/orders"
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        currentPath === '/orders' 
                            ? 'text-indigo-600 bg-indigo-50' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Orders</span>
                </Link>
                <Link
                    href="/production"
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                        currentPath === '/production' 
                            ? 'text-indigo-600 bg-indigo-50' 
                            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    <Factory className="w-5 h-5" />
                    <span className="text-[10px] font-medium">Production</span>
                </Link>
            </nav>

            {/* CRM Slide-Up Panel */}
            {crmSlideUpOpen && (
                <>
                    <div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setCrmSlideUpOpen(false)} />
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
                        <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">CRM</h3>
                                        <p className="text-xs text-slate-500">Client Management</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setCrmSlideUpOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <div className="p-4 space-y-2">
                                {crmSubItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setCrmSlideUpOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                                            currentPath === item.href
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo/25'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            currentPath === item.href ? 'bg-white/20' : 'bg-slate-100'
                                        }`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="pb-8"></div>
                        </div>
                    </div>
                </>
            )}

            {/* Inventory Slide-Up Panel */}
            {inventorySlideUpOpen && (
                <>
                    <div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setInventorySlideUpOpen(false)} />
                    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 animate-slide-up">
                        <div className="bg-white rounded-t-3xl shadow-2xl overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                                        <Package className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">Inventory</h3>
                                        <p className="text-xs text-slate-500">Stock Management</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setInventorySlideUpOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>
                            <div className="p-4 space-y-2">
                                {inventorySubItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setInventorySlideUpOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                                            currentPath === item.href
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo/25'
                                                : 'text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            currentPath === item.href ? 'bg-white/20' : 'bg-slate-100'
                                        }`}>
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                            <div className="pb-8"></div>
                        </div>
                    </div>
                </>
            )}

            {/* Mobile Content Padding */}
            <div className="lg:hidden pb-20"></div>
        </div>
    );
}