<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'user_id',
        'transaction_id',
        'method',
        'status',
        'amount',
        'currency',
        'paid_at',
    ];

    protected $casts = [
        'paid_at' => 'datetime',
        'amount'  => 'decimal:2',
    ];

    // Un paiement appartient à une commande
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    // Un paiement appartient à un user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}