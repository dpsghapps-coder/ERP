<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect('/dashboard');
    }
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/crm', [\App\Http\Controllers\CrmController::class, 'index'])->name('crm.index');
    Route::get('/crm/leads', [\App\Http\Controllers\CrmLeadController::class, 'index'])->name('crm.leads');
    Route::get('/crm/reports', [\App\Http\Controllers\CrmReportController::class, 'index'])->name('crm.reports');
    Route::get('/crm/create', [\App\Http\Controllers\CrmController::class, 'create'])->name('crm.create');
    Route::post('/crm', [\App\Http\Controllers\CrmController::class, 'store'])->name('crm.store');
    Route::get('/crm/{client}', [\App\Http\Controllers\CrmController::class, 'show'])->name('crm.show');
    Route::get('/crm/{client}/edit', [\App\Http\Controllers\CrmController::class, 'edit'])->name('crm.edit');
    Route::put('/crm/{client}', [\App\Http\Controllers\CrmController::class, 'update'])->name('crm.update');
    Route::delete('/crm/{client}', [\App\Http\Controllers\CrmController::class, 'destroy'])->name('crm.destroy');
    Route::post('/crm/{client}/interactions', [\App\Http\Controllers\CrmController::class, 'logInteraction'])->name('crm.interactions');

    Route::get('/products', [\App\Http\Controllers\ProductController::class, 'index'])->name('products.index');
    Route::get('/products/create', [\App\Http\Controllers\ProductController::class, 'create'])->name('products.create');
    Route::post('/products', [\App\Http\Controllers\ProductController::class, 'store'])->name('products.store');
    Route::get('/products/{product}/edit', [\App\Http\Controllers\ProductController::class, 'edit'])->name('products.edit');
    Route::put('/products/{product}', [\App\Http\Controllers\ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [\App\Http\Controllers\ProductController::class, 'destroy'])->name('products.destroy');

    // Inventory Routes
    Route::get('/inventory/suppliers', [\App\Http\Controllers\Inventory\SupplierController::class, 'index'])->name('inventory.suppliers');
    Route::post('/inventory/suppliers', [\App\Http\Controllers\Inventory\SupplierController::class, 'store'])->name('inventory.suppliers.store');
    Route::put('/inventory/suppliers/{supplier}', [\App\Http\Controllers\Inventory\SupplierController::class, 'update'])->name('inventory.suppliers.update');
    Route::delete('/inventory/suppliers/{supplier}', [\App\Http\Controllers\Inventory\SupplierController::class, 'destroy'])->name('inventory.suppliers.destroy');

    Route::get('/inventory/products', [\App\Http\Controllers\Inventory\ProductCatalogController::class, 'index'])->name('inventory.products');
    Route::post('/inventory/products', [\App\Http\Controllers\Inventory\ProductCatalogController::class, 'store'])->name('inventory.products.store');
    Route::put('/inventory/products/{product}', [\App\Http\Controllers\Inventory\ProductCatalogController::class, 'update'])->name('inventory.products.update');
    Route::delete('/inventory/products/{product}', [\App\Http\Controllers\Inventory\ProductCatalogController::class, 'destroy'])->name('inventory.products.destroy');

    Route::get('/inventory/stock', [\App\Http\Controllers\Inventory\StockController::class, 'index'])->name('inventory.stock');
    Route::post('/inventory/stock', [\App\Http\Controllers\Inventory\StockController::class, 'store'])->name('inventory.stock.store');
    Route::put('/inventory/stock/{stock}', [\App\Http\Controllers\Inventory\StockController::class, 'update'])->name('inventory.stock.update');
    Route::delete('/inventory/stock/{stock}', [\App\Http\Controllers\Inventory\StockController::class, 'destroy'])->name('inventory.stock.destroy');

    Route::get('/inventory/requisitions', [\App\Http\Controllers\Inventory\RequisitionController::class, 'index'])->name('inventory.requisitions');
    Route::post('/inventory/requisitions', [\App\Http\Controllers\Inventory\RequisitionController::class, 'store'])->name('inventory.requisitions.store');
    Route::put('/inventory/requisitions/{requisition}', [\App\Http\Controllers\Inventory\RequisitionController::class, 'update'])->name('inventory.requisitions.update');
    Route::delete('/inventory/requisitions/{requisition}', [\App\Http\Controllers\Inventory\RequisitionController::class, 'destroy'])->name('inventory.requisitions.destroy');

    Route::get('/orders', [\App\Http\Controllers\OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/create', [\App\Http\Controllers\OrderController::class, 'create'])->name('orders.create');
    Route::post('/orders', [\App\Http\Controllers\OrderController::class, 'store'])->name('orders.store');
    Route::get('/orders/{order}', [\App\Http\Controllers\OrderController::class, 'show'])->name('orders.show');
    Route::get('/orders/{order}/edit', [\App\Http\Controllers\OrderController::class, 'edit'])->name('orders.edit');
    Route::put('/orders/{order}', [\App\Http\Controllers\OrderController::class, 'update'])->name('orders.update');
    Route::post('/orders/{order}/confirm', [\App\Http\Controllers\OrderController::class, 'confirm'])->name('orders.confirm');
    Route::post('/orders/{order}/cancel', [\App\Http\Controllers\OrderController::class, 'cancel'])->name('orders.cancel');

    Route::get('/production', [\App\Http\Controllers\ProductionController::class, 'index'])->name('production.index');
    Route::get('/production/create', [\App\Http\Controllers\ProductionController::class, 'create'])->name('production.create');
    Route::post('/production', [\App\Http\Controllers\ProductionController::class, 'store'])->name('production.store');
    Route::get('/production/{job}', [\App\Http\Controllers\ProductionController::class, 'show'])->name('production.show');
    Route::get('/production/{job}/edit', [\App\Http\Controllers\ProductionController::class, 'edit'])->name('production.edit');
    Route::put('/production/{job}', [\App\Http\Controllers\ProductionController::class, 'update'])->name('production.update');

    Route::get('/procurement', [\App\Http\Controllers\ProcurementController::class, 'index'])->name('procurement.index');
    Route::get('/procurement/create', [\App\Http\Controllers\ProcurementController::class, 'create'])->name('procurement.create');
    Route::post('/procurement', [\App\Http\Controllers\ProcurementController::class, 'store'])->name('procurement.store');
    Route::get('/procurement/{po}', [\App\Http\Controllers\ProcurementController::class, 'show'])->name('procurement.show');
    Route::get('/procurement/{po}/edit', [\App\Http\Controllers\ProcurementController::class, 'edit'])->name('procurement.edit');
    Route::put('/procurement/{po}', [\App\Http\Controllers\ProcurementController::class, 'update'])->name('procurement.update');

    Route::get('/hrm', [\App\Http\Controllers\HrmController::class, 'index'])->name('hrm.index');
    Route::get('/hrm/create', [\App\Http\Controllers\HrmController::class, 'create'])->name('hrm.create');
    Route::post('/hrm', [\App\Http\Controllers\HrmController::class, 'store'])->name('hrm.store');
    Route::get('/hrm/{employee}', [\App\Http\Controllers\HrmController::class, 'show'])->name('hrm.show');
    Route::get('/hrm/{employee}/edit', [\App\Http\Controllers\HrmController::class, 'edit'])->name('hrm.edit');
    Route::put('/hrm/{employee}', [\App\Http\Controllers\HrmController::class, 'update'])->name('hrm.update');

    Route::get('/studio', [\App\Http\Controllers\StudioController::class, 'index'])->name('studio.index');
    Route::get('/studio/create', [\App\Http\Controllers\StudioController::class, 'create'])->name('studio.create');
    Route::post('/studio', [\App\Http\Controllers\StudioController::class, 'store'])->name('studio.store');
    Route::get('/studio/{booking}', [\App\Http\Controllers\StudioController::class, 'show'])->name('studio.show');
    Route::get('/studio/{booking}/edit', [\App\Http\Controllers\StudioController::class, 'edit'])->name('studio.edit');
    Route::put('/studio/{booking}', [\App\Http\Controllers\StudioController::class, 'update'])->name('studio.update');
    Route::delete('/studio/{booking}', [\App\Http\Controllers\StudioController::class, 'destroy'])->name('studio.destroy');

    Route::get('/admin', [\App\Http\Controllers\AdminController::class, 'index'])->name('admin.index');
    Route::get('/admin/users', [\App\Http\Controllers\AdminController::class, 'users'])->name('admin.users');
    Route::get('/admin/users/create', [\App\Http\Controllers\AdminController::class, 'userCreate'])->name('admin.users.create');
    Route::post('/admin/users', [\App\Http\Controllers\AdminController::class, 'userStore'])->name('admin.users.store');
    Route::get('/admin/users/{user}/edit', [\App\Http\Controllers\AdminController::class, 'userEdit'])->name('admin.users.edit');
    Route::put('/admin/users/{user}', [\App\Http\Controllers\AdminController::class, 'userUpdate'])->name('admin.users.update');
    Route::get('/admin/roles', [\App\Http\Controllers\AdminController::class, 'roles'])->name('admin.roles');
    Route::get('/admin/settings', [\App\Http\Controllers\AdminController::class, 'settings'])->name('admin.settings');
    Route::put('/admin/settings', [\App\Http\Controllers\AdminController::class, 'settingsUpdate'])->name('admin.settings.update');
    Route::post('/admin/settings/uom', [\App\Http\Controllers\AdminController::class, 'storeUom']);
    Route::delete('/admin/settings/uom/{setting}', [\App\Http\Controllers\AdminController::class, 'deleteUom']);
    Route::post('/admin/settings/category', [\App\Http\Controllers\AdminController::class, 'storeCategory']);
    Route::delete('/admin/settings/category/{setting}', [\App\Http\Controllers\AdminController::class, 'deleteCategory']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    Route::get('/search', [\App\Http\Controllers\SearchController::class, 'search'])->name('search');
});

require __DIR__.'/auth.php';