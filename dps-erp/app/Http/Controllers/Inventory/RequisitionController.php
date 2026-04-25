<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryProduct;
use App\Models\Requisition;
use Illuminate\Http\Request;

class RequisitionController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $status = $request->get('status', 'all');
        
        $requisitions = Requisition::with('product.supplier')
            ->when($search, function($query) use ($search) {
                $query->whereHas('product', function($q) use ($search) {
                    $q->where('item_name', 'like', "%{$search}%")
                      ->orWhere('product_sku', 'like', "%{$search}%");
                });
            })
            ->when($status !== 'all', function($query) use ($status) {
                $query->where('status', $status);
            })
            ->orderBy('date_requested', 'desc')
            ->paginate(25);

        $products = InventoryProduct::where('item_status', 'Active')
            ->orderBy('item_name')
            ->get();

        return inertia('Inventory/Requisition/Index', [
            'requisitions' => $requisitions,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:inventory_products,id',
            'qty_requested' => 'required|integer|min:1',
            'requested_by' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['status'] = 'pending';

        Requisition::create($validated);

        return back()->with('success', 'Requisition created successfully');
    }

    public function update(Request $request, Requisition $requisition)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'notes' => 'nullable|string',
        ]);

        $requisition->update($validated);

        return back()->with('success', 'Requisition updated successfully');
    }

    public function destroy(Requisition $requisition)
    {
        $requisition->delete();
        
        return back()->with('success', 'Requisition deleted');
    }
}
