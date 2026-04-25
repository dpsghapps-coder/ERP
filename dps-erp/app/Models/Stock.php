<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'product_id',
        'qty_purchased',
        'date_purchased',
        'notes',
    ];

    protected $casts = [
        'qty_purchased' => 'integer',
        'date_purchased' => 'date',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(InventoryProduct::class, 'product_id');
    }

    public function resolveRouteBinding($value, $field = null)
    {
        return $this->where('id', $value)->first();
    }
}