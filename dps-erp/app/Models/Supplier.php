<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $fillable = [
        'company_name',
        'contact_name',
        'email',
        'phone',
        'address',
        'city',
        'country',
        'payment_terms',
        'notes',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function inventoryProducts(): HasMany
    {
        return $this->hasMany(InventoryProduct::class, 'supplier_id');
    }
}