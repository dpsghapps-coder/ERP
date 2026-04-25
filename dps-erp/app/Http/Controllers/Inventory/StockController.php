<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryProduct;
use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        
        $stocks = Stock::with('product.supplier')
            ->when($search, function($query) use ($search) {
                $query->whereHas('product', function($q) use ($search) {
                    $q->where('item_name', 'like', "%{$search}%")
                      ->orWhere('product_sku', 'like', "%{$search}%");
                });
            })
            ->orderBy('date_purchased', 'desc')
            ->paginate(25);

        $products = InventoryProduct::where('item_status', 'Active')
            ->orderBy('item_name')
            ->get();

        return inertia('Inventory/Stock/Index', [
            'stocks' => $stocks,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:inventory_products,id',
            'qty_purchased' => 'required|integer|min:1',
            'date_purchased' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $stock = Stock::create($validated);

        $product = $stock->product;
        $product->increment('qty_available', $validated['qty_purchased']);

        return back()->with('success', 'Stock added successfully');
    }

    public function update(Request $request, Stock $stock)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:inventory_products,id',
            'qty_purchased' => 'required|integer|min:1',
            'date_purchased' => 'required|date',
            'notes' => 'nullable|string',
        ]);

        $oldQty = $stock->qty_purchased;
        $qtyDiff = $validated['qty_purchased'] - $oldQty;

        $stock->update($validated);

        $product = $stock->product;
        if ($qtyDiff !== 0) {
            $product->increment('qty_available', $qtyDiff);
        }

        return back()->with('success', 'Stock updated successfully');
    }

    public function destroy(Stock $stock)
    {
        $product = $stock->product;
        $product->decrement('qty_available', $stock->qty_purchased);
        
        $stock->delete();
        
        return back()->with('success', 'Stock record deleted');
    }
}