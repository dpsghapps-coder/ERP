<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'sku',
        'name',
        'description',
        'type',
        'category_id',
        'unit',
        'is_active',
    ];

    protected $casts = [
        'type' => 'string',
        'is_active' => 'boolean',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class);
    }

    public function priceListItems(): HasMany
    {
        return $this->hasMany(PriceListItem::class);
    }

    public function getDefaultPriceAttribute()
    {
        return $this->priceListItems()
            ->whereHas('priceList', fn($q) => $q->where('is_default', true))
            ->first()?->unit_price ?? 0;
    }
}

class ProductCategory extends Model
{
    protected $fillable = ['name', 'parent_id'];

    public function parent(): BelongsTo
    {
        return $this->belongsTo(ProductCategory::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(ProductCategory::class, 'parent_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }
}