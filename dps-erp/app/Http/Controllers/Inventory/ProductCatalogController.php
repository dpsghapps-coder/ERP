<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use App\Models\InventoryProduct;
use App\Models\Supplier;
use App\Models\Setting;
use Illuminate\Http\Request;

class ProductCatalogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $status = $request->get('status', 'all');
        $category = $request->get('category', 'all');
        
        $products = InventoryProduct::with('supplier')
            ->when($search, function($query) use ($search) {
                $query->where('item_name', 'like', "%{$search}%")
                      ->orWhere('product_sku', 'like', "%{$search}%");
            })
            ->when($status !== 'all', function($query) use ($status) {
                $query->where('item_status', $status);
            })
            ->when($category !== 'all', function($query) use ($category) {
                $query->where('item_category', $category);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(25);

        $suppliers = Supplier::where('is_active', true)->orderBy('company_name')->get();
        $categories = Setting::getCategoryOptions();
        $uoms = Setting::getUomOptions();

        return inertia('Inventory/ProductCatalog/Index', [
            'products' => $products,
            'suppliers' => $suppliers,
            'categories' => $categories,
            'uoms' => $uoms,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_sku' => 'required|string|unique:inventory_products|max:50',
            'supplier_id' => 'nullable|exists:suppliers,id',
            'item_name' => 'required|string|max:255',
            'item_description' => 'nullable|string',
            'item_category' => 'nullable|string|max:100',
            'uom' => 'required|string|max:50',
            'unit_price' => 'required|numeric|min:0',
            'item_status' => 'required|in:Active,Disabled',
        ]);

        InventoryProduct::create($validated);

        return back()->with('success', 'Product created successfully');
    }

    public function update(Request $request, InventoryProduct $product)
    {
        $validated = $request->validate([
            'product_sku' => 'required|string|unique:inventory_products,product_sku,' . $product->id,
            'supplier_id' => 'nullable|exists:suppliers,id',
            'item_name' => 'required|string|max:255',
            'item_description' => 'nullable|string',
            'item_category' => 'nullable|string|max:100',
            'uom' => 'required|string|max:50',
            'unit_price' => 'required|numeric|min:0',
            'item_status' => 'required|in:Active,Disabled',
        ]);

        if ($validated['item_status'] === 'Disabled' && $product->item_status !== 'Disabled') {
            $validated['date_deactivated'] = now();
        }

        $product->update($validated);

        return back()->with('success', 'Product updated successfully');
    }

    public function destroy(InventoryProduct $product)
    {
        $product->delete();
        
        return back()->with('success', 'Product deleted successfully');
    }
}