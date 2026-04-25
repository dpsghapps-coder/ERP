<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductCategory;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with('category')
            ->orderBy('created_at', 'desc')
            ->paginate(25);
        
        $categories = ProductCategory::all();
        
        return inertia('Products/Index', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function create()
    {
        $categories = ProductCategory::all();
        
        return inertia('Products/Create', ['categories' => $categories]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sku' => 'required|string|unique:products|max:50',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:physical,service,digital',
            'category_id' => 'nullable|exists:product_categories,id',
            'unit' => 'required|string|max:30',
            'is_active' => 'boolean',
        ]);

        Product::create($validated);
        
        return redirect()->route('products.index')->with('success', 'Product created successfully');
    }

    public function edit(Product $product)
    {
        $categories = ProductCategory::all();
        
        return inertia('Products/Edit', ['product' => $product, 'categories' => $categories]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'sku' => 'required|string|unique:products,sku,' . $product->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:physical,service,digital',
            'category_id' => 'nullable|exists:product_categories,id',
            'unit' => 'required|string|max:30',
            'is_active' => 'boolean',
        ]);

        $product->update($validated);
        
        return redirect()->route('products.index')->with('success', 'Product updated successfully');
    }

    public function destroy(Product $product)
    {
        $product->delete();
        
        return redirect()->route('products.index')->with('success', 'Product deleted successfully');
    }
}