<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $table = "tickets";

    protected $fillable = [
        'ticket_number',
        'user_id',
        'gateway_id',
        'start_date',

        // FIELD BARU BERBASIS ID
        'category_id',
        'sub_category_id',

        // BACKUP STRING (lama)
        // 'category',
        // 'sub_category',
        // 'old_category',
        // 'old_subcategory',

        'serial_number',
        'flag',
        'alarm',
        'indication',
        'action',
        'description',
        'status',
        'created_by',
        'updated_by',
    ];



    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    // User yang membuat tiket
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // User yang terakhir mengupdate tiket
    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    // Gateway
    public function gateway()
    {
        return $this->belongsTo(Gateway::class, 'gateway_id');
    }

    // PIC (Person in Charge)
    public function pic()
    {
        return $this->belongsTo(User::class, 'pic_id');
    }
    // Ticket.php
    // public function gateway()
    // {
    //     return $this->belongsTo(Gateway::class);
    // }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function updates()
    {
        return $this->hasMany(TicketUpdate::class);
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
