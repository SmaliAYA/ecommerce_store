<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
     protected $fillable = [
        'name',
        'slug',
        'description',
        'is_active',
    ];

    // Relation : une catégorie a plusieurs produits
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
