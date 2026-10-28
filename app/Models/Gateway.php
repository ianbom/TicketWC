<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Gateway extends Model
{
    use HasFactory;

    protected $table = 'gateways';

    protected $fillable = [
        'code',      // contoh: GW01
        'name',      // contoh: Batam Gateway
        'location',  // optional
        'region',    // optional (Sumatera, Kalimantan, Jawa)
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    // Gateway punya banyak tiket
    public function tickets()
    {
        return $this->hasMany(Ticket::class, 'gateway_id');
    }
}
