<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkInstruction extends Model
{
    protected $fillable = [
        'category',
        'sub_category',
        'description',
        'tags',
        'file_path',
        'uploaded_by',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
