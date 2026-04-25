<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryProduct extends Model
{
    protected $table = 'inventory_products';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'product_sku',
        'supplier_id',
        'item_name',
        'item_description',
        'item_category',
        'uom',
        'unit_price',
        'qty_available',
        'item_status',
        'date_deactivated',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'qty_available' => 'integer',
        'item_status' => 'string',
        'date_deactivated' => 'datetime',
    ];

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class, 'product_id');
    }

    public function requisitions(): HasMany
    {
        return $this->hasMany(Requisition::class, 'product_id');
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where('id', $value)->first();
    }
}