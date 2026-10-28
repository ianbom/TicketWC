<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type', // general / kb
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Satu kategori memiliki banyak subcategory.
     */
    public function subCategories()
    {
        return $this->hasMany(SubCategory::class);
    }
    public function categoryRef()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function subCategoryRef()
    {
        return $this->belongsTo(SubCategory::class, 'sub_category_id');
    }
}
