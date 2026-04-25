<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        
        $suppliers = Supplier::when($search, function($query) use ($search) {
            $query->where('company_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        })
        ->orderBy('company_name', 'asc')
        ->paginate(25);

        return inertia('Inventory/Suppliers/Index', [
            'suppliers' => $suppliers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        Supplier::create($validated);

        return back()->with('success', 'Supplier created successfully');
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'contact_name' => 'nullable|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if (!isset($validated['is_active'])) {
            $validated['is_active'] = true;
        }

        $supplier->update($validated);

        return back()->with('success', 'Supplier updated successfully');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        
        return back()->with('success', 'Supplier deleted successfully');
    }
}